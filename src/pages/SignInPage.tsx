import { Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function SignInPage() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [eligible, setEligible] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const checkAge = (event: FormEvent) => {
    event.preventDefault();
    const today = new Date();
    const age = today.getFullYear() - Number(year) - (today.getMonth() + 1 < Number(month) ? 1 : 0);
    const isAdult = age >= 18;
    localStorage.setItem("grocery-age-gate", JSON.stringify({ result: isAdult ? "18_plus" : "under_18", method: "month-year-v1", checkedAt: new Date().toISOString() }));
    setEligible(isAdult);
    setError(isAdult ? "" : "You must be 18 or older to create an account during the POC.");
  };

  if (eligible) return (
    <main className="account-page wrap">
      <section className="account-card">
        <p className="eyebrow accent">Welcome</p><h1>Save your cooking progress.</h1><p>Choose how you’ll eventually sign in. These controls are intentionally disconnected in the frontend-only POC.</p><small>Authentication connection will be added with the backend.</small>
        <button onClick={() => setNotice("Google connection will be added with the backend.")}><span className="google-mark" aria-hidden="true">G</span> Continue with Google</button>
        <button onClick={() => setNotice("Passwordless email connection will be added with the backend.")}><Mail /> Email me a sign-in link</button>
        {notice && <strong role="status">{notice}</strong>}
        <Link to="/">Continue browsing without an account</Link>
      </section>
    </main>
  );

  return (
    <main className="account-page wrap">
      <form className="account-card" onSubmit={checkAge}>
        <p className="eyebrow accent">Age check</p><h1>First, confirm you’re 18 or older.</h1><p>Enter only your birth month and year. The raw values are not retained.</p>
        <div className="age-fields"><label>Birth month<select aria-label="Birth month" required value={month} onChange={(event) => setMonth(event.target.value)}><option value="">Month</option>{months.map((name, index) => <option value={index + 1} key={name}>{name}</option>)}</select></label><label>Birth year<input aria-label="Birth year" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={year} onChange={(event) => setYear(event.target.value)} /></label></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary" type="submit">Continue</button>
      </form>
    </main>
  );
}
