import { useNavigate } from 'react-router-dom'

import { toast } from 'sonner'

/**
 * Hook to push a notification and redirect, if a url is provided.
 */

type ToastOptions = {
  title: string
  description: string
  redirectPath?: string
  redirectDelay?: number
}

export const usePushNotification = () => {
  const navigate = useNavigate()

  const showSuccessToast = ({
    title,
    description,
    redirectPath,
    redirectDelay = 3000,
  }: ToastOptions) => {
    const toastId = toast.success(title, {
      description: description,
      duration: redirectDelay,
      classNames: {
        toast: 'u-toast-success',
        title: 'text-base font-bold',
        description: '!text-[#272b30]',
      },
    })

    if (redirectPath) {
      setTimeout(() => {
        navigate(redirectPath)
        toast.dismiss(toastId)
      }, redirectDelay)
    }
  }

  return { showSuccessToast }
}
