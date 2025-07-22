import React from 'react'

import { type TTMDBPersonDetails } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

import { cleanUrl } from '@/lib/clean-url'

type PersonBioProps = {
  bio: TTMDBPersonDetails
}

const PersonBio: React.FC<PersonBioProps> = ({ bio }) => {
  const {
    name,
    place_of_birth,
    birthday,
    also_known_as,
    imdb_id,
    profile_path,
  } = bio

  return (
    <article>
      <TMDBImage
        path={profile_path}
        size="w300"
        aspect={profile_path ? '2/3' : 'square'}
        alt={name}
        className="object-cover w-full h-auto rounded-lg shadow-md"
        usage="person"
      />
      <div className="mt-8 flex flex-col space-y-4">
        {(birthday || place_of_birth) && (
          <div>
            <Text variant="h4">Born</Text>
            <Text>
              {birthday && <span>{birthday}</span>}
              {birthday && place_of_birth && <span>, </span>}

              {place_of_birth && <span>{place_of_birth}</span>}
            </Text>
          </div>
        )}

        {imdb_id && (
          <div>
            <Text variant="h4">IMDB</Text>
            <Text as="p">
              <Hyperlink
                href={`https://www.imdb.com/name/${imdb_id}`}
                title="imdb"
                external
              >
                {cleanUrl(`https://www.imdb.com/name/${imdb_id}`)}
              </Hyperlink>
            </Text>
          </div>
        )}

        {also_known_as && also_known_as.length > 0 && (
          <div>
            <Text variant="h4">Also known as</Text>
            <ul className="list-none">
              {' '}
              {also_known_as.map((name, index) => (
                <Text as="li" key={index}>
                  {name}
                </Text>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

export default React.memo(PersonBio)
