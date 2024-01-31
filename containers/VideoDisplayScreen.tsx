import { StackNavigationProp } from "@react-navigation/stack";
import { AVPlaybackStatus, Audio, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import { RootStackParamList } from "../navigation/RootStackParamList";
import { Colors } from "../theme";

export enum ControlStates {
  Visible = "Visible",
  Hidden = "Hidden",
}

export enum PlaybackStates {
  Loading = "Loading",
  Playing = "Playing",
  Paused = "Paused",
  Buffering = "Buffering",
  Error = "Error",
  Ended = "Ended",
}

export enum ErrorSeverity {
  Fatal = "Fatal",
  NonFatal = "NonFatal",
}

export type ErrorType = {
  type: ErrorSeverity;
  message: string;
  obj: Record<string, unknown>;
};

export const ErrorMessage = ({
  message,
  style,
}: {
  message: string;
  style: TextStyle;
}) => (
  <View style={styles.errorWrapper}>
    <Text style={style}>{message}</Text>
  </View>
);

export const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, "0") + ":" + seconds.padStart(2, "0");
};

type ButtonProps = (TouchableNativeFeedbackProps | TouchableOpacityProps) & {
  children: React.ReactNode;
};
export const TouchableButton = (props: ButtonProps) =>
  Platform.OS === "android" ? (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("white", true)}
      {...props}
    />
  ) : (
    <TouchableOpacity {...props} />
  );

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepMerge = (
  target: { [x: string]: any },
  source: { [x: string]: any },
) => {
  const result = { ...target, ...source };
  const keys = Object.keys(result);

  for (const key of keys) {
    const tprop = target[key];
    const sprop = source[key];
    if (typeof tprop === "object" && typeof sprop === "object") {
      result[key] = deepMerge(tprop, sprop);
    }
  }

  return result;
};
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

type VideoDisplayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VideoDisplayScreen"
>;

type Props = {
  navigation: VideoDisplayScreenNavigationProp;
  route: any;
};

