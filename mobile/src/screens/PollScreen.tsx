import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import PollCard from '../components/PollCard';
import ProfileDropdown from '../components/ProfileDropdown';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import { PollsService } from '../services/polls.service';
import { VotesService } from '../services/votes.service';
import DisabledAccountScreen from './DisabledAccountScreen';
import { AppTheme, getAppTheme } from '../theme/appTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Poll'>;

const SCREEN_HEIGHT = Dimensions.get('window').height;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const formatHeaderDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

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

function EmptyState({ theme }: { theme: AppTheme }) {
  return (
    <View style={emptyStyles.container}>
      <View style={[emptyStyles.iconRing, { borderColor: theme.brandColor + '40', backgroundColor: theme.surface }]}>
        <Text style={emptyStyles.icon}>🗳️</Text>
      </View>
      <Text style={[emptyStyles.title, { color: theme.text }]}>No polls today</Text>
      <Text style={[emptyStyles.subtitle, { color: theme.mutedText }]}>
        Your admin hasn't posted any active polls yet. Check back later.
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 32 },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  icon: { fontSize: 36 },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: '#1A1209',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#8A7E74',
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default function PollScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, organization, logout, refreshOrganization, initialPollId, setInitialPollId } = useAuth();
  const theme = getAppTheme(organization);
  const brandColor = theme.brandColor;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [polls, setPolls] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  // Maps pollId → Y offset from the top of the sheet content
  const pollYPositions = useRef<Record<string, number>>({});
  // Animated value for the highlight pulse on the targeted poll
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchPolls(); }, []);

  useFocusEffect(useCallback(() => { refreshOrganization(); }, [refreshOrganization]));

  // Once polls are loaded and we have a pending pollId, scroll + highlight
  useEffect(() => {
    if (!isLoading && initialPollId && polls.length > 0) {
      const yPos = pollYPositions.current[initialPollId];
      if (yPos !== undefined) {
        scrollToPoll(yPos);
      } else {
        // Delay slightly to let layouts settle then scroll
        setTimeout(() => {
          const y = pollYPositions.current[initialPollId];
          if (y !== undefined) scrollToPoll(y);
        }, 400);
      }
    }
  }, [isLoading, initialPollId, polls]);

  const scrollToPoll = (yOffset: number) => {
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    // Pulse highlight animation: fade in → stay → fade out
    Animated.sequence([
      Animated.timing(highlightAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(highlightAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setInitialPollId(null));
  };

  const fetchPolls = async () => {
    try {
      const [pollsData, votesData] = await Promise.all([
        PollsService.getMobilePolls(),
        VotesService.getMyVotes(),
      ]);
      setPolls(pollsData);
      setVotes(votesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string, comment?: string) => {
    setSubmittingId(pollId);
    try {
      await VotesService.submitVote(pollId, optionId, comment);
      Alert.alert('Success', 'Your vote has been submitted.');
      fetchPolls();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit vote');
    } finally {
      setSubmittingId(null);
    }
  };

  if (!user) return null;
  if (user.isEnabled === false) return <DisabledAccountScreen />;

  const activePolls = polls.filter(p => p.isActive);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: brandColor }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={brandColor} />

      {/* ── Sticky top bar — always visible ── */}
      <View style={styles.stickyBar}>
        <AppLogo
          logoBase64={organization?.logoBase64}
          companyName={organization?.shortName || organization?.companyName}
          brandColor={brandColor}
          onDark
        />
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => setDropdownVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{user.initials}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scroll area ── */}
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { backgroundColor: brandColor }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
      >
        {/* Greeting — scrolls away on scroll-up */}
        <View style={[styles.greetingSection, { paddingHorizontal: theme.spacing.screenX, paddingBottom: theme.compactMode ? 20 : 28 }]}>
          <Text style={styles.greetingLine}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.dateText}>{formatHeaderDate()}</Text>
        </View>

        {/* White content sheet */}
        <View style={[styles.sheet, { backgroundColor: theme.sheet, paddingHorizontal: theme.spacing.screenX, paddingTop: theme.compactMode ? 18 : 24 }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Polls</Text>
            {!isLoading && activePolls.length > 0 && (
              <View style={[styles.badge, { backgroundColor: brandColor + '18' }]}>
                <Text style={[styles.badgeText, { color: brandColor }]}>{activePolls.length}</Text>
              </View>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={brandColor} style={{ marginTop: 60 }} />
          ) : activePolls.length > 0 ? (
            activePolls.map((poll) => {
              const userVote = votes.find(v => v.pollId === poll.id);
              const isTarget = poll.id === initialPollId;
              return (
                <View
                  key={poll.id}
                  onLayout={(e) => {
                    pollYPositions.current[poll.id] = e.nativeEvent.layout.y;
                  }}
                  style={{ opacity: submittingId === poll.id ? 0.55 : 1, marginBottom: 16 }}
                >
                  {isTarget ? (
                    <Animated.View style={[
                      styles.highlightRing,
                      {
                        borderColor: brandColor,
                        opacity: highlightAnim,
                        shadowColor: brandColor,
                        transform: [{ scale: highlightAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }],
                      },
                    ]}>
                      <PollCard
                        date={formatDate(poll.scheduledAt)}
                        question={poll.question}
                        options={poll.options}
                        cutoffTime={poll.cutoffTime ? formatTime(poll.cutoffTime) : formatTime(poll.scheduledAt)}
                        initialSelectedId={userVote?.optionId}
                        initialComment={userVote?.comment}
                        allowVoteEdit={poll.allowVoteEdit}
                        onSubmit={(optionId, comment) => handleVote(poll.id, optionId, comment)}
                        brandColor={brandColor}
                        theme={theme}
                      />
                    </Animated.View>
                  ) : (
                    <PollCard
                      date={formatDate(poll.scheduledAt)}
                      question={poll.question}
                      options={poll.options}
                      cutoffTime={poll.cutoffTime ? formatTime(poll.cutoffTime) : formatTime(poll.scheduledAt)}
                      initialSelectedId={userVote?.optionId}
                      initialComment={userVote?.comment}
                      allowVoteEdit={poll.allowVoteEdit}
                      onSubmit={(optionId, comment) => handleVote(poll.id, optionId, comment)}
                      brandColor={brandColor}
                      theme={theme}
                    />
                  )}
                </View>
              );
            })
          ) : (
            <EmptyState theme={theme} />
          )}
        </View>
      </ScrollView>

      <ProfileDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onSummary={() => { setDropdownVisible(false); navigation.navigate('Summary'); }}
        onProfile={() => { setDropdownVisible(false); navigation.navigate('Profile'); }}
        onLogout={async () => { setDropdownVisible(false); await logout(); }}
        user={{ ...user, phone: user.phoneNumber || user.mobileNo || '' }}
        brandColor={brandColor}
        darkMode={theme.darkMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  stickyBar: {
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

  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 4,
  },
  greetingLine: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  userName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  dateText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },

  sheet: {
    backgroundColor: '#F5F0EB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: SCREEN_HEIGHT,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: '#1A1209',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
  },

  highlightRing: {
    borderRadius: 22,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
