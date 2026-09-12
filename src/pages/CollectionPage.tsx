import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { recipes } from "../data/recipes";

type Props = { cartIds: string[]; allergens?: string[]; onAdd: (recipeId: string) => void };

export function CollectionPage({ cartIds, allergens = [], onAdd }: Props) {
  const collection = recipes.filter((recipe) => recipe.time < 30 && !recipe.tags.includes("Breakfast") && !recipe.allergens.some((allergen) => allergens.includes(allergen)));

  return (
    <main className="wrap collection-page">
      <Link className="plain-back" to="/"><ArrowLeft /> Back to discover</Link>
      <header className="collection-heading">
        <p className="eyebrow accent">A good place to start</p>
        <h1>Beginner dinners under 30 minutes</h1>
        <p>Low-pressure recipes for nights when you want real food without a project.</p>
      </header>
      <div className="recipe-grid lower-grid">
        {collection.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}
      </div>
    </main>
  );
}
