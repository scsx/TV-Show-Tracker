import { type CSSProperties, type ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

type TextProps = {
  children: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph'
  color?: 'foreground' | 'muted' | 'primary' | 'gray'
  as?: 'p' | 'small' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  className?: string
  style?: CSSProperties
}

const textStyles = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      h1: 'text-6xl font-playfair font-bold',
      h2: 'text-3xl font-playfair font-bold',
      h3: 'text-2xl font-playfair font-bold',
      h4: 'text-xl font-playfair font-bold',
      h5: 'text-lg font-playfair font-bold',
      h6: 'uppercase text-sm tracking-wider font-tiktok font-bold',
      paragraph: 'text-sm leading-normal font-tiktok',
      small: '',
    },
    color: {
      foreground: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      gray: 'text-gray-500',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    color: 'foreground',
  },
})

export default function Text({
  children,
  variant,
  color,
  as = 'p',
  className,
  style,
}: TextProps) {
  const Component = as
  const combinedClasses = twMerge(
    textStyles({ variant, color }) + ' ' + className,
  )

  return (
    <Component className={combinedClasses} style={style}>
      {children}
    </Component>
  )
}
