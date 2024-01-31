import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useAppDispatch } from "~/redux/store";
import TestimonialTile from "../components/TestimonialTile";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { useGetTestimonialsQuery } from "../services/wpApi";
import { ApplicationStyles, Colors, Fonts } from "../theme";

type TestimonialsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TestimonialsScreen"
>;

type Props = {
  navigation: TestimonialsScreenNavigationProp;
  route: any;
};

export default function TestimonialsScreen({ route, navigation }: Props) {
  const { folderObj, termID } = route.params;
  // console.log('folder: ', folderObj);

  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();

  // this query will be cache from the dashboard
  const {
    data: testimonials,
    isFetching,
    isLoading,
  } = useGetTestimonialsQuery();
  console.log(
    "🚀 ~ file: TestimonialsScreen.tsx ~ line 52 ~ TestimonialsScreen ~ testimonials",
    testimonials,
  );

  //   if (childFolders && !folders) {
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

          <Text style={Fonts.style.headerText}>TESTIMONIALS</Text>
        </View>
        <ScrollView style={{ backgroundColor: Colors.swireLightGray }}>
          {/* <View style={styles.scrollContainer}>
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
                    navigation.push('TestimonialsScreen', {
                      termID: folder.term_id,
                    });
                  }}
                />
              ))}
          </View> */}
          {testimonials && <TestimonialTile testimonials={testimonials} />}
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
