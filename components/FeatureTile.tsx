import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { format } from 'date-fns';
import Svg, { Path } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import { Colors, Fonts } from '../theme';

export default function FeatureTile({
  name,
  icon,
  onPress,
  width,
  onLongPress,
}: any) {
  const height = (Dimensions.get('window').width * parseFloat(width)) / 100;

  return (
    <View
      style={{
        padding: 10,
        width: height,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {name === 'Reports' ||
      name === 'Maximizing Profitability' ||
      name === 'Freestyle profitability' ? (
        <View
          style={[
            styles.featureTile,
            { ...styles.shadow, backgroundColor: 'rgba(0, 0, 0, 0.15)' },
          ]}
        >
          <Image
            source={icon}
            style={{ width: 50, height: 50, marginTop: 10 }}
            resizeMode="contain"
          />
          <View style={styles.tileText}>
            <Text
              style={{ ...Fonts.style.tileText, color: Colors.swireDarkGray }}
            >
              {name.toUpperCase()}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.featureTile, styles.shadow]}
          onPress={onPress}
          onLongPress={onLongPress}
        >
          <Image
            source={icon}
            style={{ width: 50, height: 50, marginTop: 10 }}
            resizeMode="contain"
          />
          <View style={styles.tileText}>
            <Text style={Fonts.style.tileText}>{name.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity
        style={[styles.featureTile, styles.shadow]}
        onPress={onPress}
      >
        <Image
          source={icon}
          style={{ width: 50, height: 50, marginTop: 10 }}
          resizeMode="contain"
        />
        <View style={styles.tileText}>
          <Text style={Fonts.style.tileText}>{name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  tileText: {
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 15,
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
