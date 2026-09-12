import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <main className="wrap utility-page"><section className="utility-card not-found"><span>404</span><h1>That page wandered off.</h1><p>The recipe may have moved, or the address may have a typo.</p><Link className="button primary" to="/"><ArrowLeft /> Back to discovery</Link></section></main>;
}
