import React, { useEffect, useRef, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Camera } from 'expo-camera';

import {
  SimpleLineIcons,
  Ionicons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ApplicationStyles, Colors } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';
import MoveableZoomIcon from './MoveableZoomIcon';

interface PhotoData {
  width: number;
  height: number;
  uri: string;
}

export default function TakePhoto({
  onSave,
  onCancel,
}: {
  onSave: (photo: any) => void;
  onCancel: () => void;
}) {
  const cameraRef = useRef(null);

  const [photo, setPhoto] = useState<PhotoData | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [sliderStyle, setSliderStyle] = useState({});
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0); // 0 to 1
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setSliderStyle({ transform: [{ rotate: '-90deg' }] });
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (
      cameraRef
      // && cameraReady
    ) {
      // @ts-ignore
      const data = await cameraRef.current.takePictureAsync();
      console.log('saving photo preview', data);
      setPhoto(data);
    }
  };

  // Permission has not been determined
  if (hasPermission === null) {
    return <View style={ApplicationStyles.mainContainer} />;
  }

  // Permission was denied
  if (hasPermission === false) {
    return (
      <View style={ApplicationStyles.mainContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  // We have taken a photo, confirm
  if (photo) {
    return (
      <View style={ApplicationStyles.mainContainer}>
        <Image
          source={{ uri: photo.uri }}
          style={ApplicationStyles.mainContainer}
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.swireSuperDarkGray,
          }}
        >
          <View style={{ margin: 20 }}>
            <TouchableOpacity onPress={() => setPhoto(null)}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ margin: 20 }}>
            <TouchableOpacity
              onPress={() => {
                // Pass the photo info back to the parent component
                onSave(photo);
              }}
            >
              <Text style={styles.text}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Default, display camera
  return (
    <Camera
      ref={cameraRef}
      style={styles.camera}
      type={type}
      zoom={zoom}
      flashMode={flashMode}
      onCameraReady={() => setCameraReady(true)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: 20,
          height: '100%',
        }}
      >
        <Feather name="plus" size={24} color="white" />
        <View
          style={{
            height: 225,
            width: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 15,
          }}
        >
          <View
            style={{
              width: 10,
              height: 225,
              // borderWidth: 1,
              // borderColor: Colors.white,
              // borderRadius: 10,
            }}
          />
          <View style={{ position: 'absolute', bottom: 100 }}>
            <Slider
              style={[
                {
                  width: 220,
                  height: 10,
                  borderWidth: 1,
                  borderColor: Colors.white,
                  borderRadius: 5,
                  transform: [{ rotate: '-90deg' }],
                },
                sliderStyle,
              ]}
              // vertical={true}
              minimumValue={0}
              maximumValue={1}
              value={0}
              thumbTintColor={Colors.white}
              onValueChange={(value) => {
                setZoom(value);
              }}
              minimumTrackTintColor={Colors.transparent}
              maximumTrackTintColor={Colors.transparent}
            />
            {/* <MoveableZoomIcon setZoom={setZoom} /> */}
          </View>
        </View>
        <Feather name="minus" size={24} color="white" />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
          height: '100%',
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
            style={{ transform: [{ rotate: '90deg' }] }}
          >
            <SimpleLineIcons name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleTakePhoto}>
            <Ionicons name="radio-button-on" size={70} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={{ ...styles.text, color: '#ccaf6a', fontSize: 15 }}>
            {' '}
            PHOTO{' '}
          </Text>
        </View>
        <View style={{ position: 'absolute', bottom: 0, margin: 20 }}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.text}> Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    // borderWidth: 1,
    margin: 10,
    padding: 10,
    marginVertical: 50,
    // borderColor: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
