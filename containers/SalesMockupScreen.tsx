import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "~/redux/store";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ViewShot, { captureRef } from "react-native-view-shot";
import MiniButton from "../components/MiniButton";
import TakePhoto from "../components/TakePhoto";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { ApplicationStyles, Colors, Fonts } from "../theme";

import MachineSelectionPanel from "../components/MachineSelectionPanel";
import MovableImage from "../components/MovableImage";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SalesMockupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SalesMockupScreen"
>;

type Props = {
  navigation: SalesMockupScreenNavigationProp;
  route: any;
};

export default function SalesMockupScreen({ route, navigation }: Props) {
  console.log(
    "🚀 ~ file: SalesMockupScreen.tsx ~ line 39 ~ SalesMockupScreen ~ route",
    route,
  );
  const clear = route?.params?.clear;
  // console.log(
  //   '🚀 ~ file: SalesMockupScreen.tsx ~ line 39 ~ SalesMockupScreen ~ clear',
  //   clear
  // );
  const mockup = route?.params?.mockup;

  const dispatch = useAppDispatch();

  const [photo, setPhoto] = useState<any>(null);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [machineUrls, setMachineUrls] = useState<Array<any>>([]);
  console.log(
    "🚀 ~ file: SalesMockupScreen.tsx ~ line 56 ~ SalesMockupScreen ~ machineUrls",
    machineUrls,
  );
  const [machinePanel, setMachinePanel] = useState(false);

  const photoRef = useRef(null);

  // useFocusEffect(() => {
  //   ScreenOrientation.getOrientationLockAsync()
  //     .then((results) => {
  //       console.log('check lock', results);
  //       return ScreenOrientation.lockAsync(
  //         ScreenOrientation.OrientationLock.LANDSCAPE
  //       );
  //       // return ScreenOrientation.lockPlatformAsync({
  //       //   screenOrientationArrayIOS: [
  //       //     ScreenOrientation.Orientation.LANDSCAPE_LEFT,
  //       //     ScreenOrientation.Orientation.LANDSCAPE_RIGHT,
  //       //   ],
  //       //   screenOrientationConstantAndroid: 0, // Landscape
  //       // });
  //     })
  //     .then(() => {
  //       return ScreenOrientation.supportsOrientationLockAsync(
  //         ScreenOrientation.OrientationLock.LANDSCAPE
  //       );
  //     })
  //     .then((results) => {
  //       console.log(
  //         'can lock',
  //         ScreenOrientation.OrientationLock.LANDSCAPE,
  //         results
  //       );
  //       return ScreenOrientation.getOrientationLockAsync();
  //     })
  //     .then((results) => {
  //       console.log('check lock2', results);
  //     });
  //   return () => {
  //     console.log('restoring unlocked screen rotation');
  //     return ScreenOrientation.unlockAsync();
  //   };
  // });

  useEffect(() => {
    if (clear) {
      // console.log('clearing......');

      setTakingPhoto(false);
      setPhoto(null);
      setMachinePanel(false);
      setMachineUrls([]);
    } // getting machine positions from api
    if (mockup) {
      try {
        // console.log(
        //   '🚀 ~ file: SalesMockupScreen.tsx ~ line 60 ~ useEffect ~ mockup.machine_positioning',
        //   mockup
        // );
        const jsonposition = JSON.parse(mockup.stickerPlacement || "{}");
        console.log(
          "🚀 ~ file: SalesMockupScreen.tsx ~ line 62 ~ useEffect ~ jsonposition",
          jsonposition,
        );

        // json position is array in an array so pull the first one out
        setMachineUrls(jsonposition);

        // setMachineUrls(JSON.parse(mockup.machine_positioning));
      } catch (err) {
        console.log("sales mockup not parse to json", err);
      }
    }
  }, [clear, mockup]);
  // const onCaptureImage = (uri) => {
  //   photoRef.viewShot.capture().then((uri) => {
  //     console.log('do something with ', uri);
  //   });
  // };

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      setPhoto(result);
      setMachinePanel(true);
    }
  };

  if (takingPhoto) {
    return (
      <View style={ApplicationStyles.mainContainer}>
        {/* <StatusBar hidden /> */}
        <TakePhoto
          onSave={(data) => {
            console.log("set photo:   ", data);

            setTakingPhoto(false);
            setPhoto(data);
            setMachinePanel(true);
            // Temp set some stickers
            // setMachineUrls([
            //   // 'https://swiretoolkit.com/wp-content/uploads/2016/04/FREESTYLE-7000-845x1024.png',
            //   // 'https://swiretoolkit.com/wp-content/uploads/2016/04/BELL-TUMBLER-505x1024.png',
            // ]);
          }}
          onCancel={() => {
            setTakingPhoto(false);
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        ...ApplicationStyles.mainContainer,
        backgroundColor: Colors.swireSuperDarkGray,
      }}
    >
      {/* <StatusBar hidden /> */}

      <ViewShot
        ref={photoRef}
        style={{
          // borderColor: 'yellow',
          // borderWidth: 1,
          height: "100%",
          width: "100%",
        }}
      >
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={ApplicationStyles.mainContainer}
          />
        )}
        <View
          style={{
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            position: "relative",
            top: -Dimensions.get("window").height / 2,
            // left: Dimensions.get('window').width / 2.5,
          }}
        >
          {machineUrls?.map((machine, index) => (
            <MovableImage
              key={`movable_image_${machine.machine_id}`}
              // source={{ uri: machine.machine_uri }}
              source={machine}
              onPositionChange={(x: number, y: number) => {
                console.log("onPositionChange: ", x, y);
                machine.machine_left = x.toString();
                machine.machine_top = y.toString();
                console.log("sales mockup screen line 115 url: ", machineUrls);
              }}
              onScaleChange={(scale: number) => {
                const width = Number(machine.machine_width) * scale;
                const height = Number(machine.machine_height) * scale;
                machine.machine_width = width.toString();
                machine.machine_height = height.toString();
                machine.machine_scale = scale.toString();
                console.log("sales mockup screen line 127 url: ", machineUrls);
              }}
              onRotationChange={(rotation: number) => {
                machine.machine_rotation = rotation.toString();
              }}
              onRemoveImage={() => {
                console.log("remove me!");
                const newMachineUrls = [...machineUrls];
                newMachineUrls.splice(index, 1);
                setMachineUrls(newMachineUrls);
              }}
            />
          ))}
        </View>
      </ViewShot>

      {photo && (
        <View style={styles.bottomContainer}>
          <MiniButton
            text="RETAKE PHOTO"
            onPress={() => {
              setMachineUrls([]);
              setPhoto(null);
            }}
            textColor={Colors.white}
            bgColor={Colors.swireRed}
          />
          <MiniButton
            text="SAVE PHOTO"
            textColor={Colors.white}
            bgColor={Colors.swireRed}
            onPress={() => {
              // onCaptureImage();
              captureRef(photoRef, {
                format: "png",
                quality: 0.8,
              }).then(
                (uri) => {
                  console.log("Image saved to", uri);
                  console.log("machine positions: ", machineUrls);
                  navigation.navigate("SaveMockupScreen", {
                    imageUri: uri,
                    machines: machineUrls,
                    mockup,
                  });
                },
                (error) => console.error("Oops, snapshot failed", error),
              );
            }}
          />
        </View>
      )}

      {photo && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
          }}
          onPress={() => setMachinePanel(!machinePanel)}
        >
          <Text style={{ ...Fonts.style.btnText, paddingLeft: 10 }}>
            MACHINE SELECTION
          </Text>
          <MaterialIcons name="arrow-right" size={50} color={Colors.swireRed} />
        </TouchableOpacity>
      )}
      {machinePanel && (
        <MachineSelectionPanel
          onPress={() => setMachinePanel(false)}
          addToList={async (machines: any) => {
            const tmpArr = machineUrls;
            tmpArr.push(machines);
            console.log("sales mockup screen line 173 url: ", tmpArr);
            setMachineUrls([...tmpArr]);
            // await sleep(1000);
            // tmpArr[tmpArr.length - 1].machine_top = -300;
            // setMachineUrls([...tmpArr]);
            // await sleep(1000);
            // tmpArr[tmpArr.length - 1].machine_top = -600;
            // setMachineUrls([...tmpArr]);
          }}
          // machineUrls={machineUrls}
          // setMachineUrls={setMachineUrls}
        />
      )}
      {!photo && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // borderWidth: 1,
            // borderColor: Colors.white,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
          }}
        >
          <View>
            <FontAwesome
              name="camera"
              size={100}
              color={Colors.swireDarkGray}
            />
          </View>
          <View style={styles.bottomContainer}>
            <MiniButton
              text="USE CAMERA"
              onPress={() => setTakingPhoto(true)}
              textColor={Colors.white}
              bgColor={Colors.swireRed}
            />
            <MiniButton
              text="CHOOSE FROM DEVICE"
              textColor={Colors.white}
              bgColor={Colors.swireRed}
              onPress={showImagePicker}
            />
          </View>
        </View>
      )}
    </View>
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
});
