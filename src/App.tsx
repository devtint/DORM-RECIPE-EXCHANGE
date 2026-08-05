import { useState, useEffect, useRef } from "react";
import type { Screen, NavTab, Recipe } from "./types";
import { RECIPES as SEED_RECIPES } from "./data/recipes";

// Screens
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OtpScreen from "./screens/OtpScreen";
import HomeScreen from "./screens/HomeScreen";
import FilterScreen from "./screens/FilterScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import SubmitScreen from "./screens/SubmitScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import SavedScreen from "./screens/SavedScreen";
import MyRecipesScreen from "./screens/MyRecipesScreen";
import EditRecipeScreen from "./screens/EditRecipeScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import ProfileScreen from "./screens/ProfileScreen";

interface PendingDelete {
  recipe: Recipe;
  secondsLeft: number;
}

export default function App() {
  // ── Navigation ──────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("splash");
  const [stack, setStack] = useState<Screen[]>([]);

  function push(s: Screen) {
    setStack((prev) => [...prev, screen]);
    setScreen(s);
  }

  function pop() {
    setStack((prev) => {
      const next = [...prev];
      setScreen(next.pop() ?? "home");
      return next;
    });
  }

  function navTo(tab: NavTab) {
    setStack([]);
    setScreen(tab);
  }

  // ── Auth & Profile state ──────────────────────────────────────────────────
  const [email, setEmail] = useState("mia@university.edu");
  const [userName, setUserName] = useState("Mia Wong");
  const [userAvatar, setUserAvatar] = useState("🧑‍🍳");
  const [userBio, setUserBio] = useState("Dorm chef exploring quick & delicious rice cooker recipes!");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // ── Mutable recipe state ─────────────────────────────────────────────────
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["1", "4"]));
  const [detailId, setDetailId] = useState("1");
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const [viewUserEmail, setViewUserEmail] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [localComments, setLocalComments] = useState<
    Record<string, { user: string; text: string; time: string }[]>
  >({});

  // ── Delete + undo ────────────────────────────────────────────────────────
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function deleteRecipe(id: string) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;

    // Remove immediately from list
    setRecipes((prev) => prev.filter((r) => r.id !== id));

    // Clear any existing timer
    if (deleteTimerRef.current) clearInterval(deleteTimerRef.current);

    setPendingDelete({ recipe, secondsLeft: 5 });

    deleteTimerRef.current = setInterval(() => {
      setPendingDelete((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          clearInterval(deleteTimerRef.current!);
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  }

  function undoDelete() {
    if (!pendingDelete) return;
    if (deleteTimerRef.current) clearInterval(deleteTimerRef.current);
    setRecipes((prev) => {
      // Restore recipe in its original position by id order
      const restored = [...prev, pendingDelete.recipe];
      restored.sort((a, b) => Number(a.id) - Number(b.id));
      return restored;
    });
    setPendingDelete(null);
  }

  // Clean up timer on unmount
  useEffect(() => () => { if (deleteTimerRef.current) clearInterval(deleteTimerRef.current); }, []);

  function updateRecipe(updated: Recipe) {
    setRecipes((prev) => prev.map((r) => r.id === updated.id ? updated : r));
  }

  // ── Filter / sort state ──────────────────────────────────────────────────
  const [searchQ, setSearchQ] = useState("");
  const [sortMode, setSortMode] = useState<"top" | "new">("top");
  const [filterEq, setFilterEq] = useState<string[]>([]);
  const [filterCuisine, setFilterCuisine] = useState<string[]>([]);
  const [costMax, setCostMax] = useState(1000);

  // ── Leaderboard tab ──────────────────────────────────────────────────────
  const [leaderTab, setLeaderTab] = useState<"week" | "month">("week");
  const [leaderMode, setLeaderMode] = useState<"recipes" | "users">("recipes");

  // ── Splash auto-advance ──────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(() => setScreen("login"), 2000);
    return () => clearTimeout(t);
  }, [screen]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredRecipes = recipes.filter((r) => {
    if (searchQ && !r.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterEq.length && !filterEq.includes(r.equipment)) return false;
    if (filterCuisine.length && !filterCuisine.includes(r.cuisine)) return false;
    const cost = parseFloat(r.cost.replace("฿", ""));
    if (cost > costMax) return false;
    return true;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) =>
    sortMode === "top" ? b.rating - a.rating : b.ratingCount - a.ratingCount,
  );

  const hasFilters = filterEq.length > 0 || filterCuisine.length > 0 || costMax < 1000;
  const filterCount = filterEq.length + filterCuisine.length + (costMax < 1000 ? 1 : 0);
  const detail = recipes.find((r) => r.id === detailId) ?? recipes[0];
  const myRecipes = recipes.filter((r) => r.isMine);
  const savedRecipes = recipes.filter((r) => savedIds.has(r.id));
  const avgRating = myRecipes.length
    ? (myRecipes.reduce((s, r) => s + r.rating, 0) / myRecipes.length).toFixed(1)
    : "—";

  // ── User rankings ────────────────────────────────────────────────────────
  const userRankings = (() => {
    const map: Record<string, { name: string; email: string; recipes: number; totalRating: number; totalVotes: number }> = {};
    for (const r of recipes) {
      if (!map[r.uploaderEmail]) {
        map[r.uploaderEmail] = { name: r.uploader, email: r.uploaderEmail, recipes: 0, totalRating: 0, totalVotes: 0 };
      }
      map[r.uploaderEmail].recipes += 1;
      map[r.uploaderEmail].totalRating += r.rating * r.ratingCount;
      map[r.uploaderEmail].totalVotes += r.ratingCount;
    }
    return Object.values(map)
      .map((u) => ({ ...u, avgRating: u.totalVotes ? u.totalRating / u.totalVotes : 0 }))
      .sort((a, b) => b.avgRating - a.avgRating);
  })();

  const myUserRank = userRankings.findIndex((u) => u.email === email) + 1;

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openDetail(id: string) {
    setDetailId(id);
    push("recipe-detail");
  }

  function openEdit(id: string) {
    setEditRecipeId(id);
    push("edit-recipe");
  }

  function openUserProfile(userEmail: string) {
    setViewUserEmail(userEmail);
    push("user-profile");
  }

  function addComment(recipeId: string, text: string) {
    setLocalComments((prev) => ({
      ...prev,
      [recipeId]: [...(prev[recipeId] ?? []), { user: "You", text, time: "just now" }],
    }));
  }

  function resetFilters() {
    setFilterEq([]);
    setFilterCuisine([]);
    setCostMax(1000);
  }

  // ── Screen routing ────────────────────────────────────────────────────────
  return (
    <>
      {(() => {
        switch (screen) {
          case "splash":
            return <SplashScreen />;

          case "login":
            return (
              <LoginScreen
                email={email}
                onEmailChange={setEmail}
                onSendOtp={() => push("otp")}
                onSignUp={() => push("signup")}
              />
            );

          case "signup":
            return (
              <SignUpScreen
                email={email}
                userName={userName}
                userAvatar={userAvatar}
                onEmailChange={setEmail}
                onNameChange={setUserName}
                onAvatarChange={setUserAvatar}
                onContinue={() => push("otp")}
                onLogin={() => { pop(); }}
                onBack={pop}
              />
            );

          case "otp":
            return (
              <OtpScreen
                email={email}
                otp={otp}
                onOtpChange={setOtp}
                onVerify={() => { setStack([]); setScreen("home"); }}
                onBack={pop}
              />
            );

          case "home":
            return (
              <HomeScreen
                recipes={sortedRecipes}
                savedIds={savedIds}
                searchQ={searchQ}
                sortMode={sortMode}
                hasFilters={hasFilters}
                filterCount={filterCount}
                onSearchChange={setSearchQ}
                onSortChange={setSortMode}
                onOpenFilter={() => push("filter")}
                onResetFilters={resetFilters}
                onOpenDetail={openDetail}
                onToggleSave={toggleSave}
                onSubmit={() => push("submit")}
                onNav={navTo}
              />
            );

          case "filter":
            return (
              <FilterScreen
                filterEq={filterEq}
                filterCuisine={filterCuisine}
                costMax={costMax}
                onFilterEqChange={setFilterEq}
                onFilterCuisineChange={setFilterCuisine}
                onCostMaxChange={setCostMax}
                onApply={pop}
                onReset={resetFilters}
              />
            );

          case "recipe-detail":
            return detail ? (
              <RecipeDetailScreen
                recipe={detail}
                saved={savedIds.has(detail.id)}
                userRating={userRatings[detail.id] ?? 0}
                extraComments={localComments[detail.id] ?? []}
                onBack={pop}
                onToggleSave={() => toggleSave(detail.id)}
                onRate={(n) => setUserRatings((prev) => ({ ...prev, [detail.id]: n }))}
                onAddComment={(text) => addComment(detail.id, text)}
                onViewProfile={openUserProfile}
              />
            ) : null;

          case "submit":
            return (
              <SubmitScreen
                onBack={pop}
                onSubmit={() => { setStack([]); setScreen("my-recipes"); }}
              />
            );

          case "edit-recipe": {
            const editRecipe = recipes.find((r) => r.id === editRecipeId);
            return editRecipe ? (
              <EditRecipeScreen
                recipe={editRecipe}
                onBack={pop}
                onSave={(updated) => { updateRecipe(updated); pop(); }}
              />
            ) : null;
          }

          case "user-profile": {
            const upe = viewUserEmail ?? "";
            const upRecipes = recipes.filter((r) => r.uploaderEmail === upe);
            const upName = upRecipes[0]?.uploader ?? upe.split("@")[0];
            const upRank = userRankings.findIndex((u) => u.email === upe) + 1;
            return (
              <UserProfileScreen
                name={upName}
                email={upe}
                recipes={upRecipes}
                isMe={upe === email}
                userRank={upRank}
                totalUsers={userRankings.length}
                onBack={pop}
                onOpenDetail={openDetail}
                onGoMyProfile={() => { pop(); navTo("profile"); }}
              />
            );
          }

          case "leaderboard":
            return (
              <LeaderboardScreen
                recipes={recipes}
                tab={leaderTab}
                mode={leaderMode}
                userRankings={userRankings}
                currentUserEmail={email}
                onTabChange={setLeaderTab}
                onModeChange={setLeaderMode}
                onOpenDetail={openDetail}
                onViewProfile={openUserProfile}
                onNav={navTo}
              />
            );

          case "saved":
            return (
              <SavedScreen
                recipes={savedRecipes}
                onOpenDetail={openDetail}
                onNav={navTo}
                onBrowse={() => navTo("home")}
              />
            );

          case "my-recipes":
            return (
              <MyRecipesScreen
                recipes={myRecipes}
                localComments={localComments}
                pendingDeleteId={pendingDelete?.recipe.id ?? null}
                onOpenDetail={openDetail}
                onEdit={openEdit}
                onDelete={deleteRecipe}
                onSubmit={() => push("submit")}
                onBack={pop}
              />
            );

          case "profile":
            return (
              <ProfileScreen
                email={email}
                userName={userName}
                userAvatar={userAvatar}
                userBio={userBio}
                recipeCount={myRecipes.length}
                avgRating={avgRating}
                savedCount={savedIds.size}
                userRank={myUserRank}
                totalUsers={userRankings.length}
                onMyRecipes={() => push("my-recipes")}
                onSaved={() => navTo("saved")}
                onLogout={() => { setStack([]); setScreen("login"); }}
                onNav={navTo}
                onUpdateProfile={(name, avatar, bio) => {
                  setUserName(name);
                  setUserAvatar(avatar);
                  setUserBio(bio);
                }}
              />
            );

          default:
            return null;
        }
      })()}

      {/* ── Undo delete toast ─────────────────────────────────────────────── */}
      {pendingDelete && (
        <div
          className="fixed bottom-24 left-0 right-0 flex justify-center px-5 z-50"
          style={{ animation: "fade-up 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full max-w-[350px]"
            style={{
              background: "#2A1F14",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            }}
          >
            {/* Countdown ring */}
            <div className="relative flex-shrink-0" style={{ width: 32, height: 32 }}>
              <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                <circle
                  cx="16" cy="16" r="13"
                  fill="none"
                  stroke="#D95F2B"
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - pendingDelete.secondsLeft / 5)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 16 16)"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
                style={{ color: "#fff" }}
              >
                {pendingDelete.secondsLeft}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                "{pendingDelete.recipe.title}" deleted
              </p>
            </div>

            <button
              onClick={undoDelete}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs active:scale-95 transition-transform"
              style={{ background: "#D95F2B", color: "#fff" }}
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
