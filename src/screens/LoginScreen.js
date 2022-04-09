import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Button } from "native-base";
import { setUserAction } from "../store/actions/userActions";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const user = {
      email,
      password,
    };
    setLoading(true);
    try {
      const response = await fetch("http://app.mediabox.bi:1997/users/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
      const userData = await response.json();
      if (response.ok) {
        console.log(user);
        // setError("LOG SUCCESS");
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        dispatch(setUserAction(userData));
      } else {
        console.log(userData);
        setErrors(userData.errors);
      }
    } catch (error) {
      // setError(error);
      console.log(error);
    }

    // await AsyncStorage.setItem("user", JSON.stringify(user));
    // dispatch(addUserAction(user));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Image
          style={{ width: 100, height: 100 }}
          source={require("../../assets/icon.png")}
        />
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 5,
          }}
        >
          PSR BURUNDI
        </Text>
      </View>
      <View style={styles.footer}>
        {/* <Text style={styles.text_footer}>Email*</Text> */}
        <View style={styles.action}>
          <MaterialIcons name="email" size={24} color="#777" />
          <TextInput
            placeholder="Votre Email*"
            style={styles.textInput}
            autoCapitalize="none"
            value={email}
            onChangeText={(em) => setEmail(em)}
          />
        </View>
        {errors && errors.email && (
          <Text style={styles.error}>{errors.email}</Text>
        )}

        {/* <Text style={styles.text_footer1}>Mot de passe*</Text> */}
        <View style={styles.action}>
          <MaterialIcons name="lock" size={24} color="#777" />
          <TextInput
            placeholder="Votre Mot de Passe*"
            secureTextEntry={showPassword}
            style={styles.textInput}
            autoCapitalize="none"
            value={password}
            onChangeText={(em) => setPassword(em)}
          />
          <TouchableOpacity onPress={() => setShowPassword((t) => !t)}>
            {!showPassword ? (
              <Ionicons name="eye-outline" size={24} color="black" />
            ) : (
              <Feather name="eye-off" size={20} color="grey" />
            )}
          </TouchableOpacity>
        </View>

        {errors && errors.password && (
          <Text style={styles.error}>{errors.password}</Text>
        )}

        {errors && errors.main && (
          <Text style={styles.errormain}>{errors.main}</Text>
        )}

        <View style={styles.actions}>
          <Button
            isDisabled={email == "" || password == ""}
            background={"#000"}
            isLoading={loading}
            onPress={handleLogin}
            size="lg"
            w="full"
            mt={10}
            py={2}
            _text={{ fontSize: 18 }}
            borderRadius={10}
          >
            Se connecter
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: "30%",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,

    // backgroundColor:"red"
  },
  footer: {
    height: "70%",
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {},
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  action: {
    flexDirection: "row",
    marginTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  text_footer1: {
    marginTop: 35,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  SignIn1: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#009387",
    borderWidth: 1,
    marginTop: 15,
  },
  SignVous: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#FF0000",
    borderWidth: 1,
    marginTop: 15,
  },
  error: {
    color: "#F90505",
  },
  errormain: {
    color: "#F90505",
    textAlign: "center",
  },
});
