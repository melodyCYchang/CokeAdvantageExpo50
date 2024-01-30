import { AnyAction, Dispatch } from 'redux';
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import { getUser } from '.';
import { wpApi } from '../../services/wpApi';
import { getPushToken, setPushToken } from '../persist';
import { RootState } from '../store';

const removePushTokenAsync =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const oldMe = getUser(getState());
    const storeToken = getPushToken(getState());
    console.log('🚀 ~ file: logoutAsync.ts ~ line 36 ~ storeToken', storeToken);
    console.log('🚀 ~ file: logoutAsync.ts ~ line 35 ~ oldMe', oldMe);
    if (oldMe && storeToken) {
      console.log('in old me');

      const newMe = { ...oldMe };

      let needToUpdate = false;
      //   // Delete old token
      if (newMe.pushTokens) {
        newMe.pushTokens = newMe.pushTokens.filter((token) => {
          if (token.pushToken === storeToken) needToUpdate = true;
          return token.pushToken !== storeToken;
        });
        console.log(
          '🚀 ~ file: logoutAsync.ts ~ line 110 ~ newMe.pushTokens=newMe.pushTokens.filter ~ newMe.pushTokens',
          newMe.pushTokens
        );
      }

      // remove persistant token
      dispatch(setPushToken(''));

      if (needToUpdate) {
        const pushTokenPayload = {
          id: newMe.id,
          pushTokens: newMe.pushTokens,
        };
        console.log(
          '🚀 ~ file: logoutAsync.ts ~ line 115 ~ pushTokenPayload',
          pushTokenPayload
        );

        await dispatch(
          wpApi.endpoints.updatePushTokens.initiate(pushTokenPayload)
        );
      }
    }
  };

export default removePushTokenAsync;
