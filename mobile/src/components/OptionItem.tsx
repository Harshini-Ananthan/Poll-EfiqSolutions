import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AppTheme, getAppTheme } from '../theme/appTheme';

interface Props {
  label: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
  brandColor?: string;
  theme?: AppTheme;
}

export default function OptionItem({
  label,
  description,
  emoji,
  selected,
  onSelect,
  disabled,
  brandColor = '#F97316',
  theme: providedTheme,
}: Props) {
  const theme = providedTheme || getAppTheme({ brandColor, companyName: '', shortName: '', logoBase64: null });
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          padding: theme.spacing.optionPadding,
          marginBottom: theme.spacing.optionGap,
        },
        selected && { borderColor: brandColor, backgroundColor: brandColor + '12' },
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {emoji ? (
        <View style={[styles.iconWrap, { backgroundColor: theme.sheet }, selected && { backgroundColor: brandColor + '22' }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      ) : null}

      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, { color: theme.mutedText }]}>{description}</Text>
        ) : null}
      </View>

      <View style={[styles.radio, { borderColor: theme.strongBorder, backgroundColor: theme.surface }, selected && { borderColor: brandColor, backgroundColor: brandColor }]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E0D8',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  emoji: {
    fontSize: 22,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#8A7E74',
    lineHeight: 17,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C5BDB5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
    marginLeft: 8,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
