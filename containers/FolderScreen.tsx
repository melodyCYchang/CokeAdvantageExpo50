import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "~/redux/store";
import FilesTile from "../components/FilesTile";
import FolderTile from "../components/FolderTile";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useGetFolderStrapiQuery, useGetMeQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";
import { getCanShowItems } from "../utils/getCanShowItems";

type FolderScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FolderScreen"
>;

type Props = {
  navigation: FolderScreenNavigationProp;
  route: any;
};

export default function FolderScreen({ route, navigation }: Props) {
  const { folderName, termID } = route.params;

  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();

  const [orientation, setOrientation] = useState("PORTRAIT");
  const [landscapeWidth, setLandscapeWidth] = useState("25%");
  const [portraitWidth, setPortraitWidth] = useState("33%");
  const [isPhone, setIsPhone] = useState(false);

  const determineAndSetOrientation = () => {
    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");

    if (width < height) {
      setOrientation("PORTRAIT");
    } else {
      setOrientation("LANDSCAPE");
    }
  };

  useEffect(() => {
    determineAndSetOrientation();
    const orientationChanged = Dimensions.addEventListener(
      "change",
      determineAndSetOrientation,
    );
    Device.getDeviceTypeAsync().then((deviceType) => {
      if (deviceType === Device.DeviceType.PHONE) {
        setLandscapeWidth("33%");
        setPortraitWidth("50%");
        setIsPhone(true);
      } else if (deviceType === Device.DeviceType.TABLET) {
        setLandscapeWidth("25%");
        setPortraitWidth("33%");
        setIsPhone(false);
      }
    });

    return () => {
      orientationChanged.remove();
    };
  }, []);

  const width = orientation === "PORTRAIT" ? portraitWidth : landscapeWidth;

  // this query will be cache from the dashboard
  const {
    data: quickLink,
    isFetching,
    isLoading,
    refetch,
  } = useGetFolderStrapiQuery(termID);
  // console.log(
  //   '🚀 ~ file: FolderScreen.tsx ~ line 49 ~ FolderScreen ~ isLoading',
  //   isLoading
  // );
  // console.log(
  //   '🚀 ~ file: FolderScreen.tsx ~ line 49 ~ FolderScreen ~ isFetching',
  //   isFetching
  // );
  console.log(
    "🚀 ~ file: FolderScreen.tsx ~ line 48 ~ FolderScreen ~ quickLink",
    quickLink,
  );
  const { data: me } = useGetMeQuery();

  const folders = getCanShowItems(
    quickLink?.folders || [],
    me?.email || "",
    me?.location?.location,
  );
  // const folders = quickLink?.folders?.filter((ele: any) => {
  //   const datenow = new Date().setHours(0, 0, 0, 0);

  //   if (ele?.startDate) {
  //     const parts = ele?.startDate.toString().split('-');
  //     const parsedStartDate = new Date(
  //       parts[0],
  //       parts[1] - 1,
  //       parts[2]
  //     ).getTime();

  //     if (parsedStartDate > datenow) {
  //       return false;
  //     }
  //   }
  //   if (ele?.endDate) {
  //     const parts = ele?.endDate.toString().split('-');
  //     const parsedEndDate = new Date(
  //       parts[0],
  //       parts[1] - 1,
  //       parts[2]
  //     ).getTime();
  //     if (parsedEndDate < datenow) {
  //       return false;
  //     }
  //   }
  //   return true;
  // });

  // const quickLink = findQuicklinkByTermId(quickLinks, termID);
  // if (quickLinks && !quickLink) {
  //   navigation.navigate('DashboardScreen');
  // }

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
            justifyContent: isPhone ? "flex-end" : "center",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.type.base,
              color: Colors.swireDarkGray,
              fontSize: 20,
              textAlign: "center",
              width: "73%",
              margin: 5,
              paddingRight: 15,
            }}
          >
            {folderName.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const jumpToAction = DrawerActions.jumpTo("DashboardScreen");
              navigation.dispatch(jumpToAction);
            }}
            style={{
              backgroundColor: Colors.swireRed,
              paddingHorizontal: 15,
              paddingVertical: 10,
              margin: 20,
              position: "absolute",
              left: 0,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.type.base,
                color: Colors.white,
                fontSize: isPhone ? 15 : 20,
              }}
            >
              BACK
            </Text>
          </TouchableOpacity>
        </View>
        {!isLoading && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={async () => {
                  await refetch();
                }}
              />
            }
            style={{ backgroundColor: Colors.swireLightGray }}
          >
            <View style={styles.scrollContainer}>
              {quickLink?.folder !== null && (
                <TouchableOpacity
                  style={[styles.tile, styles.shadow]}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="caret-up-circle-sharp"
                    size={24}
                    color={Colors.swireSuperDarkGray}
                  />
                </TouchableOpacity>
              )}

              {folders?.map((folder: any) => {
                return (
                  <FolderTile
                    key={`folder_tile_${folder.id}`}
                    folder={folder}
                    onPress={() => {
                      navigation.push("FolderScreen", {
                        termID: folder.id,
                        folderName: folder.name,
                      });
                    }}
                  />
                );
              })}
            </View>
            {quickLink?.media_items && (
              <FilesTile files={quickLink?.media_items} width={width} />
            )}
          </ScrollView>
        )}

        {/* {isFetching && (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" />
          </View>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    alignItems: "flex-start",
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
