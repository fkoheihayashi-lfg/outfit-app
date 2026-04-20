import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { useSessionStore } from '@src/store/sessionStore';
import { Formality, Item } from '@src/types';
import { Colors, Spacing, Typography } from '@src/constants/theme';

const FORMALITY_LABELS: Record<Formality, string> = {
  casual:       'Casual',
  smart_casual: 'Smart Casual',
  business:     'Business',
  formal:       'Formal',
};

export default function SelectItemScreen() {
  const router = useRouter();
  const { items } = useWardrobeStore();
  const { setSelectedItem, reset } = useSessionStore();

  useEffect(() => {
    reset();
  }, []);

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    router.push('/context-input');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.heading}>Pick one item to build the outfit around.</Text>
        <Text style={styles.subheading}>
          We'll suggest what to pair with it on the next screen.
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.category} · {FORMALITY_LABELS[item.formality]}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Your wardrobe is empty.{'\n'}Go to the Wardrobe tab to add some items first.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgBase },

  headerBlock: {
    paddingHorizontal: Spacing.screenH,
    paddingTop:        Spacing.lg,
    paddingBottom:     Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  heading: {
    fontSize:   Typography.h3,
    fontWeight: Typography.semibold,
    color:      Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subheading: {
    fontSize:  Typography.caption,
    color:     Colors.textSecondary,
    lineHeight: 18,
  },

  list: { flex: 1 },

  row: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.screenH,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap:               Spacing.sm,
  },

  colorDot: {
    width:        14,
    height:       14,
    borderRadius: 7,
    borderWidth:  1,
    borderColor:  Colors.bgElevated,
    flexShrink:   0,
  },

  info:  { flex: 1 },
  name:  { fontSize: Typography.h3, fontWeight: Typography.medium, color: Colors.textPrimary },
  meta:  {
    fontSize:        Typography.caption,
    color:           Colors.textSecondary,
    marginTop:       Spacing.xs,
    textTransform:   'capitalize',
  },
  arrow: { fontSize: 22, color: Colors.textDisabled },

  empty: {
    textAlign:  'center',
    color:      Colors.textSecondary,
    marginTop:  Spacing.xxl,
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
});
