import { Dispatch } from "redux";
// import * as Analytics from 'expo-firebase-analytics';
// import * as SecureStore from 'expo-secure-store';
import assert from "assert";
import {
  exchangeCodeAsync,
  fetchDiscoveryAsync,
  loadAsync,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { setStrapiID, setUser } from ".";
import {
  API_BASE_URL,
  CACHE_ACCESS_TOKEN_KEY,
  CLIENT_ID,
  SCOPES,
  SECURE_REFRESH_TOKEN_KEY,
  TENANT_ID,
} from "../../config";
import { User } from "../../types/user";
import cache from "../../utils/cache";
import getPushTokenAsync from "./getPushTokenAsync";

const loginAsync =
  (email?: string, password?: string) =>
  async (dispatch: Dispatch<any>): Promise<User> => {
    console.log("🚀 ~ file: loginAsync.ts ~ line 28 ~ email", email);
    if (email && password) {
      const userResults = await fetch(
        `${API_BASE_URL}auth/local`,

        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            identifier: email,
            password,
          }),
        },
      );
      const response = await userResults.json();

      console.log("🚀 ~ file: loginAsync.ts ~ line 29 ~ userResults", response);
      console.log(
        "🚀 ~ file: loginAsync.ts ~ line 48 ~ response?.data?.[0]?.message",
      );

      if (response?.message?.[0]?.messages?.[0]?.message) {
        console.log("🚀 ~ file: loginAsync.ts ~ line 57 ~ erroe");
        throw new Error(response?.message?.[0]?.messages?.[0]?.message);
      }
      const user: User = {
        id: response.user.id,
        token: response.jwt,
        email: response.user.email,
        displayName: response.user.username,
        status: response.user.confirmed,
      };

      // if (user.id) await Analytics.setUserId(user.id);

      // Save user object to store
      dispatch(setUser(user));
      return user;
    }

    // let redirectUri = makeRedirectUri({
    //   scheme: SCHEME,
    // });
    // if (!redirectUri.includes('127.0.0.1')) {
    //   redirectUri += redirectUri.endsWith('/') ? `callback` : `/callback`;
    // }
    // if (redirectUri === 'com.swirecc.swirecokeadvantage://') {
    //   redirectUri = 'com.swirecc.swirecokeadvantage://auth';
    // }

    let redirectUri = "com.swirecc.swirecokeadvantage://auth";

    if (__DEV__) {
      redirectUri = "exp://127.0.0.1:19000";
      // redirectUri = makeRedirectUri({
      //   scheme: SCHEME,
      // });
    }

    console.log("redirectUri", redirectUri);

    // https://login.microsoftonline.com/11c3d389-d422-481b-8639-cc8ec5aa92b3/v2.0//.well-known/openid-configuration
    const discovery = await fetchDiscoveryAsync(
      // 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
      `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
    );

    assert(
      discovery.userInfoEndpoint,
      `could not use discovery on https://login.microsoftonline.com/${TENANT_ID}/v2.0/.well-known/openid-configuration`,
    );

    const request = await loadAsync(
      {
        clientId: CLIENT_ID,
        scopes: SCOPES,
        redirectUri,
        // prompt: 'login', // Force ReLogin?
        // prompt: 'consent', // Force ReLogin?
        extraParams: {
          access_type: "offline",
        },
      },
      discovery,
    );

    const response = await request.promptAsync(discovery);
    // console.log(
    //   '🚀 ~ file: loginAsync.ts ~ line 76 ~ loginAsync ~ response',
    //   response
    // );

    assert(
      response.type === "success" && response.params.code,
      "did not receive code response",
    );
    console.log("got code");

    const token = await exchangeCodeAsync(
      {
        clientId: CLIENT_ID,
        code: response.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier || "",
        },
      },
      discovery,
    );
    console.log("got tokens");

    const { idToken, accessToken, refreshToken, issuedAt, expiresIn } = token;

    assert(idToken, "id token was not returned");

    assert(refreshToken, "refresh token was not returned");
    assert(expiresIn, "expires in was not returned");

    cache.set(CACHE_ACCESS_TOKEN_KEY, accessToken, expiresIn * 1000);

    console.log(`fetching user info ${API_BASE_URL}users/me`);
    const meData = await fetch(`${API_BASE_URL}users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const me = await meData.json();
    console.log("🚀 ~ file: loginAsync.ts ~ line 103 ~ me", me);

    assert(
      me?.role?.name === "User" || me?.role?.name === "Admin",
      `The user role 'User' is required for this application, you have the role '${me?.role?.name}'`,
    );

    await dispatch(setUser(me));
    await dispatch(setStrapiID(me.id));

    await dispatch(getPushTokenAsync());

    // // Save Tokens
    // // await SecureStore.setItemAsync(SECURE_TOKEN_KEY, idToken);
    await SecureStore.setItemAsync(SECURE_REFRESH_TOKEN_KEY, refreshToken);

    // await Analytics.setUserId(decoded.id);

    return me;
  };

export default loginAsync;
