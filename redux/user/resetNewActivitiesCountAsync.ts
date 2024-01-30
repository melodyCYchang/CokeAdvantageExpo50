import { Dispatch } from 'redux';
import * as Notifications from 'expo-notifications';
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import {
  setLastReadActivityTimestamp,
  setNumberOfUnreadActivities,
} from '../persist';
import { RootState } from '../store';

const resetNewActivitiesCountAsync =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(setLastReadActivityTimestamp(new Date().valueOf()));
    dispatch(setNumberOfUnreadActivities(0));
    await Notifications.setBadgeCountAsync(0);
  };

export default resetNewActivitiesCountAsync;
