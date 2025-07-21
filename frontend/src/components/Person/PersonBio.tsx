import React from 'react'

import { type TTMDBPersonDetails } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { cleanUrl } from '@/lib/clean-url'
import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

type PersonBioProps = {
  bio: TTMDBPersonDetails
}

const PersonBio: React.FC<PersonBioProps> = ({ bio }) => {
  const {
    name,
    biography,
    place_of_birth,
    birthday,
    also_known_as,
    imdb_id,
    profile_path,
  } = bio

  const imageSize = 'w300'
  const profileImageUrl = profile_path
    ? `${TMDB_BASE_IMAGES_URL}/${imageSize}${profile_path}`
    : '/images/no-profile-picture.png'
  console.log(also_known_as)
  return (
    <section className="flex space-x-8">
      <div className="w-1/4">
        <img
          src={profileImageUrl}
          alt={name}
          className="object-cover w-full h-auto rounded-lg shadow-md"
        />
        <div className="mt-8 flex flex-col space-y-4">
          <div>
            <Text variant="h4">Born</Text>
            <Text>
              {birthday && <span>{birthday}</span>}
              {birthday && place_of_birth && <span>, </span>}

              {place_of_birth && <span>{place_of_birth}</span>}
            </Text>
          </div>

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
              <Text variant="h4" className="mt-4">
                Also known as
              </Text>
              <ul className="list-disc list-inside text-white">
                {' '}
                {also_known_as.map((name, index) => (
                  <li key={index}>
                    {' '}
                    <Text as="span">{name}</Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {biography && (
        <Text className="w-3/4" variant="paragraphL">
          {biography}
        </Text>
      )}
    </section>
  )
}

export default React.memo(PersonBio)
