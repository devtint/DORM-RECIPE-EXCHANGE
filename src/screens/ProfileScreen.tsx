import { useState } from "react";
import type { NavTab } from "../types";
import Shell from "../components/Shell";
import BottomNav from "../components/BottomNav";
import { VerifiedBadge, isCampusEmail } from "../components/Badges";

interface Props {
  email: string;
  userName: string;
  userAvatar: string;
  userBio: string;
  recipeCount: number;
  avgRating: string;
  savedCount: number;
  userRank: number;
  totalUsers: number;
  onMyRecipes: () => void;
  onSaved: () => void;
  onLogout: () => void;
  onNav: (tab: NavTab) => void;
  onUpdateProfile: (name: string, avatar: string, bio: string) => void;
}

const AVATAR_OPTIONS = ["🧑‍🍳", "🍳", "🍜", "🍕", "🍱", "🥗", "👩‍🍳", "👨‍🍳", "🌮", "🍔"];

const MENU = [
  { label: "My Submitted Recipes", icon: "📋", sub: "View & manage your recipes", key: "myRecipes", soon: false },
  { label: "Saved Recipes", icon: "🔖", sub: "Your bookmarked collection", key: "saved", soon: false },
  { label: "Notifications", icon: "🔔", sub: "Ratings and comments", key: "notif", soon: true },
  { label: "Help & Feedback", icon: "💬", sub: "Support and suggestions", key: "help", soon: true },
] as const;

