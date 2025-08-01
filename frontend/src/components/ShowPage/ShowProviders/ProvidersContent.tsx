import React from 'react'

import { type TTMDBProvidersByCountry } from '@/types'

import Hyperlink from '@/components/Hyperlink'
// Ícones
import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

type CountryProvidersContentProps = {
  countryProviders: TTMDBProvidersByCountry
}

const ProvidersContent: React.FC<CountryProvidersContentProps> = ({
  countryProviders,
}) => {
  const hasProviders =
    countryProviders.flatrate || countryProviders.buy || countryProviders.rent

  if (!hasProviders) {
    return <Text>No watch providers found for this country.</Text>
  }

  const renderProviders = (
    type: 'flatrate' | 'buy' | 'rent',
    title: string,
  ) => {
    const providersList = countryProviders[type]
    if (!providersList || providersList.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Text as="h5" variant="paragraph">
            {title}
          </Text>
        </div>
        <ul className="grid grid-cols-5">
          {providersList.map((provider) => (
            <li key={provider.provider_id}>
              <img
                src={`${TMDB_BASE_IMAGES_URL}/w45${provider.logo_path}`}
                alt={provider.provider_name}
                className="rounded-lg"
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {renderProviders('flatrate', 'Streaming')}
      {renderProviders('buy', 'Buy')}
      {renderProviders('rent', 'Rent')}
      <Text>
        <Hyperlink href={countryProviders.link} external>
          More info on TMDb
        </Hyperlink>
      </Text>
    </div>
  )
}

export default ProvidersContent
