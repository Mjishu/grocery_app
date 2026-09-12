import { ArrowLeft, ArrowRight, Check, Volume2, X } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { recipes } from "../data/recipes";

export function CookPage() {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);
  const [step, setStep] = useState(0);
  if (!recipe) return <Navigate to="/" replace />;
  const lastStep = step === recipe.steps.length - 1;

  return (
    <main className="cook-page">
      <header><Link to={`/recipes/${recipe.id}`} aria-label="Close cooking mode"><X /></Link><div><small>Cooking</small><strong>{recipe.title}</strong></div><button aria-label="Read step aloud"><Volume2 /></button></header>
      <div className="cook-progress"><i style={{ width: `${(step + 1) / recipe.steps.length * 100}%` }} /></div>
      <section className="cook-stage"><p className="eyebrow">Step {step + 1} of {recipe.steps.length}</p><span className="step-number">{step + 1}</span><h1>{recipe.steps[step]}</h1>{recipe.safety && lastStep && <aside><Check /><div><strong>Safety check</strong><p>{recipe.safety}</p></div></aside>}</section>
      <footer><button className="button secondary" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft /> Back</button>{lastStep ? <Link className="button primary" to={`/recipes/${recipe.id}`}>I'm done!</Link> : <button className="button primary" onClick={() => setStep(step + 1)}>Next step <ArrowRight /></button>}</footer>
    </main>
  );
}
