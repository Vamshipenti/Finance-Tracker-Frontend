import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const ChartScreen = ({ route }) => {
  const { summary } = route.params || { totalIncome: 0, totalExpenses: 0 }; // Default values to prevent errors

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Income vs Expense Chart</Text>
      
      <PieChart
        data={[
          { name: 'Income', amount: summary.totalIncome, color: 'green', legendFontColor: 'black', legendFontSize: 15 },
          { name: 'Expense', amount: summary.totalExpenses, color: 'red', legendFontColor: 'black', legendFontSize: 15 }
        ]}
        width={330}
        height={200}
        chartConfig={{ backgroundColor: 'white', backgroundGradientFrom: 'white', backgroundGradientTo: 'white', color: () => 'black' }}
        accessor="amount"
        backgroundColor="transparent"
        style={{ marginLeft: 50 }}
      />
    </View>
  );
};

export default ChartScreen;
