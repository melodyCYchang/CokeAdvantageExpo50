import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import * as Updates from 'expo-updates';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { t } from 'i18n-js';
import { CheckBox } from 'react-native-elements';
import { ApplicationStyles, Colors, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { setUser } from '../redux/user';
import ErrorBanner from '../components/ErrorBanner';

import TextInputController from '../components/TextInputController';
import { useLoginMutation } from '../services/wpApi';
import { LoginPayload } from '../types/LoginPayload';
import validateApiResponse from '../utils/validateApiResponse';
import backgroundImg from '../assets/img/bg.png';

import { isEmailRule } from '../utils/isEmailRule';
import { getLogin, setPassword, setEmail, setRememberMe } from '../redux/login';
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';
import getVersion from '../utils/getVersion';
import swireLogo from '../assets/img/swire-coke-logo.png';
import VersionText from '../components/VersionText';
import loginAsync from '../redux/user/loginAsync';

type LoginWithPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginWithPasswordScreen'
>;

type Props = {
  navigation: LoginWithPasswordScreenNavigationProp;
};

export default function LoginWithPasswordScreen({ navigation }: Props) {
  StatusBar.setBarStyle('light-content', true);

  const dispatch = useDispatch();
  const { email, password, rememberMe } = useSelector(getLogin);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const version = getVersion();

  const [
    login, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email,
      password,
    },
  });

  // console.log(errors);

  const [errorText, setErrorText] = useState('');
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [checkingForUpdate, setCheckingForUpdate] = useState(true);

  const determineAndSetOrientation = () => {
    const { width } = Dimensions.get('window');
    const { height } = Dimensions.get('window');

    if (width < height) {
      setOrientation('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
    }
  };

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
      } catch (err) {
        setCheckingForUpdate(false);
      }
    })();
  }, []);

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);

    return () => {
      Dimensions.removeEventListener('change', determineAndSetOrientation);
    };
  }, []);

  const onSubmit = async (values: LoginPayload) => {
    const { email, password } = values;
    try {
      setErrorText('');
      const data: any = await dispatch(loginAsync(email, password));
      validateApiResponse(data);
      console.log(
        '🚀 ~ file: OneButtonLoginScreen.tsx ~ line 110 ~ onSubmit ~ data',
        data
      );

      if (data?.data?.id) {
        console.log(`succesfully logged in ${data?.data?.displayName}`);
        // if (rememberMe) {
        //   dispatch(setPassword(password));
        //   dispatch(setEmail(identifier));
        // }

        return dispatch(setUser(data.data));
      }

      setErrorText('unknown error');
    } catch (err: any) {
      // console.error('login', err.message);
      setErrorText(err.message);
    }
  };

  if (checkingForUpdate)
    return (
      <View style={ApplicationStyles.mainContainer}>
        <ImageBackground
          source={backgroundImg}
          style={{ width: '100%', height: '100%' }}
        >
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        </ImageBackground>
      </View>
    );

  return (
    <View style={ApplicationStyles.mainContainer}>
      <ImageBackground
        source={backgroundImg}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <View
            style={{
              borderColor: Colors.swireLightGray,
              borderWidth: errorText === '' ? 0 : 6,
              backgroundColor: Colors.white,
              width: '35%',
            }}
          >
            <ErrorBanner text={errorText} onClose={() => setErrorText('')} />
          </View>
          {(errors.email || errors.password) && (
            <View
              style={{
                borderColor: Colors.swireLightGray,
                borderWidth: 6,
                backgroundColor: Colors.white,
                width: '35%',
                padding: 10,
              }}
            >
              {errors.email && (
                <Text style={styles.errorText}>
                  {' '}
                  {`Email Field ${t(errors.email.message)}`}
                </Text>
              )}
              {errors.password && (
                <Text style={styles.errorText}>
                  {' '}
                  {`Password Field ${t(errors.password.message)}`}
                </Text>
              )}
            </View>
          )}

          <Text
            style={{ fontSize: 30, margin: 15, fontFamily: Fonts.type.base }}
          >
            SIGN IN
          </Text>
          <View style={styles.textInput}>
            <TextInputController
              control={control}
              name="email"
              required
              autoCompleteType="email"
              autoCapitalize="none"
              // error={errors.email}
              placeholder={t('Login.email')}
              disabled={busy}
              rules={isEmailRule}
              inputStyle={styles.input}
            />
            <TextInputController
              control={control}
              name="password"
              required
              password
              placeholder={t('Login.password')}
              disabled={busy}
              inputStyle={styles.input}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckBox
              center
              checkedIcon="check-circle-o"
              uncheckedIcon="circle-o"
              checked={rememberMe}
              onPress={() => dispatch(setRememberMe(!rememberMe))}
              checkedColor={Colors.white}
              uncheckedColor={Colors.white}
            />

            <Text style={{ color: Colors.white, fontSize: 20 }}>
              Remember Me
            </Text>
          </View>
          <TouchableOpacity
            disabled={busy}
            onPress={handleSubmit(onSubmit)}
            style={[styles.loginBtn, styles.shadow]}
          >
            <Text style={{ fontSize: 20, color: Colors.swireRed }}>LOGIN</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 10,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.btnTile,
                backgroundColor: Colors.swireSuperDarkGray,
              }}
              onPress={() => {
                navigation.navigate('SignUpScreen');
              }}
            >
              <Text style={styles.btnText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.btnTile,
                backgroundColor: Colors.swireDarkGray,
              }}
              onPress={() => {
                // setOnboardingVisible(true);
                // navigation.navigate('OneButtonLoginWithPasswordScreen');
              }}
            >
              <Text style={styles.btnText}>USER ONBOARDING</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.btnTile, backgroundColor: 'gray' }}
              onPress={() => {
                setForgotPasswordVisible(true);
              }}
            >
              <Text style={styles.btnText}>FORGOT PASSWORD</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Image
            source={swireLogo}
            style={{
              marginTop: 15,
              width: 200,
              height: 40,
              resizeMode: 'contain',
            }}
          />
          <View style={{ marginTop: 5, marginBottom: 10 }}>
            <VersionText />
          </View>
        </View>

        {/* {forgotPasswordVisible && (
          <ForgotPasswordDialog
            onClose={() => {
              setForgotPasswordVisible(false);
            }}
          />
        )}
        {onboardingVisible && (
          <ForgotPasswordDialog
            onClose={() => {
              setOnboardingVisible(false);
            }}
          />
        )} */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: Colors.white,
    borderColor: Colors.white,
    width: '35%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginBtn: {
    backgroundColor: Colors.white,
    width: 150,
    padding: 10,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.swireRed,
    textAlign: 'center',
    margin: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnText: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,

    borderRadius: 1.0,
    // backgroundColor: "white",
  },
  input: {
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 3,
    color: Colors.white,
    textAlign: 'center',
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
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
