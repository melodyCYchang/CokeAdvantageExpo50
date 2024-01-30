import assert from 'assert';
import { refreshAsync, fetchDiscoveryAsync } from 'expo-auth-session';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

import {
  CLIENT_ID,
  CACHE_ACCESS_TOKEN_KEY,
  SECURE_REFRESH_TOKEN_KEY,
  TENANT_ID,
} from '../config';
import TokenError from '../types/TokenError';
import cache from './cache';

/**
 *
 * Get Saved ID Token and Refresh if needed.
 *
 */
const getAccessToken = async () => {
  const accessToken = cache.get(CACHE_ACCESS_TOKEN_KEY);

  if (accessToken) {
    console.log('access token cache hit', accessToken);
    return accessToken;
  }

  // not loaded or is expired
  const refreshToken = await getItemAsync(SECURE_REFRESH_TOKEN_KEY);
  assert(refreshToken, new TokenError('no refresh token'));

  const discovery = await fetchDiscoveryAsync(
    `https://login.microsoftonline.com/${TENANT_ID}/v2.0`
  );
  assert(
    discovery?.userInfoEndpoint,
    new TokenError(
      `discovery failed for https://login.microsoftonline.com/${TENANT_ID}/v2.0`
    )
  );

  const results = await refreshAsync(
    {
      clientId: CLIENT_ID,
      refreshToken,
    },
    discovery
  );

  assert(
    results.accessToken && results.refreshToken && results.expiresIn,
    new TokenError('could not refresh token')
  );
  // console.log('refreshing token success', results.accessToken);

  cache.set(
    CACHE_ACCESS_TOKEN_KEY,
    results.accessToken,
    results.expiresIn * 1000
  );
  await setItemAsync(SECURE_REFRESH_TOKEN_KEY, results.refreshToken);
  return results.accessToken;
};

export default getAccessToken;
