/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, StatusBar, Animated } from 'react-native';
import { useDispatch } from 'react-redux';

import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerStateChangeEvent,
  RotationGestureHandler,
  RotationGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';

import { FontAwesome5 } from '@expo/vector-icons';
import { ApplicationStyles } from '../theme';
import { USE_NATIVE_DRIVER } from '../config';

export default function MoveableZoomIcon({ setZoom }: { setZoom: any }) {
  // Inital Values?
  const xval = 0;
  const yval = 0;

  const panRef = useRef<PanGestureHandler>();
  const rotationRef = useRef<RotationGestureHandler>();
  const pinchRef = useRef<PinchGestureHandler>();

  /* Dragging */
  const _translateX = useRef(new Animated.Value(xval)).current;
  const _translateY = useRef(new Animated.Value(yval)).current;
  const _lastOffset = { x: 0, y: 0 };
  const _onPanGestureEvent = useCallback(
    Animated.event(
      [
        {
          nativeEvent: {
            // translationX: _translateX,
            translationY: _translateY,
          },
        },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    ),
    []
  );

  /* Rotation */
  const _rotate = useRef(new Animated.Value(0)).current;
  const _rotateStr = _rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ['-100rad', '100rad'],
  });
  let _lastRotate = 0;
  const _onRotateGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { rotation: _rotate } }], {
      useNativeDriver: USE_NATIVE_DRIVER,
    }),
    []
  );

  /* Pinching */
  const _baseScale = useRef(new Animated.Value(1)).current;
  const _pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(_baseScale, _pinchScale);
  const _lastScale = 1;
  const _onPinchGestureEvent = useCallback(
    Animated.event([{ nativeEvent: { scale: _pinchScale } }], {
      useNativeDriver: USE_NATIVE_DRIVER,
    }),
    []
  );

  const _onRotateHandlerStateChange = (
    event: RotationGestureHandlerStateChangeEvent
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastRotate += event.nativeEvent.rotation;
      _rotate.setOffset(_lastRotate);
      _rotate.setValue(0);
    }
  };

  //   const _onPinchHandlerStateChange = (
  //     event: PinchGestureHandlerStateChangeEvent
  //   ) => {
  //     if (event.nativeEvent.oldState === State.ACTIVE) {
  //       // _lastRotate += event.nativeEvent.rotation;
  //       // _rotate.setOffset(_lastRotate);
  //       // _rotate.setValue(0);

  //       _lastScale *= event.nativeEvent.scale;
  //       _baseScale.setValue(_lastScale);
  //       _pinchScale.setValue(1);
  //     }
  //   };

  const _onPanStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const new_offset = _lastOffset.y + event.nativeEvent.translationY;

      console.log('org offset: ', _lastOffset.y);
      console.log('new_offset: ', new_offset);

      if (_lastOffset.y <= 0 && _lastOffset.y >= -200) {
        if (_lastOffset.y + event.nativeEvent.translationY > 0) {
          // set y to 0
          _lastOffset.y = 0;
        } else if (_lastOffset.y + event.nativeEvent.translationY < -200) {
          // set y to -200
          _lastOffset.y = -200;
        } else {
          _lastOffset.y += event.nativeEvent.translationY;
        }
        // console.log('offset xy', _translateX, _lastOffset.y);

        //   _lastOffset.x += event.nativeEvent.translationX;
        //   _translateX.setOffset(_lastOffset.x);
        //   _translateX.setValue(0);
        _translateY.setOffset(_lastOffset.y);
        _translateY.setValue(0);
        setZoom(calculateZoom(_lastOffset.y));
      }

      //   console.log('xy', _translateX, _translateY);
    }
  };

  const translateX = _translateX;
  const translateY = _translateY;
  const panStyle = {
    transform: [{ translateX }, { translateY }],
  };

  const calculateZoom = (y: any) => {
    const zoomVal = (y * -1) / 200;
    console.log('zoomVal : ', zoomVal);

    return zoomVal;
  };

  //   calculateZoom(translateY);

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={_onPanGestureEvent}
      onHandlerStateChange={_onPanStateChange}
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
              //   onHandlerStateChange={_onPinchHandlerStateChange}
            >
              <Animated.View style={styles.container} collapsable={false} />
            </PinchGestureHandler>
          </Animated.View>
        </RotationGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: 25,
    height: 25,
    borderRadius: 20,
    borderColor: '#ccaf6a',
    borderWidth: 2,
  },
  pinchableImage: {
    width: 10,
    height: 10,
  },

  buttonContainer: {
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    fontSize: 16,
  },
});
