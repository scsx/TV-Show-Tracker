/**
 * TODO: Expand
 */
import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import App from '../App'

describe('App Component', () => {
  /* test('renders welcome message', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    const linkElement = screen.getByText(/Welcome to My App!/i)
    expect(linkElement).toBeInTheDocument()
  }) */

  test('renders another element (example)', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
  })
})
