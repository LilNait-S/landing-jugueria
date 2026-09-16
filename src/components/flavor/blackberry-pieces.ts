export type BlackberryPiece = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  ratio: string;
  depth: number;
  /** Rotation in degrees around pivot. Positive values rotate clockwise. */
  rotation: number;
  pivot: `${number}% ${number}%`;
};

export const blackberryPieces: BlackberryPiece[] = [
  {
    id: "fruit-left",
    src: "/images/blackberry/fruit-1.webp",
    x: 31,
    y: 21.5,
    width: 10,
    ratio: "431 / 499",
    depth: 2,
    rotation: -35,
    pivot: "48% 52%",
  },
  {
    id: "fruit-upper-right",
    src: "/images/blackberry/fruit-2.webp",
    x: 62,
    y: 21.5,
    width: 8.5,
    ratio: "199 / 214",
    depth: 3,
    rotation: -5,
    pivot: "50% 50%",
  },
  {
    id: "fruit-middle-right",
    src: "/images/blackberry/fruit-3.webp",
    x: 56,
    y: 40.2,
    width: 7.4,
    ratio: "149 / 170",
    depth: 2,
    rotation: 20,
    pivot: "45% 55%",
  },
  {
    id: "fruit-lower-right",
    src: "/images/blackberry/fruit-4.webp",
    x: 65,
    y: 51.2,
    width: 9,
    ratio: "265 / 297",
    depth: 3,
    rotation: 10,
    pivot: "52% 48%",
  },
  {
    id: "fruit-lower-left",
    src: "/images/blackberry/fruit-5.webp",
    x: 32.8,
    y: 60.2,
    width: 6,
    ratio: "194 / 240",
    depth: 3,
    rotation: -40,
    pivot: "50% 50%",
  },
  {
    id: "fruit-near-wrist",
    src: "/images/blackberry/fruit-6.webp",
    x: 43,
    y: 56.2,
    width: 4,
    ratio: "287 / 340",
    depth: 4,
    rotation: -20,
    pivot: "54% 46%",
  },
  {
    id: "cup",
    src: "/images/supplied/blackberry.webp",
    x: 41,
    y: 13,
    width: 17,
    ratio: "781 / 1296",
    depth: 6,
    rotation: 0,
    pivot: "50% 82%",
  },
  {
    id: "hand",
    src: "/images/supplied/hand.webp",
    x: 39.2,
    y: 18.4,
    width: 28.2,
    ratio: "702 / 1507",
    depth: 6,
    rotation: 0,
    pivot: "51% 63%",
  },
];
