interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}

/** Labelled text input with consistent mobile UX styling. */
export default function InputField({ label, value, onChange, placeholder, type = "text", hint }: InputFieldProps) {
  const hasValue = value.length > 0;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-widest uppercase" style={{ color: "#9B8E84" }}>
        {label}
      </label>
      <div
        className="flex items-center rounded-2xl px-4 transition-all"
        style={{
          background: "#fff",
          border: `1.5px solid ${hasValue ? "#D95F2B" : "#E5DDD4"}`,
          boxShadow: hasValue ? "0 0 0 3px rgba(217,95,43,0.08)" : "none",
          height: 52,
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent"
          style={{ color: "#2A1F14" }}
          autoCapitalize="none"
          autoCorrect="off"
        />
        {hasValue && type === "email" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D95F2B" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {hint && <p className="text-xs" style={{ color: "#9B8E84" }}>{hint}</p>}
    </div>
  );
}
