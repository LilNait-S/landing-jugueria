import Image from "next/image";
import type { CSSProperties } from "react";
import type { BlackberryPiece } from "./blackberry-pieces";

export function ArtworkPiece({
  piece,
  clipPath,
  motion,
  motionKey,
}: {
  piece: BlackberryPiece;
  clipPath?: string;
  motion?: "enter" | "exit";
  motionKey?: number;
}) {
  return (
    <span
      className={`blackberry-piece blackberry-piece-${piece.id}`}
      data-piece={piece.id}
      data-depth={piece.depth}
      style={
        {
          "--piece-x": `${piece.x}%`,
          "--piece-y": `${piece.y}%`,
          "--piece-width": `${piece.width}%`,
          "--piece-ratio": piece.ratio,
          "--piece-depth": piece.depth,
          "--piece-pivot": piece.pivot,
          "--piece-rotation": `${piece.rotation}deg`,
          clipPath,
        } as CSSProperties
      }
    >
      <span
        key={`${motionKey ?? 0}-${motion ?? "rest"}`}
        className={`piece-motion ${motion ? `cup-${motion}` : ""}`}
      >
        <Image src={piece.src} alt="" fill sizes="30vw" loading="eager" />
      </span>
    </span>
  );
}
