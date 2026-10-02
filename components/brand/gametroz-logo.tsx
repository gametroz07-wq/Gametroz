import { cn } from "@/lib/utils";

type GametrozLogoProps = {
  /** Unique per instance on a page: SVG gradient/filter ids are global. */
  id: string;
  /** Adds the blue/purple neon halo behind the wordmark (for large, dark placements). */
  halo?: boolean;
  className?: string;
};

const WIDTH = 640;
const HEIGHT = 170;
const BASELINE = 118;
const TEXT_X = 34;
const TEXT_LENGTH = 572;

/**
 * GAMETROZ wordmark: retro arcade / synthwave chrome.
 * Layers (back to front): halo → neon glow → 3D extrusion → chrome fill → retro bands → gloss → edge.
 * Pure SVG + the self-hosted Orbitron font (--font-logo), so it stays sharp at any size and needs
 * no external assets.
 *
 * The word exists once, as a <text> in <defs>; every layer is a <use> of it. Text extraction and
 * screen readers therefore see one "GAMETROZ", not one per layer, and the whole SVG has one
 * accessible name ("Gametroz") with the layers hidden from assistive technology.
 */
export function GametrozLogo({ id, halo = false, className }: GametrozLogoProps) {
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  // One layer of the wordmark. Paint (fill, stroke) is inherited by the referenced <text>.
  const text = (props: React.SVGProps<SVGUseElement>) => <use href={`#${ref("word")}`} {...props} />;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Gametroz"
      className={cn("h-auto overflow-visible", className)}
    >
      <defs>
        <text
          id={ref("word")}
          x={TEXT_X}
          y={BASELINE}
          textLength={TEXT_LENGTH}
          lengthAdjust="spacingAndGlyphs"
          style={{ fontFamily: "var(--font-logo), 'Arial Black', sans-serif", fontWeight: 900, fontSize: 104, letterSpacing: "0.02em" }}
        >
          GAMETROZ
        </text>
        {/* Chrome: electric cyan sky → bright horizon glint → magenta/purple floor. */}
        <linearGradient id={ref("chrome")} x1="0" y1="34" x2="0" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0feff" />
          <stop offset="0.18" stopColor="#67f3ff" />
          <stop offset="0.44" stopColor="#1d4ed8" />
          <stop offset="0.5" stopColor="#0b1a5c" />
          <stop offset="0.52" stopColor="#fdf4ff" />
          <stop offset="0.6" stopColor="#e879f9" />
          <stop offset="0.82" stopColor="#a21caf" />
          <stop offset="1" stopColor="#ff7ae0" />
        </linearGradient>
        <linearGradient id={ref("extrude")} x1="0" y1="40" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b0a72" />
          <stop offset="1" stopColor="#12062e" />
        </linearGradient>
        <linearGradient id={ref("edge")} x1="0" y1="34" x2="0" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#a5f3fc" />
          <stop offset="1" stopColor="#f5d0fe" />
        </linearGradient>
        <linearGradient id={ref("gloss")} x1="0" y1="34" x2="0" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Retro horizontal bands that thicken toward the bottom, like a synthwave sun. */}
        <pattern id={ref("bands")} x="0" y="80" width={WIDTH} height="40" patternUnits="userSpaceOnUse">
          <rect y="2" width={WIDTH} height="1.5" fill="#12062e" opacity="0.55" />
          <rect y="11" width={WIDTH} height="2.5" fill="#12062e" opacity="0.55" />
          <rect y="21" width={WIDTH} height="3.5" fill="#12062e" opacity="0.55" />
          <rect y="32" width={WIDTH} height="4.5" fill="#12062e" opacity="0.55" />
        </pattern>
        <clipPath id={ref("lower")}>
          <rect x="0" y="80" width={WIDTH} height="60" />
        </clipPath>
        <clipPath id={ref("upper")}>
          <rect x="0" y="0" width={WIDTH} height="76" />
        </clipPath>
        <filter id={ref("glow")} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id={ref("halo")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6d28d9" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="1" stopColor="#080b12" stopOpacity="0" />
        </radialGradient>
      </defs>

      {halo && <ellipse cx={WIDTH / 2} cy={HEIGHT / 2} rx={WIDTH * 0.62} ry={HEIGHT * 0.9} fill={url("halo")} />}

      {/* Slant for speed. */}
      <g transform={`skewX(-9) translate(18 0)`} aria-hidden="true">
        {/* Neon glow: cyan above, magenta below. */}
        <g filter={url("glow")} opacity="0.85">
          {text({ fill: "#22d3ee", transform: "translate(0 -3)" })}
          {text({ fill: "#d946ef", transform: "translate(0 5)" })}
        </g>

        {/* 3D extrusion. */}
        {[7, 6, 5, 4, 3, 2, 1].map((step) => (
          <g key={step} transform={`translate(${step * 0.9} ${step * 1.3})`}>
            {text({ fill: url("extrude"), stroke: "#12062e", strokeWidth: 2 })}
          </g>
        ))}

        {/* Chrome face, bands, gloss and bright edge. */}
        {text({ fill: url("chrome") })}
        <g clipPath={url("lower")}>{text({ fill: url("bands") })}</g>
        <g clipPath={url("upper")}>{text({ fill: url("gloss") })}</g>
        {text({ fill: "none", stroke: url("edge"), strokeWidth: 1.6, strokeLinejoin: "round" })}
      </g>
    </svg>
  );
}
