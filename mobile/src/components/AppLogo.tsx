import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppLogo() {
  return (
    <View style={styles.row}>
      {/* Green leaf icon */}
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>🌿</Text>
      </View>
      {/* Text part */}
      <View style={styles.textWrap}>
        <Text style={styles.efg}>efg</Text>
        <Text style={styles.one}>one</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textWrap: {
    flexDirection: 'column',
  },
  efg: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: '#2D2D2D',
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  one: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: '#8A8A8A',
    lineHeight: 13,
    letterSpacing: 0.5,
  },
});
