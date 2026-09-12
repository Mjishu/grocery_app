import type { Recipe } from "../types";

type Props = { recipe: Recipe; compact?: boolean };

export function RecipeArt({ recipe, compact = false }: Props) {
  return (
    <div className={`recipe-art ${compact ? "compact" : ""}`}>
      <img src={recipe.image} alt={`Placeholder for ${recipe.title}`} loading="lazy" style={{ objectPosition: recipe.imagePosition ?? "center" }} />
    </div>
  );
}
