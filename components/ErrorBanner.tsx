import React from 'react';
import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';

export default function ErrorBanner({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  if (!text) return null;
  return (
    <View style={styles.container}>
      <Text>Error: {text}</Text>
      <Text>
        For general questions or troubleshooting support: Contact the Swire Help
        Desk at 801-816-5333 or open a ticket a servicedesk@swirecc.com
      </Text>
      <Button onPress={onClose} title="Close" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    padding: 10,
  },
});
