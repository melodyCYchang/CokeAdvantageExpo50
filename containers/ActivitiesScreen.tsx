import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { formatDistance } from "date-fns";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "~/redux/store";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { downloadFile, getDownloads } from "../redux/downloads";
import { getLastReadActivityTimestamp } from "../redux/persist";
import resetNewActivitiesCountAsync from "../redux/user/resetNewActivitiesCountAsync";
import { useGetActivitiesQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";
import { Activity } from "../types/Activity";

type ActivitiesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ActivitiesScreen"
>;

type Props = {
  navigation: ActivitiesScreenNavigationProp;
};

export default function ActivitiesScreen({ navigation }: Props) {
  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();
  const downloadedFiles: any = useSelector(getDownloads);

  // const activities = useSelector(getActivities);
  const unreadTime = useSelector(getLastReadActivityTimestamp);
  const [lastUnread, setLastUnread] = useState(unreadTime);

  const {
    data: activities,
    isFetching, // refetching
    isLoading, // initial load
    error,
    refetch,
  } = useGetActivitiesQuery();
  // console.log(
  //   '🚀 ~ file: ActivitiesScreen.tsx ~ line 50 ~ ActivitiesScreen ~ activities',
  //   activities
  // );
  // if (activities) {
  //   dispatch(setActivities(activities));
  // }

  useFocusEffect(
    React.useCallback(() => {
      const timeout = setTimeout(() => {
        dispatch(resetNewActivitiesCountAsync());
      }, 200);
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }, [dispatch]),
  );
  // useFocusEffect(() => {
  //   const timeout = setTimeout(() => {
  //     dispatch(resetNewActivitiesCountAsync());
  //   }, 200);
  //   return () => {
  //     if (timeout) clearTimeout(timeout);
  //   };
  // }, [dispatch]);

  // console.log(
  //   '🚀 ~ file: ActivitiesScreen.tsx ~ line 34 ~ ActivitiesScreen ~ activities',
  //   activities
  // );
  const handleDownload = async (file: any) => {
    try {
      const downloadedFile = await dispatch(downloadFile(file));
      console.log(
        "🚀 ~ file: ActivitiesScreen.tsx ~ line 59 ~ handleDownload ~ downloadedFile",
        downloadedFile,
      );

      // if (file?.media.mime?.startsWith('video')) {
      //   navigation.navigate('VideoDisplayScreen', { file: downloadedFile });
      // } else
      if (file?.media?.mime?.startsWith("image")) {
        navigation.navigate("ImageDisplayScreen", { file: downloadedFile });
      } else {
        navigation.navigate("MediaDisplayScreen", {
          file: downloadedFile,
        });
      }

      // Linking.openURL(downloadedFile);
    } catch (err) {
      console.log("error", err);
      return false;
    }
  };

  return (
    <View style={ApplicationStyles.mainContainer}>
      {/* <TouchableOpacity
        onPress={() => {
          dispatch(setLastReadActivityTimestamp(new Date().valueOf() - 200000));
          console.log(
            '🚀 ~ file: ActivitiesScreen.tsx ~ line 58 ~ ActivitiesScreen ~ new Date().valueOf() - 200000',
            new Date().valueOf() - 200000
          );
          console.log(
            '🚀 ~ file: ActivitiesScreen.tsx ~ line 69 ~ activities.map ~ lastUnread',
            lastUnread
          );

          setLastUnread(new Date().valueOf() - 200000);
          console.log(
            '🚀 ~ file: ActivitiesScreen.tsx ~ line 69 ~ activities.map ~ lastUnread',
            lastUnread
          );
        }}
      >
        <Text>change time</Text>
      </TouchableOpacity> */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={async () => {
              await refetch();
              await dispatch(resetNewActivitiesCountAsync());
              setLastUnread(new Date().valueOf());
            }}
          />
        }
      >
        {activities &&
          activities.map((activity: Activity) => {
            // console.log(
            //   '🚀 ~ file: ActivitiesScreen.tsx ~ line 80 ~ activities.map ~ lastUnread > new Date(activity.created_at).valueOf()',
            //   // lastUnread,
            //   lastUnread < new Date(activity.created_at).valueOf()
            //   // new Date(activity.created_at).valueOf()
            // );
            const unread = lastUnread < new Date(activity.created_at).valueOf();

            return (
              <TouchableOpacity
                key={`activities_${activity.id}`}
                style={{ ...styles.activityTile, ...styles.shadow }}
                onPress={() => {
                  if (activity.folder) {
                    // console.log(
                    //   '🚀 ~ file: ActivitiesScreen.tsx ~ line 93 ~ activities.map ~ activity.folder',
                    //   activity.folder
                    // );
                    navigation.navigate("FolderStackNavigation", {
                      screen: "FolderScreen",
                      params: {
                        termID: activity.folder.id,
                        folderName: activity.folder.name,
                      },
                    });
                  } else if (activity.media_item) {
                    // console.log(
                    //   '🚀 ~ file: ActivitiesScreen.tsx ~ line 106 ~ activities.map ~ activity.media_item',
                    //   activity.media_item
                    // );
                    const downloaded =
                      downloadedFiles?.[activity.media_item.id];

                    if (!downloaded) {
                      handleDownload(activity.media_item);
                    } else if (activity?.media_item?.media?.mime) {
                      if (activity.media_item.media.mime.startsWith("image")) {
                        navigation.navigate("ImageDisplayScreen", {
                          file: downloadedFiles?.[activity.media_item.id],
                        });
                      } else {
                        console.log(
                          "🚀 ~ file: FilesTile.tsx ~ line 132 ~ {files?.map ~ downloadedFiles?.[file.id]",
                          downloadedFiles?.[activity.media_item.id],
                        );

                        navigation.navigate("MediaDisplayScreen", {
                          file: downloadedFiles?.[activity.media_item.id],
                        });
                      }
                    }
                  }
                }}
              >
                <View style={styles.tileTitle}>
                  <Text
                    style={
                      !unread
                        ? Fonts.style.titleText
                        : Fonts.style.titleBoldText
                    }
                  >
                    {activity.title.toUpperCase()}
                  </Text>
                  <Text style={Fonts.style.description}>
                    {formatDistance(new Date(activity.created_at), new Date())}{" "}
                    ago
                  </Text>
                </View>
                <Text
                  style={{
                    ...Fonts.style.normal,
                    color: unread ? Colors.swireDarkGray : "#787878",
                  }}
                >
                  {activity.body}
                </Text>
                {activity.folder && (
                  <Text
                    style={{
                      ...Fonts.style.normal,
                      color: unread ? Colors.swireDarkGray : "#787878",
                    }}
                  >
                    Folder: {activity.folder.name}
                  </Text>
                )}
                {activity.media_item && (
                  <Text
                    style={{
                      ...Fonts.style.normal,
                      color: unread ? Colors.swireDarkGray : "#787878",
                    }}
                  >
                    MediaItem: {activity.media_item.name}
                  </Text>
                )}
                {!unread && <View style={styles.overlay} />}
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
    backgroundColor: "white",
    padding: 50,
  },
  tileTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityTile: {
    // width: '100%',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    marginLeft: 7,
    fontFamily: Fonts.type.base,
  },
  linkButton: {
    width: "95%",
    // height: 38,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    fontFamily: Fonts.type.base,
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
