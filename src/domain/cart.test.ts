import { describe, expect, it } from "vitest";
import { recipes } from "../data/recipes";
import type { CartItem, Recipe } from "../types";
import { buildGroceryList, getCartCalories, getMealCalories } from "./cart";

describe("cart calculations", () => {
  it("scales recipe and cart calories from the four-serving source amounts", () => {
    const tacoBowls = recipes.find((recipe) => recipe.id === "taco-bowls")!;
    const cart: CartItem[] = [
      { recipeId: "taco-bowls", servings: 2 },
      { recipeId: "breakfast-pitas", servings: 4 },
    ];

    expect(getMealCalories(tacoBowls, 2)).toBe(1027);
    expect(getCartCalories(cart, recipes)).toBe(1822);
  });

  it("combines only ingredients with the same identity and displayed unit", () => {
    const duplicateRecipe: Recipe = {
      ...recipes[0],
      id: "second-taco",
      title: "Second taco dinner",
      ingredients: [recipes[0].ingredients[2]],
    };
    const cart: CartItem[] = [
      { recipeId: "taco-bowls", servings: 4 },
      { recipeId: "second-taco", servings: 4 },
    ];

    const lines = buildGroceryList(cart, [...recipes, duplicateRecipe]);
    const beans = lines.find((line) => line.ingredientId === "beans")!;

    expect(beans.amount).toBe("2 × 1 can");
    expect(beans.calories).toBe(700);
    expect(beans.sources).toEqual(["Smoky taco bowls", "Second taco dinner"]);
  });
});
