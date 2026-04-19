import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@src/store/sessionStore';
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { useOutfitStore } from '@src/store/outfitStore';
import { generateOutfits } from '@src/logic/outfitGenerator';
import { Item } from '@src/types';

const ItemBadge = ({ item }: { item: Item }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeName}>{item.name}</Text>
    <Text style={styles.badgeMeta}>
      {item.category} · {item.color} · {item.formality}
    </Text>
  </View>
);

export default function ResultScreen() {
  const router = useRouter();
  const { selectedItem, context, reset } = useSessionStore();
  const { items } = useWardrobeStore();
  const { saveOutfit } = useOutfitStore();
  const [saved, setSaved] = useState(false);

  const outfit = useMemo(() => {
    if (!selectedItem || !context) return null;
    const results = generateOutfits(selectedItem, items, context);
    return results[0] ?? null;
  }, [selectedItem, context, items]);

  const handleDone = () => {
    reset();
    router.navigate('/');
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
    }
  };

  if (!selectedItem || !context) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.empty}>Session expired. Please start over.</Text>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.navigate('/')}>
          <Text style={styles.secondaryBtnText}>Go to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!outfit) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No outfit found</Text>
        <Text style={styles.empty}>
          None of your wardrobe items match this context. Try a different temperature, weather, or
          occasion.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={goBack}>
          <Text style={styles.primaryBtnText}>Change Context</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleDone}>
          <Text style={styles.secondaryBtnText}>Back to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = () => {
    saveOutfit(outfit);
    setSaved(true);
    Alert.alert('Saved', 'Outfit saved to your collection.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Main Item</Text>
      <ItemBadge item={outfit.mainItem} />

      <Text style={styles.sectionLabel}>Complete With</Text>
      {outfit.otherItems.length > 0 ? (
        outfit.otherItems.map((item) => <ItemBadge key={item.id} item={item} />)
      ) : (
        <Text style={styles.noItems}>
          No other items from your wardrobe matched this context. Try adding more items.
        </Text>
      )}

      <View style={styles.reasonBox}>
        <Text style={styles.reasonLabel}>Why this outfit</Text>
        <Text style={styles.reasonText}>{outfit.reason}</Text>
      </View>

      {saved ? (
        <View style={styles.savedBanner}>
          <Text style={styles.savedBannerText}>✓ Saved to your outfits</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Save Outfit</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.secondaryBtn} onPress={handleDone}>
        <Text style={styles.secondaryBtnText}>Done — Back to Wardrobe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  centerContainer: { flex: 1, padding: 24, justifyContent: 'center' },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  badgeName: { fontSize: 15, fontWeight: '500', color: '#111' },
  badgeMeta: { fontSize: 12, color: '#888', marginTop: 2 },

  noItems: { fontSize: 14, color: '#aaa', fontStyle: 'italic', marginBottom: 8 },

  reasonBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    marginTop: 24,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  reasonText: { fontSize: 14, color: '#555', lineHeight: 20 },

  savedBanner: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f0f7f0',
    alignItems: 'center',
  },
  savedBannerText: { color: '#4a7c4a', fontWeight: '600', fontSize: 15 },

  primaryBtn: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  secondaryBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryBtnText: { color: '#444', fontSize: 15 },

  emptyTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 8, color: '#111' },
  empty: { textAlign: 'center', color: '#888', lineHeight: 20, marginBottom: 24 },
});
