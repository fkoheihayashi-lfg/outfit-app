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

const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
const MEETING_TYPES: MeetingType[] = ['casual', 'work', 'date', 'formal', 'sport'];

const TEMP_MIN = -30;
const TEMP_MAX = 50;

export default function ContextInputScreen() {
  const router = useRouter();
  const { setContext } = useSessionStore();

  const [tempInput, setTempInput] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [meetingType, setMeetingType] = useState<MeetingType>('casual');

  const handleGenerate = () => {
    const temperature = parseInt(tempInput, 10);

    if (tempInput.trim() === '' || isNaN(temperature)) {
      Alert.alert('Temperature required', 'Please enter a temperature in °C (e.g. 18).');
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
        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput
          style={styles.input}
          placeholder={`e.g. 18  (${TEMP_MIN} to ${TEMP_MAX})`}
          placeholderTextColor="#999"
          keyboardType="numbers-and-punctuation"
          value={tempInput}
          onChangeText={setTempInput}
          returnKeyType="done"
        />

        <Text style={styles.label}>Weather</Text>
        <View style={styles.chipRow}>
          {WEATHERS.map((w) => (
            <TouchableOpacity
              key={w}
              style={[styles.chip, weather === w && styles.chipSelected]}
              onPress={() => setWeather(w)}
            >
              <Text style={weather === w ? styles.chipTextSelected : styles.chipText}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Occasion</Text>
        <View style={styles.chipRow}>
          {MEETING_TYPES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, meetingType === m && styles.chipSelected]}
              onPress={() => setMeetingType(m)}
            >
              <Text style={meetingType === m ? styles.chipTextSelected : styles.chipText}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleGenerate}>
          <Text style={styles.primaryBtnText}>Generate Outfit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16, paddingBottom: 48 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fff',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: '#222', borderColor: '#222' },
  chipText: { fontSize: 14, color: '#444' },
  chipTextSelected: { fontSize: 14, color: '#fff' },
  primaryBtn: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
