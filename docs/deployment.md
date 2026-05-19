# Deployment

## Selected hosting target

GitHub Pages.

## Development and publishing workflow

Carlos uses two GitHub contexts:

- `carlossuarez_microsoft` for private working repositories.
- `carlossuarez_msft` for enterprise GitHub Pages publishing.

Recommended workflow:

1. Scaffold and develop locally in `C:\repos\microsoft-ai-security-navigator`.
2. Push private working repo to `carlossuarez_microsoft/microsoft-ai-security-navigator`.
3. When ready, mirror or publish a release-ready branch/repo to `carlossuarez_msft`.
4. Enable GitHub Pages from the published repo.

## Vite base path

For GitHub Pages under a repo path:

```powershell
$env:VITE_BASE_PATH="/microsoft-ai-security-navigator/"
npm run build
```

For local preview:

```powershell
npm run build
npm run preview
```

## Future automation

Add GitHub Actions once the publishing repo is created and the final owner/org is confirmed.
