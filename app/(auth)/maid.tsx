import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";

export default function MaidLoginScreen() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const sendOTP = () => {
    console.log("Sending OTP to", phone);
    alert(`OTP sent to ${phone}`);
    router.push({ pathname: "/(auth)/otp", params: { phone } });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Enter your phone number</Text>
      <TextInput
        style={{ borderBottomWidth: 1, width: 200, marginVertical: 10, textAlign: "center" }}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Send OTP" onPress={sendOTP} />
    </View>
  );
}
