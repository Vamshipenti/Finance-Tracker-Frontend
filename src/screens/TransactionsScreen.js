import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
 // const [alertShown, setAlertShown] = useState(false); 

  useEffect(() => {
    fetchTransactions();
    fetchBudget();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found! Please log in again.');
        return;
      }
  
      const response = await axios.get('https://finance-tracker-m0n1.onrender.com/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTransactions(response.data);
    } catch (error) {
      console.error('Fetch Transactions Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
  
      if (!token || !userId) {
        Alert.alert('Error', 'User not authenticated! Please log in again.');
        return;
      }
  
      const response = await axios.get(
        `https://finance-tracker-m0n1.onrender.com/api/budget/budget?userId=${userId}&month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setBudget(response.data.budget);
    } catch (error) {
      console.error('Fetch Budget Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch budget');
    }
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddTransaction = async (newTransaction) => {
    if (newTransaction.type === 'expense') {
      const remainingBudget = budget - getCurrentMonthExpenses();
      
      if (remainingBudget < newTransaction.amount) {
      
        Alert.alert('Budget Limit Exceeded', 'This expense exceeds your monthly budget!');
        
        return;
      }
    }
    saveTransaction(newTransaction);
  };
  

  const saveTransaction = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      if (editingTransaction) {
        await axios.put(`https://finance-tracker-m0n1.onrender.com/api/transactions/${editingTransaction._id}`, newTransaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Success', 'Transaction updated successfully!');
      } else {
        await axios.post('https://finance-tracker-m0n1.onrender.com/api/transactions', newTransaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Success', 'Transaction added successfully!');
      }

      setNewTransaction({ title: '', amount: '', category: '', description: '', type: 'expense' });
      setEditingTransaction(null);
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await axios.delete(`https://finance-tracker-m0n1.onrender.com/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Transaction deleted!');
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    type: 'expense',
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const totalMonthlyExpense = getCurrentMonthExpenses();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  useEffect(() => {
    if (totalMonthlyExpense > budget) {
    
    }
  }, [totalMonthlyExpense, budget]);

  

return (
  <FlatList
    
    data={transactions.filter((t) => {
      const matchesType = selectedType === 'all' || t.type === selectedType;
      const matchesDate = !selectedDate || new Date(t.date).toISOString().split('T')[0] === selectedDate;
      return matchesType && matchesDate;
    })}
    keyExtractor={(item) => item._id}
    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
    renderItem={({ item }) => (
      <View style={styles.transactionCard}>
        <Text style={styles.transactionTitle}>{item.title}: ₹{item.amount}</Text>
        <Text style={styles.transactionDetails}>Category: {item.category}</Text>
        <Text style={styles.transactionDetails}>Description: {item.description}</Text>
        <Text style={styles.transactionDetails}>Type: {item.type === 'income' ? 'Income' : 'Expense'}</Text>
        <View style={styles.transactionButtons}>
          <Button
            title="Edit"
            onPress={() => {
              setEditingTransaction(item);
              setNewTransaction({
                title: item.title,
                amount: item.amount.toString(),
                category: item.category,
                description: item.description,
                type: item.type,
              });
            }}
          />
          <Button
            title="Delete"
            onPress={() => deleteTransaction(item._id)}
            color="red"
          />
        </View>
      </View>
    )}
    ListHeaderComponent={
      <>

<View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Total Income: ₹{totalIncome}</Text>
            <Text style={styles.summaryText}>Total Expenses: ₹{totalExpense}</Text>
            <Text style={styles.summaryText}>Budget: ₹{budget}</Text>
          </View>
        <TextInput
          placeholder="Title"
          value={newTransaction.title}
          onChangeText={(text) => setNewTransaction({ ...newTransaction, title: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          value={newTransaction.amount}
          onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Picker
          selectedValue={newTransaction.category}
          onValueChange={(itemValue) =>
            setNewTransaction({ ...newTransaction, category: itemValue })
          }
          style={styles.picker}>
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Transport" value="transport" />
          <Picker.Item label="Shopping" value="shopping" />
          <Picker.Item label="Entertainment" value="entertainment" />
          <Picker.Item label="Health" value="health" />
          <Picker.Item label="Salary/Others" value="salary" />
        </Picker>

        <TextInput
          placeholder="Description"
          value={newTransaction.description}
          onChangeText={(text) =>
            setNewTransaction({ ...newTransaction, description: text })
          }
          style={styles.input}
        />

        <Text style={styles.label}>Transaction Type</Text>
        <Picker
          selectedValue={newTransaction.type}
          onValueChange={(value) =>
            setNewTransaction({ ...newTransaction, type: value })
          }
          style={styles.picker}>
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>

        <Button
          title={editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          onPress={() => handleAddTransaction(newTransaction)}
          color="#4CAF50"
        />

        
<View style={styles.container}>
          

          <Text style={styles.filterLabel}>Filter by Type:</Text>
          <Picker
            selectedValue={selectedType}
            onValueChange={(value) => setSelectedType(value)}
            style={styles.picker}>
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>

          <Text style={styles.filterLabel}>Filter by Date (YYYY-MM-DD):</Text>
          <TextInput
            placeholder="Enter Date"
            value={selectedDate}
            onChangeText={(text) => setSelectedDate(text)}
            style={styles.input}
          />
        </View>
      </>
    }
  />
);
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  filterLabel: {
    fontSize: 16,
    marginTop: 15,
  },
  transactionCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    minHeight: 100,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  transactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

export default TransactionsScreen;
