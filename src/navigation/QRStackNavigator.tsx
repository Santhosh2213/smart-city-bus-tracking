// // /src/navigation/QRStackNavigator.tsx
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { QRStackParamList } from './types';
// import QRScanScreen from '../screens/QR/QRScanScreen';

// const Stack = createStackNavigator<QRStackParamList>();

// const QRStackNavigator: React.FC = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="QRScan"
//         component={QRScanScreen}
//         options={{ headerTitle: 'Scan QR Code' }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default QRStackNavigator;