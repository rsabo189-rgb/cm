import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FULL_TEXT = "What if the brief was the only bottleneck?";

const MONO =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
const SANS =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// Minimal lucide-style icon wrapper
const Icon: React.FC<{
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  children: React.ReactNode;
}> = ({ size = 24, stroke = "white", strokeWidth = 2, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PlusIcon = () => (
  <Icon size={30}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const GridIcon = () => (
  <Icon size={26}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </Icon>
);

const BrainIcon = () => (
  <Icon size={26}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </Icon>
);

const XIcon = () => (
  <Icon size={20} strokeWidth={2.4}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

const ChevronDown = () => (
  <Icon size={22} stroke="rgba(255,255,255,0.7)">
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

const ArrowUp = () => (
  <Icon size={26} stroke="rgba(255,255,255,0.95)" strokeWidth={2.2}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </Icon>
);

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Box entrance: spring scale + slide up + fade ---
  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });
  const boxScale = interpolate(enter, [0, 1], [0.94, 1]);
  const boxY = interpolate(enter, [0, 1], [36, 0]);
  const boxOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bottom controls fade in slightly after the box
  const controlsOpacity = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Typing ---
  const TYPE_START = 32;
  const FRAMES_PER_CHAR = 1.4;
  const visibleCount = Math.max(
    0,
    Math.min(
      FULL_TEXT.length,
      Math.floor((frame - TYPE_START) / FRAMES_PER_CHAR),
    ),
  );
  const visibleText = FULL_TEXT.slice(0, visibleCount);
  const typingDone = visibleCount >= FULL_TEXT.length;

  // Cursor: solid while typing, blinks once finished
  const cursorVisible = typingDone
    ? Math.floor((frame - (TYPE_START + FULL_TEXT.length * FRAMES_PER_CHAR)) / 16) % 2 === 0
    : true;

  const boxWidth = width * 0.82;
  const boxHeight = height * 0.4;

  const controlBorder = "1px solid rgba(255,255,255,0.14)";

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: boxWidth,
          height: boxHeight,
          opacity: boxOpacity,
          transform: `translateY(${boxY}px) scale(${boxScale})`,
          background: "#0B0B0C",
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 30,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 48px 40px 48px",
          boxSizing: "border-box",
        }}
      >
        {/* Prompt text + cursor */}
        <div
          style={{
            fontFamily: SANS,
            fontSize: 54,
            fontWeight: 500,
            color: "rgba(255,255,255,0.96)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            letterSpacing: -0.5,
          }}
        >
          <span>{visibleText}</span>
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 52,
              marginLeft: 6,
              background: "rgba(255,255,255,0.9)",
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>

        {/* Controls row */}
        <div
          style={{
            opacity: controlsOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left group */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Plus + Tools (segmented) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: controlBorder,
                borderRadius: 16,
                height: 64,
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: "100%" }}>
                <PlusIcon />
              </div>
              <div style={{ width: 1, height: "60%", background: "rgba(255,255,255,0.14)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 22px", height: "100%" }}>
                <GridIcon />
                <span style={{ fontFamily: MONO, fontSize: 26, color: "rgba(255,255,255,0.92)" }}>Tools</span>
              </div>
            </div>

            {/* CM Brain pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 64,
                padding: "0 22px",
                background: "#1A6CFF",
                borderRadius: 16,
              }}
            >
              <BrainIcon />
              <span style={{ fontFamily: MONO, fontSize: 26, color: "white", fontWeight: 500 }}>CM Brain</span>
              <span style={{ display: "flex", marginLeft: 4, opacity: 0.9 }}>
                <XIcon />
              </span>
            </div>
          </div>

          {/* Right group */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Model dropdown */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 64,
                padding: "0 24px",
                border: controlBorder,
                borderRadius: 16,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 26, color: "rgba(255,255,255,0.92)" }}>Sonnet 4.6</span>
              <ChevronDown />
            </div>

            {/* Send button */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowUp />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
