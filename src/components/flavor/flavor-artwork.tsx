import { FlavorDecorations } from "./flavor-decorations"
import { ArtworkPiece } from "./artwork-piece"
import { PaperBackground } from "./paper-background"
import { blackberryPieces } from "./blackberry-pieces"
import { productAssets } from "./product-assets"
import { flavors } from "./flavors"
import { HandLayer } from "./hand-layer"

const cupLayout = blackberryPieces.find((piece) => piece.id === "cup")!
const hand = blackberryPieces.find((piece) => piece.id === "hand")!

export function FlavorArtwork({
  active,
  previous,
  serial,
  onError,
}: {
  active: number
  previous: number | null
  serial: number
  onError: (id: string) => void
}) {
  return (
    <div className="artwork-viewport" aria-hidden="true">
      {flavors.map((item, index) => {
        const assets = productAssets[item.id]
        return (
          <div
            key={`${item.id}-${serial}`}
            className={`artwork-layer artwork-layer-paper ${index === active ? "active" : ""} ${index === previous ? "background-out" : ""} ${previous !== null && index === active ? "background-in" : ""}`}
          >
            <PaperBackground
              src={assets.background}
              onError={() => onError(item.id)}
            />
          </div>
        )
      })}
      <div className="flavor-fruit-layer">
        <FlavorDecorations
          flavor={flavors[active].id}
          previous={previous === null ? undefined : flavors[previous].id}
          serial={serial}
        />
      </div>
      <div className="grip-scene">
        <HandLayer piece={hand} side="back" />
        <div className="blackberry-composition grip-cup-composition">
          {flavors.map((item, index) => (
            <div
              key={item.id}
              className={`grip-cup-layer ${index === active ? "active" : ""} ${index === previous ? "departing" : ""}`}
            >
              <ArtworkPiece
                motion={
                  previous === null
                    ? undefined
                    : index === active
                      ? "enter"
                      : index === previous
                        ? "exit"
                        : undefined
                }
                motionKey={serial}
                piece={{
                  ...cupLayout,
                  src: productAssets[item.id].cup,
                  ratio: productAssets[item.id].ratio,
                }}
              />
            </div>
          ))}
        </div>
        <HandLayer piece={hand} side="front" />
      </div>
    </div>
  )
}
