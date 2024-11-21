import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpPage from './app/(auth)/sign-up/page';
import LoginPage from './app/(auth)/log-in/page';
import WelcomePage from './components/welcome'; // Import the WelcomePage

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign Up"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Log In"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
