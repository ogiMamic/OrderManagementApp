import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RepeatOrderScreen from './screens/RepeatOrderScreen';
import NewOrderScreen from './screens/NewOrderScreen';
import ReportIssueScreen from './screens/ReportIssueScreen';
import KaffemarkenScreen from './screens/KaffemarkenScreen';
import OrdersScreen from './screens/OrdersScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AppProvider } from './context/AppContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RepeatOrder" component={RepeatOrderScreen} />
          <Stack.Screen name="NewOrder" component={NewOrderScreen} />
          <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
          <Stack.Screen name="Kaffemarken" component={KaffemarkenScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}