import { AlertTriangle, ArrowLeft } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { recipes } from "../data/recipes";

export function ReportPage() {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);
  const [category, setCategory] = useState("factual");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!recipe) return <Navigate to="/" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const current = JSON.parse(localStorage.getItem("grocery-reports") ?? "[]");
    const report = { recipeId: recipe.id, category, details, createdAt: new Date().toISOString(), status: "pending-sync" };
    localStorage.setItem("grocery-reports", JSON.stringify([...current, report]));
    setSubmitted(true);
  };

  return (
    <main className="wrap report-page">
      <Link className="plain-back" to={`/recipes/${recipe.id}`}><ArrowLeft /> Back to recipe</Link>
      <form className="report-card" onSubmit={submit}>
        <AlertTriangle />
        <p className="eyebrow accent">Recipe report</p>
        <h1>Tell us what looks wrong.</h1>
        <p>Reports can be submitted without an account. In this frontend POC, the report stays on this device until a backend is connected.</p>
        <label>Concern type<select aria-label="Concern type" value={category} onChange={(event) => setCategory(event.target.value)}><option value="factual">Factual error</option><option value="safety">Food safety concern</option><option value="allergen">Allergen concern</option><option value="quantity">Materially wrong quantity</option><option value="instruction">Dangerous instruction</option></select></label>
        <label>What happened?<textarea aria-label="What happened?" required value={details} onChange={(event) => setDetails(event.target.value)} rows={6} placeholder="Share enough detail for the recipe to be reviewed." /></label>
        {category !== "factual" && <aside>Safety-related reports should trigger immediate withdrawal once the backend moderation workflow is connected.</aside>}
        <button className="button primary" type="submit">Submit report</button>
        {submitted && <strong className="report-status" role="status">Report saved on this device.</strong>}
      </form>
    </main>
  );
}
