import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { ArrowUpRight, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Calculation } from '@/types/calculator';
import { useCalculatorStore } from '@/store/calculator-store';
import * as Haptics from 'expo-haptics';
import WebOptimizedView from '@/components/WebOptimizedView';

interface RecipeItemProps {
  recipe: Calculation;
  onPress: () => void;
}

export default function RecipeItem({ recipe, onPress }: RecipeItemProps) {
  const { removeRecipe } = useCalculatorStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
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
      
      Haptics.selectionAsync();
    }
    
    onPress();
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    removeRecipe(recipe.id);
  };

  const formattedDate = new Date(recipe.date).toLocaleDateString();

  // Use different component based on platform
  const Container = Platform.OS === 'web' ? WebOptimizedView : Animated.View;
  const containerProps = Platform.OS === 'web' 
    ? { style: styles.container }
    : { style: [styles.container, { transform: [{ scale: scaleAnim }] }] };

  return (
    <Container {...containerProps}>
      <Pressable 
        style={styles.content} 
        onPress={handlePress}
        accessibilityLabel={`Recipe: ${recipe.name}`}
        accessibilityRole="button"
        accessibilityHint="Double tap to load this recipe"
      >
        <View style={styles.details}>
          <Text style={styles.name}>{recipe.name}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.itemCount}>
            {recipe.items.length} {recipe.items.length === 1 ? 'ingredient' : 'ingredients'}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.actions}>
            <Pressable 
              style={styles.actionButton} 
              onPress={handleDelete}
              accessibilityLabel={`Delete ${recipe.name}`}
              accessibilityRole="button"
            >
              <Trash2 size={18} color={Colors.light.error} />
            </Pressable>
            <View style={styles.openIcon}>
              <ArrowUpRight size={18} color={Colors.light.primary} />
            </View>
          </View>
        </View>
      </Pressable>
    </Container>
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
    ...(Platform.OS === 'web' ? {
      transition: 'all 0.2s ease',
      ':hover': {
        transform: 'translateY(-2px)',
        shadowOpacity: 0.2,
      }
    } : {}),
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
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
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginRight: 8,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ':hover': {
        transform: 'scale(1.1)',
      }
    } : {}),
  },
  openIcon: {
    padding: 4,
  },
});