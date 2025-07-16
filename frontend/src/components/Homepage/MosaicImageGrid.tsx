import { type TGridImage } from './Mosaic'

type MosaicImageGridProps = {
  gridImages: TGridImage[]
  numRows: number
  numCols: number
}

const MosaicImageGrid = ({ gridImages }: MosaicImageGridProps) => {
  return (
    <>
      {gridImages.length > 0 ? (
        gridImages.map((image) => (
          <img
            key={image.id}
            src={`/images/posters/${image.src}`}
            alt="TV Show Poster"
            className="w-full h-full object-cover"
            style={{
              gridRow: `${image.row} / span 1`,
              gridColumn: `${image.col} / span 1`,
            }}
          />
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 col-span-full row-span-full">
          Loading posters...
        </div>
      )}
    </>
  )
}

export default MosaicImageGrid
