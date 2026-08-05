import type { Recipe, NavTab } from "../types";
import Shell from "../components/Shell";
import BottomNav from "../components/BottomNav";
import RecipeCard from "../components/RecipeCard";

interface Props {
  recipes: Recipe[];
  savedIds: Set<string>;
  searchQ: string;
  sortMode: "top" | "new";
  hasFilters: boolean;
  filterCount: number;
  onSearchChange: (v: string) => void;
  onSortChange: (m: "top" | "new") => void;
  onOpenFilter: () => void;
  onResetFilters: () => void;
  onOpenDetail: (id: string) => void;
  onToggleSave: (id: string) => void;
  onSubmit: () => void;
  onNav: (tab: NavTab) => void;
}

export default function HomeScreen({
  recipes, savedIds, searchQ, sortMode, hasFilters, filterCount,
  onSearchChange, onSortChange, onOpenFilter, onResetFilters, onOpenDetail, onToggleSave, onSubmit, onNav,
}: Props) {
  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Sticky header ──────────────────────────────────────────── */}
        <header
          className="flex-shrink-0 px-5 pt-12 pb-3 anim-fade-down"
          style={{
            background: "rgba(253,248,242,0.96)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid #EDE6DE",
          }}
        >
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="font-bold leading-none"
                style={{ fontFamily: "Fraunces, serif", color: "#2A1F14", fontSize: 26 }}
              >
                Dorm Recipes
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "#9B8E84" }}>
                What are you cooking today?
              </p>
            </div>

            {/* Add recipe FAB */}
            <button
              onClick={onSubmit}
              className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{
                width: 44, height: 44,
                background: "linear-gradient(145deg,#E8703A,#C84E1E)",
                boxShadow: "0 4px 14px rgba(217,95,43,0.35)",
              }}
              aria-label="Submit a recipe"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Search row */}
          <div className="flex gap-2 mb-3">
            <div
              className="flex-1 flex items-center gap-2 rounded-2xl px-3.5"
              style={{
                height: 44,
                background: "#F0EAE1",
                border: searchQ ? "1.5px solid #D95F2B" : "1.5px solid transparent",
                transition: "border-color 0.15s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B8E84" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={searchQ}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search recipes..."
                className="flex-1 text-sm bg-transparent"
                style={{ color: "#2A1F14" }}
                aria-label="Search recipes"
              />
              {searchQ && (
                <button
                  onClick={() => onSearchChange("")}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 20, height: 20, background: "#C8BDB5" }}
                  aria-label="Clear search"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={onOpenFilter}
              className="flex items-center justify-center rounded-2xl flex-shrink-0 relative transition-all active:scale-90"
              style={{
                width: 44, height: 44,
                background: hasFilters ? "#D95F2B" : "#F0EAE1",
                boxShadow: hasFilters ? "0 2px 10px rgba(217,95,43,0.3)" : "none",
              }}
              aria-label={`Filter recipes${hasFilters ? ` (${filterCount} active)` : ""}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={hasFilters ? "#fff" : "#7A6A5A"} strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              {hasFilters && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[9px] font-bold"
                  style={{ width: 16, height: 16, background: "#2A1F14", color: "#fff" }}
                >
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* Sort toggle */}
          <div className="flex rounded-xl p-1" style={{ background: "#F0EAE1" }}>
            {(["top", "new"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onSortChange(m)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: sortMode === m ? "#D95F2B" : "transparent",
                  color: sortMode === m ? "#fff" : "#9B8E84",
                  boxShadow: sortMode === m ? "0 1px 4px rgba(217,95,43,0.25)" : "none",
                }}
              >
                {m === "top" ? "⭐ Top Rated" : "🔥 Most Popular"}
              </button>
            ))}
          </div>
        </header>

        {/* ── Scrollable feed ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollBehavior: "smooth" }}>
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, background: "#F0EAE1" }}
              >
                <span style={{ fontSize: 32 }}>🔍</span>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "#2A1F14" }}>No recipes found</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9B8E84" }}>
                  Try adjusting your search<br />or clearing the filters.
                </p>
              </div>
              <button
                onClick={() => { onSearchChange(""); onResetFilters(); }}
                className="px-5 py-2 rounded-full text-xs font-bold"
                style={{ background: "#D95F2B", color: "#fff" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold mb-1 anim-fade-in" style={{ color: "#9B8E84" }}>
                {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
              </p>
              {recipes.map((r, i) => (
                <div
                  key={r.id}
                  className="anim-fade-up"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <RecipeCard
                    recipe={r}
                    onTap={() => onOpenDetail(r.id)}
                    onBookmark={() => onToggleSave(r.id)}
                    saved={savedIds.has(r.id)}
                  />
                </div>
              ))}
              <div className="h-4" />
            </div>
          )}
        </main>

        <BottomNav active="home" onNav={onNav} />
      </div>
    </Shell>
  );
}
