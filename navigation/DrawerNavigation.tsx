import React from "react";
import { useSelector } from "react-redux";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { USE_PASSWORD_LOGIN } from "../config";
import ActivitiesScreen from "../containers/ActivitiesScreen";
import ChannelPresentationsScreen from "../containers/ChannelPresentationsScreen";
import DashboardScreen from "../containers/DashboardScreen";
import FreestyleProfitabilityScreen from "../containers/FreestyleProfitabilityScreen";
import FreestyleScreen from "../containers/FreestyleScreen";
import HelpScreen from "../containers/HelpScreen";
import ImageDetailsScreen from "../containers/ImageDetailsScreen";
import ImageDisplayScreen from "../containers/ImageDisplayScreen";
import ImageGalleryScreen from "../containers/ImageGalleryScreen";
import LoginScreen from "../containers/LoginScreen";
import LoginWithPasswordScreen from "../containers/LoginWithPasswordScreen";
import MaximizingProfitabilityScreen from "../containers/MaximizingProfitabilityScreen";
import MediaDisplayScreen from "../containers/MediaDisplayScreen";
import ReportsScreen from "../containers/ReportsScreen";
import SalesMockupScreen from "../containers/SalesMockupScreen";
import SaveMockupScreen from "../containers/SaveMockupScreen";
import SearchResultScreen from "../containers/SearchResultScreen";
import SignUpScreen from "../containers/SignUpScreen";
import VideoDisplayScreen from "../containers/VideoDisplayScreen";
import { getUser } from "../redux/user";
import CustomDrawerContent from "./CustomDrawerContent";
import CustomHeaderContent from "./CustomHeaderContent";
import FolderStackNavigation from "./FolderStackNavigation";
import SignUpHeaderContent from "./SignUpHeaderContent";

const SignedOutStack = createNativeStackNavigator();
// const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const user = useSelector(getUser);

  // Send Different DrawerNavigation depending if the user is logged in
  if (user)
    return (
      <Drawer.Navigator
        initialRouteName="DashboardScreen"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        // screenOptions={(props) => <CustomHeaderContent {...props} />}
        screenOptions={{
          header: (props) => <CustomHeaderContent {...props} />,
        }}
      >
        <Drawer.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{
            headerTitle: (props) => <CustomHeaderContent {...props} />,
          }}
        />
        {/* <Drawer.Screen name="FolderScreen" component={FolderScreen} /> */}
        <Drawer.Screen
          name="FolderStackNavigation"
          component={FolderStackNavigation}
        />
        <Drawer.Screen
          name="MediaDisplayScreen"
          component={MediaDisplayScreen}
        />
        <Drawer.Screen
          name="VideoDisplayScreen"
          component={VideoDisplayScreen}
        />
        <Drawer.Screen
          name="ImageDisplayScreen"
          component={ImageDisplayScreen}
        />
        <Drawer.Screen name="SalesMockupScreen" component={SalesMockupScreen} />
        <Drawer.Screen name="SaveMockupScreen" component={SaveMockupScreen} />

        <Drawer.Screen
          name="ImageGalleryScreen"
          component={ImageGalleryScreen}
        />
        <Drawer.Screen
          name="ImageDetailsScreen"
          component={ImageDetailsScreen}
        />
        <Drawer.Screen
          name="MaximizingProfitabilityScreen"
          component={MaximizingProfitabilityScreen}
        />
        <Drawer.Screen
          name="FreestyleProfitabilityScreen"
          component={FreestyleProfitabilityScreen}
        />
        <Drawer.Screen name="ReportsScreen" component={ReportsScreen} />
        <Drawer.Screen name="FreestyleScreen" component={FreestyleScreen} />
        <Drawer.Screen
          name="ChannelPresentationsScreen"
          component={ChannelPresentationsScreen}
        />
        <Drawer.Screen
          name="SearchResultScreen"
          component={SearchResultScreen}
        />
        <Drawer.Screen name="ActivitiesScreen" component={ActivitiesScreen} />
        <Drawer.Screen name="HelpScreen" component={HelpScreen} />
      </Drawer.Navigator>
    );

  // return (
  //   <Stack.Navigator
  //     screenOptions={{ headerShown: false }}
  //     initialRouteName="OptInScreen"
  //   >
  //     <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
  //   </Stack.Navigator>
  // );

  // User is logged out
  return (
    <SignedOutStack.Navigator
      initialRouteName={
        USE_PASSWORD_LOGIN ? "LoginWithPasswordScreen" : "LoginScreen"
      }
      // screenOptions={{ headerShown: false }}
      screenOptions={{
        header: (props) => <SignUpHeaderContent {...props} />,
      }}
    >
      <SignedOutStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        // options={{ headerShown: false }}
      />
      <SignedOutStack.Screen
        name="LoginWithPasswordScreen"
        component={LoginWithPasswordScreen}
        // options={{ headerShown: false }}
      />
      <SignedOutStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </SignedOutStack.Navigator>
  );
};

export default DrawerNavigation;
