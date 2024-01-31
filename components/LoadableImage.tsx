/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function LoadableImage({ style, ...props }) {
  const [loading, setLoading] = useState(true);

  return (
    <View
      style={{
        ...style,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image style={style} {...props} onLoad={() => setLoading(false)} />
      {loading && <ActivityIndicator size="large" />}
    </View>
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
