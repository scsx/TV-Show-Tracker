import React from 'react'

import { type TMDBPersonCredit } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

interface PersonCardProps {
  person: TMDBPersonCredit
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const profileImageSize = 'w185'

  const personProfileImageUrl = person.profile_path
    ? `${TMDB_BASE_IMAGES_URL}/${profileImageSize}${person.profile_path}`
    : '/images/no-poster.png'

  return (
    <Hyperlink href={`/persons/${person.id}`} variant="white" className="group">
      <div className="flex flex-col items-center text-center">
        <img
          src={personProfileImageUrl}
          alt={person.name}
          className="w-24 h-24 rounded-full object-cover shadow-md mb-2"
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
