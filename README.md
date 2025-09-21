![Kyber Vision Mobile Logo](./src/assets/images/multi-use/kyberVisionLogo01.png)

#### v 0.21.0

## Overview

The app is built using React Native and Expo and TypeScript. Volley ball training and analysis app.

### Folder Structure

```
.
├── app.json
├── CLAUDE.md
├── docs
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA_OVERVIEW.md
│   ├── DOCS_OVERVIEW.md
│   ├── kyber-vision-mobile-18-ref
│   └── TS_CONVERSION_STATUS.md
├── eslint.config.js
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── app
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── review
│   │   │   ├── ReviewSelection.tsx
│   │   │   ├── ReviewVideo.tsx
│   │   │   ├── ScriptingSyncVideo.tsx
│   │   │   ├── ScriptingSyncVideoSelection.tsx
│   │   │   └── UploadVideo.tsx
│   │   ├── scripting
│   │   │   ├── ScriptingLive.tsx
│   │   │   ├── ScriptingLiveSelectPlayers.tsx
│   │   │   └── ScriptingLiveSelectSession.tsx
│   │   ├── user-admin
│   │   │   ├── AdminSettings.tsx
│   │   │   ├── AdminSettingsPlayerCard.tsx
│   │   │   ├── AdminSettingsUserCard.tsx
│   │   │   └── CreateTeam.tsx
│   │   └── welcome
│   │       ├── Home.tsx
│   │       ├── Login.tsx
│   │       ├── Logout.tsx
│   │       ├── Register.tsx
│   │       ├── SelectTeam.tsx
│   │       └── Splash.tsx
│   ├── assets
│   │   ├── expo-assets
│   │   │   ├── adaptive-icon.png
│   │   │   ├── favicon.png
│   │   │   ├── icon.png
│   │   │   └── splash-icon.png
│   │   ├── fonts
│   │   │   ├── ApfelGrotezk-Fett.otf
│   │   │   ├── ApfelGrotezk-Mittel.otf
│   │   │   ├── ApfelGrotezk-Regular.otf
│   │   │   ├── ApfelGrotezk-RegularBrukt.otf
│   │   │   ├── ApfelGrotezk-Satt.otf
│   │   │   └── Caveat-VariableFont_wght.ttf
│   │   └── images
│   │       ├── multi-use
│   │       ├── review
│   │       ├── screen-frame
│   │       ├── scripting
│   │       ├── user-admin
│   │       └── welcome
│   ├── components
│   │   ├── buttons
│   │   │   ├── ButtonKvImage.tsx
│   │   │   ├── ButtonKvNoDefault.tsx
│   │   │   ├── ButtonKvNoDefaultTextOnly.tsx
│   │   │   ├── ButtonKvStd.tsx
│   │   │   └── SwitchKvWhite.tsx
│   │   ├── modals
│   │   │   ├── ModalAdminSettingsDeletePlayerUserLinkYesNo.tsx
│   │   │   ├── ModalAdminSettingsInviteToSquad.tsx
│   │   │   ├── ModalAdminSettingsPlayerCardLinkUser.tsx
│   │   │   ├── ModalCreateSession.tsx
│   │   │   ├── ModalTeamAddPlayer.tsx
│   │   │   ├── ModalTeamYesNo.tsx
│   │   │   ├── ModalUploadVideo.tsx
│   │   │   └── ModalUploadVideoYesNo.tsx
│   │   ├── review
│   │   │   ├── ReviewVideoLandscape.tsx
│   │   │   ├── ReviewVideoPortrait.tsx
│   │   │   └── Timeline.tsx
│   │   ├── screen-frames
│   │   │   ├── ScreenFrame.tsx
│   │   │   ├── ScreenFrameWithTopChildren.tsx
│   │   │   ├── ScreenFrameWithTopChildrenSmall.tsx
│   │   │   └── ScreenFrameWithTopChildrenSmallLandscape.tsx
│   │   ├── scripting
│   │   │   ├── ScriptingLiveLandscape.tsx
│   │   │   └── ScriptingLivePortrait.tsx
│   │   └── swipe-pads
│   │       └── SwipePad.tsx
│   ├── data
│   │   ├── reviewReducerOffline.ts
│   │   ├── scriptReducerOffline.ts
│   │   ├── teamReducerOffline.ts
│   │   └── userReducerOffline.ts
│   ├── reducers
│   │   ├── review.ts
│   │   ├── script.ts
│   │   ├── sync.ts
│   │   ├── team.ts
│   │   ├── upload.ts
│   │   └── user.ts
│   └── types
│       ├── navigation.ts
│       ├── store.ts
│       ├── svg.d.ts
│       └── user-admin.ts
└── tsconfig.json
```

## Kyber Vision Mobile 21 TypeScript Documentation

- [Documentation Overview](./docs/DOCS_OVERVIEW.md)
  - [API Reference](./docs/API_REFERENCE.md)
  - [Database Schema Overview](./docs/DATABASE_SCHEMA_OVERVIEW.md)

## Google Sign In

For example see the [kyber-vision-mobile-12 github repo](https://github.com/costa-rica/kyber-vision-mobile-12) specifically the splash screen
