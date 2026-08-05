/**
 * Shell — mobile viewport wrapper.
 * Constrains to 390px, centers on desktop with mobile shell frame, handles safe-area insets.
 * Every screen renders inside this.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex justify-center items-center select-none"
      style={{ background: "#1E1A17", minHeight: "100dvh", width: "100%" }}
    >
      <div
        className="w-full max-w-[390px] flex flex-col relative overflow-hidden shadow-2xl sm:rounded-[36px] sm:my-4 sm:border-[8px] sm:border-[#2A2420]"
        style={{
          height: "100dvh",
          maxHeight: "844px",
          background: "#FDF8F2",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
