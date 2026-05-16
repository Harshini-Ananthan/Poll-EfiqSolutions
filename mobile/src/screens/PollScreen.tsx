import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import PollCard from '../components/PollCard';
import ProfileDropdown from '../components/ProfileDropdown';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import { PollsService } from '../services/polls.service';
import { VotesService } from '../services/votes.service';
import DisabledAccountScreen from './DisabledAccountScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Poll'>;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const formatDate = (isoString: string) => {
  if (!isoString) return 'TODAY';
  const date = new Date(isoString);
  return `TODAY · ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
};

const formatTime = (isoString: string) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function PollScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [polls, setPolls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const data = await PollsService.getMobilePolls();
      setPolls(data);
    } catch (error) {
      console.error('Failed to fetch polls', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    setSubmittingId(pollId);
    try {
      await VotesService.submitVote(pollId, optionId);
      Alert.alert('Success', 'Your vote has been submitted.');
      fetchPolls();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit vote');
    } finally {
      setSubmittingId(null);
    }
  };

  if (!user) return null;

  if (user.isEnabled === false) {
    return <DisabledAccountScreen />;
  }

  const activePolls = polls.filter(p => p.isActive);

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
            <Text style={styles.avatarText}>{user.initials}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingLine}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* ── Poll Card ── */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 40 }} />
        ) : activePolls.length > 0 ? (
          activePolls.map((poll) => (
            <View key={poll.id} style={{ opacity: submittingId === poll.id ? 0.6 : 1, marginBottom: 20 }}>
              <PollCard
                date={formatDate(poll.scheduledAt)}
                question={poll.question}
                options={poll.options}
                cutoffTime={formatTime(poll.scheduledAt)}
                onSubmit={(optionId) => handleVote(poll.id, optionId)}
              />
            </View>
          ))
        ) : (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Manrope_500Medium', color: '#8A7E74' }}>No active polls available right now.</Text>
          </View>
        )}
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
        onLogout={async () => {
          setDropdownVisible(false);
          await logout();
        }}
        user={{ ...user, phone: user.phoneNumber }}
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
