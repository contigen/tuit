import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'

export function ButtonBlue({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        'bg-[hsl(var(--blue))] text-[hsl(var(--blue-foreground))] hover:bg-[hsl(var(--blue)/0.8)] font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
