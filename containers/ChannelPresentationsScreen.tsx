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
import { useDispatch } from 'react-redux';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ApplicationStyles, Colors, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';
import FolderTile from '../components/FolderTile';
import {
  useGetPresentationFoldersQuery,
  useGetQuickLinksQuery,
} from '../services/wpApi';
import { findQuicklinkByTermId } from '../utils/findQuicklinkByTermID';
import FilesTile from '../components/GetFilesTile';
import { findChildFoldersByTermID } from '../utils/findChildFoldersByTermID';
import { findFoldersByTermID } from '../utils/findFolderByTermID';

type ChannelPresentationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChannelPresentationsScreen'
>;

type Props = {
  navigation: ChannelPresentationsScreenNavigationProp;
  route: any;
};

export default function ChannelPresentationsScreen({
  route,
  navigation,
}: Props) {
  const { termID } = route.params;
  console.log('folder: ', termID);

  StatusBar.setBarStyle('light-content', true);
  const dispatch = useDispatch();

  // this query will be cache from the dashboard
  const {
    data: folders,
    isFetching,
    isLoading,
  } = useGetPresentationFoldersQuery();
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 53 ~ folders',
  //     folders
  //   );

  const childFolders = findChildFoldersByTermID(folders, termID);
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 54 ~ childFolders',
  //     childFolders
  //   );
  const currentFolder = findFoldersByTermID(folders, termID);
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 60 ~ currentFolder',
  //     currentFolder
  //   );

  if (childFolders && !folders) {
    navigation.navigate('DashboardScreen');
  }

  return (
    <View style={ApplicationStyles.mainContainer}>
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
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}

          <Text style={Fonts.style.headerText}>CHANNEL PRESENTATIONS</Text>
        </View>
        <ScrollView style={{ backgroundColor: Colors.swireLightGray }}>
          <View style={styles.scrollContainer}>
            {termID !== 0 && (
              <TouchableOpacity
                style={[styles.tile, styles.shadow]}
                onPress={() => {
                  navigation.goBack();
                  // navigation.navigate('FolderScreen', {
                  //   termID: quickLink?.parent,
                  // });
                }}
              >
                <Ionicons
                  name="caret-up-circle-sharp"
                  size={24}
                  color={Colors.swireSuperDarkGray}
                />
              </TouchableOpacity>
            )}
            {childFolders &&
              childFolders?.map((folder: any) => (
                <FolderTile
                  key={`folder_tile_${folder.term_id}`}
                  folder={folder}
                  onPress={() => {
                    navigation.push('ChannelPresentationsScreen', {
                      termID: folder.term_id,
                    });
                  }}
                />
              ))}
          </View>
          {currentFolder && <FilesTile slug={currentFolder?.slug} />}
        </ScrollView>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
