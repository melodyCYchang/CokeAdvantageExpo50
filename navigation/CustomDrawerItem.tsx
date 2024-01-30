import React from 'react';

import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Colors } from '../theme';
import DrawerItem from './DrawerItem';

function CustomDrawerItem({
  navigation,
  label,
  screen,
  icon,
  onPress,
}: {
  navigation: any;
  label: string;
  screen: string;
  icon: any;
  onPress: any;
}) {
  const isReport = (screenName: string) => {
    if (
      screenName === 'MaximizingProfitabilityScreen' ||
      screenName === 'FreestyleProfitabilityScreen' ||
      screenName === 'ReportsScreen'
    ) {
      return true;
    }
    return false;
  };
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        flex: 1,
        // width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor: Colors.swireLightGray,
        borderBottomWidth: 1,
        // borderWidth: 3,
        flexWrap: 'wrap',
        backgroundColor: isReport(screen)
          ? Colors.swireLightGray
          : Colors.white,
      }}
      onPress={onPress}
    >
      <View>
        <Image
          source={icon}
          style={{ width: 40, height: 40, margin: 15 }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          height: 110,
          justifyContent: 'center',
          width: '100%',
          // borderWidth: 5,
          flex: 1,
          // alignItems: 'flex-start',
          // flexWrap: 'wrap',
          flexDirection: 'row',
        }}
      >
        <DrawerItem
          label={label.toLocaleUpperCase()}
          // onPress={() => {
          //   if (screen === 'ChannelPresentationsScreen') {
          //     console.log('entering channel presentations page');

          //     navigation.navigate('FolderStackNavigation', {
          //       screen: 'ChannelPresentationsScreen',
          //       params: { termID: 0 },
          //     });
          //   } else if (screen === 'FreestyleScreen') {
          //     console.log('entering freestyle page');

          //     navigation.navigate('FolderStackNavigation', {
          //       screen: 'FreestyleScreen',
          //       params: { termID: 0 },
          //     });
          //   } else if (screen === 'TestimonialsScreen') {
          //     console.log('entering Testimonials page');

          //     navigation.navigate('FolderStackNavigation', {
          //       screen: 'TestimonialsScreen',
          //       params: { termID: 0 },
          //     });
          //   } else if (screen === 'SalesMockupScreen') {
          //     navigation.navigate('SalesMockupScreen', {
          //       clear: new Date().valueOf(),
          //     });
          //   } else {
          //     navigation.navigate(screen);
          //   }
          // }}
          onPress={onPress}
          labelStyle={{
            color: isReport(screen) ? Colors.swireDarkGray : Colors.swireRed,
            fontSize: 23,
            // flex: 1,
            // flexShrink: 1,
            // borderWidth: 2,
            // flexWrap: 'wrap',
            // height: '100%',
          }}
          style={{
            // backgroundColor: 'green',
            flex: 1,
            justifyContent: 'center',
            // alignItems: 'center',
            // width: '100%',
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // flexShrink: 1,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

export default CustomDrawerItem;
