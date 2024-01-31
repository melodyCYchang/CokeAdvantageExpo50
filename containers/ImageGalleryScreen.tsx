import { StackNavigationProp } from "@react-navigation/stack";
import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "~/redux/store";
import ImageTile from "../components/ImageTile";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { getUser } from "../redux/user";
import { useGetMockupsByUserQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";

type ImageGalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ImageGalleryScreen"
>;

type Props = {
  navigation: ImageGalleryScreenNavigationProp;
};

export default function ImageGalleryScreen({ navigation }: Props) {
  StatusBar.setBarStyle("light-content", true);
  const user = useSelector(getUser);

  const dispatch = useAppDispatch();
  const [errorText, setErrorText] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  // const [mockups, setMarkups] = useState();

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

  const { data, error, isLoading } = useGetMockupsByUserQuery({
    ID: user?.strapiID,
    sort_by: sortBy,
    order: sortBy === "created_at" ? "DESC" : "ASC",
  });
  // console.log(
  //   '🚀 ~ file: ImageGalleryScreen.tsx ~ line 48 ~ ImageGalleryScreen ~ user?.id',
  //   user
  // );

  const mockups = data;

  // console.log('mockup data:', data?.[0]);
  // console.log('mockup error:', error);

  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        {isPhone ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: 90,
              backgroundColor: Colors.white,
            }}
          >
            <View style={{ margin: 20 }}>
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 15,
                  color: Colors.swireDarkGray,
                  // fontWeight: 'bold',
                }}
              >
                MY PHOTO GALLERY
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 12,
                  color: Colors.swireDarkGray,
                  // fontWeight: 'bold',
                  margin: 10,
                }}
              >
                SORT BY
              </Text>
              <TouchableOpacity
                style={
                  sortBy === "created_at"
                    ? styles.sortBtnSelected
                    : styles.sortBtn
                }
                onPress={() => {
                  setSortBy("created_at");
                }}
              >
                <Text
                  style={{
                    ...styles.sortText,
                    fontSize: 10,
                    paddingHorizontal: 15,

                    color:
                      sortBy === "created_at"
                        ? Colors.white
                        : Colors.swireDarkGray,
                  }}
                >
                  DATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  sortBy === "name" ? styles.sortBtnSelected : styles.sortBtn,
                  { marginRight: 25 },
                ]}
                onPress={() => {
                  setSortBy("name");
                }}
              >
                <Text
                  style={{
                    ...styles.sortText,
                    fontSize: 10,
                    paddingHorizontal: 15,
                    color:
                      sortBy === "name" ? Colors.white : Colors.swireDarkGray,
                  }}
                >
                  NAME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: 90,
              backgroundColor: Colors.white,
            }}
          >
            <View style={{ margin: 20 }}>
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 25,
                  color: Colors.swireDarkGray,
                  // fontWeight: 'bold',
                }}
              >
                MY PHOTO GALLERY
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 20,
                  color: Colors.swireDarkGray,
                  // fontWeight: 'bold',
                  margin: 15,
                }}
              >
                SORT BY
              </Text>
              <TouchableOpacity
                style={
                  sortBy === "created_at"
                    ? styles.sortBtnSelected
                    : styles.sortBtn
                }
                onPress={() => {
                  setSortBy("created_at");
                }}
              >
                <Text
                  style={{
                    ...styles.sortText,
                    color:
                      sortBy === "created_at"
                        ? Colors.white
                        : Colors.swireDarkGray,
                  }}
                >
                  DATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  sortBy === "name" ? styles.sortBtnSelected : styles.sortBtn,
                  { marginRight: 25 },
                ]}
                onPress={() => {
                  setSortBy("name");
                }}
              >
                <Text
                  style={{
                    ...styles.sortText,
                    color:
                      sortBy === "name" ? Colors.white : Colors.swireDarkGray,
                  }}
                >
                  NAME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isLoading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
        {error && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>{error?.message}</Text>
          </View>
        )}

        <ScrollView style={{ backgroundColor: Colors.swireLightGray }}>
          {mockups && (
            <ImageTile
              imageArr={mockups}
              navigation={navigation}
              width={width}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
    // backgroundColor: 'white',
    backgroundColor: Colors.swireLightGray,
  },
  sortBtn: {
    borderColor: Colors.swireDarkGray,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sortBtnSelected: {
    backgroundColor: Colors.swireRed,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.swireRed,
  },
  sortText: {
    fontFamily: Fonts.type.base,
    fontSize: 20,
    paddingHorizontal: 35,
    paddingVertical: 10,
  },
});
