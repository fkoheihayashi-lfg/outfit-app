import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useWardrobeStore } from '@src/store/wardrobeStore';
import { useSessionStore } from '@src/store/sessionStore';
import { Item } from '@src/types';

export default function SelectItemScreen() {
  const router = useRouter();
  const { items } = useWardrobeStore();
  const { setSelectedItem, reset } = useSessionStore();

  // Clear any stale session from a previous outfit flow.
  useEffect(() => {
    reset();
  }, []);

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    router.push('/context-input');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Which item should the outfit be built around?</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.category} · {item.color} · {item.formality}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No items in your wardrobe.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 14, color: '#666', padding: 16, paddingBottom: 8 },
  list: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, fontWeight: '500', color: '#111' },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  arrow: { fontSize: 22, color: '#ccc' },
  empty: { textAlign: 'center', color: '#888', marginTop: 32 },
});
