import { useEffect, useState } from 'react'

import Text from '@/components/Text'

const Mosaic = () => {
  const [currentPoster, setCurrentPoster] = useState('')
  const [posterList, setPosterList] = useState<string[]>([])

  useEffect(() => {
    const fetchPosterList = async () => {
      try {
        const response = await fetch('/images/posters/posters.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: string[] = await response.json()
        setPosterList(data)

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setCurrentPoster(data[randomIndex])
        }
      } catch (error) {
        console.error('Failed to load poster list:', error)
      }
    }

    fetchPosterList()
  }, [])

  useEffect(() => {
    if (posterList.length === 0) return

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * posterList.length)
      setCurrentPoster(posterList[randomIndex])
    }, 10000)

    return () => clearInterval(interval)
  }, [posterList])

  return (
    <div>
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg mb-8">
        {currentPoster ? (
          <img
            src={`/images/posters/${currentPoster}`}
            alt="Random TV Show Poster"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Loading poster...
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white p-4">
          <Text variant="h2" as="h2" className="text-center text-shadow-md">
            Discover Your Next Obsession!
          </Text>
        </div>
      </div>

      <Text variant="paragraph">
        Start exploring series and managing your watchlists.
      </Text>
    </div>
  )
}

export default Mosaic
