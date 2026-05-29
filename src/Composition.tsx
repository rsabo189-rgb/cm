import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slowly rotate the gradient hue across the whole video.
  const hue = interpolate(frame, [0, durationInFrames], [220, 280]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 12%) 0%, hsl(${
          hue + 40
        }, 70%, 22%) 100%)`,
      }}
    />
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven entrance for a bouncy scale-in.
  const enter = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const translateY = interpolate(enter, [0, 1], [40, 0]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        fontSize: 110,
        fontWeight: 800,
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: -2,
        textShadow: "0 10px 40px rgba(0,0,0,0.4)",
      }}
    >
      Hello, Remotion 👋
    </div>
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        fontSize: 38,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        marginTop: 24,
      }}
    >
      Video made with React, rendered frame by frame
    </div>
  );
};

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
      {[0, 1, 2].map((i) => {
        const bounce = spring({
          frame: frame - i * 6,
          fps,
          config: { damping: 8, stiffness: 200 },
        });
        const y = interpolate(bounce, [0, 1], [0, -30]);
        return (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: `hsl(${190 + i * 30}, 90%, 60%)`,
              transform: `translateY(${y}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const MyComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Sequence layout="none">
          <Title />
        </Sequence>
        <Sequence from={0.5 * fps} layout="none">
          <Subtitle />
        </Sequence>
        <Sequence from={1 * fps} layout="none">
          <Dots />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
