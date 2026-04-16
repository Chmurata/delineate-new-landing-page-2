import { cn } from '../../lib/cn'

export default function SectionHeading({ children, className, ...props }) {
  return (
    <h2
      className={cn(
        'font-heading font-bold text-text-heading',
        'text-[clamp(1.75rem,4vw,2.5rem)]',
        'leading-tight tracking-tight',
        'mb-[clamp(2rem,4vw,3rem)]',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}
