import { useAuth } from '@/context/AuthContext'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type MosaicContentProps = {
  emptyCellCoordinates: { row: number; col: number }[]
}

const MosaicContent = ({ emptyCellCoordinates }: MosaicContentProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <div
      className="flex flex-col items-center justify-center p-4 z-10"
      style={{
        gridRow: `${emptyCellCoordinates[0].row} / span 1`,
        gridColumn: `${emptyCellCoordinates[0].col} / span ${emptyCellCoordinates.length}`,
        pointerEvents: 'auto',
      }}
    >
      <Text variant="h1" as="h1" className="text-5xl mb-4 text-center">
        Find Your
        <br />
        Next Obsession
      </Text>
      <div className="flex space-x-4 mt-4">
        {isAuthenticated ? (
          <>
            <Hyperlink variant="btnYellow" href="/xxxxxx">
              TODO: BTN and link
            </Hyperlink>
            <Hyperlink variant="btnYellow" href="/xxxxxx">
              TODO: BTN and link
            </Hyperlink>
          </>
        ) : (
          <>
            <Hyperlink variant="btnYellow" href="/login">
              Login
            </Hyperlink>
            <Hyperlink variant="btnYellow" href="/register">
              Register
            </Hyperlink>
          </>
        )}
      </div>
    </div>
  )
}

export default MosaicContent
