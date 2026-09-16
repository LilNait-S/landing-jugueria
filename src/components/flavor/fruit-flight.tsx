import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { ArtworkPiece } from './artwork-piece';
import type { BlackberryPiece } from './blackberry-pieces';
import { fruitMotion } from './fruit-motion';

export function FruitFlight({ piece }: { piece: BlackberryPiece }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const flight = ref.current!;
    const scene = flight.closest('.blackberry-composition')!;
    const hand = flight.closest('.artwork-viewport')!.querySelector('.hand-back [data-piece="hand"]')!;
    const element = flight.querySelector<HTMLElement>('[data-piece]')!;
    const update = () => {
      const bounds = scene.getBoundingClientRect();
      const grip = hand.getBoundingClientRect();
      // Use layout coordinates, unaffected by the running transforms.
      const x = grip.x + grip.width * fruitMotion.targetX - bounds.x;
      const y = grip.y + grip.height * fruitMotion.targetY - bounds.y;
      flight.style.setProperty('--fruit-travel-x', `${x - element.offsetLeft - element.offsetWidth / 2}px`);
      flight.style.setProperty('--fruit-travel-y', `${y - element.offsetTop - element.offsetHeight / 2}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(scene);
    observer.observe(hand);
    return () => observer.disconnect();
  }, [piece.x, piece.y, piece.width]);

  return <div ref={ref} className="fruit-flight" style={{
    zIndex: piece.depth,
    '--fruit-spin': `${fruitMotion.rotation}deg`,
    '--fruit-small': fruitMotion.scale,
  } as CSSProperties}>
    <ArtworkPiece piece={piece} />
  </div>;
}
