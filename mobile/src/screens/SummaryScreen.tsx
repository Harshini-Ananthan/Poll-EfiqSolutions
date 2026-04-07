import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ProfileDropdown from '../components/ProfileDropdown';
import AppLogo from '../components/AppLogo';
import { mockUser, mockSummaryThisMonth, mockSummaryLastMonth } from '../data/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Summary'>;

type TabType = 'this' | 'last';

interface SummaryItem {
  id: string;
  date: string;
  meal: string;
  type: 'Veg' | 'Non-veg';
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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('this');

  const data: SummaryItem[] =
    activeTab === 'this'
      ? (mockSummaryThisMonth as SummaryItem[])
      : (mockSummaryLastMonth as SummaryItem[]);

  const renderItem = ({ item }: { item: SummaryItem }) => (
    <View style={styles.row}>
      <Text style={styles.rowDate}>{item.date}</Text>
      <Text style={styles.rowMeal}>{item.meal}</Text>
      <View
        style={[
          styles.badge,
          item.type === 'Veg' ? styles.vegBadge : styles.nonVegBadge,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            item.type === 'Veg' ? styles.vegText : styles.nonVegText,
          ]}
        >
          {item.type}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F97316" />

      {/* ── Orange top bar ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* ── White content area ── */}
      <View style={styles.content}>
        {/* ── Header: Logo + Avatar ── */}
        <View style={styles.header}>
          <AppLogo />
          <TouchableOpacity
            id="summary-profile-avatar"
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

        {/* ── Title ── */}
        <Text style={styles.title}>Summary</Text>

        {/* ── Tabs ── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'this' && styles.tabActive]}
            onPress={() => setActiveTab('this')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'this' && styles.tabTextActive,
              ]}
            >
              THIS MONTH
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'last' && styles.tabActive]}
            onPress={() => setActiveTab('last')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'last' && styles.tabTextActive,
              ]}
            >
              Last Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── List ── */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No responses yet</Text>
            </View>
          }
        />
      </View>

      {/* ── Profile Dropdown ── */}
      <ProfileDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onSummary={() => setDropdownVisible(false)}
        onSettings={() => setDropdownVisible(false)}
        onLogout={() => {
          setDropdownVisible(false);
          navigation.navigate('Poll');
        }}
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

  /* Main white area */
  content: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 16,
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
  rowMeal: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#1A1209',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  vegBadge: {
    backgroundColor: '#DCFCE7',
  },
  nonVegBadge: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
  },
  vegText: {
    color: '#16A34A',
  },
  nonVegText: {
    color: '#DC2626',
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
});
