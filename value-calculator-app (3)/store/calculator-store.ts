import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calculation, CalculationItem, CalculatorSettings } from '@/types/calculator';

interface CalculatorState {
  currentCalculation: {
    id: string;
    name: string;
    items: CalculationItem[];
    finalQuantity: number;
    isTemplate: boolean;
  };
  recipes: Calculation[];
  settings: CalculatorSettings;
  addItem: (item: Omit<CalculationItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<CalculationItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  saveRecipe: (name?: string) => void;
  setRecipeName: (name: string) => void;
  removeRecipe: (id: string) => void;
  loadRecipe: (id: string) => void;
  startNewRecipe: () => void;
  updateSettings: (settings: Partial<CalculatorSettings>) => void;
  setFinalQuantity: (quantity: number) => void;
  calculateTotal: () => number;
  getIngredientSummary: () => Array<{id: string, label: string, baseAmount: number, scaledAmount: number}>;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      currentCalculation: {
        id: Date.now().toString(),
        name: "New Recipe",
        items: [],
        finalQuantity: 1,
        isTemplate: true,
      },
      recipes: [],
      settings: {
        decimalPlaces: 0, // Default to whole numbers for crafting
        showOperationLabels: true,
        defaultOperation: 'add',
      },
      addItem: (item) => {
        const newItem = {
          ...item,
          id: Date.now().toString(),
        };
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            items: [...state.currentCalculation.items, newItem],
          },
        }));
      },
      updateItem: (id, updates) => {
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            items: state.currentCalculation.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          },
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            items: state.currentCalculation.items.filter((item) => item.id !== id),
          },
        }));
      },
      clearItems: () => {
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            items: [],
          },
        }));
      },
      startNewRecipe: () => {
        // Create a completely new recipe with a new ID
        set({
          currentCalculation: {
            id: Date.now().toString(),
            name: "New Recipe",
            items: [], // Start with empty items
            finalQuantity: 1,
            isTemplate: true,
          },
        });
      },
      saveRecipe: (name) => {
        const { currentCalculation, recipes } = get();
        
        // Don't save empty recipes
        if (currentCalculation.items.length === 0) {
          return;
        }
        
        // Save the recipe as a template (without specific quantity)
        const recipe: Calculation = {
          id: currentCalculation.id,
          name: name || currentCalculation.name,
          items: [...currentCalculation.items],
          finalQuantity: 1, // Always save with quantity of 1 as a template
          total: get().calculateTotal() / currentCalculation.finalQuantity, // Save the base total for 1 unit
          date: new Date().toISOString(),
        };
        
        // Check if recipe with this ID already exists
        const existingIndex = recipes.findIndex(rec => rec.id === recipe.id);
        
        set((state) => ({
          recipes: existingIndex >= 0
            ? [
                ...state.recipes.slice(0, existingIndex),
                recipe,
                ...state.recipes.slice(existingIndex + 1)
              ]
            : [recipe, ...state.recipes],
          currentCalculation: {
            id: Date.now().toString(),
            name: "New Recipe",
            items: [],
            finalQuantity: 1,
            isTemplate: true,
          },
        }));
      },
      setRecipeName: (name) => {
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            name,
          },
        }));
      },
      removeRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      loadRecipe: (id) => {
        const { recipes } = get();
        const recipe = recipes.find((rec) => rec.id === id);
        
        if (recipe) {
          set({
            currentCalculation: {
              id: Date.now().toString(), // Generate new ID to avoid overwriting
              name: recipe.name,
              items: [...recipe.items],
              finalQuantity: 1, // Always start with quantity of 1
              isTemplate: false, // Mark as not a template since it's loaded from a saved recipe
            },
          });
        }
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },
      setFinalQuantity: (quantity) => {
        set((state) => ({
          currentCalculation: {
            ...state.currentCalculation,
            finalQuantity: quantity,
          },
        }));
      },
      calculateTotal: () => {
        const { items, finalQuantity } = get().currentCalculation;
        
        if (items.length === 0) return 0;
        
        let total = 0;
        
        // Process all items with their operations
        items.forEach((item, index) => {
          const value = parseFloat(item.value) || 0;
          
          // First item is always the base value
          if (index === 0) {
            total = value;
            return;
          }
          
          switch (item.operation) {
            case 'add':
              total += value;
              break;
            case 'subtract':
              total -= value;
              break;
            case 'multiply':
              total *= value;
              break;
            case 'divide':
              if (value !== 0) {
                total /= value;
              }
              break;
          }
        });
        
        // Scale by final quantity
        return total * finalQuantity;
      },
      getIngredientSummary: () => {
        const { items, finalQuantity } = get().currentCalculation;
        
        return items.map(item => {
          const baseAmount = parseFloat(item.value) || 0;
          const scaledAmount = baseAmount * finalQuantity;
          
          return {
            id: item.id,
            label: item.label || "Unnamed Ingredient",
            baseAmount,
            scaledAmount
          };
        });
      }
    }),
    {
      name: 'fivecraft-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);