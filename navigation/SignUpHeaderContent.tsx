import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { t } from 'i18n-js';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import backgroundImg from '../assets/img/bg-full.jpg';
import swireLogo from '../assets/img/advantage-logo-white.png';
import { Fonts } from '../theme';

function SignUpHeaderContent(props: any) {
  const { navigation } = props;

  return (
    <View style={{ width: '100%', height: 100 }}>
      <ImageBackground
        source={backgroundImg}
        style={{ width: '100%', height: 100 }}
        resizeMode="cover"
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text
              style={{ ...Fonts.style.text20, color: 'white', paddingLeft: 5 }}
            >
              BACK
            </Text>
          </TouchableOpacity>
          <Image
            style={{ height: 65 }}
            source={swireLogo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
}

export default SignUpHeaderContent;
