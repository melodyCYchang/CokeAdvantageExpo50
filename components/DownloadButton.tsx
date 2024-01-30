/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import email from 'react-native-email';
import { Colors } from '../theme';
import { sendEmail } from '../utils/sendEmail';
import * as FileSystem from 'expo-file-system';

export default function DownloadButton({
  isLoading,
  downloaded,
}: {
  isLoading: boolean;
  downloaded: boolean;
}) {
  return (
    <View style={styles.container}>
      <View
      // onPress={() => {
      //   Alert.alert('download image');
      // }}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="small" />
          </View>
        ) : downloaded ? (
          <MaterialIcons name="check-circle" size={24} color="green" />
        ) : (
          <MaterialIcons name="file-download" size={24} color="black" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
});
