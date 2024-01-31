import { useNavigation } from "@react-navigation/core";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
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
import { useGetPresentationsByFolderQuery } from "../services/wpApi";
import { Colors, Fonts } from "../theme";
import DownloadButton from "./DownloadButton";
import EmailButton from "./EmailButton";

export default function FilesTile({ slug }: { slug: string }) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const downloadedFiles: any = useSelector(getDownloads);
  const confirmDeleteId: any = useSelector(getConfirmDeleteId);
  const downloading: any = useSelector(getDownloading);

  // const isDownloaded = async (url: string) => {
  //   // let res = false;

  //   try {
  //     const filename = url.split('/').pop();
  //     const downloaded = await FileSystem.getInfoAsync(
  //       `${FileSystem.cacheDirectory}${filename}`
  //     );

  //     // return res;
  //     console.log('isDownloaded function: ', downloaded.exists);

  //     return downloaded.exists;
  //   } catch (err) {
  //     console.log('isDownloaded error', err);
  //     return false;
  //   }
  //   // return res;
  // };

  const handleDownload = async (file: any) => {
    try {
      const downloadedFile = await dispatch(downloadFile(file));
      console.log(
        "🚀 ~ file: FilesTile.tsx ~ line 59 ~ handleDownload ~ downloadedFile",
        downloadedFile,
      );

      if (file.video) {
        navigation.navigate("VideoDisplayScreen", { file: downloadedFile });
      } else if (file?.mime_type?.startsWith("image")) {
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

  const {
    data: quickLinks,
    isFetching,
    isLoading,
  } = useGetPresentationsByFolderQuery(slug);

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {quickLinks?.map((file: any) => {
          // const downloaded = isDownloaded(file.url);
          // console.log('in vieww: ', downloaded);
          const downloaded = downloadedFiles?.[file.ID];
          return (
            <TouchableOpacity
              key={`file_tile_${file.ID}`}
              style={[styles.tile, styles.shadow]}
              onPress={() => {
                // if (!downloaded) {
                //   handleDownload(file);
                // } else if (file.mime_type) {
                //   if (file.mime_type.startsWith('image')) {
                //     navigation.navigate('ImageDisplayScreen', {
                //       file: downloadedFiles?.[file.ID],
                //     });
                //   } else {
                //     navigation.navigate('MediaDisplayScreen', {
                //       file: downloadedFiles?.[file.ID],
                //     });
                //   }
                // }
                // else {
                //   navigation.navigate('VideoDisplayScreen', {
                //     file: downloadedFiles?.[file.ID],
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
                    !file.media.mime.startsWith("video")
                      ? file.localFile || file.media.mime.startsWith("image")
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
                  {file.post_title.toUpperCase()}
                </Text>
              </View>
              <View
                style={{ width: 0, position: "absolute", left: -10, top: -10 }}
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
          );
        })}
      </View>
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 7,
  },
  tile: {
    margin: 10,
    width: 225,
    height: 240,
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
