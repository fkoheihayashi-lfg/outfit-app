import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@src/store/sessionStore';
import { Weather, MeetingType, ContextInput } from '@src/types';
import { Colors, Radius, Spacing, Typography } from '@src/constants/theme';

const WEATHERS: Weather[]          = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
const MEETING_TYPES: MeetingType[] = ['casual', 'work', 'date', 'formal', 'sport'];

const WEATHER_LABELS: Record<Weather, string> = {
  sunny:  'Sunny',
  cloudy: 'Cloudy',
  rainy:  'Rainy',
  snowy:  'Snowy',
  windy:  'Windy',
};

const MEETING_LABELS: Record<MeetingType, string> = {
  casual: 'Casual',
  work:   'Work',
  date:   'Date',
  formal: 'Formal',
  sport:  'Sport',
};

const TEMP_MIN = -30;
const TEMP_MAX = 50;

export default function ContextInputScreen() {
  const router = useRouter();
  const { setContext } = useSessionStore();

  const [tempInput, setTempInput]     = useState('');
  const [weather, setWeather]         = useState<Weather>('sunny');
  const [meetingType, setMeetingType] = useState<MeetingType>('casual');

  const handleGenerate = () => {
    const temperature = parseInt(tempInput, 10);

    if (tempInput.trim() === '' || isNaN(temperature)) {
      Alert.alert(
        'Temperature required',
        'Enter today\'s outside temperature in °C so we can suggest appropriate layers and seasonal items.'
      );
      return;
    }
    if (temperature < TEMP_MIN || temperature > TEMP_MAX) {
      Alert.alert(
        'Temperature out of range',
        `Please enter a value between ${TEMP_MIN}°C and ${TEMP_MAX}°C.`
      );
      return;
    }

    const context: ContextInput = { temperature, weather, meetingType };
    setContext(context);
    router.push('/result');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenHint}>
          These three details filter your wardrobe and shape the suggestions.
        </Text>

        <Text style={[styles.fieldLabel, styles.firstFieldLabel]}>Temperature (°C)</Text>
        <TextInput
          style={styles.input}
          placeholder="Today's temperature  (e.g. 18)"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numbers-and-punctuation"
          value={tempInput}
          onChangeText={setTempInput}
          returnKeyType="done"
        />
        <Text style={styles.inputHint}>
          Affects which layers and seasonal items are included.
        </Text>

        <Text style={styles.fieldLabel}>Weather</Text>
        <View style={styles.chipRow}>
          {WEATHERS.map((w) => (
            <TouchableOpacity
              key={w}
              style={[styles.chip, weather === w && styles.chipActive]}
              onPress={() => setWeather(w)}
            >
              <Text style={weather === w ? styles.chipTextActive : styles.chipText}>
                {WEATHER_LABELS[w]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Occasion</Text>
        <View style={styles.chipRow}>
          {MEETING_TYPES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, meetingType === m && styles.chipActive]}
              onPress={() => setMeetingType(m)}
            >
              <Text style={meetingType === m ? styles.chipTextActive : styles.chipText}>
                {MEETING_LABELS[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleGenerate}>
          <Text style={styles.primaryBtnText}>See Outfit Suggestions</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: Colors.bgBase },
  container: {
    paddingHorizontal: Spacing.screenH,
    paddingTop:        Spacing.screenV,
    paddingBottom:     48,
  },

  screenHint: {
    fontSize:   Typography.body,
    color:      Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  fieldLabel: {
    fontSize:      Typography.caption,
    fontWeight:    Typography.semibold,
    color:         Colors.textSecondary,
    marginTop:     Spacing.lg,
    marginBottom:  Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  firstFieldLabel: { marginTop: Spacing.sm },

  input: {
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    Radius.xs,
    padding:         Spacing.md,
    fontSize:        Typography.h3,
    color:           Colors.textPrimary,
    backgroundColor: Colors.bgSubtle,
  },
  inputHint: {
    fontSize:  Typography.caption,
    color:     Colors.textDisabled,
    marginTop: Spacing.xs,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.chipDefault,
    borderRadius:    Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  chipActive:     { backgroundColor: Colors.chipSelected },
  chipText:       { fontSize: Typography.body, color: Colors.chipTextDef },
  chipTextActive: { fontSize: Typography.body, color: Colors.chipTextSel },

  primaryBtn: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: 16,
    borderRadius:    Radius.sm,
    alignItems:      'center',
    marginTop:       Spacing.xxl,
  },
  primaryBtnText: { color: Colors.bgBase, fontWeight: Typography.semibold, fontSize: Typography.h3 },
});
