import React from 'react'
import { TfiNewWindow } from 'react-icons/tfi'

import { type TTMDBPopularPerson } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

type PersonKnowForProps = {
  knownFor: TTMDBPopularPerson['known_for']
}

const PersonKnowFor: React.FC<PersonKnowForProps> = ({ knownFor }) => {
  const posterImageSize = 'w92'

  return (
    <div className="mt-2">
      <Text variant="small" className="text-center" color="muted">
        Known for
      </Text>
      {knownFor && knownFor.length > 0 ? (
        <div className="w-full pt-2 flex gap-2">
          {knownFor.slice(0, 3).map((media) => {
            let isMovie = media.media_type === 'movie'
            const hrefUrl = isMovie
              ? `https://www.google.com/search?q=${encodeURIComponent(media.title || media.original_title || '')}+movie`
              : `/shows/${media.id}`

            const isExternalLink = isMovie

            return (
              <Hyperlink
                key={media.id}
                className="w-1/3 relative"
                href={hrefUrl}
                external={isExternalLink}
              >
                <TMDBImage
                  path={media.poster_path}
                  size={posterImageSize}
                  alt="Poster"
                  className="w-full object-cover rounded shadow-sm aspect-[2/3]"
                  usage="poster"
                  aspect="2/3"
                />
                {isMovie && <TfiNewWindow className="absolute top-1 right-1" />}
              </Hyperlink>
            )
          })}
        </div>
      ) : (
        <Text color="muted" className="mt-4 italic h-16 px-4 text-center">
          We don't know why this person is famous...
        </Text>
      )}
    </div>
  )
}

export default PersonKnowFor
