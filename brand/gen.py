"""Builds the JetWash logo kit (option D: spray gun and jet) as SVG files with the wordmark converted to outlines."""
import os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
# Writes to brand/kit/svg (git-ignored); copy changed files into public/images/brand.
OUT = os.path.join(HERE, "kit", "svg")
os.makedirs(OUT, exist_ok=True)
FONT = os.path.join(HERE, "fonts", "Archivo-ExtraBold.ttf")

NAVY, GREEN, GREEN2, PALE, WHITE = "#0b1d2b", "#008254", "#19c98a", "#eaf3ff", "#ffffff"

font = TTFont(FONT)
glyphset = font.getGlyphSet()
with open(FONT, "rb") as fh:
    hb_font = hb.Font(hb.Face(fh.read()))
UPEM = font["head"].unitsPerEm


def text_path(text, x, baseline, size, tracking_em=-0.035):
    """Outline of `text` (kerned by HarfBuzz) as one SVG path `d`, plus its bounds."""
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    scale = size / UPEM
    pen = SVGPathPen(glyphset)
    bounds = BoundsPen(glyphset)
    cursor = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = font.getGlyphName(info.codepoint)
        gx = x + (cursor + pos.x_offset) * scale
        gy = baseline - pos.y_offset * scale
        t = (scale, 0, 0, -scale, gx, gy)
        glyphset[name].draw(TransformPen(pen, t))
        glyphset[name].draw(TransformPen(bounds, t))
        cursor += pos.x_advance + tracking_em * UPEM
    return pen.getCommands(), bounds.bounds


def gun(body, accent_parts, spray=None, simple=False):
    """The spray gun in its 0..110 x 0..64 drawing box. body: gun colour; accent_parts: nozzle and hose fitting."""
    if simple:  # fewer, thicker parts for 16-32 px
        parts = [
            f'<path d="M17 21H29L23 52H11Z" fill="{body}" stroke="{body}" stroke-width="6" stroke-linejoin="round"/>',
            f'<rect x="12" y="13" width="38" height="12" rx="6" fill="{body}"/>',
            f'<rect x="48" y="15.5" width="18" height="6" rx="3" fill="{body}"/>',
            f'<rect x="64" y="13" width="11" height="11" rx="2.5" fill="{accent_parts}"/>',
        ]
        if spray:
            parts.append(f'<path d="M75 18.5 90 10V27Z" fill="{spray}"/>')
        return "".join(parts)
    else:
        parts = [
            f'<path d="M17 21H29L23 52H11Z" fill="{body}" stroke="{body}" stroke-width="5" stroke-linejoin="round"/>',
            f'<rect x="12" y="13" width="38" height="11" rx="5.5" fill="{body}"/>',
            f'<path d="M33 25C36 31 36 37 31.5 42" fill="none" stroke="{body}" stroke-width="4.5" stroke-linecap="round"/>',
            f'<path d="M25 47C33 47 40 41 40 25" fill="none" stroke="{body}" stroke-width="3" stroke-linecap="round"/>',
            f'<rect x="9" y="52" width="15" height="7" rx="2.5" fill="{accent_parts}"/>',
            f'<rect x="48" y="16.5" width="36" height="4" rx="2" fill="{body}"/>',
            f'<rect x="82" y="13.5" width="10" height="10" rx="2.5" fill="{accent_parts}"/>',
        ]
    if spray:
        parts.append(f'<path d="M92 18.5 108 11V26Z" fill="{spray}"/>')
    return "".join(parts)


def svg(view_box, body, title, width=None, height=None):
    vb = " ".join(f"{v:g}" for v in view_box)
    size = f' width="{width:g}" height="{height:g}"' if width else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size} role="img" aria-labelledby="t">'
        f'<title id="t">{title}</title>{body}</svg>\n'
    )


def write(name, content):
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(content)


