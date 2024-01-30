import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import { Fonts } from '../theme';
import { isEmailRule } from '../utils/isEmailRule';
import TextInputController from './TextInputController';

export default function DialogPopUp({
  title,
  visibility,
  setVisibility,
  dialogWidth,
  dialogHeight,
  children,
}: any) {
  return (
    <View style={styles.container}>
      <Dialog
        visible={visibility}
        title={title}
        animationType="fade"
        contentStyle={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
        dialogStyle={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          // paddingBottom: 20,
          paddingTop: 20,
          borderRadius: 5,
          width: dialogWidth || '100%',
          height: dialogHeight,
        }}
        titleStyle={{
          fontWeight: 'bold',
          fontSize: 25,
          alignSelf: 'flex-start',
          fontFamily: Fonts.type.base,
        }}
        onTouchOutside={() => setVisibility(false)}
      >
        {children}

        <TouchableOpacity
          style={{ position: 'absolute', top: -30, right: 10 }}
          onPress={() => {
            setVisibility(false);
          }}
        />
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    padding: 10,
  },
});
