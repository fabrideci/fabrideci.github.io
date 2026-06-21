# fabrideci.github.io

My personal site — **IoT Infrastructure Architect & Lead DevOps Engineer**.

**→ Live at [fabriziodecicco.dev](https://fabriziodecicco.dev)**

Hand-coded, static, with an "observability / status-page" identity built around a
bootable interactive terminal. **No framework, no build step, no dependencies, no
trackers** — the footer's "0 dependencies · 0 trackers" is literally true (verify in
DevTools → Network: nothing loads from a third-party origin; fonts are system stacks).

Accessible (WCAG 2.1 AA, fully keyboard-operable, `prefers-reduced-motion` honoured),
dark-default with a persisted light theme.

## Structure

```
index.html     # markup + head/meta/JSON-LD + no-JS fallback
styles.css     # "Signal" design tokens, robust dark theming, all sections
main.js        # theme toggle, terminal engine, case-study diagram, lab calc, artifacts
robots.txt
sitemap.xml
CNAME
assets/        # og.png, résumé PDF, favicon.svg, apple-touch-icon.png
lab/           # downloadable engineering templates (ADR · SLO · incident review · TF checklist)
```

## Run locally

```bash
python3 -m http.server 8000   # → http://localhost:8000
```
