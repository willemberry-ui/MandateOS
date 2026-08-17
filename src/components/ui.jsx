import { useState, useEffect, useRef } from "react";
import { C } from "../tokens";
import { getScoreColor, getInitials } from "../lib/helpers";

export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

export function Reveal({ children, delay = 0, style: s = {}, className = "" }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...s }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   LOGO
   ════════════════════════════════════════════ */
export function LogoMark({ size = 32 }) {
  return (
    <div
      aria-label="MandateOS"
      role="img"
      style={{
        width: Math.round(size * 1.42),
        height: size,
        borderRadius: 4,
        backgroundImage: "url('/mandateos-nav-logo.png')",
        backgroundSize: "164%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function LogoFull({ size = 32, markSize, textSize, onClick }) {
  const resolvedMarkSize = markSize ?? size;
  const resolvedTextSize = textSize ?? size * 0.5;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <LogoMark size={resolvedMarkSize} />
      <span
        style={{
          fontFamily:
            "'Manrope','Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          fontWeight: 760,
          fontSize: resolvedTextSize,
          letterSpacing: -0.3,
          color: C.text,
          lineHeight: 1,
        }}
      >
        Mandate<span style={{ color: C.accentBright }}>OS</span>
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════ */
export function Wrap({ children, style: s = {} }) {
  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "0 auto",
        padding: "0 clamp(22px, 4vw, 64px)",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

export function Mono({ children, color = C.text, size = 13, weight = 600, style: s = {} }) {
  return (
    <span
      style={{
        fontFamily: "'Source Code Pro',monospace",
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: "-0.02em",
        fontFeatureSettings: "'tnum'",
        fontVariantNumeric: "tabular-nums",
        ...s,
      }}
    >
      {children}
    </span>
  );
}

export function Pill({ children, color = C.accent, size }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "xs" ? "2px 8px" : "3px 10px",
        borderRadius: 6,
        fontSize: size === "xs" ? 10 : 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        background: color + "18",
        color,
        border: `1px solid ${color}30`,
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
}

export function Dot({ color = C.green, size = 7, pulse = false }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
        animation: pulse ? "subtlePulse 2s ease infinite" : "none",
      }}
    />
  );
}

export function Btn({
  children,
  variant = "primary",
  onClick,
  size = "md",
  disabled = false,
  style: sx = {},
  type = "button",
}) {
  const [h, setH] = useState(false);
  const pad = { lg: "10px 21px", md: "8px 16px", sm: "6px 12px" }[size];
  const fs = { lg: 13.5, md: 13, sm: 12 }[size];
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: pad,
    fontSize: fs,
    fontWeight: 680,
    letterSpacing: 0,
    borderRadius: 7,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    transition: "all .2s ease",
    opacity: disabled ? 0.4 : 1,
    whiteSpace: "nowrap",
  };
  const v = {
    primary: {
      background:
        h && !disabled
          ? `linear-gradient(135deg, #8175e8, #6358cc)`
          : `linear-gradient(135deg, #7569dc, #574cc1)`,
      color: C.white,
      boxShadow:
        h && !disabled
          ? `0 8px 22px ${C.accent}28, 0 0 0 1px ${C.accent}30`
          : `0 3px 10px ${C.accent}18`,
      letterSpacing: 0,
    },
    secondary: {
      background: h ? C.surface + "80" : C.surface + "60",
      color: h ? C.text : C.textSoft,
      border: `1px solid ${h ? C.borderHover : C.border}`,
      backdropFilter: "blur(12px)",
    },
    ghost: {
      background: "transparent",
      color: h ? C.text : C.textSoft,
      padding: pad,
    },
    green: {
      background: h
        ? `linear-gradient(135deg, ${C.green}, #16a34a)`
        : `linear-gradient(135deg, #22c55e, ${C.green})`,
      color: C.white,
      boxShadow: h ? `0 8px 28px ${C.green}40` : `0 4px 16px ${C.green}20`,
    },
    purple: {
      background:
        h && !disabled
          ? `linear-gradient(135deg, ${C.purple}, ${C.accentBright})`
          : `${C.surface}70`,
      color: h && !disabled ? C.white : C.accentBright,
      border: `1px solid ${h && !disabled ? C.purple : C.purpleBorder}`,
      boxShadow:
        h && !disabled
          ? `0 8px 28px ${C.purple}42, 0 0 0 1px ${C.purple}32`
          : `0 4px 16px ${C.purple}12`,
      backdropFilter: "blur(12px)",
    },
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...v[variant], ...sx }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </button>
  );
}

