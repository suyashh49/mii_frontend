// import React, { useEffect } from "react";
// import { View, Button, Text, Alert, Pressable } from "react-native";
// import * as Google from "expo-auth-session/providers/google";
// import { useRouter } from "expo-router";

// export default function CustomerLoginScreen() {
//   const [request,response,promptAsync] = Google.useAuthRequest({
//     androidClientId: "394511221632-v9ppkml7s0dpgkc1k0ml9gdl3a62jdu6.apps.googleusercontent.com",  
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       const { authentication } = response;
//       console.log("Google authentication successful:", authentication);
//       // Handle authentication (e.g., send token to backend)
//     }
//   }, [response]);
  
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Pressable
//         style={{
//           backgroundColor: "blue",
//           padding: 10,
//           borderRadius: 5,
//         }}
//         onPress={() =>
//           promptAsync().catch((e) => {
//             console.error("Error in Google Auth", e);
//           })
//         }
//       >
//         <Text style={{ textAlign: "center", color: "white" }}>
//           Sign in with Google
//         </Text>
//       </Pressable>
//     </View>
//   );
//   }

//----------------------------------------------------------------------------------

  // const router = useRouter();

  // // Initialize Google OAuth Request
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId: "394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com",
  //   //iosClientId: "YOUR_IOS_CLIENT_ID",
  //   androidClientId: "394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com",
  //   redirectUri: "com.googleusercontent.apps.394511221632-l6rbge4rjcao4qfi3dof5tbua51oqsq0.apps.googleusercontent.com:/oauth2redirect/google",
  // });

  // useEffect(() => {
  //   const authenticateWithBackend = async (idToken: string) => {
  //     try {
  //       const response = await fetch(
  //         "https://maid-in-india-nglj.onrender.com/api/auth/google",
  //         {
  //           method: "GET",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ token: idToken }),
  //         }
  //       );

  //       const data = await response.json();
  //       if (response.ok) {
  //         // Store JWT Token (if using SecureStore, uncomment below)
  //         // await SecureStore.setItemAsync("authToken", data.token);

  //         // Redirect to customer dashboard
  //         router.replace("/(dashboard)/customer-home");
  //       } else {
  //         Alert.alert("Authentication Failed", data.error || "Unknown error");
  //       }
  //     } catch (error) {
  //       Alert.alert("Error", "Failed to connect to the server");
  //     }
  //   };

  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     if (id_token) {
  //       authenticateWithBackend(id_token);
  //     }
  //   }
  // }, [response]);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>Sign in with Google</Text>
//       <Button title="Sign in" onPress={() => promptAsync()} disabled={!request} />
//     </View>
//   );
// }

//---------------------------------------------------------
import { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useNavigation,NavigationProp } from "@react-navigation/native";
import * as Linking from "expo-linking";

// Define the type for your navigation stack
type RootStackParamList = {
  CustomerHome: undefined;
  // Add other routes here if needed
};


export default function CustomerScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Handle deep link for authentication result
  useEffect(() => {
    const handleAuthResponse = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      
      if (queryParams?.token) {
        // Store token securely (consider using SecureStore)
        // Then navigate to customer home
        navigation.navigate("CustomerHome");
      } else if (queryParams?.error) {
        Alert.alert("Authentication Error", "Failed to sign in with Google");
      }
    };

    // Add both initial and event listeners
    const subscription = Linking.addEventListener("url", handleAuthResponse);
    
    // Handle cold starts (app launched from deep link)
    Linking.getInitialURL().then(url => {
      if (url) handleAuthResponse({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Use the correct OAuth initiation endpoint
      const authUrl = "https://maid-in-india-nglj.onrender.com/api/auth/google";
      
      // Use proper redirect URL matching your backend configuration
      const redirectUrl = Linking.createURL("/(dashboard)/customer-home");
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      // Handle browser dismissal
      if (result.type === "cancel" || result.type === "dismiss") {
        Alert.alert("Cancelled", "Sign in was cancelled");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to open authentication session");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Customer Login</Text>
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}