import React from 'react'
import { FaPeoplePulling } from 'react-icons/fa6'

import { type TTMDBPersonCredit } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type CrewProps = {
  crew: TTMDBPersonCredit[]
}

const Crew: React.FC<CrewProps> = ({ crew }) => {
  // Helper to get the most relevant role (job or department)
  const getRole = (person: TTMDBPersonCredit): string => {
    return person.job || person.department || ''
  }

  // Filter and limit crew members for inline display (e.g., Directors, Writers, Producers)
  const filteredCrew = crew.filter(
    (member) =>
      member.job === 'Director' ||
      member.job === 'Writer' ||
      member.job === 'Executive Producer' ||
      member.job === 'Creator' ||
      member.job === 'Producer' ||
      member.job === 'Screenplay',
  )

  // Optionally limit the list further for a compact inline display
  const limitedCrew = filteredCrew.slice(0, 15)

  const renderContent = () => {
    if (!crew || crew.length === 0) {
      return (
        <div className="flex items-center">
          <FaPeoplePulling className="mr-4 text-4xl text-muted-foreground" />
          <Text className="italic leading-tight" color='muted'>Crew not available.</Text>
        </div>
      )
    }

    if (limitedCrew.length === 0) {
      return <Text>No major crew members to display.</Text>
    }

    return (
      <ul>
        {limitedCrew.map((person) => (
          <Text as="li" key={person.credit_id} className="mb-1 flex">
            <Hyperlink href={`/persons/${person.id}`} variant="white">
              {person.name}
            </Hyperlink>
            ,{' '}
            {getRole(person) && (
              <Text as="span" color="muted" className="pl-1">
                {getRole(person)}
              </Text>
            )}
          </Text>
        ))}
        {limitedCrew.length < filteredCrew.length && (
          <li>
            <span className="text-gray-600">...</span>
          </li>
        )}
      </ul>
    )
  }

  return (
    <section className="py-8">
      <Text as="h3" variant="h3" className="mb-4">
        Crew
      </Text>
      {renderContent()}
    </section>
  )
}

export default Crew
