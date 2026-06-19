# fabrideci.github.io

Personal site for Fabrizio De Cicco — IoT Infrastructure Architect and Lead DevOps Engineer.

A single-page, static site. No framework, no build step, no dependencies, no trackers. It follows the visitor's system light/dark preference automatically.

## Structure

```
.
├── index.html                          # the entire site (HTML, CSS, JS inline)
├── assets/
│   ├── og.png                          # social-share preview image (1200x630)
│   └── Fabrizio-De-Cicco-Resume.pdf    # add this; the "Résumé" button links to it
└── README.md
```

## Run locally

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

1. Create a public repository named exactly `fabrideci.github.io`.
2. Commit `index.html`, the `assets/` folder, and this README to the default branch.
3. In the repository: Settings → Pages → Build and deployment → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
4. The site goes live at `https://fabrideci.github.io` within a minute or two.

## Before publishing

- Add your résumé at `assets/Fabrizio-De-Cicco-Resume.pdf` (note: a public PDF exposes anything in it, including the phone number in the header — use a redacted copy if you want the phone kept private).
- The social image at `assets/og.png` is referenced by absolute URL in the metadata; keep the path as-is.

## Custom domain (optional)

To use a domain such as `fabriziodecicco.dev`: add a `CNAME` file at the repo root containing the domain, point the domain's DNS at GitHub Pages, then set the custom domain under Settings → Pages.

## Editing

All content lives in `index.html`. Sections are clearly commented (hero, about, how I work, experience, skills, selected work, certifications, contact). The interactive terminal supports `help`, `about`, `stack`, `experience`, `work`, `certs`, `contact`, `resume`, and `clear`; press `/` anywhere to focus it.

## Commits

Conventional Commits: `type(scope): subject` (e.g. `feat(work): add architecture diagram`).
