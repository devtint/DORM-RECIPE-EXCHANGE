export function isCampusEmail(email: string) {
  return email.endsWith(".edu");
}

export function VerifiedBadge({ email, size = "sm" }: { email: string; size?: "sm" | "md" }) {
  const campus = isCampusEmail(email);
  const cls = size === "md"
    ? "px-3 py-1 text-xs gap-1.5"
    : "px-2 py-0.5 text-[10px] gap-1";

  if (campus) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-bold ${cls}`}
        style={{ background: "linear-gradient(135deg,#FFF4D0,#FFE8A0)", color: "#8A5C00", border: "1px solid #F5D06080" }}
        title="Verified university email"
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#F5A31A">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Campus Verified
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${cls}`}
      style={{ background: "linear-gradient(135deg,#E6EFFD,#C8DCFA)", color: "#1A4FAA", border: "1px solid #4A8FE040" }}
      title="Verified account"
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#4A8FE0">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      Verified
    </span>
  );
}

export function CostBadge({ cost }: { cost: string }) {
  return (
    <span
      className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: "#E6F4EA", color: "#256029", border: "1px solid #A8D5B080" }}
    >
      {cost}
    </span>
  );
}

export function EquipmentBadge({ icon, name }: { icon: string; name: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: "rgba(255,255,255,0.92)", color: "#2A1F14", border: "1px solid rgba(255,255,255,0.4)" }}
    >
      {icon} {name}
    </span>
  );
}
