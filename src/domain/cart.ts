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

type ParsedAmount = { quantity: number; unit: string };

const singularUnits: Record<string, string> = { cans: "can", cups: "cup", slices: "slice", stalks: "stalk" };

function parseAmount(amount: string): ParsedAmount | null {
  const match = amount.match(/^(\d+(?:\.\d+)?|\d+\/\d+)(?:\s+(.+))?$/);
  if (!match) return null;
  const quantity = match[1].includes("/")
    ? Number(match[1].split("/")[0]) / Number(match[1].split("/")[1])
    : Number(match[1]);
  const rawUnit = match[2] ?? "";
  return { quantity, unit: singularUnits[rawUnit] ?? rawUnit };
}

function displayAmount(quantity: number, unit: string) {
  const rounded = unit === "g" || unit === "ml" ? Math.round(quantity) : Math.round(quantity * 100) / 100;
  const pluralUnit = rounded > 1 && ["can", "cup", "slice", "stalk"].includes(unit) ? `${unit}s` : unit;
  return `${rounded}${pluralUnit ? ` ${pluralUnit}` : ""}`;
}

export function scaleAmount(amount: string, servings: number) {
  const parsed = parseAmount(amount);
  return parsed ? displayAmount(parsed.quantity * servings / 4, parsed.unit) : amount;
}

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
  const lines = new Map<string, GroceryLine & { quantity?: number; unit?: string; count: number }>();

  cart.forEach((item) => {
    const recipe = catalog.find((candidate) => candidate.id === item.recipeId);
    if (!recipe) return;

    recipe.ingredients.forEach((ingredient) => {
      const parsed = parseAmount(ingredient.amount);
      const scaledQuantity = parsed ? parsed.quantity * item.servings / 4 : undefined;
      const key = `${ingredient.id}:${parsed?.unit ?? ingredient.amount}`;
      const calories = Math.round(ingredient.calories * item.servings / 4);
      const existing = lines.get(key);
      if (existing) {
        existing.count += 1;
        existing.calories += calories;
        if (!existing.sources.includes(recipe.title)) existing.sources.push(recipe.title);
        if (existing.quantity !== undefined && scaledQuantity !== undefined && existing.unit !== undefined) {
          existing.quantity += scaledQuantity;
          existing.amount = displayAmount(existing.quantity, existing.unit);
        } else {
          existing.amount = `${existing.count} × ${ingredient.amount}`;
        }
        return;
      }

      lines.set(key, {
        key,
        ingredientId: ingredient.id,
        name: ingredient.name,
        amount: parsed && scaledQuantity !== undefined ? displayAmount(scaledQuantity, parsed.unit) : ingredient.amount,
        category: ingredient.category,
        calories,
        sources: [recipe.title],
        quantity: scaledQuantity,
        unit: parsed?.unit,
        count: 1,
      });
    });
  });

  return Array.from(lines.values()).map(({ count: _count, quantity: _quantity, unit: _unit, ...line }) => line);
}
