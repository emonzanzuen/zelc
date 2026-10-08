import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { LogoMark } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const explicitRedirect = (location.state as { from?: string })?.from;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      showToast("Berhasil masuk. Selamat belajar!");
      // Kalau ada halaman tujuan eksplisit (mis. tadinya mau akses /admin/kelas lalu
      // diarahkan ke /login), hormati itu. Kalau tidak, arahkan sesuai role.
      navigate(explicitRedirect || (loggedInUser.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"));
    } catch {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credential: string) {
    try {
      const loggedInUser = await googleLogin(credential);
      showToast("Berhasil masuk dengan Google!");
      navigate(explicitRedirect || (loggedInUser.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"));
    } catch (err) {
      throw err;
    }
  }

  return (
    <Layout hideFooter>
      <div className="container-page flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
          <div className="mb-6 flex flex-col items-center text-center">
            <LogoMark size={56} />
            <h1 className="mt-3 font-heading text-2xl font-extrabold text-gray-900 dark:text-white">Masuk ke ZELC</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Lanjutkan belajar Bahasa Inggris-mu.</p>
          </div>

          <GoogleAuthButton label="Masuk dengan Google" onCredential={handleGoogle} onError={(message) => showToast(message, "error")} />

          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            atau
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-200"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" fullWidth isLoading={loading}>
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:underline">Daftar Gratis</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
