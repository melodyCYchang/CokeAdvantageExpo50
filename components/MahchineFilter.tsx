import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useGetMachineTypesQuery } from '../services/wpApi';
import DialogPopUp from './DialogPopUp';
import { Colors, Fonts } from '../theme';

export default function MachineFilter({
  visibility,
  setVisibility,
  selectedValue,
  onClose,
  onChange,
}: any) {
  const [tmpValue, setTmpValue] = useState(selectedValue || 'All');

  // const { data, isFetching, isLoading } = useGetMachineTypesQuery();
  // console.log('machine types: ', data[0]);
  const types = [
    'All',
    'coolers',
    'fountain units',
    'freestyle',
    'racks',
    'table top units',
    'tumblers',
    'vending machine',
  ];

  // if (data) {
  //   const dataArray = data[0];
  //   dataArray?.forEach((type: any) => {
  //     types.push({ name: type.name, slug: type.slug });
  //   });
  // }

  // console.log('machine types: ', types);

  //  setItems(data);

  return (
    <DialogPopUp
      title=""
      visibility={visibility}
      setVisibility={setVisibility}
      dialogWidth={300}
      dialogHeight={400}
    >
      <View>
        <ScrollView>
          {types?.map((machineType) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 10,
                }}
                onPress={() => {
                  setTmpValue(machineType);
                }}
              >
                {tmpValue === machineType ? (
                  <MaterialIcons
                    name="radio-button-on"
                    size={25}
                    color={Colors.swireRed}
                  />
                ) : (
                  <MaterialIcons
                    name="radio-button-off"
                    size={25}
                    color="black"
                  />
                )}
                <Text
                  style={{
                    ...Fonts.style.boldText,
                    paddingLeft: 15,
                    // color: 'black',
                    // fontWeight: 'bold',
                  }}
                >
                  {' '}
                  {machineType.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity
            style={{ marginHorizontal: 10, padding: 10 }}
            onPress={() => {
              setVisibility(false);
            }}
          >
            <Text
              style={{
                ...Fonts.style.btnText,
                color: Colors.swireRed,
              }}
            >
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ margin: 10, padding: 10 }}
            onPress={() => {
              onChange(tmpValue);
              setVisibility(false);
            }}
          >
            <Text
              style={{
                ...Fonts.style.btnText,
                color: Colors.swireRed,
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </DialogPopUp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
