import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Machine } from "~/types/Machine";
import { useGetMachinesQuery } from "../services/wpApi";
import { Colors, Fonts } from "../theme";
import LoadableImage from "./LoadableImage";
import MachineFilter from "./MahchineFilter";

export default function MachineSelectionPanel({ onPress, addToList }: any) {
  const [filterDialog, setFilterDialog] = useState(false);
  const [filterValue, setFilterValue] = useState("ALL");

  const { data, isFetching, isLoading } = useGetMachinesQuery();
  let machines: any = [];
  if (filterValue.toLowerCase() !== "all") {
    data?.forEach((machine) => {
      if (machine?.type.replaceAll("_", " ") === filterValue.toLowerCase()) {
        machines.push(machine);
      }
    });
    console.log("filtering: ", filterValue);

    console.log("machine data: ", machines);
  } else {
    machines = data;
  }

  //   console.log('machine data: ', data);

  const aspectRatio = (width: any, height: any) => {
    if (width && height) {
      return width / height;
    }
    return 1;
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onPress}
          >
            <MaterialIcons
              name="arrow-right"
              size={50}
              color={Colors.swireRed}
            />
            <Text style={Fonts.style.text20}>CLOSE</Text>
          </TouchableOpacity>
          <FontAwesome
            name="hand-pointer-o"
            size={40}
            color={Colors.swireRed}
          />
          <View style={{ width: "35%" }}>
            <Text
              style={{
                ...Fonts.style.tileText,
                textAlign: "left",
                color: Colors.swireDarkGray,
              }}
            >
              SELECT A MACHINE TO ADD TO PHOTO
            </Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.scrollContainer}>
            {machines?.map((machine: Machine) => {
              //   console.log('machine: ', machine?.thumbnail?.sizes?.medium[0]);

              return (
                <TouchableOpacity
                  key={`image_tile_${machine.id}`}
                  style={styles.tile}
                  onPress={() => {
                    // Alert.alert('add machine to screen');
                    addToList({
                      machine_left: 0,
                      machine_top: 0,
                      machine_height: machine?.media?.height,
                      machine_width: machine?.media?.width,
                      machine_rotation: 0,
                      machine_id: machine.id,
                      machine_uri: machine?.media?.url,
                      machine_scale: 1,
                    });
                    onPress();
                  }}
                >
                  <LoadableImage
                    source={{
                      uri: machine?.media?.formats?.thumbnail?.url,
                    }}
                    style={{
                      width: "100%",
                      //   height: '100%',
                      backgroundColor: Colors.white,
                      // width: 230,
                      // height: img.thumbnail.sizes.medium[2],
                      aspectRatio: aspectRatio(
                        machine?.media?.width,
                        machine?.media?.height,
                      ),
                    }}
                    // resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              width: "85%",
              height: 50,
              borderWidth: 1,
              margin: 15,
              justifyContent: "center",
            }}
            onPress={() => setFilterDialog(true)}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 10,
              }}
            >
              <Text
                style={{
                  ...Fonts.style.btnText,
                  color: Colors.swireDarkGray,
                  marginLeft: 10,
                }}
              >
                {filterValue.toUpperCase()}
              </Text>
              <FontAwesome name="caret-down" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {filterDialog && (
        <MachineFilter
          visibility={filterDialog}
          setVisibility={setFilterDialog}
          selectedValue={filterValue}
          onChange={setFilterValue}
          onClose={() => {
            setFilterDialog(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  closeContainer: {
    flex: 1,
    height: "100%",
  },
  container: {
    width: 350,
    height: "100%",
    backgroundColor: Colors.white,
    position: "absolute",
    right: 0,
  },
  folderTile: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 125,
    flexDirection: "row",
    padding: 20,
  },
  tile: {
    margin: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    alignItems: "center",
    margin: 20,
  },
  scrollContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
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
    // backgroundColor: "white",
  },
});
