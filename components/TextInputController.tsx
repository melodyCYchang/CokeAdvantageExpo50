import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18n-js';
import { Colors } from '../theme';

interface TextFieldControllerProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  password?: boolean;
  autoCapitalize?: any;
  required?: boolean;
  onBlur?: () => void;
  autoCompleteType?: any;
  autoFocus?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  startAdornment?: any;
  endAdornment?: any;
  disabled?: boolean;
  rows?: number;
  style?: any;
  error?: any;
  rules?: any;
  inputValue?: any;
  inputStyle?: any;
}

export default function TextInputController({
  label,
  name,
  control,
  error,
  placeholder,
  password,
  autoCapitalize,
  required,
  onBlur: manualOnBur,
  autoCompleteType,
  style,
  inputValue,
  inputStyle,
  autoFocus = false,
  multiline = false,
  fullWidth = true,
  disabled = false,
  startAdornment,
  endAdornment,
  rows = 4,
  rules = {},
  ...rest
}: TextFieldControllerProps) {
  if (required) rules.required = { value: true, message: 'error.required' };
  const errorText = error?.message && t(error.message);
  const [isError, setIsError] = useState(false);

  return (
    <View style={style || styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: {
            onChange,
            onBlur,
            value = inputValue,
            name: passedName,
            ref,
          },
          fieldState: { invalid, isTouched, isDirty, error },
          formState,
        }) => (
          <TextInput
            style={inputStyle || (errorText ? styles.errorInput : styles.input)}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!disabled}
            placeholder={placeholder?.toLocaleUpperCase()}
            placeholderTextColor="#dbd7d7"
            secureTextEntry={password}
            autoCapitalize={autoCapitalize}
            autoCompleteType={autoCompleteType}
            autoFocus={autoFocus}
          />
        )}
      />
      {errorText && <Text>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderColor: Colors.swireDarkGray,
    borderWidth: 3,
    fontSize: 20,
  },
  errorInput: {
    padding: 10,
    borderColor: Colors.swireRed,
    borderWidth: 3,
    fontSize: 20,
  },
});
