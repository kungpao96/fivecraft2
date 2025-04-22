import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated, Text, Platform } from 'react-native';
import { PlusCircle, MinusCircle, XCircle, DivideCircle, Trash2 } from 'lucide-react-native';
import { CalculationItem } from '@/types/calculator';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { useCalculatorStore } from '@/store/calculator-store';
import WebOptimizedView from '@/components/WebOptimizedView';

type OperationIcon = {
  [key in CalculationItem['operation']]: React.ReactNode;
};

interface CalculatorInputProps {
  item: CalculationItem;
  onValueChange: (value: string) => void;
  onLabelChange: (label: string) => void;
  onOperationChange: (operation: CalculationItem['operation']) => void;
  onRemove: () => void;
  isFirst?: boolean;
}

export default function CalculatorInput({
  item,
  onValueChange,
  onLabelChange,
  onOperationChange,
  onRemove,
  isFirst = false,
}: CalculatorInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { currentCalculation } = useCalculatorStore();
  const { finalQuantity } = currentCalculation;
  const labelInputRef = useRef<TextInput>(null);
  const valueInputRef = useRef<TextInput>(null);
  
  const operationIcons: OperationIcon = {
    add: <PlusCircle size={24} color={Colors.light.primary} />,
    subtract: <MinusCircle size={24} color={Colors.light.primary} />,
    multiply: <XCircle size={24} color={Colors.light.primary} />,
    divide: <DivideCircle size={24} color={Colors.light.primary} />,
  };

  const operationLabels: Record<CalculationItem['operation'], string> = {
    add: 'Add',
    subtract: 'Subtract',
    multiply: 'Multiply',
    divide: 'Divide',
  };

  // Web-specific keyboard handling for improved accessibility
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isFocused) return;
        
        // Delete item when Delete or Backspace is pressed with no text
        if ((e.key === 'Delete' || e.key === 'Backspace') && 
            item.label === '' && 
            item.value === '' && 
            document.activeElement === document.body) {
          onRemove();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFocused, item.label, item.value, onRemove]);

  const handleFocus = () => {
    setIsFocused(true);
    if (Platform.OS !== 'web') {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (Platform.OS !== 'web') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleOperationChange = (operation: CalculationItem['operation']) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onOperationChange(operation);
  };

  const handleRemove = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    onRemove();
  };

  // Use conditional rendering for animations on web
  const Container = Platform.OS === 'web' ? WebOptimizedView : Animated.View;
  const containerProps = Platform.OS === 'web' 
    ? { style: [styles.container, isFocused && styles.focused] }
    : { 
        style: [
          styles.container, 
          isFocused && styles.focused,
          { transform: [{ scale: scaleAnim }] }
        ] 
      };

  return (
    <Container {...containerProps}>
      {!isFirst && (
        <View style={styles.operationSelector}>
          <Pressable 
            style={[styles.operationButton, item.operation === 'add' && styles.selectedOperation]} 
            onPress={() => handleOperationChange('add')}
            accessibilityLabel="Add operation"
            accessibilityRole="button"
          >
            <PlusCircle size={24} color={item.operation === 'add' ? Colors.light.card : Colors.light.primary} />
          </Pressable>
          <Pressable 
            style={[styles.operationButton, item.operation === 'subtract' && styles.selectedOperation]} 
            onPress={() => handleOperationChange('subtract')}
            accessibilityLabel="Subtract operation"
            accessibilityRole="button"
          >
            <MinusCircle size={24} color={item.operation === 'subtract' ? Colors.light.card : Colors.light.primary} />
          </Pressable>
          <Pressable 
            style={[styles.operationButton, item.operation === 'multiply' && styles.selectedOperation]} 
            onPress={() => handleOperationChange('multiply')}
            accessibilityLabel="Multiply operation"
            accessibilityRole="button"
          >
            <XCircle size={24} color={item.operation === 'multiply' ? Colors.light.card : Colors.light.primary} />
          </Pressable>
          <Pressable 
            style={[styles.operationButton, item.operation === 'divide' && styles.selectedOperation]} 
            onPress={() => handleOperationChange('divide')}
            accessibilityLabel="Divide operation"
            accessibilityRole="button"
          >
            <DivideCircle size={24} color={item.operation === 'divide' ? Colors.light.card : Colors.light.primary} />
          </Pressable>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        {!isFirst && (
          <View style={styles.operationLabel}>
            <Text style={styles.operationLabelText}>{operationLabels[item.operation]}</Text>
          </View>
        )}
        
        <View style={styles.inputRow}>
          <View style={styles.labelInputContainer}>
            <Text style={styles.inputLabel}>Ingredient</Text>
            <TextInput
              ref={labelInputRef}
              style={styles.labelInput}
              value={item.label}
              onChangeText={onLabelChange}
              placeholder="Ingredient name"
              placeholderTextColor={Colors.light.subtext}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessibilityLabel="Ingredient name"
              accessibilityHint="Enter the name of the ingredient"
            />
          </View>
          
          <View style={styles.valueInputContainer}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              ref={valueInputRef}
              style={styles.valueInput}
              value={item.value}
              onChangeText={onValueChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.light.subtext}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessibilityLabel="Ingredient quantity"
              accessibilityHint="Enter the quantity needed"
            />
          </View>
        </View>
        
        {!isFirst && (
          <Pressable 
            style={styles.removeButton} 
            onPress={handleRemove}
            accessibilityLabel="Remove ingredient"
            accessibilityRole="button"
          >
            <Trash2 size={20} color={Colors.light.error} />
          </Pressable>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      transition: 'all 0.2s ease',
    } : {}),
  },
  focused: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      transform: 'scale(1.02)',
    } : {}),
  },
  operationSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  operationButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    } : {}),
  },
  selectedOperation: {
    backgroundColor: Colors.light.primary,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  operationLabel: {
    marginBottom: 8,
  },
  operationLabelText: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelInputContainer: {
    flex: 2,
    marginRight: 8,
  },
  valueInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  labelInput: {
    fontSize: 16,
    color: Colors.light.text,
    padding: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? {
      outlineColor: Colors.light.primary,
    } : {}),
  },
  valueInput: {
    fontSize: 16,
    color: Colors.light.text,
    padding: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? {
      outlineColor: Colors.light.primary,
    } : {}),
  },
  removeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 8,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
  },
});