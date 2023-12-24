import { StyleSheet, Text, View } from 'react-native';

import * as ExpoLineLogin from 'expo-line-login';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoLineLogin.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
