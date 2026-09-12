import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CookPage } from "./pages/CookPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { GroceryPage } from "./pages/GroceryPage";
import { RecipePage } from "./pages/RecipePage";
import type { CartItem } from "./types";

function readStoredCart(): CartItem[] {
  try {
    const stored = JSON.parse(localStorage.getItem("grocery-cart") ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function readStoredChecks(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem("grocery-checked") ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function readStoredPantry(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem("grocery-pantry") ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [theme, setTheme] = useState<"bright" | "dark">(() => {
    const savedTheme = localStorage.getItem("grocery-theme");
    if (savedTheme === "bright" || savedTheme === "dark") return savedTheme;
    return "dark";
  });
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [checked, setChecked] = useState<string[]>(readStoredChecks);
  const [pantry, setPantry] = useState<string[]>(readStoredPantry);
  const cartIds = useMemo(() => cart.map((item) => item.recipeId), [cart]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("grocery-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("grocery-checked", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem("grocery-pantry", JSON.stringify(pantry));
  }, [pantry]);

  const addRecipe = (recipeId: string) => {
    setCart((current) => current.some((item) => item.recipeId === recipeId) ? current : [...current, { recipeId, servings: 4 }]);
  };

  const toggleChecked = (itemId: string) => {
    setChecked((current) => current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]);
  };

  const changeServings = (recipeId: string, change: number) => {
    setCart((current) => current.map((item) => item.recipeId === recipeId ? { ...item, servings: Math.max(1, item.servings + change) } : item));
  };

  const removeRecipe = (recipeId: string) => {
    setCart((current) => current.filter((item) => item.recipeId !== recipeId));
  };

  const addPantryItem = (ingredientId: string) => {
    setPantry((current) => current.includes(ingredientId) ? current : [...current, ingredientId]);
  };

  return (
    <Routes>
      <Route element={<AppShell cartCount={cart.length} theme={theme} onThemeChange={() => setTheme((current) => current === "bright" ? "dark" : "bright")} />}>
        <Route index element={<DiscoverPage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="recipes/:recipeId" element={<RecipePage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="groceries" element={<GroceryPage cart={cart} checked={checked} pantry={pantry} onCheck={toggleChecked} onServings={changeServings} onRemove={removeRecipe} onPantry={addPantryItem} onRestorePantry={() => setPantry([])} />} />
      </Route>
      <Route path="cook/:recipeId" element={<CookPage />} />
    </Routes>
  );
}
