# Documentation Overview

This file serves as the entry point for all documentation located in the `docs` directory. Use it to navigate and understand the structure and contents of the documentation resources for this project.

## Legacy JavaScript Files

The `docs/kyber-vision-mobile-18-ref` directory contains JavaScript files, assets, and key configuration files from the previous project version. These files are intended to be converted into TypeScript for the current codebase.

## Additional Documentation

- See [`API_REFERENCE.md`](API_REFERENCE.md) for documentation on API endpoints.
- See [`DATABASE_SCHEMA_OVERVIEW.md`](DATABASE_SCHEMA_OVERVIEW.md) for details on the database schema.

## Docs Directory Structure

```
docs
├── DOCS_OVERVIEW.md         # entry point for all documentation
├── API_REFERENCE.md         # API endpoints
├── DATABASE_SCHEMA_OVERVIEW.md
└── kyber-vision-mobile-18-ref/   # old JS files for conversion
```

### Key Changes

- src/ is the root directory for the app
- screens will be in the src/app directory
- components will be in the src/components directory
- assets will be in the src/assets directory
- reducers will be in the src/reducers directory
- types will be in the src/types directory
- The kyber-vision-mobile-18 app used "TemplateView" and the name for the component that was used that the framing of the screens in the app. The kyber-vision-mobile-20 app will use "ScreenFrame" for this purpose. There will also be variations to the ScreenFrame component for different use cases. Such as potentaillly "ScreenFrameWithTopChildren".
- API routes renamed (routes are all plural)
  - KyberVision18API used `/contract-player-user/` , but KyberVision20API uses `/contract-player-users/`
  - KyberVision18API used `/contract-team-user/` , but KyberVision20API uses `/contract-team-users/`
