import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Choose your role</Text>
      <Button title="Continue as Customer" onPress={() => router.push("/(auth)/customer")} />
      <Button title="Continue as Maid" onPress={() => router.push("/(auth)/maid")} />
    </View>
  );
}
