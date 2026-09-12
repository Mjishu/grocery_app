import { Compass, ListChecks, Moon, Search, ShoppingBasket, Sun, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

type Props = { cartCount: number; theme: "bright" | "dark"; onThemeChange: () => void };

export function AppShell({ cartCount, theme, onThemeChange }: Props) {
  return (
    <div className="app-shell">
      <header className="topbar wrap">
        <Link className="brand" to="/">good food<span>.</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/">Discover</NavLink>
          <a href="#search">Search</a>
          <a href="#collections">Collections</a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={onThemeChange} aria-label={`Switch to ${theme === "bright" ? "dark" : "bright"} mode`}>
            {theme === "bright" ? <Moon /> : <Sun />}
          </button>
          <Link className="basket-button" to="/groceries" aria-label={`Grocery plan with ${cartCount} recipes`}>
            <ShoppingBasket size={20} /><span>{cartCount}</span>
          </Link>
        </div>
      </header>

      <Outlet />

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/" end><Compass /><span>Discover</span></NavLink>
        <a href="/#search"><Search /><span>Search</span></a>
        <NavLink to="/groceries"><i><ListChecks />{cartCount > 0 && <b>{cartCount}</b>}</i><span>My plan</span></NavLink>
        <a href="#profile"><UserRound /><span>You</span></a>
      </nav>
    </div>
  );
}
