import { useState, useRef } from "react";
import type { Recipe } from "../types";
import Shell from "../components/Shell";
import BackButton from "../components/BackButton";
import Stars from "../components/Stars";
import { CostBadge } from "../components/Badges";

interface Props {
  recipes: Recipe[];
  localComments: Record<string, { user: string; text: string; time: string }[]>;
  pendingDeleteId: string | null;
  onOpenDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const SWIPE_THRESHOLD = 60; // px to reveal action buttons

function RecipeRow({
  recipe, commentCount, pendingDelete,
  onOpenDetail, onEdit, onDelete,
}: {
  recipe: Recipe;
  commentCount: number;
  pendingDelete: boolean;
  onOpenDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const startXRef = useRef<number | null>(null);
  const isDragging = useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0].clientX;
    isDragging.current = false;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startXRef.current === null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    if (Math.abs(dx) > 6) isDragging.current = true;
    // Only allow left-swipe (negative dx), max -120px
    const clamped = Math.max(-120, Math.min(0, dx + (revealed ? -120 : 0)));
    setOffsetX(clamped);
  }

  function onTouchEnd() {
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-120);
      setRevealed(true);
    } else {
      setOffsetX(0);
      setRevealed(false);
    }
    startXRef.current = null;
  }

  function handleTap() {
    if (isDragging.current) return;
    if (revealed) {
      setOffsetX(0);
      setRevealed(false);
      return;
    }
    onOpenDetail();
  }

  if (pendingDelete) {
    return (
      <div
        className="rounded-3xl overflow-hidden anim-fade-in"
        style={{
          background: "#FFF4F4",
          border: "1.5px dashed #F5B8B8",
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <p className="text-sm text-center" style={{ color: "#D95F2B" }}>
          Deleting… tap <strong>Undo</strong> below to restore
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ background: "#fff" }}>
      {/* Action buttons revealed on swipe */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-stretch"
        style={{ width: 120 }}
      >
        <button
          onClick={onEdit}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:opacity-70"
          style={{ background: "#4A8FE0" }}
          aria-label="Edit recipe"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="text-[10px] font-bold text-white">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:opacity-70"
          style={{ background: "#E05050" }}
          aria-label="Delete recipe"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
          <span className="text-[10px] font-bold text-white">Delete</span>
        </button>
      </div>

      {/* Card content — slides left to reveal actions */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleTap}
        className="flex gap-3 cursor-pointer"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: startXRef.current === null ? "transform 0.25s cubic-bezier(0.22,1,0.36,1)" : "none",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(42,31,20,0.06), 0 4px 14px rgba(42,31,20,0.08)",
          borderRadius: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="w-28 bg-amber-50 flex-shrink-0" style={{ minHeight: 100, borderRadius: "24px 0 0 24px", overflow: "hidden" }}>
          <img src={recipe.photo} alt={recipe.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 py-3 pr-3">
          <p
            className="text-sm font-bold mb-1 leading-snug"
            style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}
          >
            {recipe.title}
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Stars rating={recipe.rating} size={12} />
            <span className="text-xs font-bold" style={{ color: "#2A1F14" }}>{recipe.rating}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "#F0EAE1", color: "#7A6A5A" }}
            >
              💬 {commentCount}
            </span>
            <CostBadge cost={recipe.cost} />
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "#F0EAE1", color: "#7A6A5A" }}
            >
              {recipe.equipmentIcon} {recipe.equipment}
            </span>
          </div>
        </div>

        {/* Swipe hint chevron */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5"
          style={{ opacity: revealed ? 0 : 0.25, transition: "opacity 0.2s" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8E84" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function MyRecipesScreen({
  recipes, localComments, pendingDeleteId,
  onOpenDetail, onEdit, onDelete, onSubmit, onBack,
}: Props) {
  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

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
              My Recipes
            </h1>
            <p className="text-xs" style={{ color: "#9B8E84" }}>
              {recipes.length} submitted · swipe left to edit or delete
            </p>
          </div>
          <button
            onClick={onSubmit}
            className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{
              width: 44, height: 44,
              background: "linear-gradient(145deg,#E8703A,#C84E1E)",
              boxShadow: "0 3px 10px rgba(217,95,43,0.3)",
            }}
            aria-label="Submit new recipe"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {recipes.length === 0 && !pendingDeleteId ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div
                className="flex items-center justify-center rounded-full anim-float"
                style={{ width: 80, height: 80, background: "#F0EAE1" }}
              >
                <span style={{ fontSize: 34 }}>📝</span>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "#2A1F14" }}>No recipes yet</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9B8E84" }}>
                  Share your first dorm recipe<br />and help the community eat better.
                </p>
              </div>
              <button
                onClick={onSubmit}
                className="px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#E8703A,#C84E1E)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(217,95,43,0.3)",
                }}
              >
                Submit a recipe
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 anim-stagger">
              {/* Swipe hint tip */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#F0EAE1" }}
              >
                <span style={{ fontSize: 13 }}>👈</span>
                <p className="text-[11px]" style={{ color: "#7A6A5A" }}>
                  Swipe a recipe left to reveal edit & delete
                </p>
              </div>

              {recipes.map((r) => {
                const commentCount = r.comments.length + (localComments[r.id]?.length ?? 0);
                return (
                  <RecipeRow
                    key={r.id}
                    recipe={r}
                    commentCount={commentCount}
                    pendingDelete={pendingDeleteId === r.id}
                    onOpenDetail={() => onOpenDetail(r.id)}
                    onEdit={() => onEdit(r.id)}
                    onDelete={() => onDelete(r.id)}
                  />
                );
              })}

              {/* Show placeholder slot if something is pending delete */}
              {pendingDeleteId && !recipes.find((r) => r.id === pendingDeleteId) && (
                <div
                  className="rounded-3xl flex items-center justify-center anim-fade-in"
                  style={{
                    minHeight: 100,
                    background: "#FFF4F4",
                    border: "1.5px dashed #F5B8B8",
                  }}
                >
                  <p className="text-sm" style={{ color: "#D95F2B" }}>
                    Recipe deleted — tap <strong>Undo</strong> to restore
                  </p>
                </div>
              )}

              <div className="h-20" />
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
