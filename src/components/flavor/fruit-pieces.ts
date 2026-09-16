import { blackberryPieces, type BlackberryPiece } from './blackberry-pieces';
import assets from './fruit-assets.json';

// Coordinates follow the supplied references. Each piece stays independently editable.
// x/y/width: percentages; rotation: degrees. The shared hand/cup layout is separate.
const layouts = {
  orange: [
    { x: 30.5, y: 23.5, width: 10, rotation: -8 },
    { x: 61, y: 20, width: 9, rotation: 12 },
    { x: 54, y: 45, width: 8, rotation: -35 },
    { x: 62, y: 55, width: 9, rotation: 8 },
    { x: 32, y: 60, width: 9, rotation: 10 },
    { x: 42.5, y: 55, width: 4.5, rotation: -20 },
  ],
  watermelon: [
    { x: 30, y: 23, width: 10, rotation: -9 },
    { x: 61, y: 22, width: 9, rotation: -8 },
    { x: 54, y: 42, width: 7, rotation: -35 },
    { x: 62, y: 52.5, width: 10, rotation: 5 },
    { x: 31.5, y: 60, width: 8, rotation: -90 },
    { x: 42.5, y: 54, width: 5, rotation: 5 },
  ],
  lime: [
    { x: 31, y: 24, width: 10, rotation: 0 },
    { x: 60, y: 20, width: 9, rotation: 0 },
    { x: 54, y: 43, width: 8, rotation: -55 },
    { x: 60, y: 56, width: 10, rotation: 10 },
    { x: 31.5, y: 60, width: 10, rotation: 10 },
    { x: 42.5, y: 56, width: 4.5, rotation: -25 },
  ],
};

export function fruitPieces(flavor: string): BlackberryPiece[] {
  if (flavor === 'blackberry') return blackberryPieces.filter(piece => piece.id.startsWith('fruit-'));
  const id = flavor as keyof typeof layouts;
  return layouts[id].map((layout, index) => ({
    id: `fruit-${index + 1}`,
    ...assets[id][index],
    ...layout,
    depth: index === 2 || index === 5 ? 2 : 3,
    pivot: '50% 50%',
  }));
}
