import { useEffect, useRef } from "react";

// Renders at 0% then animates to its target on the next frame — a double
// requestAnimationFrame, since the transition only fires if the change happens strictly
// after the initial paint (same technique as the vanilla version).
export default function ScoreGauge({ score, total, size }) {
  const fillRef = useRef(null);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const targetOffset = circumference * (1 - pct / 100);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (fillRef.current) fillRef.current.style.strokeDashoffset = String(targetOffset);
      });
    });
  }, [targetOffset, circumference]);

  return (
    <div className="score-gauge" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle className="gauge-track" cx={center} cy={center} r={radius} />
        <circle
          ref={fillRef}
          className="gauge-fill"
          cx={center}
          cy={center}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="gauge-label">
        <div className="gauge-percent">{pct}%</div>
        <div className="gauge-score">
          {score}/{total}
        </div>
      </div>
    </div>
  );
}
