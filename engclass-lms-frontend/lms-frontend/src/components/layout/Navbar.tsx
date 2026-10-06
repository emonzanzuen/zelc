import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, ShieldCheck, User as UserIcon, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn, initials } from "@/lib/utils";
import { LogoLockup } from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/kelas", label: "Kelas" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  const ThemeToggleButton = ({ className }: { className?: string }) => (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10",
        className
      )}
    >
      <Sun size={18} className={cn("absolute transition-all", theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100")} />
      <Moon size={18} className={cn("absolute transition-all", theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0")} />
    </button>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-white/90 backdrop-blur-md transition-colors",
        scrolled && "shadow-sm dark:border-gray-800",
        "dark:bg-surface-dark/90"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between lg:h-20">
        <LogoLockup size={38} />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300"
                    : "text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-primary-300"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggleButton />
          {!user && (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                Daftar Gratis
              </Link>
            </>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                  {initials(user.name)}
                </span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-surface-darkcard">
                    <Link
                      to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      {user.role === "ADMIN" ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                      {user.role === "ADMIN" ? "Dashboard Admin" : "Dashboard Saya"}
                    </Link>
                    <Link
                      to="/profil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      <UserIcon size={16} />
                      Edit Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggleButton />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-6 pt-2 dark:border-gray-800 dark:bg-surface-dark lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-3 text-base font-semibold",
                    isActive
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            {!user && (
              <>
                <Link to="/login" className="rounded-lg border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
                  Masuk
                </Link>
                <Link to="/register" className="rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white">
                  Daftar Gratis
                </Link>
              </>
            )}
            {user && (
              <>
                <Link
                  to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  {user.role === "ADMIN" ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                  {user.role === "ADMIN" ? "Dashboard Admin" : "Dashboard Saya"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-danger hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
