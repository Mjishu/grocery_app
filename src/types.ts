export type Category = "Produce" | "Protein" | "Dairy" | "Pantry";

export type Ingredient = {
  id: string;
  name: string;
  amount: string;
  metricAmount: string;
  category: Category;
  calories: number;
};

export type Recipe = {
  id: string;
  title: string;
  tagline: string;
  image: string;
  imagePosition?: string;
  time: number;
  cost: "$" | "$$" | "$$$";
  difficulty: "Very easy" | "Easy";
  tags: string[];
  allergens: string[];
  ingredients: Ingredient[];
  steps: string[];
  safety?: string;
  nutrition: { protein: number; carbohydrates: number; fat: number };
};

export type CartItem = { recipeId: string; servings: number };

export type UserProfile = {
  dietaryAcknowledged: boolean;
  allergens: string[];
  servings: number;
  equipment: string[];
  maxTime: string;
  budget: string;
  cuisines: string[];
  dislikedFoods: string;
  inferredPreferences: string[];
};
