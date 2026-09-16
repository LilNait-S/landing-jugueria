# Flavor components

`../flavor-experience.tsx` coordinates the active flavor, favorites, keyboard and
swipe navigation. Its visual sections live here:

- `site-header.tsx` and `flavor-search.tsx`: header and search interaction.
- `flavor-artwork.tsx`: switching between flavor artwork.
- `blackberry-artwork.tsx`: layered Blackberry composition.
- `paper-background.tsx`: purple texture and curved liquid clip.
- `artwork-piece.tsx`: rendering an individual fruit, cup or hand.
- `flavor-notes.tsx`, `flavor-copy.tsx`: decorative words and flavor description.
- `carousel-controls.tsx`: flavor dots and arrows.
- `flavor-dialog.tsx`: menu and favorites dialog.
- `flavors.ts`: flavor names, colors, descriptions and search terms.
- `product-assets.ts`: the four user-supplied cups and matching paper backgrounds.
  Original PNGs, optimized WebP copies and the import manifest live in
  `public/images/supplied/`.
- `hand-layer.tsx`: two aligned copies of the shared hand. The rear copy is complete;
  an SVG clip exposes only the three curled fingers in the foreground copy.
  Clip coordinates use the supplied image's native 702 × 1507 dimensions.

The stacking order is background and fruit → rear hand → cups → front fingers.
Cup layers are siblings of the hand layers, outside the opaque paper backgrounds.
Both hand copies use the same layout, rotation and pivot data. The existing flavor
crossfade is preserved; vertical cup sliding is a separate animation step.

## Adjusting the images

Edit `blackberry-pieces.ts`. Each piece has `x`, `y`, `width` (percentages),
`ratio`, `depth`, `pivot` and `rotation` (degrees).

For example, `rotation: -12` rotates the image 12 degrees counterclockwise
around `pivot`. Positive values rotate clockwise. All initial rotations are zero.
Rotation is applied to the individual piece, independently of mobile positioning.

The hand's bottom anchoring, height and horizontal position are currently set by
`.blackberry-piece-hand` in `src/app/globals.css`; these override its normal
position/width fields to preserve the bottom alignment and image proportions.
Rotating the hand can move the wrist away from the bottom edge, so check the
composition when changing that value.
