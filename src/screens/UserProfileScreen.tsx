import type { Recipe } from "../types";
import Shell from "../components/Shell";
import BackButton from "../components/BackButton";
import Stars from "../components/Stars";
import { VerifiedBadge, CostBadge, isCampusEmail } from "../components/Badges";

interface Props {
  name: string;
  email: string;
  recipes: Recipe[];
  isMe: boolean;
  userRank: number;
  totalUsers: number;
  onBack: () => void;
  onOpenDetail: (id: string) => void;
  onGoMyProfile: () => void;
}

export default function UserProfileScreen({
  name, email, recipes, isMe, userRank, totalUsers,
  onBack, onOpenDetail, onGoMyProfile,
}: Props) {
  const campus = isCampusEmail(email);
  const avgRating = recipes.length
    ? (recipes.reduce((s, r) => s + r.rating, 0) / recipes.length).toFixed(1)
    : "—";
  const totalVotes = recipes.reduce((s, r) => s + r.ratingCount, 0);
  const maskedEmail = email.replace(/^(.).*(@.*)$/, "$1***$2");

  const initial = name.charAt(0).toUpperCase();

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div
          className="relative flex-shrink-0 anim-fade-in"
          style={{
            background: "linear-gradient(160deg,#FDF8F2 0%,#F2E4CF 55%,#EDD6B3 100%)",
            paddingTop: 52,
            paddingBottom: 28,
          }}
        >
          {/* Back button */}
          <div className="absolute top-10 left-4">
            <BackButton onBack={onBack} />
          </div>

          {/* "This is you" badge */}
          {isMe && (
            <div className="absolute top-10 right-4">
              <button
                onClick={onGoMyProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-transform"
                style={{ background: "#D95F2B", color: "#fff", boxShadow: "0 2px 8px rgba(217,95,43,0.3)" }}
              >
                My Profile →
              </button>
            </div>
          )}

          <div className="flex flex-col items-center text-center px-6">
            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-full mb-4 anim-scale-in"
              style={{
                width: 88, height: 88,
                background: isMe
                  ? "linear-gradient(145deg,#E8703A,#C84E1E)"
                  : "linear-gradient(145deg,#6A8FBF,#3A5F9F)",
                boxShadow: "0 6px 24px rgba(42,31,20,0.2)",
                animationDelay: "80ms",
              }}
            >
              <span className="text-4xl font-bold text-white">{initial}</span>
            </div>

            {/* Name */}
            <h1
              className="text-2xl font-bold mb-1 anim-fade-up"
              style={{ fontFamily: "Fraunces, serif", color: "#2A1F14", animationDelay: "120ms" }}
            >
              {name}
            </h1>

            {/* Masked email */}
            <p className="text-sm mb-3 anim-fade-up" style={{ color: "#8A7A6A", animationDelay: "160ms" }}>
              {maskedEmail}
            </p>

            {/* Badge */}
            <div className="mb-3 anim-fade-up" style={{ animationDelay: "200ms" }}>
              <VerifiedBadge email={email} size="md" />
            </div>

            {campus && (
              <p className="text-xs leading-relaxed max-w-[240px] anim-fade-up" style={{ color: "#8A7A6A", animationDelay: "240ms" }}>
                Campus Verified — posted from a university .edu account.
              </p>
            )}

            {/* Rank banner */}
            {userRank > 0 && (
              <div
                className="flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl anim-scale-in"
                style={{
                  background: userRank === 1
                    ? "linear-gradient(135deg,#FFF4D0,#FFE899)"
                    : "rgba(255,255,255,0.7)",
                  border: userRank === 1 ? "1px solid #F5C518" : "1px solid #EDE6DE",
                  animationDelay: "280ms",
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {userRank === 1 ? "🏆" : userRank === 2 ? "🥈" : userRank === 3 ? "🥉" : "🎖️"}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: userRank === 1 ? "#8A5C00" : "#4A3A2A" }}
                >
                  #{userRank} of {totalUsers} chefs
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div
          className="mx-5 -mt-4 rounded-2xl overflow-hidden grid grid-cols-3 shadow-sm relative z-10 anim-scale-in flex-shrink-0"
          style={{ background: "#fff", border: "1px solid #EDE6DE", animationDelay: "180ms" }}
        >
          {[
            { label: "Recipes", value: String(recipes.length), icon: "📋" },
            { label: "Avg Rating", value: avgRating, icon: "⭐" },
            { label: "Total Votes", value: totalVotes >= 1000 ? `${(totalVotes / 1000).toFixed(1)}k` : String(totalVotes), icon: "🗳️" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-4"
              style={{ borderRight: i < 2 ? "1px solid #EDE6DE" : "none" }}
            >
              <span className="text-lg mb-0.5">{s.icon}</span>
              <span className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "#D95F2B" }}>
                {s.value}
              </span>
              <span className="text-[10px] mt-0.5" style={{ color: "#9B8E84" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Recipe list ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
          <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B8E84" }}>
            {isMe ? "YOUR RECIPES" : `${name.split(" ")[0].toUpperCase()}'S RECIPES`}
          </p>

          {recipes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 64, height: 64, background: "#F0EAE1" }}
              >
                <span style={{ fontSize: 28 }}>🍽️</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#9B8E84" }}>No recipes shared yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 anim-stagger">
              {recipes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onOpenDetail(r.id)}
                  className="flex gap-3 rounded-3xl overflow-hidden text-left active:scale-[0.98] transition-transform w-full"
                  style={{
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(42,31,20,0.06), 0 4px 14px rgba(42,31,20,0.08)",
                  }}
                >
                  {/* Thumbnail */}
                  <div className="w-24 flex-shrink-0 bg-amber-50" style={{ minHeight: 88 }}>
                    <img src={r.photo} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 py-3 pr-3 min-w-0">
                    <p
                      className="text-sm font-bold leading-snug mb-1 truncate"
                      style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}
                    >
                      {r.title}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={r.rating} size={11} />
                      <span className="text-xs font-bold" style={{ color: "#2A1F14" }}>{r.rating}</span>
                      <span className="text-[10px]" style={{ color: "#9B8E84" }}>({r.ratingCount})</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CostBadge cost={r.cost} />
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "#F0EAE1", color: "#7A6A5A" }}
                      >
                        {r.equipmentIcon} {r.equipment}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "#F0EAE1", color: "#7A6A5A" }}
                      >
                        {r.cuisine}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex items-center pr-3 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8BDB5" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="h-6" />
        </div>
      </div>
    </Shell>
  );
}
