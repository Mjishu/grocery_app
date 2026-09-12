import { Check, Clock3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recipe } from "../types";
import { RecipeArt } from "./RecipeArt";

type Props = { recipe: Recipe; added: boolean; onAdd: (recipeId: string) => void };

export function RecipeCard({ recipe, added, onAdd }: Props) {
  return (
    <article className="recipe-card">
      <Link className="recipe-image-link" to={`/recipes/${recipe.id}`}>
        <RecipeArt recipe={recipe} />
        <span className="time-pill"><Clock3 size={14} />{recipe.time} min</span>
      </Link>
      <div className="recipe-card-body">
        <Link to={`/recipes/${recipe.id}`}>
          <small>{recipe.tags[0]}</small>
          <h3>{recipe.title}</h3>
          <p>{recipe.tagline}</p>
        </Link>
        <button className={added ? "add-button added" : "add-button"} onClick={() => onAdd(recipe.id)} aria-label={added ? `${recipe.title} added` : `Add ${recipe.title}`}>
          {added ? <Check /> : <Plus />}
        </button>
      </div>
    </article>
  );
}
