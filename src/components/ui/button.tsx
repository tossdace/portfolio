import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00FF88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080A] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "border border-[#00FF88]/40 bg-[#00FF88] text-[#06080A] font-bold shadow-[0_0_20px_rgba(0,255,136,0.28)] hover:bg-[#6CFFB2] hover:shadow-[0_0_30px_rgba(0,255,136,0.48)] hover:border-[#00FF88]",
        secondary:
          "border border-[rgba(0,255,136,0.22)] bg-[rgba(18,25,22,0.65)] backdrop-blur-md text-[#6CFFB2] hover:border-[#00FF88]/60 hover:bg-[rgba(0,255,136,0.12)] hover:text-[#00FF88] hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]",
        ghost:
          "border border-transparent bg-transparent text-[#6CFFB2]/80 hover:bg-[rgba(0,255,136,0.08)] hover:text-[#00FF88] hover:border-[rgba(0,255,136,0.2)]",
        danger:
          "border border-emerald-500/30 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:border-emerald-400",
      },
      size: {
        sm: "min-h-9 px-3 text-xs rounded-lg",
        default: "min-h-11 px-4.5 rounded-xl",
        lg: "min-h-12 px-6 text-base rounded-2xl",
        icon: "size-11 p-0 rounded-xl",
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
  pixelAccents?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, pixelAccents = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          pixelAccents && "group/btn",
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
