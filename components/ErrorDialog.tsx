import React from 'react';
import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';
import DialogPopUp from './DialogPopUp';

export default function ErrorDialog({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  if (!text) return null;

  return (
    <DialogPopUp title="Error" visibility setVisibility={onClose}>
      <Text>Error: {text}</Text>
      <Button onPress={onClose} title="Close" />
    </DialogPopUp>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    padding: 10,
  },
});
