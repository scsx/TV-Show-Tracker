import React from 'react'

import { type TTMDBShow, type TTMDBShowLanguage } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { cleanUrl } from '@/lib/clean-url'

type SeasonsListProps = {
  show: TTMDBShow
}

const ShowInfo: React.FC<SeasonsListProps> = ({ show }) => {
  return (
    <div>
      <Text variant="h3" as="h3" className="mb-4">
        Info
      </Text>

      {show.homepage && (
        <div className="mb-4">
          <Text as="p" className="mb-1 font-bold">
            Site
          </Text>
          <Text as="p">
            <Hyperlink href={show.homepage} title={show.homepage} external>
              {cleanUrl(show.homepage)}
            </Hyperlink>
          </Text>
        </div>
      )}

      {show.origin_country && show.origin_country.length > 0 && (
        <div className="mb-4">
          <Text as="p" className="mb-1 font-bold">
            {show.origin_country.length === 1 ? 'Country' : 'Countries'}
          </Text>
          <Text as="p">{show.origin_country.join(', ')}</Text>
        </div>
      )}

      {show.production_companies && show.production_companies.length > 0 && (
        <div className="mb-4">
          <Text as="p" className="mb-1 font-bold">
            Production Companies
          </Text>
          <Text as="p">
            {show.production_companies
              .map((company) => company.name)
              .join(', ')}
          </Text>
        </div>
      )}

      {show.spoken_languages && show.spoken_languages.length > 0 && (
        <div className="mb-4">
          <Text as="p" className="mb-1 font-bold">
            Languages
          </Text>
          <Text as="p">
            {show.spoken_languages
              .map((lang: TTMDBShowLanguage) => lang.english_name)
              .join(', ')}
          </Text>
        </div>
      )}
    </div>
  )
}

export default ShowInfo
