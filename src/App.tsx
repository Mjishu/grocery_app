import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DietaryGate } from "./components/DietaryGate";
import { CookPage } from "./pages/CookPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { GroceryPage } from "./pages/GroceryPage";
import { RecipePage } from "./pages/RecipePage";
import type { CartItem, UserProfile } from "./types";

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

function readStoredProfile(): UserProfile {
  try {
    const stored = JSON.parse(localStorage.getItem("grocery-profile") ?? "null");
    if (stored?.dietaryAcknowledged === true && Array.isArray(stored.allergens)) return stored;
  } catch {
    // A malformed local demo profile is treated as incomplete.
  }
  return { dietaryAcknowledged: false, allergens: [] };
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
  const [profile, setProfile] = useState<UserProfile>(readStoredProfile);
  const [pendingRecipeId, setPendingRecipeId] = useState<string | null>(null);
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

  useEffect(() => {
    localStorage.setItem("grocery-profile", JSON.stringify(profile));
  }, [profile]);

  const addRecipe = (recipeId: string) => {
    if (!profile.dietaryAcknowledged) {
      setPendingRecipeId(recipeId);
      return;
    }
    setCart((current) => current.some((item) => item.recipeId === recipeId) ? current : [...current, { recipeId, servings: 4 }]);
  };

  const confirmDietaryProfile = (allergens: string[]) => {
    setProfile({ dietaryAcknowledged: true, allergens });
    if (pendingRecipeId) setCart((current) => current.some((item) => item.recipeId === pendingRecipeId) ? current : [...current, { recipeId: pendingRecipeId, servings: 4 }]);
    setPendingRecipeId(null);
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

  return (<>
    <Routes>
      <Route element={<AppShell cartCount={cart.length} theme={theme} onThemeChange={() => setTheme((current) => current === "bright" ? "dark" : "bright")} />}>
        <Route index element={<DiscoverPage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="recipes/:recipeId" element={<RecipePage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="groceries" element={<GroceryPage cart={cart} checked={checked} pantry={pantry} onCheck={toggleChecked} onServings={changeServings} onRemove={removeRecipe} onPantry={addPantryItem} onRestorePantry={() => setPantry([])} />} />
      </Route>
      <Route path="cook/:recipeId" element={<CookPage />} />
    </Routes>
    {pendingRecipeId && <DietaryGate onCancel={() => setPendingRecipeId(null)} onConfirm={confirmDietaryProfile} />}
  </>);
}
