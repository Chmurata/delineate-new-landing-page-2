import { useState } from 'react'
import { cn } from '../../lib/cn'
import { glassCardStyle, glassHoverStyle, glassRestStyle } from '../../lib/glass'

export default function GlassCard({
  children,
  className,
  accent = '#7C9ED9',
  hover = true,
  as: Tag = 'div',
  style: styleProp,
  ...props
}) {
  const [hovered, setHovered] = useState(false)

  const dynamicStyle = {
    ...glassCardStyle(accent),
    ...(hover && hovered ? glassHoverStyle(accent) : {}),
    ...styleProp,
  }

  return (
    <Tag
      className={cn('rounded-2xl', className)}
      style={dynamicStyle}
      onMouseEnter={hover ? () => setHovered(true) : undefined}
      onMouseLeave={hover ? () => setHovered(false) : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
