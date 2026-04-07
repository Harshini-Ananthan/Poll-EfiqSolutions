import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface Props {
  label: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export default function OptionItem({
  label,
  description,
  emoji,
  selected,
  onSelect,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Left emoji icon */}
      {emoji ? (
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      ) : null}

      {/* Text */}
      <View style={styles.textWrap}>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {/* Radio */}
      <View style={[styles.radio, selected && styles.radioSelected]}>
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
  containerSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7F0',
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
  iconWrapSelected: {
    backgroundColor: '#FDECD9',
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
  labelSelected: {
    color: '#1A1A1A',
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
  radioSelected: {
    borderColor: '#F97316',
    backgroundColor: '#F97316',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
