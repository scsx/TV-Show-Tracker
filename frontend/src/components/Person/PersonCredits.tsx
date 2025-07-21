import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import PersonCreditCrew from '@/components/Person/PersonCreditCrew'
import PersonCreditMovies from '@/components/Person/PersonCreditMovies'
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

  console.log(credits.crew)

  // Helper function to sort by date (most recent first)
  const sortByDate = (
    a: TTMDBPersonCombinedCredit,
    b: TTMDBPersonCombinedCredit,
  ) => {
    const dateA = a.media_type === 'movie' ? a.release_date : a.first_air_date
    const dateB = b.media_type === 'movie' ? b.release_date : b.first_air_date

    const actualDateA = dateA ? new Date(dateA) : new Date(0)
    const actualDateB = dateB ? new Date(dateB) : new Date(0)

    return actualDateB.getTime() - actualDateA.getTime()
  }

  return (
    <section>
      {/* TODO: Default to shows */}
      <Tabs defaultValue="crew" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tv-shows">
            TV Shows ({tvShowCastCredits.length})
          </TabsTrigger>
          <TabsTrigger value="movies">
            Movies ({movieCastCredits.length})
          </TabsTrigger>
          <TabsTrigger value="crew">Crew ({credits.crew.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tv-shows">
          {tvShowCastCredits.length > 0 ? (
            <div className="space-y-4 pt-4">
              {tvShowCastCredits.sort(sortByDate).map((credit) => (
                <Text key={credit.credit_id} as="p">
                  {JSON.stringify(credit.name || credit.title)} (TV Show -{' '}
                  {credit.character ? `as ${credit.character}` : 'Cast'})
                </Text>
              ))}
            </div>
          ) : (
            <Text as="p" variant="paragraphL" className="py-8">
              No TV show credits found.
            </Text>
          )}
        </TabsContent>

        <TabsContent value="movies">
          <Text color="muted" className="mb-8 italic">
            Movie details are not available yet.
          </Text>
          <PersonCreditMovies movies={movieCastCredits} />
        </TabsContent>

        <TabsContent value="crew">
          <PersonCreditCrew crew={credits.crew} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default React.memo(PersonCredits)
