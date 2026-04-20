import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { generateId } from '@src/utils/id';
import { Category, Season, Formality, Item } from '@src/types';
import { Colors, Radius, Spacing, Typography } from '@src/constants/theme';

// ─── constants ───────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_SIZE    = (SCREEN_WIDTH - Spacing.screenH * 2 - Spacing.cardGap * 2) / 3;
const COLOR_HEIGHT = Math.round(CARD_SIZE * 0.6);

const CATEGORIES: Category[]   = ['top', 'bottom', 'outer', 'shoes', 'accessory'];
const SEASONS: Season[]        = ['spring', 'summer', 'fall', 'winter', 'all'];
const FORMALITIES: Formality[] = ['casual', 'smart_casual', 'business', 'formal'];

// Preset colors — names must be valid CSS color identifiers for ItemCard rendering.
const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: 'black',  hex: '#1c1c1c' },
  { name: 'white',  hex: '#f0f0f0' },
  { name: 'grey',   hex: '#888888' },
  { name: 'navy',   hex: '#1a3050' },
  { name: 'beige',  hex: '#c8aa80' },
  { name: 'brown',  hex: '#6b4c35' },
  { name: 'red',    hex: '#c0392b' },
  { name: 'blue',   hex: '#2471a3' },
  { name: 'olive',  hex: '#6b7c2e' },
  { name: 'green',  hex: '#27ae60' },
  { name: 'orange', hex: '#e67e22' },
  { name: 'pink',   hex: '#d63384' },
  { name: 'purple', hex: '#8e44ad' },
];

const CATEGORY_LABELS: Record<Category, string> = {
  top:       'Top',
  bottom:    'Bottom',
  outer:     'Outer Layer',
  shoes:     'Shoes',
  accessory: 'Accessory',
};

const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall:   'Fall',
  winter: 'Winter',
  all:    'All Seasons',
};

const FORMALITY_LABELS: Record<Formality, string> = {
  casual:       'Casual',
  smart_casual: 'Smart Casual',
  business:     'Business',
  formal:       'Formal',
};

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
  name:      '',
  color:     'black' as string,
  category:  'top' as Category,
  season:    'all' as Season,
  formality: 'casual' as Formality,
};

// ─── item card ───────────────────────────────────────────────────────────────

const ItemCard = ({
  item,
  onDelete,
}: {
  item: Item;
  onDelete: (id: string) => void;
}) => (
  <TouchableOpacity
    style={styles.card}
    onLongPress={() => onDelete(item.id)}
    delayLongPress={400}
    activeOpacity={0.8}
  >
    <View style={[styles.colorBlock, { backgroundColor: item.color }]} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.cardCategory}>{item.category}</Text>
    </View>
  </TouchableOpacity>
);

