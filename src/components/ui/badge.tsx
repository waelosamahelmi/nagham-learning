import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-figma/15 text-figma border border-figma/20",
        secondary: "bg-bg-tertiary text-text-secondary border border-border-subtle",
        figma: "bg-figma/15 text-figma border border-figma/20",
        photoshop: "bg-photoshop/15 text-photoshop border border-photoshop/20",
        illustrator: "bg-illustrator/15 text-illustrator border border-illustrator/20",
        graphic: "bg-graphic/15 text-graphic border border-graphic/20",
        blender: "bg-blender/15 text-blender border border-blender/20",
        ai: "bg-ai/15 text-ai border border-ai/20",
        coding: "bg-coding/15 text-coding border border-coding/20",
        xp: "bg-xp-gold/15 text-xp-gold border border-xp-gold/20",
        streak: "bg-streak-fire/15 text-streak-fire border border-streak-fire/20",
        success: "bg-level-up/15 text-level-up border border-level-up/20",
        destructive: "bg-red-500/15 text-red-400 border border-red-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
