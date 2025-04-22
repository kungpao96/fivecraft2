import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { ArrowUpRight, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Calculation } from '@/types/calculator';
import { useCalculatorStore } from '@/store/calculator-store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface HistoryItemProps {
  calculation: Calculation;
  onPress: () => void;
}

export default function HistoryItem({ calculation, onPress }: HistoryItemProps) {
  const { settings, removeCalculation } = useCalculatorStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    onPress();
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    removeCalculation(calculation.id);
  };

  const formattedDate = new Date(calculation.date).toLocaleDateString();
  const formattedTotal = calculation.total.toFixed(settings.decimalPlaces);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable style={styles.content} onPress={handlePress}>
        <View style={styles.details}>
          <Text style={styles.name}>{calculation.name}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.itemCount}>
            {calculation.items.length} {calculation.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.total}>
            {settings.currencySymbol}{formattedTotal}
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={handleDelete}>
              <Trash2 size={18} color={Colors.light.error} />
            </Pressable>
            <View style={styles.openIcon}>
              <ArrowUpRight size={18} color={Colors.light.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginRight: 8,
  },
  openIcon: {
    padding: 4,
  },
});