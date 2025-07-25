import React from 'react'

import { type TTMDBPersonCredit } from '@/types'

import PersonCard from '@/components/Person/PersonCard'
import Text from '@/components/Text'

type CastProps = {
  cast: TTMDBPersonCredit[]
}

const Cast: React.FC<CastProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return <Text className='pt-8 italic'>Cast not available.</Text>
  }

  return (
    <section className="mt-8">
      <Text variant="h2" as="h2" className="mb-8">
        Cast
      </Text>
      <div className="grid grid-cols-6 gap-x-4 gap-y-8">
        {cast.map((person) => (
          <PersonCard key={person.credit_id} person={person} />
        ))}
      </div>
    </section>
  )
}

export default Cast