export function Card({ children, style: s = {}, hover = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      className={hover ? "glow-card" : ""}
      style={{
        background: h && hover ? C.cardHover : C.card,
        border: `1px solid ${h && hover ? C.borderHover : C.border}`,
        borderRadius: 12,
        padding: 20,
        transition: "all .25s ease",
        boxShadow:
          h && hover
            ? `0 16px 48px rgba(0,0,0,.45), 0 0 0 1px ${C.accent}20`
            : "0 1px 4px rgba(0,0,0,.3)",
        ...s,
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </div>
  );
}

/* Form primitives */
export function FInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  mono,
  type = "text",
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            marginBottom: 5,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: C.textMuted,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: prefix ? "10px 12px 10px 26px" : "10px 14px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 9,
            color: C.text,
            fontSize: 13.5,
            transition: "all .15s",
            fontFamily: mono ? "'Source Code Pro',monospace" : "inherit",
            boxShadow: `inset 0 1px 3px rgba(0,0,0,.2)`,
          }}
        />
      </div>
    </div>
  );
}

export function FSelect({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            marginBottom: 5,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 36px 10px 14px",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 9,
          color: C.text,
          fontSize: 13.5,
          appearance: "none",
          cursor: "pointer",
          transition: "all .15s",
          boxShadow: `inset 0 1px 3px rgba(0,0,0,.2)`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 4l3 3 3-3' stroke='%23a29ec0' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FTags({ label, options, selected, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            marginBottom: 7,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              onClick={() =>
                onChange(
                  on ? selected.filter((x) => x !== o) : [...selected, o]
                )
              }
              style={{
                padding: "5px 13px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: on ? 680 : 540,
                border: `1px solid ${on ? C.accent + "60" : C.border}`,
                background: on
                  ? `linear-gradient(135deg, ${C.accentGhost}, ${C.accentWash})`
                  : C.surface,
                color: on ? C.accentBright : C.textSoft,
                cursor: "pointer",
                transition: "all .15s",
                boxShadow: on ? `0 0 8px ${C.accent}20` : "none",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Separator() {
  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
        margin: "22px 0",
      }}
    />
  );
}

export function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
        padding: "4px 14px 4px 10px",
        borderRadius: 100,
        background: C.accentGhost,
        border: `1px solid ${C.accent}28`,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentBright}, ${C.accent})`,
          boxShadow: `0 0 8px ${C.accent}60`,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: C.accentBright,
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <h2
        style={{
          fontSize: "clamp(28px,3.8vw,46px)",
          fontWeight: 820,
          lineHeight: 1.1,
          letterSpacing: -1.2,
          marginBottom: sub ? 16 : 0,
          background: `linear-gradient(135deg, ${C.text} 55%, ${C.textSoft} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: 16.5,
            color: C.textSoft,
            lineHeight: 1.7,
            maxWidth: 560,
            letterSpacing: "-0.01em",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function StatBox({ label, value, color = C.accent }) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: `linear-gradient(135deg, ${color}0a, ${C.card})`,
        borderRadius: 12,
        border: `1px solid ${color}22`,
        boxShadow: `0 2px 12px rgba(0,0,0,.2), 0 0 0 1px ${color}10 inset`,
        transition: "box-shadow .2s ease, transform .2s ease",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: color + "99",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <Mono size={24} weight={780} color={color}>
        {value}
      </Mono>
    </div>
  );
}

