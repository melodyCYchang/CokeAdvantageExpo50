import React, { useEffect, useState } from 'react';
// import FormData from 'form-data';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import MiniButton from '../components/MiniButton';

import imgBg from '../assets/img/squiggle-gray.png';
import { getUser } from '../redux/user';
import uploadMockupAsync from '../thunk/uploadMockupAsync';
import DialogPopUp from '../components/DialogPopUp';
import {
  useDeleteMockupMutation,
  useGetMockupsByUserQuery,
  wpApi,
} from '../services/wpApi';

type SaveMockupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SaveMockupScreen'
>;

type Props = {
  navigation: SaveMockupScreenNavigationProp;
  route: any;
};

export default function SaveMockupScreen({ route, navigation }: Props) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const { imageUri, machines, mockup } = route.params;
  console.log(
    '🚀 ~ file: SaveMockupScreen.tsx ~ line 45 ~ SaveMockupScreen ~ mockup',
    mockup
  );
  // console.log(
  //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 43 ~ SaveMockupScreen ~ imageUri',
  //   imageUri
  // );
  const [companyName, setCompanyName] = useState(mockup ? mockup.name : '');
  console.log(
    '🚀 ~ file: SaveMockupScreen.tsx ~ line 54 ~ SaveMockupScreen ~ companyName',
    companyName
  );
  const [redirectPopup, setRedirectPopup] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mockup) {
      setCompanyName(mockup.name);
    } else {
      setCompanyName('');
    }
  }, [mockup, imageUri]);

  // const [
  //   uploadMockup, // This is the mutation trigger
  //   { isLoading: uploadBusy }, // This is the destructured mutation result
  // ] = useUploadMockupMutation();
  // const [
  //   createMockup, // This is the mutation trigger
  //   { isLoading: createBusy }, // This is the destructured mutation result
  // ] = useCreateMockupMutation();
  const [
    deleteMockup, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useDeleteMockupMutation();

  const handleSaveImage = async () => {
    if (companyName && imageUri) {
      try {
        setSaving(true);
        // Call Thunk
        const results = await dispatch(
          uploadMockupAsync(user, mockup?.id, imageUri, companyName, machines)
        );
        console.log(
          '🚀 ~ file: SaveMockupScreen.tsx ~ line 74 ~ handleSaveImage ~ results',
          results
        );

        // console.log(
        //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 73 ~ handleSaveImage ~ results',
        //   results
        // );

        // console.log(
        //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 74 ~ delete mockup ~ results',
        //   mockup
        // );

        // if (mockup) {
        //   // since we can't update the picture of a mockup we are creating a new one and deleting the old one

        //   const data: any = await deleteMockup({
        //     post_id: mockup.ID,
        //   });
        //   // TODO: make sure cache updated removing deleted item

        //   const createResults = await dispatch(
        //     wpApi.endpoints.getMockupsByUser.initiate({ ID: user?.id })
        //     // { track: true }
        //   );
        //   console.log(
        //     '🚀 ~ file: SaveMockupScreen.tsx ~ line 92 ~ handleSaveImage ~ createResults',
        //     createResults
        //   );
        // }
        if (results?.data?.id) {
          setSaving(false);
          setRedirectPopup(true);
        }

        // TODO: Add go to gallery screen popup

        // const { width, height } = await getImageDimentions(imageUri);
        // const resize: { width?: number; height?: number } =
        //   width > height ? { width: 1024 } : { height: 1024 };

        // const manipResult = await manipulateAsync(imageUri, [{ resize }], {
        //   compress: 1,
        //   format: SaveFormat.JPEG,
        // });
        // console.log(
        //   '🚀 ~ file: uploadMockupAsync.ts ~ line 21 ~ //Image.getSize ~ manipResult',
        //   manipResult
        // );

        // const uploadPayload = new FormData();

        // uploadPayload.append('user_id', user?.id);
        // uploadPayload.append('user_email', user.email);
        // uploadPayload.append('image_width', manipResult.width);
        // uploadPayload.append('image_height', manipResult.height);
        // uploadPayload.append('machine_positioning', '[]');
        // // const filename = imageUri.split('/').pop();
        // // uploadPayload.append('post', {
        // //   uri: manipResult.uri,
        // //   name: filename,
        // //   type: 'image/jpg',
        // // });

        // // Call Hook
        // const data: any = await uploadMockup(uploadPayload);

        // console.log('🚀 uploadPayload', uploadPayload);
        // // console.log(
        // //   '🚀 uploadPayload getHeaders',
        // //   uploadPayload.getHeaders()
        // // );
        // // const a = await fetch('https://swiretoolkit.com/api/mockups/upload/', {
        // //   // headers: {
        // //   //   'Content-Type': 'multipart/form-data',
        // //   //   Accept: 'application/json',
        // //   //   // Accept: '*/*',
        // //   // },
        // //   method: 'POST',
        // //   body: uploadPayload,
        // // });
        // // console.log('1AAAA', typeof imageUri);
        // // console.log('2AAAA', a);
        // // console.log('3AAAA');
        // // console.log('4AAAA');
        // // console.log('🚀 a', a);
        // // const b = await a.json();
        // // console.log('🚀 b', b);

        // const uploadResults: any = await uploadMockup(uploadPayload);

        // console.log(
        //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 76 ~ Image.getSize ~ uploadResults',
        //   uploadResults
        // );
        // this.setState({ width, height });
        // });
      } catch (err) {
        console.log(`upload error ${err.message}`);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
      behavior="padding"
    >
      <View
        style={{
          width: '50%',
          height: '100%',
          position: 'absolute',
          left: 0,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: '80%', height: '90%', marginRight: 20 }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{ width: '50%', height: '100%', position: 'absolute', right: 0 }}
      >
        <ImageBackground
          source={imgBg}
          style={{ height: '100%' }}
          resizeMode="stretch"
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.type.base,
                fontSize: 30,
                color: Colors.white,
                fontWeight: 'bold',
              }}
            >
              SAVE IMAGE
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: Colors.white,
                color: Colors.white,
                width: '60%',
                padding: 10,
                fontSize: 20,
                textAlign: 'center',
              }}
              onChangeText={setCompanyName}
              value={companyName}
              // editable={!disabled}
              placeholder="COMPANY NAME"
              placeholderTextColor="#dbd7d7"
              // secureTextEntry={password}
              // autoCapitalize={autoCapitalize}
              // autoCompleteType={autoCompleteType}
              autoFocus
            />
            <MiniButton
              onPress={() => {
                if (!saving) {
                  handleSaveImage();
                }
              }}
              disabled={!companyName}
              text="SAVE PHOTO"
              textColor={Colors.white}
              bgColor={Colors.swireRed}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                width: '60%',
              }}
              onPress={() => {
                if (!saving) {
                  navigation.navigate('SalesMockupScreen', {
                    clear: new Date().valueOf(),
                  });
                }
              }}
            >
              <Ionicons name="ios-caret-back-circle" size={55} color="white" />
              <Text
                style={{
                  fontFamily: Fonts.type.base,
                  fontSize: 20,
                  color: Colors.white,
                  paddingLeft: 20,
                  textAlign: 'center',
                }}
              >
                START OVER WITHOUT SAVING
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <DialogPopUp
        title="PHOTO SAVED"
        visibility={redirectPopup}
        setVisibility={setRedirectPopup}
        dialogWidth={350}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <MiniButton
            onPress={() => {
              setRedirectPopup(false);
              navigation.navigate('SalesMockupScreen', {
                clear: new Date().valueOf(),
              });
            }}
            text="NEW MOCKUP"
            textColor={Colors.swireRed}
            bgColor=""
          />
          <MiniButton
            onPress={() => {
              setRedirectPopup(false);
              navigation.navigate('ImageGalleryScreen');
            }}
            text="VIEW GALLERY"
            textColor={Colors.swireRed}
            bgColor=""
          />
        </View>
      </DialogPopUp>
      {saving && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <ActivityIndicator size="large" color={Colors.swireRed} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.swireSuperDarkGray,
  },
  popuInput: {
    padding: 10,
    borderColor: Colors.swireLightGray,
    borderBottomWidth: 2,
    fontSize: 20,
  },
});
