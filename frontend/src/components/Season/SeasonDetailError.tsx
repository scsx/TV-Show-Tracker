import React from 'react'
import { MdErrorOutline } from 'react-icons/md'

import Text from '@/components/Text'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type SeasonDetailErrorProps = {
  errorMessage: string | null
  onRefresh: () => void
}

const SeasonDetailError: React.FC<SeasonDetailErrorProps> = ({
  errorMessage,
  onRefresh,
}) => {
  return (
    <SheetContent className="w-1/2 sm:max-w-1/2 flex flex-col items-center justify-center text-center">
      <SheetHeader>
        <SheetTitle>
          <Text variant="h4" as="span">
            Error Loading Season
          </Text>
        </SheetTitle>
        <SheetDescription className="sr-only">
          <Text>There was an error loading the season details.</Text>
        </SheetDescription>
      </SheetHeader>
      <div className="text-6xl mb-4">
        <MdErrorOutline />
      </div>
      <pre className="mb-4 whitespace-pre-wrap">
        {errorMessage || 'Could not retrieve season information.'}
      </pre>
      <Text>Please check your internet connection or try again.</Text>
      <button onClick={onRefresh} className="mt-6">
        Try Again
      </button>
    </SheetContent>
  )
}

export default SeasonDetailError
