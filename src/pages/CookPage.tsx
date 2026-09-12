import { ArrowLeft, ArrowRight, Check, Clock3, Minus, MonitorUp, Plus, RotateCcw, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { recipes } from "../data/recipes";

type CookingTimer = {
  id: number;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  deadline: number | null;
};

type ScreenWakeLock = { release: () => Promise<void> };

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function reconcileTimers(timers: CookingTimer[]) {
  const now = Date.now();
  return timers.map((timer) => {
    if (!timer.deadline) return timer;
    const remainingSeconds = Math.max(0, Math.ceil((timer.deadline - now) / 1000));
    return { ...timer, remainingSeconds, deadline: remainingSeconds ? timer.deadline : null };
  });
}

export function CookPage() {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);
  const [step, setStep] = useState(0);
  const [timers, setTimers] = useState<CookingTimer[]>([]);
  const [nextTimerNumber, setNextTimerNumber] = useState(1);
  const [screenAwake, setScreenAwake] = useState(false);
  const wakeLockRef = useRef<ScreenWakeLock | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setTimers(reconcileTimers), 1000);
    const handleVisibility = () => setTimers(reconcileTimers);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => () => {
    void wakeLockRef.current?.release();
  }, []);

  if (!recipe) return <Navigate to="/" replace />;
  const lastStep = step === recipe.steps.length - 1;

  const addTimer = () => {
    setTimers((current) => [...current, { id: nextTimerNumber, label: `Timer ${nextTimerNumber}`, durationSeconds: 300, remainingSeconds: 300, deadline: null }]);
    setNextTimerNumber((current) => current + 1);
  };

  const toggleTimer = (timerId: number) => {
    setTimers((current) => current.map((timer) => {
      if (timer.id !== timerId) return timer;
      if (timer.deadline) return { ...timer, remainingSeconds: Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000)), deadline: null };
      return { ...timer, deadline: Date.now() + timer.remainingSeconds * 1000 };
    }));
  };

  const addMinute = (timerId: number) => {
    setTimers((current) => current.map((timer) => timer.id === timerId ? { ...timer, remainingSeconds: timer.remainingSeconds + 60, deadline: timer.deadline ? timer.deadline + 60000 : null } : timer));
  };

  const resetTimer = (timerId: number) => {
    setTimers((current) => current.map((timer) => timer.id === timerId ? { ...timer, remainingSeconds: timer.durationSeconds, deadline: null } : timer));
  };

  const readStep = () => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(recipe.steps[step]));
  };

  const toggleScreenAwake = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setScreenAwake(false);
      return;
    }

    const wakeLockNavigator = navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<ScreenWakeLock> } };
    if (!wakeLockNavigator.wakeLock) return;
    wakeLockRef.current = await wakeLockNavigator.wakeLock.request("screen");
    setScreenAwake(true);
  };

  return (
    <main className="cook-page">
      <header><Link to={`/recipes/${recipe.id}`} aria-label="Close cooking mode"><X /></Link><div><small>Cooking</small><strong>{recipe.title}</strong></div><button aria-label="Read step aloud" onClick={readStep}><Volume2 /></button></header>
      <div className="cook-progress"><i style={{ width: `${(step + 1) / recipe.steps.length * 100}%` }} /></div>
      <section className="cook-stage"><p className="eyebrow">Step {step + 1} of {recipe.steps.length}</p><span className="step-number">{step + 1}</span><h1>{recipe.steps[step]}</h1>{recipe.safety && lastStep && <aside><Check /><div><strong>Safety check</strong><p>{recipe.safety}</p></div></aside>}<div className="cooking-tools"><button className={screenAwake ? "tool-toggle active" : "tool-toggle"} onClick={toggleScreenAwake} aria-label={screenAwake ? "Allow screen to sleep" : "Keep screen awake"}><MonitorUp /> {screenAwake ? "Screen stays awake" : "Keep screen awake"}</button><button className="add-timer" onClick={addTimer}><Clock3 /> Add timer</button></div><div className="timer-tools">{timers.map((timer) => <article className="cooking-timer" key={timer.id}><div><small>{timer.label}</small><strong aria-live="polite">{formatTime(timer.remainingSeconds)}</strong></div><div><button onClick={() => toggleTimer(timer.id)} aria-label={`${timer.deadline ? "Pause" : "Start"} ${timer.label}`}>{timer.deadline ? <Minus /> : <Clock3 />}</button><button onClick={() => addMinute(timer.id)} aria-label={`Add one minute to ${timer.label}`}><Plus /></button><button onClick={() => resetTimer(timer.id)} aria-label={`Reset ${timer.label}`}><RotateCcw /></button><button onClick={() => setTimers((current) => current.filter((item) => item.id !== timer.id))} aria-label={`Dismiss ${timer.label}`}><X /></button></div></article>)}</div><p className="background-warning">Timers on a website may not sound while your phone is locked. Set a device timer before leaving this page.</p></section>
      <footer><button className="button secondary" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft /> Back</button>{lastStep ? <Link className="button primary" to={`/recipes/${recipe.id}`}>I'm done!</Link> : <button className="button primary" onClick={() => setStep(step + 1)}>Next step <ArrowRight /></button>}</footer>
    </main>
  );
}
