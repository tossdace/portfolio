import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070b] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border border-cyan-200/50 bg-cyan-200 text-[#031015] shadow-[0_0_24px_rgba(103,232,249,0.24)] hover:bg-white",
        secondary:
          "border border-white/15 bg-white/7 text-white hover:border-cyan-200/50 hover:bg-white/12",
        ghost:
          "border border-transparent bg-transparent text-white/75 hover:bg-white/8 hover:text-white",
        danger:
          "border border-red-300/40 bg-red-400/12 text-red-100 hover:bg-red-400/20",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        default: "min-h-11 px-4",
        lg: "min-h-12 px-5 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
