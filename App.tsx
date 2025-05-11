import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from './components/Login';
import HomeScreen from './components/HomePage';


// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  Home: { email?: string };
};

// Create a stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
        contentStyle: {
          flex: 1,
          top:'15%',
          // justifyContent: 'center',
          // alignItems: 'center',
        },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
        headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
