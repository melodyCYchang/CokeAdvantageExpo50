import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme";

export default function SearchBar({
  onPress,
  setSearchText,
  searchText,
  onClose,
}: {
  onPress: any;
  onClose: any;
  setSearchText: any;
  searchText: string;
}) {
  return (
    <View style={styles.container}>
      <View
        style={{
          borderColor: Colors.swireDarkGray,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "65%",
          height: "100%",
          position: "relative",
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors.swireDarkGray,
            width: "100%",
            padding: 10,
            fontSize: 15,
            textAlign: "center",
            margin: 10,
          }}
          onChangeText={setSearchText}
          value={searchText}
          placeholder="SEARCH FOR PRESENTATIONS"
          placeholderTextColor="#707070"
          onSubmitEditing={onPress}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={24} color="#707070" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <FontAwesome name="search" size={24} color={Colors.swireDarkGray} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    height: 100,
    width: "100%",
    // paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  closeButton: {
    position: "absolute",
    right: 15,
  },
});
