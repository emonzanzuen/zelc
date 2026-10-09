// Database tiruan di memori untuk menguji seed.ts TANPA Prisma/PostgreSQL.
// Membaca schema.prisma asli dan menegakkan: kolom valid, tipe, @default, @id/@unique/@@unique,
// foreign key (harus ada saat create/update), serta onDelete (Restrict default / Cascade).
// Hanya mengimplementasikan method Prisma yang dipakai seed.ts.

import crypto from 'crypto';
import { parseSchema, type Model, type Field } from './schema-parser';

type Row = Record<string, any>;
const SCALARS = new Set(['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json']);

export function createFakePrisma(schemaText: string) {
  const { models, enums } = parseSchema(schemaText);
  const tables = new Map<string, Row[]>([...models.keys()].map((n) => [n, []]));
  const queryLog: string[] = [];

  const clone = <T,>(v: T): T =>
    v instanceof Date ? (new Date(v) as unknown as T)
    : Array.isArray(v) ? (v.map(clone) as unknown as T)
    : v && typeof v === 'object' ? (Object.fromEntries(Object.entries(v as Row).map(([k, x]) => [k, clone(x)])) as T)
    : v;

  const scalars = (m: Model): Field[] =>
    [...m.fields.values()].filter((f) => !f.list && (SCALARS.has(f.type) || enums.has(f.type)));

  const uniqueGroups = (m: Model): string[][] => [
    ...[...m.fields.values()].filter((f) => f.isId || f.unique).map((f) => [f.name]),
    ...m.uniques,
  ];

  const fail = (msg: string): never => { throw new Error(`[fake-prisma] ${msg}`); };

  function defaultValue(m: Model, f: Field): unknown {
    const e = f.defaultExpr?.trim();
    if (e === undefined) return f.optional ? null : fail(`${m.name}.${f.name} wajib diisi (tanpa default)`);
    if (e === 'now()') return new Date();
    if (e === 'uuid()') return crypto.randomUUID();
    if (e === 'true') return true;
    if (e === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
    const str = /^"(.*)"$/.exec(e);
    if (str) return str[1];
    if (enums.get(f.type)?.includes(e)) return e;
    return fail(`default tidak dikenal untuk ${m.name}.${f.name}: ${e}`);
  }

  function validate(m: Model, row: Row) {
    const names = new Set(scalars(m).map((f) => f.name));
    for (const k of Object.keys(row)) if (!names.has(k)) fail(`${m.name}: kolom/argumen tidak dikenal "${k}"`);
    for (const f of scalars(m)) {
      const v = row[f.name];
      if (v === null || v === undefined) { if (!f.optional) fail(`${m.name}.${f.name} tidak boleh null`); continue; }
      const t = f.type;
      const good = t === 'String' ? typeof v === 'string' : t === 'Int' ? Number.isInteger(v) : t === 'Float' ? typeof v === 'number'
        : t === 'Boolean' ? typeof v === 'boolean' : t === 'DateTime' ? v instanceof Date && !isNaN(v.getTime()) : t === 'Json' ? true
        : enums.get(t)!.includes(v);
      if (!good) fail(`${m.name}.${f.name} bertipe salah (${t}): ${String(v)}`);
    }
  }

  function checkUnique(m: Model, row: Row, self?: Row) {
    for (const cols of uniqueGroups(m)) {
      if (cols.some((c) => row[c] == null)) continue;
      const clash = tables.get(m.name)!.find((r) => r !== self && cols.every((c) => sameValue(r[c], row[c])));
      if (clash) fail(`Unique constraint ${m.name}(${cols.join(', ')}) dilanggar: ${cols.map((c) => String(row[c])).join(', ')}`);
    }
  }

  function checkFk(m: Model, row: Row) {
    for (const f of m.fields.values()) {
      if (!f.relation) continue;
      const fk = f.relation.fields[0];
      if (row[fk] == null) continue;
      if (!tables.get(f.type)!.some((r) => r[f.relation!.references[0]] === row[fk])) fail(`FK ${m.name}.${fk}=${row[fk]} tidak menunjuk ke ${f.type} manapun`);
    }
  }

  const sameValue = (a: unknown, b: unknown) => (a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() : a === b);

  /** Ubah `where` unik (termasuk compound seperti userId_courseId) menjadi pasangan kolom=nilai. */
  function uniqueWhere(m: Model, where: Row): Row {
    const out: Row = {};
    for (const [k, v] of Object.entries(where)) {
      const compound = m.uniques.find((cols) => cols.join('_') === k);
      if (compound) Object.assign(out, v as Row);
      else out[k] = v;
    }
    const keys = Object.keys(out);
    const ok = uniqueGroups(m).some((cols) => cols.length === keys.length && cols.every((c) => keys.includes(c)));
    if (!ok) fail(`where {${Object.keys(where).join(', ')}} bukan kunci unik pada ${m.name}`);
    return out;
  }

  function matches(row: Row, where: Row = {}): boolean {
    return Object.entries(where).every(([k, cond]) => {
      if (cond && typeof cond === 'object' && !(cond instanceof Date)) {
        if ('in' in (cond as Row)) return ((cond as Row).in as unknown[]).includes(row[k]);
        if ('gte' in (cond as Row) || 'lt' in (cond as Row)) fail('operator range belum didukung fake');
        fail(`operator where tidak didukung untuk ${k}`);
      }
      return sameValue(row[k], cond);
    });
  }

  function create(m: Model, data: Row): Row {
    const row: Row = {};
    validateKeys(m, data);
    for (const f of scalars(m)) row[f.name] = data[f.name] !== undefined ? clone(data[f.name]) : defaultValue(m, f);
    validate(m, row);
    checkUnique(m, row);
    checkFk(m, row);
    tables.get(m.name)!.push(row);
    return row;
  }
  const validateKeys = (m: Model, data: Row) => {
    const names = new Set(scalars(m).map((f) => f.name));
    for (const k of Object.keys(data)) if (!names.has(k)) fail(`${m.name}: argumen tidak dikenal "${k}"`);
  };

  function update(m: Model, row: Row, data: Row): Row {
    validateKeys(m, data);
    const next = { ...row };
    for (const [k, v] of Object.entries(data)) if (v !== undefined) next[k] = clone(v);
    validate(m, next);
    checkUnique(m, next, row);
    checkFk(m, next);
    Object.assign(row, next);
    return row;
  }

  function remove(m: Model, rows: Row[]) {
    for (const row of rows) {
      for (const other of models.values()) {
        for (const f of other.fields.values()) {
          if (f.type !== m.name || !f.relation) continue;
          const fk = f.relation.fields[0];
          const children = tables.get(other.name)!.filter((r) => r[fk] === row[f.relation!.references[0]]);
          if (!children.length) continue;
          if (f.relation.onDelete === 'Cascade') remove(other, children);
          else fail(`Hapus ${m.name}(${row.id}) ditolak FK: masih dirujuk ${children.length} baris ${other.name}.${fk}`);
        }
      }
      const t = tables.get(m.name)!;
      const i = t.indexOf(row);
      if (i >= 0) t.splice(i, 1);
    }
  }

  const delegate = (m: Model) => ({
    findUnique: async ({ where }: { where: Row }) => { const w = uniqueWhere(m, where); const r = tables.get(m.name)!.find((x) => matches(x, w)); return r ? clone(r) : null; },
    findFirst: async ({ where }: { where?: Row } = {}) => { const r = tables.get(m.name)!.find((x) => matches(x, where)); return r ? clone(r) : null; },
    findMany: async ({ where, select }: { where?: Row; select?: Row } = {}) =>
      tables.get(m.name)!.filter((x) => matches(x, where)).map((x) => (select ? Object.fromEntries(Object.keys(select).map((k) => [k, clone(x[k])])) : clone(x))),
    count: async ({ where }: { where?: Row } = {}) => tables.get(m.name)!.filter((x) => matches(x, where)).length,
    create: async ({ data }: { data: Row }) => clone(create(m, data)),
    createMany: async ({ data }: { data: Row[] }) => { for (const d of data) create(m, d); return { count: data.length }; },
    update: async ({ where, data }: { where: Row; data: Row }) => {
      const w = uniqueWhere(m, where);
      const r = tables.get(m.name)!.find((x) => matches(x, w));
      if (!r) fail(`${m.name}.update: baris tidak ditemukan`);
      return clone(update(m, r!, data));
    },
    upsert: async ({ where, update: upd, create: crt }: { where: Row; update: Row; create: Row }) => {
      const w = uniqueWhere(m, where);
      const r = tables.get(m.name)!.find((x) => matches(x, w));
      return clone(r ? update(m, r, upd) : create(m, crt));
    },
    deleteMany: async ({ where }: { where?: Row } = {}) => { const rows = tables.get(m.name)!.filter((x) => matches(x, where)); remove(m, rows); return { count: rows.length }; },
  });

  const client: Record<string, unknown> = { $disconnect: async () => undefined };
  for (const m of models.values()) client[m.name[0].toLowerCase() + m.name.slice(1)] = delegate(m);

  return {
    client: client as any,
    tables,
    queryLog,
    insertRaw: (model: string, row: Row) => create(models.get(model)!, row),
  };
}
