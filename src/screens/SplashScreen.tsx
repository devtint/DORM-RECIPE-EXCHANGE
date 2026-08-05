import Shell from "../components/Shell";

export default function SplashScreen() {
  return (
    <Shell>
      <div
        className="flex-1 flex flex-col items-center justify-center gap-8"
        style={{ background: "linear-gradient(160deg, #FDF8F2 0%, #F2E4CF 60%, #EDD6B3 100%)" }}
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-5">
          <div
            className="anim-float"
            style={{ animationDuration: "3s" }}
          >
            <div
              className="flex items-center justify-center shadow-xl anim-scale-in"
              style={{
                width: 96, height: 96,
                borderRadius: 28,
                background: "linear-gradient(145deg, #E8703A, #C84E1E)",
                boxShadow: "0 8px 32px rgba(200,78,30,0.35), 0 2px 8px rgba(200,78,30,0.2)",
              }}
            >
              <span style={{ fontSize: 46, lineHeight: 1 }}>🍲</span>
            </div>
          </div>

          <div className="text-center anim-fade-up" style={{ animationDelay: "150ms" }}>
            <h1
              className="font-bold leading-tight"
              style={{ fontFamily: "Fraunces, serif", color: "#2A1F14", fontSize: 30 }}
            >
              Dorm Recipe<br />Exchange
            </h1>
            <p className="mt-2 text-sm font-medium" style={{ color: "#8A7A6A", letterSpacing: "0.02em" }}>
              Cook smart. Eat well. Share more.
            </p>
          </div>
        </div>

        {/* Animated loader dots */}
        <div className="flex gap-1.5 items-center anim-fade-in" style={{ animationDelay: "400ms" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full animate-bounce"
              style={{
                width: 7, height: 7,
                background: i === 1 ? "#D95F2B" : "#E8A882",
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>

        {/* Version */}
        <p className="absolute bottom-8 text-xs" style={{ color: "#C8BDB5" }}>v1.0.0</p>
      </div>
    </Shell>
  );
}
