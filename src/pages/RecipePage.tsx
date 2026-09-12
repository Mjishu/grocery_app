import { ArrowLeft, Check, Clock3, CookingPot, Flag, Heart, Minus, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { RecipeArt } from "../components/RecipeArt";
import { recipes } from "../data/recipes";
import { getMealCalories } from "../domain/cart";
import { readStringList, toggleStringListItem } from "../domain/localStorage";

type Props = { cartIds: string[]; onAdd: (recipeId: string) => void };

export function RecipePage({ cartIds, onAdd }: Props) {
  const { recipeId } = useParams();
  const [servings, setServings] = useState(4);
  const [cooked, setCooked] = useState(false);
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(() => readStringList("grocery-saved-recipes").includes(recipeId ?? ""));
  const [units, setUnits] = useState<"us" | "metric">("us");
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return <Navigate to="/" replace />;
  const added = cartIds.includes(recipe.id);
  const baseCalories = recipe.ingredients.reduce((total, ingredient) => total + ingredient.calories, 0);
  const mealCalories = getMealCalories(recipe, servings);
  const caloriesPerServing = Math.round(baseCalories / 4);

  const rateRecipe = (value: number) => {
    const feedback = { recipeId: recipe.id, cooked: true, rating: value, recordedAt: new Date().toISOString() };
    localStorage.setItem("grocery-feedback", JSON.stringify(feedback));
    setCooked(true);
    setRating(value);
  };

  const toggleSaved = () => {
    const savedIds = toggleStringListItem("grocery-saved-recipes", recipe.id);
    setSaved(savedIds.includes(recipe.id));
  };

  return (
    <main className="recipe-page">
      <section className="recipe-hero">
        <RecipeArt recipe={recipe} />
        <Link className="floating-control back" to="/"><ArrowLeft /> Back</Link>
        <button className="floating-control favorite" aria-label={saved ? "Remove saved recipe" : "Save recipe"} onClick={toggleSaved}><Heart fill={saved ? "currentColor" : "none"} /></button>
      </section>
      <div className="wrap recipe-content">
        <div className="recipe-heading">
          <div><p className="eyebrow accent">Beginner approved</p><h1>{recipe.title}</h1><p>{recipe.tagline}</p></div>
          <span className="rating">★ 4.9 <small>32 cooks</small></span>
        </div>
        <div className="recipe-stats">
          <span><Clock3 /><strong>{recipe.time} min</strong><small>Total time</small></span>
          <span><Sparkles /><strong>{recipe.difficulty}</strong><small>Difficulty</small></span>
          <span><b>{recipe.cost}</b><strong>Broad estimate</strong><small>Cost level</small></span>
        </div>
        <div className="recipe-detail-grid">
          <section>
            <div className="ingredient-title"><div><p className="eyebrow">What you'll need</p><h2>Ingredients</h2><div className="unit-toggle" aria-label="Measurement units"><button className={units === "us" ? "selected" : ""} onClick={() => setUnits("us")}>US</button><button className={units === "metric" ? "selected" : ""} onClick={() => setUnits("metric")}>Metric</button></div></div><div className="servings"><button onClick={() => setServings((current) => Math.max(1, current - 1))} aria-label="Decrease servings"><Minus /></button><span>{servings} servings</span><button onClick={() => setServings((current) => current + 1)} aria-label="Increase servings"><Plus /></button></div></div>
            <ul className="ingredient-list">{recipe.ingredients.map((item) => <li key={item.id}><i /><strong>{item.name}</strong><span className="ingredient-values"><span>{units === "metric" ? item.metricAmount : item.amount}</span><small>{Math.round(item.calories * servings / 4).toLocaleString()} cal</small></span></li>)}</ul>
          </section>
          <aside className="nutrition-card"><p className="eyebrow">USDA-derived estimates</p><h3>Meal total</h3><strong className="meal-calories">{mealCalories.toLocaleString()} <small>cal</small></strong><div className="nutrition-breakdown"><span><strong>{caloriesPerServing}</strong> calories</span><span><strong>{recipe.nutrition.protein} g protein</strong></span><span><strong>{recipe.nutrition.carbohydrates} g carbohydrates</strong></span><span><strong>{recipe.nutrition.fat} g fat</strong></span><span><strong>{servings}</strong> servings</span></div><small>Per-serving estimates from mock reviewed catalog values. Verify labels and substitutions.</small></aside>
        </div>
        <section className="directions"><p className="eyebrow">Nice and easy</p><h2>How it comes together</h2>{recipe.steps.map((step, index) => <div key={step}><span>{index + 1}</span><p>{step}</p></div>)}</section>
        {recipe.safety && <aside className="safety-note"><Check /><div><strong>Good to know</strong><p>{recipe.safety}</p></div></aside>}
        <section className="recipe-feedback"><div><p className="eyebrow">After you cook</p><h2>How did it go?</h2><p>Your feedback helps tune future recommendations on this device.</p></div>{!cooked ? <button className="button secondary" onClick={() => setCooked(true)}>Mark as cooked</button> : <div className="rating-controls" role="group" aria-label="Rate this recipe">{[1, 2, 3, 4, 5].map((value) => <button className={rating >= value ? "selected" : ""} key={value} onClick={() => rateRecipe(value)} aria-label={`Rate ${value} stars`}>★</button>)}</div>}{rating > 0 && <span role="status">Thanks for rating this recipe.</span>}<Link className="report-link" to={`/report/${recipe.id}`}><Flag /> Report a factual or safety concern</Link></section>
      </div>
      <div className="recipe-actions">
        <Link className="button secondary" to={`/cook/${recipe.id}`}><CookingPot /> Start cooking</Link>
        <button className="button primary" onClick={() => onAdd(recipe.id)}>{added ? <><Check /> In grocery plan</> : <><Plus /> Add to grocery plan</>}</button>
      </div>
    </main>
  );
}
