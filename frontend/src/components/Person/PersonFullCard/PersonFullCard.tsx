import React from 'react'
import { MdOutlineShowChart } from 'react-icons/md'

import { type TTMDBPopularPerson } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import PersonKnowFor from '@/components/Person/PersonFullCard/PersonKnowFor'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

interface PersonFullCardProps {
  person: TTMDBPopularPerson
}

const PersonFullCard: React.FC<PersonFullCardProps> = ({ person }) => {
  return (
    <div className="flex flex-col border-8 border-muted bg-muted">
      <Hyperlink
        href={`/persons/${person.id}`}
        variant="white"
        className="grow flex flex-col items-center text-center group"
      >
        <figure className="relative w-full">
          <TMDBImage
            path={person.profile_path}
            size="h632"
            alt={person.name}
            className="w-full aspect-square object-cover object-[50%_30%] mb-2 transition-transform duration-300 ease-in-out group-hover:scale-105"
            usage="person"
            aspect="square"
          />
          <Text
            color="primary"
            className="absolute top-2 right-2 flex items-center space-x-1 bg-darkblue py-1 px-2 rounded-sm"
          >
            <MdOutlineShowChart className="text-lg" />
            <span className="text-xs">{person.popularity.toFixed(2)}</span>
          </Text>
        </figure>
        <Text
          variant="h2"
          as="h3"
          className="mb-1 group-hover:text-primary leading-none"
        >
          {person.name}
        </Text>
      </Hyperlink>
      <PersonKnowFor knownFor={person.known_for} />
    </div>
  )
}

export default PersonFullCard
