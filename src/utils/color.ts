export const tint = (hex: string, amount = 0.84) => {
  const v = hex.replace("#", "");
  const n = parseInt(
    v.length === 3
      ? v
          .split("")
          .map((x) => x + x)
          .join("")
      : v,
    16,
  );
  const blend = (c: number) =>
    Math.round(c + (255 - c) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${blend(n >> 16)}${blend((n >> 8) & 255)}${blend(n & 255)}`;
};
