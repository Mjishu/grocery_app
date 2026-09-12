import { ArrowLeft, Check, Copy, Minus, Plus, Printer, Send, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RecipeArt } from "../components/RecipeArt";
import { recipes } from "../data/recipes";
import { buildGroceryList, getCartCalories, getMealCalories } from "../domain/cart";
import type { CartItem, Category } from "../types";

type Props = {
  cart: CartItem[];
  checked: string[];
  pantry: string[];
  onCheck: (itemId: string) => void;
  onServings: (recipeId: string, change: number) => void;
  onRemove: (recipeId: string) => void;
  onPantry: (ingredientId: string) => void;
  onRestorePantry: () => void;
  onArchive: () => void;
};

const categories: Category[] = ["Produce", "Protein", "Dairy", "Pantry"];

export function GroceryPage({ cart, checked, pantry, onCheck, onServings, onRemove, onPantry, onRestorePantry, onArchive }: Props) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const selectedRecipes = cart.map((item) => ({ ...item, recipe: recipes.find((recipe) => recipe.id === item.recipeId)! }));
  const groceries = buildGroceryList(cart, recipes);
  const visibleGroceries = groceries.filter((item) => !pantry.includes(item.ingredientId) && !removed.includes(item.key));
  const hiddenCount = groceries.length - visibleGroceries.length;
  const visibleCheckedCount = visibleGroceries.filter((item) => checked.includes(item.key)).length;
  const cartCalories = getCartCalories(cart, recipes);

  const formatShareList = () => categories.map((category) => {
    const items = visibleGroceries.filter((item) => item.category === category);
    if (!items.length) return "";
    return `${category}\n${items.map((item) => `- ${item.name} — ${item.amount}`).join("\n")}`;
  }).filter(Boolean).join("\n\n");

  const copyList = async () => {
    await navigator.clipboard.writeText(formatShareList());
    setShareStatus("List copied");
  };

  const shareList = async () => {
    if (!navigator.share) return;
    await navigator.share({ title: "Grocery list", text: formatShareList() });
  };

  return (
    <main className="wrap grocery-page">
      <Link className="plain-back" to="/"><ArrowLeft /> Back to recipes</Link>
      <header className="grocery-heading"><div><p className="eyebrow">Your week, sorted</p><h1>Grocery plan</h1><p>{cart.length} recipes · {visibleGroceries.length} items · <strong>{cartCalories.toLocaleString()} estimated calories</strong></p>{hiddenCount > 0 && <button className="restore-pantry" onClick={() => { setRemoved([]); onRestorePantry(); }}><span>{hiddenCount} pantry {hiddenCount === 1 ? "item" : "items"} hidden</span><b>Restore</b></button>}</div><div className="share-wrap"><button onClick={() => setShareOpen((current) => !current)}><Share2 /> Share list</button>{shareOpen && <div className="share-menu"><button onClick={copyList}><Copy /> Copy grocery list</button><button onClick={() => window.print()}><Printer /> Print list</button>{"share" in navigator && <button onClick={shareList}><Send /> Share with device</button>}{shareStatus && <span role="status">{shareStatus}</span>}<small>Private synchronized links require the future backend.</small></div>}</div></header>

      {cart.length === 0 ? <section className="empty-state"><span>🧺</span><h2>Your basket is ready for ideas.</h2><p>Add a recipe and its ingredients will organize themselves here.</p><Link className="button primary" to="/">Find something good</Link></section> :
        <div className="grocery-layout">
          <section className="checklist">
            <div className="list-progress"><strong>{visibleCheckedCount} of {visibleGroceries.length} checked</strong><span><i style={{ width: `${visibleGroceries.length ? visibleCheckedCount / visibleGroceries.length * 100 : 0}%` }} /></span></div>
            {categories.map((category) => {
              const items = visibleGroceries.filter((item) => item.category === category);
              if (!items.length) return null;
              return <section className="grocery-group" key={category}><h2>{category}<span>{items.length}</span></h2>{items.map((item) => <div className="grocery-row" key={item.key}><button className={`grocery-check ${checked.includes(item.key) ? "checked" : ""}`} onClick={() => onCheck(item.key)} aria-label={`Mark ${item.name} purchased`}><i>{checked.includes(item.key) && <Check />}</i><span><strong>{item.name}</strong><small>For {item.sources.join(", ")}</small></span><b>{item.amount}<small>{item.calories.toLocaleString()} cal</small></b></button><div className="pantry-actions"><button onClick={() => setRemoved((current) => [...current, item.key])} aria-label={`Remove ${item.name} this time`}>This time</button><button onClick={() => onPantry(item.ingredientId)} aria-label={`I usually have ${item.name}`}>Usually have</button></div></div>)}</section>;
            })}
          </section>
          <aside className="plan-card"><div className="cart-calorie-total"><span>Cart total</span><strong>{cartCalories.toLocaleString()} cal</strong></div><p className="eyebrow">In your plan</p>{selectedRecipes.map(({ recipe, servings }) => <article key={recipe.id}><RecipeArt recipe={recipe} compact /><div><strong>{recipe.title}</strong><small>{servings} servings · {getMealCalories(recipe, servings).toLocaleString()} cal</small><span><button onClick={() => onServings(recipe.id, -1)}><Minus /></button><button onClick={() => onServings(recipe.id, 1)}><Plus /></button><button className="remove" onClick={() => onRemove(recipe.id)}><Trash2 /></button></span></div></article>)}<button className="retailer-button">Send to grocery partner</button><small>Product review and checkout happen with the retailer.</small><button className="archive-plan" onClick={() => setConfirmArchive(true)}><Trash2 /> Archive and clear plan</button></aside>
        </div>}
      {confirmArchive && <div className="modal-backdrop"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-title"><h2 id="archive-title">Clear this grocery plan?</h2><p>We’ll keep a local archive, then start you with an empty plan.</p><div><button onClick={() => setConfirmArchive(false)}>Keep plan</button><button className="danger" onClick={() => { onArchive(); setConfirmArchive(false); }}>Archive and clear</button></div></section></div>}
    </main>
  );
}
