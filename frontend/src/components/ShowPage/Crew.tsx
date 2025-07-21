import React from 'react'

import { type TTMDBPersonCredit } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type CrewProps = {
  crew: TTMDBPersonCredit[]
}

const Crew: React.FC<CrewProps> = ({ crew }) => {
  if (!crew || crew.length === 0) {
    return <Text className='py-8 italic'>Crew not available.</Text>
  }

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

  return (
    <section className="py-8">
      <Text variant="h2" as="h2" className="mb-8">
        Crew
      </Text>
      {limitedCrew.length === 0 ? (
        <Text>No major crew members to display.</Text>
      ) : (
        <ul>
          {limitedCrew.map((person) => (
            <Text as="li" key={person.credit_id} className="flex mb-1">
              <Hyperlink href={`/persons/${person.id}`} variant="white">
                {person.name}
              </Hyperlink>
              ,{' '}
              {getRole(person) && (
                <Text color="muted" as="span" className="pl-1">
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
      )}
    </section>
  )
}

export default Crew
