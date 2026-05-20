import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, Modal, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/AppLogo';
import { getAppTheme } from '../theme/appTheme';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+82', country: 'KR', name: 'South Korea' },
  { code: '+55', country: 'BR', name: 'Brazil' },
  { code: '+27', country: 'ZA', name: 'South Africa' },
  { code: '+234', country: 'NG', name: 'Nigeria' },
  { code: '+254', country: 'KE', name: 'Kenya' },
  { code: '+92', country: 'PK', name: 'Pakistan' },
  { code: '+880', country: 'BD', name: 'Bangladesh' },
  { code: '+94', country: 'LK', name: 'Sri Lanka' },
  { code: '+977', country: 'NP', name: 'Nepal' },
];

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showPicker, setShowPicker] = useState(false);
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
      await login(countryCode.code + phoneNumber);
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
            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={[styles.countryCodeBox, { backgroundColor: theme.input, borderColor: theme.border }]}
                onPress={() => setShowPicker(true)}
                disabled={isLoading}
              >
                <Text style={[styles.countryCodeText, { color: theme.text }]}>{countryCode.code}</Text>
                <Text style={[styles.chevron, { color: theme.mutedText }]}>▾</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
                placeholder="1234567890"
                placeholderTextColor={theme.faintText}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
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

      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPicker(false)}>
          <View style={[styles.modalSheet, { backgroundColor: theme.input }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Country Code</Text>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item, index) => `${item.country}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, countryCode.country === item.country && countryCode.code === item.code && { backgroundColor: theme.border }]}
                  onPress={() => { setCountryCode(item); setShowPicker(false); }}
                >
                  <Text style={[styles.modalItemCode, { color: theme.text }]}>{item.code}</Text>
                  <Text style={[styles.modalItemName, { color: theme.mutedText }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE5DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  countryCodeText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: '#1A1209',
  },
  chevron: {
    fontSize: 12,
    color: '#8A7E74',
  },
  input: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '60%',
  },
  modalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: '#1A1209',
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  modalItemCode: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: '#1A1209',
    width: 52,
  },
  modalItemName: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    color: '#8A7E74',
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
