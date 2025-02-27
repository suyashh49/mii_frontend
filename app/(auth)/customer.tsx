import React, { useEffect } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";

export default function CustomerLoginScreen() {
  const router = useRouter();

  // Initialize Google OAuth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com",
    //iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com",
    redirectUri: "com.googleusercontent.apps.394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com:/oauth2redirect/google",
  });

  useEffect(() => {
    const authenticateWithBackend = async (idToken: string) => {
      try {
        const response = await fetch(
          "https://maid-in-india-nglj.onrender.com/api/auth/google",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          // Store JWT Token (if using SecureStore, uncomment below)
          // await SecureStore.setItemAsync("authToken", data.token);

          // Redirect to customer dashboard
          router.replace("/(dashboard)/customer-home");
        } else {
          Alert.alert("Authentication Failed", data.error || "Unknown error");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to connect to the server");
      }
    };

    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        authenticateWithBackend(id_token);
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Sign in with Google</Text>
      <Button title="Sign in" onPress={() => promptAsync()} disabled={!request} />
    </View>
  );
}