export default function VideoDisplayScreen({ route, navigation }: Props) {
  const {
    file: { localFile },
  } = route.params;

  const duration = 500;

  let playbackInstance: Video | null = null;
  let controlsTimer: NodeJS.Timeout | null = null;
  let initialShow = true;

  const [errorMessage, setErrorMessage] = useState("");
  const [resize, setResize] = useState(ResizeMode.CONTAIN);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [controlsState, setControlsState] = useState(ControlStates.Visible);
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: PlaybackStates.Loading,
  });

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

  useEffect(() => {
    setAudio();

    return () => {
      if (playbackInstance) {
        playbackInstance.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, []);

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
        if (
          playbackInstanceInfo.state === PlaybackStates.Playing &&
          controlsState === ControlStates.Hidden
        ) {
          hideAnimation();
        }
        if (controlsTimer) {
          clearTimeout(controlsTimer);
        }
        controlsTimer = null;
      }, 2000);
    }
  };

  // Set audio mode to play even in silent mode (like the YouTube app)
  const setAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      // props.errorCallback({
      //   type: ErrorSeverity.NonFatal,
      //   message: 'Audio.setAudioModeAsync',
      //   obj: e,
      // });
    }
  };

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    // props.playbackCallback(status);

    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? PlaybackStates.Ended
          : status.isBuffering
            ? PlaybackStates.Buffering
            : status.shouldPlay
              ? PlaybackStates.Playing
              : PlaybackStates.Paused,
      });
      if (
        (status.didJustFinish && controlsState === ControlStates.Hidden) ||
        (status.isBuffering &&
          controlsState === ControlStates.Hidden &&
          initialShow)
      ) {
        animationToggle();
        initialShow = false;
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setErrorMessage(errorMsg);
        // props.errorCallback({
        //   type: ErrorSeverity.Fatal,
        //   message: errorMsg,
        //   obj: {},
        // });
      }
    }
  };

  const togglePlay = async () => {
    if (controlsState === ControlStates.Hidden) {
      return;
    }
    const shouldPlay = playbackInstanceInfo.state !== PlaybackStates.Playing;
    if (playbackInstance !== null) {
      await playbackInstance.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === PlaybackStates.Ended && {
          positionMillis: 0,
        }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state:
          playbackInstanceInfo.state === PlaybackStates.Playing
            ? PlaybackStates.Paused
            : PlaybackStates.Playing,
      });
      if (shouldPlay) {
        animationToggle();
      }
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
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.black,
        maxWidth: "100%",
      }}
    >
      <Video
        style={styles.videoWrapper}
        source={{ uri: localFile }}
        ref={(component) => {
          playbackInstance = component;
          // if (props.videoProps.ref) {
          //   props.videoProps.ref.current = component as Video;
          // }
        }}
        resizeMode={resize}
        onLoad={() => {
          if (playbackInstance) {
            playbackInstance.playAsync();
          }
        }}
        onPlaybackStatusUpdate={updatePlaybackCallback}
      />

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
              <TouchableButton onPress={togglePlay}>
                <View>
                  {playbackInstanceInfo.state === PlaybackStates.Playing && (
                    <MaterialIcons
                      name="pause"
                      // style={props.icon.style}
                      // size={props.icon.size! / 2}
                      // color={props.icon.color}
                      style={{ padding: 2 }}
                      size={40}
                      color={Colors.white}
                    />
                  )}
                  {playbackInstanceInfo.state === PlaybackStates.Paused && (
                    <MaterialIcons
                      name="play-arrow"
                      // style={props.icon.style}
                      // size={props.icon.size! / 2}
                      // color={props.icon.color}
                      style={{ padding: 2 }}
                      size={40}
                      color={Colors.white}
                    />
                  )}
                  {playbackInstanceInfo.state === PlaybackStates.Ended && (
                    <MaterialIcons
                      name="replay"
                      // style={props.icon.style}
                      // size={props.icon.size! / 2}
                      // color={props.icon.color}
                      style={{ padding: 2 }}
                      size={40}
                      color={Colors.white}
                    />
                  )}
                  {/* {playbackInstanceInfo.state === PlaybackStates.Ended &&
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
                  )} */}
                </View>
              </TouchableButton>
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
            if (resize === ResizeMode.COVER) {
              setResize(ResizeMode.CONTAIN);
            } else {
              setResize(ResizeMode.COVER);
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

      <Animated.View
        style={[
          styles.bottomInfoWrapper,
          {
            opacity: controlsOpacity,
          },
        ]}
      >
        <Text style={styles.timeLeft}>
          {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)}
        </Text>
        <Slider
          // {...sliderProps}
          style={styles.slider}
          value={
            playbackInstanceInfo.duration
              ? playbackInstanceInfo.position / playbackInstanceInfo.duration
              : 0
          }
          onSlidingStart={() => {
            if (playbackInstanceInfo.state === PlaybackStates.Playing) {
              togglePlay();
              setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                state: PlaybackStates.Paused,
              });
            }
          }}
          onSlidingComplete={async (e) => {
            const position = e * playbackInstanceInfo.duration;
            if (playbackInstance) {
              await playbackInstance.setStatusAsync({
                positionMillis: position,
                shouldPlay: true,
              });
            }
            setPlaybackInstanceInfo({
              ...playbackInstanceInfo,
              position,
            });
          }}
        />
        <Text style={styles.timeRight}>
          {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
        </Text>
        {/* <TouchableButton
          onPress={() =>
            props.fullscreen.inFullscreen
              ? props.fullscreen.exitFullscreen!()
              : props.fullscreen.enterFullscreen!()
          }
        >
          <View>
            {props.icon.fullscreen}
            {props.icon.exitFullscreen}
            {((!props.icon.fullscreen && props.fullscreen.inFullscreen) ||
              (!props.icon.exitFullscreen &&
                !props.fullscreen.inFullscreen)) && (
              <MaterialIcons
                name={
                  props.fullscreen.inFullscreen
                    ? 'fullscreen-exit'
                    : 'fullscreen'
                }
                style={props.icon.style}
                size={props.icon.size! / 2}
                color={props.icon.color}
              />
            )}
          </View>
        </TouchableButton> */}
      </Animated.View>
    </View>
  );
}
