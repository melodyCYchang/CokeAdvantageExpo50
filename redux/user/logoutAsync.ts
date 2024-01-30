import { AnyAction, Dispatch } from 'redux';
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import * as SecureStore from 'expo-secure-store';
import { CACHE_ACCESS_TOKEN_KEY, SECURE_REFRESH_TOKEN_KEY } from '../../config';
import { resetUser } from '.';
import cache from '../../utils/cache';
import removePushTokenAsync from './removePushTokenAsync';

const logoutAsync = () => async (dispatch: Dispatch<any>) => {
  await dispatch(removePushTokenAsync());
  await SecureStore.setItemAsync(SECURE_REFRESH_TOKEN_KEY, '');
  cache.set(CACHE_ACCESS_TOKEN_KEY, 'accessToken', 0);
  return dispatch(resetUser());
};

export default logoutAsync;
