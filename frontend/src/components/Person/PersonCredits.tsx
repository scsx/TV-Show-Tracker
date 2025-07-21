import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import PersonCreditCrew from '@/components/Person/PersonCreditCrew'
import PersonCreditMovies from '@/components/Person/PersonCreditMovies'
import PersonCreditShows from '@/components/Person/PersonCreditShows'
import Text from '@/components/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type PersonCreditsProps = {
  credits: {
    cast: TTMDBPersonCombinedCredit[]
    crew: TTMDBPersonCombinedCredit[]
  }
}

const PersonCredits: React.FC<PersonCreditsProps> = ({ credits }) => {
  const movieCastCredits = credits.cast.filter(
    (credit) => credit.media_type === 'movie',
  )
  const tvShowCastCredits = credits.cast.filter(
    (credit) => credit.media_type === 'tv',
  )

  return (
    <section>
      <Tabs defaultValue="shows" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="shows">
            TV Shows ({tvShowCastCredits.length})
          </TabsTrigger>
          <TabsTrigger value="movies">
            Movies ({movieCastCredits.length})
          </TabsTrigger>
          <TabsTrigger value="crew">Crew ({credits.crew.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="shows">
          <PersonCreditShows tvShows={tvShowCastCredits} />
        </TabsContent>

        <TabsContent value="movies">
          <Text color="muted" className="mb-8 italic">
            Movie details are not available yet.
          </Text>
          <PersonCreditMovies movies={movieCastCredits} />
        </TabsContent>

        <TabsContent value="crew">
          <Text color="muted" className="mb-8 italic">
            Details are not available yet.
          </Text>
          <PersonCreditCrew crew={credits.crew} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default React.memo(PersonCredits)
