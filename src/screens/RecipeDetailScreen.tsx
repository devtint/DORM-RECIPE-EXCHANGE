import { useState } from "react";
import type { Recipe } from "../types";
import Shell from "../components/Shell";
import Stars from "../components/Stars";
import { VerifiedBadge, CostBadge } from "../components/Badges";
import BackButton from "../components/BackButton";

interface Props {
  recipe: Recipe;
  saved: boolean;
  userRating: number;
  extraComments: { user: string; text: string; time: string }[];
  onBack: () => void;
  onToggleSave: () => void;
  onRate: (n: number) => void;
  onAddComment: (text: string) => void;
  onViewProfile: (email: string) => void;
}

export default function RecipeDetailScreen({
  recipe: r, saved, userRating, extraComments,
  onBack, onToggleSave, onRate, onAddComment, onViewProfile,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const allComments = [...r.comments, ...extraComments];

  function submitComment() {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
  }

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* ── Hero photo ──────────────────────────────────────────────── */}
        <div className="relative flex-shrink-0 anim-fade-in" style={{ height: 280, background: "#E8DDD0" }}>
          <img
            src={r.photo}
            alt={r.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Multi-stop scrim for legibility */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(20,10,2,0.75) 0%, rgba(20,10,2,0.2) 50%, transparent 80%)" }}
          />

          {/* Top controls */}
          <div className="absolute top-10 left-4 right-4 flex items-center justify-between">
            <BackButton onBack={onBack} light />
            <button
              onClick={onToggleSave}
              className="flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                width: 44, height: 44,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
              }}
              aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? "#D95F2B" : "none"} stroke={saved ? "#D95F2B" : "#3D2E22"} strokeWidth="2.2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          </div>

          {/* Title + quick meta */}
          <div className="absolute bottom-4 left-5 right-5">
            <h1
              className="text-2xl font-bold text-white leading-tight mb-2"
              style={{ fontFamily: "Fraunces, serif", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
            >
              {r.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Stars rating={r.rating} size={13} />
              <span className="text-white text-xs font-bold opacity-90">{r.rating}</span>
              <span className="text-white text-xs opacity-60">({r.ratingCount})</span>
              <CostBadge cost={r.cost} />
            </div>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-0 divide-y divide-[#EDE6DE] anim-fade-up" style={{ animationDelay: "120ms" } as React.CSSProperties}>

          {/* Uploader — tappable to view their profile */}
          <button
            onClick={() => onViewProfile(r.uploaderEmail)}
            className="px-5 py-4 flex items-center justify-between w-full text-left active:bg-amber-50 transition-colors"
            style={{ background: "#fff" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                style={{ width: 42, height: 42, background: "linear-gradient(145deg,#6A8FBF,#3A5F9F)", color: "#fff" }}
              >
                {r.uploader.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold" style={{ color: "#2A1F14" }}>{r.uploader}</p>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8BDB5" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <p className="text-[10px]" style={{ color: "#9B8E84" }}>
                  {r.uploaderEmail.replace(/^(.).*(@.*)$/, "$1***$2")} · tap to view profile
                </p>
              </div>
            </div>
            <VerifiedBadge email={r.uploaderEmail} />
          </button>

          {/* Quick stats */}
          <div className="grid grid-cols-3" style={{ background: "#FDFAF6" }}>
            {[
              { label: "Equipment", value: `${r.equipmentIcon} ${r.equipment}` },
              { label: "Cuisine", value: r.cuisine },
              { label: "Cost", value: r.cost },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-3.5"
                style={{ borderRight: i < 2 ? "1px solid #EDE6DE" : "none" }}
              >
                <p className="text-xs font-bold mb-0.5" style={{ color: "#2A1F14" }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: "#9B8E84" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div className="px-5 py-5" style={{ background: "#fff" }}>
            <h2 className="text-base font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              Ingredients
            </h2>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#EDE6DE" }}>
              {r.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0"
                  style={{ borderColor: "#EDE6DE", background: i % 2 === 0 ? "#fff" : "#FDFAF6" }}
                >
                  <span className="text-sm" style={{ color: "#2A1F14" }}>{ing.name}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#F0EAE1", color: "#7A6A5A" }}
                  >
                    {ing.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="px-5 py-5" style={{ background: "#fff" }}>
            <h2 className="text-base font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              How to make it
            </h2>
            <div className="flex flex-col gap-5">
              {r.steps.map((step, i) => (
                <div key={i} className="flex gap-3.5">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                    style={{
                      width: 28, height: 28,
                      background: "linear-gradient(145deg,#E8703A,#C84E1E)",
                      color: "#fff",
                      boxShadow: "0 2px 6px rgba(217,95,43,0.3)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "#3D2E22", paddingTop: 4 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's notes */}
          {r.notes && (
            <div className="px-5 py-5" style={{ background: "#FFFBEE" }}>
              <div
                className="rounded-2xl p-4"
                style={{ border: "1px solid #F5D06055", background: "linear-gradient(135deg,#FFFDF0,#FFF8D6)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>💡</span>
                  <p className="text-[10px] font-bold tracking-widest" style={{ color: "#A86A00" }}>CHEF'S NOTES</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#5A3D00" }}>{r.notes}</p>
              </div>
            </div>
          )}

          {/* Rate it */}
          <div className="px-5 py-5" style={{ background: "#fff" }}>
            <h2 className="text-base font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              Rate this recipe
            </h2>
            <p className="text-xs mb-4" style={{ color: "#9B8E84" }}>
              {userRating === 0 ? "Tap a star to rate" : `You rated this ${userRating} / 5`}
            </p>
            <div className="flex items-center gap-1">
              <Stars rating={userRating} size={40} interactive onRate={onRate} />
            </div>
            {userRating > 0 && (
              <div
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "#FFF9EE", border: "1px solid #F5D06044" }}
              >
                <span>⭐</span>
                <p className="text-xs font-semibold" style={{ color: "#8A5C00" }}>
                  Thanks for rating! Your feedback helps fellow students.
                </p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="px-5 py-5" style={{ background: "#FDFAF6" }}>
            <h2 className="text-base font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              Comments{allComments.length > 0 ? ` (${allComments.length})` : ""}
            </h2>

            {allComments.length === 0 && (
              <p className="text-sm mb-4" style={{ color: "#9B8E84" }}>
                No comments yet — be the first!
              </p>
            )}

            {allComments.length > 0 && (
              <div className="flex flex-col gap-3 mb-5">
                {allComments.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3.5"
                    style={{ background: "#fff", border: "1px solid #EDE6DE" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center rounded-full text-[10px] font-bold"
                          style={{ width: 26, height: 26, background: "#F0EAE1", color: "#D95F2B" }}
                        >
                          {c.user.charAt(0)}
                        </div>
                        <span className="text-xs font-bold" style={{ color: "#2A1F14" }}>{c.user}</span>
                      </div>
                      <span className="text-[10px]" style={{ color: "#C8BDB5" }}>{c.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#3D2E22" }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input */}
            <div
              className="flex gap-2 rounded-2xl p-2"
              style={{ background: "#fff", border: "1px solid #EDE6DE" }}
            >
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                aria-label="Write a comment"
                className="flex-1 text-sm px-2 py-1.5 bg-transparent"
                style={{ color: "#2A1F14" }}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
              />
              <button
                onClick={submitComment}
                className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all active:scale-90"
                style={{
                  width: 40, height: 40,
                  background: commentText.trim() ? "linear-gradient(145deg,#E8703A,#C84E1E)" : "#F0EAE1",
                  boxShadow: commentText.trim() ? "0 2px 8px rgba(217,95,43,0.3)" : "none",
                }}
                aria-label="Send comment"
                disabled={!commentText.trim()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={commentText.trim() ? "#fff" : "#9B8E84"} strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            <div className="h-6" />
          </div>
        </div>
      </div>
    </Shell>
  );
}
