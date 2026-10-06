import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { LinkButton } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10">
          <Compass size={26} className="text-primary-600" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-extrabold text-gray-900 dark:text-white">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.</p>
        <LinkButton to="/" className="mt-6">Kembali ke Beranda</LinkButton>
        <Link to="/kelas" className="mt-3 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">atau lihat katalog kelas</Link>
      </div>
    </Layout>
  );
}
