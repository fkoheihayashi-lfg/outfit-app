import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useOutfitStore } from '@src/store/outfitStore';
import { Outfit } from '@src/types';
import { Colors, Radius, Spacing, Typography } from '@src/constants/theme';

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
    {/* Top row: label badge + date + delete */}
    <View style={styles.cardTop}>
      <View style={styles.labelBadge}>
        <Text style={styles.labelBadgeText}>{outfit.label}</Text>
      </View>
      <Text style={styles.savedDate}>{formatDate(outfit.savedAt)}</Text>
      <TouchableOpacity onPress={onDelete} hitSlop={8} style={styles.deleteHitArea}>
        <Text style={styles.deleteBtn}>✕</Text>
      </TouchableOpacity>
    </View>

    {/* Main item */}
    <View style={styles.mainItemRow}>
      <View style={[styles.colorDot, { backgroundColor: outfit.mainItem.color }]} />
      <View style={styles.mainItemText}>
        <Text style={styles.mainItemName}>{outfit.mainItem.name}</Text>
        <Text style={styles.mainItemMeta}>
          {outfit.mainItem.category} · {outfit.mainItem.color}
        </Text>
      </View>
    </View>

    {/* Other items */}
    {outfit.otherItems.length > 0 && (
      <Text style={styles.otherItems} numberOfLines={2}>
        With: {outfit.otherItems.map((i) => i.name).join(', ')}
      </Text>
    )}
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
  container:   { flex: 1, backgroundColor: Colors.bgBase },
  listContent: { paddingHorizontal: Spacing.screenH, paddingTop: Spacing.screenV, paddingBottom: 48 },

  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: Typography.body,
    marginTop: 40,
    lineHeight: 22,
  },

  card: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },

  // ── top row ──
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labelBadge: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  labelBadgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  savedDate: {
    flex: 1,
    fontSize: Typography.caption,
    color: Colors.textDisabled,
  },
  deleteHitArea: { padding: 4 },
  deleteBtn:     { fontSize: 16, color: Colors.textDisabled },

  // ── main item ──
  mainItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    flexShrink: 0,
  },
  mainItemText: { flex: 1 },
  mainItemName: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  mainItemMeta: {
    fontSize: Typography.caption,
    color: Colors.textDisabled,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  // ── other items ──
  otherItems: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
