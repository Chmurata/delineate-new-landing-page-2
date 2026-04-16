import { cn } from '../../lib/cn'

export default function Container({ children, className, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[min(1200px,90vw)] px-[clamp(1.5rem,5vw,4rem)]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
