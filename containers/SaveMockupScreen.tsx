import React, { useEffect, useState } from "react";
// import FormData from 'form-data';
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "~/redux/store";

import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import MiniButton from "../components/MiniButton";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { Colors, Fonts } from "../theme";

import imgBg from "../assets/img/squiggle-gray.png";
import DialogPopUp from "../components/DialogPopUp";
import { getUser } from "../redux/user";
import { useDeleteMockupMutation } from "../services/wpApi";
import uploadMockupAsync from "../thunk/uploadMockupAsync";

type SaveMockupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SaveMockupScreen"
>;

type Props = {
  navigation: SaveMockupScreenNavigationProp;
  route: any;
};

export default function SaveMockupScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const user = useSelector(getUser);
  const { imageUri, machines, mockup } = route.params;
  console.log(
    "🚀 ~ file: SaveMockupScreen.tsx ~ line 45 ~ SaveMockupScreen ~ mockup",
    mockup,
  );
  // console.log(
  //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 43 ~ SaveMockupScreen ~ imageUri',
  //   imageUri
  // );
  const [companyName, setCompanyName] = useState(mockup ? mockup.name : "");
  console.log(
    "🚀 ~ file: SaveMockupScreen.tsx ~ line 54 ~ SaveMockupScreen ~ companyName",
    companyName,
  );
  const [redirectPopup, setRedirectPopup] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mockup) {
      setCompanyName(mockup.name);
    } else {
      setCompanyName("");
    }
  }, [mockup, imageUri]);

  // const [
  //   uploadMockup, // This is the mutation trigger
  //   { isLoading: uploadBusy }, // This is the destructured mutation result
  // ] = useUploadMockupMutation();
  // const [
  //   createMockup, // This is the mutation trigger
  //   { isLoading: createBusy }, // This is the destructured mutation result
  // ] = useCreateMockupMutation();
  const [
    deleteMockup, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useDeleteMockupMutation();

  const handleSaveImage = async () => {
    if (companyName && imageUri) {
      try {
        setSaving(true);
        // Call Thunk
        const results = await dispatch(
          uploadMockupAsync(user, mockup?.id, imageUri, companyName, machines),
        );
        console.log(
          "🚀 ~ file: SaveMockupScreen.tsx ~ line 74 ~ handleSaveImage ~ results",
          results,
        );
        if (results?.data?.id) {
          setSaving(false);
          setRedirectPopup(true);
        }
      } catch (err: any) {
        console.log(`upload error ${err.message}`);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: Colors.white,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
      behavior="padding"
    >
      <View
        style={{
          width: "50%",
          height: "100%",
          position: "absolute",
          left: 0,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: "80%", height: "90%", marginRight: 20 }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{ width: "50%", height: "100%", position: "absolute", right: 0 }}
      >
        <ImageBackground
          source={imgBg}
          style={{ height: "100%" }}
          resizeMode="stretch"
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.type.base,
                fontSize: 30,
                color: Colors.white,
                fontWeight: "bold",
              }}
            >
              SAVE IMAGE
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: Colors.white,
                color: Colors.white,
                width: "60%",
                padding: 10,
                fontSize: 20,
                textAlign: "center",
              }}
              onChangeText={setCompanyName}
              value={companyName}
              // editable={!disabled}
              placeholder="COMPANY NAME"
              placeholderTextColor="#dbd7d7"
              // secureTextEntry={password}
              // autoCapitalize={autoCapitalize}
              // autoCompleteType={autoCompleteType}
              autoFocus
            />
            <MiniButton
              onPress={() => {
                if (!saving) {
                  handleSaveImage();
                }
              }}
              disabled={!companyName}
              text="SAVE PHOTO"
              textColor={Colors.white}
              bgColor={Colors.swireRed}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                padding: 20,
                justifyContent: "center",
                alignItems: "center",
                width: "60%",
              }}
              onPress={() => {
                if (!saving) {
                  navigation.navigate("SalesMockupScreen", {
                    clear: new Date().valueOf(),
                  });
                }
              }}
            >
              <Ionicons name="caret-back-circle" size={55} color="white" />
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 20,
                  color: Colors.white,
                  paddingLeft: 20,
                  textAlign: "center",
                }}
              >
                START OVER WITHOUT SAVING
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <DialogPopUp
        title="PHOTO SAVED"
        visibility={redirectPopup}
        setVisibility={setRedirectPopup}
        dialogWidth={350}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <MiniButton
            onPress={() => {
              setRedirectPopup(false);
              navigation.navigate("SalesMockupScreen", {
                clear: new Date().valueOf(),
              });
            }}
            text="NEW MOCKUP"
            textColor={Colors.swireRed}
            bgColor=""
          />
          <MiniButton
            onPress={() => {
              setRedirectPopup(false);
              navigation.navigate("ImageGalleryScreen");
            }}
            text="VIEW GALLERY"
            textColor={Colors.swireRed}
            bgColor=""
          />
        </View>
      </DialogPopUp>
      {saving && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <ActivityIndicator size="large" color={Colors.swireRed} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.swireSuperDarkGray,
  },
  popuInput: {
    padding: 10,
    borderColor: Colors.swireLightGray,
    borderBottomWidth: 2,
    fontSize: 20,
  },
});
