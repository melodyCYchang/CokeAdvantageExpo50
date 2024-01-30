import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';
import EmailButton from './EmailButton';

export default function DashboardLibraryTile({
  folder,
  onPress,
  width,
  onLongPress,
}: any) {
  // console.log(
  //   '🚀 ~ file: DashboardLibraryTile.tsx ~ line 17 ~ DashboardLibraryTile ~ folder.startDAte',
  //   folder?.startDate
  // );
  const icon = folder?.icon?.url;
  // if (icon)
  // console.log(
  //   '🚀 ~ file: DashboardLibraryTile.tsx ~ line 18 ~ DashboardLibraryTile ~ icon',
  //   icon
  // );
  // console.log('folder: ', folder.name);
  const height = (Dimensions.get('window').width * parseFloat(width)) / 100;

  return (
    <View
      style={{
        padding: 10,
        // flexGrow: 1,
        width: height,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TouchableOpacity
        style={[
          styles.folderTile,
          styles.shadow,
          {
            backgroundColor: icon ? Colors.white : Colors.swireRed,
          },
        ]}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        {icon ? (
          <Image
            source={{
              uri: icon,
            }}
            resizeMode="contain"
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <MaterialIcons name="folder" size={50} color="white" />
        )}
        <View style={styles.tileText}>
          <Text
            style={{
              ...Fonts.style.tileText,
              color: icon ? Colors.swireRed : Colors.white,
            }}
          >
            {folder?.name?.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ width: 0, position: 'absolute', left: 10, top: 10 }}>
        {/* <EmailButton subject={name} message="link" /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderTile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  tileText: {
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 10,
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
