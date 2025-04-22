import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusCircle, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCalculatorStore } from '@/store/calculator-store';
import CalculatorInput from '@/components/CalculatorInput';
import CalculationResult from '@/components/CalculationResult';
import CalculationHeader from '@/components/CalculationHeader';
import EmptyState from '@/components/EmptyState';
import BrandHeader from '@/components/BrandHeader';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import WebOptimizedView from '@/components/WebOptimizedView';

export default function CalculatorScreen() {
  const { currentCalculation, addItem, updateItem, removeItem, recipes, startNewRecipe } = useCalculatorStore();
  const { items } = currentCalculation;
  const router = useRouter();

  // Web-specific keyboard shortcuts
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Add new item with Ctrl+N or Cmd+N
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
          e.preventDefault();
          handleAddItem();
        }
        
        // Save recipe with Ctrl+S or Cmd+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          document.getElementById('save-recipe-button')?.click();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleAddItem = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    addItem({
      label: '',
      value: '',
      operation: items.length === 0 ? 'add' : 'add',
    });
  };

  const handleValueChange = (id: string, value: string) => {
    updateItem(id, { value });
  };

  const handleLabelChange = (id: string, label: string) => {
    updateItem(id, { label });
  };

  const handleOperationChange = (id: string, operation: 'add' | 'subtract' | 'multiply' | 'divide') => {
    updateItem(id, { operation });
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleNewRecipe = () => {
    // First create a new recipe
    startNewRecipe();
    
    // Then add the first item to make the calculator appear
    setTimeout(() => {
      addItem({
        label: '',
        value: '',
        operation: 'add',
      });
    }, 100);
    
    // Provide haptic feedback on non-web platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleViewRecipes = () => {
    router.push('/recipes');
  };

  // If we're in a new recipe with no items, show the recipes list or empty state
  if (items.length === 0 && currentCalculation.name === "New Recipe") {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <BrandHeader />
        
        <WebOptimizedView style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Fivecraft</Text>
          <Text style={styles.welcomeSubtitle}>Your crafting calculator</Text>
          
          {recipes.length > 0 ? (
            <View style={styles.actionButtonsContainer}>
              <Pressable 
                style={styles.primaryButton} 
                onPress={handleNewRecipe}
                accessibilityLabel="Create New Recipe"
                accessibilityRole="button"
              >
                <PlusCircle size={24} color={Colors.light.card} />
                <Text style={styles.primaryButtonText}>Create New Recipe</Text>
              </Pressable>
              
              <Pressable 
                style={styles.secondaryButton} 
                onPress={handleViewRecipes}
                accessibilityLabel="View Saved Recipes"
                accessibilityRole="button"
              >
                <BookOpen size={24} color={Colors.light.primary} />
                <Text style={styles.secondaryButtonText}>View Saved Recipes</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <EmptyState
                type="calculator"
                title="No recipes yet"
                message="Create your first recipe to start crafting"
              />
              <Pressable 
                style={styles.primaryButton} 
                onPress={handleNewRecipe}
                accessibilityLabel="Create New Recipe"
                accessibilityRole="button"
              >
                <PlusCircle size={24} color={Colors.light.card} />
                <Text style={styles.primaryButtonText}>Create New Recipe</Text>
              </Pressable>
            </View>
          )}
        </WebOptimizedView>
      </SafeAreaView>
    );
  }

  // Otherwise show the calculator
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BrandHeader />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CalculationHeader />
        
        <CalculationResult />
        
        {items.length === 0 ? (
          <EmptyState
            type="calculator"
            title="No ingredients yet"
            message="Add your first ingredient to start crafting"
          />
        ) : (
          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <CalculatorInput
                key={item.id}
                item={item}
                isFirst={index === 0}
                onValueChange={(value) => handleValueChange(item.id, value)}
                onLabelChange={(label) => handleLabelChange(item.id, label)}
                onOperationChange={(operation) => handleOperationChange(item.id, operation)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.addButtonContainer}>
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddItem}
          accessibilityLabel="Add Ingredient"
          accessibilityRole="button"
        >
          <PlusCircle size={24} color={Colors.light.card} />
          <Text style={styles.addButtonText}>Add Ingredient</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemsContainer: {
    marginTop: 8,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  addButtonText: {
    color: Colors.light.card,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  welcomeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 40,
  },
  actionButtonsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  primaryButtonText: {
    color: Colors.light.card,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    gap: 24,
  },
});