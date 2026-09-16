// User-supplied product assets. Ratios match the trimmed transparent images.
export const productAssets: Record<
  string,
  { cup: string; ratio: string; background: string }
> = {
  orange: {
    cup: "/images/supplied/orange.webp",
    ratio: "830 / 1430",
    background: "/images/supplied/orange-background.webp",
  },
  watermelon: {
    cup: "/images/supplied/watermelon.webp",
    ratio: "843 / 1444",
    background: "/images/supplied/watermelon-background.webp",
  },
  lime: {
    cup: "/images/supplied/lime.webp",
    ratio: "835 / 1438",
    background: "/images/supplied/lime-background.webp",
  },
  blackberry: {
    cup: "/images/supplied/blackberry.webp",
    ratio: "781 / 1296",
    background: "/images/supplied/blackberry-background.webp",
  },
};
