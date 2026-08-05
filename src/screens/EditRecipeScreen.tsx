import { useState } from "react";
import type { Recipe } from "../types";
import Shell from "../components/Shell";
import BackButton from "../components/BackButton";

const EQUIPMENTS = [
  { id: "Rice Cooker", emoji: "🍚" },
  { id: "Microwave", emoji: "📡" },
  { id: "Induction Plate", emoji: "🔥" },
  { id: "Stovetop", emoji: "🍳" },
  { id: "No Cook", emoji: "❄️" },
];

const CUISINES = [
  { id: "Asian", label: "🌏 Asian" },
  { id: "Western", label: "🥖 Western" },
  { id: "Italian", label: "🍝 Italian" },
  { id: "Mediterranean", label: "🫒 Mediterranean" },
];

interface Props {
  recipe: Recipe;
  onBack: () => void;
  onSave: (updated: Recipe) => void;
}

export default function EditRecipeScreen({ recipe, onBack, onSave }: Props) {
  const [name, setName] = useState(recipe.title);
  const [equipment, setEquipment] = useState(recipe.equipment);
  const [cuisine, setCuisine] = useState(recipe.cuisine);
  const [cost, setCost] = useState(recipe.cost.replace("฿", ""));
  const [ingredients, setIngredients] = useState(
    recipe.ingredients.length ? recipe.ingredients : [{ name: "", qty: "" }],
  );
  const [steps, setSteps] = useState(recipe.steps.length ? recipe.steps : [""]);
  const [notes, setNotes] = useState(recipe.notes ?? "");
  const [saved, setSaved] = useState(false);

  const canSave =
    name.trim().length > 0 &&
    equipment !== "" &&
    cuisine !== "" &&
    cost.trim().length > 0 &&
    Number(cost) >= 40 &&
    Number(cost) <= 200 &&
    ingredients.some((i) => i.name.trim()) &&
    steps.some((s) => s.trim());

  function addIngredient() { setIngredients([...ingredients, { name: "", qty: "" }]); }
  function removeIngredient(i: number) { setIngredients(ingredients.filter((_, j) => j !== i)); }
  function updateIngredient(i: number, field: "name" | "qty", val: string) {
    setIngredients(ingredients.map((ing, j) => j === i ? { ...ing, [field]: val } : ing));
  }

  function addStep() { setSteps([...steps, ""]); }
  function removeStep(i: number) { setSteps(steps.filter((_, j) => j !== i)); }
  function updateStep(i: number, val: string) {
    setSteps(steps.map((s, j) => j === i ? val : s));
  }

  const equipmentEmoji = EQUIPMENTS.find((e) => e.id === equipment)?.emoji ?? "🍳";

  function handleSave() {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => {
      onSave({
        ...recipe,
        title: name.trim(),
        equipment,
        equipmentIcon: equipmentEmoji,
        cuisine,
        cost: `฿${cost}`,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.trim()),
        notes: notes.trim(),
      });
    }, 400);
  }

  const fieldStyle = {
    background: "#fff",
    border: "1.5px solid #E5DDD4",
    borderRadius: 14,
    color: "#2A1F14",
    fontSize: 14,
  };

  const chipBase: React.CSSProperties = {
    border: "1.5px solid #EDE6DE",
    borderRadius: 12,
    background: "#fff",
    color: "#5A4A3A",
    fontSize: 12,
    fontWeight: 700,
    padding: "8px 14px",
    transition: "all 0.15s",
    cursor: "pointer",
  };

  const chipActive: React.CSSProperties = {
    ...chipBase,
    borderColor: "#D95F2B",
    background: "#FFF0EA",
    color: "#D95F2B",
    boxShadow: "0 0 0 3px rgba(217,95,43,0.1)",
  };

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header
          className="px-5 pt-10 pb-4 flex items-center gap-3 flex-shrink-0 anim-fade-down"
          style={{
            background: "rgba(253,248,242,0.96)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid #EDE6DE",
          }}
        >
          <BackButton onBack={onBack} />
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              Edit Recipe
            </h1>
            <p className="text-xs" style={{ color: "#9B8E84" }}>Changes apply immediately after saving.</p>
          </div>
          {/* Quick save button in header */}
          <button
            onClick={handleSave}
            disabled={!canSave || saved}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{
              background: canSave && !saved ? "#D95F2B" : "#E5DDD4",
              color: canSave && !saved ? "#fff" : "#9B8E84",
              cursor: canSave && !saved ? "pointer" : "default",
            }}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6 anim-stagger">

          {/* Change indicator banner */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "#FFF4D0", border: "1px solid #F5C51844" }}
          >
            <span>✏️</span>
            <p className="text-xs font-semibold" style={{ color: "#8A5C00" }}>
              Editing — tap Save when done. This only affects your copy.
            </p>
          </div>

          {/* Meal name */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              MEAL NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Garlic Butter Ramen"
              className="w-full px-4 py-3.5"
              style={{
                ...fieldStyle,
                borderColor: name.trim() ? "#D95F2B" : "#E5DDD4",
                boxShadow: name.trim() ? "0 0 0 3px rgba(217,95,43,0.08)" : "none",
              }}
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              EQUIPMENT NEEDED
            </label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENTS.map(({ id, emoji }) => (
                <button
                  key={id}
                  onClick={() => setEquipment(id === equipment ? "" : id)}
                  className="flex items-center gap-1.5 active:scale-95"
                  style={equipment === id ? chipActive : chipBase}
                >
                  <span>{emoji}</span> {id}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              CUISINE TYPE
            </label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setCuisine(id === cuisine ? "" : id)}
                  className="active:scale-95"
                  style={cuisine === id ? chipActive : chipBase}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              ESTIMATED COST (฿)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-base font-bold flex-shrink-0" style={{ color: "#8A7A6A" }}>฿</span>
              <input
                type="number"
                inputMode="numeric"
                min={40}
                max={200}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g. 85"
                className="flex-1 px-4 py-3.5"
                style={fieldStyle}
              />
            </div>
            {cost && (Number(cost) < 40 || Number(cost) > 200) && (
              <p className="text-[11px] mt-1" style={{ color: "#D95F2B" }}>
                Must be between ฿40 and ฿200
              </p>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              INGREDIENTS
            </label>
            <div className="flex flex-col gap-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    placeholder="Ingredient"
                    className="flex-1 px-3 py-3"
                    style={fieldStyle}
                  />
                  <input
                    value={ing.qty}
                    onChange={(e) => updateIngredient(i, "qty", e.target.value)}
                    placeholder="Qty"
                    className="px-3 py-3"
                    style={{ ...fieldStyle, width: 76 }}
                  />
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(i)}
                      className="flex items-center justify-center rounded-full flex-shrink-0 active:scale-90"
                      style={{ width: 34, height: 34, background: "#F0EAE1" }}
                      aria-label="Remove ingredient"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B8E84" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addIngredient}
              className="mt-3 flex items-center gap-1.5 text-sm font-bold active:opacity-70"
              style={{ color: "#D95F2B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add ingredient
            </button>
          </div>

          {/* Steps */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              STEPS
            </label>
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold mt-2.5"
                    style={{
                      width: 28, height: 28,
                      background: "linear-gradient(145deg,#E8703A,#C84E1E)",
                      color: "#fff",
                      boxShadow: "0 2px 6px rgba(217,95,43,0.3)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={`Describe step ${i + 1}…`}
                    rows={2}
                    className="flex-1 px-3 py-3 resize-none"
                    style={fieldStyle}
                  />
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="flex items-center justify-center rounded-full flex-shrink-0 mt-2.5 active:scale-90"
                      style={{ width: 34, height: 34, background: "#F0EAE1" }}
                      aria-label="Remove step"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B8E84" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addStep}
              className="mt-3 flex items-center gap-1.5 text-sm font-bold active:opacity-70"
              style={{ color: "#D95F2B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add step
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold tracking-widest mb-2 block" style={{ color: "#9B8E84" }}>
              NOTES <span style={{ color: "#C8BDB5", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tips, substitutions, serving ideas…"
              rows={3}
              className="w-full px-4 py-3 resize-none"
              style={fieldStyle}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!canSave || saved}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: saved
                ? "linear-gradient(135deg,#4A9E4A,#2E7A2E)"
                : canSave
                ? "linear-gradient(135deg,#E8703A,#C84E1E)"
                : "#E5DDD4",
              color: canSave || saved ? "#fff" : "#9B8E84",
              boxShadow: canSave && !saved ? "0 4px 16px rgba(217,95,43,0.3)" : "none",
              cursor: canSave && !saved ? "pointer" : "default",
            }}
          >
            {saved ? "✓ Recipe saved!" : "Save Changes"}
          </button>

          <div className="h-6" />
        </div>
      </div>
    </Shell>
  );
}
