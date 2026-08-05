import type { NavTab } from "../types";

const TABS: {
  id: NavTab;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    id: "home",
    label: "Home",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "#D95F2B" : "none"} stroke={a ? "#D95F2B" : "#9B8E84"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "leaderboard",
    label: "Top",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#D95F2B" : "#9B8E84"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "#D95F2B" : "none"} stroke={a ? "#D95F2B" : "#9B8E84"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#D95F2B" : "#9B8E84"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  active: NavTab;
  onNav: (tab: NavTab) => void;
}

export default function BottomNav({ active, onNav }: BottomNavProps) {
  return (
    <nav
      className="flex items-center flex-shrink-0"
      style={{
        borderTop: "1px solid #EDE6DE",
        background: "rgba(253,248,242,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
            style={{ minHeight: 56 }}
          >
            {/* Active pill indicator */}
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full anim-scale-in"
                style={{ width: 32, height: 3, background: "#D95F2B", borderRadius: "0 0 4px 4px" }}
              />
            )}
            <span
              className="mt-1 transition-transform duration-200"
              style={{ transform: isActive ? "scale(1.15)" : "scale(1)" }}
            >
              {t.icon(isActive)}
            </span>
            <span
              className="text-[10px] font-bold transition-colors duration-200"
              style={{ color: isActive ? "#D95F2B" : "#9B8E84" }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
