import type { Recipe, NavTab } from "../types";
import Shell from "../components/Shell";
import BottomNav from "../components/BottomNav";
import Stars from "../components/Stars";
import { CostBadge } from "../components/Badges";

interface Props {
  recipes: Recipe[];
  onOpenDetail: (id: string) => void;
  onNav: (tab: NavTab) => void;
  onBrowse: () => void;
}

export default function SavedScreen({ recipes, onOpenDetail, onNav, onBrowse }: Props) {
  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

        <header
          className="px-5 pt-12 pb-4 flex-shrink-0"
          style={{
            background: "rgba(253,248,242,0.96)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid #EDE6DE",
          }}
        >
          <h1 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
            Saved Recipes
          </h1>
          <p className="text-xs" style={{ color: "#9B8E84" }}>
            {recipes.length > 0
              ? `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} bookmarked`
              : "Your bookmarks will appear here"}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 80, height: 80, background: "#F0EAE1" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C8BDB5" strokeWidth="1.5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "#2A1F14" }}>Nothing saved yet</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9B8E84" }}>
                  Tap the bookmark icon on any recipe<br />to save it here for later.
                </p>
              </div>
              <button
                onClick={onBrowse}
                className="px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#E8703A,#C84E1E)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(217,95,43,0.3)",
                }}
              >
                Browse recipes
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 anim-stagger">
                {recipes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onOpenDetail(r.id)}
                    className="rounded-3xl overflow-hidden text-left active:scale-[0.96] transition-transform"
                    style={{
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(42,31,20,0.06), 0 4px 14px rgba(42,31,20,0.08)",
                    }}
                  >
                    <div className="relative bg-amber-50" style={{ height: 120 }}>
                      <img
                        src={r.photo}
                        alt={r.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(20,10,2,0.4) 0%, transparent 60%)" }}
                      />
                    </div>
                    <div className="p-2.5">
                      <p
                        className="text-xs font-bold leading-snug mb-1"
                        style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}
                      >
                        {r.title}
                      </p>
                      <div className="flex items-center gap-1 mb-1.5">
                        <Stars rating={r.rating} size={10} />
                        <span className="text-[10px] font-semibold" style={{ color: "#9B8E84" }}>{r.rating}</span>
                      </div>
                      <CostBadge cost={r.cost} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="h-4" />
            </>
          )}
        </div>

        <BottomNav active="saved" onNav={onNav} />
      </div>
    </Shell>
  );
}
