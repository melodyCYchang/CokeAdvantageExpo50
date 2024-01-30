import { AnyAction, Dispatch } from 'redux';
import * as Notifications from 'expo-notifications';
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import { wpApi } from '../../services/wpApi';
import {
  appendLog,
  getLastReadActivityTimestamp,
  setLastReadActivityTimestamp,
  setNumberOfUnreadActivities,
} from '../persist';
import { RootState } from '../store';
import { setActivities } from '../activities';

const loadNewActivitiesCountAsync =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(appendLog(`started loadNewActivitiesCountAsync`));
    // const activities = await dispatch(wpApi.endpoints.getActivities.initiate());
    const activities = await dispatch(
      wpApi.endpoints.getActivities.initiate(undefined, { forceRefetch: true })
    );
    // console.log(
    //   '🚀 ~ file: loadNewActivitiesCountAsync.ts ~ line 36 ~ activities',
    //   activities?.data
    // );
    if (activities?.data) {
      dispatch(setActivities(activities.data));
      let lastTimestamp = getLastReadActivityTimestamp(getState());

      if (!lastTimestamp) {
        lastTimestamp = new Date().valueOf();
        dispatch(setLastReadActivityTimestamp(lastTimestamp));
      }
      //   console.log(
      //     '🚀 ~ file: loadNewActivitiesCountAsync.ts ~ line 43 ~ lastTimestamp',
      //     lastTimestamp,
      //     typeof lastTimestamp
      //   );
      let count = 0;
      activities.data.forEach((activity) => {
        const createdAtTtime = new Date(activity.created_at).valueOf();

        if (lastTimestamp < createdAtTtime) {
          count += 1;
        }
      });
      dispatch(setNumberOfUnreadActivities(count));
      await Notifications.setBadgeCountAsync(count);

      //   console.log(
      //     '🚀 ~ file: loadNewActivitiesCountAsync.ts ~ line 52 ~ activities.forEach ~ count',
      //     count
      //   );
      dispatch(
        appendLog(`finished loadNewActivitiesCountAsync with a new count of ${count}`)
      );
    }

    return activities;
  };

export default loadNewActivitiesCountAsync;
