import { Download, RotateCcw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { UserProfile } from "../types";
import { recipes } from "../data/recipes";
import { readStringList } from "../domain/localStorage";

type Props = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onExport: () => void;
  onDelete: () => void;
};

const equipmentOptions = ["Stovetop", "Oven", "Microwave", "Air fryer", "Slow cooker"];
const cuisineOptions = ["Mexican", "Italian", "Mediterranean", "Asian-inspired", "American"];

export function ProfilePage({ profile, onSave, onExport, onDelete }: Props) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const savedRecipes = readStringList("grocery-saved-recipes").map((id) => recipes.find((recipe) => recipe.id === id)).filter((recipe) => recipe !== undefined);

  const toggleListValue = (field: "equipment" | "cuisines", value: string) => {
    const values = draft[field];
    setDraft({ ...draft, [field]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] });
    setSaved(false);
  };

  const save = () => {
    onSave(draft);
    setSaved(true);
  };

  return (
    <main className="wrap profile-page">
      <header className="profile-heading"><p className="eyebrow accent">Your cooking setup</p><h1>Make recipes fit your life.</h1><p>These preferences stay on this device for the frontend POC.</p></header>
      <div className="profile-layout">
        <section className="settings-card">
          <h2>Everyday preferences</h2>
          <div className="form-grid">
            <label>Default servings<input aria-label="Default servings" type="number" min="1" max="20" value={draft.servings} onChange={(event) => setDraft({ ...draft, servings: Number(event.target.value) })} /></label>
            <label>Maximum cooking time<select aria-label="Maximum cooking time" value={draft.maxTime} onChange={(event) => setDraft({ ...draft, maxTime: event.target.value })}><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label>
            <label>Budget preference<select value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: event.target.value })}><option value="flexible">Flexible</option><option value="low">Keep it low</option><option value="moderate">Moderate</option></select></label>
            <label>Foods you dislike<input value={draft.dislikedFoods} onChange={(event) => setDraft({ ...draft, dislikedFoods: event.target.value })} placeholder="e.g. mushrooms, olives" /></label>
          </div>
          <fieldset><legend>Equipment available</legend><div className="preference-grid">{equipmentOptions.map((item) => <label key={item}><input type="checkbox" checked={draft.equipment.includes(item)} onChange={() => toggleListValue("equipment", item)} />{item}</label>)}</div></fieldset>
          <fieldset><legend>Cuisines you enjoy</legend><div className="preference-grid">{cuisineOptions.map((item) => <label key={item}><input type="checkbox" checked={draft.cuisines.includes(item)} onChange={() => toggleListValue("cuisines", item)} />{item}</label>)}</div></fieldset>
          <button className="button primary" onClick={save}><Save /> Save preferences</button>
          {saved && <span className="save-status" role="status">Preferences saved</span>}
        </section>
        <aside className="profile-sidebar">
          <section className="settings-card saved-recipes"><h2>Saved recipes</h2>{savedRecipes.length ? <ul>{savedRecipes.map((recipe) => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link><small>{recipe.time} min · {recipe.cost}</small></li>)}</ul> : <p>No saved recipes yet.</p>}</section>
          <section className="settings-card"><h2>Known allergens</h2>{profile.allergens.length ? <ul>{profile.allergens.map((allergen) => <li key={allergen}>{allergen}</li>)}</ul> : <p>None known</p>}<small>Always verify manufacturer labels and cross-contact risk.</small></section>
          <section className="settings-card"><h2>What we're learning</h2>{draft.inferredPreferences.length ? <ul>{draft.inferredPreferences.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No inferred preferences yet.</p>}<button className="text-action" onClick={() => setDraft({ ...draft, inferredPreferences: [] })}><RotateCcw /> Reset inferred preferences</button></section>
          <section className="settings-card data-controls"><h2>Your local data</h2><button onClick={onExport}><Download /> Export my data</button><button className="danger" onClick={onDelete}><Trash2 /> Delete local profile</button></section>
          <section className="settings-card"><h2>Need a hand?</h2><p>Report a recipe issue, safety concern, or account question.</p><Link className="text-action" to="/support">Contact support</Link></section>
        </aside>
      </div>
    </main>
  );
}
