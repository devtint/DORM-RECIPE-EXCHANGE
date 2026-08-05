import { useRef, useEffect, useState } from "react";
import Shell from "../components/Shell";
import BackButton from "../components/BackButton";

interface Props {
  email: string;
  otp: string[];
  onOtpChange: (otp: string[]) => void;
  onVerify: () => void;
  onBack: () => void;
}

export default function OtpScreen({ email, otp, onOtpChange, onVerify, onBack }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const filled = otp.every((v) => v !== "");
  const [resent, setResent] = useState(false);

  // Focus first empty cell on mount
  useEffect(() => {
    const firstEmpty = otp.findIndex((v) => v === "");
    refs.current[firstEmpty === -1 ? 0 : firstEmpty]?.focus();
  }, []);

  function handleChange(raw: string, i: number) {
    // Handle paste of a full 6-digit code
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const next = [...otp];
      cleaned.split("").slice(0, 6).forEach((ch, j) => {
        if (j < 6) next[j] = ch;
      });
      onOtpChange(next);
      refs.current[Math.min(cleaned.length, 5)]?.focus();
      return;
    }
    const digit = cleaned.slice(-1);
    const next = [...otp];
    next[i] = digit;
    onOtpChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace") {
      if (otp[i]) {
        // Clear current cell
        const next = [...otp];
        next[i] = "";
        onOtpChange(next);
      } else if (i > 0) {
        // Move to previous cell and clear it
        const next = [...otp];
        next[i - 1] = "";
        onOtpChange(next);
        refs.current[i - 1]?.focus();
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
    if (e.key === "Enter" && filled) onVerify();
  }

  return (
    <Shell>
      <div className="flex-1 flex flex-col px-6 pt-12 pb-10">
        <div className="mb-8">
          <BackButton onBack={onBack} />
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
          style={{ background: "#FFF4D0" }}
        >
          <span className="text-3xl">📬</span>
        </div>

        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}
        >
          Check your email
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#8A7A6A" }}>
          We sent a 6-digit code to{" "}
          <strong style={{ color: "#2A1F14" }}>{email || "your email"}</strong>.
          It expires in 10 minutes.
        </p>

        {/* OTP cells */}
        <div className="flex gap-2.5 mb-8">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1} of 6`}
              value={v}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
              className="text-center text-2xl font-bold border-2 rounded-2xl transition-colors"
              style={{
                width: 44,
                height: 54,
                flexShrink: 0,
                flex: "1 1 0",
                minWidth: 0,
                borderColor: v ? "#D95F2B" : "#E5DDD4",
                background: v ? "#FFF0EA" : "#fff",
                color: "#2A1F14",
                caretColor: "#D95F2B",
                boxShadow: v ? "0 0 0 3px rgba(217,95,43,0.12)" : "none",
                animation: `fade-up 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both`,
              }}
            />
          ))}
        </div>

        <button
          onClick={onVerify}
          disabled={!filled}
          className="w-full py-4 rounded-2xl font-bold text-sm mb-4 transition-all"
          style={{
            background: filled ? "#D95F2B" : "#E5DDD4",
            color: filled ? "#fff" : "#8A7A6A",
            cursor: filled ? "pointer" : "default",
            boxShadow: filled ? "0 4px 14px rgba(217,95,43,0.3)" : "none",
          }}
        >
          Verify Code {filled ? "✓" : ""}
        </button>

        {resent ? (
          <p className="text-center text-sm font-semibold" style={{ color: "#2A6A2A" }}>
            ✓ New code sent — check your inbox.
          </p>
        ) : (
          <p className="text-center text-sm" style={{ color: "#8A7A6A" }}>
            Didn't receive it?{" "}
            <button
              className="font-bold"
              style={{ color: "#D95F2B" }}
              onClick={() => {
                onOtpChange(["", "", "", "", "", ""]);
                setResent(true);
                setTimeout(() => { refs.current[0]?.focus(); }, 50);
                setTimeout(() => setResent(false), 3000);
              }}
            >
              Resend code
            </button>
          </p>
        )}
      </div>
    </Shell>
  );
}
