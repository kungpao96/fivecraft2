import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Hammer } from 'lucide-react-native';

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <Hammer size={24} color={Colors.light.primary} />
      <Text style={styles.brandText}>Fivecraft</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginLeft: 8,
  },
});