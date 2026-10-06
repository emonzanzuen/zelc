import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
  outline: "border-[1.5px] border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-500/10",
  ghost: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5",
  danger: "bg-danger text-white hover:bg-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-6 py-3 gap-2",
  lg: "text-base px-7 py-3.5 gap-2",
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, fullWidth, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-heading font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

interface LinkButtonProps extends BaseProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ to, variant = "primary", size = "md", fullWidth, className, children }: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-heading font-semibold transition-colors duration-150",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Link>
  );
}
