![Kyber Vision Mobile Logo](./src/assets/images/multi-use/kyberVisionLogo01.png)

#### v 0.20.0

## Overview

The app is built using React Native and Expo and TypeScript. It is based on the kyber-vision-mobile-18 React Native Expo app written in JavaScript. The main goal of version 20 is to convert all of kyber-vision-mobile-18 to TypeScript. This app kyber-vision-mobile-20-ts will have some key changes to naming conventions and file organization that will better align with best practices and conventions.

The docs directory contains documentation for the app and the docs/kyber-vision-mobile-18-ref directory contains the previous version of the app that will be the basis for the new TypeScript version of the app. The docs/DOCS_OVERVIEW.md file contains a high level overview of the app including key changes and file organization.

### Folder Structure

```
.
├── app.json
├── docs
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA_OVERVIEW.md
│   ├── DOCS_OVERVIEW.md
│   └── kyber-vision-mobile-18-ref
├── eslint.config.js
├── expo-env.d.ts
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── app
│   │   ├── App.tsx # main app component, root Stack.Navigator
│   │   ├── index.tsx # entry point
│   │   ├── user-admin
│   │   └── welcome
│   │       ├── Login.tsx
│   │       └── Splash.tsx
│   ├── assets
│   │   ├── expo-assets
│   │   │   ├── adaptive-icon.png
│   │   │   ├── favicon.png
│   │   │   ├── icon.png
│   │   │   └── splash-icon.png
│   │   └── images
│   │       ├── multi-use
│   │       ├── screen-frame
│   │       ├── scripting
│   │       ├── user-admin
│   │       └── welcome
│   ├── components
│   │   ├── buttons
│   │   │   └── ButtonKvImage.tsx
│   │   └── screen-frames
│   │       └── ScreenFrame.tsx
│   ├── reducers
│   │   ├── team.ts
│   │   └── user.ts
│   └── types
│       ├── navigation.ts
│       └── svg.d.ts
└── tsconfig.json
```

## Kyber Vision Mobile 20 TypeScript Documentation

- [Documentation Overview](./docs/DOCS_OVERVIEW.md)
  - [API Reference](./docs/API_REFERENCE.md)
  - [Database Schema Overview](./docs/DATABASE_SCHEMA_OVERVIEW.md)
