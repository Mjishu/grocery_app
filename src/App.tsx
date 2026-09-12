import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DietaryGate } from "./components/DietaryGate";
import { CookPage } from "./pages/CookPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { GroceryPage } from "./pages/GroceryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipePage } from "./pages/RecipePage";
import { ReportPage } from "./pages/ReportPage";
import { SignInPage } from "./pages/SignInPage";
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
    if (stored?.dietaryAcknowledged === true && Array.isArray(stored.allergens)) return {
      dietaryAcknowledged: true,
      allergens: stored.allergens,
      servings: Number(stored.servings) || 4,
      equipment: Array.isArray(stored.equipment) ? stored.equipment : [],
      maxTime: stored.maxTime ?? "30",
      budget: stored.budget ?? "flexible",
      cuisines: Array.isArray(stored.cuisines) ? stored.cuisines : [],
      dislikedFoods: stored.dislikedFoods ?? "",
      inferredPreferences: Array.isArray(stored.inferredPreferences) ? stored.inferredPreferences : [],
    };
  } catch {
    // A malformed local demo profile is treated as incomplete.
  }
  return { dietaryAcknowledged: false, allergens: [], servings: 4, equipment: [], maxTime: "30", budget: "flexible", cuisines: [], dislikedFoods: "", inferredPreferences: [] };
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
    setProfile((current) => ({ ...current, dietaryAcknowledged: true, allergens }));
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

  const exportLocalData = () => {
    const payload = JSON.stringify({ profile, cart, pantry, checked }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "good-food-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteLocalData = () => {
    if (!window.confirm("Delete the local demo profile, grocery plan, pantry, and preferences?")) return;
    localStorage.clear();
    setCart([]);
    setChecked([]);
    setPantry([]);
    setProfile(readStoredProfile());
  };

  return (<>
    <Routes>
      <Route element={<AppShell cartCount={cart.length} theme={theme} onThemeChange={() => setTheme((current) => current === "bright" ? "dark" : "bright")} />}>
        <Route index element={<DiscoverPage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="recipes/:recipeId" element={<RecipePage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="groceries" element={<GroceryPage cart={cart} checked={checked} pantry={pantry} onCheck={toggleChecked} onServings={changeServings} onRemove={removeRecipe} onPantry={addPantryItem} onRestorePantry={() => setPantry([])} />} />
        <Route path="profile" element={<ProfilePage profile={profile} onSave={setProfile} onExport={exportLocalData} onDelete={deleteLocalData} />} />
        <Route path="report/:recipeId" element={<ReportPage />} />
        <Route path="signin" element={<SignInPage />} />
      </Route>
      <Route path="cook/:recipeId" element={<CookPage />} />
    </Routes>
    {pendingRecipeId && <DietaryGate onCancel={() => setPendingRecipeId(null)} onConfirm={confirmDietaryProfile} />}
  </>);
}
