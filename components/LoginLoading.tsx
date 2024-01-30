import React from 'react';

import {
  StyleSheet,
  ActivityIndicator,
  View,
  ImageBackground,
} from 'react-native';

import { ApplicationStyles, Colors } from '../theme';

import backgroundImg from '../assets/img/bg.png';

export default function LoginLoading() {
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
    width: '50%',
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

    borderRadius: 5.0,
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
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginLeft: 7,
  },
  linkButton: {
    width: '80%',
    height: 38,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
