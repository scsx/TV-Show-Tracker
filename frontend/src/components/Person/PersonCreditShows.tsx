import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'

interface PersonCreditShowsProps {
  tvShows: TTMDBPersonCombinedCredit[]
}

const PersonCreditShows: React.FC<PersonCreditShowsProps> = ({ tvShows }) => {
  if (tvShows.length === 0) {
    return <Text as="p">No TV show credits found.</Text>
  }

  const sortByDate = (
    a: TTMDBPersonCombinedCredit,
    b: TTMDBPersonCombinedCredit,
  ) => {
    const dateA = a.first_air_date ? new Date(a.first_air_date) : new Date(0)
    const dateB = b.first_air_date ? new Date(b.first_air_date) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  }

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-8">
      {tvShows.sort(sortByDate).map((credit) => (
        <ShowCard key={credit.credit_id} show={credit} isPersonCredit={true} />
      ))}
    </div>
  )
}

export default React.memo(PersonCreditShows)
