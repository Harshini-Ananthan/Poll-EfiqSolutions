import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import PollCard from '../components/PollCard';
import ProfileDropdown from '../components/ProfileDropdown';
import AppLogo from '../components/AppLogo';
import { mockUser, mockPoll } from '../data/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Poll'>;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export default function PollScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBF7F2" />

      {/* ── Top Orange Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header: Logo + Avatar ── */}
        <View style={styles.header}>
          <AppLogo />
          <TouchableOpacity
            id="profile-avatar"
            style={styles.avatarButton}
            onPress={() => setDropdownVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.avatarText}>{mockUser.initials}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingLine}>{getGreeting()},</Text>
          <Text style={styles.userName}>{mockUser.name}</Text>
        </View>

        {/* ── Poll Card ── */}
        <PollCard
          date={mockPoll.date}
          question={mockPoll.question}
          options={mockPoll.options}
          cutoffTime={mockPoll.cutoffTime}
        />
      </ScrollView>

      {/* ── Profile Dropdown ── */}
      <ProfileDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onSummary={() => {
          setDropdownVisible(false);
          navigation.navigate('Summary');
        }}
        onSettings={() => setDropdownVisible(false)}
        onLogout={() => setDropdownVisible(false)}
        user={mockUser}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F97316',
  },

  /* Orange top bar */
  topBar: {
    backgroundColor: '#F97316',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topBarDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  /* Scroll */
  scrollView: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },

  /* Greeting */
  greetingWrap: {
    marginBottom: 20,
  },
  greetingLine: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#8A7E74',
    marginBottom: 2,
  },
  userName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 26,
    color: '#1A1209',
    letterSpacing: -0.3,
  },
});
