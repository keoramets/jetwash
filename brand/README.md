# JetWash logo

The JetWash logo is a pressure-washer spray gun whose jet runs over the name. The files are in
`public/images/brand/`, so they are also downloadable from the website.

| File | Use it for |
| --- | --- |
| `jetwash-logo.svg` / `.png` | The main logo, on white or light backgrounds: documents, quotations, signs, vehicles |
| `jetwash-logo-white.svg` / `.png` | The main logo on navy, dark photos or dark vehicles |
| `jetwash-logo-on-white.png` | The main logo on a solid white background (email signatures, Word, PowerPoint) |
| `jetwash-logo-horizontal.svg` / `.png` | Small spaces: the website header, letterheads, uniforms |
| `jetwash-logo-horizontal-white.svg` / `.png` | The same, on navy |
| `jetwash-symbol.svg` / `.png`, `-white` | The spray gun on its own, when the name is already shown nearby |
| `jetwash-app-icon.svg` / `.png` | Rounded app icon |
| `jetwash-whatsapp.png` | WhatsApp and Facebook profile picture (640 × 640; the apps crop it to a circle) |
| `jetwash-favicon.svg`, `/favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Browser tabs and phone home screens |

## Colours

| Name | Hex | Where |
| --- | --- | --- |
| Navy | `#0b1d2b` | The gun and the name |
| Emerald | `#008254` | Nozzle and hose fitting |
| Bright emerald | `#19c98a` | The water jet; nozzle on navy |
| Pale blue | `#eaf3ff` | Spray on the WhatsApp picture |

## Using it

- Leave clear space around the logo at least as wide as the nozzle is tall.
- Use the main logo at 160 px wide or more on screen (40 mm in print). Below that, use the horizontal logo; below
  24 px tall, use the symbol or app icon.
- Don't stretch, recolour, rotate or add effects, and don't put the navy logo on dark backgrounds.

## Changing it

The files are generated: don't edit them by hand. `brand/gen.py` draws every SVG, with the name converted to outlines
from `fonts/Archivo-ExtraBold.ttf` (Archivo, SIL Open Font License, `fonts/OFL.txt`), so no font is needed to show
them. It needs Python with `fonttools` and `uharfbuzz`. The PNG files are the SVGs rendered at the sizes in their
names (any SVG renderer; these were made with Chromium).
