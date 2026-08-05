/**
 * Shell — mobile viewport wrapper.
 * Constrains to 390×844, centers on desktop, handles safe-area insets.
 * Every screen renders inside this.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex justify-center items-start"
      style={{ background: "#B8AFA8", minHeight: "100dvh" }}
    >
      <div
        className="w-full max-w-[390px] flex flex-col relative overflow-hidden"
        style={{
          height: "100dvh",
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
