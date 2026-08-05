/**
 * Shell — Full-Bleed Mobile Viewport Wrapper.
 * Fills 100% of the device screen seamlessly without bezels or outer margins.
 * Every screen renders inside this.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full min-h-[100dvh] h-[100dvh] flex flex-col relative overflow-hidden select-none bg-[#FDF8F2]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {children}
    </div>
  );
}
