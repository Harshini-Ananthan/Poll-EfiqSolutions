import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AppLogoProps {
  logoBase64?: string | null;
  companyName?: string;
  brandColor?: string;
  onDark?: boolean;
}

export default function AppLogo({
  logoBase64,
  companyName,
  brandColor = '#F97316',
  onDark = false,
}: AppLogoProps) {
  const circleBg = onDark ? 'rgba(255,255,255,0.2)' : (logoBase64 ? '#fff' : brandColor + '22');
  const circleBorder = onDark ? 'rgba(255,255,255,0.35)' : brandColor + '44';
  const nameColor = onDark ? '#FFFFFF' : '#1A1209';
  const initialsColor = onDark ? '#FFFFFF' : brandColor;

  return (
    <View style={styles.row}>
      <View style={[styles.circle, { backgroundColor: circleBg, borderColor: circleBorder }]}>
        {logoBase64 ? (
          <Image
            source={{ uri: `data:image/png;base64,${logoBase64}` }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.initials, { color: initialsColor }]}>
            {companyName ? companyName.substring(0, 2).toUpperCase() : 'CO'}
          </Text>
        )}
      </View>
      {companyName ? (
        <Text style={[styles.name, { color: nameColor }]} numberOfLines={1}>
          {companyName}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  initials: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
  name: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    flexShrink: 1,
  },
});
