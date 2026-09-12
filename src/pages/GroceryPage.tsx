import { ArrowLeft, Check, Minus, Plus, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { RecipeArt } from "../components/RecipeArt";
import { recipes } from "../data/recipes";
import type { CartItem, Category } from "../types";

type Props = {
  cart: CartItem[];
  checked: string[];
  onCheck: (itemId: string) => void;
  onServings: (recipeId: string, change: number) => void;
  onRemove: (recipeId: string) => void;
};

const categories: Category[] = ["Produce", "Protein", "Dairy", "Pantry"];

export function GroceryPage({ cart, checked, onCheck, onServings, onRemove }: Props) {
  const selectedRecipes = cart.map((item) => ({ ...item, recipe: recipes.find((recipe) => recipe.id === item.recipeId)! }));
  const groceries = selectedRecipes.flatMap(({ recipe, servings }) => recipe.ingredients.map((ingredient) => ({ ...ingredient, calories: Math.round(ingredient.calories * servings / 4), key: `${recipe.id}-${ingredient.id}`, recipe: recipe.title })));
  const cartCalories = groceries.reduce((total, ingredient) => total + ingredient.calories, 0);

  return (
    <main className="wrap grocery-page">
      <Link className="plain-back" to="/"><ArrowLeft /> Back to recipes</Link>
      <header className="grocery-heading"><div><p className="eyebrow">Your week, sorted</p><h1>Grocery plan</h1><p>{cart.length} recipes · {groceries.length} items · <strong>{cartCalories.toLocaleString()} estimated calories</strong></p></div><button><Share2 /> Share list</button></header>

      {cart.length === 0 ? <section className="empty-state"><span>🧺</span><h2>Your basket is ready for ideas.</h2><p>Add a recipe and its ingredients will organize themselves here.</p><Link className="button primary" to="/">Find something good</Link></section> :
        <div className="grocery-layout">
          <section className="checklist">
            <div className="list-progress"><strong>{checked.length} of {groceries.length} checked</strong><span><i style={{ width: `${groceries.length ? checked.length / groceries.length * 100 : 0}%` }} /></span></div>
            {categories.map((category) => {
              const items = groceries.filter((item) => item.category === category);
              if (!items.length) return null;
              return <section className="grocery-group" key={category}><h2>{category}<span>{items.length}</span></h2>{items.map((item) => <button className={checked.includes(item.key) ? "checked" : ""} onClick={() => onCheck(item.key)} key={item.key}><i>{checked.includes(item.key) && <Check />}</i><span><strong>{item.name}</strong><small>For {item.recipe}</small></span><b>{item.amount}<small>{item.calories.toLocaleString()} cal</small></b></button>)}</section>;
            })}
          </section>
          <aside className="plan-card"><div className="cart-calorie-total"><span>Cart total</span><strong>{cartCalories.toLocaleString()} cal</strong></div><p className="eyebrow">In your plan</p>{selectedRecipes.map(({ recipe, servings }) => { const mealCalories = Math.round(recipe.ingredients.reduce((total, ingredient) => total + ingredient.calories, 0) * servings / 4); return <article key={recipe.id}><RecipeArt recipe={recipe} compact /><div><strong>{recipe.title}</strong><small>{servings} servings · {mealCalories.toLocaleString()} cal</small><span><button onClick={() => onServings(recipe.id, -1)}><Minus /></button><button onClick={() => onServings(recipe.id, 1)}><Plus /></button><button className="remove" onClick={() => onRemove(recipe.id)}><Trash2 /></button></span></div></article>; })}<button className="retailer-button">Send to grocery partner</button><small>Product review and checkout happen with the retailer.</small></aside>
        </div>}
    </main>
  );
}
