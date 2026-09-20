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
