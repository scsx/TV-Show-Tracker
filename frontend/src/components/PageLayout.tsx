import React from 'react'

import { twMerge } from 'tailwind-merge'

import Text from '@/components/Text'

type PageLayoutProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  wide?: boolean
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  className,
  wide = true,
}) => {
  const widthClass = wide ? 'container' : 'w-full max-w-[900px] mx-auto pt-16'

  return (
    <div className={twMerge(`${widthClass} pt-8 pb-24`, className)}>
      <div className="pb-16">
        <Text variant="h1" as="h1">
          {title}
        </Text>
        {subtitle && (
          <Text variant="h3" as="h5">
            {subtitle}
          </Text>
        )}
      </div>
      {children}
    </div>
  )
}

export default PageLayout
