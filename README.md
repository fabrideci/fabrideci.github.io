# fabriziodecicco.dev

Fabrizio De Cicco — IoT Infrastructure Architect & Lead Engineer.

**Live site: [fabriziodecicco.dev](https://fabriziodecicco.dev)**

The **Systems studio** design puts the engineering work first: an interactive
architecture overview, a detailed case study, an expandable index of engineering
principles, and practical tools in the Lab. Warm paper, green diagrams, serif
headings and a restrained layout give the site a consistent visual language.

Static HTML, CSS and JavaScript. No framework, build step, runtime dependencies
or trackers. All assets, including fonts, load from the site's own origin.

## Behaviour

- English and Italian, with saved language preference and translated agent details.
- Light by default; the light/dark choice persists between visits.
- Both architecture diagrams work with pointer and keyboard selection.
- Engineering principles use native `details` disclosures.
- The Lab retains the error-budget calculator, Markdown previews and downloads,
  and an optional command-line interface.
- Each preview/download action includes its filename in its accessible name.
- Preview buttons expose their selection; loading, completion and failures report
  the filename through a localized status message without moving keyboard focus.
- The SLO number field and slider share the full 0–100% range.
- The terminal completes partial commands with Tab. Tab moves on when no further
  completion is possible; Shift+Tab always keeps normal backward navigation.
- Terminal navigation moves keyboard focus to the requested section.
- The fan-out calculator is an illustrative two-stage model. Its capacity is per
  stage; its outputs are not measurements of the engineering assistant.
- Core reading content, navigation, disclosures and downloads work without
  JavaScript. Calculators display their initial values; interactive agent
  selection and artifact previews require JavaScript.
- Focus indicators, responsive layouts and reduced-motion preferences are
  supported. This is not a claim of a completed accessibility audit.

## Structure

```text
index.html     # content, semantics, metadata and no-JS states
styles.css     # Systems studio tokens, themes and responsive layout
main.js        # language/theme, diagrams, calculators, terminal and previews
assets/        # résumé, social image, icons and self-hosted fonts
assets/fonts/  # DM Sans and DM Serif Display, with SIL Open Font Licenses
lab/           # downloadable engineering templates
robots.txt
sitemap.xml
CNAME
```

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Serve over HTTP so the Lab can fetch its Markdown
files. No install or build is required.

## Regression checks

With Node.js installed, run `node --test tests/*.test.js`. The tests exercise the
production script with small DOM fixtures, covering SLO synchronization, terminal
navigation and Tab handling, and artifact selection/loading/request races. They
add no browser runtime dependencies. Also run `node --check main.js` and
`git diff --check`.

The local browser review covered EN/IT and light/dark at 320, 390, 768, 1024 and
1280 pixels. It verified native keyboard activation, focus navigation, both
calculators, and all five Markdown previews/downloads. Mobile navigation wraps
at narrow widths, and the selected orchestrator retains a distinct focus ring.
These checks do not replace a screen-reader audit or confirmation of professional
claims.

## Review before publishing

Check the page at desktop and mobile widths in both languages and themes. Try
agent selection by keyboard, the principle disclosures, both calculators, the
Lab downloads and terminal commands. Confirm the résumé, contact links and
professional claims before merging a redesign into `main`.

## Fonts

DM Sans and DM Serif Display are self-hosted Latin WOFF2 subsets from Google
Fonts. Their SIL Open Font Licenses are included in `assets/fonts/`. The Latin
subsets include the accented characters used by the Italian translation. The
sans font is variable (weights 400–700); the serif has normal and italic faces.
