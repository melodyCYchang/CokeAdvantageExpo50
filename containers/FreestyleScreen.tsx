import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "~/redux/store";
import FolderTile from "../components/FolderTile";
import FilesTile from "../components/GetFilesTile";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useGetFreestyleFoldersQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";
import { findChildFoldersByTermID } from "../utils/findChildFoldersByTermID";
import { findFoldersByTermID } from "../utils/findFolderByTermID";

type FreestyleScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FreestyleScreen"
>;

type Props = {
  navigation: FreestyleScreenNavigationProp;
  route: any;
};

export default function FreestyleScreen({ route, navigation }: Props) {
  const { termID } = route.params;
  // console.log('folder: ', folderObj);

  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();

  // this query will be cache from the dashboard
  const {
    data: folders,
    isFetching,
    isLoading,
  } = useGetFreestyleFoldersQuery();
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 53 ~ folders',
  //     folders
  //   );

  const childFolders = findChildFoldersByTermID(termID, folders);
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 54 ~ childFolders',
  //     childFolders
  //   );
  const currentFolder = findFoldersByTermID(termID, folders);
  //   console.log(
  //     '🚀 ~ file: ChannelPresentationsScreen.tsx ~ line 60 ~ currentFolder',
  //     currentFolder
  //   );

  if (!childFolders && folders) {
    navigation.navigate("DashboardScreen");
  }

  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            width: "100%",
            height: 90,
            alignItems: "center",
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

          <Text style={Fonts.style.headerText}>FREESTYLE</Text>
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
                    navigation.push("FreestyleScreen", {
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
    backgroundColor: "white",
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    alignItems: "flex-start",
    // justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  tile: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tileText: {
    alignItems: "center",
    margin: 10,
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

    borderRadius: 1.0,
    backgroundColor: "white",
  },
});
