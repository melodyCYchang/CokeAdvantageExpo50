import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDeleteMockupMutation } from "../services/wpApi";
import { Colors } from "../theme";
import { DeleteMockupPayload } from "../types/DeleteMockupPayload";
import validateApiResponse from "../utils/validateApiResponse";
import DialogPopUp from "./DialogPopUp";
import MiniButton from "./MiniButton";

export default function DeleteButton({ imgId }: any) {
  const [errorText, setErrorText] = useState("");
  const [dialogVisibility, setDialogVisibility] = useState(false);

  const [
    deleteMockup, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useDeleteMockupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteMockupPayload>({
    defaultValues: {
      post_id: imgId,
    },
  });

  const onSubmit = async (values: DeleteMockupPayload) => {
    const { post_id } = values;

    try {
      setErrorText("");
      // console.log('id', post_id);
      // console.log('idID', postId);
      const data: any = await deleteMockup({
        post_id: imgId,
      });
      validateApiResponse(data);

      // TODO: validate succesful response
      if (data?.data?.id) {
        setDialogVisibility(false);

        // console.log(`succesfully logged in ${data?.data?.displayName}`);
        // return dispatch(setUser(data.data));
      }

      setErrorText("unknown error");
    } catch (err: any) {
      console.error("login", err.message);
      setErrorText(err.message);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setDialogVisibility(true);
          }}
        >
          <Feather name="x" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <DialogPopUp
        title="DELETE THIS MOCKUP?"
        visibility={dialogVisibility}
        setVisibility={setDialogVisibility}
        dialogWidth="70%"
      >
        <View>
          <View>
            <Text>Are you sure you want to delete this sales mockup?</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <MiniButton
              onPress={() => {
                setDialogVisibility(false);
              }}
              disabled={busy}
              text="CANCEL"
              textColor={Colors.swireRed}
              bgColor=""
            />
            <MiniButton
              onPress={handleSubmit(onSubmit)}
              disabled={busy}
              text="DELETE"
              textColor={Colors.swireRed}
              bgColor=""
            />
          </View>
        </View>
      </DialogPopUp>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.swireRed,
  },
});
