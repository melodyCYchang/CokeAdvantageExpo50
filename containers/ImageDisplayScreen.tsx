import { StackNavigationProp } from "@react-navigation/stack";
import { ResizeMode } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  ImageResizeMode,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/RootStackParamList";
import { Colors } from "../theme";
import { ControlStates, TouchableButton } from "./VideoDisplayScreen";

export const styles = StyleSheet.create({
  errorWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  videoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  iconWrapper: {
    borderRadius: 100,
    overflow: "hidden",
    padding: 10,
  },
  topInfoWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    padding: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomInfoWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  timeLeft: { backgroundColor: "transparent", marginLeft: 5 },
  timeRight: { backgroundColor: "transparent", marginRight: 5 },
  slider: { flex: 1, paddingHorizontal: 10 },
});

type ImageDisplayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ImageDisplayScreen"
>;

type Props = {
  navigation: ImageDisplayScreenNavigationProp;
  route: any;
};

export default function ImageDisplayScreen({ route, navigation }: Props) {
  const {
    file: { localFile },
  } = route.params;

  const duration = 500;

  let controlsTimer: NodeJS.Timeout | null = null;

  const [resize, setResize] = useState("contain");
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [controlsState, setControlsState] = useState(ControlStates.Visible);

  // We need to extract ref, because of misstypes in <Slider />
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { ref: sliderRef, ...sliderProps } = props.slider;
  // const screenRatio = props.style.width! / props.style.height!;

  // let videoHeight = props.style.height;
  // let videoWidth = videoHeight! * screenRatio;

  // if (videoWidth > props.style.width!) {
  //   videoWidth = props.style.width!;
  //   videoHeight = videoWidth / screenRatio;
  // }

  // useEffect(() => {
  //   if (!props.videoProps.source) {
  //     console.error(
  //       '[VideoPlayer] `Source` is a required in `videoProps`. ' +
  //         'Check https://docs.expo.io/versions/latest/sdk/video/#usage'
  //     );
  //     setErrorMessage('`Source` is a required in `videoProps`');
  //     setPlaybackInstanceInfo({
  //       ...playbackInstanceInfo,
  //       state: PlaybackStates.Error,
  //     });
  //   } else {
  //     setPlaybackInstanceInfo({
  //       ...playbackInstanceInfo,
  //       state: PlaybackStates.Playing,
  //     });
  //   }
  // }, [props.videoProps.source]);

  const hideAnimation = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setControlsState(ControlStates.Hidden);
      }
    });
  };

  const animationToggle = () => {
    if (controlsState === ControlStates.Hidden) {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setControlsState(ControlStates.Visible);
        }
      });
    } else if (controlsState === ControlStates.Visible) {
      hideAnimation();
    }

    if (controlsTimer === null) {
      controlsTimer = setTimeout(() => {
        // if (
        //   playbackInstanceInfo.state === PlaybackStates.Playing &&
        //   controlsState === ControlStates.Hidden
        // ) {
        hideAnimation();
        // }
        if (controlsTimer) {
          clearTimeout(controlsTimer);
        }
        controlsTimer = null;
      }, 2000);
    }
  };

  // if (playbackInstanceInfo.state === PlaybackStates.Error) {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: props.style.videoBackgroundColor,
  //         width: videoWidth,
  //         height: videoHeight,
  //       }}
  //     >
  //       <ErrorMessage style={props.textStyle} message={errorMessage} />
  //     </View>
  //   );
  // }

  // if (playbackInstanceInfo.state === PlaybackStates.Loading) {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: props.style.controlsBackgroundColor,
  //         width: videoWidth,
  //         height: videoHeight,
  //         justifyContent: 'center',
  //       }}
  //     >
  //       {props.icon.loading || (
  //         <ActivityIndicator {...props.activityIndicator} />
  //       )}
  //     </View>
  //   );
  // }

  return (
    <ImageBackground
      source={{ uri: localFile }}
      style={{
        flex: 1,
        backgroundColor: Colors.black,
        maxWidth: "100%",
      }}
      resizeMode={resize as ImageResizeMode}
    >
      <TouchableWithoutFeedback onPress={animationToggle}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: controlsOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              opacity: 0.5,
            }}
          />
          <View
            pointerEvents={
              controlsState === ControlStates.Visible ? "auto" : "none"
            }
          >
            <View style={styles.iconWrapper}>
              {/* <TouchableButton onPress={togglePlay}>
                <View>
                  {playbackInstanceInfo.state === PlaybackStates.Buffering &&
                    (props.icon.loading || (
                      <ActivityIndicator {...props.activityIndicator} />
                    ))}
                  {playbackInstanceInfo.state === PlaybackStates.Playing &&
                    props.icon.pause}
                  {playbackInstanceInfo.state === PlaybackStates.Paused &&
                    props.icon.play}
                  {playbackInstanceInfo.state === PlaybackStates.Ended &&
                    props.icon.replay}
                  {((playbackInstanceInfo.state === PlaybackStates.Ended &&
                    !props.icon.replay) ||
                    (playbackInstanceInfo.state === PlaybackStates.Playing &&
                      !props.icon.pause) ||
                    (playbackInstanceInfo.state === PlaybackStates.Paused &&
                      !props.icon.pause)) && (
                    <MaterialIcons
                      name={
                        playbackInstanceInfo.state === PlaybackStates.Playing
                          ? 'pause'
                          : playbackInstanceInfo.state === PlaybackStates.Paused
                          ? 'play-arrow'
                          : 'replay'
                      }
                      // style={props.icon.style}
                      // size={props.icon.size}
                      // color={props.icon.color}
                    />
                  )}
                </View>
              </TouchableButton> */}
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.topInfoWrapper,
          {
            opacity: controlsOpacity,
          },
        ]}
      >
        <TouchableButton
          onPress={() => {
            if (resize === "contain") {
              setResize("cover");
            } else {
              setResize("contain");
            }
          }}
        >
          <View>
            <MaterialIcons
              name={
                resize === ResizeMode.COVER ? "fullscreen-exit" : "fullscreen"
              }
              // style={props.icon.style}
              // size={props.icon.size! / 2}
              // color={props.icon.color}
              style={{ padding: 2 }}
              size={40}
              color={Colors.white}
            />
          </View>
        </TouchableButton>

        <TouchableButton
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View>
            <MaterialIcons
              name="close"
              // style={props.icon.style}
              // size={props.icon.size! / 2}
              // color={props.icon.color}
              style={{ padding: 2 }}
              size={40}
              color={Colors.white}
            />
          </View>
        </TouchableButton>
      </Animated.View>
    </ImageBackground>
  );
}
