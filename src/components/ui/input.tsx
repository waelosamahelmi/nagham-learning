import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-figma focus:shadow-[0_0_10px_rgba(162,89,255,0.15)]",
            error && "border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.15)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
