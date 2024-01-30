import { StyleSheet } from 'react-native';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
    height: '100%',
    width: '100%',
  },
});

export default ApplicationStyles;
