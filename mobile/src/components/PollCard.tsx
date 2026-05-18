import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  initialSelectedId?: string;
  initialComment?: string;
  allowVoteEdit?: boolean;
  onSubmit?: (selectedId: string, comment?: string) => void;
  brandColor?: string;
}

export default function PollCard({
  date,
  question,
  options,
  cutoffTime,
  initialSelectedId,
  initialComment,
  allowVoteEdit,
  onSubmit,
  brandColor = '#F97316',
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId || null);
  const [comment, setComment] = useState(initialComment || '');
  const [submitted, setSubmitted] = useState(!!initialSelectedId);

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
      setSubmitted(true);
    }
    if (initialComment) setComment(initialComment);
  }, [initialSelectedId, initialComment]);

  const displayOptions = [...options];
  if (!displayOptions.some(o => o.id === 'other' || o.label.toLowerCase() === 'others' || o.label.toLowerCase() === 'other')) {
    displayOptions.push({ id: 'other', label: 'Others' });
  }

  const isOtherSelected =
    selectedId === 'other' ||
    displayOptions.find(o => o.id === selectedId)?.label.toLowerCase() === 'others';

  const handleSelect = (id: string) => {
    if (!submitted || allowVoteEdit) {
      setSelectedId(id);
      if (submitted && id !== initialSelectedId) setSubmitted(false);
    }
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
    if (submitted && allowVoteEdit && text !== initialComment) setSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedId && !submitted) {
      setSubmitted(true);
      onSubmit?.(selectedId, comment);
    }
  };

  const canSubmit = !!selectedId && !submitted && !(isOtherSelected && comment.trim() === '');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.date, { color: brandColor }]}>{date}</Text>
        <MaterialCommunityIcons
          name={allowVoteEdit ? 'pencil' : 'pencil-off'}
          size={16}
          color={allowVoteEdit ? '#8A7E74' : '#D1D5DB'}
        />
      </View>

      <Text style={styles.question}>{question}</Text>

      <View style={styles.optionsContainer}>
        {displayOptions.map((opt) => (
          <OptionItem
            key={opt.id}
            label={opt.label}
            description={opt.description}
            emoji={opt.emoji}
            selected={selectedId === opt.id}
            onSelect={() => handleSelect(opt.id)}
            disabled={false}
            brandColor={brandColor}
          />
        ))}
      </View>

      {isOtherSelected && (
        <TextInput
          style={styles.commentInput}
          placeholder="Need other options? Add a comment…"
          placeholderTextColor="#A89A8E"
          value={comment}
          onChangeText={handleCommentChange}
          editable={!submitted || allowVoteEdit}
        />
      )}

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: brandColor }, !canSubmit && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>
          {submitted ? 'Vote Submitted ✓' : (initialSelectedId ? 'Update Vote' : 'Submit Vote')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.cutoff}>Closes at {cutoffTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1A1209',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EDE5DC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  question: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 17,
    color: '#1A1209',
    marginBottom: 18,
    lineHeight: 24,
  },
  optionsContainer: { marginBottom: 4 },
  commentInput: {
    borderWidth: 1,
    borderColor: '#EDE5DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#3D3028',
    marginTop: 4,
    marginBottom: 16,
    backgroundColor: '#FDFCFB',
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  cutoff: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#A89A8E',
    textAlign: 'center',
    marginTop: 12,
  },
});
