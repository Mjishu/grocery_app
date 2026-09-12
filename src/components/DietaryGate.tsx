import { useState } from "react";

const allergens = ["Milk", "Egg", "Fish", "Shellfish", "Tree nuts", "Peanuts", "Wheat", "Soy", "Sesame"];

type Props = {
  onCancel: () => void;
  onConfirm: (allergens: string[]) => void;
};

export function DietaryGate({ onCancel, onConfirm }: Props) {
  const [noneKnown, setNoneKnown] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const canSave = noneKnown || selected.length > 0;

  const toggleAllergen = (allergen: string) => {
    setNoneKnown(false);
    setSelected((current) => current.includes(allergen) ? current.filter((item) => item !== allergen) : [...current, allergen]);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="dietary-title">
        <p className="eyebrow accent">One quick safety check</p>
        <h2 id="dietary-title">Before you add your first recipe</h2>
        <p>Tell us about known food allergies or dietary restrictions. You can change this later.</p>
        <fieldset>
          <legend>Known allergens</legend>
          <div className="choice-grid">
            {allergens.map((allergen) => <label key={allergen}><input type="checkbox" checked={selected.includes(allergen)} onChange={() => toggleAllergen(allergen)} />{allergen}</label>)}
          </div>
          <label className="none-choice"><input type="checkbox" checked={noneKnown} onChange={(event) => { setNoneKnown(event.target.checked); if (event.target.checked) setSelected([]); }} />None known</label>
        </fieldset>
        <p className="modal-note">Always verify package labels and cross-contact risks. Missing data never means an ingredient is safe.</p>
        <div className="modal-actions"><button className="button secondary" onClick={onCancel}>Not now</button><button className="button primary" disabled={!canSave} onClick={() => onConfirm(selected)}>Save and add recipe</button></div>
      </section>
    </div>
  );
}
