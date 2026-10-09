import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl animate-count-in dark:bg-surface-darkcard">
        <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemLabel: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Konfirmasi Hapus">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Yakin ingin menghapus {itemLabel} ini? Tindakan ini tidak bisa dibatalkan.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
          Batal
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
        >
          Ya, Hapus
        </button>
      </div>
    </Modal>
  );
}
