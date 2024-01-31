import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../theme";

import { useUpdateMockupNameMutation } from "../services/wpApi";
import { UpdateMockupPayload } from "../types/UpdateMockupPayload";
import validateApiResponse from "../utils/validateApiResponse";
import DialogPopUp from "./DialogPopUp";
import MiniButton from "./MiniButton";
import TextInputController from "./TextInputController";

export default function EditDetailsDialog({
  onClose,
  imageSource,
  onCancel,
}: {
  onClose: () => void;
  imageSource: any;
  onCancel: () => void;
}) {
  // const [
  //   login, // This is the mutation trigger
  //   { isLoading: busy }, // This is the destructured mutation result
  // ] = useLoginMutation();

  const [
    updateMockup, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useUpdateMockupNameMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateMockupPayload>({
    defaultValues: {
      name: imageSource.name,
    },
  });

  console.log(imageSource.post_title);

  // const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (values: UpdateMockupPayload) => {
    const { name } = values;
    try {
      setErrorText("");
      const data: any = await updateMockup({
        name,
        id: imageSource.id,
      });
      validateApiResponse(data);

      onClose();
    } catch (err: any) {
      console.error("login", err.message);
      setErrorText(err.message);
    }
  };
  return (
    <DialogPopUp
      title="EDIT DETAILS"
      visibility
      setVisibility={onClose}
      dialogWidth={300}
    >
      {errorText !== "" && (
        <Text
          style={{
            fontFamily: Fonts.type.base,
            color: Colors.swireRed,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {errorText}
        </Text>
      )}
      <Text
        style={{
          fontFamily: Fonts.type.base,
          fontSize: 20,
          marginBottom: 20,
          color: Colors.swireDarkGray,
        }}
      >
        NEW COMPANY NAME
      </Text>
      <TextInputController
        control={control}
        name="name"
        required
        autoCapitalize="none"
        autoFocus
        inputStyle={styles.popuInput}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <MiniButton
          onPress={onCancel}
          disabled={busy}
          text="CANCEL"
          textColor={Colors.swireRed}
          bgColor=""
        />
        <MiniButton
          onPress={handleSubmit(onSubmit)}
          disabled={busy}
          text="SUBMIT"
          textColor={Colors.swireRed}
          bgColor=""
        />
      </View>
    </DialogPopUp>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: Colors.white,
    borderColor: Colors.white,
    width: "35%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  loginBtn: {
    backgroundColor: Colors.white,
    width: 150,
    padding: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.swireRed,
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  btnText: {
    fontSize: 20,
    color: Colors.white,
    textAlign: "center",
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
  input: {
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 3,
    color: Colors.white,
    textAlign: "center",
    fontSize: 20,
  },
  popuInput: {
    padding: 10,
    borderColor: Colors.swireLightGray,
    borderBottomWidth: 2,
    fontSize: 20,
  },
  popupBtnText: {
    color: Colors.swireRed,
    fontSize: 18,
  },
  btnTile: {
    backgroundColor: Colors.swireDarkGray,
    width: 150,
    margin: 10,
    padding: 10,
  },
});
