import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "default",
  className,
}: AvatarProps) {
  const initials = fallback
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-bg-tertiary border border-border-subtle overflow-hidden",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className="font-heading font-semibold text-text-secondary">
          {initials}
        </span>
      ) : (
        <User className="h-1/2 w-1/2 text-text-tertiary" />
      )}
    </div>
  );
}
