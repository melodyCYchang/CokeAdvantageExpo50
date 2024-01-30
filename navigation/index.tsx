import React, { useRef } from 'react';
import * as Analytics from 'expo-firebase-analytics';
import { NavigationContainer } from '@react-navigation/native';

import RootContainer from '../containers/RootContainer';

const Navigation = () => {
  const navigationRef: any = useRef();
  const routeNameRef = useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await Analytics.setCurrentScreen(currentRouteName, currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
      <RootContainer />
    </NavigationContainer>
  );
};

export default Navigation;