export default function ProfileScreen({
  email, userName, userAvatar, userBio, recipeCount, avgRating, savedCount, userRank, totalUsers,
  onMyRecipes, onSaved, onLogout, onNav, onUpdateProfile,
}: Props) {
  const campus = isCampusEmail(email);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [editBio, setEditBio] = useState(userBio);
  const [showToast, setShowToast] = useState(false);

  function handleSaveProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    onUpdateProfile(editName.trim() || userName, editAvatar, editBio.trim());
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleMenu(key: string) {
    if (key === "myRecipes") onMyRecipes();
    else if (key === "saved") onSaved();
  }

  return (
    <Shell>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto">

          {/* Hero */}
          <div
            className="px-5 pt-14 pb-8 flex flex-col items-center text-center anim-fade-in relative"
            style={{ background: "linear-gradient(160deg,#FDF8F2 0%,#F2E4CF 60%,#EDD6B3 100%)" }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-full mb-3 shadow-lg relative"
              style={{
                width: 84, height: 84,
                background: "linear-gradient(145deg,#E8703A,#C84E1E)",
                boxShadow: "0 6px 20px rgba(217,95,43,0.35)",
              }}
            >
              <span style={{ fontSize: 40 }}>{userAvatar}</span>
            </div>

            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
              {userName}
            </h2>
            <p className="text-xs mb-2" style={{ color: "#8A7A6A" }}>{email.replace(/^(.).*(@.*)$/, "$1***$2")}</p>
            <VerifiedBadge email={email} size="md" />

            {/* Bio */}
            <p className="text-xs mt-3 leading-relaxed max-w-[280px] italic" style={{ color: "#5A4A3A" }}>
              "{userBio}"
            </p>

            {/* Edit Profile Button */}
            <button
              onClick={() => {
                setEditName(userName);
                setEditAvatar(userAvatar);
                setEditBio(userBio);
                setIsEditing(true);
              }}
              className="mt-4 px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
              style={{ background: "#2A1F14", color: "#FDF8F2" }}
            >
              <span>✏️</span> Edit Profile
            </button>

            {/* Rank banner */}
            {userRank > 0 && (
              <div
                className="flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl"
                style={{
                  background: userRank === 1
                    ? "linear-gradient(135deg,#FFF4D0,#FFE899)"
                    : userRank <= 3
                    ? "linear-gradient(135deg,#F0EAE1,#E4D9CC)"
                    : "rgba(255,255,255,0.7)",
                  border: userRank === 1 ? "1px solid #F5C518" : "1px solid #EDE6DE",
                }}
              >
                <span style={{ fontSize: 18 }}>
                  {userRank === 1 ? "🏆" : userRank === 2 ? "🥈" : userRank === 3 ? "🥉" : "🎖️"}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: userRank === 1 ? "#8A5C00" : "#4A3A2A" }}
                >
                  Ranked #{userRank} of {totalUsers} chefs
                </span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div
            className="mx-5 -mt-4 rounded-2xl overflow-hidden grid grid-cols-4 shadow-sm relative z-10 anim-scale-in"
            style={{ background: "#fff", border: "1px solid #EDE6DE" }}
          >
            {[
              { label: "Recipes", value: String(recipeCount), icon: "📋" },
              { label: "Avg Rating", value: avgRating !== "N/A" ? `${avgRating} ★` : "N/A", icon: "⭐" },
              { label: "Saved", value: String(savedCount), icon: "🔖" },
              { label: "Rank", value: userRank > 0 ? `#${userRank}` : "-", icon: "🏆" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="py-3 px-1 text-center"
                style={{ borderRight: i < 3 ? "1px solid #EDE6DE" : "none" }}
              >
                <p className="text-[11px] mb-0.5" style={{ color: "#8A7A6A" }}>{stat.label}</p>
                <p className="text-sm font-bold truncate" style={{ color: "#2A1F14" }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Menu list */}
          <div className="px-5 mt-6 mb-8 space-y-3">
            {MENU.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenu(item.key)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all active:scale-[0.98] text-left cursor-pointer"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE6DE",
                  opacity: item.soon ? 0.6 : 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "#FDF8F2" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm" style={{ color: "#2A1F14" }}>{item.label}</p>
                      {item.soon && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: "#EDD6B3", color: "#2A1F14" }}
                        >
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "#8A7A6A" }}>{item.sub}</p>
                  </div>
                </div>
                {!item.soon && <span className="text-base" style={{ color: "#8A7A6A" }}>›</span>}
              </button>
            ))}

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="w-full mt-4 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
              style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", color: "#D93025" }}
            >
              <span>🚪</span> Log Out
            </button>
          </div>

        </div>

        {/* ── Centered Edit Profile Modal Card ────────────────────────────────────────────── */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[100] flex items-center justify-center p-4 anim-fade-in">
            <div
              className="w-full max-w-md bg-[#FDF8F2] rounded-3xl p-5 shadow-2xl anim-scale-in max-h-[85vh] flex flex-col relative"
              style={{ border: "1px solid #EDE6DE", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
            >
              {/* Header with Title + Top Save Button + Close */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EDE6DE] flex-shrink-0">
                <h3 className="text-base font-bold" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
                  Edit Student Profile
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    className="px-4 py-1.5 rounded-full font-bold text-xs text-white shadow-md active:scale-95 transition-transform cursor-pointer"
                    style={{ background: "linear-gradient(135deg,#D95F2B,#C84E1E)" }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-bold text-sm text-[#8A7A6A] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-3 min-h-0">

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "#2A1F14" }}>
                      Choose Avatar
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditAvatar(emoji)}
                          className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-xl transition-all cursor-pointer ${
                            editAvatar === emoji ? "scale-110 shadow-md ring-2 ring-[#D95F2B]" : "opacity-70 bg-white"
                          }`}
                          style={{ background: editAvatar === emoji ? "#F2E4CF" : "#FFF" }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Name Input */}
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#2A1F14" }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#EDE6DE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D95F2B]"
                      style={{ color: "#2A1F14" }}
                      required
                    />
                  </div>

                  {/* Bio Textarea */}
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#2A1F14" }}>
                      Student Bio
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={2}
                      placeholder="Tell fellow dorm chefs about your favorite meals..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#EDE6DE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D95F2B] resize-none"
                      style={{ color: "#2A1F14" }}
                    />
                  </div>

                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 flex gap-3 flex-shrink-0 border-t border-[#EDE6DE] bg-[#FDF8F2]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-2xl font-bold text-sm bg-[#E5DDD4] text-[#2A1F14] active:scale-95 transition-transform cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl font-bold text-sm text-white shadow-lg active:scale-95 transition-transform cursor-pointer"
                    style={{ background: "linear-gradient(135deg,#D95F2B,#C84E1E)" }}
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <div
            className="fixed bottom-20 left-6 right-6 px-4 py-3 bg-[#2A1F14] text-white rounded-2xl shadow-xl flex items-center gap-3 z-[110] anim-fade-in"
          >
            <span style={{ fontSize: 20 }}>✅</span>
            <p className="text-xs font-bold">Profile updated successfully!</p>
          </div>
        )}

        <BottomNav active="profile" onNav={onNav} />
      </div>
    </Shell>
  );
}
