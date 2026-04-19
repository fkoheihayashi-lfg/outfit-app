import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useOutfitStore } from '@src/store/outfitStore';
import { Outfit } from '@src/types';

const formatDate = (ts: number): string => {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const OutfitCard = ({
  outfit,
  onDelete,
}: {
  outfit: Outfit;
  onDelete: () => void;
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.mainItem}>{outfit.mainItem.name}</Text>
        <Text style={styles.savedDate}>{formatDate(outfit.savedAt)}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={8}>
        <Text style={styles.deleteBtn}>✕</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.items}>
      {outfit.otherItems.length > 0
        ? `With: ${outfit.otherItems.map((i) => i.name).join(', ')}`
        : 'No other items'}
    </Text>
    <Text style={styles.reason}>{outfit.reason}</Text>
  </View>
);

export default function SavedScreen() {
  const { savedOutfits, deleteOutfit } = useOutfitStore();

  const handleDelete = (savedAt: number) => {
    Alert.alert('Remove outfit', 'Remove this saved outfit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteOutfit(savedAt) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedOutfits}
        keyExtractor={(o) => String(o.savedAt)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No saved outfits yet.{'\n'}Build one from the Wardrobe tab.
          </Text>
        }
        renderItem={({ item }) => (
          <OutfitCard outfit={item} onDelete={() => handleDelete(item.savedAt)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 48 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, lineHeight: 22 },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitleRow: { flex: 1, marginRight: 8 },
  mainItem: { fontSize: 15, fontWeight: '600', color: '#111' },
  savedDate: { fontSize: 11, color: '#bbb', marginTop: 2 },
  deleteBtn: { fontSize: 18, color: '#ccc', paddingHorizontal: 4 },
  items: { fontSize: 13, color: '#555', marginTop: 8 },
  reason: { fontSize: 12, color: '#888', marginTop: 6, fontStyle: 'italic', lineHeight: 17 },
});
