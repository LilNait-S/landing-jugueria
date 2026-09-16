import { useId } from "react"
import { ArtworkPiece } from "./artwork-piece"
import type { BlackberryPiece } from "./blackberry-pieces"

// Traced in the supplied hand's native 702 × 1507 coordinate space.
// Only the three curled fingers cross in front of the cup. The extended
// index finger, thumb and palm belong to the rear layer.
const foregroundFingers = [
  "M 256.11 379.55 C 314.89 366.12 450 392 550 416 C 610.47 433.29 645.74 468.56 662.53 579.4 L 610.47 623.07 C 565.13 619.71 519.78 626.43 508.03 544.14 C 479.48 532.38 434.13 513.91 353 493 C 303.14 483.68 224.2 473.6 234.28 404.74 Z",
  "M 172.14 567.65 C 219.16 542.46 270 557 315 564 L 480 591 C 555 613 600 650 636 706 L 660 786 L 560.09 829.64 C 513.07 806.13 501.31 777.58 459.32 717.12 C 350.16 681.85 282.98 666.73 230.92 660.02 C 175.5 643.22 157.03 624.75 157.03 587.8 Z",
  "M 173.82 730.55 C 226 718 311.53 759.1 412.3 772.54 C 541.62 801.09 568.49 819.56 635.66 819.56 L 595 948 C 563 954 533 936 477.8 923.69 C 380.39 874.98 323.29 856.51 238 823 C 177 802 154 783 160 757 Z",
]

export function HandLayer({
  piece,
  side,
}: {
  piece: BlackberryPiece
  side: "back" | "front"
}) {
  const clipId = useId()
  return (
    <div
      className={`blackberry-composition shared-hand-composition hand-${side}`}
      data-hand-layer={side}
    >
      {side === "front" && (
        <svg
          width="0"
          height="0"
          className="paper-clip-defs"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              {foregroundFingers.map((d) => (
                <path
                  key={d}
                  d={d}
                  transform={`scale(${1 / 702} ${1 / 1507})`}
                />
              ))}
            </clipPath>
          </defs>
        </svg>
      )}
      <ArtworkPiece
        piece={piece}
        clipPath={side === "front" ? `url(#${clipId})` : undefined}
      />
    </div>
  )
}
