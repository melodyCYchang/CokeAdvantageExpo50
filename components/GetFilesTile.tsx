import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { Video, AVPlaybackStatus } from 'expo-av';

import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Colors, Fonts } from '../theme';
import pdfLogo from '../assets/img/icon-quick-link-file.png';
import vidLogo from '../assets/img/icon-quick-link-video.png';
import DeleteButton from './DeleteButton';
import EmailButton from './EmailButton';
import DownloadButton from './DownloadButton';
import { useGetPresentationsByFolderQuery } from '../services/wpApi';
import {
  downloadFile,
  getDownloading,
  getDownloads,
  getConfirmDeleteId,
  deleteDownloadFile,
  getDownloadId,
} from '../redux/downloads';
import FileTile from './FilesTile';

export default function GetFilesTile({
  mediaItems,
  width,
}: {
  mediaItems: any;
  width: any;
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const downloadedFiles: any = useSelector(getDownloads);
  const confirmDeleteId: any = useSelector(getConfirmDeleteId);
  const downloading: any = useSelector(getDownloading);

  // const {
  //   data: quickLinks,
  //   isFetching,
  //   isLoading,
  // } = useGetPresentationsByFolderQuery(slug);

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <FileTile files={mediaItems} width={width} />
      </View>
      {/* {isLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingLeft: 7,
  },
  tile: {
    margin: 10,
    width: 225,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
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
    backgroundColor: 'white',
  },
});
