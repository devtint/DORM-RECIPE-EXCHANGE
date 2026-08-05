import { useEffect, useState } from "react";
import Shell from "../components/Shell";

const EQUIPMENTS = [
  { id: "Rice Cooker", emoji: "🍚" },
  { id: "Microwave", emoji: "📡" },
  { id: "Induction Plate", emoji: "🔥" },
  { id: "Stovetop", emoji: "🍳" },
  { id: "No Cook", emoji: "❄️" },
];
const CUISINES = ["🌏 Asian", "🥖 Western", "🍝 Italian", "🫒 Mediterranean"];
const CUISINE_IDS = ["Asian", "Western", "Italian", "Mediterranean"];

interface Props {
  filterEq: string[];
  filterCuisine: string[];
  costMax: number;
  onFilterEqChange: (v: string[]) => void;
  onFilterCuisineChange: (v: string[]) => void;
  onCostMaxChange: (v: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterScreen({
  filterEq, filterCuisine, costMax,
  onFilterEqChange, onFilterCuisineChange, onCostMaxChange,
  onApply, onReset,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggleEq(id: string) {
    onFilterEqChange(filterEq.includes(id) ? filterEq.filter((x) => x !== id) : [...filterEq, id]);
  }
  function toggleCuisine(id: string) {
    onFilterCuisineChange(filterCuisine.includes(id) ? filterCuisine.filter((x) => x !== id) : [...filterCuisine, id]);
  }

  const activeCount = filterEq.length + filterCuisine.length + (costMax < 200 ? 1 : 0);

  return (
    <Shell>
      <div className="flex-1 flex flex-col">
        {/* Backdrop */}
        <div
          onClick={onApply}
          className="flex-1 transition-opacity duration-300"
          style={{ background: "rgba(30,18,8,0.45)", opacity: visible ? 1 : 0 }}
        />

        {/* Sheet */}
        <div
          className="rounded-t-3xl transition-transform duration-300 flex flex-col"
          style={{
            background: "#FDF8F2",
            transform: visible ? "translateY(0)" : "translateY(100%)",
            boxShadow: "0 -4px 32px rgba(42,31,20,0.18)",
            maxHeight: "82dvh",
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="rounded-full" style={{ width: 36, height: 4, background: "#DDD6CE" }} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
                  Filter Recipes
                </h2>
                {activeCount > 0 && (
                  <p className="text-xs" style={{ color: "#D95F2B" }}>
                    {activeCount} filter{activeCount !== 1 ? "s" : ""} active
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors"
                  style={{ background: "#FFF0EA", color: "#D95F2B" }}
                >
                  Reset all
                </button>
                <button
                  onClick={onApply}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: "#F0EAE1" }}
                  aria-label="Close filter"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7A6A5A" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Equipment */}
            <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B8E84" }}>
              EQUIPMENT
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {EQUIPMENTS.map(({ id, emoji }) => {
                const sel = filterEq.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleEq(id)}
                    aria-pressed={sel}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all active:scale-95"
                    style={{
                      borderColor: sel ? "#D95F2B" : "#EDE6DE",
                      background: sel ? "#FFF0EA" : "#fff",
                      color: sel ? "#D95F2B" : "#5A4A3A",
                      boxShadow: sel ? "0 0 0 3px rgba(217,95,43,0.1)" : "none",
                    }}
                  >
                    <span>{emoji}</span> {id}
                  </button>
                );
              })}
            </div>

            {/* Cost */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold tracking-widest" style={{ color: "#9B8E84" }}>MAX COST</p>
              <span className="text-sm font-bold" style={{ color: "#D95F2B" }}>฿{costMax}</span>
            </div>
            <div className="relative mb-1">
              <input
                type="range"
                min={40}
                max={1000}
                step={10}
                value={costMax}
                onChange={(e) => onCostMaxChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "#D95F2B", height: 4 }}
                aria-label={`Max cost: ฿${costMax}`}
              />
            </div>
            <div className="flex justify-between text-[10px] mb-6" style={{ color: "#C8BDB5" }}>
              <span>฿40</span><span>฿1000</span>
            </div>

            {/* Cuisine */}
            <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B8E84" }}>
              CUISINE
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {CUISINES.map((label, i) => {
                const id = CUISINE_IDS[i];
                const sel = filterCuisine.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleCuisine(id)}
                    aria-pressed={sel}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all active:scale-95"
                    style={{
                      borderColor: sel ? "#D95F2B" : "#EDE6DE",
                      background: sel ? "#FFF0EA" : "#fff",
                      color: sel ? "#D95F2B" : "#5A4A3A",
                      boxShadow: sel ? "0 0 0 3px rgba(217,95,43,0.1)" : "none",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onApply}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#E8703A,#C84E1E)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(217,95,43,0.3)",
              }}
            >
              Show Results {activeCount > 0 ? `· ${activeCount} filter${activeCount !== 1 ? "s" : ""}` : ""}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
