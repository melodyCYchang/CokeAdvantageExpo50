import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

export default function Button({
  onPress,
  disabled,
  text,
  textColor,
  bgColor,
}: {
  onPress?: () => void;
  disabled?: boolean;
  text: string;
  textColor?: string;
  bgColor?: string;
}) {
  return (
    <TouchableOpacity
      style={{ margin: 10, backgroundColor: bgColor, padding: 10 }}
      onPress={() => {
        if (!disabled && onPress) {
          onPress();
        }
      }}
    >
      <Text
        style={
          !disabled
            ? { ...Fonts.style.btnText, color: textColor }
            : { ...Fonts.style.btnText, color: Colors.swireDarkGray }
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  BtnText: {
    color: Colors.swireRed,
    fontSize: 18,
  },
  disabledBtnText: {
    color: Colors.swireDarkGray,
    fontSize: 18,
  },
});
