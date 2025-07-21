import React from 'react'

import { type TTMDBPersonCredit } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

interface PersonCardProps {
  person: TTMDBPersonCredit
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <Hyperlink href={`/persons/${person.id}`} variant="white" className="group">
      <div className="flex flex-col items-center text-center">
        <TMDBImage
          path={person.profile_path}
          size="w185"
          alt={person.name}
          className="w-24 h-24 rounded-full object-cover object-[50%_30%] shadow-md mb-2 border-2 border-transparent group-hover:border-primary transition-colors duration-200"
          usage="person"
          aspect="square"
        />
        <Text
          variant="h4"
          as="h5"
          className="text-lg mb-1 group-hover:text-primary leading-tight"
        >
          {person.name}
        </Text>
        {person.character && <Text color="muted">{person.character}</Text>}
      </div>
    </Hyperlink>
  )
}

export default PersonCard
