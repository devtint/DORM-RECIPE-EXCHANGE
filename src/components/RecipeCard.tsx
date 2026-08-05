import { useState } from "react";
import type { Recipe } from "../types";
import Stars from "./Stars";
import { CostBadge, EquipmentBadge } from "./Badges";

interface RecipeCardProps {
  recipe: Recipe;
  onTap: () => void;
  onBookmark: () => void;
  saved: boolean;
}

export default function RecipeCard({ recipe, onTap, onBookmark, saved }: RecipeCardProps) {
  const [popping, setPopping] = useState(false);

  function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    setPopping(true);
    onBookmark();
    setTimeout(() => setPopping(false), 400);
  }

  return (
    <article
      onClick={onTap}
      className="rounded-3xl overflow-hidden cursor-pointer active:scale-[0.975] transition-all duration-150"
      style={{
        background: "#fff",
        boxShadow: "0 1px 3px rgba(42,31,20,0.06), 0 4px 16px rgba(42,31,20,0.08)",
      }}
      aria-label={`Recipe: ${recipe.title}`}
    >
      {/* Photo area */}
      <div className="relative bg-amber-50" style={{ height: 180 }}>
        <img
          src={recipe.photo}
          alt={recipe.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient scrim */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(30,18,8,0.55) 0%, rgba(30,18,8,0.1) 45%, transparent 70%)" }}
        />

        {/* Bookmark — top-right, 44×44 touch target */}
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-3 flex items-center justify-center rounded-full transition-transform active:scale-90 ${popping ? "bookmark-pop" : ""}`}
          style={{ width: 44, height: 44, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", boxShadow: "0 1px 6px rgba(0,0,0,0.12)" }}
          aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "#D95F2B" : "none"} stroke={saved ? "#D95F2B" : "#5A4A3A"} strokeWidth="2.2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>

        {/* Bottom chips over photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <h3
            className="text-white font-bold text-sm leading-tight flex-1"
            style={{ fontFamily: "Fraunces, serif", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {recipe.title}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <CostBadge cost={recipe.cost} />
            <EquipmentBadge icon={recipe.equipmentIcon} name={recipe.equipment} />
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Stars rating={recipe.rating} size={13} />
          <span className="text-xs font-bold" style={{ color: "#2A1F14" }}>{recipe.rating}</span>
          <span className="text-xs" style={{ color: "#9B8E84" }}>({recipe.ratingCount})</span>
        </div>
        <span className="text-xs font-medium" style={{ color: "#9B8E84" }}>{recipe.cuisine}</span>
      </div>
    </article>
  );
}
