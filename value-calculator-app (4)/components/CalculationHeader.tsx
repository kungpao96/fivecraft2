import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { Save, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCalculatorStore } from '@/store/calculator-store';
import * as Haptics from 'expo-haptics';

export default function CalculationHeader() {
  const { currentCalculation, setRecipeName, saveRecipe, clearItems } = useCalculatorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentCalculation.name);

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    saveRecipe(name);
  };

  const handleClear = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    clearItems();
  };

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    setRecipeName(name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={handleNameChange}
            onBlur={handleNameBlur}
            autoFocus
            placeholder="Recipe name"
            accessibilityLabel="Recipe name"
            accessibilityHint="Enter a name for your recipe"
          />
        ) : (
          <Pressable 
            onPress={() => setIsEditing(true)}
            accessibilityLabel="Edit recipe name"
            accessibilityRole="button"
            accessibilityHint="Double tap to edit recipe name"
          >
            <Text style={styles.title}>{currentCalculation.name}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton} 
          onPress={handleClear}
          accessibilityLabel="Clear recipe"
          accessibilityRole="button"
        >
          <Trash2 size={20} color={Colors.light.error} />
        </Pressable>
        <Pressable 
          id="save-recipe-button"
          style={[styles.actionButton, styles.saveButton]} 
          onPress={handleSave}
          accessibilityLabel="Save recipe"
          accessibilityRole="button"
        >
          <Save size={20} color={Colors.light.card} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      textDecoration: 'underline dotted',
      textDecorationColor: Colors.light.subtext,
    } : {}),
  },
  nameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? {
      outlineColor: Colors.light.primary,
    } : {}),
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
});