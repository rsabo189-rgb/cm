import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const INPUT_TEXT = "I need to budget out a 30s production for a Pepsi commercial.";

const SANS =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const BLUE = "#4f86ff";

// ---- Icon helpers ----
const Icon: React.FC<{
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  children: React.ReactNode;
}> = ({ size = 24, stroke = "white", strokeWidth = 2, fill = "none", children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const EnterIcon = ({ color }: { color: string }) => (
  <Icon size={22} stroke={color} strokeWidth={2}>
    <polyline points="9 10 4 15 9 20" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </Icon>
);

const PlusIcon = ({ color = "rgba(255,255,255,0.7)" }) => (
  <Icon size={26} stroke={color}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const SearchIcon = ({ color = "rgba(255,255,255,0.7)" }) => (
  <Icon size={24} stroke={color}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

const SlidersIcon = ({ color = "rgba(255,255,255,0.8)" }) => (
  <Icon size={24} stroke={color}>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </Icon>
);

const CalcIcon = ({ color }: { color: string }) => (
  <Icon size={22} stroke={color}>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </Icon>
);

const SparkleIcon = ({ color = "rgba(255,255,255,0.8)" }) => (
  <Icon size={22} stroke={color}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
  </Icon>
);

const XIcon = ({ color }: { color: string }) => (
  <Icon size={20} stroke={color} strokeWidth={2.2}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

const CopyIcon = () => (
  <Icon size={26} stroke="rgba(255,255,255,0.45)">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Icon>
);

const ThumbUp = () => (
  <Icon size={26} stroke="rgba(255,255,255,0.45)">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </Icon>
);

const ThumbDown = () => (
  <Icon size={26} stroke="rgba(255,255,255,0.45)">
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
  </Icon>
);

const RotateIcon = () => (
  <Icon size={26} stroke="rgba(255,255,255,0.45)">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

const ArrowUpSend = () => (
  <Icon size={26} stroke="#0a0a0a" strokeWidth={2.4}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </Icon>
);

// Mouse pointer (tip at 0,0)
const Cursor: React.FC<{ scale: number }> = ({ scale }) => (
  <svg width={34} height={50} viewBox="0 0 17 25" style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
    <path
      d="M0 0 L0 18 L4.8 13.6 L7.6 20 L10.4 18.8 L7.6 12.6 L13 12.6 Z"
      fill="white"
      stroke="black"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Option row ----
const Option: React.FC<{ label: string; selected: number }> = ({ label, selected }) => {
  const color = interpolateColor(selected);
  return (
    <div
      style={{
        height: 78,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingLeft: 30,
        marginBottom: 16,
        border: `1.5px solid rgba(${lerp(255, 79, selected)},${lerp(255, 134, selected)},${lerp(255, 255, selected)},${0.1 + selected * 0.6})`,
        background: `rgba(79,134,255,${selected * 0.08})`,
        boxShadow: selected > 0 ? `0 0 ${selected * 24}px rgba(79,134,255,${selected * 0.22})` : "none",
      }}
    >
      <EnterIcon color={color} />
      <span style={{ fontSize: 30, color, fontWeight: selected > 0.5 ? 500 : 400 }}>{label}</span>
    </div>
  );
};

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const interpolateColor = (t: number) =>
  `rgb(${lerp(220, 79, t)},${lerp(220, 134, t)},${lerp(225, 255, t)})`;

export const BudgetBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Whole UI fade-in
  const uiOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Typing into the input box
  const TYPE_START = 14;
  const FPC = 1.15;
  const visibleCount = Math.max(
    0,
    Math.min(INPUT_TEXT.length, Math.floor((frame - TYPE_START) / FPC)),
  );
  const typedText = INPUT_TEXT.slice(0, visibleCount);
  const typingDoneFrame = TYPE_START + INPUT_TEXT.length * FPC;
  const typingDone = visibleCount >= INPUT_TEXT.length;
  const textCursorVisible = typingDone
    ? Math.floor((frame - typingDoneFrame) / 16) % 2 === 0
    : true;

  // Mouse cursor: appears after typing, glides to the Video option, clicks
  const MOUSE_START = typingDoneFrame + 6;
  const MOUSE_ARRIVE = MOUSE_START + 24;
  const moveT = interpolate(frame, [MOUSE_START, MOUSE_ARRIVE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  // Path from near the input box up to the Video option
  const mouseX = interpolate(moveT, [0, 1], [880, 470]);
  const mouseY = interpolate(moveT, [0, 1], [880, 372]);
  const clickScale = interpolate(
    frame,
    [MOUSE_ARRIVE - 1, MOUSE_ARRIVE + 3, MOUSE_ARRIVE + 7],
    [1, 0.82, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const mouseOpacity = interpolate(frame, [MOUSE_START - 6, MOUSE_START], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Video selection state (0 -> 1) triggered on click
  const SELECT_FRAME = MOUSE_ARRIVE + 2;
  const videoSelected = interpolate(frame, [SELECT_FRAME, SELECT_FRAME + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Input box entrance
  const inputSpring = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const inputY = interpolate(inputSpring, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: SANS, opacity: uiOpacity }}>
      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 116,
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 46,
        }}
      >
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 42, color: "white" }}>
          W
        </span>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
          <PlusIcon />
          <SearchIcon />
        </div>
        <div
          style={{
            marginTop: "auto",
            marginBottom: 34,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.85)",
            fontSize: 22,
          }}
        >
          R
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: "absolute", left: 116, right: 0, top: 0, bottom: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 1380, paddingTop: 60 }}>
          <p style={{ fontSize: 31, lineHeight: 1.5, color: "rgba(255,255,255,0.82)", margin: 0 }}>
            Welcome to the <strong style={{ color: "white" }}>CM Production &amp; Post Budget Builder</strong>.
          </p>
          <p style={{ fontSize: 31, lineHeight: 1.5, color: "rgba(255,255,255,0.82)", margin: "28px 0 0" }}>
            I&apos;ll help you put together a ballpark budget in just a few questions. All figures are
            planning estimates, not final bids.
          </p>
          <p style={{ fontSize: 31, lineHeight: 1.5, color: "rgba(255,255,255,0.82)", margin: "28px 0 30px" }}>
            Let&apos;s start: <strong style={{ color: "white" }}>What type of content are you producing?</strong>
          </p>

          <Option label="Video" selected={videoSelected} />
          <Option label="Photo" selected={0} />
          <Option label="Both (Video + Photo)" selected={0} />

          {/* Action icons */}
          <div style={{ display: "flex", gap: 32, marginTop: 18, marginBottom: 40 }}>
            <CopyIcon />
            <ThumbUp />
            <ThumbDown />
            <RotateIcon />
          </div>

          {/* Input box */}
          <div
            style={{
              transform: `translateY(${inputY}px)`,
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 28,
              padding: "34px 36px 26px",
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 0 60px rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: 34, color: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center" }}>
              <span>{typedText}</span>
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 36,
                  marginLeft: 4,
                  background: "rgba(255,255,255,0.9)",
                  opacity: textCursorVisible ? 1 : 0,
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <PlusIcon color="rgba(255,255,255,0.8)" />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <SlidersIcon />
                  <span style={{ fontSize: 28, color: "rgba(255,255,255,0.85)" }}>Tools</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CalcIcon color={BLUE} />
                  <span style={{ fontSize: 28, color: BLUE }}>Budget Builder</span>
                  <span style={{ display: "flex", marginLeft: 2 }}>
                    <XIcon color="rgba(255,255,255,0.5)" />
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <SparkleIcon />
                  <span style={{ fontSize: 28, color: "rgba(255,255,255,0.85)" }}>Haiku 4.5</span>
                </div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(255,255,255,0.25)",
                  }}
                >
                  <ArrowUpSend />
                </div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 22, color: "rgba(255,255,255,0.32)", marginTop: 18 }}>
            All figures are ballpark estimates, not final bids.
          </p>
        </div>
      </div>

      {/* Mouse cursor */}
      <div style={{ position: "absolute", left: mouseX, top: mouseY, opacity: mouseOpacity }}>
        <Cursor scale={clickScale} />
      </div>
    </AbsoluteFill>
  );
};
