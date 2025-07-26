// Mocks for hooks used by LoginForm
import { useAuth } from '@/context/AuthContext'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Component to be tested
import LoginForm from '@/components/AuthForms/LoginForm'

import { usePushNotification } from '@/hooks/usePushNotification'

// --- IMPORTANT: Mocks for import.meta.env MUST come before any component imports ---
// These values will be used by LoginForm for autofill and API URL
const MOCK_TEST_USER_EMAIL = 'test@example.com'
const MOCK_TEST_USER_PASSWORD = 'password123'
const MOCK_BACKEND_URL = 'http://mockapi.com'

// Define import.meta.env on the global object for Jest's environment
// This needs to be done before any module that uses import.meta.env is loaded
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_TEST_USER_EMAIL: MOCK_TEST_USER_EMAIL,
        VITE_TEST_USER_PASSWORD: MOCK_TEST_USER_PASSWORD,
        VITE_BACKEND_URL: MOCK_BACKEND_URL,
      },
    },
  },
  writable: true, // Allow modifications
  configurable: true, // Allow redefinition
})

// Mock the context/AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock the hooks/usePushNotification
jest.mock('@/hooks/usePushNotification', () => ({
  usePushNotification: jest.fn(),
}))

// Mock the global fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('LoginForm', () => {
  const mockLogin = jest.fn()
  const mockShowToast = jest.fn()

  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    jest.clearAllMocks()

    // Reset the mock for fetch for each test
    mockFetch.mockReset()

    // Configure the default mock return values for useAuth and usePushNotification
    ;(useAuth as jest.Mock).mockReturnValue({ login: mockLogin })
    ;(usePushNotification as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    })
  })

  // --- Render Test ---
  test('renders the login form with email and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Autofill \*/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Autofill is a feature to help in dev and tests\./i),
    ).toBeInTheDocument()
  })

  // --- Validation Tests ---
  test('displays validation errors for empty fields on submit', async () => {
    render(<LoginForm />)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await act(async () => {
      fireEvent.click(loginButton)
    })

    // ASSERTIONS UPDATED: Match Zod schema error messages
    expect(screen.getByText('Invalid email address.')).toBeInTheDocument() // For empty email
    expect(screen.getByText('Password is required.')).toBeInTheDocument() // For empty password
  })

  // Test that passed:
  test('removes validation errors when fields become valid', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    // 1. Submit to show initial errors
    await act(async () => {
      fireEvent.click(loginButton)
    })
    // ASSERTIONS UPDATED: Match Zod schema error messages
    expect(screen.getByText('Invalid email address.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()

    // 2. Type valid values
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'validpassword')

    // 3. Errors should disappear after interaction (due to react-hook-form's validation triggers)
    await waitFor(() => {
      expect(
        screen.queryByText('Invalid email address.'),
      ).not.toBeInTheDocument() // ASSERTION UPDATED
      expect(
        screen.queryByText('Password is required.'),
      ).not.toBeInTheDocument()
    })
  })

  // --- Failed Submission Tests (API Error) ---
  test('displays API error message on failed login attempt', async () => {
    // Simulate a failed fetch response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'wrong@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')

    await act(async () => {
      fireEvent.click(loginButton)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockLogin).not.toHaveBeenCalled() // Should not call login on failure

      // Expect the specific error message from the backend
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      // If form.setError('root.apiError') message is displayed, you'd check for that too.
    })
  })

  test('displays generic API error message if no specific message from backend', async () => {
    // Simulate a failed fetch response without a specific message
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // Empty response or without 'message'
    })

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'wrong@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')

    await act(async () => {
      fireEvent.click(loginButton)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockLogin).not.toHaveBeenCalled()
      expect(
        screen.getByText('Login failed. Please check your credentials.'),
      ).toBeInTheDocument()
    })
  })

  // --- Failed Submission Tests (Network/Unexpected Error) ---
  test('displays network error message on unexpected error', async () => {
    // Simulate a network error (fetch rejects the promise)
    mockFetch.mockRejectedValueOnce(new Error('Network Down!'))

    // Spy on console.error to prevent it from logging during the test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    await act(async () => {
      fireEvent.click(loginButton)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockLogin).not.toHaveBeenCalled() // Should not call login on error
      expect(
        screen.getByText(
          'A network error occurred. Please check your connection or try again.',
        ),
      ).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore() // Restore the original console.error
  })

  // --- Loading State Test ---
  test('disables buttons and shows loading state during submission', async () => {
    // Simulate a pending fetch (never resolves)
    mockFetch.mockReturnValueOnce(new Promise(() => {})) // Never resolves

    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const loginButton = screen.getByRole('button', { name: /Login/i })
    const autofillButton = screen.getByRole('button', { name: /Autofill \*/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    // Click the button and check loading state
    await act(async () => {
      fireEvent.click(loginButton)
    })

    // Buttons should be disabled and text should change
    await waitFor(() => {
      expect(loginButton).toBeDisabled()
      expect(loginButton).toHaveTextContent('Logging in...')
      expect(autofillButton).toBeDisabled()
    })
  })
})
