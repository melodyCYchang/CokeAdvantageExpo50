import { MaterialIcons } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "~/redux/store";
import { downloadFile, getDownloads } from "../redux/downloads";
import { Colors } from "../theme";

export default function EmailButton({
  subject,
  message,
  file,
  iconColor,
}: {
  subject: any;
  message: any;
  file: any;
  iconColor: any;
}) {
  const dispatch = useAppDispatch();
  const downloadedFiles: any = useSelector(getDownloads);
  const downloaded = downloadedFiles?.[file?.ID];

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor:
          iconColor === Colors.white ? Colors.swireRed : Colors.white,
      }}
    >
      <TouchableOpacity
        onPress={async () => {
          // Alert.alert('create email');
          // sendEmail('changmelody2727@gmail.com', subject, message);
          // Linking.openURL(
          //   'mailto:support@example.com?subject=SendMail&body=Description'
          // );
          // Opens prefilled email
          try {
            let downloadedFile = downloaded;
            if (!downloadedFile) {
              downloadedFile = await dispatch(downloadFile(file));
            }

            if (!downloadedFile.localFile) {
              throw new Error("could not download file");
            }
            const a = await MailComposer.composeAsync({
              recipients: [], // array of email addresses
              subject,
              body: message,
              attachments: [downloadedFile.localFile],
            });
            console.log(
              "🚀 ~ file: EmailButton.tsx ~ line 51 ~ onPress={ ~ a",
              a,
            );
          } catch (err) {
            console.log("error", err.message);
            // Alert(err.message);
          }
        }}
      >
        <MaterialIcons name="email" size={25} color={iconColor} />
      </TouchableOpacity>
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
  },
});
