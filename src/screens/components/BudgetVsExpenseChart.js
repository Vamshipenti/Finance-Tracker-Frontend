// import React from 'react';
// import { View, Text, Dimensions } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const BudgetVsExpenseChart = ({ route }) => {
//   const { budget, expense } = route.params;

//   const data = {
//     labels: ['Budget', 'Expense'],
//     datasets: [
//       {
//         data: [budget, 0], // Budget bar only
//         colors: [(opacity = 1) => `rgba(30, 144, 255, ${opacity})`] // Blue
//       },
//       {
//         data: [0, expense], // Expense bar only
//         colors: [(opacity = 1) => `rgba(34, 139, 34, ${opacity})`] // Green
//       }
//     ]
//   };

//   const chartConfig = {
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     decimalPlaces: 0,
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>
//         Budget vs Expense
//       </Text>
//       <BarChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         yAxisLabel="₹"
//         fromZero
//         showValuesOnTopOfBars
//         chartConfig={chartConfig}
//         withInnerLines={false}
//         style={{
//           borderRadius: 8,
//         }}
//         // Enable custom bar colors
//         withCustomBarColorFromData={true}
//         flatColor={true}
//       />
//     </View>
//   );
// };

// export default BudgetVsExpenseChart;

import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const BudgetVsExpenseChart = ({ route }) => {
  const { budget, expense } = route.params;

  const data = {
    labels: ['Budget', 'Expense'],
    datasets: [
      {
        data: [budget, expense],
        colors: [
          (opacity = 1) => `rgba(30, 144, 255, ${opacity})`, // Blue for Budget
          (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,  // Green for Expense
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Budget vs Expense
      </Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={250}
        yAxisLabel="₹"
        fromZero
        showValuesOnTopOfBars
        chartConfig={chartConfig}
        withInnerLines={false}
        withCustomBarColorFromData={true}
        flatColor={true}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default BudgetVsExpenseChart;
