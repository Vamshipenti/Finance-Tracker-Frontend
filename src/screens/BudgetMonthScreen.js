


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BudgetMonthScreen = () => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // ✅ Fix: Convert 0-based to 1-based
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentBudget, setCurrentBudget] = useState('');

  // ✅ Fetch Current Month's Budget
  const fetchBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId'); // ✅ Get userId
      if (!token || !userId) return;

      const response = await axios.get(`https://finance-tracker-m0n1.onrender.com/api/budget/budget`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, month: selectedMonth, year: selectedYear }, // ✅ Send correct query params
      });

      setCurrentBudget(response.data.budget || 0);
    } catch (error) {
      console.log('Error fetching budget:', error.response?.data || error.message);
    }
  };

  // ✅ Save or Update Budget for Selected Month
  const saveBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId'); // ✅ Get userId
      if (!token || !userId) return;

      const budgetData = {
        userId, // ✅ Include userId
        month: selectedMonth,
        year: selectedYear,
        amount: parseFloat(budgetAmount),
      };

      await axios.post('https://finance-tracker-m0n1.onrender.com/api/budget/budget', budgetData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Monthly Budget Saved!');
      fetchBudget(); // ✅ Refresh budget display
    } catch (error) {
      console.log('Error saving budget:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save budget');
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth, selectedYear]); // ✅ Re-fetch when month/year changes

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Your Monthly Budget</Text>
      
      {/* Month & Year Selection */}
      <View style={styles.dateSelection}>
        <Text style={styles.dateText}>{`${selectedYear} - ${selectedMonth}`}</Text>
      </View>

      {/* Budget Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter Budget Amount:</Text>
        <TextInput
          placeholder="₹ Enter amount"
          keyboardType="numeric"
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          style={styles.input}
        />
      </View>

      {/* Save Budget Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
        <Text style={styles.saveButtonText}>Save Budget</Text>
      </TouchableOpacity>

      {/* Current Budget Display */}
      <View style={styles.budgetDisplay}>
        <Text style={styles.budgetLabel}>Current Budget:</Text>
        <Text style={styles.budgetAmount}>₹ {currentBudget}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateSelection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  budgetDisplay: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 24,
    color: '#00796b',
    fontWeight: '700',
    marginTop: 10,
  },
});

export default BudgetMonthScreen;
