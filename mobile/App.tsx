import React, { useRef, useEffect } from 'react';
import { ActivityIndicator, View, Linking } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

import { RootStackParamList } from './src/types/navigation';
import PollScreen from './src/screens/PollScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DEFAULT_BRAND_COLOR, getAppTheme } from './src/theme/appTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['pollapp://'],
  config: {
    screens: {
      Poll: 'poll/:pollId',
      Summary: 'summary',
      Profile: 'profile',
      Login: 'login',
    },
  },
};

const extractPollId = (url: string): string | null => {
  const match = url.match(/pollapp:\/\/poll\/([^/?#]+)/);
  return match ? match[1] : null;
};

function AppNavigator() {
  const { user, organization, isLoading, setInitialPollId } = useAuth();
  const theme = getAppTheme(organization);
  const pendingPollIdRef = useRef<string | null>(null);

  // Capture deep link before login so it can be passed to PollScreen after auth
  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        const pollId = extractPollId(url);
        if (pollId) pendingPollIdRef.current = pollId;
      }
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      const pollId = extractPollId(url);
      if (pollId) {
        if (user) {
          setInitialPollId(pollId);
        } else {
          pendingPollIdRef.current = pollId;
        }
      }
    });
    return () => sub.remove();
  }, [user, setInitialPollId]);

  // Once user logs in and there's a pending deep link, forward it
  useEffect(() => {
    if (user && pendingPollIdRef.current) {
      setInitialPollId(pendingPollIdRef.current);
      pendingPollIdRef.current = null;
    }
  }, [user, setInitialPollId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.brandColor} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Poll" component={PollScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF7F2' }}>
        <ActivityIndicator size="large" color={DEFAULT_BRAND_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
