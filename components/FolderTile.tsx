import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

export default function FolderTile({ folder, onPress }: any) {
  return (
    <TouchableOpacity
      key={`folder_tile_${folder.termID}`}
      style={[styles.tile, styles.shadow]}
      onPress={onPress}
    >
      <MaterialIcons name="folder" size={24} color={Colors.swireDarkGray} />
      <View style={styles.tileText}>
        <Text style={{ ...Fonts.style.tileText, color: Colors.swireDarkGray }}>
          {folder.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'flex-start',
    // justifyContent: "space-between",
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  tileText: {
    alignItems: 'center',
    margin: 10,
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
    backgroundColor: 'white',
  },
});
