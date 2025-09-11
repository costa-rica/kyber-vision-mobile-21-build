![Kyber Vision Mobile Logo](./src/assets/images/multi-use/kyberVisionLogo01.png)

#### v 0.20.0

## Overview

The app is built using React Native and Expo and TypeScript. It uses a "classic" navigation approach with Stack Navigator. The entry point to the app is the index.tsx file but the App.tsx file is the main app component.

The /docs directory contains documentation for the app and the /kyber-vision-mobile-18-ref directory contains the previous version of the app that will be the basis for the new TypeScript version of the app. There will be some key changes to naming conventions and file organization.

### Folder Structure

```
.
├── app.json
├── docs
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
│   └── types
│       ├── navigation.ts
│       └── svg.d.ts
└── tsconfig.json
```
