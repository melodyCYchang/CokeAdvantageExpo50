import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../theme";

import { useAppDispatch } from "~/redux/store";
import { getLogin } from "../redux/login";
import { useForgotPasswordMutation } from "../services/wpApi";
import { ForgotPasswordPayload } from "../types/ForgotPasswordPayload";
import { isEmailRule } from "../utils/isEmailRule";
import validateApiResponse from "../utils/validateApiResponse";
import DialogPopUp from "./DialogPopUp";
import MiniButton from "./MiniButton";
import TextInputController from "./TextInputController";

export default function ForgotPasswordDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { email, password, rememberMe } = useSelector(getLogin);

  // const [
  //   login, // This is the mutation trigger
  //   { isLoading: busy }, // This is the destructured mutation result
  // ] = useLoginMutation();

  // console.log(errors);

  const [
    forgotPassword, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordPayload>({
    defaultValues: {
      email,
    },
  });

  // console.log(forgotPasswordErrors);

  // const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (values: ForgotPasswordPayload) => {
    const { email } = values;
    try {
      setErrorText("");
      const data: any = await forgotPassword({ email });
      validateApiResponse(data);

      onClose();
    } catch (err: any) {
      console.error("login", err.message);
      setErrorText(err.message);
    }
  };
  return (
    <DialogPopUp title="Forgot Password" visibility setVisibility={onClose}>
      {errorText !== "" && (
        <Text
          style={{ color: Colors.swireRed, fontSize: 20, fontWeight: "bold" }}
        >
          {errorText}
        </Text>
      )}
      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
          color: Colors.swireDarkGray,
        }}
      >
        Please enter your email address and you will be sent a password rest
        request
      </Text>
      <TextInputController
        control={control}
        name="email"
        required
        autoCompleteType="email"
        autoCapitalize="none"
        autoFocus
        rules={isEmailRule}
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
          onPress={onClose}
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
