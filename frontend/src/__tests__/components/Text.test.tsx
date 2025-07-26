import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Text from '@/components/Text'

describe('Text', () => {
  test('renders children with default paragraph variant and foreground color', () => {
    render(<Text>Hello World</Text>)
    const textElement = screen.getByText('Hello World')

    expect(textElement).toBeInTheDocument()
    expect(textElement.tagName).toBe('P')
    expect(textElement).toHaveClass('text-sm')
    expect(textElement).toHaveClass('text-foreground')
  })

  test('renders with the correct HTML tag when "as" prop is specified', () => {
    render(<Text as="h1">Main Title</Text>)
    const headingElement = screen.getByRole('heading', {
      level: 1,
      name: 'Main Title',
    })

    expect(headingElement).toBeInTheDocument()
    expect(headingElement.tagName).toBe('H1')
  })

  test('renders as a span element', () => {
    render(<Text as="span">Span Text</Text>)
    const spanElement = screen.getByText('Span Text')

    expect(spanElement).toBeInTheDocument()
    expect(spanElement.tagName).toBe('SPAN')
  })

  test('applies correct classes for h3 variant', () => {
    render(<Text variant="h3">Section Title</Text>)
    const textElement = screen.getByText('Section Title')

    expect(textElement).toHaveClass('text-2xl')
    expect(textElement).toHaveClass('font-playfair')
    expect(textElement).toHaveClass('font-bold')
  })

  test('applies correct classes for small variant', () => {
    render(<Text variant="small">Small note</Text>)
    const textElement = screen.getByText('Small note')

    expect(textElement).toHaveClass('text-xs')
    expect(textElement).toHaveClass('leading-normal')
    expect(textElement).toHaveClass('font-jakarta')
  })

  test('applies correct classes for primary color', () => {
    render(<Text color="primary">Primary Text</Text>)
    const textElement = screen.getByText('Primary Text')

    expect(textElement).toHaveClass('text-primary')
    expect(textElement).not.toHaveClass('text-foreground')
  })

  test('combines variant, color, and className correctly', () => {
    render(
      <Text variant="h2" color="muted" className="custom-class-foo">
        Complex Text
      </Text>,
    )
    const textElement = screen.getByText('Complex Text')

    expect(textElement).toHaveClass('text-4xl')
    expect(textElement).toHaveClass('text-muted-foreground')
    expect(textElement).toHaveClass('custom-class-foo')
  })

  test('twMerge correctly resolves conflicting classes', () => {
    render(
      <Text variant="h2" className="text-xl">
        Conflicting Classes
      </Text>,
    )
    const textElement = screen.getByText('Conflicting Classes')

    expect(textElement).toHaveClass('text-xl')
    expect(textElement).not.toHaveClass('text-4xl')
  })

  test('applies inline styles passed via style prop', () => {
    render(<Text style={{ marginTop: '10px', color: 'red' }}>Styled Text</Text>)
    const textElement = screen.getByText('Styled Text')

    expect(textElement).toHaveStyle('margin-top: 10px')
    expect(textElement).toHaveStyle('color: rgb(255, 0, 0)')
  })
})
