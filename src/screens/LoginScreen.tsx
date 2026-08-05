import Shell from "../components/Shell";
import InputField from "../components/InputField";

interface Props {
  email: string;
  onEmailChange: (v: string) => void;
  onSendOtp: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ email, onEmailChange, onSendOtp, onSignUp }: Props) {
  const canContinue = email.trim().includes("@");

  return (
    <Shell>
      {/* Decorative top band */}
      <div
        className="w-full flex-shrink-0"
        style={{ height: 6, background: "linear-gradient(90deg, #D95F2B, #F5A31A, #D95F2B)" }}
      />

      <div className="flex-1 flex flex-col px-6 pt-10 pb-10">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 anim-fade-down">
          <div
            className="flex items-center justify-center rounded-2xl shadow-sm"
            style={{ width: 52, height: 52, background: "linear-gradient(145deg,#E8703A,#C84E1E)" }}
          >
            <span style={{ fontSize: 26 }}>🍲</span>
          </div>
          <span className="text-base font-bold" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
            Dorm Recipe Exchange
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-1.5 anim-fade-up" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14", animationDelay: "80ms" } as React.CSSProperties}>
          Sign in 👋
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#8A7A6A" }}>
          Sign in with your email — we'll send you a one-time code. No password needed.
        </p>

        <div className="flex flex-col gap-6 anim-fade-up" style={{ animationDelay: "160ms" } as React.CSSProperties}>
          <InputField
            label="Email address"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="you@university.edu"
          />

          <button
            onClick={onSendOtp}
            disabled={!canContinue}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: canContinue ? "linear-gradient(135deg,#E8703A,#C84E1E)" : "#E5DDD4",
              color: canContinue ? "#fff" : "#9B8E84",
              boxShadow: canContinue ? "0 4px 16px rgba(217,95,43,0.3)" : "none",
              cursor: canContinue ? "pointer" : "default",
            }}
          >
            Send Sign-In Code
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-7">
          <div className="flex-1 h-px" style={{ background: "#EDE6DE" }} />
          <span className="text-xs font-semibold" style={{ color: "#C8BDB5" }}>NEW HERE?</span>
          <div className="flex-1 h-px" style={{ background: "#EDE6DE" }} />
        </div>

        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl font-bold text-sm border-2 transition-all active:scale-[0.98]"
          style={{ borderColor: "#E5DDD4", color: "#D95F2B", background: "#FDF8F2" }}
        >
          Create an account
        </button>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8BDB5" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-xs text-center" style={{ color: "#C8BDB5" }}>
            Secure OTP login — no passwords stored
          </p>
        </div>
      </div>
    </Shell>
  );
}
