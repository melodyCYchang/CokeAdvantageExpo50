import { Dispatch } from 'redux';
import * as SecureStore from 'expo-secure-store';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { RootState } from '../store';
import { SECURE_REFRESH_TOKEN_KEY } from '../../config';
import { setStrapiID, setUser } from '.';
import { wpApi } from '../../services/wpApi';
import logoutAsync from './logoutAsync';
import loadActivitiesAsync from './loadActivitiesAsync';
import getPushTokenAsync from './getPushTokenAsync';
import { appendLog } from '../persist';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// Handle background task
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background!');
    // Do something with the notification data
    // dispatch(loadNewActivitiesCountAsync());
    Notifications.getBadgeCountAsync()
      .then((count) => {
        console.log(`setting badge count to ${count + 1}`);
        return Notifications.setBadgeCountAsync(count + 1);
      })
      .then(() => console.log('done'));
  }
);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const startupAsync =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    await ScreenOrientation.unlockAsync();

    const subscription = Notifications.addPushTokenListener((newPushToken) => {
      const { pushToken: oldPushToken } = getState().persist;
      try {
        console.log(
          '🚀 ~ file: startupAsync.ts ~ line 77 ~ addPushTokenListener ~ newPushToken',
          newPushToken
        );

        // if (newPushToken) {
        //   const oldMe = getUser(getState());
        //   if (oldMe) {
        //     console.log('in old me');

        //     const newMe = { ...oldMe };
        //     if (!newMe?.pushTokens) {
        //       newMe.pushTokens = [];
        //     }
        //     const tokenExists = oldMe.pushTokens.find(
        //       (pushToken) => pushToken.pushToken === newPushToken.data
        //     );
        //     if (!tokenExists) {
        //       // if (oldPushToken) {
        //       // Delete old token

        //       newMe.pushTokens = newMe.pushTokens.filter((pushToken) => {
        //         console.log(
        //           '🚀 ~ file: startupAsync.ts ~ line 90 ~ pushToken.pushToken',
        //           pushToken.pushToken,
        //           oldPushToken,
        //           pushToken.pushToken !== oldPushToken,
        //           newPushToken,
        //           pushToken.pushToken !== newPushToken.data,
        //           pushToken.pushToken !== oldPushToken &&
        //             pushToken.pushToken !== newPushToken.data
        //         );

        //         return (
        //           pushToken.pushToken !== oldPushToken &&
        //           pushToken.pushToken !== newPushToken.data
        //         );
        //       });
        //       console.log(
        //         '🚀 ~ file: startupAsync.ts ~ line 110 ~ newMe.pushTokens=newMe.pushTokens.filter ~ newMe.pushTokens',
        //         newMe.pushTokens
        //       );
        //       // }

        //       // Add new token
        //       dispatch(setPushToken(newPushToken.data));
        //       newMe.pushTokens.push({ pushToken: newPushToken.data });

        //       const pushTokenPayload = {
        //         id: newMe.id,
        //         pushTokens: newMe.pushTokens,
        //       };
        //       console.log(
        //         '🚀 ~ file: startupAsync.ts ~ line 115 ~ pushTokenPayload',
        //         pushTokenPayload
        //       );

        //       const pushTokens = await dispatch(
        //         wpApi.endpoints.updatePushTokens.initiate(pushTokenPayload)
        //       );
        //       console.log(
        //         '🚀 ~ file: startupAsync.ts ~ line 136 ~ pushTokens',
        //         pushTokens
        //       );
        //     }
        // }
        // }
      } catch (error) {
        console.log('new push token error', error.message);
      }
    });

    // Handle Push Notifications when in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log('setNotificationHandler - handleNotification');
        dispatch(appendLog('setNotificationHandler - handleNotification'));
        dispatch(loadActivitiesAsync());

        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
      // handleSuccess: async (notificationId: string) => {
      //   console.log('handleSuccess', notificationId);
      // },
    });

    // This will fire if the app is in the foreground or if the user clicks on the notification
    Notifications.addNotificationReceivedListener((response) => {
      console.log('addNotificationReceivedListener');
      dispatch(appendLog('addNotificationReceivedListener'));
      dispatch(loadActivitiesAsync());
      // const url = response.notification.request.content.data.url;
      // Linking.openURL(url);
    });
    // Listen for Notification Clicks or in Foreground
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('addNotificationResponseReceivedListener');
      dispatch(appendLog('addNotificationResponseReceivedListener'));
      dispatch(loadActivitiesAsync());
      // const url = response.notification.request.content.data.url;
      // Linking.openURL(url);
    });

    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    const refreshToken = await SecureStore.getItemAsync(
      SECURE_REFRESH_TOKEN_KEY
    );

    // Logged out, continue
    if (!refreshToken) return true;

    // Check the token
    const { data: me } = await dispatch(wpApi.endpoints.getMe.initiate());
    // console.log('🚀 ~ file: startupAsync.ts ~ line 30 ~ me', me);
    if (!me?.id) {
      console.log('get me failed, logout');
      // get user failed, log the user out
      return dispatch(logoutAsync());
    }

    dispatch(loadActivitiesAsync());

    dispatch(setUser(me));
    dispatch(setStrapiID(me.id));

    await dispatch(getPushTokenAsync());

    return true;
  };

export default startupAsync;
