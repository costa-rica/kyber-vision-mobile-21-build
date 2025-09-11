import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Import library
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, reducerSetScreenDimensions } from "../reducers/user";
import { useSelector } from "react-redux";
import TemplateView from "./subcomponents/TemplateView";
import { FontAwesome } from "@expo/vector-icons";
import ButtonKvImage from "./subcomponents/buttons/ButtonKvImage";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user);
  const [screenDimensions, setScreenDimensions] = useState({
    portraitHeight: Dimensions.get("window").height,
    portraitWidth: Dimensions.get("window").width,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const handleClickRegister = async () => {
    if (password !== passwordRepeat) {
      // setMessage("Passwords do not match");
      Alert.alert("Passwords do not match");
      return;
    }
    if (!firstName || !lastName || !email || !password || !passwordRepeat) {
      // setMessage("All fields are required");
      Alert.alert("All fields are required");
      return;
    }
    if (!email.includes("@")) {
      // setMessage("Invalid email");
      Alert.alert("Invalid email");
      return;
    }

    console.log(
      "Register ---> API URL:",
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/users/register`
    );
    console.log("- handleClickRegister  👀");

    const bodyObj = { email, password, firstName, lastName };
    console.log(`email: ${email}, ${password}`);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      }
    );

    console.log("Received response:", response.status);

    let resJson = null;
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      resJson = await response.json();
    }

    if (response.status === 201) {
      console.log(`response ok`);
      resJson.email = email;
      dispatch(
        loginUser({
          email: resJson.user.email,
          token: resJson.token,
          username: resJson.user.username,
          contractTeamUserArray: resJson.user.ContractTeamUsers,
        })
      );
      setMessage("Successfully registered");
      console.log("after dispatch");
      navigation.navigate("SelectTeamScreen");
    } else if (resJson?.error) {
      setMessage(resJson.error);
      Alert.alert(resJson.error);
    } else {
      setMessage(`There was a server error: ${response.status}`);
      Alert.alert(`There was a server error: ${response.status}`);
    }
  };

  // const handlePasswordMatching = (text) => {
  //   setPassword(text);
  //   if (text !== passwordRepeat) {
  //     // setMessage("Passwords do not match");
  //     setPasswordsMatch(false);
  //   } else {
  //     setMessage(""); // Clear message when passwords match
  //     setPasswordsMatch(true);
  //   }
  // };
  const handlePasswordRepeatMatching = (text) => {
    setPasswordRepeat(text);
    if (password !== text) {
      // setMessage("Passwords do not match");
      setPasswordsMatch(false);
    } else {
      setMessage(""); // Clear message when passwords match
      setPasswordsMatch(true);
    }
  };
  return (
    <TemplateView navigation={navigation} hideSettings={true} noGrayBand={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true} // Ensures it works on Android
          extraScrollHeight={Platform.OS === "android" ? 80 : 0} // Pushes up slightly when keyboard opens
          enableAutomaticScroll={true} // Ensures inputs are visible when keyboard is open
          keyboardShouldPersistTaps="handled" // Allows tapping outside to dismiss keyboard
        >
          <View style={styles.container}>
            {/* -------- TOP ----- */}
            <View style={styles.containerTop}>
              <View style={styles.vwInputGroup}>
                <Text style={styles.txtInputGroupLabel}>First Name</Text>
                <View style={styles.vwInputWrapper}>
                  <FontAwesome
                    name="user"
                    size={20}
                    color="gray"
                    style={styles.faIcon}
                  />
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="gray"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                    style={styles.txtInputWithIcon}
                  />
                </View>
              </View>
              <View style={styles.vwInputGroup}>
                <Text style={styles.txtInputGroupLabel}>Last Name</Text>
                <View style={styles.vwInputWrapper}>
                  <FontAwesome
                    name="user"
                    size={20}
                    color="gray"
                    style={styles.faIcon}
                  />
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="gray"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    style={styles.txtInputWithIcon}
                  />
                </View>
              </View>
              <View style={styles.vwInputGroup}>
                <Text style={styles.txtInputGroupLabel}>E-mail</Text>
                <View style={styles.vwInputWrapper}>
                  <FontAwesome
                    name="envelope"
                    size={20}
                    color="gray"
                    style={styles.faIcon}
                  />
                  <TextInput
                    placeholder="your.email@volleyball.com"
                    placeholderTextColor="gray"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.txtInputWithIcon}
                  />
                </View>
              </View>
              <View style={styles.vwInputGroup}>
                <Text style={styles.txtInputGroupLabel}>Password</Text>
                <View style={styles.vwInputWrapper}>
                  <ButtonKvImage
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.vwIconButton}
                  >
                    <FontAwesome
                      name={showPassword ? "unlock" : "lock"}
                      size={20}
                      color="gray"
                      style={styles.faIcon}
                    />
                  </ButtonKvImage>
                  <TextInput
                    placeholder="••••••••••"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.txtInputWithIcon}
                  />
                </View>
              </View>
              <View style={[styles.vwInputGroup]}>
                <Text style={styles.txtInputGroupLabel}>Confirm Password</Text>
                <View
                  style={[
                    styles.vwInputWrapper,
                    { borderColor: passwordsMatch ? "#806181" : "red" },
                  ]}
                >
                  <ButtonKvImage
                    onPress={() => setShowPasswordRepeat((prev) => !prev)}
                    style={styles.vwIconButton}
                  >
                    <FontAwesome
                      name={showPasswordRepeat ? "unlock" : "lock"}
                      size={20}
                      color="gray"
                      style={styles.faIcon}
                    />
                  </ButtonKvImage>
                  <TextInput
                    placeholder="••••••••••"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPasswordRepeat}
                    value={passwordRepeat}
                    onChangeText={(text) => handlePasswordRepeatMatching(text)}
                    style={styles.txtInputWithIcon}
                  />
                </View>
              </View>

              {/* <View style={styles.vwInputGroupForgotPassword}>
            <ButtonKvStd
              onPress={() => console.log("ResetPasswordRequest")}
              style={styles.btnForgotPassword}
            >
              Forgot password ?
            </ButtonKvStd>
          </View> */}
              <View style={styles.vwInputGroupLogin}>
                <ButtonKvStd
                  onPress={() => handleClickRegister()}
                  style={styles.btnRegister}
                >
                  Register
                </ButtonKvStd>
              </View>

              {/* <View style={styles.vwInputGroupCreateAccount}>
            <ButtonKvStd
              onPress={() => console.log("Register")}
              style={styles.btnCreateAccount}
            >
              Create an account
            </ButtonKvStd>
          </View> */}
            </View>

            {/* <View style={styles.containerMiddle}>
          <View style={styles.vwInputWhiteLabel}>
            <TextInput
              placeholder={"Username"}
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={styles.inputEmail}
            />
          </View>
          <View style={styles.vwInputWhiteLabel}>
            <TextInput
              placeholder={"Email"}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.inputEmail}
            />
          </View>
          <View>
            <View style={styles.vwInputWhiteLabel}>
              <TextInput
                placeholder={"Password*"}
                value={password}
                // onChangeText={(text) => setPassword(text)}
                onChangeText={(text) => handlePasswordMatching(text)}
                style={styles.inputEmail}
                secureTextEntry={!showPassword}
              />
            </View>
            <View style={styles.vwSwitchHidePassword}>
                  <Text>Show Password</Text>
                  <Switch
                    value={showPassword}
                    onValueChange={(value) => setShowPassword(value)}
                  />
                </View> 
          </View>
          <View style={styles.vwInputWhiteLabel}>
            <TextInput
              placeholder={"Repeat password*"}
              value={passwordRepeat}
              onChangeText={(text) => handlePasswordRepeatMatching(text)}
              // onChangeText={(text) => setPasswordRepeat(text)}
              style={[
                styles.inputEmail,
                { borderColor: passwordsMatch ? "#806181" : "red" },
              ]}
              secureTextEntry={!showPassword}
            />
          </View>
        </View> */}

            {/* <View style={styles.containerBottom}>
          <TouchableOpacity
            style={[styles.touchOpButton, { backgroundColor: "#970F9A" }]}
            onPress={() => {
              console.log("pressed validate");
              handleClickRegister();
            }}
          >
            <Text style={styles.txtButton}>Validate</Text>
          </TouchableOpacity>
          <Text style={styles.txtMessage}> {message}</Text>
        </View> */}
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </TemplateView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    width: Dimensions.get("window").width,
  },

  // ----- Top Container -----
  containerTop: {
    // flex: 1,
    // borderWidth: 2, // Adjust thickness as needed
    // borderColor: "gray", // Change color as desired
    // borderStyle: "dashed",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },

  vwInputGroup: {
    width: "90%",
    alignItems: "flex-start",
    marginTop: 10,
  },
  vwInputGroupForgotPassword: {
    width: "90%",
    alignItems: "flex-start",
    marginTop: 5,
    paddingLeft: 15,
  },
  vwInputGroupCreateAccount: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "transparent",
  },
  vwInputGroupLogin: {
    width: "90%",
    alignItems: "center",
    paddingTop: 30,
  },
  vwInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  faIcon: {
    marginRight: 8,
  },
  txtInputWithIcon: {
    flex: 1,
    paddingVertical: 10,
    color: "black",
  },

  txtInputGroupLabel: {
    fontSize: 14,
    color: "#5B5B5B",
    paddingLeft: 15,
  },
  vwIconButton: {
    padding: 5,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  btnRegister: {
    width: Dimensions.get("window").width * 0.6,
    height: 50,
    justifyContent: "center",
    fontSize: 24,
    color: "#fff",
    backgroundColor: "#806181",
  },
  // // ---- MIDDLE, BOTTOM, OBE  ------
  // containerMiddle: {
  //   // flex: 1,
  //   // height: 500,
  //   // minHeight: 500,
  //   paddingTop: 50,
  //   paddingBottom: 50,
  //   justifyContent: "space-around",
  //   gap: 20,
  //   // justifyContent: "space-around",
  //   // borderWidth: 2, // Adjust thickness as needed
  //   // borderColor: "gray", // Change color as desired
  //   // borderStyle: "dashed",
  // },

  // vwInputWhiteLabel: {
  //   backgroundColor: "white",
  //   width: Dimensions.get("window").width,
  //   padding: 10,
  //   flexDirection: "row",
  //   gap: 10,
  // },
  // inputEmail: {
  //   borderColor: "#806181",
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   flex: 1,
  //   padding: 3,
  //   paddingLeft: 6,
  //   fontSize: 20,
  // },
  // vwSwitchHidePassword: {
  //   padding: 10,
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   paddingRight: 30,
  //   gap: 20,
  //   alignItems: "center",
  // },

  // // -------- BOTTOM -------------

  // //
  // containerBottom: {
  //   // flex: 1,
  //   // height: 200,
  //   // backgroundColor: "gray",
  //   // borderWidth: 2, // Adjust thickness as needed
  //   // borderColor: "gray", // Change color as desired
  //   // borderStyle: "dashed",
  //   // alignItems: "center",
  //   // width: "100%",
  //   // flexDirection: "column",
  //   // flexDirection:"column"
  //   // justifyContent: "center",
  //   alignItems: "center",
  //   gap: 20,
  //   // padding: 50,
  //   paddingBottom: 10,
  // },

  // touchOpButton: {
  //   // backgroundColor: "#A3A3A3",
  //   // marginTop: 10,
  //   borderRadius: 35,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "60%",
  //   padding: 15,
  //   // display: "flex",
  //   // alignItems: "center",
  //   // padding: 25,
  // },
  // txtButton: {
  //   color: "white",
  //   fontSize: 20,
  //   fontFamily: "ApfelGrotezk",
  //   // flexWrap: "wrap",
  //   textAlign: "center",
  // },
  // txtMessage: {
  //   color: "#970F9A",
  //   fontSize: 20,
  //   fontFamily: "ApfelGrotezk",
  //   // flexWrap: "wrap",
  //   textAlign: "center",
  //   // backgroundColor: "green",
  // },
});
