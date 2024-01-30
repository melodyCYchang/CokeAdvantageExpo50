import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme';
import getVersion from '../utils/getVersion';

export default function VersionText(
  { color }: { color?: string } = { color: Colors.swireDarkGray }
) {
  const handleCheckForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        // setUpdating(true);
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        await Updates.reloadAsync();
        // setUpdating(false);
      } else {
        Alert.alert('Application is up to date');
      }
    } catch (err) {
      Alert.alert(`error checking for update ${err.message}`);
    }
  };

  return (
    <TouchableOpacity onPress={handleCheckForUpdate}>
      <Text style={{ color, textAlign: 'center' }}>{getVersion()}</Text>
    </TouchableOpacity>
  );
}
