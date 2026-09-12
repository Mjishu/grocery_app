import { ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { RecipeArt } from "../components/RecipeArt";
import { recipes } from "../data/recipes";

type Props = { cartIds: string[]; allergens?: string[]; onAdd: (recipeId: string) => void };
const filters = ["Under 30 min", "One pan", "Vegetarian", "High protein"];

export function DiscoverPage({ cartIds, allergens = [], onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const isFiltering = query.trim().length > 0 || activeFilter.length > 0;
  const eligibleRecipes = useMemo(() => recipes.filter((recipe) => !recipe.allergens.some((allergen) => allergens.includes(allergen))), [allergens]);
  const hiddenRecipeCount = recipes.length - eligibleRecipes.length;
  const visibleRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return eligibleRecipes.filter((recipe) => {
      const searchableText = [recipe.title, recipe.tagline, ...recipe.tags].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesFilter = !activeFilter
        || (activeFilter === "Under 30 min" && recipe.time < 30)
        || (activeFilter === "One pan" && recipe.tags.includes("One pan"))
        || (activeFilter === "Vegetarian" && recipe.tags.includes("Vegetarian"))
        || (activeFilter === "High protein" && recipe.tags.includes("High protein"));
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, eligibleRecipes, query]);
  const spotlightRecipe = eligibleRecipes.find((recipe) => recipe.tags.includes("Sheet pan")) ?? eligibleRecipes[0];

  const clearFilters = () => {
    setQuery("");
    setActiveFilter("");
  };

  return (
    <main className="wrap discover-page">
      <section className="hero-copy">
        <div>
          <p className="eyebrow">Friday, made easy</p>
          <h1>Cook something<br /><em>actually good.</em></h1>
          <p className="hero-note">Beginner-friendly recipes that become one tidy grocery list.</p>
        </div>
        <span className="spark-badge"><Sparkles /></span>
      </section>

      <label className="search-field" id="search">
        <Search />
        <input aria-label="Search recipes" placeholder="Try “cheap, cozy, and no chopping”" value={query} onChange={(event) => setQuery(event.target.value)} />
        <kbd>⌘ K</kbd>
      </label>

      <div className="filter-row">
        <button aria-label="All filters"><SlidersHorizontal size={17} /></button>
        {filters.map((filter) => <button className={activeFilter === filter ? "selected" : ""} onClick={() => setActiveFilter((current) => current === filter ? "" : filter)} key={filter}>{filter}</button>)}
        {isFiltering && <button className="clear-filter" onClick={clearFilters}>Clear filters</button>}
      </div>
      {hiddenRecipeCount > 0 && <aside className="dietary-filter-note">{hiddenRecipeCount} recipes hidden for your {allergens.join(", ")} preference. Constraints are never relaxed automatically.</aside>}

      {isFiltering ? <section className="content-section search-results" aria-live="polite">
        <div className="section-title"><div><p className="eyebrow accent">Search results</p><h2>{visibleRecipes.length ? `${visibleRecipes.length} recipes found` : "No exact matches"}</h2></div></div>
        {visibleRecipes.length ? <div className="recipe-grid lower-grid">{visibleRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}</div> : <div className="no-results"><p>Try a different phrase or remove a filter.</p><button onClick={clearFilters}>Clear filters</button></div>}
      </section> : <>
      <section className="content-section" id="collections">
        <div className="section-title">
          <div><p className="eyebrow accent">Start here</p><h2>Easy wins</h2></div>
          <button>See all <ArrowRight size={16} /></button>
        </div>
        <div className="recipe-grid">
          {eligibleRecipes.slice(0, 2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}
        </div>
      </section>

      {spotlightRecipe && <Link className="spotlight" to={`/recipes/${spotlightRecipe.id}`}>
        <div><p className="eyebrow">Tonight's pick</p><h2>One tray.<br />Very little cleanup.</h2><span>Cook the honey salmon <ArrowRight size={16} /></span></div>
        <RecipeArt recipe={spotlightRecipe} compact />
      </Link>}

      <section className="content-section">
        <div className="section-title"><div><p className="eyebrow mint-text">Fast & friendly</p><h2>Ready before the group chat</h2></div></div>
        <div className="recipe-grid lower-grid">
          {eligibleRecipes.slice(2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}
        </div>
      </section>
      </>}
    </main>
  );
}
