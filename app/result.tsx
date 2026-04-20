import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@src/store/sessionStore';
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { useOutfitStore } from '@src/store/outfitStore';
import { generateOutfits, OutfitBlueprint } from '@src/logic/outfitGenerator';
import { Item } from '@src/types';
import { Colors, Radius, Spacing, Typography } from '@src/constants/theme';

const LABEL_SUBTITLES: Record<string, string> = {
  'Best Match':    'Harmonious tones — pieces that naturally go together',
  'Contrast Look': 'Bold contrast — different tones for visual interest',
  'Minimal':       'Stripped back — fewer pieces, cleaner look',
};

const ItemBadge = ({ item }: { item: Item }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeName}>{item.name}</Text>
    <Text style={styles.badgeMeta}>
      {item.category} · {item.color} · {item.formality}
    </Text>
  </View>
);

const OutfitCard = ({
  outfit,
  isSaved,
  onSave,
}: {
  outfit: OutfitBlueprint;
  isSaved: boolean;
  onSave: () => void;
}) => (
  <View style={styles.outfitCard}>
    <Text style={styles.suggestionLabel}>{outfit.label}</Text>
    {LABEL_SUBTITLES[outfit.label] && (
      <Text style={styles.suggestionSubtitle}>{LABEL_SUBTITLES[outfit.label]}</Text>
    )}

    <Text style={styles.sectionLabel}>Complete With</Text>
    {outfit.otherItems.length > 0 ? (
      outfit.otherItems.map((item) => <ItemBadge key={item.id} item={item} />)
    ) : (
      <Text style={styles.noItems}>
        No other items matched — try a different occasion or temperature, or add more items to your wardrobe.
      </Text>
    )}

    <View style={styles.reasonBox}>
      <Text style={styles.reasonLabel}>Why this outfit</Text>
      <Text style={styles.reasonText}>{outfit.reason}</Text>
    </View>

    {isSaved ? (
      <View style={styles.savedBanner}>
        <Text style={styles.savedBannerText}>✓ Saved to your outfits</Text>
      </View>
    ) : (
      <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
        <Text style={styles.primaryBtnText}>Save Outfit</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function ResultScreen() {
  const router = useRouter();
  const { selectedItem, context, reset } = useSessionStore();
  const { items } = useWardrobeStore();
  const { saveOutfit } = useOutfitStore();
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const outfits = useMemo(() => {
    if (!selectedItem || !context) return [];
    return generateOutfits(selectedItem, items, context);
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

  const handleSave = (index: number) => {
    saveOutfit(outfits[index]);
    setSavedIndices((prev) => new Set(prev).add(index));
    Alert.alert('Saved', 'Outfit saved to your collection.');
  };

  if (!selectedItem || !context) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Session lost</Text>
        <Text style={styles.empty}>
          Your selection was lost — this can happen if the app was restarted mid-flow.
          Return to the Wardrobe tab and tap "Build an Outfit" to begin again.
        </Text>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.navigate('/')}>
          <Text style={styles.secondaryBtnText}>Return to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (outfits.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No matching items found</Text>
        <Text style={styles.empty}>
          None of your wardrobe items matched the temperature, weather, and occasion you set.
          Try adjusting the conditions, or add more variety to your wardrobe.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={goBack}>
          <Text style={styles.primaryBtnText}>Adjust the Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleDone}>
          <Text style={styles.secondaryBtnText}>Back to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Main Item</Text>
      <ItemBadge item={outfits[0].mainItem} />

      {outfits.map((outfit, index) => (
        <OutfitCard
          key={outfit.label}
          outfit={outfit}
          isSaved={savedIndices.has(index)}
          onSave={() => handleSave(index)}
        />
      ))}

      <TouchableOpacity style={styles.secondaryBtn} onPress={handleDone}>
        <Text style={styles.secondaryBtnText}>Done — Back to Wardrobe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.bgBase },
  content:         { paddingHorizontal: Spacing.screenH, paddingTop: Spacing.screenV, paddingBottom: 48 },
  centerContainer: { flex: 1, backgroundColor: Colors.bgBase, padding: Spacing.xl, justifyContent: 'center' },

  sectionLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  outfitCard: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
  },

  suggestionLabel: {
    fontSize: Typography.h2,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textDisabled,
    marginBottom: Spacing.sm,
  },

  badge: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.cardGap,
  },
  badgeName: { fontSize: Typography.h3, fontWeight: Typography.medium, color: Colors.textPrimary },
  badgeMeta: { fontSize: Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs },

  noItems: {
    fontSize: Typography.body,
    color: Colors.textDisabled,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },

  reasonBox: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  reasonLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  reasonText: { fontSize: Typography.body, color: Colors.textSecondary, lineHeight: 20 },

  savedBanner: {
    marginTop: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savedBannerText: { color: Colors.textPrimary, fontWeight: Typography.semibold, fontSize: Typography.h3 },

  primaryBtn: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: 16,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: 0,
  },
  primaryBtnText: { color: Colors.bgBase, fontWeight: Typography.semibold, fontSize: Typography.h3 },

  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: Typography.h3 },

  emptyTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.semibold,
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
});
