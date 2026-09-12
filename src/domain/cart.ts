import type { CartItem, Category, Recipe } from "../types";

export type GroceryLine = {
  key: string;
  ingredientId: string;
  name: string;
  amount: string;
  category: Category;
  calories: number;
  sources: string[];
};

export function getMealCalories(recipe: Recipe, servings: number) {
  const baseCalories = recipe.ingredients.reduce((total, ingredient) => total + ingredient.calories, 0);
  return Math.round(baseCalories * servings / 4);
}

export function getCartCalories(cart: CartItem[], catalog: Recipe[]) {
  return cart.reduce((total, item) => {
    const recipe = catalog.find((candidate) => candidate.id === item.recipeId);
    return recipe ? total + getMealCalories(recipe, item.servings) : total;
  }, 0);
}

export function buildGroceryList(cart: CartItem[], catalog: Recipe[]) {
  const lines = new Map<string, GroceryLine & { count: number }>();

  cart.forEach((item) => {
    const recipe = catalog.find((candidate) => candidate.id === item.recipeId);
    if (!recipe) return;

    recipe.ingredients.forEach((ingredient) => {
      const key = `${ingredient.id}:${ingredient.amount}`;
      const calories = Math.round(ingredient.calories * item.servings / 4);
      const existing = lines.get(key);
      if (existing) {
        existing.count += 1;
        existing.calories += calories;
        if (!existing.sources.includes(recipe.title)) existing.sources.push(recipe.title);
        existing.amount = `${existing.count} × ${ingredient.amount}`;
        return;
      }

      lines.set(key, {
        key,
        ingredientId: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        category: ingredient.category,
        calories,
        sources: [recipe.title],
        count: 1,
      });
    });
  });

  return Array.from(lines.values()).map(({ count: _count, ...line }) => line);
}
