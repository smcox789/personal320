import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:hover:bg-cyan-800 dark:hover:text-cyan-100 disabled:opacity-50 dark:focus:ring-cyan-400 disabled:pointer-events-none dark:focus:ring-offset-cyan-900 data-[state=open]:bg-cyan-100 dark:data-[state=open]:bg-cyan-800",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-900 text-black hover:bg-cyan-700 dark:bg-cyan-50 dark:text-black",
        destructive:
          "bg-red-500 text-black hover:bg-red-600 dark:hover:bg-red-600",
        outline:
          "bg-transparent border border-white hover:bg-cyan-100 dark:border-cyan-700 dark:text-black",
        subtle:
          "bg-cyan-100 text-black hover:bg-cyan-200 dark:bg-cyan-700 dark:text-black",
        ghost:
          "bg-transparent hover:bg-cyan-100 dark:hover:bg-cyan-800 dark:white dark:hover:white data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline white dark:white hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
