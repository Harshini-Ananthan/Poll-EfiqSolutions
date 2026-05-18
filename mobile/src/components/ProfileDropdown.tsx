import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSummary: () => void;
  onSettings: () => void;
  onLogout: () => void;
  user: {
    name: string;
    phone: string;
    initials: string;
  };
  brandColor?: string;
}

export default function ProfileDropdown({
  visible,
  onClose,
  onSummary,
  onSettings,
  onLogout,
  user,
  brandColor = '#F97316',
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.dropdown, { borderColor: brandColor }]} onPress={(e) => e.stopPropagation()}>
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: brandColor }]}>
                <Text style={styles.avatarText}>{user.initials}</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Summary */}
          <TouchableOpacity style={styles.menuItem} onPress={onSummary}>
            <Text style={styles.menuText}>Summary</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={styles.menuItem} onPress={onSettings}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout  ↩</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.10)',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 72,
    paddingRight: 16,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 210,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  avatarWrap: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: '#1A1A1A',
  },
  userPhone: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  menuText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#1A1A1A',
  },
  logoutText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#EF4444',
  },
});
