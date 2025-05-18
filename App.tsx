import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
// Import screens
import LoginScreen from './components/Login';
import HomeScreen from './components/HomePage';
import ImageUploader from './components/ImageUploader';
import { createStackNavigator } from '@react-navigation/stack';
import SavedImagesScreen from './components/SavedImagesScreen';



// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  Home: { email?: string };
  imageUploader: undefined;
  SavedImageScreen : undefined;
};

// Create a stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();



function App() {
  const Stack1 = createStackNavigator();
  const useScheme = useColorScheme();


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
              top: '15%',
              // justifyContent: 'center',
              // alignItems: 'center',
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            contentStyle: {
              flex: 1,
            },
          }}
        />
        <Stack.Screen
          name="imageUploader"
          component={ImageUploader}
          options={{
            title: 'Upload Image',
            contentStyle: {
              flex: 1,
              top: '10%',
            },
          }}
        />
        <Stack.Screen
        name="SavedImageScreen"
        component={SavedImagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
