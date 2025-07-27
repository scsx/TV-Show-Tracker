import React from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import PageLayout from '@/components/PageLayout'

jest.mock('@/components/Text', () => {
  return ({
    children,
    variant,
    as,
  }: {
    children: React.ReactNode
    variant: string
    as: string
  }) => <div data-testid={`${variant}-${as}`}>{children}</div>
})

describe('PageLayout', () => {
  test('renders title and children correctly', () => {
    render(
      <PageLayout title="My Page Title">
        <div>Page Content</div>
      </PageLayout>,
    )

    expect(screen.getByText('My Page Title')).toBeInTheDocument()
    expect(screen.getByTestId('h1-h1')).toHaveTextContent('My Page Title')

    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  test('renders title, subtitle, and children correctly', () => {
    render(
      <PageLayout title="My Page Title" subtitle="My Page Subtitle">
        <div>Page Content</div>
      </PageLayout>,
    )

    expect(screen.getByText('My Page Title')).toBeInTheDocument()
    expect(screen.getByTestId('h1-h1')).toHaveTextContent('My Page Title')

    expect(screen.getByText('My Page Subtitle')).toBeInTheDocument()
    expect(screen.getByTestId('h3-h5')).toHaveTextContent('My Page Subtitle')

    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  test('applies wide class by default (wide=true)', () => {
    const { container } = render(
      <PageLayout title="Test Title">
        <div>Content</div>
      </PageLayout>,
    )

    expect(container.firstChild).toHaveClass('container')
    expect(container.firstChild).not.toHaveClass(
      'w-full max-w-[900px] mx-auto pt-16',
    )
  })

  test('applies specific width classes when wide is false', () => {
    const { container } = render(
      <PageLayout title="Test Title" wide={false}>
        <div>Content</div>
      </PageLayout>,
    )

    expect(container.firstChild).toHaveClass('w-full')
    expect(container.firstChild).toHaveClass('max-w-[900px]')
    expect(container.firstChild).toHaveClass('mx-auto')
    expect(container.firstChild).toHaveClass('pt-8')
    expect(container.firstChild).not.toHaveClass('pt-16')
    expect(container.firstChild).not.toHaveClass('container')
  })

  test('applies additional className', () => {
    const { container } = render(
      <PageLayout title="Test Title" className="custom-class">
        <div>Content</div>
      </PageLayout>,
    )

    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass('container')
  })

  test('has correct basic structure', () => {
    const { container } = render(
      <PageLayout title="Test Title">
        <p>Some content</p>
      </PageLayout>,
    )

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('pt-8')
    expect(mainDiv).toHaveClass('pb-24')

    const titleElement = screen.getByTestId('h1-h1')
    const titleDiv = titleElement.parentElement as HTMLElement
    expect(titleDiv).toBeInTheDocument()
    expect(titleDiv).toHaveClass('pb-16')
  })
})
