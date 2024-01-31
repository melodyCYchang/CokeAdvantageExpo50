import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import FilesTile from "../components/FilesTile";
import { useGetMediaItemsQuery } from "../services/wpApi";
import { Colors } from "../theme";
import { searchResult } from "../utils/searchResult";

export default function SearchResults({ searchText }: { searchText: string }) {
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
    const orientationChange = Dimensions.addEventListener(
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
      orientationChange.remove();
    };
  }, []);

  const width = orientation === "PORTRAIT" ? portraitWidth : landscapeWidth;
  const {
    data: quickLinks,
    isFetching,
    isLoading,
    error,
  } = useGetMediaItemsQuery();
  const results = searchResult(quickLinks || [], searchText);

  return (
    <View style={styles.container}>
      {results && <FilesTile files={results} width={width} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: Colors.swireLightGray,
  },
});
