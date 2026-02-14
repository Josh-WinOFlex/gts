# GTS Hosting

A professional static website hosting solution for maintenance and deployment.

## Features

- **Fast & Reliable**: Lightning-fast static content delivery
- **Easy Deployment**: Automated deployment via GitHub Actions
- **Secure**: HTTPS enabled by default
- **Responsive**: Mobile-friendly design

## Viewing the Site

The static website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

View the live site at: `https://josh-winoflex.github.io/gts/`

## Local Development

To view the site locally, simply open `index.html` in your web browser:

```bash
open index.html
```

Or use a local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions. The workflow is triggered on:
- Push to `main` branch
- Manual workflow dispatch

## Files

- `index.html` - Main HTML page
- `styles.css` - Styling for the website
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow

## License

All rights reserved © 2026 GTS Hosting
