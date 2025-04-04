import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import ChartScreen from './src/screens/ChartScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import BudgetMonthScreen from "./src/screens/BudgetMonthScreen";
import BudgetVsExpenseChart from './src/screens/components/BudgetVsExpenseChart'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} options={{ title: 'Manage Transactions' }} />
        <Stack.Screen name="ChartScreen" component={ChartScreen} />
        <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
        <Stack.Screen name="BudgetMonthScreen" component={BudgetMonthScreen} />
        <Stack.Screen name="BudgetVsExpenseChart" component={BudgetVsExpenseChart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}