import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";
import { useAppDispatch } from "~/redux/store";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { ApplicationStyles } from "../theme";

type FreestyleProfitabilityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FreestyleProfitabilityScreen"
>;

type Props = {
  navigation: FreestyleProfitabilityScreenNavigationProp;
};

export default function FreestyleProfitabilityScreen({ navigation }: Props) {
  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();
  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <Text>Freestyle profitability screen</Text>
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
