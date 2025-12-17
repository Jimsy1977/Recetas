export interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
  section: 'Base' | 'Salsa' | 'Guarnición' | 'Acompañamiento';
  substitute?: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  duration?: string;
  temperature?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface RecipeData {
  identification: {
    name: string;
    cuisine: string;
    category: 'Entrada' | 'Plato Fuerte' | 'Postre' | 'Bebida' | 'Snack';
    cultureContext: string;
  };
  visualAnalysis: {
    visibleIngredients: string[];
    cookingMethod: string;
    presentation: string;
  };
  ingredients: Ingredient[];
  preparation: Step[];
  timings: {
    prepTime: string;
    cookTime: string;
    totalTime: string;
  };
  difficulty: {
    level: 'Principiante' | 'Intermedio' | 'Avanzado';
    score: number; // 1-10
    equipment: string[];
  };
  nutrition: Nutrition;
  cost: {
    totalEstimated: string;
    perServing: string;
  };
  variations: {
    vegetarian?: string;
    vegan?: string;
    lowCarb?: string;
  };
  chefTips: string[];
  error?: 'NOT_FOOD' | 'BLURRY' | null;
}