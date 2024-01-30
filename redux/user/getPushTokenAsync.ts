import { AnyAction, Dispatch } from 'redux';
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getUser } from '.';
import { wpApi } from '../../services/wpApi';
import { setPushToken } from '../persist';
import { RootState } from '../store';

const getPushTokenAsync =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    let newPushToken: string;

    const oldMe = getUser(getState());
    console.log('🚀 ~ file: getPushTokenAsync.ts ~ line 16 ~ oldMe', oldMe);

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowSound: true,
            allowBadge: true,
          },
        });
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('could not register for push notifications');
        return;
      }
      //   const { notificationsStatus } = getState().persist;
      //   console.log(
      //     '🚀 ~ file: getPushTokenAsync.ts ~ line 42 ~ notificationsStatus',
      //     notificationsStatus
      //   );
      //   if (notificationsStatus === 'granted') {
      newPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(
        '🚀 ~ file: getPushTokenAsync.ts ~ line 40 ~ pushToken',
        newPushToken
      );

      if (newPushToken) {
        dispatch(setPushToken(newPushToken));
        // console.log('🚀 ~ file: getPushTokenAsync.ts ~ line 57 ~ oldMe', oldMe);
        if (oldMe) {
          //   console.log('in old me');

          if (!oldMe?.pushTokens) {
            oldMe.pushTokens = [];
          }

          //   console.log('in old me');
          const tokenExists = oldMe.pushTokens.find(
            (pushToken) => pushToken.pushToken === newPushToken
          );
          if (!tokenExists) {
            const newPushTokensArray = [...oldMe.pushTokens];

            // Add new token
            newPushTokensArray.push({ pushToken: newPushToken });

            const pushTokenPayload = {
              id: oldMe.id,
              pushTokens: newPushTokensArray,
            };
            //   console.log(
            //     '🚀 ~ file: getPushTokenAsync.ts ~ line 57 ~ pushTokenPayload',
            //     pushTokenPayload
            //   );
            const pushTokens = dispatch(
              wpApi.endpoints.updatePushTokens.initiate(pushTokenPayload)
            );
            console.log(
              '🚀 ~ file: getPushTokenAsync.ts ~ line 76 ~ pushTokens',
              pushTokens
            );
          }
        }
      }
    }

    return newPushToken;
  };

export default getPushTokenAsync;
