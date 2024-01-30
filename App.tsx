import React from "react";
// import * as Sentry from 'sentry-expo';
import { Button, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "react-native-gesture-handler";
import ErrorBoundary from "react-native-error-boundary";

// Set up translations
import "./i18n";

import { store, persistor } from "./redux/store";
import RootContainer from "./containers/RootContainer";
// import { SENTRY_DSN } from './config';
import LoginLoading from "./components/LoginLoading";

// Sentry.init({
//   dsn: SENTRY_DSN,
//   // enableInExpoDevelopment: true,
//   debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
// });

export default function AppNav() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoginLoading />} persistor={persistor}>
          <NavigationContainer>
            <RootContainer />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
