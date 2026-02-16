import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-3 text-base font-medium text-[hsl(var(--foreground))] ring-offset-background placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

const SelectOption = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <option
        className={cn(
          "py-2 px-3",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
SelectOption.displayName = "SelectOption"

export { Select, SelectOption }
