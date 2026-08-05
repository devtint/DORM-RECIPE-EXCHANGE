/** Consistent 44×44 back chevron. Meets WCAG 2.5.5 touch target size. */
export default function BackButton({ onBack, light = false }: { onBack: () => void; light?: boolean }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center justify-center rounded-full flex-shrink-0 active:scale-90 transition-transform"
      style={{
        width: 44,
        height: 44,
        background: light ? "rgba(255,255,255,0.92)" : "#F0EAE1",
        backdropFilter: light ? "blur(6px)" : undefined,
        boxShadow: light ? "0 1px 6px rgba(0,0,0,0.12)" : undefined,
      }}
      aria-label="Go back"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={light ? "#2A1F14" : "#3D2E22"} strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
