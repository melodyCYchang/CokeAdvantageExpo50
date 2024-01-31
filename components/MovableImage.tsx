/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerStateChangeEvent,
  RotationGestureHandler,
  RotationGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";

import { USE_NATIVE_DRIVER } from "../config";

export default function MovableImage({
  source,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  onRemoveImage,
}: {
  source: any;
  onPositionChange: (x: number, y: number) => void;
  onScaleChange: (scale: number) => void;
  onRotationChange: (rotation: number) => void;
  onRemoveImage: () => void;
}) {
  const [loading, setLoading] = useState(true);
  console.log("image source: ", source);

  // Inital Values?
  // const xval = 0;
  // const yval = 0;
  // console.log(
  //   '🚀 ~ file: MovableImage.tsx ~ line 38 ~ source.machine_left',
  //   source.machine_left
  // );
  console.log(
    "🚀 ~ file: MovableImage.tsx ~ line 44 ~ typeof source.machine_left",
    source,
  );

  const xval =
    typeof source.machine_left === "string"
      ? parseFloat(source.machine_left)
      : source.machine_left;
  const yval =
    typeof source.machine_top === "string"
      ? parseFloat(source.machine_top)
      : source.machine_top;

  console.log("xy init values: ", xval, yval);

  const panRef = useRef<PanGestureHandler>();
  const rotationRef = useRef<RotationGestureHandler>();
  const pinchRef = useRef<PinchGestureHandler>();

  const onLongPress = (event: LongPressGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Alert.alert(
        "Remove",
        "Remove Image?",
        [
          {
            text: "Remove",
            onPress: () => {
              console.log("removed pressed");
              onRemoveImage();
            },
            style: "destructive",
          },
          {
            text: "Cancel",
            onPress: () => {
              console.log("cancel pressed");
            },
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    }
  };

  /* Dragging */
  const _translateX = useRef(new Animated.Value(xval)).current;
  const _translateY = useRef(new Animated.Value(yval)).current;
  const _lastOffset = { x: 0, y: 0 };
  const _onPanGestureEvent = useCallback(
    Animated.event(
      [
        {
          nativeEvent: {
            translationX: _translateX,
            translationY: _translateY,
          },
        },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER },
    ),
    [],
  );

  /* Rotation */
  const _rotate = useRef(
    new Animated.Value(Number(source.machine_rotation)),
  ).current;
  const _rotateStr = _rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
  });
  let _lastRotate = 0;
  const _onRotateGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { rotation: _rotate } }], {
      useNativeDriver: USE_NATIVE_DRIVER,
    }),
    [],
  );

  /* Pinching */
  const _baseScale = useRef(
    new Animated.Value(Number(source.machine_scale)),
  ).current;
  const _pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(_baseScale, _pinchScale);
  let _lastScale = 1;
  const _onPinchGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { scale: _pinchScale } }], {
      useNativeDriver: USE_NATIVE_DRIVER,
    }),
    [],
  );

  const _onRotateHandlerStateChange = (
    event: RotationGestureHandlerStateChangeEvent,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastRotate += event.nativeEvent.rotation;
      _rotate.setOffset(_lastRotate);
      _rotate.setValue(0);
      onRotationChange(_lastRotate);
      console.log("xy _onRotateHandlerStateChange: ", _rotate);
    }
  };

  const _onPinchHandlerStateChange = (
    event: PinchGestureHandlerStateChangeEvent,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // _lastRotate += event.nativeEvent.rotation;
      // _rotate.setOffset(_lastRotate);
      // _rotate.setValue(0);

      _lastScale *= event.nativeEvent.scale;
      _baseScale.setValue(_lastScale);
      _pinchScale.setValue(1);
      onScaleChange(_lastScale);
      console.log("xy _onPinchHandlerStateChange: ", _baseScale);
    }
  };

  const _onPanStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastOffset.x += event.nativeEvent.translationX;
      _lastOffset.y += event.nativeEvent.translationY;
      _translateX.setOffset(_lastOffset.x);
      _translateX.setValue(0);
      _translateY.setOffset(_lastOffset.y);
      _translateY.setValue(0);

      onPositionChange(_lastOffset.x, _lastOffset.y);
      console.log("xy _onPanStateChange: ", _translateX, _translateY);
    }
  };
  // useEffect(() => {
  //   onPositionChange(0, -400);
  // }, []);

  const translateX = _translateX;
  const translateY = _translateY;
  const panStyle = {
    transform: [{ translateX }, { translateY }],
  };

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={_onPanGestureEvent}
      onHandlerStateChange={_onPanStateChange}
      minDist={0}
    >
      <Animated.View>
        <RotationGestureHandler
          ref={rotationRef}
          onGestureEvent={_onRotateGestureEvent}
          onHandlerStateChange={_onRotateHandlerStateChange}
        >
          <Animated.View style={[panStyle]} collapsable={false}>
            <PinchGestureHandler
              ref={pinchRef}
              simultaneousHandlers={[panRef, rotationRef]}
              onGestureEvent={_onPinchGestureEvent}
              onHandlerStateChange={_onPinchHandlerStateChange}
            >
              <Animated.View style={styles.container} collapsable={false}>
                <LongPressGestureHandler
                  onHandlerStateChange={onLongPress}
                  minDurationMs={800}
                >
                  <Animated.View
                    style={[
                      styles.pinchableImage,
                      {
                        transform: [
                          { perspective: 200 },
                          { scale },

                          { rotate: _rotateStr },
                        ],
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Image
                      style={styles.pinchableImage}
                      source={{ uri: source.machine_uri }}
                      onLoad={() => setLoading(false)}
                      resizeMode="contain"
                    />

                    {loading && (
                      <View
                        style={{
                          padding: 20,
                          borderWidth: 2,
                          borderColor: "white",
                          borderRadius: 15,
                          backgroundColor: "rgba(255,255,255,0.8)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator size="large" />
                        <Text>Loading</Text>
                      </View>
                    )}
                  </Animated.View>
                </LongPressGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </RotationGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pinchableImage: {
    width: 300,
    height: 300,
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "white",
  },
  text: {
    fontSize: 16,
  },
});
