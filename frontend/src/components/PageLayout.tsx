import React from 'react'

import Text from '@/components/Text'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  containerClassName?: string
  wide?: boolean
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  containerClassName,
  wide = true,
}) => {
  const containerClasse = wide
    ? 'container'
    : 'w-full max-w-[900px] mx-auto pt-16'

  return (
    <div className={`${containerClasse} pt-8 pb-24 ${containerClassName || ''}`}>
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
