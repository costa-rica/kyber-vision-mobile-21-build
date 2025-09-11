# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run start` - Start Expo development server (includes TypeScript check)
- `npm run prestart` - Run TypeScript check without emitting files
- `npm run typecheck` - Check TypeScript types without emitting files
- `npm run typecheck:watch` - Watch mode for TypeScript checking
- `npm run lint` - Run ESLint using Expo configuration
- `npm run android` - Start development server for Android
- `npm run ios` - Start development server for iOS
- `npm run web` - Start development server for web

## Project Architecture

### Core Structure
This is a React Native Expo TypeScript app (version 20) converted from a JavaScript version (kyber-vision-mobile-18). The main entry point is `src/app/index.tsx`, but the root navigation container with Stack.Navigator is in `src/app/App.tsx`.

### Key Directories
- `src/app/` - Screen components organized by feature (welcome/, user-admin/)
- `src/components/` - Reusable UI components (buttons/, screen-frames/)
- `src/types/` - TypeScript type definitions
- `src/reducers/` - State management (team.ts, user.ts)
- `src/assets/` - Images and other static assets
- `docs/` - Documentation and reference files from previous version

### Navigation
- Uses React Navigation v7 with native stack navigator
- Typed navigation with `RootStackParamList` in `src/types/navigation.ts`
- Screen props are typed using `NativeStackScreenProps<RootStackParamList, ScreenName>`

### Component Conventions
- **ScreenFrame**: Replaces the previous "TemplateView" component for screen framing
- **ButtonKvImage**: Custom button component for image-based buttons
- Components use TypeScript with proper prop typing

### Asset Management
- SVG support configured via `react-native-svg-transformer` in metro.config.js
- SVG modules declared in `src/types/svg.d.ts`
- Images organized by usage: multi-use/, screen-frame/, scripting/, user-admin/, welcome/

### API Changes from v18
- Routes are now plural: `/contract-player-users/` instead of `/contract-player-user/`
- Routes are now plural: `/contract-team-users/` instead of `/contract-team-user/`

### TypeScript Configuration
- Strict TypeScript checking runs before development server starts
- Watch mode available for continuous type checking during development