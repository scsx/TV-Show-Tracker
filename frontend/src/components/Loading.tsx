import React from 'react'
import { RiLoader4Line } from 'react-icons/ri'

import Text from '@/components/Text'

interface LoadingProps {
  message?: string
  type?: 'spinner' | 'skeleton'
  skeletonCount?: number
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  type = 'spinner',
  skeletonCount = 8,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {type === 'spinner' ? (
        <div className="relative flex items-center justify-center w-32 h-32">
          <RiLoader4Line className="text-6xl animate-spin text-muted-foreground opacity-70" />
        </div>
      ) : (
        <div className="container grid grid-cols-4 gap-8">
          {' '}
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 mt-4 w-full flex items-center space-x-4 animate-pulse"
            >
              <div className="w-24 h-24 bg-gray-700 rounded-md"></div>{' '}
              <div className="flex-1">
                <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>{' '}
                <div className="h-4 w-full bg-gray-700 rounded"></div>{' '}
                <div className="h-4 w-5/6 bg-gray-700 rounded mt-1"></div>{' '}
              </div>
            </div>
          ))}
        </div>
      )}

      <Text
        variant="paragraph"
        as="h3"
        className="text-xl mt-4 text-muted-foreground"
      >
        {message}
      </Text>
    </div>
  )
}

export default Loading