// ─── screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { items, addItem, deleteItem } = useWardrobeStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleAdd = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing name', 'Please enter a name for this item.');
      return;
    }
    addItem({ id: generateId(), ...form });
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove item', 'Remove this item from your wardrobe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  };

  const handleLoadSamples = () => {
    const load = () => SAMPLE_ITEMS.forEach((s) => addItem({ id: generateId(), ...s }));
    if (items.length > 0) {
      Alert.alert(
        'Load sample items',
        'This will add 10 sample items to your existing wardrobe. Continue?',
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

  const listHeader = (
    <View style={styles.headerBlock}>
      <TouchableOpacity
        style={[styles.primaryBtn, !canBuildOutfit && styles.primaryBtnDisabled]}
        onPress={() => router.push('/select-item')}
        disabled={!canBuildOutfit}
      >
        <Text style={[styles.primaryBtnText, !canBuildOutfit && styles.primaryBtnTextDisabled]}>
          {canBuildOutfit ? 'Build an Outfit' : 'Add items to get started'}
        </Text>
      </TouchableOpacity>

      {items.length === 0 ? (
        <Text style={styles.empty}>
          Your wardrobe is empty.{'\n'}Add an item below or load samples to try the app.
        </Text>
      ) : (
        <Text style={styles.wardrobeCount}>
          {items.length} item{items.length !== 1 ? 's' : ''} — long-press any item to remove it
        </Text>
      )}
    </View>
  );

  const listFooter = (
    <View style={styles.footerBlock}>
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
            placeholder="Item name  (e.g. White Oxford Shirt)"
            placeholderTextColor={Colors.textSecondary}
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            returnKeyType="done"
          />

          <Text style={styles.fieldLabel}>Color</Text>
          <View style={styles.swatchRow}>
            {PRESET_COLORS.map((c) => (
              <TouchableOpacity
                key={c.name}
                onPress={() => setForm((f) => ({ ...f, color: c.name }))}
                style={[
                  styles.swatch,
                  { backgroundColor: c.hex },
                  (c.name === 'white' || c.name === 'beige') && styles.swatchLight,
                  form.color === c.name && styles.swatchSelected,
                ]}
              />
            ))}
          </View>
          <Text style={styles.colorHint}>
            Selected: <Text style={styles.colorHintValue}>{form.color}</Text>
          </Text>

          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, form.category === c && styles.chipActive]}
                onPress={() => setForm((f) => ({ ...f, category: c }))}
              >
                <Text style={form.category === c ? styles.chipTextActive : styles.chipText}>
                  {CATEGORY_LABELS[c]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Season</Text>
          <View style={styles.chipRow}>
            {SEASONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, form.season === s && styles.chipActive]}
                onPress={() => setForm((f) => ({ ...f, season: s }))}
              >
                <Text style={form.season === s ? styles.chipTextActive : styles.chipText}>
                  {SEASON_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Formality</Text>
          <View style={styles.chipRow}>
            {FORMALITIES.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, form.formality === f && styles.chipActive]}
                onPress={() => setForm((ff) => ({ ...ff, formality: f }))}
              >
                <Text style={form.formality === f ? styles.chipTextActive : styles.chipText}>
                  {FORMALITY_LABELS[f]}
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
        <Text style={styles.ghostBtnText}>Load Sample Wardrobe (10 items)</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        renderItem={({ item }) => (
          <ItemCard item={item} onDelete={handleDelete} />
        )}
      />
    </KeyboardAvoidingView>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgBase },

  listContent: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 48,
  },
  columnWrapper: {
    gap: Spacing.cardGap,
    marginBottom: Spacing.cardGap,
  },

  // ── header / footer wrappers ──
  headerBlock: { paddingTop: Spacing.screenV, marginBottom: Spacing.md },
  footerBlock:  { marginTop: Spacing.sm },

  // ── primary button ──
  primaryBtn: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: 16,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryBtnDisabled:     { backgroundColor: Colors.bgSubtle },
  primaryBtnText:         { color: Colors.bgBase, fontWeight: Typography.semibold, fontSize: Typography.h3 },
  primaryBtnTextDisabled: { color: Colors.textDisabled },

  // ── wardrobe state hints ──
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: Typography.body,
    marginVertical: Spacing.xl,
    lineHeight: 22,
  },
  wardrobeCount: {
    fontSize: Typography.caption,
    color: Colors.textDisabled,
    marginBottom: Spacing.sm,
  },

  // ── grid card ──
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  colorBlock: {
    width: '100%',
    height: COLOR_HEIGHT,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 4,
    justifyContent: 'center',
  },
  cardName:     { fontSize: 11, color: '#ffffff', fontWeight: Typography.medium, lineHeight: 13 },
  cardCategory: { fontSize: 9,  color: '#999999', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },

  // ── secondary button ──
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: Typography.h3 },

  // ── add item form ──
  form: { marginTop: Spacing.md, gap: Spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSubtle,
  },
  fieldLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ── color swatches ──
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: '#ffffff' },
  swatchLight:    { borderColor: Colors.bgElevated },
  colorHint:      { fontSize: Typography.caption, color: Colors.textDisabled, marginTop: 2 },
  colorHintValue: { color: Colors.textSecondary, textTransform: 'capitalize' },

  // ── option chips ──
  chipRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.chipDefault,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  chipActive:     { backgroundColor: Colors.chipSelected },
  chipText:       { fontSize: Typography.body, color: Colors.chipTextDef },
  chipTextActive: { fontSize: Typography.body, color: Colors.chipTextSel },

  // ── ghost button ──
  ghostBtn:     { alignItems: 'center', marginTop: Spacing.xl, paddingVertical: Spacing.sm },
  ghostBtnText: { color: Colors.textDisabled, fontSize: Typography.caption },
});
