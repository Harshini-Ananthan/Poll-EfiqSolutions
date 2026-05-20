import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getAppTheme } from '../theme/appTheme';

export default function DisabledAccountScreen() {
  const { organization } = useAuth();
  const theme = getAppTheme(organization);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.title, { color: theme.text }]}>Account Disabled</Text>
        <Text style={[styles.message, { color: theme.mutedText }]}>
          Your organization access has been temporarily disabled. Please contact EfiqSolutions for further details.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.brandColor }]}
          activeOpacity={0.86}
          onPress={() => Linking.openURL('mailto:support@efiqsolutions.com')}
        >
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1A1209',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  title: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 26,
    color: '#1A1209',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 24,
    color: '#5F5248',
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
