import Shell from "../components/Shell";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";

interface Props {
  email: string;
  onEmailChange: (v: string) => void;
  onContinue: () => void;
  onLogin: () => void;
  onBack: () => void;
}

export default function SignUpScreen({ email, onEmailChange, onContinue, onLogin, onBack }: Props) {
  const isCampus = email.endsWith(".edu");
  const canContinue = email.trim().includes("@");

  return (
    <Shell>
      <div
        className="w-full flex-shrink-0"
        style={{ height: 6, background: "linear-gradient(90deg,#D95F2B,#F5A31A,#D95F2B)" }}
      />

      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
        <div className="mb-8">
          <BackButton onBack={onBack} />
        </div>

        <h1 className="text-3xl font-bold mb-1.5" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
          Create account
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#8A7A6A" }}>
          Join your campus food community. Use a university email to unlock{" "}
          <span style={{ color: "#8A5C00", fontWeight: 700 }}>Campus Verified</span> status.
        </p>

        {/* Campus badge preview */}
        {isCampus && (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl mb-5"
            style={{ background: "linear-gradient(135deg,#FFF9E6,#FFF2C8)", border: "1px solid #F5D06060" }}
          >
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xs font-bold" style={{ color: "#8A5C00" }}>Campus Verified detected!</p>
              <p className="text-xs" style={{ color: "#A87820" }}>Your recipes will show a gold badge.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <InputField
            label="Email address"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="you@university.edu"
            hint="A one-time code will be sent here to verify your email."
          />

          <button
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: canContinue ? "linear-gradient(135deg,#E8703A,#C84E1E)" : "#E5DDD4",
              color: canContinue ? "#fff" : "#9B8E84",
              boxShadow: canContinue ? "0 4px 16px rgba(217,95,43,0.3)" : "none",
              cursor: canContinue ? "pointer" : "default",
            }}
          >
            Continue
          </button>
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#8A7A6A" }}>
          Already have an account?{" "}
          <button onClick={onLogin} className="font-bold" style={{ color: "#D95F2B" }}>
            Log in
          </button>
        </p>
      </div>
    </Shell>
  );
}
