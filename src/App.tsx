import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CookPage } from "./pages/CookPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { GroceryPage } from "./pages/GroceryPage";
import { RecipePage } from "./pages/RecipePage";
import type { CartItem } from "./types";

export default function App() {
  const [theme, setTheme] = useState<"bright" | "dark">(() => {
    const savedTheme = localStorage.getItem("grocery-theme");
    if (savedTheme === "bright" || savedTheme === "dark") return savedTheme;
    return "dark";
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const cartIds = useMemo(() => cart.map((item) => item.recipeId), [cart]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("grocery-theme", theme);
  }, [theme]);

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

  return (
    <Routes>
      <Route element={<AppShell cartCount={cart.length} theme={theme} onThemeChange={() => setTheme((current) => current === "bright" ? "dark" : "bright")} />}>
        <Route index element={<DiscoverPage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="recipes/:recipeId" element={<RecipePage cartIds={cartIds} onAdd={addRecipe} />} />
        <Route path="groceries" element={<GroceryPage cart={cart} checked={checked} onCheck={toggleChecked} onServings={changeServings} onRemove={removeRecipe} />} />
      </Route>
      <Route path="cook/:recipeId" element={<CookPage />} />
    </Routes>
  );
}
