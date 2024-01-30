import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApplicationStyles } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';

type ReportsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReportsScreen'
>;

type Props = {
  navigation: ReportsScreenNavigationProp;
};

export default function ReportsScreen({ navigation }: Props) {
  StatusBar.setBarStyle('light-content', true);
  const dispatch = useDispatch();
  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <Text>Reports</Text>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="Back"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
