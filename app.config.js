import "dotenv/config";

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL || "";
const PRODUCTION = RELEASE_CHANNEL.indexOf("prod") !== -1;

const APPLICATION_NAME = "Coke Advantage";
const PACKAGE_NAME = "com.swirecc.swirecokeadvantage";
const BUILD_VERSION = process.env.BUILD_VERSION
  ? parseInt(process.env.BUILD_VERSION, 10)
  : 1;
const CODE_VERSION = process.env.CODE_VERSION || "1";
export default {
  expo: {
    name: APPLICATION_NAME,
    slug: "swire-coke-advantage",
    owner: "swirecocacola",
    scheme: PACKAGE_NAME, // for app auth callbacks
    version: "1.2.3",
    privacy: "unlisted",
    orientation: "landscape",
    icon: PRODUCTION
      ? "./assets/ios-icon-production.png"
      : "./assets/ios-icon-stage.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    // notification: {
    //   icon: "./assets/android-notification-icon.png",
    //   color: "#ffffff",
    //   androidMode: "collapse",
    //   androidCollapsedTitle: "#{unread_notifications} notifications",
    // },
    ios: {
      buildNumber: BUILD_VERSION.toString(),
      bundleIdentifier: PACKAGE_NAME,
      supportsTablet: true,
      requireFullScreen: true,
      config: {
        usesNonExemptEncryption: false,
      },
      googleServicesFile: "./firebase/GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera take photos so you can create composite photos.",
        NSPhotoLibraryUsageDescription:
          "This app allows you to use existing photos to create composite photos",
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      package: PACKAGE_NAME,
      versionCode: BUILD_VERSION,
      icon: PRODUCTION
        ? "./assets/android-icon-production.png"
        : "./assets/android-icon-stage.png",

      // adaptiveIcon: {
      //   foregroundImage: PRODUCTION
      //     ? './assets/adaptive-icon-production.png'
      //     : './assets/adaptive-icon-stage.png',
      //   backgroundColor: '#FFFFFF',
      // },
      googleServicesFile: "./firebase/google-services.json",
    },
    extra: {
      version: CODE_VERSION,
      eas: {
        projectId: "325c262b-a5a9-4c76-9c27-8be4c4374cf1",
      },
    },

    web: {
      favicon: "./assets/favicon.png",
      // config: {
      //   firebase: {
      //     apiKey: "AIzaSyBGo-Y4oC8_JMhftJ9s5-bQ5-b4jRZdL7c",
      //     authDomain: "cokenowmobile.firebaseapp.com",
      //     projectId: "cokenowmobile",
      //     storageBucket: "cokenowmobile.appspot.com",
      //     messagingSenderId: "555915829028",
      //     appId: "1:555915829028:web:e432fe0c92881de01bddb1",
      //     measurementId: "G-6PRPEH978Z",
      //   },
      // },
    },
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/android-notification-icon.png",
          color: "#ffffff",
          // "mode": "production"
        },
      ],
      "expo-localization",
      [
        "expo-updates",
        {
          username: "account-username"
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: `Allow ${APPLICATION_NAME} to access your camera.`
        }
      ],
      [
        "expo-screen-orientation",
        {
          initialOrientation: "DEFAULT"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ], [
        "expo-av",
        {
          microphonePermission: `Allow ${APPLICATION_NAME} to access your microphone.`
        }
      ],
      [
        "expo-secure-store",
        {
          faceIDPermission: `Allow ${APPLICATION_NAME} to access your Face ID biometric data.`
        }
      ]
      // "sentry-expo"
      // Uncommenting this will cause enterprise builds to fail
      // [
      //     '@stripe/stripe-react-native',
      //     {
      //       merchantIdentifier: [],
      //       enableGooglePay: false,
      //     },
      // ]
    ],
  },
};
