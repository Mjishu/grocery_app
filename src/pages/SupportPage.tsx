import { LifeBuoy } from "lucide-react";
import { FormEvent, useState } from "react";

const categories = [
  ["account", "Account"], ["recipe", "Recipe error"], ["safety", "Safety"],
  ["privacy", "Privacy or deletion"], ["payment", "External support payment"], ["general", "General feedback"],
];

export function SupportPage() {
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    let requests: unknown[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem("grocery-support-requests") ?? "[]");
      if (Array.isArray(stored)) requests = stored;
    } catch {
      requests = [];
    }
    localStorage.setItem("grocery-support-requests", JSON.stringify([...requests, { category, message, createdAt: new Date().toISOString() }]));
    setMessage("");
    setSaved(true);
  };

  return (
    <main className="wrap utility-page">
      <section className="utility-card">
        <LifeBuoy />
        <p className="eyebrow accent">Support</p>
        <h1>Tell us what happened.</h1>
        <p>Safety concerns and recipe errors get priority. In this frontend POC, your request stays on this device until the support backend is connected.</p>
        <form onSubmit={submit}>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>How can we help?<textarea required rows={6} value={message} onChange={(event) => { setMessage(event.target.value); setSaved(false); }} /></label>
          <button className="button primary" type="submit">Save support request</button>
        </form>
        {saved && <p role="status">Your request was saved on this device. Sending it requires the future backend.</p>}
      </section>
    </main>
  );
}
