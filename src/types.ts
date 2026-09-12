export type Category = "Produce" | "Protein" | "Dairy" | "Pantry";

export type Ingredient = {
  id: string;
  name: string;
  amount: string;
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
  ingredients: Ingredient[];
  steps: string[];
  safety?: string;
};

export type CartItem = { recipeId: string; servings: number };
