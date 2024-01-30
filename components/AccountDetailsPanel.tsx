import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme';
import VersionText from './VersionText';

export default function AccountDetailsPanel({
  setVisibility,
  visibility,
  logout,
}: any) {
  if (visibility) {
    return (
      <View style={styles.rootContainer}>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => {
            setVisibility(false);
          }}
        />
        <View style={styles.container}>
          <TouchableOpacity style={styles.folderTile} onPress={logout}>
            <MaterialCommunityIcons name="presentation" size={30} color="red" />
            <View style={styles.tileText}>
              <Text
                style={{
                  color: Colors.swireRed,
                  fontSize: 18,
                  textAlign: 'center',
                }}
              >
                SIGN OUT
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={{ marginBottom: 10 }}>
            <VersionText color={Colors.swireRed} />
          </View>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  closeContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: 300,
    height: '100%',
    backgroundColor: Colors.swireLightGray,
  },
  folderTile: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 125,
    flexDirection: 'row',
    padding: 20,
  },
  tileText: {
    alignItems: 'center',
    margin: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,

    borderRadius: 1.0,
    // backgroundColor: "white",
  },
});
