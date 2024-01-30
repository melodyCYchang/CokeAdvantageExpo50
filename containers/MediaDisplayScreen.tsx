import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

import { useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { ApplicationStyles, Colors } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';
import FolderTile from '../components/FolderTile';
import { useGetQuickLinksQuery } from '../services/wpApi';
import { findQuicklinkByTermId } from '../utils/findQuicklinkByTermID';
import FilesTile from '../components/GetFilesTile';
import { getDownloadPath } from '../redux/downloads';

type MediaDisplayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MediaDisplayScreen'
>;

type Props = {
  navigation: MediaDisplayScreenNavigationProp;
  route: any;
};

export default function MediaDisplayScreen({ route, navigation }: Props) {
  const { file } = route.params;

  return (
    <View style={ApplicationStyles.mainContainer}>
      <StatusBar hidden />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            width: '100%',
            height: 90,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              backgroundColor: Colors.swireRed,
              paddingHorizontal: 15,
              paddingVertical: 10,
              margin: 20,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 20 }}>BACK</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <PDFReader
            source={{
              uri: file?.localFile,
            }}
          />
          {/* <Text>{JSON.stringify(file, null, 2)}</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'flex-start',
    // justifyContent: "space-between",
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  tile: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  tileText: {
    alignItems: 'center',
    margin: 10,
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
