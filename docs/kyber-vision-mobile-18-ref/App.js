import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SelectTeamScreen from "./screens/SelectTeamScreen";
// import CreateTribeScreen from "./screens/CreateTribeScreen";
import CreateTeamScreen from "./screens/CreateTeamScreen";
import HomeScreen from "./screens/HomeScreen";
import ScriptingLive from "./screens/ScriptingLive";
import ScriptingLiveSelectPlayers from "./screens/ScriptingLiveSelectPlayers";
import ReviewSelectionScreen from "./screens/ReviewSelection";
import ReviewVideo from "./screens/ReviewVideo";
import ScriptingLiveSelectSession from "./screens/ScriptingLiveSelectSession";
import UploadVideoScreen from "./screens/UploadVideoScreen";
import ScriptingSyncVideoSelection from "./screens/ScriptingSyncVideoSelection";
import ScriptingSyncVideo from "./screens/ScriptingSyncVideo";
import AdminSettings from "./screens/AdminSettings";
import AdminSettingsPlayerCard from "./screens/AdminSettingsPlayerCard";
import AdminSettingsUserCard from "./screens/AdminSettingsUserCard";
import RegisterScreen from "./screens/RegisterScreen";
import LogoutScreen from "./screens/LogoutScreen";

import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import review from "./reducers/review";
import script from "./reducers/script";
import upload from "./reducers/upload";
import sync from "./reducers/sync";
import team from "./reducers/team";

import * as Font from "expo-font";
import { useState, useEffect } from "react";

// Persistence
import { PersistGate } from "redux-persist/integration/react";

// 1. Persist config for user only
const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
};

// 2. Wrap only user reducer with persistReducer
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, user), // persisted
  script, // not persisted
  review,
  upload,
  sync,
  team,
});

// 3. Create store using rootReducer
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// const reducers = combineReducers({ user, script, review, upload, sync, team });

// const persistConfig = { key: "applicationName", storage: AsyncStorage };

// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

const persistor = persistStore(store);

export default function App() {
  const Stack = createNativeStackNavigator();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ApfelGrotezk: require("./assets/fonts/ApfelGrotezk-Regular.otf"),
        ApfelGrotezkSemiBold: require("./assets/fonts/ApfelGrotezk-Mittel.otf"),
        ApfelGrotezkBold: require("./assets/fonts/ApfelGrotezk-Fett.otf"),
        ApfelGrotezkSuperBold: require("./assets/fonts/ApfelGrotezk-Satt.otf"),
        Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    console.log("--- font NOT loaded");
  } else {
    console.log("--- font loaded");
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="SelectTeamScreen"
              component={SelectTeamScreen}
            />
            {/* <Stack.Screen
            name="CreateTribeScreen"
            component={CreateTribeScreen}
          /> */}
            <Stack.Screen
              name="CreateTeamScreen"
              component={CreateTeamScreen}
            />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ScriptingLive" component={ScriptingLive} />
            <Stack.Screen
              name="ScriptingLiveSelectPlayers"
              component={ScriptingLiveSelectPlayers}
            />
            <Stack.Screen
              name="ReviewSelectionScreen"
              component={ReviewSelectionScreen}
            />
            <Stack.Screen name="ReviewVideo" component={ReviewVideo} />
            <Stack.Screen
              name="ScriptingLiveSelectSession"
              component={ScriptingLiveSelectSession}
            />
            <Stack.Screen
              name="UploadVideoScreen"
              component={UploadVideoScreen}
            />
            <Stack.Screen
              name="ScriptingSyncVideoSelection"
              component={ScriptingSyncVideoSelection}
            />
            <Stack.Screen
              name="ScriptingSyncVideo"
              component={ScriptingSyncVideo}
            />
            <Stack.Screen name="AdminSettings" component={AdminSettings} />
            <Stack.Screen
              name="AdminSettingsPlayerCard"
              component={AdminSettingsPlayerCard}
            />
            <Stack.Screen
              name="AdminSettingsUserCard"
              component={AdminSettingsUserCard}
            />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
