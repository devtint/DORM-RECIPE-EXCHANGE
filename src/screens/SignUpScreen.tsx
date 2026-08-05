import Shell from "../components/Shell";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";

interface Props {
  email: string;
  userName: string;
  userAvatar: string;
  onEmailChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onAvatarChange: (v: string) => void;
  onContinue: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const AVATAR_OPTIONS = ["🧑‍🍳", "🍳", "🍜", "🍕", "🍱", "🥗", "👩‍🍳", "👨‍🍳", "🌮", "🍔"];

export default function SignUpScreen({
  email,
  userName,
  userAvatar,
  onEmailChange,
  onNameChange,
  onAvatarChange,
  onContinue,
  onLogin,
  onBack,
}: Props) {
  const isCampus = email.endsWith(".edu");
  const canContinue = email.trim().includes("@") && userName.trim().length > 0;

  return (
    <Shell>
      <div
        className="w-full flex-shrink-0"
        style={{ height: 6, background: "linear-gradient(90deg,#D95F2B,#F5A31A,#D95F2B)" }}
      />

      <div className="flex-1 flex flex-col px-6 pt-6 pb-10 overflow-y-auto">
        <div className="mb-6 flex-shrink-0">
          <BackButton onBack={onBack} />
        </div>

        <h1 className="text-3xl font-bold mb-1.5" style={{ fontFamily: "Fraunces, serif", color: "#2A1F14" }}>
          Create account
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#8A7A6A" }}>
          Join your campus food community. Choose your avatar, name, and university email.
        </p>

        {/* Campus badge preview */}
        {isCampus && (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl mb-5 anim-fade-in"
            style={{ background: "linear-gradient(135deg,#FFF9E6,#FFF2C8)", border: "1px solid #F5D06060" }}
          >
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xs font-bold" style={{ color: "#8A5C00" }}>Campus Verified detected!</p>
              <p className="text-xs" style={{ color: "#A87820" }}>Your recipes will show a gold badge.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "#2A1F14" }}>
              Choose Profile Avatar
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onAvatarChange(emoji)}
                  className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-2xl transition-all cursor-pointer ${
                    userAvatar === emoji ? "scale-110 shadow-md ring-2 ring-[#D95F2B]" : "opacity-70 bg-white"
                  }`}
                  style={{ background: userAvatar === emoji ? "#F2E4CF" : "#FFF" }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name Input */}
          <InputField
            label="Full Name"
            type="text"
            value={userName}
            onChange={onNameChange}
            placeholder="e.g. Mia Wong"
          />

          {/* Email Address Input */}
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
            className="w-full py-4 mt-2 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
            style={{
              background: canContinue ? "linear-gradient(135deg,#E8703A,#C84E1E)" : "#E5DDD4",
              color: canContinue ? "#fff" : "#9B8E84",
              boxShadow: canContinue ? "0 4px 16px rgba(217,95,43,0.3)" : "none",
            }}
          >
            Continue
          </button>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "#8A7A6A" }}>
          Already have an account?{" "}
          <button onClick={onLogin} className="font-bold cursor-pointer" style={{ color: "#D95F2B" }}>
            Log in
          </button>
        </p>
      </div>
    </Shell>
  );
}