# Primary logo: the gun, its jet running over the name, and the name underneath (board coordinates from the design).
def primary(body, nozzle, jet, text_colour):
    d, (tx0, ty0, tx1, ty1) = text_path("JetWash", 94, 115.85, 84)
    g = f'<g transform="scale(1.8)">{gun(body, nozzle)}</g>'
    j = (
        f'<g transform="translate(165 21)" fill="{jet}"><path d="M0 9.5 404 1.5V22.5L0 14.5Z"/>'
        f'<circle cx="413" cy="5" r="3"/><circle cx="423" cy="12" r="2.6"/><circle cx="413" cy="19.5" r="2.2"/></g>'
    )
    t = f'<path fill="{text_colour}" d="{d}"/>'
    x0, y0 = min(8.5 * 1.8, tx0), min(21 + 1.5, ty0)
    x1, y1 = max(165 + 423 + 2.6, tx1), max(59 * 1.8, ty1)
    pad = 6
    return (x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad), g + j + t


vb, body = primary(NAVY, GREEN, GREEN2, NAVY)
write("jetwash-logo.svg", svg(vb, body, "JetWash"))
vb, body = primary(WHITE, GREEN2, GREEN2, WHITE)
write("jetwash-logo-white.svg", svg(vb, body, "JetWash"))


# Horizontal logo for website headers: the gun with its spray, then the name.
def horizontal(body, nozzle, spray, text_colour):
    s = 0.6
    d, (tx0, ty0, tx1, ty1) = text_path("JetWash", 72, 33, 34, -0.03)
    g = f'<g transform="scale({s})">{gun(body, nozzle, spray)}</g>'
    x0, y0, x1, y1 = 8.5 * s, min(11 * s, ty0), tx1, max(59 * s, ty1)
    pad = 3
    return (x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad), g + f'<path fill="{text_colour}" d="{d}"/>'


vb, body = horizontal(NAVY, GREEN, GREEN2, NAVY)
write("jetwash-logo-horizontal.svg", svg(vb, body, "JetWash"))
vb, body = horizontal(WHITE, GREEN2, GREEN2, WHITE)
write("jetwash-logo-horizontal-white.svg", svg(vb, body, "JetWash"))

# Symbol: the gun and its spray on their own.
SYMBOL_BOX = (6, 8, 104, 54)
write("jetwash-symbol.svg", svg(SYMBOL_BOX, gun(NAVY, GREEN, GREEN2), "JetWash"))
write("jetwash-symbol-white.svg", svg(SYMBOL_BOX, gun(WHITE, GREEN2, GREEN2), "JetWash"))


def tile(size, radius, background, symbol_width, symbol, box=SYMBOL_BOX):
    sx, sy, sw, sh = box
    scale = symbol_width / sw
    ox = (size - symbol_width) / 2 - sx * scale
    oy = (size - sh * scale) / 2 - sy * scale
    bg = f'<rect width="{size}" height="{size}" rx="{radius}" fill="{background}"/>'
    return svg((0, 0, size, size), bg + f'<g transform="translate({ox:.2f} {oy:.2f}) scale({scale:.4f})">{symbol}</g>', "JetWash")


# App icon (phones, browser tabs on high-resolution screens), WhatsApp profile photo, small favicon.
write("jetwash-app-icon.svg", tile(512, 112, NAVY, 392, gun(WHITE, GREEN2, GREEN2)))
write("jetwash-whatsapp.svg", tile(640, 0, GREEN, 420, gun(WHITE, NAVY, PALE)))
write("jetwash-favicon.svg", tile(64, 14, NAVY, 54, gun(WHITE, GREEN2, GREEN2, simple=True), box=(6, 7, 86, 55)))
print("written:", sorted(os.listdir(OUT)))

# Square, edge-to-edge version for Apple touch icons and Android "maskable" icons (the phone rounds the corners).
write("jetwash-app-icon-square.svg", tile(512, 0, NAVY, 340, gun(WHITE, GREEN2, GREEN2)))
