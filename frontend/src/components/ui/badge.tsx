import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground border-border/50 bg-background/50 backdrop-blur-sm",
        // Custom vibrant variants
        growth: "border-transparent bg-growth/10 text-growth hover:bg-growth/20 border border-growth/20",
        star: "border-transparent bg-star/10 text-star hover:bg-star/20 border border-star/20",
        hot: "border-transparent bg-hot/10 text-hot hover:bg-hot/20 border border-hot/20",
        glass: "border-white/10 bg-white/5 text-foreground hover:bg-white/10 backdrop-blur-md shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
