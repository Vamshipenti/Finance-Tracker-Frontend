import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens (we'll create them next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ChartScreen from '../screens/ChartScreen';
import BudgetScreen from '../screens/BudgetScreen';
import BudgetVsExpenseChart from '../screens/components/BudgetVsExpenseChart'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name = "TranactionScreen" component = {TransactionsScreen}/>
       <Stack.Screen name="ChartScreen" component={ChartScreen} />
       <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
       <Stack.Screen name="BudgetVsExpenseChart" component={BudgetVsExpenseChart} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
