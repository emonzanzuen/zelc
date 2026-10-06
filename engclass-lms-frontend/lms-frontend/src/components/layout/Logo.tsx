import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

// Logo bermuka karakter — punya 2 varian file (disiapkan user, sudah di-crop/scale
// supaya "zoom" keduanya seimbang): logo-light.png untuk mode terang, logo-dark.png
// untuk mode gelap. Keduanya transparan, jadi tidak perlu dibungkus kotak warna lagi.
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";
  return (
    <img
      src={src}
      alt="ZELC"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function LogoLockup({ size = 36, textClassName = "text-lg" }: { size?: number; textClassName?: string }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <LogoMark size={size} />
      <span className={cn("font-heading font-extrabold text-gray-900 dark:text-white", textClassName)}>ZELC</span>
    </Link>
  );
}
