import React, { useEffect, useState } from "react";

import { StackNavigationProp } from "@react-navigation/stack";
import * as Updates from "expo-updates";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { t } from "i18n-js";
import ErrorBanner from "../components/ErrorBanner";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { setUser } from "../redux/user";
import { ApplicationStyles, Colors, Fonts } from "../theme";

import backgroundImg from "../assets/img/bg.png";
import { useStrapiLoginMutation } from "../services/wpApi";
import validateApiResponse from "../utils/validateApiResponse";

import swireLogo from "../assets/img/swire-coke-logo.png";
import DialogPopUp from "../components/DialogPopUp";
import LoginLoading from "../components/LoginLoading";
import { callNumber } from "../components/PhoneCall";
import VersionText from "../components/VersionText";
import { getLogin } from "../redux/login";
import loginAsync from "../redux/user/loginAsync";
import { StrapiLoginPayload } from "../types/StrapiLoginPayload";
import getVersion from "../utils/getVersion";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  StatusBar.setBarStyle("light-content", true);

  const dispatch = useDispatch();
  const { email, password, rememberMe } = useSelector(getLogin);

  // let redirectUri = makeRedirectUri({
  //   scheme: SCHEME,
  // });
  // if (redirectUri === 'com.swirecc.swirecokeadvantage://') {
  //   redirectUri = 'com.swirecc.swirecokeadvantage://auth';
  // }

  const [checkingForUpdate, setCheckingForUpdate] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // setUpdating(true);
          await Updates.fetchUpdateAsync();
          // ... notify user of update ...
          await Updates.reloadAsync();
          // setUpdating(false);
        } else {
          setCheckingForUpdate(false);
          // Alert.alert('Application is up to date');
        }
      } catch (err: any) {
        console.log("checkForUpdateAsync error:", err.message);
        setCheckingForUpdate(false);
      }
    })();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const version = getVersion();

  const [
    login, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useStrapiLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StrapiLoginPayload>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // console.log(errors);

  const [errorText, setErrorText] = useState("");
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [orientation, setOrientation] = useState("PORTRAIT");

  const determineAndSetOrientation = () => {
    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");

    if (width < height) {
      setOrientation("PORTRAIT");
    } else {
      setOrientation("LANDSCAPE");
    }
  };

  useEffect(() => {
    determineAndSetOrientation();
    const orientationChange = Dimensions.addEventListener(
      "change",
      determineAndSetOrientation,
    );

    return () => {
      orientationChange.remove();
    };
  }, []);

  const onSubmit = async () => {
    try {
      setErrorText("");
      const data: any = await dispatch(loginAsync());
      console.log(
        "🚀 ~ file: OneButtonLoginScreen.tsx ~ line 110 ~ onSubmit ~ data",
        data,
      );
      validateApiResponse(data);

      if (data?.data?.id) {
        console.log(`succesfully logged in ${data?.data?.displayName}`);
        // if (rememberMe) {
        //   dispatch(setPassword(password));
        //   dispatch(setEmail(identifier));
        // }

        return dispatch(setUser(data.data));
      }

      setErrorText("unknown error");
    } catch (err: any) {
      console.error("login", err.message);
      setErrorText(err.message);
    }
  };

  if (checkingForUpdate) return <LoginLoading />;

  return (
    <View style={ApplicationStyles.mainContainer}>
      <ImageBackground
        source={backgroundImg}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.container}>
          <View
            style={{
              borderColor: Colors.swireLightGray,
              borderWidth: errorText === "" ? 0 : 6,
              backgroundColor: Colors.white,
              width: "75%",
            }}
          >
            <ErrorBanner text={errorText} onClose={() => setErrorText("")} />
          </View>

          <Text
            style={{ fontSize: 30, margin: 15, fontFamily: Fonts.type.base }}
          >
            SIGN IN
          </Text>

          <TouchableOpacity
            // disabled={busy}
            onPress={handleSubmit(onSubmit)}
            // onLongPress={() => {
            //   navigation.navigate('LoginWithPasswordScreen');
            // }}
            style={[styles.loginBtn, styles.shadow]}
          >
            <Text style={Fonts.style.text20}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // disabled={busy}
            onPress={() => setHelpVisible(true)}
            // style={[styles.loginBtn, styles.shadow]}
          >
            <Text style={Fonts.style.btnText}>NEED HELP?</Text>
          </TouchableOpacity>
          {/* <Text style={{ color: '#FF7777', fontSize: 16, marginTop: 20 }}>
            {redirectUri}
          </Text> */}
        </View>

        <View style={styles.footer}>
          <Image
            source={swireLogo}
            style={{
              marginTop: 15,
              width: 200,
              height: 40,
              resizeMode: "contain",
            }}
          />
          <View style={{ marginTop: 5, marginBottom: 10 }}>
            <VersionText />
          </View>
        </View>
        <DialogPopUp
          title="NEED HELP?"
          visibility={helpVisible}
          setVisibility={setHelpVisible}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: -40, right: 25 }}
            onPress={() => {
              setHelpVisible(false);
            }}
          >
            <Feather name="x" size={24} color={Colors.swireRed} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ alignSelf: "center", fontSize: 16 }}>
              Please contact support
            </Text>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  callNumber("(801)816-5300");
                }}
              >
                <FontAwesome5 name="phone" size={24} color="white" />
                <Text style={styles.buttonText}>(801)816-5333</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ alignSelf: "center", fontSize: 16 }}>
              {t("support.or")}
            </Text>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  Linking.openURL(
                    "mailto:operationalexcellencetechnology@swirecc.com",
                  )
                }
              >
                <Ionicons name="md-paper-plane" size={24} color="white" />
                <Text style={styles.buttonText}>
                  operationalexcellencetechnology@swirecc.com
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DialogPopUp>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: Colors.white,
    borderColor: Colors.white,
    width: "35%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loginBtn: {
    backgroundColor: Colors.white,
    width: "50%",
    padding: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.swireRed,
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  btnText: {
    fontSize: 20,
    color: Colors.white,
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,

    borderRadius: 5.0,
    // backgroundColor: "white",
  },
  input: {
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 3,
    color: Colors.white,
    textAlign: "center",
    fontSize: 20,
  },
  popuInput: {
    padding: 10,
    borderColor: Colors.swireLightGray,
    borderBottomWidth: 2,
    fontSize: 20,
  },
  popupBtnText: {
    color: Colors.swireRed,
    fontSize: 18,
  },
  btnTile: {
    backgroundColor: Colors.swireDarkGray,
    width: 150,
    margin: 10,
    padding: 10,
  },
  footer: {
    backgroundColor: Colors.white,
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    marginLeft: 7,
  },
  linkButton: {
    width: "80%",
    height: 38,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
