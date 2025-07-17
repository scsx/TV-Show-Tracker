import React from 'react'
import { MdErrorOutline } from 'react-icons/md'

import axios from 'axios'
import { AxiosError } from 'axios'

import Text from '@/components/Text'

type TErrorDisplayProps = {
  error: Error | AxiosError | unknown
  title?: string
}

const ErrorDisplay: React.FC<TErrorDisplayProps> = ({
  title = 'Error',
  error,
}) => {
  let displayMessage: string = 'An unexpected error occurred.'
  let displayDetails: string | undefined
  let displayTitle: string = title || 'Error'

  if (error instanceof Error) {
    displayMessage = error.message
    displayDetails = error.stack
    displayTitle = title || 'Application Error'
  } else if (axios.isAxiosError(error)) {
    if (error.response) {
      displayMessage =
        error.response.data?.error ||
        error.response.statusText ||
        error.message ||
        'Server responded with an error.'
      displayDetails = `Status: ${error.response.status}. URL: ${error.config?.url || 'N/A'}`
      displayTitle = title || `HTTP Error ${error.response.status}`
    } else if (error.request) {
      displayMessage =
        'No response received from server. Check network connection.'
      displayDetails =
        error.message || 'The request was made but no response was received.'
      displayTitle = title || 'Network Error'
    } else {
      displayMessage = error.message
      displayDetails = error.stack || 'Error setting up the request.'
      displayTitle = title || 'Request Setup Error'
    }
  } else if (typeof error === 'string') {
    displayMessage = error
    displayTitle = title || 'Information'
  } else {
    displayMessage = 'An unknown error occurred.'
    displayDetails = JSON.stringify(error)
    displayTitle = title || 'Unhandled Error Type'
  }

  return (
    <div className="flex p-8 border rounded-lg mt-16 w-[400px] h-[400px] mx-auto mb-16">
      <div className="w-[70px] text-5xl text-left">
        <MdErrorOutline />
      </div>
      <div>
        <Text variant="h3" as="h3" className="mb-8">
          {displayTitle}
        </Text>
        <pre className="mb-8 text-foreground text-wrap text-red-400">
          {displayMessage}
        </pre>
        {displayDetails && <Text variant="paragraph">{displayDetails}</Text>}
      </div>
    </div>
  )
}

export default ErrorDisplay
