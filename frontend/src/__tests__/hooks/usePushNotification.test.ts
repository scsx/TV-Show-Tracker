import { act, renderHook } from '@testing-library/react'
import { toast } from 'sonner'

import { usePushNotification } from '@/hooks/usePushNotification'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(() => 'mock-toast-id'),
    dismiss: jest.fn(),
  },
}))

const mockToastSuccess = toast.success as jest.Mock
const mockToastDismiss = toast.dismiss as jest.Mock

describe('usePushNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  test('should show a toast notification without redirect', () => {
    const { result } = renderHook(() => usePushNotification())

    act(() => {
      result.current.showToast({
        title: 'Success!',
        description: 'Operation completed successfully.',
      })
    })

    expect(mockToastSuccess).toHaveBeenCalledTimes(1)
    expect(mockToastSuccess).toHaveBeenCalledWith('Success!', {
      description: 'Operation completed successfully.',
      duration: 3000,
      classNames: {
        toast: 'u-toast-success',
        title: 'text-base font-bold',
        description: '!text-[#272b30]',
      },
    })

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockToastDismiss).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(3001)
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('should show a toast notification and redirect after delay', () => {
    const { result } = renderHook(() => usePushNotification())
    const redirectPath = '/dashboard'
    const redirectDelay = 2000

    act(() => {
      result.current.showToast({
        title: 'Redirecting...',
        description: 'You will be redirected shortly.',
        redirectPath: redirectPath,
        redirectDelay: redirectDelay,
      })
    })

    expect(mockToastSuccess).toHaveBeenCalledTimes(1)
    expect(mockToastSuccess).toHaveBeenCalledWith(
      'Redirecting...',
      expect.objectContaining({
        duration: redirectDelay,
      }),
    )

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockToastDismiss).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(redirectDelay - 1)
    })
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockToastDismiss).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(redirectPath)

    expect(mockToastDismiss).toHaveBeenCalledTimes(1)
    expect(mockToastDismiss).toHaveBeenCalledWith('mock-toast-id')
  })

  test('should use default redirectDelay if not provided with redirectPath', () => {
    const { result } = renderHook(() => usePushNotification())
    const redirectPath = '/settings'

    act(() => {
      result.current.showToast({
        title: 'Notice',
        description: 'Using default delay.',
        redirectPath: redirectPath,
      })
    })

    expect(mockToastSuccess).toHaveBeenCalledWith(
      'Notice',
      expect.objectContaining({
        duration: 3000,
      }),
    )

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(redirectPath)
    expect(mockToastDismiss).toHaveBeenCalledTimes(1)
  })
})
