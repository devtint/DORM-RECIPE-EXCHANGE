import { useState } from "react";

interface StarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (n: number) => void;
}

export default function Stars({ rating, size = 14, interactive = false, onRate }: StarsProps) {
  const [hovered, setHovered] = useState(0);
  const display = interactive && hovered ? hovered : rating;

  return (
    <span className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= Math.round(display);
        return (
          <span
            key={s}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? s === Math.round(display) : undefined}
            tabIndex={interactive ? 0 : undefined}
            onMouseEnter={() => interactive && setHovered(s)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(s)}
            onKeyDown={(e) => {
              if (!interactive) return;
              if (e.key === "Enter" || e.key === " ") onRate?.(s);
            }}
            style={{ cursor: interactive ? "pointer" : "default", display: "inline-flex" }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#F5A31A" : "none"}
              stroke={filled ? "#F5A31A" : "#D4C5A9"}
              strokeWidth="1.8"
              style={{ transition: "fill 0.1s, stroke 0.1s", transform: interactive && hovered === s ? "scale(1.15)" : "scale(1)", transitionProperty: "fill, stroke, transform" }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        );
      })}
    </span>
  );
}
