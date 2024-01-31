import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";
import { useAppDispatch } from "~/redux/store";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { ApplicationStyles } from "../theme";

type ReportsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReportsScreen"
>;

type Props = {
  navigation: ReportsScreenNavigationProp;
};

export default function ReportsScreen({ navigation }: Props) {
  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();
  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <Text>Reports</Text>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="Back"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
