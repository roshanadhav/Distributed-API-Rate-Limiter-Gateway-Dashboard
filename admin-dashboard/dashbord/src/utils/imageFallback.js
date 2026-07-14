// Small inline SVG placeholders so the site looks complete before
// real images/logos are dropped into /public. Swap these out any
// time by just adding the real file at the path used in data.json —
// the <img> will load it and never touch this fallback again.

function svgToDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const COVER_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#161b26"/>
  <path d="M0 0 L640 360 M640 0 L0 360" stroke="#232a38" stroke-width="1"/>
  <text x="320" y="188" font-family="monospace" font-size="14" fill="#5b6478" text-anchor="middle">add cover image</text>
</svg>
`)

export const LOGO_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#161b26"/>
  <text x="48" y="54" font-family="monospace" font-size="12" fill="#5b6478" text-anchor="middle">logo</text>
</svg>
`)

export const PORTRAIT_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#161b26"/>
  <circle cx="200" cy="160" r="70" fill="#232a38"/>
  <rect x="90" y="250" width="220" height="140" rx="60" fill="#232a38"/>
  <text x="200" y="380" font-family="monospace" font-size="12" fill="#5b6478" text-anchor="middle">add /images/hero.jpg</text>
</svg>
`)

export const GALLERY_FALLBACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
  <rect width="480" height="360" fill="#161b26"/>
  <text x="240" y="188" font-family="monospace" font-size="13" fill="#5b6478" text-anchor="middle">add photo</text>
</svg>
`)

export function withFallback(fallback) {
  return (e) => {
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback
    }
  }
}
