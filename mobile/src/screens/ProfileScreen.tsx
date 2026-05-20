import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import { getAppTheme } from '../theme/appTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

type InfoRowProps = {
  label: string;
  value?: string;
  colors: {
    border: string;
    text: string;
    muted: string;
    faint: string;
  };
  compact: boolean;
};

function InfoRow({ label, value, colors, compact }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, { borderColor: colors.border, paddingVertical: compact ? 12 : 15 }]}>
      <Text style={[styles.infoLabel, { color: colors.faint }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: value ? colors.text : colors.muted }]} numberOfLines={2}>
        {value || 'Not available'}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, organization, refreshUser, refreshOrganization } = useAuth();
  const theme = getAppTheme(organization);
  const brandColor = theme.brandColor;

  useFocusEffect(useCallback(() => {
    refreshUser();
    refreshOrganization();
  }, [refreshUser, refreshOrganization]));

  if (!user) return null;

  const phone = user.phoneNumber || user.mobileNo || '';
  const fullPhone = phone && user.countryCode && !phone.startsWith('+')
    ? `${user.countryCode} ${phone}`
    : phone;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: brandColor }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={brandColor} />

      <View style={styles.topBar}>
        <AppLogo
          logoBase64={organization?.logoBase64}
          companyName={organization?.shortName || organization?.companyName}
          brandColor={brandColor}
          onDark
        />
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => navigation.navigate('Poll')}
          activeOpacity={0.85}
        >
          <Text style={styles.avatarText}>{user.initials}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: brandColor }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingHorizontal: theme.spacing.screenX, paddingBottom: theme.compactMode ? 22 : 30 }]}>
          <Text style={styles.eyebrow}>Profile</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.subtitle}>{organization?.companyName || 'Employee account'}</Text>
        </View>

        <View style={[styles.sheet, { backgroundColor: theme.sheet, paddingHorizontal: theme.spacing.screenX, paddingTop: theme.compactMode ? 18 : 24 }]}>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.shadow, padding: theme.spacing.cardPadding }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.profileAvatar, { backgroundColor: brandColor }]}>
                <Text style={styles.profileAvatarText}>{user.initials}</Text>
              </View>
              <View style={styles.cardTitleWrap}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{user.name}</Text>
                <Text style={[styles.cardSubtitle, { color: theme.mutedText }]} numberOfLines={1}>
                  {user.department || 'Team member'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <InfoRow
              label="Name"
              value={user.name}
              compact={theme.compactMode}
              colors={{ border: theme.border, text: theme.text, muted: theme.mutedText, faint: theme.faintText }}
            />
            <InfoRow
              label="Phone number"
              value={fullPhone}
              compact={theme.compactMode}
              colors={{ border: theme.border, text: theme.text, muted: theme.mutedText, faint: theme.faintText }}
            />
            <InfoRow
              label="Email"
              value={user.email}
              compact={theme.compactMode}
              colors={{ border: theme.border, text: theme.text, muted: theme.mutedText, faint: theme.faintText }}
            />
            <InfoRow
              label="Department"
              value={user.department}
              compact={theme.compactMode}
              colors={{ border: theme.border, text: theme.text, muted: theme.mutedText, faint: theme.faintText }}
            />
          </View>

          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Poll')}
            activeOpacity={0.8}
          >
            <Text style={[styles.backButtonText, { color: brandColor }]}>Back to polls</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 14,
  },
  eyebrow: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 30,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 4,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 48,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
  },
  cardSubtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginTop: 18,
  },
  infoRow: {
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 5,
  },
  infoValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
});
