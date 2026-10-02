import React, { useEffect, useRef, useState, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';
import signatureBeige from '../assets/swayam-signature-beige.png';
import signatureData from '../data/swayam-signature.json';

export interface StrokeDef {
  id: string;
  d: string;
  duration: number; // in seconds
}

export const SWAYAM_STROKES: StrokeDef[] = signatureData.strokes;

const DOT1 = { cx: 771, cy: 548, r: 22 };
const DOT2 = { cx: 835, cy: 555, r: 22 };

interface SignatureAnimationProps {
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}

export const SignatureAnimation: React.FC<SignatureAnimationProps> = ({
  className = "w-64 h-32",
  autoPlay = true,
  loop = true,
  onComplete,
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dot1Ref = useRef<SVGCircleElement | null>(null);
  const dot2Ref = useRef<SVGCircleElement | null>(null);

  const [penPos, setPenPos] = useState<{ x: number; y: number } | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const animFrameRef = useRef<number | null>(null);
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startSigningCycleRef = useRef<() => void>(() => {});

  const startSigningCycle = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }

    const paths = pathRefs.current;
    if (!paths.length || paths.some(p => !p)) {
      setTimeout(() => startSigningCycleRef.current(), 100);
      return;
    }

    // Pre-calculate path lengths
    const lengths = paths.map(p => (p ? p.getTotalLength() : 0));

    // Reset all paths to hidden (both dashoffset AND opacity so zero-length round caps never leak)
    paths.forEach((p, idx) => {
      if (p) {
        p.style.strokeDasharray = `${lengths[idx]}`;
        p.style.strokeDashoffset = `${lengths[idx]}`;
        p.style.opacity = '0';
      }
    });

    // Reset dots to hidden
    if (dot1Ref.current) {
      dot1Ref.current.style.opacity = '0';
      dot1Ref.current.setAttribute('r', '0');
    }
    if (dot2Ref.current) {
      dot2Ref.current.style.opacity = '0';
      dot2Ref.current.setAttribute('r', '0');
    }

    setFadeOpacity(1);
    setIsSigning(true);

    // Initial pen position at start of first stroke (Crown)
    try {
      const p0 = paths[0]?.getPointAtLength(0);
      if (p0) {
        setPenPos({ x: p0.x, y: p0.y });
      }
    } catch {}

    // Precise continuous choreography requested by user:
    // Crown -> Flight -> 'S' -> Flight -> 'w' -> 'a' -> 'y' -> 'a' -> 'm' -> Flight -> Underline -> Flight -> Dot 1 -> Flight -> Dot 2

    const FLIGHT_DUR = 0.08;
    const DOT_DUR = 0.07;

    const segments: Array<{
      type: 'stroke' | 'flight' | 'dot';
      strokeIdx?: number;
      duration: number;
      from?: { x: number; y: number };
      to?: { x: number; y: number };
      dotRef?: React.RefObject<SVGCircleElement | null>;
      dotMaxR?: number;
    }> = [];

    for (let i = 0; i < SWAYAM_STROKES.length; i++) {
      segments.push({
        type: 'stroke',
        strokeIdx: i,
        duration: SWAYAM_STROKES[i].duration,
      });

      // Continuous flow: only add flight if the pen actually lifts (distance > 12px)
      if (i < SWAYAM_STROKES.length - 1) {
        try {
          const fromPt = paths[i]?.getPointAtLength(lengths[i]);
          const toPt = paths[i + 1]?.getPointAtLength(0);
          if (fromPt && toPt) {
            const dist = Math.hypot(toPt.x - fromPt.x, toPt.y - fromPt.y);
            if (dist > 12) {
              segments.push({
                type: 'flight',
                duration: dist > 300 ? 0.12 : FLIGHT_DUR,
                from: { x: fromPt.x, y: fromPt.y },
                to: { x: toPt.x, y: toPt.y },
              });
            }
          }
        } catch {}
      }
    }

    // Flight from Underline end to Dot 1
    try {
      const lastStroke = paths[SWAYAM_STROKES.length - 1];
      const lastLen = lengths[SWAYAM_STROKES.length - 1];
      const underEnd = lastStroke?.getPointAtLength(lastLen);
      if (underEnd) {
        segments.push({
          type: 'flight',
          duration: FLIGHT_DUR,
          from: { x: underEnd.x, y: underEnd.y },
          to: { x: DOT1.cx, y: DOT1.cy },
        });
      }
    } catch {}

    // Dot 1 stamp
    segments.push({
      type: 'dot',
      duration: DOT_DUR,
      from: { x: DOT1.cx, y: DOT1.cy },
      to: { x: DOT1.cx, y: DOT1.cy },
      dotRef: dot1Ref,
      dotMaxR: DOT1.r,
    });

    // Flight from Dot 1 to Dot 2
    segments.push({
      type: 'flight',
      duration: 0.05,
      from: { x: DOT1.cx, y: DOT1.cy },
      to: { x: DOT2.cx, y: DOT2.cy },
    });

    // Dot 2 stamp
    segments.push({
      type: 'dot',
      duration: DOT_DUR,
      from: { x: DOT2.cx, y: DOT2.cy },
      to: { x: DOT2.cx, y: DOT2.cy },
      dotRef: dot2Ref,
      dotMaxR: DOT2.r,
    });

    const totalTime = segments.reduce((sum, seg) => sum + seg.duration, 0);
    const startTime = performance.now();

    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      let accumulated = 0;
      let activePos: { x: number; y: number } | null = null;

      for (let s = 0; s < segments.length; s++) {
        const seg = segments[s];
        const segStart = accumulated;
        const segEnd = accumulated + seg.duration;

        if (seg.type === 'stroke') {
          const idx = seg.strokeIdx!;
          const p = paths[idx];
          const len = lengths[idx];

          if (p) {
            if (elapsed < segStart) {
              // Completely invisible before this letter starts
              p.style.opacity = '0';
              p.style.strokeDashoffset = `${len}`;
            } else if (elapsed >= segEnd) {
              // Fully visible after this letter finishes
              p.style.opacity = '1';
              p.style.strokeDashoffset = '0';
            } else {
              // Currently being signed
              p.style.opacity = '1';
              const t = (elapsed - segStart) / seg.duration;
              const currentDist = t * len;
              p.style.strokeDashoffset = `${len - currentDist}`;
              try {
                const pt = p.getPointAtLength(currentDist);
                activePos = { x: pt.x, y: pt.y };
              } catch {}
            }
          }
        } else if (seg.type === 'flight') {
          if (elapsed >= segStart && elapsed < segEnd && seg.from && seg.to) {
            const t = easeInOut((elapsed - segStart) / seg.duration);
            activePos = {
              x: seg.from.x + (seg.to.x - seg.from.x) * t,
              y: seg.from.y + (seg.to.y - seg.from.y) * t,
            };
          }
        } else if (seg.type === 'dot') {
          if (elapsed < segStart) {
            if (seg.dotRef?.current) {
              seg.dotRef.current.style.opacity = '0';
              seg.dotRef.current.setAttribute('r', '0');
            }
          } else {
            if (seg.dotRef?.current) {
              seg.dotRef.current.style.opacity = '1';
            }
            const t = Math.min(1, (elapsed - segStart) / seg.duration);
            if (seg.dotRef?.current) {
              seg.dotRef.current.setAttribute('r', `${seg.dotMaxR! * Math.max(0.2, t)}`);
            }
            if (elapsed < segEnd) {
              activePos = seg.to || null;
            }
          }
        }

        accumulated += seg.duration;
      }

      if (activePos) {
        setPenPos(activePos);
      }

      if (elapsed < totalTime) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Complete the signature: reveal everything 100%
        paths.forEach(p => {
          if (p) {
            p.style.opacity = '1';
            p.style.strokeDashoffset = '0';
          }
        });
        if (dot1Ref.current) {
          dot1Ref.current.style.opacity = '1';
          dot1Ref.current.setAttribute('r', `${DOT1.r}`);
        }
        if (dot2Ref.current) {
          dot2Ref.current.style.opacity = '1';
          dot2Ref.current.setAttribute('r', `${DOT2.r}`);
        }

        setIsSigning(false);
        setPenPos(null);

        if (onComplete) {
          onComplete();
        }

        if (loop) {
          // Hold completed signature for 4.2 seconds, then smoothly fade and re-sign
          loopTimeoutRef.current = setTimeout(() => {
            setFadeOpacity(0); // 900ms smooth fade out

            loopTimeoutRef.current = setTimeout(() => {
              startSigningCycleRef.current(); // Continuous loop restarts seamlessly
            }, 950);
          }, 4200);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [loop, onComplete]);

  useEffect(() => {
    startSigningCycleRef.current = startSigningCycle;
  }, [startSigningCycle]);

  const handleManualReplay = () => {
    triggerHaptic('light');
    startSigningCycle();
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      startSigningCycle();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, [autoPlay, startSigningCycle]);

  return (
    <div
      onClick={handleManualReplay}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-opacity duration-1000 ${className}`}
      style={{
        opacity: fadeOpacity,
      }}
      title="Swayam's Handwritten Signature • Continuous real-time loop (Tap to replay)"
      aria-label="Swayam's handwritten signature animation"
    >
      {/* Ambient background glow directly around the ink */}
      <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-[#E0442E]/20 via-[#F5F5DC]/10 to-[#FF5140]/15 blur-lg pointer-events-none" />

      {/* SVG Canvas revealing pure handwriting */}
      <div className="relative w-full h-full overflow-visible">
        <svg
          viewBox="0 220 1024 445"
          className="w-full h-full overflow-visible filter drop-shadow-[0_2px_10px_rgba(224,68,46,0.35)]"
        >
          <defs>
            {/* Dynamic Mask with 100% full-width coverage revealing the authentic signature */}
            <mask id="swayam-sig-bg-mask">
              <rect x="0" y="0" width="1024" height="861" fill="black" />
              {SWAYAM_STROKES.map((stroke, index) => (
                <path
                  key={stroke.id}
                  ref={el => {
                    pathRefs.current[index] = el;
                  }}
                  d={stroke.d}
                  fill="none"
                  stroke="white"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0 }}
                />
              ))}
              {/* Dynamic dots revealed as the pen taps them */}
              <circle
                ref={dot1Ref}
                cx={DOT1.cx}
                cy={DOT1.cy}
                r="0"
                fill="white"
                style={{ opacity: 0 }}
              />
              <circle
                ref={dot2Ref}
                cx={DOT2.cx}
                cy={DOT2.cy}
                r="0"
                fill="white"
                style={{ opacity: 0 }}
              />
            </mask>

            {/* Glowing Ink Pen Tip Gradient */}
            <radialGradient id="sig-pen-tip-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF5140" stopOpacity="1" />
              <stop offset="35%" stopColor="#E0442E" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#E0442E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Authentic Signature image in Warm Beige */}
          <image
            href={signatureBeige}
            xlinkHref={signatureBeige}
            x="0"
            y="0"
            width="1024"
            height="861"
            mask="url(#swayam-sig-bg-mask)"
            className="select-none pointer-events-none opacity-95"
          />

          {/* Glowing Pen Tip gliding continuously along the stroke path in real-time */}
          {isSigning && penPos && (
            <g transform={`translate(${penPos.x}, ${penPos.y})`}>
              {/* Outer soft ambient pulse */}
              <circle cx="0" cy="0" r="28" fill="url(#sig-pen-tip-glow)" className="animate-pulse" />
              {/* Core bright spark */}
              <circle cx="0" cy="0" r="5" fill="#F5F5DC" />
              <circle cx="0" cy="0" r="2.5" fill="#FF5140" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export { SignatureAnimation as RealtimeSignature };
