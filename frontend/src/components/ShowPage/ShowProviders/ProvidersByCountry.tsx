import React, { useEffect, useState } from 'react'
import { MdOutlineTvOff } from 'react-icons/md'

import {
  type TTMDBProvidersByCountry,
  type TTMDBWatchProvidersResponse,
} from '@/types'

import ProvidersContent from '@/components/ShowPage/ShowProviders/ProvidersContent'
import Text from '@/components/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ProvidersByCountryProps = {
  providers: TTMDBWatchProvidersResponse
}

const ProvidersByCountry: React.FC<ProvidersByCountryProps> = ({
  providers,
}) => {
  const [activeCountry, setActiveCountry] = useState<string | null>(null)

  const availableCountries = Object.keys(providers.results).sort()

  useEffect(() => {
    if (availableCountries.length > 0 && !activeCountry) {
      setActiveCountry(availableCountries[0])
    }
  }, [availableCountries, activeCountry])

  const currentCountryProviders = activeCountry
    ? providers.results[activeCountry]
    : null

  const hasAnyProviders = (countryProviders: TTMDBProvidersByCountry) => {
    if (!countryProviders) return false
    return (
      (countryProviders.flatrate && countryProviders.flatrate.length > 0) ||
      (countryProviders.buy && countryProviders.buy.length > 0) ||
      (countryProviders.rent && countryProviders.rent.length > 0) ||
      (countryProviders.free && countryProviders.free.length > 0)
    )
  }

  if (!activeCountry) {
    return null
  }

  return (
    <Tabs value={activeCountry} onValueChange={setActiveCountry}>
      <TabsList className="mb-4">
        {availableCountries.map((countryCode) => (
          <TabsTrigger key={countryCode} value={countryCode}>
            {countryCode}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeCountry}>
        {currentCountryProviders && hasAnyProviders(currentCountryProviders) ? (
          <ProvidersContent countryProviders={currentCountryProviders} />
        ) : (
          <div className="flex items-center">
            <MdOutlineTvOff className="mr-4 text-2xl text-muted-foreground" />
            <Text color="muted">No providers found for {activeCountry}.</Text>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default ProvidersByCountry
