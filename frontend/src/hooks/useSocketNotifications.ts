import { useEffect } from 'react'

import io from 'socket.io-client'

import { usePushNotification } from '@/hooks/usePushNotification'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

/**
 * Custom hook to manage Socket.IO connection and display real-time notifications.
 */
export const useSocketNotifications = () => {
  const { showToast } = usePushNotification()

  useEffect(() => {
    const socket = io(BACKEND_URL)

    // Listener for 'showsUpdated' event
    socket.on(
      'showsUpdated',
      (data: { message: string; timestamp: string }) => {
        const formattedTime = new Date(data.timestamp).toLocaleTimeString()

        showToast({
          title: `IO: Trending shows updated!`,
          description: `${data.message}. Checked at ${formattedTime}`,
        })
      },
    )

    // Cleanup: Disconnect socket on component unmount.
    return () => {
      socket.disconnect()
    }
  }, [])
}
