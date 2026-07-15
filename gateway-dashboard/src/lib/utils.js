export const rand = (min, max) => Math.random() * (max - min) + min;
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const fmtNum = (n) => n.toLocaleString("en-US");
export const fmtTime = (d) => d.toLocaleTimeString("en-US", { hour12: false });
export const fmtCompact = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
};
export const uid = () => Math.random().toString(36).slice(2, 10);
