import React from 'react'

import Loading from '@/components/Loading'
import Text from '@/components/Text'
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface SeasonDetailLoadingProps {
  onClose: () => void
}

const SeasonDetailLoading: React.FC<SeasonDetailLoadingProps> = () => {
  return (
    <SheetContent className="w-1/2 sm:max-w-1/2 flex items-center justify-center">
      <SheetHeader>
        <SheetTitle>
          <Text variant="h4" as="span">
            Loading Season Details
          </Text>
        </SheetTitle>
        <div className="text-center">
          <Loading />
          <Text>Please wait while we fetch the season information.</Text>
        </div>
      </SheetHeader>
    </SheetContent>
  )
}

export default SeasonDetailLoading
