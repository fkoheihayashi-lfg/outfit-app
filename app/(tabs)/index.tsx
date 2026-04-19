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
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { generateId } from '@src/utils/id';
import { Category, Season, Formality, Item } from '@src/types';

const CATEGORIES: Category[] = ['top', 'bottom', 'outer', 'shoes', 'accessory'];
const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter', 'all'];
const FORMALITIES: Formality[] = ['casual', 'smart_casual', 'business', 'formal'];

const SAMPLE_ITEMS: Omit<Item, 'id'>[] = [
  { name: 'White Oxford Shirt',  category: 'top',       color: 'white', season: 'all',    formality: 'smart_casual' },
  { name: 'Grey T-Shirt',        category: 'top',       color: 'grey',  season: 'summer', formality: 'casual'       },
  { name: 'Navy Chinos',         category: 'bottom',    color: 'navy',  season: 'all',    formality: 'smart_casual' },
  { name: 'Black Jeans',         category: 'bottom',    color: 'black', season: 'all',    formality: 'casual'       },
  { name: 'Beige Trench Coat',   category: 'outer',     color: 'beige', season: 'fall',   formality: 'smart_casual' },
  { name: 'Black Raincoat',      category: 'outer',     color: 'black', season: 'fall',   formality: 'casual'       },
  { name: 'Black Blazer',        category: 'outer',     color: 'black', season: 'all',    formality: 'business'     },
  { name: 'White Sneakers',      category: 'shoes',     color: 'white', season: 'spring', formality: 'casual'       },
  { name: 'Black Leather Shoes', category: 'shoes',     color: 'black', season: 'all',    formality: 'business'     },
  { name: 'Canvas Tote Bag',     category: 'accessory', color: 'beige', season: 'all',    formality: 'casual'       },
];

const emptyForm = {
  name: '',
  color: '',
  category: 'top' as Category,
  season: 'all' as Season,
  formality: 'casual' as Formality,
};

export default function HomeScreen() {
  const router = useRouter();
  const { items, addItem, deleteItem } = useWardrobeStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleAdd = () => {
    if (!form.name.trim() || !form.color.trim()) {
      Alert.alert('Missing fields', 'Please enter a name and color.');
      return;
    }
    addItem({ id: generateId(), ...form });
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete item', 'Remove this item from your wardrobe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  };

  const handleLoadSamples = () => {
    const load = () => SAMPLE_ITEMS.forEach((s) => addItem({ id: generateId(), ...s }));
    if (items.length > 0) {
      Alert.alert(
        'Load sample items',
        'This will add sample items to your existing wardrobe. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add', onPress: load },
        ]
      );
    } else {
      load();
    }
  };

  const canBuildOutfit = items.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[styles.primaryBtn, !canBuildOutfit && styles.primaryBtnDisabled]}
          onPress={() => router.push('/select-item')}
          disabled={!canBuildOutfit}
        >
          <Text style={styles.primaryBtnText}>
            {canBuildOutfit ? 'Build an Outfit' : 'Add items to build an outfit'}
          </Text>
        </TouchableOpacity>

        {items.length === 0 ? (
          <Text style={styles.empty}>Your wardrobe is empty. Add an item below.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.category} · {item.color} · {item.season} · {item.formality}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={8}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setShowForm((v) => !v)}
        >
          <Text style={styles.secondaryBtnText}>{showForm ? 'Cancel' : '+ Add Item'}</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name (e.g. White Oxford Shirt)"
              placeholderTextColor="#999"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Color (e.g. white)"
              placeholderTextColor="#999"
              value={form.color}
              onChangeText={(v) => setForm((f) => ({ ...f, color: v }))}
              returnKeyType="done"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, form.category === c && styles.chipSelected]}
                  onPress={() => setForm((f) => ({ ...f, category: c }))}
                >
                  <Text style={form.category === c ? styles.chipTextSelected : styles.chipText}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Season</Text>
            <View style={styles.chipRow}>
              {SEASONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.season === s && styles.chipSelected]}
                  onPress={() => setForm((f) => ({ ...f, season: s }))}
                >
                  <Text style={form.season === s ? styles.chipTextSelected : styles.chipText}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Formality</Text>
            <View style={styles.chipRow}>
              {FORMALITIES.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.chip, form.formality === f && styles.chipSelected]}
                  onPress={() => setForm((ff) => ({ ...ff, formality: f }))}
                >
                  <Text style={form.formality === f ? styles.chipTextSelected : styles.chipText}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleAdd}>
              <Text style={styles.primaryBtnText}>Add to Wardrobe</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.ghostBtn} onPress={handleLoadSamples}>
          <Text style={styles.ghostBtnText}>Load Sample Items</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 48 },

  primaryBtn: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnDisabled: { backgroundColor: '#aaa' },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  empty: { textAlign: 'center', color: '#888', marginVertical: 24 },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 15, fontWeight: '500', color: '#111' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  deleteBtn: { fontSize: 18, color: '#ccc', paddingHorizontal: 8 },

  secondaryBtn: {
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 16,
  },
  secondaryBtnText: { color: '#444', fontSize: 15 },

  form: { marginTop: 16, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#fff',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  chipSelected: { backgroundColor: '#222', borderColor: '#222' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextSelected: { fontSize: 13, color: '#fff' },

  ghostBtn: { alignItems: 'center', marginTop: 24, paddingVertical: 8 },
  ghostBtnText: { color: '#aaa', fontSize: 13 },
});