export function THead({ cols, template }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: template,
        padding: "9px 16px",
        background: C.raised,
        fontSize: 10,
        fontWeight: 750,
        color: C.textMuted,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {cols.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

export function TRow({ children, template }) {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: template,
        padding: "11px 16px",
        borderBottom: `1px solid ${C.borderSubtle}`,
        alignItems: "center",
        fontSize: 13,
        background: h ? C.raised : "transparent",
        transition: "background .1s",
        cursor: "default",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   MODAL
   ════════════════════════════════════════════ */

let _toastCb = null;
export function showToast(msg, type = "info") {
  if (_toastCb) _toastCb({ msg, type, id: Date.now() });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastCb = (t) => {
      setToasts((p) => [...p, t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 2800);
    };
    return () => {
      _toastCb = null;
    };
  }, []);
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => {
        const tc =
          t.type === "success"
            ? C.green
            : t.type === "error"
            ? C.red
            : C.accent;
        return (
          <div
            key={t.id}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: `${C.card}f0`,
              backdropFilter: "blur(20px) saturate(1.5)",
              border: `1px solid ${tc}40`,
              color: C.text,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: `0 12px 40px rgba(0,0,0,.5), 0 0 0 1px ${tc}20`,
              animation: "popIn .25s cubic-bezier(.22,1,.36,1) both",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 220,
            }}
          >
            {t.type === "success" && (
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="6" fill={C.green + "30"} />
                <path
                  d="M4 7l2 2 4-4"
                  stroke={C.green}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
            {t.type === "error" && (
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="6" fill={C.red + "30"} />
                <path
                  d="M5 5l4 4M9 5l-4 4"
                  stroke={C.red}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
            <span style={{ color: tc }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   SKELETON CARD
   ════════════════════════════════════════════ */
export function SkeletonCard() {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 18,
        height: 220,
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: C.surface,
            animation: "shimmer 1.8s linear infinite",
            backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
            backgroundSize: "200% 100%",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 14,
              borderRadius: 4,
              background: C.surface,
              width: "60%",
              marginBottom: 8,
              animation: "shimmer 1.8s linear infinite",
              backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
              backgroundSize: "200% 100%",
            }}
          />
          <div
            style={{
              height: 10,
              borderRadius: 4,
              background: C.surface,
              width: "40%",
              animation: "shimmer 1.8s linear infinite",
              backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[60, 50, 45].map((w, i) => (
          <div
            key={i}
            style={{
              height: 20,
              borderRadius: 5,
              background: C.surface,
              width: w,
              animation: "shimmer 1.8s linear infinite",
              backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
              backgroundSize: "200% 100%",
            }}
          />
        ))}
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 4,
          background: C.surface,
          width: "80%",
          marginBottom: 8,
          animation: "shimmer 1.8s linear infinite",
          backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
          backgroundSize: "200% 100%",
        }}
      />
      <div
        style={{
          height: 10,
          borderRadius: 4,
          background: C.surface,
          width: "65%",
          animation: "shimmer 1.8s linear infinite",
          backgroundImage: `linear-gradient(90deg, ${C.surface}, ${C.surfaceHover}, ${C.surface})`,
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
export function LPProfileModal({ lp, score, reasons, onClose }) {
  if (!lp) return null;
  const sc = getScoreColor(score || 0);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: `1px solid ${C.border}`,
            background: C.raised,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: `linear-gradient(135deg, ${sc}22, ${sc}0a)`,
                border: `1px solid ${sc}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800, color: sc }}>
                {getInitials(lp.name)}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 720, fontSize: 16 }}>{lp.name}</div>
              <div style={{ fontSize: 12.5, color: C.textSoft }}>
                {lp.type} · {lp.aum} AUM
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {score != null && (
              <div
                style={{
                  background: sc + "18",
                  border: `1px solid ${sc}30`,
                  borderRadius: 8,
                  padding: "5px 12px",
                }}
              >
                <Mono size={18} weight={700} color={sc}>
                  {score}
                </Mono>
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.bg,
                color: C.textSoft,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 6,
                }}
              >
                Check Size Range
              </div>
              <Mono size={16} weight={700}>
                ${lp.checkMin}–{lp.checkMax}M
              </Mono>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 6,
                }}
              >
                Fund Size
              </div>
              <Mono size={16} weight={700}>
                {lp.aum}
              </Mono>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 8,
              }}
            >
              Strategies
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {lp.strategies.map((s) => (
                <Pill key={s} color="#8b6cf0">
                  {s}
                </Pill>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 8,
              }}
            >
              Sectors
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {lp.sectors.map((s) => (
                <Pill key={s} color={C.accent}>
                  {s}
                </Pill>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 8,
              }}
            >
              Geographies
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {lp.geographies.map((g) => (
                <Pill key={g} color={C.teal}>
                  {g}
                </Pill>
              ))}
            </div>
          </div>
          {lp.deploying && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 18,
              }}
            >
              <Dot color={C.green} pulse />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>
                Actively Deploying
              </span>
            </div>
          )}
          {reasons && reasons.length > 0 && (
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                }}
              >
                Fit Analysis
              </div>
              {reasons.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: r.ok ? C.greenWash : C.redWash,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {r.ok ? (
                      <svg width="9" height="9" viewBox="0 0 9 9">
                        <path
                          d="M1.5 4.5l2 2 4-4"
                          stroke={C.green}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 9 9">
                        <path
                          d="M2.5 2.5l4 4M6.5 2.5l-4 4"
                          stroke={C.red}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                  <span style={{ color: C.textSoft }}>{r.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   GP PROFILE MODAL
   ════════════════════════════════════════════ */
export function GPProfileModal({ gp, onClose }) {
  if (!gp) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560 }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: `1px solid ${C.border}`,
            background: C.raised,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "linear-gradient(135deg, #8b6cf022, #8b6cf00a)",
                border: "1px solid #8b6cf030",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800, color: "#a78bfa" }}>
                {getInitials(gp.name)}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 720, fontSize: 16 }}>{gp.name}</div>
              <div style={{ fontSize: 12.5, color: C.textSoft }}>
                {gp.strategy} · {gp.geography}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.textSoft,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                Fund Size
              </div>
              <Mono size={14} weight={700}>
                {gp.fundSize}
              </Mono>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                MOIC
              </div>
              <Mono size={14} weight={700} color={C.green}>
                {gp.moic}
              </Mono>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                Net IRR
              </div>
              <Mono size={14} weight={700} color={C.green}>
                {gp.irr}
              </Mono>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 8,
              }}
            >
              Sectors
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {gp.sectors.map((s) => (
                <Pill key={s} color={C.accent}>
                  {s}
                </Pill>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div>
              <span
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Check Size
              </span>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {gp.checkSize}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Stage
              </span>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{gp.stage}</div>
            </div>
            <div>
              <span
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Team
              </span>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {gp.team} members
              </div>
            </div>
          </div>
          {gp.deploying && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 16,
              }}
            >
              <Dot color={C.green} pulse />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>
                Actively Deploying
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   SHORTLIST SIDE PANEL
   ════════════════════════════════════════════ */
export function ShortlistPanel({ open, onClose, items, onRemove }) {
  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,8,16,.5)",
            zIndex: 9990,
            animation: "fadeIn .15s ease both",
          }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "90vw",
          background: C.card,
          borderLeft: `1px solid ${C.border}`,
          zIndex: 9991,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.22,1,.36,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: C.raised,
          }}
        >
          <div>
            <div style={{ fontWeight: 720, fontSize: 15 }}>Shortlist</div>
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 2 }}>
              {items.length} LP{items.length !== 1 ? "s" : ""} shortlisted
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.textSoft,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
              <div style={{ fontSize: 14, fontWeight: 650, marginBottom: 6 }}>
                No LPs shortlisted yet
              </div>
              <div
                style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}
              >
                Click the Shortlist button on any LP card to add them here for
                quick comparison.
              </div>
            </div>
          )}
          {items.map((lp) => (
            <div
              key={lp.id}
              style={{
                padding: 14,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
                borderRadius: 10,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: C.accentWash,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.accentBright,
                  }}
                >
                  {getInitials(lp.name)}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 650,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {lp.name}
                </div>
                <div style={{ fontSize: 11, color: C.textSoft }}>
                  {lp.type} · {lp.aum}
                </div>
              </div>
              <button
                onClick={() => onRemove(lp.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMuted,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   SEARCH BAR COMPONENT
   ════════════════════════════════════════════ */
export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative" }}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: C.textMuted,
        }}
      >
        <circle
          cx="6"
          cy="6"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M9.5 9.5L12.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px 9px 32px",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          color: C.text,
          fontSize: 13,
          transition: "all .15s",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════
   NOTES SYSTEM (localStorage)
   ════════════════════════════════════════════ */
export function NotesPopover({ lpId, onClose }) {
  const [note, setNote] = useState(() => lsGet("note_" + lpId, ""));
  const save = () => {
    lsSet("note_" + lpId, note);
    showToast("Note saved", "success");
    onClose();
  };
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        marginTop: 4,
        width: 260,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 12,
        zIndex: 100,
        boxShadow: "0 12px 40px rgba(0,0,0,.4)",
        animation: "popIn .2s ease both",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 750,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        Notes
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add notes about this LP..."
        style={{
          width: "100%",
          minHeight: 70,
          resize: "vertical",
          padding: "8px 10px",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          fontSize: 12,
          fontFamily: "inherit",
          marginBottom: 8,
        }}
      />
      <div style={{ display: "flex", gap: 6 }}>
        <Btn variant="primary" size="sm" onClick={save} style={{ flex: 1 }}>
          Save
        </Btn>
        <Btn variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   EMAIL INTRO SIMULATION
   ════════════════════════════════════════════ */
export function EmailSimModal({ lp, gp, onClose }) {
  const [phase, setPhase] = useState("compose"); // compose | sending | sent
  const [subject, setSubject] = useState(
    () =>
      `Introduction: ${gp || "Meridian Ventures Fund III"} ↔ ${
        lp?.name || "LP"
      }`
  );
  const [body, setBody] = useState(
    () =>
      `Hi team,\n\nI'd like to introduce ${
        gp || "Meridian Ventures Fund III"
      } to ${
        lp?.name || "the LP"
      }. Based on our mandate-fit analysis, this is a ${
        lp ? "strong" : "potential"
      } match across strategy, sector, and check size.\n\nKey highlights:\n• Strategy alignment: Venture Capital\n• Sector overlap: Technology, Healthcare\n• Check size within mandate range\n• Fit score: ${
        lp?.score || "94"
      }/100\n\nPlease let me know if you'd like to schedule a call.\n\nBest,\nMandateOS Platform`
  );

  const send = () => {
    setPhase("sending");
    setTimeout(() => {
      setPhase("sent");
      showToast("Intro email sent (simulated)", "success");
    }, 1800);
  };

  if (!lp && !gp) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600 }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: C.raised,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="1"
                y="3"
                width="16"
                height="12"
                rx="2"
                stroke={C.accent}
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M1 5l8 5 8-5"
                stroke={C.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              {phase === "sent" ? "Email Sent" : "Compose Introduction"}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.textSoft,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {phase === "sent" ? (
            <div
              className="scale-in"
              style={{ textAlign: "center", padding: "30px 20px" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: C.greenWash,
                  border: `1px solid ${C.greenBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path
                    d="M6 12l4 4 8-8"
                    stroke={C.green}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 720, marginBottom: 6 }}>
                Introduction Sent
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: C.textSoft,
                  lineHeight: 1.65,
                  marginBottom: 20,
                }}
              >
                Both parties have been notified. The LP will review the GP
                profile and respond through the platform.
              </p>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                <Btn variant="secondary" size="sm" onClick={onClose}>
                  Close
                </Btn>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => setPhase("compose")}
                >
                  Send Another
                </Btn>
              </div>
            </div>
          ) : phase === "sending" ? (
            <div
              className="fade-in"
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `3px solid ${C.border}`,
                  borderTopColor: C.accent,
                  borderRadius: "50%",
                  animation: "spin .7s linear infinite",
                  margin: "0 auto 18px",
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textSoft }}>
                Sending introduction...
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                Encrypting and routing through secure channel
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  To
                </label>
                <div
                  style={{
                    padding: "8px 12px",
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    borderRadius: 7,
                    fontSize: 13,
                    color: C.textSoft,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Pill color={C.green}>{lp?.name || "LP"}</Pill>
                  <span style={{ color: C.textMuted }}>+</span>
                  <Pill color="#8b6cf0">{gp || "GP"}</Pill>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    color: C.text,
                    fontSize: 13,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 180,
                    resize: "vertical",
                    padding: "10px 12px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    color: C.text,
                    fontSize: 12.5,
                    fontFamily: "'Source Code Pro', monospace",
                    lineHeight: 1.6,
                  }}
                />
              </div>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <Btn variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Btn>
                <Btn variant="green" size="sm" onClick={send}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M2 9l14-6-4 14-3-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  Send Introduction
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PIPELINE VIEW
   ════════════════════════════════════════════ */
const PIPELINE_STAGES = ["Sourced", "Contacted", "In DD", "Closed"];
const PIPELINE_DATA = [
  { id: 1, name: "Pacific Endowment", stage: "In DD", score: 94 },
  { id: 2, name: "Sterling Partners", stage: "Contacted", score: 85 },
  { id: 3, name: "Great Lakes Pension", stage: "Sourced", score: 78 },
  { id: 4, name: "Cascade Foundation", stage: "Contacted", score: 82 },
  { id: 5, name: "Atlas Endowment", stage: "Closed", score: 91 },
  { id: 6, name: "Meridian Family Office", stage: "In DD", score: 76 },
  { id: 7, name: "Summit Peak Advisors", stage: "Sourced", score: 73 },
  { id: 8, name: "Redwood Capital", stage: "Sourced", score: 68 },
];

/* ════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ════════════════════════════════════════════ */
export function RequestAccessModal({ open, mode = "login", onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("GP / Fund Manager");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const isDemo = mode === "demo";
  const isPilot = mode === "pilot";

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setName("");
      setEmail("");
      setOrg("");
      setRole("GP / Fund Manager");
      setPassword("");
      setMessage("");
      setLoading(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw new Error(err.message);
        onClose();
        showToast("Welcome back!", "success");
      } else {
        // Demo or Pilot application — save to waitlist table
        const { error: err } = await supabase.from("waitlist").insert({
          type: mode,
          name,
          email,
          org,
          role,
          notes: message,
        });
        if (err) console.warn("Waitlist:", err.message);
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = isLogin
    ? "Welcome back"
    : isDemo
    ? "Request a Demo"
    : "Apply for Pilot Access";
  const modalSub = isLogin
    ? "Sign in to your MandateOS workspace."
    : isDemo
    ? "Tell us about yourself and we’ll schedule a personalized walkthrough."
    : "MandateOS is invite-only. Apply below and we’ll be in touch if there’s a fit.";

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5,8,16,0.75)",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#0c1124",
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          boxShadow: "0 32px 80px rgba(0,0,0,.6)",
          overflow: "hidden",
          animation: "popIn .22s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 22px 16px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <LogoMark size={20} />
              <span
                style={{
                  fontWeight: 750,
                  fontSize: 14,
                  color: C.textSoft,
                  letterSpacing: 0.3,
                }}
              >
                MandateOS
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 17,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{
              fontWeight: 760,
              fontSize: 18,
              color: C.text,
              marginBottom: 4,
            }}
          >
            {modalTitle}
          </div>
          <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.5 }}>
            {modalSub}
          </div>
        </div>

        <div style={{ padding: "20px 22px 22px" }}>
          {submitted ? (
            /* ── Success ── */
            <div
              className="fade-in"
              style={{ textAlign: "center", padding: "8px 0 4px" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: C.greenWash,
                  border: `1px solid ${C.greenBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M5 11l4 4 8-8"
                    stroke={C.green}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ fontWeight: 750, fontSize: 17, marginBottom: 8 }}>
                {isDemo ? "Request received!" : "Application submitted!"}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.65,
                  marginBottom: 18,
                }}
              >
                {isDemo
                  ? "We’ll reach out within 48 hours to schedule your walkthrough."
                  : "We review pilot applications on a rolling basis and will follow up if there’s a strong fit."}
              </p>
              {isDemo && (
                <a
                  href="https://calendly.com/willemberry-berkeley/30min"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginBottom: 16,
                    color: C.accentBright,
                    fontWeight: 650,
                    textDecoration: "none",
                    fontSize: 13,
                  }}
                >
                  Or book a time instantly →
                </a>
              )}
              <br />
              <Btn variant="secondary" size="sm" onClick={onClose}>
                Close
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ── LOGIN ── */}
              {isLogin && (
                <>
                  <FInput
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@firm.com"
                    type="email"
                  />
                  <FInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Your password"
                    type="password"
                  />
                  <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>
                      Access is by invitation only.
                    </span>
                  </div>
                </>
              )}

              {/* ── DEMO / PILOT ── */}
              {!isLogin && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <FInput
                      label="Full Name"
                      value={name}
                      onChange={setName}
                      placeholder="First Last"
                    />
                    <FInput
                      label="Work Email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@firm.com"
                      type="email"
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <FInput
                      label="Organization"
                      value={org}
                      onChange={setOrg}
                      placeholder="Firm name"
                    />
                    <FSelect
                      label="I Am a..."
                      value={role}
                      onChange={setRole}
                      options={[
                        "GP / Fund Manager",
                        "LP / Allocator",
                        "Family Office",
                        "Endowment",
                        "Pension Fund",
                        "Fund of Funds",
                        "Placement Agent",
                        "Other",
                      ]}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.textMuted,
                        marginBottom: 5,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      {isDemo
                        ? "What do you want to see?"
                        : "Why are you a strong fit?"}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isDemo
                          ? "Tell us what’s most important to you in the demo…"
                          : "Briefly describe your fund / LP portfolio and what you’re looking for…"
                      }
                      style={{
                        width: "100%",
                        minHeight: 88,
                        resize: "none",
                        padding: "10px 12px",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        fontSize: 13,
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: C.redWash,
                    border: `1px solid ${C.redBorder}`,
                    color: C.red,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit row */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    border: "none",
                    background: loading ? C.accentDim : C.accent,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.8 : 1,
                    fontFamily: "inherit",
                    letterSpacing: 0.2,
                  }}
                >
                  {loading
                    ? "Working…"
                    : isLogin
                    ? "Sign In"
                    : isDemo
                    ? "Request Demo"
                    : "Submit Application"}
                </button>
                {isDemo && (
                  <a
                    href="https://calendly.com/willemberry-berkeley/30min"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button
                      type="button"
                      style={{
                        height: 42,
                        padding: "0 16px",
                        borderRadius: 10,
                        border: `1px solid ${C.border}`,
                        background: C.surface,
                        color: C.text,
                        fontWeight: 650,
                        fontSize: 13,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "inherit",
                      }}
                    >
                      Book Instantly
                    </button>
                  </a>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
