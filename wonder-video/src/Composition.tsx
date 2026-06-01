import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const SANS =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const INTENT = "Let's bring this to life:";
const TREATMENT =
  "30-second spot. Open on a rain-slicked city street at dusk — neon humming, bass building. A lone skater carves through stalled traffic, an ice-cold Pepsi in hand. Quick cuts land on the beat: condensation beading, the crowd parting, the crack of the can. He launches off a ramp and time freezes mid-air. Smash to the logo as the city lights surge. Super: “Thirsty for More.”";

// ---- Icon helper ----
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

const FolderIcon = ({ color }: { color: string }) => (
  <Icon size={24} stroke={color}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </Icon>
);

const PlusIcon = ({ color }: { color: string }) => (
  <Icon size={26} stroke={color}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const Sparkle = ({ color, size = 22 }: { color: string; size?: number }) => (
  <Icon size={size} stroke={color} strokeWidth={1.8}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </Icon>
);

const ClockIcon = ({ color }: { color: string }) => (
  <Icon size={22} stroke={color}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const SquareIcon = ({ color }: { color: string }) => (
  <Icon size={20} stroke={color}>
    <rect width="18" height="18" x="3" y="3" rx="3" />
  </Icon>
);

const ChevronDown = ({ color }: { color: string }) => (
  <Icon size={20} stroke={color}>
    <path d="m6 9 6 6 6-6" />
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

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Modal flies in ---
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 95, mass: 0.9 } });
  const modalY = interpolate(enter, [0, 1], [80, 0]);
  const modalScale = interpolate(enter, [0, 1], [0.92, 1]);
  const modalOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // --- Type the intent line ---
  const TYPE_START = 26;
  const FPC = 1.5;
  const intentCount = Math.max(0, Math.min(INTENT.length, Math.floor((frame - TYPE_START) / FPC)));
  const intentTyped = INTENT.slice(0, intentCount);
  const intentDoneFrame = TYPE_START + INTENT.length * FPC;
  const typingStarted = frame >= TYPE_START;

  // --- Paste the treatment block ---
  const PASTE_FRAME = intentDoneFrame + 14;
  const pasted = frame >= PASTE_FRAME;
  const pasteFlash = interpolate(frame, [PASTE_FRAME, PASTE_FRAME + 4, PASTE_FRAME + 14], [0, 0.1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const treatmentOpacity = interpolate(frame, [PASTE_FRAME, PASTE_FRAME + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text caret: blinks until paste, hidden after
  const caretVisible =
    !pasted && (frame < intentDoneFrame || Math.floor((frame - intentDoneFrame) / 14) % 2 === 0);

  // --- Mouse cursor to Create ---
  const MOUSE_START = PASTE_FRAME + 14;
  const MOUSE_ARRIVE = MOUSE_START + 26;
  const moveT = interpolate(frame, [MOUSE_START, MOUSE_ARRIVE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  const mouseX = interpolate(moveT, [0, 1], [820, 1300]);
  const mouseY = interpolate(moveT, [0, 1], [640, 792]);
  const mouseOpacity = interpolate(frame, [MOUSE_START - 6, MOUSE_START], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clickScale = interpolate(
    frame,
    [MOUSE_ARRIVE - 1, MOUSE_ARRIVE + 3, MOUSE_ARRIVE + 7],
    [1, 0.82, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Create button press + glow on click
  const CLICK = MOUSE_ARRIVE + 2;
  const btnPress = interpolate(frame, [CLICK - 2, CLICK + 2, CLICK + 8], [1, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnGlow = interpolate(frame, [CLICK, CLICK + 6, CLICK + 26], [0, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const border = "1px solid rgba(255,255,255,0.1)";
  const gray = "rgba(255,255,255,0.55)";
  const lightGray = "rgba(255,255,255,0.8)";

  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: SANS, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 1080,
          height: 640,
          opacity: modalOpacity,
          transform: `translateY(${modalY}px) scale(${modalScale})`,
          background: "#0B0B0C",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 22,
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
          padding: 34,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top row: Project Name + General */}
        <div style={{ display: "flex", border, borderRadius: 14, height: 84, overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 26 }}>
            <span style={{ fontSize: 30, color: gray }}>Project Name</span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ width: 320, display: "flex", alignItems: "center", gap: 14, paddingLeft: 26 }}>
            <FolderIcon color={gray} />
            <span style={{ fontSize: 26, color: lightGray }}>General</span>
          </div>
        </div>

        {/* Textarea */}
        <div
          style={{
            position: "relative",
            flex: 1,
            marginTop: 20,
            border,
            borderRadius: 14,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "white", opacity: pasteFlash }} />
          <div style={{ position: "relative", flex: 1 }}>
            {!typingStarted ? (
              <span style={{ fontSize: 26, color: "rgba(255,255,255,0.4)" }}>What are we making?</span>
            ) : (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.92)",
                  whiteSpace: "pre-wrap",
                }}
              >
                <span>{intentTyped}</span>
                {caretVisible && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 28,
                      marginLeft: 2,
                      marginBottom: -4,
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                )}
                {pasted && (
                  <span style={{ opacity: treatmentOpacity, color: "rgba(255,255,255,0.78)", fontSize: 24 }}>
                    {"\n\n" + TREATMENT}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* bottom icons inside textarea */}
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <PlusIcon color={lightGray} />
            <Sparkle color={lightGray} />
          </div>
        </div>

        {/* Bottom controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 22px", border, borderRadius: 14 }}>
              <ClockIcon color={gray} />
              <span style={{ fontSize: 28, color: lightGray }}>30s</span>
              <span style={{ marginLeft: 4 }}><ChevronDown color={gray} /></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 22px", border, borderRadius: 14 }}>
              <SquareIcon color={gray} />
              <span style={{ fontSize: 28, color: lightGray }}>16:9</span>
              <span style={{ marginLeft: 4 }}><ChevronDown color={gray} /></span>
            </div>
          </div>

          {/* Create button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 64,
              padding: "0 38px",
              background: "white",
              borderRadius: 40,
              transform: `scale(${btnPress})`,
              boxShadow: `0 0 ${btnGlow * 40}px rgba(255,255,255,${btnGlow * 0.6})`,
            }}
          >
            <Sparkle color="#0a0a0a" size={20} />
            <span style={{ fontSize: 28, color: "#0a0a0a", fontWeight: 500 }}>Create</span>
          </div>
        </div>
      </div>

      {/* Mouse cursor */}
      <div style={{ position: "absolute", left: mouseX, top: mouseY, opacity: mouseOpacity }}>
        <Cursor scale={clickScale} />
      </div>
    </AbsoluteFill>
  );
};
