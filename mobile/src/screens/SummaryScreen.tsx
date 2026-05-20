import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ProfileDropdown from '../components/ProfileDropdown';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import { VotesService } from '../services/votes.service';
import { getAppTheme } from '../theme/appTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Summary'>;

type TabType = 'this' | 'last';

interface SummaryItem {
  id: string;
  date: string;
  meal: string;
  question: string;
  rawDate: Date;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export default function SummaryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, organization, logout, refreshOrganization } = useAuth();
  const theme = getAppTheme(organization);
  const brandColor = theme.brandColor;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('this');
  
  const [votes, setVotes] = useState<SummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVotes();
  }, []);

  useFocusEffect(useCallback(() => { refreshOrganization(); }, [refreshOrganization]));

  const fetchVotes = async () => {
    try {
      const data = await VotesService.getMyVotes();
      const formatted = data.map((v: any) => ({
        id: v.id,
        date: new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        meal: v.meal,
        question: v.question,
        rawDate: new Date(v.createdAt)
      }));
      setVotes(formatted);
    } catch (error) {
      console.error('Failed to fetch votes', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthVotes = votes.filter(v => 
    v.rawDate.getMonth() === currentMonth && v.rawDate.getFullYear() === currentYear
  );

  const lastMonthVotes = votes.filter(v => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return v.rawDate.getMonth() === prevMonth && v.rawDate.getFullYear() === prevYear;
  });

  const dataToDisplay = activeTab === 'this' ? thisMonthVotes : lastMonthVotes;

  const renderItem = ({ item }: { item: SummaryItem }) => (
    <View style={[styles.row, { paddingVertical: theme.spacing.rowPaddingY }]}>
      <Text style={[styles.rowDate, { color: theme.faintText }]}>{item.date}</Text>
      <View style={styles.rowContent}>
        <Text style={[styles.rowQuestion, { color: theme.text }]}>{item.question || 'Unknown Poll'}</Text>
        <Text style={[styles.rowMeal, { color: theme.mutedText }]}>Selected: {item.meal}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: brandColor }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={brandColor} />

      {/* ── Orange top bar ── */}
      <View style={[styles.topBar, { backgroundColor: brandColor }]}>
        <View style={styles.header}>
          <AppLogo
            logoBase64={organization?.logoBase64}
            companyName={organization?.shortName || organization?.companyName}
            brandColor={brandColor}
            onDark
          />
          <TouchableOpacity
            id="summary-profile-avatar"
            style={styles.avatarButton}
            onPress={() => setDropdownVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.avatarText}>{user.initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── White content area ── */}
      <View style={[styles.hero, { paddingHorizontal: theme.spacing.screenX, paddingBottom: theme.compactMode ? 22 : 30 }]}>
        {/* ── Header: Logo + Avatar ── */}
        {/* ── Greeting ── */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingLine}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* ── Title ── */}
      </View>

      <View style={[styles.content, { backgroundColor: theme.background, paddingHorizontal: theme.spacing.screenX, paddingTop: theme.spacing.contentTop }]}>
        <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing.sectionGap }]}>Summary</Text>

        {/* ── Tabs ── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: activeTab === 'this' ? brandColor : theme.strongBorder },
              activeTab === 'this' && { backgroundColor: brandColor + '12' },
            ]}
            onPress={() => setActiveTab('this')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'this' ? brandColor : theme.faintText },
              ]}
            >
              THIS MONTH
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: activeTab === 'last' ? brandColor : theme.strongBorder },
              activeTab === 'last' && { backgroundColor: brandColor + '12' },
            ]}
            onPress={() => setActiveTab('last')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'last' ? brandColor : theme.faintText },
              ]}
            >
              LAST MONTH
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── List ── */}
        {isLoading ? (
          <ActivityIndicator size="large" color={brandColor} style={{ marginTop: 40 }} />
        ) : (
          <>
            <FlatList
              data={dataToDisplay}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: theme.faintText }]}>No responses yet</Text>
                </View>
              }
            />
            <TouchableOpacity
              style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate('Poll')}
              activeOpacity={0.8}
            >
              <Text style={[styles.backButtonText, { color: brandColor }]}>Back to polls</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── Profile Dropdown ── */}
      <ProfileDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onSummary={() => setDropdownVisible(false)}
        onProfile={() => { setDropdownVisible(false); navigation.navigate('Profile'); }}
        onLogout={async () => {
          setDropdownVisible(false);
          await logout();
        }}
        user={{ ...user, phone: user.phoneNumber || user.mobileNo || '' }}
        brandColor={brandColor}
        darkMode={theme.darkMode}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  hero: {
    paddingTop: 14,
  },

  /* Main white area */
  content: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
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

  /* Greeting */
  greetingWrap: {
    marginBottom: 16,
  },
  greetingLine: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    marginBottom: 2,
  },
  userName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  /* Title */
  title: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 30,
    color: '#1A1209',
    marginBottom: 20,
  },

  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#C5BDB5',
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderColor: '#1A1209',
    backgroundColor: 'transparent',
  },
  tabText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#A89A8E',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: '#1A1209',
  },

  /* List */
  listContent: {
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDE5DC',
    marginVertical: 2,
  },

  /* Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowDate: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#A89A8E',
    width: 52,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  rowQuestion: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#1A1209',
    marginBottom: 4,
  },
  rowMeal: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: '#8A7E74',
  },
  /* Empty */
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#A89A8E',
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  backButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
});
