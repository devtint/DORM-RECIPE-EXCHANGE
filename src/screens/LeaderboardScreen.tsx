import type { Recipe, NavTab } from "../types";
import Shell from "../components/Shell";
import BottomNav from "../components/BottomNav";
import Stars from "../components/Stars";
import { CostBadge, VerifiedBadge } from "../components/Badges";

interface UserRanking {
  name: string;
  email: string;
  recipes: number;
  avgRating: number;
  totalVotes: number;
}

interface Props {
  recipes: Recipe[];
  tab: "week" | "month";
  mode: "recipes" | "users";
  userRankings: UserRanking[];
  currentUserEmail: string;
  onTabChange: (t: "week" | "month") => void;
  onModeChange: (m: "recipes" | "users") => void;
  onOpenDetail: (id: string) => void;
  onViewProfile: (email: string) => void;
  onNav: (tab: NavTab) => void;
}

const PODIUM_ORDER = [1, 0, 2];
const MEDALS = ["🥈", "🥇", "🥉"];
const PODIUM_HEIGHTS = [100, 132, 84];
const PODIUM_BG = [
  "linear-gradient(145deg,#E8E0D8,#D0C8BE)",
  "linear-gradient(145deg,#E8703A,#C84E1E)",
  "linear-gradient(145deg,#D4C4A8,#BCA890)",
];

