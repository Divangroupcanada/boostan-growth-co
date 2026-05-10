# Boostan landing assets

Drop-in replacements. The landing page references these exact paths and falls back gracefully if missing.

## hero/
- `hero-video.mp4` — looping cinematic plant timelapse, ~10–20s, muted, < 4 MB ideal. Falls back to animated dark gradient.
- `hero-poster.jpg` — first frame still (1920x1080+). Falls back to gradient.
- `hero-lottie.json` — optional foreground Lottie animation. Currently not wired (omit).

## trust/
- `creator-1.jpg`, `creator-2.jpg`, `creator-3.jpg`
- `agency-1.jpg`, `agency-2.jpg`
- 4:5 portraits ideal. Fall back to gray gradient cards with name/title text.

## decorative/
- `leaf-1.svg`, `leaf-2.svg`, `vine-1.svg` — magenta-tintable line art, ~30–60px tall.
- `pattern-persian.svg` — tileable background pattern (used at 5% opacity).
- All optional; missing files render as nothing.

## platforms/
Brand icons are rendered via `react-icons` (Fa6) — no files needed here unless you want to override.
