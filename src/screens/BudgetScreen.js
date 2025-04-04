import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BudgetScreen = () => {
  const [budget, setBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Fetch Budget & Expenses
  const fetchBudgetData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please login again.');
        return;
      }

      // Fetch Budget & Expenses from Backend
      const response = await axios.get('https://finance-tracker-m0n1.onrender.com/api/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setBudget(response.data.budget);
      setTotalExpenses(response.data.totalExpenses);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch budget data');
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Budget vs Spending</Text>

      <BarChart
        data={{
          labels: ['Budget', 'Spent'],
          datasets: [{ data: [budget, totalExpenses] }],
        }}
        width={Dimensions.get('window').width - 40}
        height={250}
        yAxisLabel="₹"
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        }}
        style={{ marginVertical: 20, alignSelf: 'center' }}
      />
    </View>
  );
};

export default BudgetScreen;
