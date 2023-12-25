import {
  login,
  logout,
  LoginPermission,
  BotPrompt,
  getProfile,
} from "expo-line-login";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const lineLogin = async () => {
  try {
    const res = await login(
      [LoginPermission.PROFILE, LoginPermission.OPEN_ID, LoginPermission.EMAIL],
      BotPrompt.NORMAL,
    );
    console.log(res.userProfile?.displayName);
  } catch (error) {
    console.log(error);
  }
};

const lineLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.log(error);
  }
};

const lineGetProfile = async () => {
  try {
    const res = await getProfile();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={lineLogin}>
        <Text>Login with Line</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={lineGetProfile}>
        <Text>Get Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={lineLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    rowGap: 6,
  },
});
