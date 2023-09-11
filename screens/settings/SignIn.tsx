import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "../../components/ui/Button";
import { SettingsScreenProps } from "../../navigation";
import UnhandledError from "../../exception/unhandled";
import { authenticate } from "../../api/authenticate";

export default function SignIn({ navigation }: SettingsScreenProps<"signIn">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const credentials = await authenticate(email, password);
      navigation.navigate("settingList");
    } catch (error) {
      if (error instanceof Error) setError(error);
      else throw new UnhandledError("Failed to sign in"); // this should never be thrown
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Sign in</Text>
        <View style={styles.fields}>
          <TextInput
            style={styles.field}
            placeholder="email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.field}
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        {error && (
          <Text style={{ color: "red" }}>
            {error.message ||
              "An unknown error occurred. please contact support"}
          </Text>
        )}
        <Button disabled={!email || !password} onPress={handleSubmit}>
          Sign in
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#e9e9e9",
    gap: 32,
    borderRadius: 32,
    padding: 24,
  },
  fields: { gap: 16 },
  field: {
    backgroundColor: "#ddd",
    height: 48,
    borderRadius: 8,
    padding: 8,
  },
});
