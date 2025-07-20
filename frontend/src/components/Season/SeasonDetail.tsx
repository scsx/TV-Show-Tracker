import React, { useEffect, useState } from 'react'

import { getShowSeasonDetails } from '@/services/getShowSeasonDetails'
import { type TTMDBShowSeason, type TTMDBShowSeasonDetails } from '@/types'

import Text from '@/components/Text'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

// Importar a nova função de serviço

interface SeasonDetailsProps {
  seriesId: number // ADICIONADO: O ID da série é necessário para a chamada da API
  season: TTMDBShowSeason | null // Esta é a prop da temporada resumida (da lista de temporadas)
  isOpen: boolean
  onClose: () => void
}

const SeasonDetails: React.FC<SeasonDetailsProps> = ({
  seriesId, // Recebe seriesId
  season,
  isOpen,
  onClose,
}) => {
  // Estado para armazenar os detalhes completos da temporada obtidos da API
  const [fullSeasonDetails, setFullSeasonDetails] =
    useState<TTMDBShowSeasonDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // UseEffect para chamar a API quando o Sheet abre ou season/seriesId mudam
  useEffect(() => {
    console.log('--- useEffect Re-run ---')
    console.log('isOpen:', isOpen)
    console.log('season:', season)
    console.log('seriesId:', seriesId)
    console.log('fullSeasonDetails (current state):', fullSeasonDetails)
    console.log('------------------------')

    const fetchDetails = async () => {
      // Condição para disparar a chamada da API:
      // 1. O sheet está aberto (`isOpen`).
      // 2. Temos o objeto `season` (do resumo).
      // 3. Temos o `seriesId`.
      // 4. Ainda não temos os `fullSeasonDetails` para esta temporada OU os detalhes são de uma temporada diferente.
      if (
        isOpen &&
        season &&
        seriesId &&
        (!fullSeasonDetails || fullSeasonDetails.id !== season.id)
      ) {
        setLoading(true)
        setError(null)
        try {
          const data = await getShowSeasonDetails(
            seriesId,
            season.season_number,
          )
          console.log('Fetched season details:', data)
          setFullSeasonDetails(data)
        } catch (err: any) {
          console.error('Failed to fetch season details:', err)
          setError(err.message || 'Failed to load season details.')
          setFullSeasonDetails(null) // Limpa detalhes se houver erro
        } finally {
          setLoading(false)
        }
      } else if (!isOpen) {
        // Quando o sheet fecha, podemos limpar os detalhes completos para garantir
        // que, na próxima vez que abrir, ele carregue de novo (ou use o cache do Axios se houver).
        setFullSeasonDetails(null)
        setError(null)
      }
    }

    fetchDetails()
  }, [isOpen, season, seriesId, fullSeasonDetails])

  // O objeto de temporada que usaremos para renderizar.
  // Prioriza `fullSeasonDetails` (dados da API detalhados), caso contrário usa `season` (dados resumidos).
  // Isto é importante para que o Sheet abra com dados básicos imediatamente e depois atualize.
  const seasonToDisplay = fullSeasonDetails || season

  // Renderiza null imediatamente se não estiver aberto para otimizar
  if (!isOpen) {
    return null
  }

  // --- Estados de Carregamento e Erro ---
  if (loading && !fullSeasonDetails) {
    // Mostra loading se ainda não carregou os detalhes completos
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[33.33%] sm:max-w-[33.33%] flex items-center justify-center p-4">
          <p className="text-white">Loading season details...</p>
        </SheetContent>
      </Sheet>
    )
  }

  if (error || !seasonToDisplay) {
    // Mostra erro se algo deu errado ou não há dados
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[33.33%] sm:max-w-[33.33%] flex items-center justify-center p-4">
          <p className="text-red-500">
            Error: {error || 'No season data available.'}
          </p>
        </SheetContent>
      </Sheet>
    )
  }

  // --- Renderização dos Detalhes da Temporada ---
  const posterUrl = seasonToDisplay.poster_path
    ? `${TMDB_BASE_IMAGES_URL}/w300${seasonToDisplay.poster_path}`
    : '/images/no-poster.png'

  // TODO: use util function to format date
  const airDate = seasonToDisplay.air_date
    ? new Date(seasonToDisplay.air_date).toDateString()
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[33.33%] sm:max-w-[33.33%] overflow-y-auto p-6">
        {' '}
        {/* Adicionado p-6 para padding */}
        <SheetHeader className="mb-4">
          <SheetTitle>{seasonToDisplay.name}</SheetTitle>
          <SheetDescription>
            {/* {seasonToDisplay.episode_count} */}TODO: #EP Episodes - Aired:{' '}
            {airDate}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <img
            src={posterUrl}
            alt={seasonToDisplay.name}
            className="w-full h-auto rounded-lg mb-4 object-cover"
          />
          {seasonToDisplay.overview ? (
            <Text variant="paragraph" as="p" className="mb-6">
              {' '}
              {/* Adicionado mb-6 */}
              {seasonToDisplay.overview}
            </Text>
          ) : (
            <Text variant="paragraph" as="p" color="muted" className="mb-6">
              {' '}
              {/* Adicionado mb-6 */}
              No overview available for this season.
            </Text>
          )}

          {/* Renderiza a lista de episódios (só estará disponível em fullSeasonDetails) */}
          {fullSeasonDetails?.episodes &&
            fullSeasonDetails.episodes.length > 0 && (
              <div className="mt-6 border-t border-gray-700 pt-6">
                {' '}
                {/* Linha divisória e padding */}
                <Text
                  variant="h3"
                  as="h3"
                  className="mb-4 text-xl font-semibold text-white"
                >
                  Episodes
                </Text>
                <div className="space-y-4">
                  {' '}
                  {/* Espaçamento entre episódios */}
                  {fullSeasonDetails.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="p-4 border rounded-lg border-gray-700 bg-gray-800 shadow-md"
                    >
                      <Text
                        variant="h4"
                        as="h4"
                        className="text-lg font-medium text-blue-300"
                      >
                        E{episode.episode_number}: {episode.name}
                      </Text>
                      <Text className="text-gray-400 mt-1">
                        Aired:{' '}
                        {episode.air_date
                          ? new Date(episode.air_date).toDateString()
                          : 'N/A'}
                        {episode.runtime
                          ? ` - Runtime: ${episode.runtime} mins`
                          : ''}
                      </Text>
                      {episode.overview && episode.overview.length > 0 ? (
                        <Text className="text-gray-300 mt-2">
                          {episode.overview}
                        </Text>
                      ) : (
                        <Text className="text-gray-500 mt-2">
                          No overview available for this episode.
                        </Text>
                      )}
                      {episode.still_path && (
                        <img
                          src={`${TMDB_BASE_IMAGES_URL}/w300${episode.still_path}`}
                          alt={`Still from ${episode.name}`}
                          className="w-full h-auto rounded-md mt-3 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Você também pode adicionar crew e guest_stars aqui, se desejar */}
          {fullSeasonDetails?.crew && fullSeasonDetails.crew.length > 0 && (
            <div className="mt-6 border-t border-gray-700 pt-6">
              <Text
                variant="h3"
                as="h3"
                className="mb-4 text-xl font-semibold text-white"
              >
                Crew
              </Text>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {fullSeasonDetails.crew.slice(0, 10).map(
                  (
                    person, // Limite a 10 para não lotar
                  ) => (
                    <li
                      key={person.credit_id}
                      className="text-sm text-gray-300"
                    >
                      <span className="font-medium text-purple-300">
                        {person.name}
                      </span>{' '}
                      ({person.job})
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {fullSeasonDetails?.guest_stars &&
            fullSeasonDetails.guest_stars.length > 0 && (
              <div className="mt-6 border-t border-gray-700 pt-6">
                <Text
                  variant="h3"
                  as="h3"
                  className="mb-4 text-xl font-semibold text-white"
                >
                  Guest Stars
                </Text>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {fullSeasonDetails.guest_stars.slice(0, 10).map(
                    (
                      person, // Limite a 10
                    ) => (
                      <li
                        key={person.credit_id}
                        className="text-sm text-gray-300"
                      >
                        <span className="font-medium text-teal-300">
                          {person.name}
                        </span>{' '}
                        (as {person.character})
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SeasonDetails
