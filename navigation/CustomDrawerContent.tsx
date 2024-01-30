import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { t } from 'i18n-js';

import CustomDrawerItem from './CustomDrawerItem';
import {
  useGetFoldersStrapiQuery,
  useGetUnreadActivitiesCountQuery,
} from '../services/wpApi';
import { getRootFolders } from '../utils/getRootFolders';
import { Folder } from '../types/Folder';
import { useSelector } from 'react-redux';
import {
  getLastReadActivityTimestamp,
  getNumberOfUnreadActivities,
} from '../redux/persist';

function DrawerContent(props: any) {
  const { navigation } = props;
  const lastReadActivityTimestamp = useSelector(getLastReadActivityTimestamp);
  const { data: quickLinks } = useGetFoldersStrapiQuery();
  // const { data: unreadActivities } = useGetUnreadActivitiesCountQuery(
  //   lastReadActivityTimestamp
  // );

  const weightedFolders = getRootFolders(quickLinks)?.filter((ele) => {
    // console.log('weight', ele.weight);
    return ele.weight !== null;
  });
  const unreadActivities = useSelector(getNumberOfUnreadActivities);

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      {/* {unreadActivities > 0 && ( */}
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          navigation.navigate('ActivitiesScreen');
        }}
        label={`${t('Drawer.ActicityScreen')} (${unreadActivities})`}
        screen="ActivitiesScreen"
        icon={require('../assets/img/icon-dashboard.png')}
      />
      {/* )} */}

      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          navigation.navigate('DashboardScreen');
        }}
        label={t('Drawer.DashboardScreen')}
        screen="DashboardScreen"
        icon={require('../assets/img/icon-dashboard.png')}
      />
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          navigation.navigate('SalesMockupScreen', {
            clear: new Date().valueOf(),
          });
        }}
        label={t('Drawer.SalesMockupScreen')}
        screen="SalesMockupScreen"
        icon={require('../assets/img/icon-camera.png')}
      />
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          navigation.navigate('ImageGalleryScreen');
        }}
        label={t('Drawer.ImageGalleryScreen')}
        screen="ImageGalleryScreen"
        icon={require('../assets/img/icon-gallery.png')}
      />
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          // navigation.navigate('MaximizingProfitabilityScreen');
        }}
        label={t('Drawer.MaximizingProfitabilityScreen')}
        screen="MaximizingProfitabilityScreen"
        icon={require('../assets/img/icon-profit.png')}
      />
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          // navigation.navigate('FreestyleProfitabilityScreen');
        }}
        label={t('Drawer.FreestyleProfitabilityScreen')}
        screen="FreestyleProfitabilityScreen"
        icon={require('../assets/img/icon-freestyle.png')}
      />
      <CustomDrawerItem
        navigation={navigation}
        onPress={() => {
          // navigation.navigate('ReportsScreen');
        }}
        label={t('Drawer.ReportsScreen')}
        screen="ReportsScreen"
        icon={require('../assets/img/icon-report.png')}
      />
      {weightedFolders.map((quickLink: Folder) => (
        <CustomDrawerItem
          key={`drawer_library_id_${quickLink.id}`}
          navigation={navigation}
          onPress={() => {
            navigation.navigate('FolderStackNavigation', {
              screen: 'FolderScreen',
              params: {
                termID: quickLink.id,
                folderName: quickLink.name,
              },
            });
          }}
          label={
            quickLink.weight === 0
              ? t('Drawer.ChannelPresentationsScreen')
              : quickLink.weight === 2
              ? t('Drawer.TestimonialsScreen')
              : t('Drawer.FreestyleScreen')
          }
          screen="ChannelPresentationsScreen"
          icon={quickLink.icon}
        />
      ))}
      <DrawerItem
        label={t('Drawer.HelpScreen')}
        onPress={() => {
          navigation.navigate('HelpScreen');
        }}
      />
    </DrawerContentScrollView>
  );
}

export default DrawerContent;
