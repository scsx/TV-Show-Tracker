import React, { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { TMDB_SHOW_GENRES } from '@/lib/constants'

type SearchFormProps = {
  initialQuery: string
  initialGenreIds: string
  onSubmit: (query: string, genreIds: string) => void
}

const SearchForm: React.FC<SearchFormProps> = ({
  initialQuery,
  initialGenreIds,
  onSubmit,
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [genreIds, setGenreIds] = useState<string[]>(
    initialGenreIds.split(',').filter(Boolean),
  )

  const availableGenres = TMDB_SHOW_GENRES.genres

  useEffect(() => {
    setQuery(initialQuery)
    setGenreIds(initialGenreIds.split(',').filter(Boolean))
  }, [initialQuery, initialGenreIds])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(query, genreIds.join(','))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center mb-8 border-2 rounded-md overflow-hidden border-darkblue bg-muted"
    >
      <Input
        type="text"
        placeholder="Search by name or keyword..."
        className="h-12 border-0 !text-lg border-darkblue border-r-2 rounded-none focus:bg-darkblue focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ToggleGroup
        type="multiple"
        className="h-12 px-2 flex gap-0 border-r-2 border-darkblue"
        value={genreIds}
        onValueChange={(values: string[]) => setGenreIds(values)}
      >
        {availableGenres.map((genre) => (
          <ToggleGroupItem
            key={genre.id}
            value={String(genre.id)}
            aria-label={`Toggle ${genre.name}`}
            className="h-12 rounded-none px-2.5 pt-1 text-muted-foreground hover:text-white data-[state=on]:bg-background data-[state=on]:text-primary"
          >
            <Text as="span" className="text-xs text-inherit whitespace-nowrap">
              {genre.name}
            </Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        type="submit"
        className="h-12 rounded-none bg-primary border-2 border-primary text-darkblue hover:bg-white hover:border-[#eed654]"
      >
        <IoSearch />
      </Button>
    </form>
  )
}

export default SearchForm
