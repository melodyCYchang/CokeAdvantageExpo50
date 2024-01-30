import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../containers/DashboardScreen';
import FolderScreen from '../containers/FolderScreen';

const DashboardStack = createStackNavigator();
function DashboardStackNavigation() {
  return (
    <DashboardStack.Navigator initialRouteName="DashboardScreen">
      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
      />
      <DashboardStack.Screen name="FolderScreen" component={FolderScreen} />
    </DashboardStack.Navigator>
  );
}
export default DashboardStackNavigation;
