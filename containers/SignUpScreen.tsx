import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "~/redux/store";
import ErrorDialog from "../components/ErrorDialog";
import TextInputController from "../components/TextInputController";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { getCount } from "../redux/count";
import { useCreateAccountMutation } from "../services/wpApi";
import { ApplicationStyles, Colors } from "../theme";
import { CreateAccountPayload } from "../types/CreateAccountPayload";
import { isEmailRule } from "../utils/isEmailRule";
import validateApiResponse from "../utils/validateApiResponse";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DashboardScreen"
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

export default function SignUpScreen({ navigation }: Props) {
  const count = useSelector(getCount);
  StatusBar.setBarStyle("light-content", true);
  const dispatch = useAppDispatch();
  const [errorText, setErrorText] = useState("");

  const [
    createAccount, // This is the mutation trigger
    { isLoading: busy }, // This is the destructured mutation result
  ] = useCreateAccountMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountPayload>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      idNumber: "",
      password: "",
      rePassword: "",
    },
  });

  const onSubmit = async (values: CreateAccountPayload) => {
    const { email, password, firstName, lastName, idNumber, rePassword } =
      values;
    try {
      setErrorText("");
      const data: any = await createAccount({
        email,
        password,
        firstName,
        lastName,
        idNumber,
        rePassword,
      });
      validateApiResponse(data);

      //TODO: validate succesful response
      if (data?.data?.id) {
        // console.log(`succesfully logged in ${data?.data?.displayName}`);
        // return dispatch(setUser(data.data));
      }

      setErrorText("unknown error");
    } catch (err: any) {
      console.error("login", err.message);
      setErrorText(err.message);
    }
  };

  // console.log(errors);

  return (
    <View style={ApplicationStyles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.titleBanner}>
          <Text style={{ fontSize: 25 }}>CREATE AN ACCOUNT</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            margin: 30,
            width: "75%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>FIRST NAME</Text>
            <TextInputController
              control={control}
              name="firstName"
              error={errors?.firstName}
              required
              autoCapitalize="none"
              disabled={busy}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>LAST NAME</Text>
            <TextInputController
              control={control}
              name="lastName"
              error={errors?.lastName}
              required
              autoCapitalize="none"
              disabled={busy}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>EMAIL</Text>
            <TextInputController
              control={control}
              name="email"
              error={errors?.email}
              required
              autoCompleteType="email"
              autoCapitalize="none"
              disabled={busy}
              rules={isEmailRule}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>ID NUMBER</Text>
            <TextInputController
              control={control}
              name="idNumber"
              error={errors?.idNumber}
              required
              autoCapitalize="none"
              disabled={busy}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>PASSWORD</Text>
            <TextInputController
              control={control}
              name="password"
              error={errors?.password}
              required
              password
              autoCapitalize="none"
              disabled={busy}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textLabel}>RE-ENTER PASSWORD</Text>
            <TextInputController
              control={control}
              name="rePassword"
              error={errors?.rePassword}
              required
              password
              autoCapitalize="none"
              disabled={busy}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text
            style={[
              {
                fontSize: 20,
                color: Colors.white,
                backgroundColor: Colors.swireRed,
                padding: 10,
              },
              styles.shadow,
            ]}
          >
            CREATE ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
      <ErrorDialog
        text={errorText}
        onClose={() => {
          setErrorText("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
    backgroundColor: Colors.swireLightGray,
  },
  titleBanner: {
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: "100%",
    // top: 0,
    // position: 'absolute',
  },
  textLabel: {
    fontSize: 15,
    marginBottom: 5,
  },
  inputView: {
    width: "40%",
    margin: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,

    borderRadius: 1.0,
  },
});
