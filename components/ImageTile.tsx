import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { format, parse } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Colors, Fonts } from '../theme';
import DeleteButton from './DeleteButton';
import { useDeleteMockupMutation } from '../services/wpApi';
import { DeleteMockupPayload } from '../types/DeleteMockupPayload';
import validateApiResponse from '../utils/validateApiResponse';

export default function ImageTile({ imageArr, navigation, width }: any) {
  // console.log(errors);

  const aspectRatio = (width: any, height: any) => {
    if (width && height) {
      return width / height;
    }
    return 1;
  };
  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {imageArr.map((img: any) => (
          <View
            key={`image_tile_${img.id}`}
            style={{
              padding: 10,
              // flexGrow: 1,
              width,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={[styles.tile, styles.shadow]}
              onPress={() => {
                navigation.navigate('ImageDetailsScreen', {
                  imageSource: img,
                });
              }}
            >
              <Image
                source={
                  // img.img
                  {
                    uri: img?.image?.formats?.thumbnail?.url,
                  }
                }
                style={{
                  width: '100%',
                  //   height: '100%',
                  backgroundColor: Colors.white,
                  // width: 230,
                  // height: img.image.formats.thumbnail.url[2],
                  aspectRatio: aspectRatio(
                    img?.image?.formats?.thumbnail?.width,
                    img?.image?.formats?.thumbnail?.height
                  ),
                }}
                // resizeMode="contain"
              />
              <View style={styles.tileText}>
                <Text
                  style={{
                    color: Colors.swireRed,
                    fontSize: 18,
                    fontFamily: Fonts.type.base,
                  }}
                >
                  {img.name.toUpperCase()}
                </Text>
                <Text
                  style={{
                    color: Colors.swireDarkGray,
                    fontSize: 13,
                    marginTop: 5,
                    fontFamily: Fonts.type.base,
                  }}
                >
                  {format(
                    new Date(img?.created_at),
                    'MMMM dd, yyyy'
                  ).toUpperCase()}
                </Text>
              </View>
              <View
                style={{ width: 0, position: 'absolute', right: 38, top: 3 }}
              >
                <DeleteButton imgId={img?.id} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'flex-start',
    // justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    margin: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    alignItems: 'center',
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
    backgroundColor: 'white',
  },
});
