import { DrawerActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "~/redux/store";
import FileTile from "../components/FilesTile";
import SearchBar from "../components/SearchBar";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useGetMediaItemsQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";
import { searchResult } from "../utils/searchResult";

type SearchResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchResultScreen"
>;

type Props = {
  navigation: SearchResultScreenNavigationProp;
  route: any;
};

export default function SearchResultScreen({ route, navigation }: Props) {
  const { searchText } = route.params;

  const [inputText, setInputText] = useState(searchText);
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

  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();

  // this query will be cache from the dashboard
  const {
    data: quickLinks,
    isFetching,
    isLoading,
    error,
  } = useGetMediaItemsQuery();
  // console.log(
  //   '🚀 ~ file: SearchResultScreen.tsx ~ line 55 ~ SearchResultScreen ~ quickLinks',
  //   quickLinks
  // );

  // console.log(
  //   '🚀 ~ file: SearchResultScreen.tsx ~ line 100 ~ SearchResultScreen ~ inputText',
  //   inputText
  // );

  const results = searchResult(inputText, quickLinks);

  //   if (quickLinks && !quickLink) {
  //     navigation.navigate('DashboardScreen');
  //   }

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
            justifyContent: "center",
          }}
        >
          <View>
            <SearchBar
              setSearchText={setInputText}
              searchText={inputText}
              onPress={undefined}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              const jumpToAction = DrawerActions.jumpTo("DashboardScreen");
              navigation.dispatch(jumpToAction);
            }}
            style={{
              backgroundColor: Colors.swireRed,
              paddingHorizontal: isPhone ? 10 : 15,
              paddingVertical: 10,
              margin: isPhone ? 10 : 20,
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
        <View style={styles.scrollContainer}>
          <ScrollView>
            {results && <FileTile files={results} width={width} />}
          </ScrollView>
        </View>
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
    backgroundColor: Colors.swireLightGray,
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
