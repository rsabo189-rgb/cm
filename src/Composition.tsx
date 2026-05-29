import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ *
 * Scene: recreation of the "Weavy"-style AI creation home screen.
 * Scripted interaction over 30s @ 30fps (900 frames):
 *   1. UI settles in.
 *   2. Cursor moves to the "Product Ad" industry chip and selects it.
 *   3. Cursor moves to the prompt box and types the Pepsi / Coachella brief.
 *   4. Cursor moves to "Generate" and hovers (ready to ship).
 * ------------------------------------------------------------------ */

const SERIF =
  'Georgia, "Times New Roman", "Iowan Old Style", serif';
const SANS =
  '-apple-system, "Helvetica Neue", "Segoe UI", system-ui, Roboto, sans-serif';

const PROMPT =
  "I want to make a 30 second Pepsi Ad, a woman finds a connection with a man while at Coachella music festival, they connect getting their favorite Pepsi drink.";

/* ----------------------------- icons ----------------------------- */

const Icon: React.FC<{
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  children: React.ReactNode;
}> = ({
  size = 22,
  stroke = "rgba(255,255,255,0.85)",
  strokeWidth = 1.7,
  fill = "none",
  children,
}) => (
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

const HomeIcon = (p: { stroke?: string }) => (
  <Icon stroke={p.stroke}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Icon>
);

const ProjectsIcon = (p: { stroke?: string }) => (
  <Icon stroke={p.stroke}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18" />
  </Icon>
);

const InspirationIcon = (p: { stroke?: string }) => (
  <Icon stroke={p.stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v3" />
    <path d="m8.5 13.5 3.5-3 3.5 3" />
  </Icon>
);

const PanelIcon = () => (
  <Icon size={20} stroke="rgba(255,255,255,0.6)">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size={20} stroke="rgba(255,255,255,0.6)">
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-3.8-3.8" />
  </Icon>
);

const PlusIcon = () => (
  <Icon size={18} stroke="rgba(255,255,255,0.75)">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const AspectIcon = () => (
  <Icon size={18} stroke="rgba(255,255,255,0.7)">
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
  </Icon>
);

const SparkleIcon = () => (
  <Icon size={17} stroke="#e6a866">
    <path d="M12 3l1.7 5 5 1.7-5 1.7L12 16.4l-1.7-5L5.3 9.7l5-1.7z" />
  </Icon>
);

const ChevronDown = () => (
  <Icon size={16} stroke="rgba(255,255,255,0.55)">
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

const ChevronRight = () => (
  <Icon size={17} stroke="#ffffff" strokeWidth={2}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

/* --------------------------- cursor ------------------------------- */

const CursorArrow: React.FC<{ pressed: boolean }> = ({ pressed }) => (
  <svg width={26} height={26} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      d="M5 2.5 19 12.2l-6.1.7 3.5 6.6-2.6 1.4-3.5-6.6L5 19.4z"
      fill="#ffffff"
      stroke="rgba(0,0,0,0.55)"
      strokeWidth={1}
      strokeLinejoin="round"
      opacity={pressed ? 0.9 : 1}
    />
  </svg>
);

/* ---------------------- animation helpers ------------------------- */

type Key = { f: number; x: number; y: number };

const CURSOR_KEYS: Key[] = [
  { f: 0, x: 990, y: 905 },
  { f: 28, x: 980, y: 880 },
  { f: 95, x: 732, y: 423 }, // Product Ad chip
  { f: 122, x: 732, y: 423 },
  { f: 185, x: 560, y: 706 }, // prompt box
  { f: 690, x: 560, y: 706 },
  { f: 722, x: 560, y: 706 },
  { f: 792, x: 1545, y: 810 }, // Generate
  { f: 900, x: 1545, y: 810 },
];

const cursorAt = (frame: number): { x: number; y: number } => {
  if (frame <= CURSOR_KEYS[0].f) {
    return { x: CURSOR_KEYS[0].x, y: CURSOR_KEYS[0].y };
  }
  const last = CURSOR_KEYS[CURSOR_KEYS.length - 1];
  if (frame >= last.f) return { x: last.x, y: last.y };
  for (let i = 0; i < CURSOR_KEYS.length - 1; i++) {
    const a = CURSOR_KEYS[i];
    const b = CURSOR_KEYS[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {
        easing: Easing.inOut(Easing.cubic),
      });
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
    }
  }
  return { x: last.x, y: last.y };
};

// Click moments (frame at which a press lands)
const CLICKS = [102, 192, 850];

/* ----------------------------- chips ------------------------------ */

const Chip: React.FC<{ label: string; selected?: boolean }> = ({
  label,
  selected,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: 17,
      lineHeight: 1,
      padding: "13px 22px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      color: selected ? "#fff" : "rgba(255,255,255,0.8)",
      background: selected
        ? "rgba(255,255,255,0.12)"
        : "rgba(255,255,255,0.02)",
      border: selected
        ? "1px solid rgba(255,255,255,0.75)"
        : "1px solid rgba(255,255,255,0.12)",
      boxShadow: selected
        ? "0 0 0 4px rgba(255,255,255,0.06), 0 6px 20px rgba(0,0,0,0.4)"
        : "none",
    }}
  >
    {label}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: 13,
      letterSpacing: 1.6,
      color: "rgba(255,255,255,0.34)",
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

/* ----------------------------- scene ------------------------------ */

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Whole-screen settle
  const uiOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const uiY = interpolate(frame, [0, 18], [14, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Cursor position + press feedback
  const cur = cursorAt(frame);
  let pressed = false;
  let pressScale = 1;
  for (const cf of CLICKS) {
    if (frame >= cf && frame <= cf + 9) {
      pressed = true;
      const t = (frame - cf) / 9;
      pressScale = interpolate(t, [0, 0.4, 1], [1, 0.82, 1]);
    }
  }

  // Selection / focus states driven by the clicks
  const productAdSelected = frame >= 102;
  const boxFocused = frame >= 192;
  const generateHover = frame >= 792;
  const generatePressed = frame >= 850 && frame <= 870;

  // Typing
  const TYPE_START = 205;
  const TYPE_END = 690;
  const typedCount =
    frame <= TYPE_START
      ? 0
      : frame >= TYPE_END
        ? PROMPT.length
        : Math.floor(
            ((frame - TYPE_START) / (TYPE_END - TYPE_START)) * PROMPT.length,
          );
  const typedText = PROMPT.slice(0, typedCount);
  const typingActive = frame >= TYPE_START && frame < TYPE_END;
  const caretOn =
    boxFocused && (typingActive || Math.floor(frame / 15) % 2 === 0);

  // Click ripple
  const ripple = (() => {
    for (const cf of CLICKS) {
      if (frame >= cf && frame <= cf + 22) {
        const t = (frame - cf) / 22;
        const k = CURSOR_KEYS.find((kk) => kk.f >= cf) ?? CURSOR_KEYS[0];
        // ripple where the press lands == current cursor pos
        return {
          x: cur.x,
          y: cur.y,
          r: interpolate(t, [0, 1], [6, 46]),
          o: interpolate(t, [0, 1], [0.5, 0]),
          _: k,
        };
      }
    }
    return null;
  })();

  const SIDEBAR = 288;

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0b",
        fontFamily: SANS,
        opacity: uiOpacity,
      }}
    >
      <div style={{ transform: `translateY(${uiY}px)`, width, height }}>
        {/* ----------------------- Sidebar ----------------------- */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDEBAR,
            height,
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* logo + top icons */}
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 30,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 34,
              color: "#fff",
            }}
          >
            W
          </div>
          <div style={{ position: "absolute", right: 56, top: 36 }}>
            <PanelIcon />
          </div>
          <div style={{ position: "absolute", right: 22, top: 36 }}>
            <SearchIcon />
          </div>

          {/* nav */}
          {/* active home pill */}
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 90,
              width: SIDEBAR - 24,
              height: 44,
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <NavItem top={90} active label="Home">
            <HomeIcon stroke="#fff" />
          </NavItem>
          <NavItem top={138} label="Projects">
            <ProjectsIcon stroke="rgba(255,255,255,0.7)" />
          </NavItem>
          <NavItem top={186} label="Inspiration">
            <InspirationIcon stroke="rgba(255,255,255,0.7)" />
          </NavItem>

          {/* projects section */}
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 258,
              fontSize: 12,
              letterSpacing: 1.6,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            PROJECTS
          </div>
          <ProjectRow top={296} color="#46d17e" label="Pepsi Summer 2026 – Feel…" />
          <ProjectRow top={340} color="#4aa6ff" label="Feel It First" />

          {/* user */}
          <div
            style={{
              position: "absolute",
              left: 24,
              top: height - 78,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              A
            </div>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>
              Creative Director
            </span>
          </div>
        </div>

        {/* ----------------------- Main area ----------------------- */}
        <div style={{ position: "absolute", left: 490, top: 188 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 92,
              lineHeight: 1,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            Hi Chris,
          </div>
          <div
            style={{
              fontSize: 50,
              fontWeight: 400,
              color: "rgba(255,255,255,0.92)",
              marginTop: 8,
              letterSpacing: -0.5,
            }}
          >
            what do you want to create?
          </div>
        </div>

        {/* Industries */}
        <div style={{ position: "absolute", left: 490, top: 372 }}>
          <Label>INDUSTRIES</Label>
          <div style={{ display: "flex", gap: 14 }}>
            <Chip label="Fashion Shoot" />
            <Chip label="Product Ad" selected={productAdSelected} />
            <Chip label="Lifestyle Campaign" />
            <Chip label="Social Launch" />
          </div>
        </div>

        {/* Inspiration */}
        <div style={{ position: "absolute", left: 490, top: 486 }}>
          <Label>INSPIRATION</Label>
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <Chip label="Golden Hour Campaign" />
            <Chip label="Dark Studio Editorial" />
            <Chip label="Urban Street Story" />
            <Chip label="Product Hero Shots" />
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <Chip label="Athlete in Motion" />
            <Chip label="Minimalist Beauty" />
            <Chip label="Neon Night City" />
            <Chip label="Nature & Wellness" />
            <Chip label="Social Vertical Launch" />
          </div>
        </div>

        {/* Prompt box */}
        <div
          style={{
            position: "absolute",
            left: 490,
            top: 658,
            width: 1150,
            height: 184,
            borderRadius: 18,
            border: boxFocused
              ? "1px solid rgba(255,255,255,0.28)"
              : "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.015)",
            boxShadow: boxFocused
              ? "0 0 0 4px rgba(255,255,255,0.03)"
              : "none",
          }}
        >
          {/* text / placeholder */}
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 26,
              right: 28,
              fontSize: 22,
              lineHeight: 1.45,
              color:
                typedCount > 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.32)",
            }}
          >
            {typedCount > 0 ? typedText : "Describe the scene, shot, mood, characters, styling, location…"}
            {boxFocused && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 22,
                  marginLeft: 1,
                  transform: "translateY(4px)",
                  background: "rgba(255,255,255,0.9)",
                  opacity: caretOn ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* toolbar */}
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <ToolButton>
              <PlusIcon />
              <span>Attach</span>
            </ToolButton>
            <ToolButton>
              <AspectIcon />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Aspect Ratio</span>
              <span style={{ color: "#fff", fontWeight: 500 }}>16:9</span>
              <ChevronDown />
            </ToolButton>
            <ToolButton>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Length</span>
              <span style={{ color: "#fff", fontWeight: 500 }}>30s</span>
              <ChevronDown />
            </ToolButton>

            <div style={{ flex: 1 }} />

            {/* Improve with AI */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 16px",
                borderRadius: 12,
                border: "1px solid rgba(230,168,102,0.4)",
                color: "#e6a866",
                fontSize: 16,
              }}
            >
              <SparkleIcon />
              <span>Improve with AI</span>
            </div>

            {/* Start blank */}
            <div
              style={{
                padding: "11px 16px",
                fontSize: 16,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Start blank
            </div>

            {/* Generate */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                borderRadius: 12,
                background: generatePressed ? "#473fce" : "#5b54e8",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                transform: generatePressed
                  ? "scale(0.97)"
                  : generateHover
                    ? "scale(1.03)"
                    : "scale(1)",
                boxShadow: generateHover
                  ? "0 0 0 4px rgba(91,84,232,0.25), 0 10px 30px rgba(91,84,232,0.4)"
                  : "0 6px 18px rgba(91,84,232,0.3)",
              }}
            >
              <span>Generate</span>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------- Click ripple ----------------------- */}
      {ripple && (
        <div
          style={{
            position: "absolute",
            left: ripple.x - ripple.r,
            top: ripple.y - ripple.r,
            width: ripple.r * 2,
            height: ripple.r * 2,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.8)",
            opacity: ripple.o,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ----------------------- Cursor ----------------------- */}
      <div
        style={{
          position: "absolute",
          left: cur.x,
          top: cur.y,
          transform: `scale(${pressScale})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          pointerEvents: "none",
        }}
      >
        <CursorArrow pressed={pressed} />
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------- subcomponents ------------------------ */

const NavItem: React.FC<{
  top: number;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ top, label, active, children }) => (
  <div
    style={{
      position: "absolute",
      left: 28,
      top: top + 10,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    {children}
    <span
      style={{
        fontSize: 17,
        color: active ? "#fff" : "rgba(255,255,255,0.7)",
        fontWeight: active ? 500 : 400,
      }}
    >
      {label}
    </span>
  </div>
);

const ProjectRow: React.FC<{ top: number; color: string; label: string }> = ({
  top,
  color,
  label,
}) => (
  <div
    style={{
      position: "absolute",
      left: 24,
      top,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
    />
    <span style={{ fontSize: 15.5, color: "rgba(255,255,255,0.78)" }}>
      {label}
    </span>
  </div>
);

const ToolButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "11px 16px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.1)",
      fontSize: 16,
      color: "rgba(255,255,255,0.85)",
    }}
  >
    {children}
  </div>
);
