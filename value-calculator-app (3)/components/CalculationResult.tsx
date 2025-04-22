import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, ScrollView, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { useCalculatorStore } from '@/store/calculator-store';
import WebOptimizedView from '@/components/WebOptimizedView';

export default function CalculationResult() {
  const { getIngredientSummary, currentCalculation, setFinalQuantity } = useCalculatorStore();
  const { finalQuantity } = currentCalculation;
  const ingredientSummary = getIngredientSummary();
  const animatedValue = useRef(new Animated.Value(1)).current;
  
  // Use conditional animation based on platform
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [finalQuantity, ingredientSummary]);

  const handleQuantityChange = (text: string) => {
    const quantity = parseInt(text, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setFinalQuantity(quantity);
    } else if (text === '') {
      setFinalQuantity(1);
    }
  };

  // Use different component based on platform
  const SummaryItem = Platform.OS === 'web' ? WebOptimizedView : Animated.View;
  const summaryItemProps = Platform.OS === 'web' 
    ? { style: styles.summaryItem }
    : { style: [styles.summaryItem, { transform: [{ scale: animatedValue }] }] };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Final Product Quantity</Text>
          <TextInput
            style={styles.quantityInput}
            value={finalQuantity.toString()}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
            placeholder="1"
            accessibilityLabel="Final product quantity"
            accessibilityHint="Enter how many of the final product you want to craft"
          />
        </View>
      </View>
      
      {ingredientSummary.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Materials Needed:</Text>
          <ScrollView 
            style={styles.summaryList} 
            contentContainerStyle={styles.summaryContent}
            accessibilityLabel="Materials needed list"
          >
            {ingredientSummary.map((ingredient) => (
              <SummaryItem 
                key={ingredient.id} 
                {...summaryItemProps}
              >
                <Text style={styles.ingredientName}>
                  {ingredient.label || "Unnamed Ingredient"}
                </Text>
                <Text style={styles.ingredientAmount}>
                  {ingredient.scaledAmount.toFixed(0)}
                </Text>
              </SummaryItem>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  quantityInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    padding: 0,
    ...(Platform.OS === 'web' ? {
      outlineColor: Colors.light.primary,
      caretColor: Colors.light.primary,
    } : {}),
  },
  summaryContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  summaryList: {
    maxHeight: 150,
  },
  summaryContent: {
    paddingRight: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    ...(Platform.OS === 'web' ? {
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: Colors.light.background,
      }
    } : {}),
  },
  ingredientName: {
    fontSize: 16,
    color: Colors.light.text,
  },
  ingredientAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});