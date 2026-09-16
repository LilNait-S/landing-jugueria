import Image from "next/image";
import { useId } from "react";

export function PaperBackground({
  src,
  onError,
}: {
  src: string;
  onError: () => void;
}) {
  const clipId = useId();
  return (
    <>
      <svg width="0" height="0" className="paper-clip-defs" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M0 0 H1 V.55 C.97 .572 .948 .55 .934 .574 C.9 .62 .934 .76 .902 .76 C.881 .76 .908 .65 .881 .642 C.84 .627 .858 .729 .846 .773 C.837 .813 .806 .818 .789 .797 C.763 .766 .779 .687 .76 .682 C.739 .674 .75 .755 .725 .762 C.7 .773 .694 .705 .684 .704 C.55 .78 .281 .773 .107 .637 C.041 .586 .037 .552 0 .552 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="paper-surface" style={{ clipPath: `url(#${clipId})` }}>
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          quality={85}
          className="blackberry-background"
          onError={onError}
        />
      </div>
    </>
  );
}
