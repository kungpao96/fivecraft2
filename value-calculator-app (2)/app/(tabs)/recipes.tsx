import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useCalculatorStore } from '@/store/calculator-store';
import RecipeItem from '@/components/RecipeItem';
import EmptyState from '@/components/EmptyState';
import BrandHeader from '@/components/BrandHeader';
import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const { recipes, loadRecipe } = useCalculatorStore();
  const router = useRouter();

  const handleItemPress = (id: string) => {
    loadRecipe(id);
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BrandHeader />
      
      {recipes.length === 0 ? (
        <EmptyState
          type="recipes"
          title="No saved recipes"
          message="Your saved crafting recipes will appear here"
        />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeItem
              recipe={item}
              onPress={() => handleItemPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    padding: 16,
  },
});