export default function LeaderboardScreen({
  recipes, tab, mode, userRankings, currentUserEmail,
  onTabChange, onModeChange, onOpenDetail, onViewProfile, onNav,
}: Props) {
  const rankedRecipes = [...recipes].sort((a, b) => b.rating - a.rating);

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header
          className="px-5 pt-12 pb-3 flex-shrink-0"
          style={{
            background: "rgba(253,248,242,0.96)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid #EDE6DE",
          }}
        >
          <h1 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
            Leaderboard
          </h1>
          <p className="text-xs mb-3" style={{ color: "#9B8E84" }}>
            The dorm's best — ranked by rating.
          </p>

          {/* Recipes / Users mode toggle */}
          <div className="flex rounded-xl p-1 mb-3" style={{ background: "#F0EAE1" }}>
            {(["recipes", "users"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: mode === m ? "#D95F2B" : "transparent",
                  color: mode === m ? "#fff" : "#9B8E84",
                  boxShadow: mode === m ? "0 1px 4px rgba(217,95,43,0.25)" : "none",
                }}
              >
                {m === "recipes" ? "🍲 Recipes" : "👤 Users"}
              </button>
            ))}
          </div>

          {/* Week / Month toggle — only for recipes */}
          {mode === "recipes" && (
            <div className="flex rounded-xl p-1" style={{ background: "#F0EAE1" }}>
              {(["week", "month"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onTabChange(t)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: tab === t ? "#D95F2B" : "transparent",
                    color: tab === t ? "#fff" : "#9B8E84",
                    boxShadow: tab === t ? "0 1px 4px rgba(217,95,43,0.25)" : "none",
                  }}
                >
                  {t === "week" ? "🗓 This Week" : "📅 This Month"}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {mode === "recipes" ? (
            <>
              {/* Podium */}
              <div className="px-4 pt-5 pb-4 flex gap-2 items-end anim-stagger">
                {PODIUM_ORDER.map((rankIdx, pos) => {
                  const r = rankedRecipes[rankIdx];
                  if (!r) return <div key={pos} className="flex-1" />;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onOpenDetail(r.id)}
                      className="flex-1 flex flex-col items-center justify-end pb-3 pt-3 rounded-2xl overflow-hidden active:scale-[0.97] transition-transform"
                      style={{
                        height: PODIUM_HEIGHTS[pos],
                        background: PODIUM_BG[pos],
                        boxShadow: pos === 1 ? "0 6px 20px rgba(217,95,43,0.35)" : "0 2px 8px rgba(42,31,20,0.1)",
                      }}
                    >
                      <span className="text-2xl mb-1">{MEDALS[pos]}</span>
                      <span
                        className="text-[10px] font-bold text-center px-2 leading-tight"
                        style={{ color: pos === 1 ? "rgba(255,255,255,0.95)" : "#4A3A2A" }}
                      >
                        {r.title.length > 20 ? r.title.slice(0, 18) + "…" : r.title}
                      </span>
                      <span
                        className="text-[10px] mt-0.5 font-semibold"
                        style={{ color: pos === 1 ? "rgba(255,255,255,0.7)" : "#D95F2B" }}
                      >
                        {r.rating}★
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ranked list */}
              <div className="px-5 pb-4 anim-stagger">
                <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B8E84" }}>
                  REST OF THE RANKINGS
                </p>
                {rankedRecipes.slice(3).map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => onOpenDetail(r.id)}
                    className="w-full flex items-center gap-3 py-3.5 border-b active:bg-amber-50 transition-colors"
                    style={{ borderColor: "#EDE6DE" }}
                  >
                    <span className="font-bold text-sm text-center flex-shrink-0" style={{ width: 28, color: "#C8BDB5" }}>
                      #{i + 4}
                    </span>
                    <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-amber-50">
                      <img src={r.photo} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold leading-snug" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
                        {r.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Stars rating={r.rating} size={11} />
                        <span className="text-xs" style={{ color: "#9B8E84" }}>{r.rating}</span>
                      </div>
                    </div>
                    <CostBadge cost={r.cost} />
                  </button>
                ))}
                <div className="h-4" />
              </div>
            </>
          ) : (
            /* ── User Rankings ───────────────────────────────────────── */
            <div className="px-5 pt-5 pb-4">

              {/* Top 3 user podium */}
              <div className="flex gap-2 items-end mb-6">
                {PODIUM_ORDER.map((rankIdx, pos) => {
                  const u = userRankings[rankIdx];
                  if (!u) return <div key={pos} className="flex-1" />;
                  const isMe = u.email === currentUserEmail;
                  return (
                    <button
                      key={u.email}
                      onClick={() => onViewProfile(u.email)}
                      className="flex-1 flex flex-col items-center justify-end pb-3 pt-3 rounded-2xl active:scale-[0.97] transition-transform"
                      style={{
                        height: PODIUM_HEIGHTS[pos],
                        background: isMe
                          ? "linear-gradient(145deg,#4A8FE0,#2A6FD0)"
                          : PODIUM_BG[pos],
                        boxShadow: pos === 1 ? "0 6px 20px rgba(217,95,43,0.35)" : "0 2px 8px rgba(42,31,20,0.1)",
                      }}
                    >
                      <span className="text-xl mb-1">{MEDALS[pos]}</span>
                      <div
                        className="flex items-center justify-center rounded-full mb-1 text-xs font-bold"
                        style={{
                          width: 28, height: 28,
                          background: "rgba(255,255,255,0.25)",
                          color: "#fff",
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <span
                        className="text-[10px] font-bold text-center px-1.5 leading-tight"
                        style={{ color: pos === 1 || isMe ? "rgba(255,255,255,0.95)" : "#4A3A2A" }}
                      >
                        {u.name.split(" ")[0]}
                      </span>
                      <span
                        className="text-[10px] mt-0.5 font-semibold"
                        style={{ color: pos === 1 || isMe ? "rgba(255,255,255,0.7)" : "#D95F2B" }}
                      >
                        {u.avgRating.toFixed(1)}★
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Full ranked list */}
              <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B8E84" }}>
                ALL CHEFS
              </p>
              {userRankings.map((u, i) => {
                const isMe = u.email === currentUserEmail;
                return (
                  <button
                    key={u.email}
                    onClick={() => onViewProfile(u.email)}
                    className="w-full flex items-center gap-3 py-3.5 border-b active:bg-amber-50 transition-colors text-left"
                    style={{
                      borderColor: "#EDE6DE",
                      background: isMe ? "#FFF8F0" : "transparent",
                      marginLeft: isMe ? -20 : 0,
                      marginRight: isMe ? -20 : 0,
                      paddingLeft: isMe ? 20 : 0,
                      paddingRight: isMe ? 20 : 0,
                      borderLeft: isMe ? "3px solid #D95F2B" : "none",
                      width: isMe ? "calc(100% + 40px)" : "100%",
                    }}
                  >
                    {/* Rank number */}
                    <div className="flex-shrink-0 text-center" style={{ width: 28 }}>
                      {i < 3 ? (
                        <span className="text-lg">{["🥇","🥈","🥉"][i]}</span>
                      ) : (
                        <span className="font-bold text-sm" style={{ color: "#C8BDB5" }}>#{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0 font-bold text-sm"
                      style={{
                        width: 40, height: 40,
                        background: isMe ? "linear-gradient(145deg,#E8703A,#C84E1E)" : "#F0EAE1",
                        color: isMe ? "#fff" : "#7A6A5A",
                        boxShadow: isMe ? "0 2px 8px rgba(217,95,43,0.3)" : "none",
                      }}
                    >
                      {u.name.charAt(0)}
                    </div>

                    {/* Name + badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold" style={{ color: "#2A1F14" }}>
                          {u.name}
                          {isMe && <span className="ml-1 text-xs font-semibold" style={{ color: "#D95F2B" }}>(You)</span>}
                        </p>
                        <VerifiedBadge email={u.email} />
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: "#9B8E84" }}>
                        {u.recipes} recipe{u.recipes !== 1 ? "s" : ""} · {u.totalVotes.toLocaleString()} ratings
                      </p>
                    </div>

                    {/* Avg rating + chevron */}
                    <div className="text-right flex-shrink-0 flex items-center gap-1.5">
                      <div>
                        <p className="text-sm font-bold" style={{ color: isMe ? "#D95F2B" : "#2A1F14" }}>
                          {u.avgRating.toFixed(1)}
                        </p>
                        <Stars rating={u.avgRating} size={10} />
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8BDB5" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                );
              })}
              <div className="h-4" />
            </div>
          )}
        </div>

        <BottomNav active="leaderboard" onNav={onNav} />
      </div>
    </Shell>
  );
}
