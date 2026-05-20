import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/AppLogo';
import { getAppTheme } from '../theme/appTheme';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, organization } = useAuth();
  const theme = getAppTheme(organization);

  const handleLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await login(phoneNumber);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <AppLogo
              logoBase64={organization?.logoBase64}
              companyName={organization?.shortName || organization?.companyName}
              brandColor={theme.brandColor}
              onDark={theme.darkMode}
            />
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: theme.mutedText }]}>Enter your phone number to continue</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
              placeholder="+1234567890"
              placeholderTextColor={theme.faintText}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.brandColor, paddingVertical: theme.spacing.buttonPaddingY }, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7F2',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 32,
    color: '#1A1209',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: '#8A7E74',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#3D3028',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE5DC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: '#1A1209',
  },
  button: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F9B07A',
  },
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
