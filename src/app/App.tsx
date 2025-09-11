import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./welcome/Splash";
import Login from "./welcome/Login";
import Register from "./welcome/Register";
import Logout from "./welcome/Logout";
import SelectTeam from "./welcome/SelectTeam";

import type { RootStackParamList } from "../types/navigation";
const Stack = createNativeStackNavigator<RootStackParamList>();

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../types/store";

const Index = () => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Splash" component={Splash} />
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Logout" component={Logout} />
						<Stack.Screen name="SelectTeam" component={SelectTeam} />
					</Stack.Navigator>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default Index;
