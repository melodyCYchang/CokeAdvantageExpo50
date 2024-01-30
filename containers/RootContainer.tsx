import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StatusBar,
  AppState,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';
import { useFonts } from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';

import DrawerNavigation from '../navigation/DrawerNavigation';
import getVersion from '../utils/getVersion';
import LoginLoading from '../components/LoginLoading';
import startupAsync from '../redux/user/startupAsync';
import { setUser } from '../redux/user';
import loadActivitiesAsync from '../redux/user/loadActivitiesAsync';
// import startupAsync from '../redux/user/startupAsync';

let appState = '';

export default function RootContainer() {
  const dispatch = useDispatch();

  // const [appState, setAppState] = useState(AppState.currentState);
  const [initilized, setInitilized] = useState(false);
  // const [updating, setUpdating] = useState(false);
  const [fontsLoaded] = useFonts({
    'Gotham-Light': require('../assets/fonts/gotham-light.ttf'),
    'Gotham-Medium': require('../assets/fonts/gotham-medium.ttf'),
    'Gotham-Bold': require('../assets/fonts/gotham-bold.ttf'),
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // This will trigger when resuming the application
      const handleAppStateChange = async (nextAppState: any) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground.');
          try {
            dispatch(loadActivitiesAsync());
          } catch (err: any) {
            console.log(`loadActivitiesAsync error ${err.message}`);
          }

          try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
              // setUpdating(true);
              await Updates.fetchUpdateAsync();
              // ... notify user of update ...
              await Updates.reloadAsync();
              // setUpdating(false);
            }
          } catch (err: any) {
            // handle or log error
            console.log(`loadActivitiesAsync error ${err.message}`);
          }
        }
        // setAppState(nextAppState);
        appState = nextAppState;
      };

      AppState.addEventListener('change', handleAppStateChange);

      return () => {
        AppState.removeEventListener('change', handleAppStateChange);
      };
    }
  }, [appState]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(startupAsync());
        setInitilized(true);
      } catch (err: any) {
        console.log('startupAsync error:', err.message);
        dispatch(setUser(null));
        setInitilized(true);
      }
    })();
  }, []);

  if (!initilized || !fontsLoaded) {
    return <LoginLoading />;
  }
  // This is run once
  // useEffect(() => {
  //   (async () => {
  //     console.log('Starting startupAsync');
  //     console.log('Ending startupAsync');
  //     setInitilized(true);
  //   })();
  // }, []);

  // return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Text>ROOT HELLO WORLD</Text>
  //     <Text>{getVersion()}</Text>
  //   </View>
  // );

  return <DrawerNavigation />;
}

// const mapStateToProps = ({ app: { initilized } }) => ({
//   initilized,
// });

// // wraps dispatch to create nicer functions to call within our component
// const mapDispatchToProps = (dispatch) => ({
//   startup: () => dispatch(StartupActions.startup()),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
