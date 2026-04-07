import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import OptionItem from './OptionItem';

interface Option {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
}

interface Props {
  date: string;
  question: string;
  options: Option[];
  cutoffTime: string;
  onSubmit?: (selectedId: string) => void;
}

export default function PollCard({
  date,
  question,
  options,
  cutoffTime,
  onSubmit,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (!submitted) {
      setSelectedId(id);
      onSubmit?.(id);
    }
  };

  return (
    <View style={styles.card}>
      {/* Date Tag */}
      <Text style={styles.date}>{date}</Text>

      {/* Question */}
      <Text style={styles.question}>{question}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <OptionItem
            key={opt.id}
            label={opt.label}
            description={opt.description}
            emoji={opt.emoji}
            selected={selectedId === opt.id}
            onSelect={() => handleSelect(opt.id)}
            disabled={false}
          />
        ))}
      </View>

      {/* Cutoff */}
      <Text style={styles.cutoff}>Cutoff: {cutoffTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDE5DC',
  },
  date: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#F97316',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  question: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: '#3D3028',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 2,
  },
  cutoff: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#A89A8E',
    textAlign: 'center',
    marginTop: 10,
  },
});
