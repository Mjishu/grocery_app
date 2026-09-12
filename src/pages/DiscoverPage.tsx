import { ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { RecipeArt } from "../components/RecipeArt";
import { recipes } from "../data/recipes";

type Props = { cartIds: string[]; onAdd: (recipeId: string) => void };
const filters = ["Under 30 min", "One pan", "Vegetarian", "High protein"];

export function DiscoverPage({ cartIds, onAdd }: Props) {
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
        <input aria-label="Search recipes" placeholder="Try “cheap, cozy, and no chopping”" />
        <kbd>⌘ K</kbd>
      </label>

      <div className="filter-row">
        <button aria-label="All filters"><SlidersHorizontal size={17} /></button>
        {filters.map((filter, index) => <button className={index === 0 ? "selected" : ""} key={filter}>{filter}</button>)}
      </div>

      <section className="content-section" id="collections">
        <div className="section-title">
          <div><p className="eyebrow accent">Start here</p><h2>Easy wins</h2></div>
          <button>See all <ArrowRight size={16} /></button>
        </div>
        <div className="recipe-grid">
          {recipes.slice(0, 2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}
        </div>
      </section>

      <Link className="spotlight" to={`/recipes/${recipes[2].id}`}>
        <div><p className="eyebrow">Tonight's pick</p><h2>One tray.<br />Very little cleanup.</h2><span>Cook the honey salmon <ArrowRight size={16} /></span></div>
        <RecipeArt recipe={recipes[2]} compact />
      </Link>

      <section className="content-section">
        <div className="section-title"><div><p className="eyebrow mint-text">Fast & friendly</p><h2>Ready before the group chat</h2></div></div>
        <div className="recipe-grid lower-grid">
          {recipes.slice(2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} added={cartIds.includes(recipe.id)} onAdd={onAdd} />)}
        </div>
      </section>
    </main>
  );
}
