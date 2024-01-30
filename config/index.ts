import Constants from 'expo-constants';

export const REDUX_BASE = 'my-app';

// TODO: Remove after Apple Review
export const USE_PASSWORD_LOGIN = false;

export const RELEASE_CHANNEL = Constants?.Manifest?.releaseChannel || '';
export const PRODUCTION = RELEASE_CHANNEL.indexOf('prod') !== -1;

export const SECURE_REFRESH_TOKEN_KEY = 'SECURE_REFRESH_TOKEN_KEY';
export const CACHE_ACCESS_TOKEN_KEY = 'CACHE_ACCESS_TOKEN_KEY';

let BASE_URL = PRODUCTION
  ? 'https://swirecokeadvantagecontainer.azurewebsites.net/'
  : 'https://swirecokeadvantagecontainer-dev.azurewebsites.net/';

// BASE_URL = 'http://127.0.0.1:1337';
// if (__DEV__) {
//   // Changes if we are running in dev
//   BASE_URL = 'http://127.0.0.1:1337/';
// }
// BASE_URL = 'https://swirecokeadvantagecontainer-dev.azurewebsites.net/';

// export const API_BASE_URL = 'https://swiretoolkit.com/api/';
// export const API_BASE_URL = 'http://10.0.0.72:1337/';
export const API_BASE_URL = BASE_URL;
console.log('API_BASE_URL', API_BASE_URL);

export const SCHEME = 'com.swirecc.swirecokeadvantage';
export const SCOPES = ['openid', 'profile', 'email', 'offline_access'];

// psg login
// export const CLIENT_ID = '0d4f862a-66b2-4169-bdf6-0a6d70db2e3e';
// export const TENANT_ID = '7e126df3-21bf-4daf-a908-3c0f1f8b83d9';

// swire login
export const CLIENT_ID = 'af24f4ca-7929-40ca-b023-9b4cb72236fb';
export const TENANT_ID = '11c3d389-d422-481b-8639-cc8ec5aa92b3';

// PSG swire DNS
export const SENTRY_DSN =
  'https://cb4f0b5712db45f1b612acb9225a2536@o562593.ingest.sentry.io/5812870';

// react-native-gesture-handler
export const USE_NATIVE_DRIVER = true;
