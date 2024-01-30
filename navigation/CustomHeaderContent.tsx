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
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import backgroundImg from '../assets/img/bg-full.jpg';
import swireLogo from '../assets/img/advantage-logo-white.png';

function HeaderContent(props: any) {
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
          <Image
            style={{ height: 60 }}
            source={swireLogo}
            resizeMode="contain"
          />
          <FontAwesome
            name="bars"
            size={24}
            color="white"
            style={{ position: 'absolute', left: 20 }}
            onPress={() => {
              navigation.openDrawer();
            }}
          />
          {/* {unreadActivities > 0 && <Text>{unreadActivities}</Text>} */}
        </View>
      </ImageBackground>
    </View>
  );
}

export default HeaderContent;
