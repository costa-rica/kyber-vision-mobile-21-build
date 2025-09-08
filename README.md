![Kyber Vision Mobile Logo](./src/assets/images/multi-use/kyberVisionLogo01.png)

#### v 0.20.0

## Context Prompt for AI

### App Architecture

The app is built using React Native and Expo and TypeScript. It uses a "classic" navigation approach with Stack Navigator. The entry point to the app is the index.tsx file but the App.tsx file is the main app component.

### Folder Structure

```
src/
  app/
    index.tsx        ← entry point, root Stack.Navigator
    App.tsx          ← main app component
    user/            ← user-related screens
      SplashScreen.tsx
      LoginScreen.tsx
      RegisterScreen.tsx
      HomeScreen.tsx
    scripting/
      ScriptingLive.tsx
      ScriptingSelectSession.tsx
    review/
      ReviewVideo.tsx
      ReviewSelection.tsx
    admin/
      AdminSettings.tsx
      AdminUserCard.tsx
    utilities/
      UploadVideoScreen.tsx
  assets/
  reducers/
    review.ts
    script.ts
    sync.ts
    team.ts
    upload.ts
    user.ts
  types/
```
