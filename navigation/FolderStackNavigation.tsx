import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FolderScreen from '../containers/FolderScreen';
import MediaDisplayScreen from '../containers/MediaDisplayScreen';
import VideoDisplayScreen from '../containers/VideoDisplayScreen';
import ImageDisplayScreen from '../containers/ImageDisplayScreen';
import ChannelPresentationsScreen from '../containers/ChannelPresentationsScreen';
import FreestyleScreen from '../containers/FreestyleScreen';
import TestimonialsScreen from '../containers/TestimonialsScreen';
import DrawerNavigation from './DrawerNavigation';
import ActivitiesScreen from '../containers/ActivitiesScreen';

const FolderStack = createNativeStackNavigator();

const FolderStackNavigation = () => {
  return (
    <FolderStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <FolderStack.Screen name="FolderScreen" component={FolderScreen} />
      <FolderStack.Screen
        name="ChannelPresentationsScreen"
        component={ChannelPresentationsScreen}
      />
      <FolderStack.Screen name="FreestyleScreen" component={FreestyleScreen} />
      <FolderStack.Screen
        name="TestimonialsScreen"
        component={TestimonialsScreen}
      />

      <FolderStack.Screen
        name="MediaDisplayScreen"
        component={MediaDisplayScreen}
      />
      <FolderStack.Screen
        name="VideoDisplayScreen"
        component={VideoDisplayScreen}
      />
      <FolderStack.Screen
        name="ImageDisplayScreen"
        component={ImageDisplayScreen}
      />
    </FolderStack.Navigator>
  );
};

export default FolderStackNavigation;
