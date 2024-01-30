import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { format, parse } from 'date-fns';
import Mailer from 'react-native-mail';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import { ApplicationStyles, Colors, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';
import EditDetailsDialog from '../components/EditDetailsDialog';
import { useGetMockupByIDQuery } from '../services/wpApi';

type ImageDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ImageDetailsScreen'
>;

type Props = {
  navigation: ImageDetailsScreenNavigationProp;
  route: any;
};

export default function ImageDetailsScreen({ route, navigation }: Props) {
  const { imageSource } = route.params;
  StatusBar.setBarStyle('light-content', true);

  const [editDetailsVisible, setEditDetailsVisible] = useState(false);

  const { data, error, isLoading, isFetching, refetch } = useGetMockupByIDQuery(
    {
      id: imageSource?.id,
    }
  );

  const aspectRatio = (width: any, height: any) => {
    if (width && height) {
      return width / height;
    }
    return 1;
  };

  const callback = (downloadProgress: {
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
  }) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    console.log({
      downloadProgress: progress,
    });
  };

  const handleEmail = async (name: string, url: any, message: string) => {
    console.log('sending email');
    try {
      const filename = url.split('/').pop();
      console.log('fileName: ', filename);

      const uri = await FileSystem.downloadAsync(
        url,
        `${FileSystem.cacheDirectory}${filename}`
      );

      MailComposer.composeAsync({
        recipients: [], // array of email addresses
        subject: name,
        body: message,
        attachments: [uri.uri],
      });
    } catch (err) {
      console.log('error', err);
    }
  };

  if (isLoading || isFetching) {
    return (
      <View
        style={{
          ...ApplicationStyles.mainContainer,
          backgroundColor: Colors.swireLightGray,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: Colors.swireSuperDarkGray,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        ...ApplicationStyles.mainContainer,
        backgroundColor: Colors.swireLightGray,
      }}
    >
      {data && (
        <ScrollView>
          <View style={styles.container}>
            <View
              style={[
                {
                  width: '75%',
                  // height: '100%',
                  backgroundColor: 'white',
                  marginVertical: 20,
                  borderRadius: 5,
                },
                styles.shadow,
              ]}
            >
              <Image
                source={{
                  uri: data?.image?.formats?.medium?.url,
                }}
                style={{
                  width: '100%',
                  //   height: '100%',
                  backgroundColor: 'red',
                  aspectRatio: aspectRatio(
                    data?.image?.formats?.thumbnail?.width,
                    data?.image?.formats?.thumbnail?.height
                  ),
                  //   borderRadius: 10,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
                // resizeMode="contain"
              />
              <View style={styles.detailsContainer}>
                <View style={{ justifyContent: 'center', width: '25%' }}>
                  <Text
                    style={{
                      color: Colors.swireRed,
                      fontSize: 25,
                      padding: 10,
                      fontFamily: Fonts.type.base,
                    }}
                  >
                    {data.name.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      color: Colors.swireDarkGray,
                      fontSize: 15,
                      paddingLeft: 10,
                      fontFamily: Fonts.type.base,
                    }}
                  >
                    {format(
                      new Date(data?.created_at),
                      'MMMM dd, yyyy'
                    ).toUpperCase()}
                  </Text>
                </View>
                <View style={{ margin: 10, alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[
                        { backgroundColor: Colors.swireDarkGray, margin: 5 },
                        { ...styles.shadow, borderRadius: 1.0 },
                      ]}
                      onPress={() => {
                        navigation.navigate('ImageGalleryScreen');
                      }}
                    >
                      <Text style={styles.btnText}>BACK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        { backgroundColor: Colors.swireDarkGray, margin: 5 },
                        { ...styles.shadow, borderRadius: 1.0 },
                      ]}
                      onPress={() => {
                        setEditDetailsVisible(true);
                      }}
                    >
                      <Text style={styles.btnText}>EDIT DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[
                        { backgroundColor: Colors.swireDarkGray, margin: 5 },
                        { ...styles.shadow, borderRadius: 1.0 },
                      ]}
                      onPress={() => {
                        navigation.navigate('SalesMockupScreen', {
                          clear: new Date().valueOf(),
                          mockup: data,
                        });
                      }}
                    >
                      <Text style={styles.btnText}>CHANGE BACKGROUND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        { backgroundColor: Colors.swireRed, margin: 5 },
                        { ...styles.shadow, borderRadius: 1.0 },
                      ]}
                      onPress={() => {
                        handleEmail(
                          data.name,
                          data?.image?.formats?.medium?.url,
                          data.name
                        );
                      }}
                    >
                      <Text style={styles.btnText}>EMAIL PHOTO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      {editDetailsVisible && (
        <EditDetailsDialog
          onClose={() => {
            // refetch();
            setEditDetailsVisible(false);
          }}
          imageSource={data}
          onCancel={() => {
            setEditDetailsVisible(false);
          }}
        />
      )}
      {error && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>{error?.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.swireLightGray,
  },
  detailsContainer: {
    flexDirection: 'row',
    // backgroundColor: Colors.white,
    justifyContent: 'space-between',
    padding: 10,
  },
  btnText: {
    fontFamily: Fonts.type.base,
    fontSize: 18,
    color: Colors.white,
    padding: 10,
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

    borderRadius: 5.0,
    // backgroundColor: 'white',
  },
});
