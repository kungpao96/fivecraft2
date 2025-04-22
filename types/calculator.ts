export type CalculationItem = {
  id: string;
  label: string; // Ingredient name
  value: string; // Quantity needed
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
};

export type Calculation = {
  id: string;
  name: string; // Recipe name
  items: CalculationItem[];
  finalQuantity: number; // How many of the final product to craft
  total: number;
  date: string;
  category?: string;
};

export type CalculatorSettings = {
  decimalPlaces: number;
  showOperationLabels: boolean;
  defaultOperation: 'add' | 'subtract' | 'multiply' | 'divide';
};