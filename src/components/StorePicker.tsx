import { LocateFixed, MapPin } from "lucide-react";
import { useState } from "react";

export function StorePicker() {
  const [open, setOpen] = useState(false);
  const [zip, setZip] = useState(() => localStorage.getItem("grocery-store-zip") ?? "");
  const [pendingZip, setPendingZip] = useState("");
  const [message, setMessage] = useState("");

  const checkZip = () => {
    if (!/^\d{5}$/.test(zip)) {
      setMessage("Enter a 5-digit ZIP code.");
      setPendingZip("");
      return;
    }
    setPendingZip(zip);
    setMessage(`Use ${zip} for future store lookup?`);
  };

  const saveZip = () => {
    localStorage.setItem("grocery-store-zip", pendingZip);
    setMessage("Your categorized list still works while retailer availability is being connected.");
    setPendingZip("");
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location is unavailable here. Enter a ZIP instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setMessage("Converting your location to a ZIP requires the future location service. Coordinates were not saved."),
      () => setMessage("We couldn’t use your location. Your grocery list still works."),
    );
  };

  if (!open) return <button className="retailer-button" onClick={() => setOpen(true)}><MapPin /> Choose a store</button>;

  return (
    <section className="store-picker" aria-label="Store selection">
      <label>ZIP code<input inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(event) => setZip(event.target.value.replace(/\D/g, ""))} /></label>
      <div><button onClick={checkZip}>Check ZIP</button><button className="location-button" onClick={requestLocation}><LocateFixed /> Use my location</button></div>
      {message && <p role="status">{message}</p>}
      {pendingZip && <button className="retailer-button" onClick={saveZip}>Save ZIP</button>}
      <small>Exact stores, products, live prices, and checkout require an approved retailer connection.</small>
    </section>
  );
}
