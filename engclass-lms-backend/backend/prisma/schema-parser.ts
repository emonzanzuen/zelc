// Parser sederhana untuk prisma/schema.prisma — dipakai skrip verifikasi & pengujian penulis seed.
// (Bukan parser Prisma lengkap; cukup untuk model/enum/@id/@unique/@@unique/@default/@relation di proyek ini.)

export interface Field {
  name: string;
  type: string;
  optional: boolean;
  list: boolean;
  hasDefault: boolean;
  defaultExpr?: string;
  isId: boolean;
  unique: boolean;
  relation?: { fields: string[]; references: string[]; onDelete?: string };
}
export interface Model { name: string; fields: Map<string, Field>; uniques: string[][] }

export function parseSchema(text: string) {
  const enums = new Map<string, string[]>();
  for (const m of text.matchAll(/enum\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    enums.set(m[1], m[2].split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).map((l) => l.split(/\s+/)[0]));
  }
  const models = new Map<string, Model>();
  for (const m of text.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const model: Model = { name: m[1], fields: new Map(), uniques: [] };
    for (const raw of m[2].split('\n')) {
      const line = raw.replace(/\/\/.*$/, '').trim();
      if (!line) continue;
      if (line.startsWith('@@unique')) {
        model.uniques.push(/\[([^\]]+)\]/.exec(line)![1].split(',').map((s) => s.trim()));
        continue;
      }
      if (line.startsWith('@@')) continue;
      const f = /^(\w+)\s+(\w+)(\?|\[\])?\s*(.*)$/.exec(line);
      if (!f) continue;
      const rel = /@relation\(([^)]*)\)/.exec(f[4]);
      const relFields = rel ? /fields:\s*\[([^\]]+)\]/.exec(rel[1]) : null;
      const relRefs = rel ? /references:\s*\[([^\]]+)\]/.exec(rel[1]) : null;
      const onDelete = rel ? /onDelete:\s*(\w+)/.exec(rel[1]) : null;
      const def = /@default\(((?:[^()]|\([^)]*\))*)\)/.exec(f[4]);
      model.fields.set(f[1], {
        name: f[1], type: f[2], optional: f[3] === '?', list: f[3] === '[]',
        hasDefault: !!def, defaultExpr: def?.[1], isId: /@id\b/.test(f[4]), unique: /@unique\b/.test(f[4]),
        relation: relFields && relRefs
          ? { fields: relFields[1].split(',').map((s) => s.trim()), references: relRefs[1].split(',').map((s) => s.trim()), onDelete: onDelete?.[1] }
          : undefined,
      });
    }
    models.set(model.name, model);
  }
  return { enums, models };
}
