

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BudgetVsExpenseChart from '../screens/components/BudgetVsExpenseChart';


import Ionicons from 'react-native-vector-icons/Ionicons';


const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

const [currentBudget, setCurrentBudget] = useState();


  const fetchTransactionsAndSummary = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please login again.');
        navigation.replace('Login');
        return;
      }

      const response = await axios.get('https://finance-tracker-m0n1.onrender.com/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        setTransactions(response.data);
        let totalIncome = 0;
        let totalExpenses = 0;

        response.data.forEach(transaction => {
          if (transaction.type === 'income') totalIncome += transaction.amount;
          else if (transaction.type === 'expense') totalExpenses += transaction.amount;
        });

        setSummary({ totalIncome, totalExpenses, balance: totalIncome - totalExpenses });
      } else {
        Alert.alert('Error', 'Unexpected API response format');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch data');
    }
  };

  

  // const [currentBudget, setCurrentBudget] = useState();
  
  const fetchBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
  

      if (!token || !userId) 
        {
          console.log('Token or User ID is missing');
          return;}
      
      console.log('Fetching budget with token:', token, 'and userId:', userId);
      const response = await axios.get(`https://finance-tracker-m0n1.onrender.com/api/budget/budget`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, month: selectedMonth, year: selectedYear }, // Pass selectedMonth & selectedYear if needed
      });
      console.log('API Response:', response.data)
      setCurrentBudget(response.data.budget || 0); // Set the fetched budget value
      // setCurrentBudget(response.data.budget || 0); 
    } catch (error) {
      console.log('Error fetching budget:', error.response?.data || error.message);
    }
  };
 


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused, fetching data');
      fetchTransactionsAndSummary();
      fetchBudget();
    });
    return unsubscribe;
  }, [navigation]);
  

  return (
    
      <View style={styles.container}>
        <Text style={styles.header}>Achieve Financial Goals 🎯</Text>
        
  
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.card, { backgroundColor: '#d1f5d3' }]}>
            {/* <Ionicons name="arrow-down-circle-outline" size={24} color="green" /> */}
            <Text style={styles.amount}>💰</Text>
            <Text style={styles.cardTitle}>Income</Text>
            <Text style={styles.amount}>₹{summary.totalIncome}</Text>
          </View>
  
          <View style={[styles.card, { backgroundColor: '#fbdada' }]}>
            {/* <Ionicons name="arrow-up-circle-outline" size={24} color="red" /> */}
            <Text style={styles.amount}>💸</Text>
            <Text style={styles.cardTitle}>Expense</Text>
            <Text style={styles.amount}>₹{summary.totalExpenses}</Text>
          </View>
  
          <View style={[styles.card, { backgroundColor: '#d6eaff' }]}>
            {/* <Ionicons name="wallet-outline" size={24} color="#3478f6" /> */}
            <Text style={styles.amount}>⚖️</Text>
            <Text style={styles.cardTitle}>Balance</Text>
            <Text style={styles.amount}>₹{summary.balance}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#e0f7fa' }]}>
            {/* <Ionicons name="wallet-outline" size={24} color="#3478f6" /> */}
            <Text style={styles.amount}>📊</Text>
            <Text style={styles.cardTitle}>Current Budget</Text>
            <Text style={styles.amount}>₹{currentBudget}</Text>
          </View>

          

          
        </View>
  
 

<TouchableOpacity
  style={styles.actionButton}
  onPress={() =>
    navigation.navigate('BudgetVsExpenseChart', {
      budget: currentBudget,
      expense: summary.totalExpenses,
    })
  }
>
  <Text style={styles.chartEmoji}>📊</Text>
  <Text style={styles.actionButtonText}>View Budget vs Expense</Text>
</TouchableOpacity>



        
        {/* Charts Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ChartScreen', { summary })}>
          {/* <Ionicons name="pie-chart" size={20} color="#fff" /> */}
          <Text style={styles.chartEmoji}>💹</Text> 
          <Text style={styles.actionButtonText}>View Charts</Text>
        </TouchableOpacity>
  
        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionText}>{item.description}</Text>
              <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
                {item.type === 'income' ? '+' : '-'}₹{item.amount}
              </Text>
            </View>
          )}
        />
  
        {/* Bottom Buttons */}
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('BudgetMonthScreen')}>
          <Text style={styles.bottomButtonText}>Manage Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('TransactionsScreen')}>
          <Text style={styles.bottomButtonText}>Manage Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomButton, { backgroundColor: '#ff4d4d' }]}
          onPress={async () => {
            await AsyncStorage.removeItem('authToken');
            navigation.replace('Login');
          }}
        >
          <Text style={styles.bottomButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '22%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#4b7bec',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    gap: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%', // Ensure that the scrollable content is wide enough
  },
  scrollText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    paddingRight: 30, // Add some space to the end for scroll
    paddingLeft: 15, // Add some space to the start for scroll
    lineHeight: 28,
  },
});
