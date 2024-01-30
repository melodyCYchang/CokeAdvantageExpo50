import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { t } from 'i18n-js';
import { ApplicationStyles, Fonts } from '../theme';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { resetUser } from '../redux/user';
import { callNumber } from '../components/PhoneCall';

type ReportsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HelpScreen'
>;

type Props = {
  navigation: ReportsScreenNavigationProp;
};

export default function HelpScreen({ navigation }: Props) {
  StatusBar.setBarStyle('light-content', true);
  const dispatch = useDispatch();
  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={Fonts.style.title}>Please contact support</Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                callNumber('(801)816-5333');
              }}
            >
              <FontAwesome5 name="phone" size={24} color="white" />
              <Text style={styles.buttonText}>(801)816-5333</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              fontFamily: Fonts.type.base,
              fontWeight: Fonts.weight.bold,
            }}
          >
            {t('support.or')}
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() =>
                Linking.openURL(
                  'mailto: operationalexcellencetechnology@swirecc.com'
                )
              }
            >
              <Ionicons name="md-paper-plane" size={24} color="white" />
              <Text style={styles.buttonText}>
                {' '}
                operationalexcellencetechnology@swirecc.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
    padding: 50,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginLeft: 7,
    fontFamily: Fonts.type.base,
  },
  linkButton: {
    width: '95%',
    // height: 38,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontFamily: Fonts.type.base,
  },
});
