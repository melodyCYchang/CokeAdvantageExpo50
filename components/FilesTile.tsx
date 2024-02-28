import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "~/navigation/RootStackParamList";
import { useAppDispatch } from "~/redux/store";
import pdfLogo from "../assets/img/icon-quick-link-file.png";
import vidLogo from "../assets/img/icon-quick-link-video.png";
import {
  deleteDownloadFile,
  downloadFile,
  getConfirmDeleteId,
  getDownloadId,
  getDownloading,
  getDownloads,
} from "../redux/downloads";
import { useGetMeQuery } from "../services/wpApi";
import { Colors, Fonts } from "../theme";
import { getCanShowItems } from "../utils/getCanShowItems";
import DownloadButton from "./DownloadButton";
import EmailButton from "./EmailButton";

export default function FilesTile({
  files,
  width,
}: {
  files: any;
  width: any;
}) {
  const height = (Dimensions.get("window").width * parseFloat(width)) / 100;

  // const navigation = useNavigation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const dispatch = useAppDispatch();
  const downloadedFiles: any = useSelector(getDownloads);
  // console.log(
  //   '🚀 ~ file: FilesTile.tsx ~ line 48 ~ downloadedFiles',
  //   downloadedFiles
  // );
  const confirmDeleteId: any = useSelector(getConfirmDeleteId);
  const downloading: any = useSelector(getDownloading);
  const { data: me } = useGetMeQuery();

  const filteredFiles = getCanShowItems(
    files,
    me?.email || "",
    me?.location?.location,
  );
  // const filteredFiles = files.filter((ele: any) => {
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

  const getFileName = (fileName: string) => {
    // let name = fileName.split('.').shift();
    // name = name?.replace(/_/g, ' ');

    return fileName?.toUpperCase();
  };

  const handleDownload = async (file: any) => {
    try {
      const downloadedFile = await dispatch(downloadFile(file));
      console.log(
        "🚀 ~ file: FilesTile.tsx ~ line 59 ~ handleDownload ~ downloadedFile",
        downloadedFile,
      );

      // if (file?.media.mime?.startsWith('video')) {
      //   navigation.navigate('VideoDisplayScreen', { file: downloadedFile });
      // } else
      if (file?.media.mime?.startsWith("image")) {
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
  const handleDelete = async (file: any) => {
    try {
      await dispatch(deleteDownloadFile(file));

      // Linking.openURL(uri.uri);
    } catch (err) {
      console.log("error", err);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {filteredFiles?.map((file: any) => {
          const downloaded = downloadedFiles?.[file.id];
          return (
            <View
              key={`file_tile_${file.id}`}
              style={{
                padding: 10,
                // flexGrow: 1,
                width,
                height,
                alignItems: "center",
                justifyContent: "center",
                // borderWidth: 2,
              }}
            >
              <TouchableOpacity
                style={[styles.tile, styles.shadow]}
                onPress={() => {
                  if (!downloaded) {
                    handleDownload(file);
                  } else if (file?.media?.mime) {
                    if (file?.media?.mime?.startsWith("image")) {
                      navigation.navigate("ImageDisplayScreen", {
                        file: downloadedFiles?.[file.id],
                      });
                    } else {
                      console.log(
                        "🚀 ~ file: FilesTile.tsx ~ line 132 ~ {files?.map ~ downloadedFiles?.[file.id]",
                        downloadedFiles?.[file.id],
                      );

                      navigation.navigate("MediaDisplayScreen", {
                        file: downloadedFiles?.[file.id],
                      });
                    }
                  }
                  // else {
                  //   navigation.navigate('VideoDisplayScreen', {
                  //     file: downloadedFiles?.[file.id],
                  //   });
                  // }
                }}
                onLongPress={() => {
                  if (downloaded) {
                    Alert.alert(
                      "Delete Presentation Assets?",
                      "Are you sure you want to delete this presentation? This will not delete the presentation from the server, only assets stored on your device.",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          onPress: () => {
                            handleDelete(file);
                          },
                        },
                      ],
                    );
                  }
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={
                      !file?.media?.mime?.startsWith("video")
                        ? file.localFile ||
                          file?.media?.mime?.startsWith("image")
                          ? { uri: file.media.url }
                          : pdfLogo
                        : vidLogo
                    }
                    style={{
                      backgroundColor: Colors.white,
                      width: 80,
                      height: 80,
                      margin: 10,
                    }}
                    resizeMode="contain"
                  />
                  <View style={{ position: "absolute", bottom: 0, right: -35 }}>
                    {/* <Text>Error: {isDownload}</Text> */}
                    <DownloadButton
                      isLoading={downloading[getDownloadId(file)]}
                      downloaded={downloaded}
                    />
                  </View>
                </View>
                <View style={styles.tileText}>
                  <Text style={Fonts.style.tileText}>
                    {getFileName(file.name)}
                  </Text>
                </View>
                <View
                  style={{
                    width: 0,
                    position: "absolute",
                    left: -10,
                    top: -10,
                  }}
                >
                  {/* <DeleteButton imgId={file.ID} /> */}
                  <EmailButton
                    subject=""
                    message=""
                    file={file}
                    iconColor={Colors.white}
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 7,
    width: "100%",
  },
  tile: {
    margin: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
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
