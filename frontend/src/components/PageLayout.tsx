import React from 'react'

import Text from '@/components/Text'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  containerClassName?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  containerClassName,
}) => {
  return (
    <div className={`container py-8 ${containerClassName || ''}`}>
      <Text variant="h1">{title}</Text>
      {subtitle && (
        <Text variant="h3" className="mb-16">
          {subtitle}
        </Text>
      )}
      {children}
    </div>
  )
}

export default PageLayout
