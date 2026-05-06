import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-branding text-white hover:opacity-90 rounded-3xl",
        destructive:
          "bg-destructive text-white hover:opacity-90 rounded-3xl focus-visible:ring-destructive/50",
        outline:
          "border-2 border-branding bg-transparent text-branding hover:bg-branding hover:text-white rounded-3xl transition-colors",
        secondary:
          "bg-branding-dark text-white hover:opacity-90 rounded-3xl",
        ghost:
          "hover:bg-accent/10 hover:text-accent rounded-md",
        link: "text-branding underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-1 md:px-6 md:py-2 text-xs md:text-sm",
        sm: "px-3 py-1 text-[10px] md:text-xs",
        lg: "px-6 py-2 md:px-8 md:py-3 text-sm md:text-base",
        icon: "size-9 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
