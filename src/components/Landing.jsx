import { useState, useEffect, useRef } from "react";
import { C } from "../tokens";
import { CAL_BOOKING_URL, CAL_BOOKING_EMBED_URL, USE_CAL_BOOKING_EXPERIENCE, USE_MARKETPLACE_DEMO } from "../constants";
import { getInitials } from "../lib/helpers";
import { FIT_WEIGHTS, computeFitScore, runFitEngine } from "../lib/fitEngine";
import {
  Reveal, LogoFull, LogoMark, Wrap, Btn, Pill, Mono, Dot, Card,
  FInput, FSelect, FTags, Separator, SectionLabel, SectionTitle, StatBox, THead, TRow,
  SearchBar, NotesPopover, EmailSimModal, LPProfileModal, GPProfileModal, ShortlistPanel,
  showToast, ToastContainer, SkeletonCard,
} from "./ui";

export function Nav({ onOpenPilot, onOpenLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { t: "Platform", href: "/platform" },
    { t: "Decision Room", href: "/decision-room" },
    { t: "Intelligence", href: "/intelligence" },
    { t: "For Allocators", href: "/for-allocators" },
    { t: "For Managers", href: "/for-managers" },
  ];

  const goTo = (href) => {
    window.location.href = href;
    setMobileOpen(false);
  };

  const goHome = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.href = "/";
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: 54,
          background: scrolled ? C.black + "f0" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "none",
          borderBottom: `1px solid ${
            scrolled ? C.border + "80" : "transparent"
          }`,
          transition:
            "background .4s ease, border-color .4s ease, backdrop-filter .4s ease",
        }}
      >
        <Wrap
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1360,
            padding: "0 clamp(22px, 4vw, 64px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <LogoFull
              size={22}
              markSize={14.5}
              textSize={15.5}
              onClick={goHome}
            />
          </div>
          {/* Desktop Nav */}
          <div
            className="nav-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginLeft: "auto",
            }}
          >
            {navItems.map((n) => (
              <button
                key={n.t}
                onClick={() => goTo(n.href)}
                style={{
                  color: C.textSoft,
                  fontSize: 12,
                  fontWeight: 540,
                  padding: "4px 0",
                  borderRadius: 7,
                  transition: "all .15s ease",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.background = C.surface;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = C.textSoft;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {n.t}
              </button>
            ))}
            <div
              aria-hidden="true"
              style={{
                width: 1,
                height: 18,
                background: C.borderHover,
                margin: "0 2px 0 6px",
                opacity: 0.82,
              }}
            />
            <button
              type="button"
              onClick={onOpenLogin}
              style={{
                color: C.textSoft,
                fontSize: 12,
                fontWeight: 650,
                padding: "7px 8px",
                borderRadius: 7,
                transition: "all .15s ease",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.background = C.surface;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = C.textSoft;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign In
            </button>
            <Btn
              variant="purple"
              size="sm"
              onClick={onOpenPilot}
              style={{ padding: "7px 14px", fontSize: 12 }}
            >
              Request Pilot Access
            </Btn>
          </div>
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-hamburger"
            style={{
              display: "none",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {mobileOpen ? (
                <path
                  d="M5 5l8 8M13 5l-8 8"
                  stroke={C.textSoft}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h12M3 9h12M3 13h12"
                  stroke={C.textSoft}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </Wrap>
      </nav>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 54,
            left: 0,
            right: 0,
            background: C.card,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 199,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "fadeIn .15s ease both",
          }}
        >
          {navItems.map((n) => (
            <button
              key={n.t}
              onClick={() => goTo(n.href)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: C.text,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {n.t}
            </button>
          ))}
          <div style={{ height: 1, background: C.border, margin: "4px 0" }} />
          <button
            type="button"
            onClick={() => {
              onOpenLogin?.();
              setMobileOpen(false);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.text,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Sign In
          </button>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => {
              onOpenPilot();
              setMobileOpen(false);
            }}
          >
            Request Pilot Access
          </Btn>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */

const HERO_ACCENT = "#786edc";
const HERO_ACCENT_SOFT = "#a6a0ee";
const HERO_FIT = "#34d399";
const HERO_REVIEW = "#fbbf24";
const HERO_TRUST = "#2dd4bf";
const HERO_STATUS_MUTED = "#8f9bb8";

const HERO_FILM_STEPS = [
  { id: "profile", label: "Profile", eyebrow: "01", color: HERO_ACCENT },
  { id: "matches", label: "Matching", eyebrow: "02", color: HERO_FIT },
  { id: "diligence", label: "Diligence", eyebrow: "03", color: HERO_REVIEW },
  { id: "reveal", label: "Reveal", eyebrow: "04", color: HERO_TRUST },
  { id: "pipeline", label: "Pipeline", eyebrow: "05", color: HERO_ACCENT_SOFT },
  { id: "introductions", label: "Intros", eyebrow: "06", color: HERO_ACCENT },
];

const HERO_CURSOR_PATHS = {
  profile: [
    { left: "10%", top: 86, action: "Open manager profile" },
    { left: "30%", top: 286, action: "Review fund record" },
    { left: "72%", top: 326, action: "Check LP mandate overlay" },
  ],
  matches: [
    { left: "26%", top: 86, action: "Run mandate-fit model" },
    { left: "33%", top: 275, action: "Inspect top-ranked LP" },
    { left: "67%", top: 350, action: "Review score rationale" },
  ],
  diligence: [
    { left: "42%", top: 86, action: "Open diligence room" },
    { left: "26%", top: 280, action: "Verify DDQ coverage" },
    { left: "58%", top: 345, action: "Review missing items" },
  ],
  reveal: [
    { left: "58%", top: 86, action: "Open reveal gate" },
    { left: "26%", top: 312, action: "Confirm consent state" },
    { left: "67%", top: 344, action: "Review audit log" },
  ],
  pipeline: [
    { left: "74%", top: 86, action: "Open pipeline view" },
    { left: "20%", top: 274, action: "Check introduced accounts" },
    { left: "53%", top: 312, action: "Review diligence lane" },
  ],
  introductions: [
    { left: "90%", top: 86, action: "Open introduction workflow" },
    { left: "31%", top: 284, action: "Review intro packet context" },
    { left: "71%", top: 336, action: "Open shared intro room" },
  ],
};

const HERO_TAB_CURSOR_POINTS = [
  { left: "10%", top: 86 },
  { left: "26%", top: 86 },
  { left: "42%", top: 86 },
  { left: "58%", top: 86 },
  { left: "74%", top: 86 },
  { left: "90%", top: 86 },
];

const HERO_CLICK_POPOVERS = {
  profile: [
    {
      tag: "Manager record",
      title: "Manager profile reviewed",
      body: "The GP record opens with identity, strategy, team, terms, and supporting evidence in a controlled profile.",
      stat: "12 fields",
      rows: [
        "Role-based profile access verified",
        "Fund III terms normalized",
        "Team history attached to record",
      ],
    },
    {
      tag: "Performance",
      title: "Performance evidence validated",
      body: "Track record data is reviewed in a consistent allocator format before it becomes a scoring input.",
      stat: "2.1x MOIC",
      rows: [
        "Net IRR field confirmed",
        "Vintage-year attribution mapped",
        "Source evidence linked",
      ],
    },
    {
      tag: "Mandate overlay",
      title: "Allocator mandate constraints applied",
      body: "The LP mandate is applied without exposing allocator identity before the reveal gate is approved.",
      stat: "$5M-$25M",
      rows: [
        "Strategy eligibility confirmed",
        "Geography constraint matched",
        "Disclosure policy preserved",
      ],
    },
    {
      tag: "Version control",
      title: "Profile snapshot approved",
      body: "The scoring snapshot is versioned so downstream recommendations, approvals, and audit events use the same source of truth.",
      stat: "Ready",
      rows: [
        "Snapshot version created",
        "Scoring inputs locked",
        "Audit event recorded",
      ],
    },
  ],
  matches: [
    {
      tag: "Model run",
      title: "Allocator universe screened",
      body: "The mandate-fit model ranks eligible LPs across strategy, check size, sector exposure, geography, and deployment status.",
      stat: "142 LPs",
      rows: [
        "Eligibility filters applied",
        "Mandate vectors compared",
        "Recency weighting included",
      ],
    },
    {
      tag: "Recommendation",
      title: "Primary allocator candidate opened",
      body: "The top-ranked LP record is reviewed with institutional context before it is moved into a live workflow.",
      stat: "94%",
      rows: [
        "Strategy alignment confirmed",
        "Check-size overlap confirmed",
        "Sector evidence reviewed",
      ],
    },
    {
      tag: "Rationale",
      title: "Recommendation rationale reviewed",
      body: "The score is accompanied by explainable factors so the operator can defend why the match should advance.",
      stat: "0.91",
      rows: [
        "Similarity score inspected",
        "Deployment signal verified",
        "Qualification notes attached",
      ],
    },
    {
      tag: "Workflow control",
      title: "Candidate advanced to reveal",
      body: "The recommendation is promoted into a permissioned workflow with diligence and approval requirements attached.",
      stat: "Priority",
      rows: [
        "Reveal workflow created",
        "Diligence dependency added",
        "Next action assigned",
      ],
    },
  ],
  diligence: [
    {
      tag: "Diligence room",
      title: "Diligence packet opened",
      body: "The packet centralizes DDQ responses, fund terms, references, data room files, and performance support.",
      stat: "92%",
      rows: [
        "DDQ status confirmed",
        "Terms review complete",
        "Reference status visible",
      ],
    },
    {
      tag: "Policy check",
      title: "Allocator policy checklist reviewed",
      body: "The packet is tested against allocator requirements before controlled access is granted.",
      stat: "5/5",
      rows: [
        "Policy items mapped",
        "Exceptions flagged",
        "Reusable packet saved",
      ],
    },
    {
      tag: "Exception",
      title: "Outstanding reference item identified",
      body: "The workflow flags pending references and prevents premature release until the gating item has an owner.",
      stat: "2 pending",
      rows: [
        "Partner reference requested",
        "CFO reference queued",
        "Follow-up owner assigned",
      ],
    },
    {
      tag: "Controlled access",
      title: "Diligence access released",
      body: "The diligence packet is released only for the approved allocator workflow, with access controls and auditability.",
      stat: "Access on",
      rows: ["Watermark enabled", "Access window set", "Audit log updated"],
    },
  ],
  reveal: [
    {
      tag: "Disclosure gate",
      title: "Reveal gate reviewed",
      body: "LP identity, diligence access, and intro context remain restricted until disclosure rules are satisfied.",
      stat: "Private",
      rows: [
        "Allocator identity masked",
        "GP profile visible",
        "Consent required",
      ],
    },
    {
      tag: "Consent",
      title: "Dual consent confirmed",
      body: "The workflow verifies both sides have cleared the disclosure path before the introduction packet is assembled.",
      stat: "Approved",
      rows: [
        "LP approval captured",
        "GP release confirmed",
        "Disclosure scope checked",
      ],
    },
    {
      tag: "Audit trail",
      title: "Reveal activity audited",
      body: "Each review, approval, and access event is captured for internal control and post-intro review.",
      stat: "4 events",
      rows: [
        "Operator review logged",
        "Approval timestamp saved",
        "Packet access recorded",
      ],
    },
    {
      tag: "Release approval",
      title: "Permissioned reveal approved",
      body: "The introduction packet is approved with identity, rationale, diligence access, and next-step context attached.",
      stat: "Approved",
      rows: [
        "Identity released",
        "Intro rationale attached",
        "Meeting task created",
      ],
    },
  ],
  pipeline: [
    {
      tag: "Pipeline control",
      title: "Capital workflow opened",
      body: "Approved recommendations, introductions, diligence processes, and allocator calls are tracked in one governed pipeline.",
      stat: "4 active",
      rows: [
        "Approved lane loaded",
        "Introduced lane loaded",
        "Diligence lane loaded",
      ],
    },
    {
      tag: "Introductions",
      title: "Introduced accounts reviewed",
      body: "The operator reviews which LP conversations already have context, owner, status, and follow-up requirements.",
      stat: "1 intro",
      rows: [
        "Harborview status reviewed",
        "Conversation notes synced",
        "Follow-up requirement visible",
      ],
    },
    {
      tag: "Diligence lane",
      title: "Open diligence workflow reviewed",
      body: "The diligence lane shows which items are blocking movement toward IC review or allocator call scheduling.",
      stat: "1 in DD",
      rows: [
        "Sterling packet active",
        "Reference request open",
        "IC memo next",
      ],
    },
    {
      tag: "Ownership",
      title: "Allocator call assigned",
      body: "The next action is assigned with owner, SLA, and context tied back to the recommendation rationale.",
      stat: "SLA 2d",
      rows: [
        "Owner assigned",
        "Calendar task created",
        "Pipeline status updated",
      ],
    },
  ],
  introductions: [
    {
      tag: "Intro packet",
      title: "Platform intro packet assembled",
      body: "The introduction is created inside the workflow with identity release, fit rationale, diligence access, and next-step context attached.",
      stat: "Complete",
      rows: [
        "Identity reveal approved",
        "Fit rationale attached",
        "Diligence packet included",
      ],
    },
    {
      tag: "In-platform",
      title: "Shared intro room opened",
      body: "Both sides enter a permissioned workspace instead of being handed a cold email thread or a call list.",
      stat: "In-app",
      rows: [
        "No cold email handoff",
        "No call list export",
        "Approved context visible to both sides",
      ],
    },
    {
      tag: "Workflow handoff",
      title: "Introduction becomes a live workflow",
      body: "The platform tracks response, diligence access, owner, and next meeting so the intro keeps its context after the reveal.",
      stat: "Live",
      rows: [
        "Allocator meeting task assigned",
        "Data room permissions active",
        "Response tracked in pipeline",
      ],
    },
  ],
};

function FilmCheck({ children, color = HERO_ACCENT_SOFT }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 17,
          height: 17,
          borderRadius: 5,
          background: `${color}12`,
          border: `1px solid ${color}24`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d="M2 5l2 2 4-4"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <span style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.45 }}>
        {children}
      </span>
    </div>
  );
}

function HeroProductDemo({ productRows }) {
  const [step, setStep] = useState(0);
  const [cursorPhase, setCursorPhase] = useState(0);
  const [clicking, setClicking] = useState(false);
  const [showClickModal, setShowClickModal] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);
  const [cursorOverride, setCursorOverride] = useState(null);
  const active = HERO_FILM_STEPS[step];
  const cursorPath = HERO_CURSOR_PATHS[active.id] || [];
  const cursorTarget =
    cursorOverride || cursorPath[cursorPhase] || cursorPath[0];

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;
    const timers = [];
    setCursorReady(false);
    setClicking(false);
    setShowClickModal(false);
    setCursorOverride(null);
    setCursorPhase(0);

    timers.push(window.setTimeout(() => setCursorReady(true), 1200));

    cursorPath.forEach((_, i) => {
      const moveAt = 1800 + i * 3900;
      const clickAt = moveAt + (i === 0 ? 520 : 1250);
      timers.push(
        window.setTimeout(() => {
          setCursorPhase(i);
          setClicking(false);
          setShowClickModal(false);
        }, moveAt)
      );
      timers.push(
        window.setTimeout(() => {
          setClicking(true);
          setShowClickModal(true);
        }, clickAt)
      );
      timers.push(
        window.setTimeout(() => {
          setClicking(false);
          setShowClickModal(false);
        }, clickAt + 2500)
      );
    });

    const nextStepIndex = (step + 1) % HERO_FILM_STEPS.length;
    const tabMoveAt = 3200 + cursorPath.length * 3900;
    const tabClickAt = tabMoveAt + 1080;
    timers.push(
      window.setTimeout(() => {
        setCursorOverride(HERO_TAB_CURSOR_POINTS[nextStepIndex]);
        setClicking(false);
        setShowClickModal(false);
      }, tabMoveAt)
    );
    timers.push(
      window.setTimeout(() => {
        setClicking(true);
      }, tabClickAt)
    );
    timers.push(
      window.setTimeout(() => {
        setClicking(false);
        setCursorOverride(null);
        setStep(nextStepIndex);
      }, tabClickAt + 420)
    );

    timers.push(
      window.setTimeout(() => {
        setCursorOverride(null);
      }, tabClickAt + 620)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [step, cursorPath]);

  const handleManualStep = (i) => {
    setClicking(false);
    setShowClickModal(false);
    setCursorOverride(null);
    setCursorReady(true);
    setCursorPhase(0);
    setStep(i);
  };

  const advanceLabel = cursorTarget?.action || "Review workflow";
  const nextLabel = HERO_FILM_STEPS[(step + 1) % HERO_FILM_STEPS.length].label;
  const clickModal = HERO_CLICK_POPOVERS[active.id]?.[cursorPhase] || {
    tag: active.label,
    title: advanceLabel,
    body: "Workflow state updated.",
    stat: "Done",
    rows: ["System updated", "Next step queued", "Audit event recorded"],
  };

  const shellCard = {
    borderRadius: 14,
    background:
      "linear-gradient(160deg, rgba(16,15,34,0.9) 0%, rgba(8,8,22,0.96) 56%, rgba(6,5,17,0.98) 100%)",
    border: "1px solid rgba(183,173,255,0.095)",
    boxShadow:
      "inset 0 1px 0 rgba(237,234,248,0.045), 0 12px 28px rgba(0,0,0,0.42), 0 0 8px rgba(120,110,220,0.018)",
    minHeight: 0,
  };

  const sceneGrid = {
    height: "100%",
    display: "grid",
    gap: 12,
    alignItems: "stretch",
  };

  const actionBadge = (color = active.color) => ({
    padding: "6px 9px",
    borderRadius: 7,
    background: `linear-gradient(135deg, ${color}14, rgba(255,255,255,0.025))`,
    border: `1px solid ${color}26`,
    color,
    boxShadow: `0 0 12px ${color}08`,
    fontSize: 10.5,
    fontWeight: 850,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  });

  const renderProfile = () => {
    const chips = [
      "Fund III",
      "$150M target",
      "Venture",
      "SaaS",
      "Fintech",
      "Healthcare",
    ];

    return (
      <div
        className="hero-film-grid"
        style={{
          ...sceneGrid,
          gridTemplateColumns: "1fr .82fr",
        }}
      >
        <div
          style={{
            ...shellCard,
            padding: 13,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10.5,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1.1,
                fontWeight: 800,
                marginBottom: 7,
              }}
            >
              Manager profile
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>
              Meridian Ventures Fund III
            </div>
            <p
              style={{
                fontSize: 11.5,
                color: C.textSoft,
                lineHeight: 1.5,
                marginBottom: 10,
              }}
            >
              A normalized manager profile gives the match engine structured
              evidence before any intro leaves the platform.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {chips.map((chip, i) => (
                <span
                key={chip}
                style={{
                  padding: "5px 8px",
                  borderRadius: 7,
                  background: `${active.color}13`,
                  border: `1px solid ${active.color}24`,
                  color: i < 3 ? active.color : C.textSoft,
                  fontSize: 10.5,
                  fontWeight: 750,
                  animation: `heroFilmIn .45s ${i * 0.08}s ease both`,
                }}
              >
                {chip}
              </span>
            ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 6,
              marginTop: "auto",
              paddingTop: 10,
            }}
          >
            {[
              ["Net IRR", "28.4%"],
              ["MOIC", "2.1x"],
              ["Raise", "40%"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "8px 8px",
                  borderRadius: 10,
                  background: "rgba(18,16,43,0.58)",
                  border: "1px solid rgba(183,173,255,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </div>
                <Mono
                  size={17}
                  weight={820}
                  color={label === "Raise" ? HERO_ACCENT_SOFT : HERO_ACCENT}
                >
                  {value}
                </Mono>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...shellCard,
            padding: 13,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 780 }}>
                LP mandate overlay
              </span>
              <Pill color={HERO_ACCENT}>Scoring ready</Pill>
            </div>

            {[
              ["Allocator", "Pacific Endowment"],
              ["Mandate", "Venture / Growth"],
              ["Ticket", "$5M-$25M"],
              ["Geo", "North America"],
              ["Disclosure", "Permissioned"],
            ].map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none",
                  animation: `heroFilmIn .45s ${0.16 + i * 0.08}s ease both`,
                }}
              >
                <span style={{ color: C.textMuted, fontSize: 11.5 }}>
                  {label}
                </span>
                <span
                  style={{
                    color: C.text,
                    fontSize: 12,
                    fontWeight: 760,
                    textAlign: "right",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: `${HERO_ACCENT}0e`,
              border: `1px solid ${HERO_ACCENT}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <FilmCheck>
              Profile snapshot ready for mandate-fit scoring
            </FilmCheck>
            <span style={actionBadge(HERO_ACCENT)}>Commit</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMatch = () => (
    <div
      className="hero-film-grid"
      style={{
        ...sceneGrid,
        gridTemplateColumns: "1.1fr .9fr",
      }}
    >
      <div style={{ ...shellCard, padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>
              Mandate-fit model
            </div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              Ranked allocator recommendations
            </div>
          </div>
          <Pill color={HERO_ACCENT}>Model run</Pill>
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {productRows.map((row, i) => {
            const score = Number(row.score.replace("%", ""));
            return (
              <div
                key={row.name}
                style={{
                  padding: 12,
                  borderRadius: 13,
                  background:
                    i === 0
                      ? `linear-gradient(135deg, ${HERO_FIT}1c, ${HERO_ACCENT}10 56%, rgba(10,8,28,0.72))`
                      : "rgba(18,16,43,0.58)",
                  border: `1px solid ${
                    i === 0 ? `${HERO_FIT}34` : "rgba(183,173,255,0.10)"
                  }`,
                  boxShadow:
                    i === 0
                      ? `0 16px 38px ${HERO_FIT}10, inset 0 1px 0 rgba(255,255,255,0.06)`
                      : "inset 0 1px 0 rgba(255,255,255,0.035)",
                  animation: `heroFilmIn .42s ${i * 0.1}s ease both`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: `${row.tone}14`,
                      border: `1px solid ${row.tone}28`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: row.tone,
                      fontSize: 10.5,
                      fontWeight: 850,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(row.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 780,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                    >
                      {row.strategy} / {row.region} / active mandate
                    </div>
                  </div>
                  <Mono size={15} weight={800} color={row.tone}>
                    {row.score}
                  </Mono>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.065)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${score}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${row.tone}, ${HERO_ACCENT_SOFT})`,
                      boxShadow: `0 0 14px ${row.tone}55`,
                      animation: "heroFilmBar .8s ease both",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          ...shellCard,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 780, marginBottom: 12 }}>
            Recommendation rationale
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <FilmCheck>Mandate vector similarity: 0.91</FilmCheck>
            <FilmCheck>Check-size overlap: $5M-$25M</FilmCheck>
            <FilmCheck>Sector evidence: SaaS, fintech, healthcare</FilmCheck>
            <FilmCheck>Deployment status verified this quarter</FilmCheck>
          </div>
        </div>
        <div
          style={{
            padding: 14,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${HERO_FIT}16, ${HERO_ACCENT}0c)`,
            border: `1px solid ${HERO_FIT}30`,
            boxShadow: `0 0 24px ${HERO_FIT}0a`,
          }}
        >
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
            Recommendation
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <Mono size={22} weight={850} color={HERO_FIT}>
                94%
              </Mono>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                Priority introduction candidate
              </div>
            </div>
            <span style={actionBadge(HERO_FIT)}>Promote</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiligence = () => (
    <div
      className="hero-film-grid"
      style={{
        ...sceneGrid,
        gridTemplateColumns: ".95fr 1.05fr",
      }}
    >
      <div style={{ ...shellCard, padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>
              Diligence room
            </div>
            <div style={{ fontSize: 14, fontWeight: 820 }}>
              Institutional packet
            </div>
          </div>
          <Pill color={HERO_REVIEW}>92% complete</Pill>
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {[
            ["DDQ", "Complete", HERO_FIT],
            ["Track record", "Verified", HERO_FIT],
            ["Fund terms", "Reviewed", HERO_ACCENT_SOFT],
            ["References", "2 pending", HERO_REVIEW],
            ["Legal docs", "Queued", C.textMuted],
          ].map(([label, value, color], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 11,
                background:
                  color === HERO_REVIEW
                    ? `${HERO_REVIEW}0b`
                    : "rgba(18,16,43,0.58)",
                border: `1px solid ${
                  color === HERO_REVIEW
                    ? `${HERO_REVIEW}24`
                    : "rgba(183,173,255,0.10)"
                }`,
                animation: `heroFilmIn .38s ${i * 0.08}s ease both`,
              }}
            >
              <span
                style={{ fontSize: 12, color: C.textSoft, fontWeight: 720 }}
              >
                {label}
              </span>
              <span style={{ fontSize: 12, color, fontWeight: 820 }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          ...shellCard,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 780, marginBottom: 10 }}>
            LP diligence lens
          </div>
          <div
            style={{
              padding: 14,
              borderRadius: 13,
              background: `linear-gradient(135deg, ${HERO_REVIEW}15, ${HERO_ACCENT}0b 70%, rgba(148,163,184,0.04))`,
              border: `1px solid ${HERO_REVIEW}2a`,
              boxShadow: `0 0 30px ${HERO_REVIEW}0a`,
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>
              Diligence summary
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              Strong fit on strategy and check size. Reference completion is the
              only gating item before reveal.
            </div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <FilmCheck>DDQ mapped to allocator policy checklist</FilmCheck>
            <FilmCheck>
              Performance fields normalized across vintage years
            </FilmCheck>
            <FilmCheck color={HERO_REVIEW}>
              Two references still outstanding
            </FilmCheck>
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: `${HERO_REVIEW}0e`,
            border: `1px solid ${HERO_REVIEW}24`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <FilmCheck color={HERO_REVIEW}>
            Packet ready for controlled access
          </FilmCheck>
          <span style={actionBadge(HERO_REVIEW)}>Release</span>
        </div>
      </div>
    </div>
  );

  const renderReveal = () => (
    <div
      className="hero-film-grid"
      style={{
        ...sceneGrid,
        gridTemplateColumns: ".92fr 1.08fr",
      }}
    >
      <div
        style={{
          ...shellCard,
          padding: 13,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${HERO_TRUST}18, ${HERO_ACCENT}10)`,
            border: `1px solid ${HERO_TRUST}35`,
            boxShadow: `0 0 30px ${HERO_TRUST}10, inset 0 1px 0 rgba(255,255,255,0.08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            animation: "heroFilmDrift 3s ease infinite",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 3v5c0 5-3.3 8.3-7 10-3.7-1.7-7-5-7-10V6l7-3z"
              stroke={HERO_TRUST}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9.2 12.2L11 14l3.8-4"
              stroke={HERO_ACCENT_SOFT}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ fontSize: 15, fontWeight: 820, marginBottom: 6 }}>
          Approval gate reached
        </div>
        <p
          style={{
            maxWidth: 220,
            fontSize: 11.5,
            color: C.textSoft,
            lineHeight: 1.55,
          }}
        >
          Identity, diligence access, and intro context stay permissioned until
          both sides clear the reveal workflow.
        </p>
      </div>

      <div style={{ ...shellCard, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            ["LP identity", "Hidden", C.textMuted],
            ["Mandate fit", "94% / approved", HERO_FIT],
            ["Disclosure status", "Dual consent", HERO_TRUST],
            ["Audit trail", "Captured", HERO_STATUS_MUTED],
          ].map(([label, value, color], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 13px",
                borderRadius: 12,
                background:
                  color === HERO_TRUST
                    ? `${HERO_TRUST}0d`
                    : "rgba(18,16,43,0.58)",
                border: `1px solid ${
                  color === HERO_TRUST
                    ? `${HERO_TRUST}26`
                    : "rgba(183,173,255,0.10)"
                }`,
                animation: `heroFilmIn .42s ${i * 0.1}s ease both`,
              }}
            >
              <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
              <span style={{ fontSize: 12.5, color, fontWeight: 800 }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 15,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${HERO_ACCENT}18, ${HERO_TRUST}0c 76%, rgba(148,163,184,0.04))`,
            border: `1px solid ${HERO_ACCENT_SOFT}2c`,
            boxShadow: `0 0 28px ${HERO_ACCENT}0a`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
            Permissioned intro packet
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 7,
                color: C.textSoft,
                fontSize: 11.5,
                lineHeight: 1.45,
              }}
            >
              <div>Pacific Endowment x Meridian Ventures Fund III</div>
              <div>
                Identity, rationale, approvals, and disclosure log attached.
              </div>
            </div>
            <span style={actionBadge(HERO_TRUST)}>Approve</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPipeline = () => {
    const columns = [
      {
        label: "Approved",
        items: ["Pacific Endowment", "Blue Peak"],
        c: HERO_ACCENT,
      },
      { label: "Introduced", items: ["Harborview"], c: HERO_TRUST },
      {
        label: "Diligence",
        items: ["Sterling Partners"],
        c: HERO_REVIEW,
      },
    ];

    return (
      <div
        style={{
          ...shellCard,
          padding: 12,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>
              Capital workflow
            </div>
            <div style={{ fontSize: 14, fontWeight: 820 }}>
              Governed pipeline progression
            </div>
          </div>
          <Pill color={HERO_ACCENT}>4 active workflows</Pill>
        </div>

        <div
          className="hero-film-pipeline"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {columns.map((col, i) => (
            <div
              key={col.label}
              style={{
                minHeight: 170,
                borderRadius: 14,
                background:
                  i === 0
                    ? `linear-gradient(180deg, ${HERO_ACCENT}12, rgba(18,16,43,0.58))`
                    : "rgba(18,16,43,0.58)",
                border: `1px solid ${
                  i === 0 ? `${HERO_ACCENT}28` : "rgba(183,173,255,0.10)"
                }`,
                boxShadow: i === 0 ? `0 18px 38px ${HERO_ACCENT}0d` : "none",
                padding: 11,
                animation: `heroFilmIn .42s ${i * 0.1}s ease both`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 11.5, color: C.textSoft }}>
                  {col.label}
                </span>
                <Mono size={13} weight={800} color={col.c}>
                  {col.items.length}
                </Mono>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {col.items.map((item, j) => (
                  <div
                    key={item}
                    style={{
                      padding: "10px 9px",
                      borderRadius: 10,
                      background: `${col.c}12`,
                      border: `1px solid ${col.c}24`,
                      color: C.text,
                      fontSize: 11.5,
                      fontWeight: 750,
                      boxShadow: `0 10px 26px ${col.c}08`,
                      animation: `heroFilmIn .42s ${
                        0.18 + j * 0.08
                      }s ease both`,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "11px 13px",
            borderRadius: 12,
            background: `${HERO_ACCENT}0e`,
            border: `1px solid ${HERO_ACCENT}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <FilmCheck>Next action assigned: schedule allocator call</FilmCheck>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Mono size={13} weight={800} color={HERO_ACCENT}>
              SLA 2d
            </Mono>
            <span style={actionBadge(HERO_ACCENT)}>Assign</span>
          </span>
        </div>
      </div>
    );
  };

  const renderIntroductions = () => (
    <div
      className="hero-film-grid"
      style={{
        ...sceneGrid,
        gridTemplateColumns: "1.05fr .95fr",
      }}
    >
      <div
        style={{
          ...shellCard,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}
              >
                Platform introduction
              </div>
              <div style={{ fontSize: 14, fontWeight: 820 }}>
                Permissioned intro workflow
              </div>
            </div>
            <Pill color={HERO_ACCENT}>In-platform</Pill>
          </div>

          <div
            style={{
              padding: 15,
              borderRadius: 15,
              background: `linear-gradient(135deg, ${HERO_ACCENT}18, ${HERO_TRUST}0b 72%, rgba(148,163,184,0.04))`,
              border: `1px solid ${HERO_ACCENT_SOFT}30`,
              boxShadow: `0 0 30px ${HERO_ACCENT}0c`,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 830,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Pacific Endowment x Meridian Ventures Fund III
                </div>
                <div
                  style={{ fontSize: 11.5, color: C.textSoft, marginTop: 4 }}
                >
                  Reveal-approved context, diligence access, and match rationale
                </div>
              </div>
              <Mono size={20} weight={850} color={HERO_ACCENT}>
                94%
              </Mono>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              {[
                "Identity released",
                "Rationale attached",
                "Data room access",
              ].map((item, i) => (
                <div
                  key={item}
                  style={{
                    padding: "9px 8px",
                    borderRadius: 10,
                    background:
                      i === 0 ? `${HERO_ACCENT}12` : "rgba(3,6,18,0.34)",
                    border: `1px solid ${
                      i === 0 ? `${HERO_ACCENT}26` : "rgba(255,255,255,0.08)"
                    }`,
                    color: i === 0 ? HERO_ACCENT_SOFT : C.textSoft,
                    fontSize: 10.5,
                    fontWeight: 780,
                    textAlign: "center",
                    animation: `heroFilmIn .38s ${i * 0.08}s ease both`,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 9 }}>
            <FilmCheck color={HERO_ACCENT}>
              No cold email handoff or call-list export
            </FilmCheck>
            <FilmCheck color={HERO_ACCENT}>
              Both sides join with the same approved context
            </FilmCheck>
            <FilmCheck color={HERO_ACCENT}>
              Diligence, approvals, and responses stay tied to the workflow
            </FilmCheck>
          </div>
        </div>

        <div
          style={{
            padding: "12px 13px",
            borderRadius: 12,
            background: `${HERO_ACCENT}0e`,
            border: `1px solid ${HERO_ACCENT}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <FilmCheck color={HERO_ACCENT}>
            Introduction room ready for both parties
          </FilmCheck>
          <span style={actionBadge(HERO_ACCENT)}>Open room</span>
        </div>
      </div>

      <div
        style={{
          ...shellCard,
          padding: 10,
          display: "grid",
          gridTemplateRows: "auto repeat(3, minmax(0, 1fr))",
          gap: 8,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>
          Live intro room
        </div>
        {[
          [
            "Context",
            "Why this LP matches, what changed, and what diligence is visible",
            HERO_ACCENT,
          ],
          [
            "Access",
            "LP and GP permissions scoped to this introduction only",
            HERO_ACCENT_SOFT,
          ],
          [
            "Next step",
            "Allocator review meeting assigned to capital formation owner",
            HERO_STATUS_MUTED,
          ],
        ].map(([label, value, color], i) => (
          <div
            key={label}
            style={{
              minHeight: 0,
              padding: "10px 11px",
              borderRadius: 12,
              background: i === 0 ? `${color}12` : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                i === 0 ? color + "28" : "rgba(255,255,255,0.06)"
              }`,
              animation: `heroFilmIn .4s ${i * 0.08}s ease both`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 4,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  color,
                  fontSize: 10,
                  fontWeight: 850,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
              <Dot color={color} size={5} pulse={i === 0} />
            </div>
            <div
              style={{
                color: C.textSoft,
                fontSize: 11.2,
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const scene =
    active.id === "profile"
      ? renderProfile()
      : active.id === "matches"
      ? renderMatch()
      : active.id === "diligence"
      ? renderDiligence()
      : active.id === "reveal"
      ? renderReveal()
      : active.id === "pipeline"
      ? renderPipeline()
      : renderIntroductions();

  return (
    <div
      className="hero-dashboard-shell hero-product-film"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 800,
        minHeight: 600,
        borderRadius: 28,
        background:
          "linear-gradient(150deg, rgba(15,14,34,0.995) 0%, rgba(7,7,21,0.998) 52%, rgba(11,10,29,0.995) 100%)",
        border: "1px solid rgba(183,173,255,0.12)",
        boxShadow: `
          0 34px 76px rgba(0,0,0,.74),
          0 0 0 1px rgba(255,255,255,0.04) inset,
          0 1px 0 rgba(255,255,255,0.075) inset,
          0 0 28px rgba(120,110,220,0.055),
          0 0 14px ${active.color}08
        `,
        overflow: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 58,
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 42% at 76% -8%, ${active.color}08, transparent 62%),
            radial-gradient(ellipse 46% 35% at 8% 18%, ${HERO_ACCENT}06, transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 18%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          padding: "13px 18px 10px",
          borderBottom: "1px solid rgba(183,173,255,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          background:
            "linear-gradient(180deg, rgba(13,12,31,0.96) 0%, rgba(8,8,22,0.94) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {[
            { bg: "#FF5F56", glow: "rgba(255,95,86,0.65)" },
            { bg: "#FFBD2E", glow: "rgba(255,189,46,0.55)" },
            { bg: "#28CA41", glow: "rgba(40,202,65,0.55)" },
          ].map(({ bg, glow }) => (
            <div
              key={bg}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 38%, ${bg}, ${bg}bb)`,
                boxShadow: `0 0 0 0.5px rgba(0,0,0,0.5) inset, 0 0 7px ${glow}`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            minWidth: 0,
            flex: 1,
            height: 30,
            borderRadius: 7,
            background: "rgba(4,3,14,0.74)",
            border: "1px solid rgba(183,173,255,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 11px",
            boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 0 7px ${HERO_ACCENT}06`,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path
              d="M5.5 7V5.4C5.5 3.95 6.55 3 8 3s2.5.95 2.5 2.4V7"
              stroke={HERO_ACCENT}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="7"
              width="8"
              height="6"
              rx="1.6"
              stroke={HERO_ACCENT}
              strokeWidth="1.5"
            />
          </svg>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: "rgba(190,200,232,0.64)" }}>
              app.mandateos.ai
            </span>
            <span style={{ color: "rgba(237,234,248,0.9)" }}>
              /institutional-workflows/{active.id}
            </span>
          </span>
        </div>
      </div>

      <div style={{ position: "relative", padding: 18 }}>
        <div
          className="hero-film-tabs"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {HERO_FILM_STEPS.map((s, i) => {
            const isActive = active.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleManualStep(i)}
                style={{
                  minWidth: 0,
                  padding: "9px 10px",
                  borderRadius: 8,
                  border: `1px solid ${
                    isActive ? `${s.color}55` : "rgba(255,255,255,0.07)"
                  }`,
                  background: isActive
                    ? `linear-gradient(135deg, ${s.color}28 0%, ${s.color}0c 100%)`
                    : "rgba(6,5,18,0.62)",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.38)",
                  boxShadow: isActive
                    ? `inset 0 -2px 0 ${s.color}cc, 0 0 22px ${s.color}33, 0 0 6px ${s.color}18`
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 10.8,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition:
                    "background .2s ease, border-color .2s ease, color .2s ease",
                }}
              >
                <span
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </span>
                <span style={{ opacity: 0.7 }}>{s.eyebrow}</span>
              </button>
            );
          })}
        </div>

        <div
          key={`${active.id}-progress`}
          style={{
            height: 2,
            borderRadius: 99,
            background: "rgba(255,255,255,0.08)",
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((step + 1) / HERO_FILM_STEPS.length) * 100}%`,
              transformOrigin: "left center",
              background: `linear-gradient(90deg, ${active.color}dd, ${active.color}66)`,
              boxShadow: `0 0 10px ${active.color}46`,
              transition: "width .42s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
            color: "rgba(237,234,248,0.68)",
            fontSize: 11,
            fontWeight: 760,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            padding: "10px 12px",
            borderRadius: 11,
            background: `linear-gradient(135deg, ${active.color}0d 0%, rgba(6,5,18,0.72) 100%)`,
            border: `1px solid ${active.color}30`,
          }}
        >
          <span>Workflow: {active.label}</span>
          <span className="hide-mobile">Access policy: Permissioned</span>
          <span>Next: {nextLabel}</span>
        </div>

        <div
          key={active.id}
          className="hero-scene-frame"
          style={{
            height: 360,
            minHeight: 360,
            overflow: "hidden",
            animation: "heroFilmIn .5s cubic-bezier(.16,1,.3,1) both",
            willChange: "opacity, transform",
            borderRadius: 14,
            boxShadow: `0 0 0 1px ${active.color}44, 0 0 48px ${active.color}22, 0 0 8px ${active.color}14`,
            transition: "box-shadow .4s ease",
          }}
        >
          {scene}
        </div>

        <div
          className="hero-film-status"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
            marginTop: 14,
          }}
        >
          {[
            ["Control", "Audit log active"],
            ["Policy", "Permissioned reveal"],
            ["Owner", "Capital formation team"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                minWidth: 0,
                padding: "10px 12px",
                borderRadius: 11,
                background: `linear-gradient(135deg, rgba(124,111,247,0.09) 0%, rgba(6,5,18,0.65) 100%)`,
                border: "1px solid rgba(183,173,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span
                style={{
                  color: "rgba(237,234,248,0.58)",
                  fontSize: 10,
                  fontWeight: 850,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color:
                    label === "Control"
                      ? active.color
                      : "rgba(237,234,248,0.78)",
                  fontSize: 11.5,
                  fontWeight: 760,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showClickModal && (
        <div
          key={`${active.id}-${cursorPhase}-modal`}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 22,
            background: "rgba(3,6,14,0.62)",
            pointerEvents: "none",
            animation: "fadeIn .18s ease both",
            willChange: "opacity",
          }}
        >
          <div
            style={{
              width: "min(440px, 86%)",
              borderRadius: 18,
              padding: 18,
              background: `linear-gradient(180deg, rgba(20,16,46,0.988), rgba(8,7,22,0.988))`,
              border: `1px solid ${active.color}55`,
              boxShadow: `
                0 28px 70px rgba(0,0,0,0.72),
                0 0 0 1px rgba(255,255,255,0.06) inset,
                0 0 48px ${active.color}2a,
                0 0 90px ${active.color}12
              `,
              animation: "popIn .24s cubic-bezier(.16,1,.3,1) both",
              willChange: "opacity, transform",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `${active.color}12`,
                    border: `1px solid ${active.color}2c`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active.color,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3.5 9.2 7.1 12.8 14.8 5.2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: active.color,
                      fontWeight: 860,
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {clickModal.tag}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      color: C.text,
                      fontWeight: 830,
                      letterSpacing: -0.3,
                    }}
                  >
                    {clickModal.title}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "7px 10px",
                  borderRadius: 10,
                  background: `${active.color}10`,
                  border: `1px solid ${active.color}28`,
                  color: active.color,
                  fontFamily: "'Source Code Pro',monospace",
                  fontSize: 13,
                  fontWeight: 820,
                  whiteSpace: "nowrap",
                }}
              >
                {clickModal.stat}
              </div>
            </div>

            <p
              style={{
                margin: "0 0 14px",
                color: C.textSoft,
                fontSize: 12.8,
                lineHeight: 1.62,
              }}
            >
              {clickModal.body}
            </p>

            <div style={{ display: "grid", gap: 8 }}>
              {clickModal.rows.map((row, i) => (
                <div
                  key={row}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 10px",
                    borderRadius: 10,
                    background: "rgba(8,7,22,0.72)",
                    border: "1px solid rgba(183,173,255,0.11)",
                    animation: `heroFilmIn .22s ${i * 0.05}s ease both`,
                  }}
                >
                  <Dot color={active.color} size={5} />
                  <span
                    style={{
                      color: C.textSoft,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="hero-product-cursor"
        style={{
          position: "absolute",
          left: cursorTarget?.left,
          top: cursorTarget?.top,
          zIndex: 5,
          transform: clicking
            ? "translate(-8px, 6px) scale(.93)"
            : "translate(-10px, 8px) scale(1)",
          transition:
            "left 1.35s cubic-bezier(.22,1,.36,1), top 1.35s cubic-bezier(.22,1,.36,1), transform .24s cubic-bezier(.22,1,.36,1), opacity .28s ease",
          opacity: cursorReady ? 1 : 0,
          pointerEvents: "none",
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,.42))",
          willChange: "left, top, transform, opacity",
        }}
      >
        {clicking && (
          <span
            style={{
              position: "absolute",
              left: -5,
              top: -5,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `1px solid ${active.color}70`,
              background: `${active.color}10`,
              animation: "heroCursorClick .42s ease-out both",
            }}
          />
        )}
        <svg width="24" height="29" viewBox="0 0 24 29" fill="none">
          <path
            d="M3 2.5 21 17.2l-8.2 1-3.6 8L3 2.5Z"
            fill="#ffffff"
            stroke="rgba(4,7,18,.84)"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function Hero({
  onOpenGpDemo,
  onOpenLpDemo,
  onOpenDiligenceDemo,
  onOpenDemo,
}) {
  const [liveDemoHover, setLiveDemoHover] = useState(false);
  const productRows = [
    {
      name: "Pacific Endowment",
      strategy: "Venture",
      region: "North America",
      score: "94%",
      tone: HERO_FIT,
    },
    {
      name: "Harborview Allocators",
      strategy: "Growth",
      region: "Global",
      score: "88%",
      tone: HERO_ACCENT_SOFT,
    },
    {
      name: "Blue Peak Foundation",
      strategy: "Venture",
      region: "North America",
      score: "82%",
      tone: HERO_STATUS_MUTED,
    },
  ];

  return (
    <section
      className="landing-band"
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "visible",
        minHeight: "94svh",
        paddingTop: 48,
        paddingBottom: 38,
        boxSizing: "border-box",
      }}
    >
      {/* Background depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${C.accent}07, transparent 62%)`,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border}14 1px, transparent 1px), linear-gradient(90deg, ${C.border}14 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          mask: "radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 80%)",
          WebkitMask:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 80%)",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}0a, transparent 68%)`,
          filter: "blur(100px)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}06, transparent 68%)`,
          filter: "blur(96px)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 300,
          background: `linear-gradient(to top, ${C.black}, transparent)`,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <Wrap
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1360,
          padding: "0 clamp(22px, 4vw, 64px)",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div
          className="hero-grid"
          style={{
            gridTemplateColumns: "minmax(0, 0.86fr) minmax(0, 1.14fr)",
            gap: "clamp(42px, 5vw, 78px)",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 650 }}>
            <Reveal>
              <h1
                style={{
                  fontSize: "clamp(40px,4.8vw,64px)",
                  fontWeight: 820,
                  lineHeight: 0.98,
                  letterSpacing: -2.8,
                  marginBottom: 18,
                  maxWidth: 720,
                }}
              >
                Capital Intelligence for{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.accentBright} 0%, ${C.purple} 45%, #8b6cf0 72%, ${C.accent} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Private Markets
                </span>
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p
                style={{
                  fontSize: "clamp(15px,1.45vw,17.5px)",
                  color: "rgba(203, 213, 235, 0.82)",
                  lineHeight: 1.6,
                  maxWidth: 520,
                  marginBottom: 22,
                  letterSpacing: "-0.005em",
                  fontWeight: 400,
                }}
              >
                Standardize LP mandates, GP submissions, and fit scoring in one
                workflow.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div
                className="hero-actions"
                style={{
                  display: "grid",
                  gap: 11,
                  justifyItems: "start",
                  marginBottom: 28,
                }}
              >
                <button
                  className="hero-live-demo-btn"
                  type="button"
                  onClick={onOpenDemo}
                  onMouseEnter={() => setLiveDemoHover(true)}
                  onMouseLeave={() => setLiveDemoHover(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "13px 21px",
                    minHeight: 48,
                    borderRadius: 8,
                    background: liveDemoHover
                      ? "linear-gradient(135deg, #8F80F7, #6558E8)"
                      : "linear-gradient(135deg, #786DF0, #5146D7)",
                    border: "1px solid rgba(167,139,250,.26)",
                    color: C.white,
                    fontSize: 14.5,
                    fontWeight: 780,
                    letterSpacing: 0,
                    cursor: "pointer",
                    boxShadow: liveDemoHover
                      ? "0 13px 32px rgba(124,111,247,.26), 0 0 0 1px rgba(167,139,250,.18) inset"
                      : "0 9px 24px rgba(124,111,247,.18)",
                    transition:
                      "background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease",
                    transform: liveDemoHover ? "translateY(-1px)" : "none",
                  }}
                >
                  Book A Founder-Led Demo
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M4 11 11 4M6 4h5v5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="hero-demo-buttons"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 9,
                    width: "min(640px, 100%)",
                  }}
                >
                  {[
                    {
                      label: "Launch GP Demo",
                      onClick: () => onOpenGpDemo?.("overview"),
                    },
                    {
                      label: "Launch LP Demo",
                      onClick: () => onOpenLpDemo?.("room"),
                    },
                    {
                      label: "Launch DiligenceOS",
                      onClick: onOpenDiligenceDemo,
                    },
                  ].map((demo) => (
                    <button
                      key={demo.label}
                      type="button"
                      onClick={demo.onClick}
                      style={{
                        minHeight: 44,
                        padding: "11px 12px",
                        borderRadius: 8,
                        background: "rgba(17,18,34,.68)",
                        border: "1px solid rgba(237,234,248,.09)",
                        color: "rgba(237,234,248,.94)",
                        boxShadow: "0 8px 18px rgba(0,0,0,.14)",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <span style={{ display: "block", fontSize: 12.8, fontWeight: 760, lineHeight: 1.2 }}>
                        {demo.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

          </div>

          <Reveal delay={180}>
            <div
              className="hero-stage"
              style={{
                position: "relative",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {/* Centre bloom */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 680,
                  height: 680,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(80,110,220,0.105) 0%, rgba(60,90,200,0.035) 42%, transparent 70%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              {/* Top-right accent */}
              <div
                style={{
                  position: "absolute",
                  top: "-5%",
                  right: "-10%",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(100,80,220,0.058), transparent 68%)",
                  filter: "blur(80px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              {/* Bottom-left teal */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "-5%",
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(30,180,160,0.045), transparent 68%)",
                  filter: "blur(72px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div
                className="hero-product-tilt"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "min(100%, 800px)",
                  marginLeft: "auto",
                  perspective: 1400,
                  transform:
                    "perspective(1400px) rotateY(-5deg) rotateX(2deg) rotateZ(.4deg) scale(.96)",
                  transformOrigin: "center right",
                  transformStyle: "preserve-3d",
                  filter: "drop-shadow(-14px 22px 30px rgba(0,0,0,.32))",
                }}
              >
                <HeroProductDemo productRows={productRows} />
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW MANDATEOS WORKS
   ════════════════════════════════════════════ */
export function HowMandateOSWorks() {
  const workflowSteps = [
    {
      n: "01",
      title: "LP defines mandate",
      cards: [0],
    },
    {
      n: "02",
      title: "GP submission",
      cards: [1],
    },
    {
      n: "03",
      title: "Fit scoring",
      cards: [2],
    },
    {
      n: "04",
      title: "DiligenceOS review",
      cards: [3],
    },
    {
      n: "05",
      title: "Permissioned workflow",
      cards: [4],
    },
  ];
  const [activeCard, setActiveCard] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setActiveCard((current) => (current + 1) % workflowSteps.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [paused]);

  const activeStepIndex = workflowSteps.findIndex((step) =>
    step.cards.includes(activeCard)
  );

  const Chip = ({ children, tone = "neutral" }) => {
    const toneColor =
      tone === "green"
        ? C.green
        : tone === "amber"
        ? C.amber
        : tone === "teal"
        ? C.teal
        : tone === "purple"
        ? C.purple
        : C.textMuted;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 23,
          padding: "4px 7px",
          borderRadius: 6,
          border: `1px solid ${toneColor}28`,
          background: `${toneColor}12`,
          color: tone === "neutral" ? C.textSoft : toneColor,
          fontSize: 10.5,
          fontWeight: 650,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  };

  const CheckRow = ({ children, tone = "green" }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 0",
        borderTop: `1px solid ${C.borderSubtle}`,
        color: C.textSoft,
        fontSize: 11.5,
        lineHeight: 1.25,
      }}
    >
      <span
        style={{
          width: 13,
          height: 13,
          borderRadius: 4,
          border: `1px solid ${tone === "amber" ? C.amber : C.green}55`,
          background: `${tone === "amber" ? C.amber : C.green}12`,
          display: "grid",
          placeItems: "center",
          color: tone === "amber" ? C.amber : C.green,
          fontSize: 8,
          flexShrink: 0,
        }}
      >
        {tone === "amber" ? "!" : "✓"}
      </span>
      <span>{children}</span>
    </div>
  );

  const LaptopCard = ({ index, title, status, footer, cursor = "72,70", children }) => {
    const active = activeCard === index;
    const [cursorX, cursorY] = cursor.split(",").map(Number);

    return (
      <button
        type="button"
        onClick={() => setActiveCard(index)}
        onMouseEnter={() => {
          setPaused(true);
          setActiveCard(index);
        }}
        onMouseLeave={() => setPaused(false)}
        className="mandate-how-card"
        style={{
          width: "100%",
          height: 520,
          border: `1px solid ${active ? "rgba(124,111,247,.52)" : C.border}`,
          borderRadius: 12,
          background: active
            ? "linear-gradient(180deg, rgba(19,17,50,.96), rgba(10,10,28,.98))"
            : "linear-gradient(180deg, rgba(16,14,38,.92), rgba(8,8,22,.98))",
          boxShadow: active
            ? "0 22px 58px rgba(0,0,0,.42), 0 0 0 1px rgba(124,111,247,.14), 0 0 34px rgba(124,111,247,.12)"
            : "0 10px 30px rgba(0,0,0,.24)",
          opacity: 1,
          transform: active ? "translateY(-2px)" : "none",
          transition:
            "opacity .25s ease, transform .25s ease, border-color .25s ease, box-shadow .25s ease",
          padding: 0,
          overflow: "hidden",
          color: C.text,
          textAlign: "left",
          cursor: "pointer",
          position: "relative",
          animation: "fadeIn .24s ease both",
        }}
      >
        <div
          style={{
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 13px",
            borderBottom: `1px solid ${C.borderSubtle}`,
            background: "rgba(255,255,255,.025)",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["#f87171", "Close"],
              ["#fbbf24", "Minimize"],
              ["#34d399", "Live"],
            ].map(([color, label]) => (
              <span
                key={label}
                aria-label={label}
                style={{ width: 8, height: 8, borderRadius: 999, background: color, opacity: 0.9 }}
              />
            ))}
          </div>
          <span style={{ color: C.textMuted, fontSize: 10.5, fontWeight: 650 }}>
            mandateos.app/workflow
          </span>
        </div>
        <div style={{ padding: 16, height: "calc(100% - 34px)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 13.5, fontWeight: 750, color: C.text }}>{title}</div>
            <Chip tone={active ? "purple" : "neutral"}>{status}</Chip>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
          <div
            style={{
              marginTop: 13,
              paddingTop: 10,
              borderTop: `1px solid ${C.borderSubtle}`,
              color: active ? C.green : C.textMuted,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {footer}
          </div>
        </div>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            width: 18,
            height: 24,
            background: "#fff",
            clipPath: "polygon(0 0, 0 100%, 6px 76%, 11px 97%, 15px 96%, 10px 73%, 18px 73%)",
            filter: "drop-shadow(0 5px 10px rgba(0,0,0,.42))",
            opacity: active ? 0.95 : 0,
            transform: active ? "translate3d(0,0,0)" : "translate3d(-8px,8px,0)",
            transition: "opacity .28s ease, transform .35s cubic-bezier(.22,1,.36,1)",
            pointerEvents: "none",
          }}
        />
      </button>
    );
  };

  const cards = [
    {
      title: "LP Mandate Builder",
      status: "LP View",
      footer: "Mandate published",
      cursor: "74,74",
      body: (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {["Venture Capital", "Growth Equity", "Buyout", "North America", "Europe"].map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 12 }}>
            <div style={{ padding: 10, borderRadius: 8, background: C.bg, border: `1px solid ${C.borderSubtle}` }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Check size</div>
              <Mono size={15} weight={800} color={C.text}>$5M-$25M</Mono>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: C.bg, border: `1px solid ${C.borderSubtle}` }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Pacing</div>
              <Mono size={15} weight={800} color={C.text}>3 commitments</Mono>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {["Crypto", "Tobacco", "Weapons"].map((chip) => (
              <Chip key={chip} tone="amber">{chip}</Chip>
            ))}
          </div>
          {["DDQ required", "References", "Track record audit"].map((item) => (
            <CheckRow key={item}>{item}</CheckRow>
          ))}
        </div>
      ),
    },
    {
      title: "GP Submission Profile",
      status: "GP View",
      footer: "Reusable diligence packet created",
      cursor: "70,66",
      body: (
        <div>
          <div style={{ padding: 12, borderRadius: 8, background: C.bg, border: `1px solid ${C.borderSubtle}`, marginBottom: 12 }}>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 760 }}>Northline Capital III</div>
            <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>Growth Equity · $300M target raise</div>
          </div>
          {[
            ["Deck uploaded", "green"],
            ["DDQ uploaded", "green"],
            ["Track record uploaded", "green"],
            ["References pending", "amber"],
            ["Legal docs queued", "amber"],
          ].map(([item, tone]) => (
            <CheckRow key={item} tone={tone}>{item}</CheckRow>
          ))}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.textMuted, fontSize: 10.5, fontWeight: 700, marginBottom: 6 }}>
              <span>Completeness</span>
              <span>82%</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: C.borderSubtle, overflow: "hidden" }}>
              <div style={{ width: "82%", height: "100%", background: C.green }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Mandate-Fit Engine",
      status: "Scoring",
      footer: "Qualified for LP review",
      cursor: "78,50",
      body: (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
            <Mono size={42} weight={850} color={C.green}>92%</Mono>
            <span style={{ color: C.textSoft, fontSize: 13, fontWeight: 700 }}>Fit</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            {["Strategy match", "Check size match", "Geography match", "Sector fit", "Exclusions cleared", "DDQ requirement met"].map((item) => (
              <CheckRow key={item}>{item}</CheckRow>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 10, borderRadius: 8, border: `1px solid ${C.amber}2e`, background: `${C.amber}10`, color: C.amber, fontSize: 11.5, fontWeight: 700 }}>
            References pending
          </div>
        </div>
      ),
    },
    {
      title: "DiligenceOS",
      status: "AI Review",
      footer: "Memo generated",
      cursor: "72,76",
      body: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 14, marginBottom: 16 }}>
            <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${C.borderSubtle}`, background: C.bg }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 750, textTransform: "uppercase", marginBottom: 9 }}>Uploaded docs</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {["Deck", "DDQ", "PPM", "Track Record"].map((chip) => (
                  <Chip key={chip} tone="teal">{chip}</Chip>
                ))}
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, border: `1px solid ${C.borderSubtle}`, background: C.bg }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 750, textTransform: "uppercase", marginBottom: 8 }}>Review progress</div>
              {[
                ["Extract terms", "100%"],
                ["Parse track record", "100%"],
                ["Generate memo", "82%"],
              ].map(([label, width]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: C.textSoft, fontSize: 10.5, marginBottom: 4 }}>
                    <span>{label}</span>
                    <span>{width}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: C.borderSubtle, overflow: "hidden" }}>
                    <div style={{ width, height: "100%", background: C.green }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {["LP diligence memo", "Red flags", "Missing information", "Follow-up questions", "IC-ready summary"].map((item) => (
            <CheckRow key={item}>{item}</CheckRow>
          ))}
          <div style={{ marginTop: 14, padding: 12, borderRadius: 9, border: `1px solid ${C.amber}2e`, background: `${C.amber}10`, color: C.amber, fontSize: 12, fontWeight: 700 }}>
            2 reference items pending
          </div>
        </div>
      ),
    },
    {
      title: "Permissioned Workflow",
      status: "Workflow",
      footer: "Commitment tracking active",
      cursor: "72,62",
      body: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ padding: 12, borderRadius: 9, border: `1px solid ${C.borderSubtle}`, background: C.bg }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 750, textTransform: "uppercase" }}>Reveal</div>
              <div style={{ color: C.text, fontSize: 12.5, fontWeight: 700, marginTop: 5 }}>LP approved disclosure</div>
            </div>
            <div style={{ padding: 12, borderRadius: 9, border: `1px solid ${C.borderSubtle}`, background: C.bg }}>
              <div style={{ color: C.textMuted, fontSize: 10, fontWeight: 750, textTransform: "uppercase" }}>Data room</div>
              <div style={{ color: C.text, fontSize: 12.5, fontWeight: 700, marginTop: 5 }}>GP granted access</div>
            </div>
          </div>
          {[
            ["Matched", "complete"],
            ["Reveal approved", "complete"],
            ["Intro sent", "complete"],
            ["In diligence", "current"],
            ["Soft circle", "future"],
            ["Commitment", "future"],
          ].map(([stage, state]) => (
            <div key={stage} style={{ display: "grid", gridTemplateColumns: "18px minmax(0,1fr) 88px", gap: 9, alignItems: "center", padding: "8px 0", borderTop: `1px solid ${C.borderSubtle}` }}>
              <span style={{ width: 11, height: 11, borderRadius: 999, background: state === "complete" ? C.teal : state === "current" ? C.purple : C.textMuted, boxShadow: state === "current" ? `0 0 16px ${C.purple}70` : "none" }} />
              <span style={{ color: state === "future" ? C.textMuted : C.text, fontSize: 12, fontWeight: state === "current" ? 760 : 620 }}>{stage}</span>
              <span style={{ color: C.textMuted, fontSize: 10.5, textAlign: "right" }}>
                {state === "current" ? "Active" : state === "complete" ? "Done" : "Queued"}
              </span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14 }}>
            {["IC memo drafted", "Soft circle: $500K", "DD in progress"].map((item) => (
              <div key={item} style={{ padding: "9px 8px", borderRadius: 8, background: C.bg, border: `1px solid ${C.borderSubtle}`, color: C.textSoft, fontSize: 10.8, fontWeight: 650 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Capital Formation Pipeline",
      status: "Workflow",
      footer: "Commitment tracking active",
      cursor: "73,60",
      body: (
        <div>
          {[
            ["Matched", "complete"],
            ["Reveal Approved", "complete"],
            ["Intro Sent", "complete"],
            ["In Diligence", "current"],
            ["Soft Circle", "future"],
            ["Commitment", "future"],
          ].map(([stage, state], i) => {
            const color = state === "complete" ? C.teal : state === "current" ? C.purple : C.textMuted;
            return (
              <div key={stage} style={{ display: "grid", gridTemplateColumns: "16px minmax(0,1fr)", gap: 8, alignItems: "center", padding: "5px 0" }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: color, boxShadow: state === "current" ? `0 0 16px ${C.purple}70` : "none" }} />
                <span style={{ color: state === "future" ? C.textMuted : C.text, fontSize: 11.5, fontWeight: state === "current" ? 760 : 620 }}>
                  {stage}
                </span>
                {i < 5 && <span style={{ gridColumn: "1 / 2", width: 1, height: 10, background: C.borderSubtle, justifySelf: "center" }} />}
              </div>
            );
          })}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 10 }}>
            {["DD in progress", "IC memo drafted", "Soft circle: $500K", "Intro sent"].map((item) => (
              <div key={item} style={{ padding: "7px 8px", borderRadius: 7, background: C.bg, border: `1px solid ${C.borderSubtle}`, color: C.textSoft, fontSize: 10.6, fontWeight: 650 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="about"
      className="section-glow-top"
      style={{
        padding: "46px 0 58px",
        background: C.black,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Wrap style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ maxWidth: 760, marginBottom: 30 }}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 760,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.accentBright,
                marginBottom: 12,
              }}
            >
              Product workflow
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,3.2vw,44px)",
                fontWeight: 820,
                lineHeight: 1.04,
                letterSpacing: -1.2,
                marginBottom: 12,
              }}
            >
              How MandateOS works
            </h2>
            <p style={{ color: C.textSoft, fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
              One workflow from LP mandate definition to diligence-ready capital conversations.
            </p>
          </div>
        </Reveal>
        <div
          className="mandate-how-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px,.62fr) minmax(0,1.38fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <Reveal>
            <div style={{ display: "grid", gap: 8 }}>
              {workflowSteps.map((step, index) => {
                const active = index === activeStepIndex;
                return (
                  <button
                    key={step.n}
                    type="button"
                    onClick={() => setActiveCard(step.cards[0])}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "17px 16px",
                      borderRadius: 10,
                      border: `1px solid ${active ? "rgba(124,111,247,.42)" : C.borderSubtle}`,
                      background: active ? "rgba(124,111,247,.10)" : "rgba(255,255,255,.018)",
                      color: C.text,
                      cursor: "pointer",
                      transition: "background .22s ease, border-color .22s ease, opacity .22s ease",
                      opacity: active ? 1 : 0.58,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Mono size={12} weight={800} color={active ? C.accentBright : C.textMuted}>
                        {step.n}
                      </Mono>
                      <span style={{ fontSize: 14, fontWeight: 760 }}>{step.title}</span>
                    </div>
                  </button>
                );
              })}
              <div style={{ display: "flex", gap: 6, padding: "10px 4px 0" }}>
                {workflowSteps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show workflow step ${index + 1}`}
                    onClick={() => setActiveCard(index)}
                    style={{
                      width: activeCard === index ? 22 : 7,
                      height: 7,
                      borderRadius: 999,
                      border: "none",
                      background: activeCard === index ? C.accentBright : C.borderHover,
                      cursor: "pointer",
                      transition: "width .2s ease, background .2s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="mandate-how-single"
              style={{
                display: "block",
                width: "100%",
              }}
            >
              <LaptopCard
                key={cards[activeCard].title}
                index={activeCard}
                title={cards[activeCard].title}
                status={cards[activeCard].status}
                footer={cards[activeCard].footer}
                cursor={cards[activeCard].cursor}
              >
                {cards[activeCard].body}
              </LaptopCard>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

export function HowMandateOSWorksDetailed() {
  const workflowSteps = [
    {
      n: "01",
      title: "LP defines mandate",
      detail:
        "Hamilton Family Office defines its 2026 allocation mandate before reviewing managers. The mandate captures pacing, check size, exclusions, diligence requirements, and scoring weights.",
    },
    {
      n: "02",
      title: "GP submits fund profile",
      detail:
        "Northline Capital III submits one reusable diligence packet against the LP mandate. Fund terms, uploaded materials, readiness, and missing IC items are structured before anyone trades emails.",
    },
    {
      n: "03",
      title: "Mandate fit scored",
      detail:
        "MandateOS scores the GP against the LP's actual allocation rules. The screen shows why the fund surfaced, what still blocks review, and the next best action.",
    },
    {
      n: "04",
      title: "Diligence review generated",
      detail:
        "DiligenceOS turns fund materials into an LP-style review packet. It extracts terms, flags missing information, drafts follow-up questions, and prepares an IC-ready summary.",
    },
    {
      n: "05",
      title: "Access approved",
      detail:
        "Both sides control what is visible before an introduction. Reveal status, data-room access, sensitive files, and approval history are tracked inside the workflow.",
    },
    {
      n: "06",
      title: "Capital progress tracked",
      detail:
        "The relationship keeps moving after the first match. MandateOS tracks diligence tasks, meetings, soft circle movement, IC prep, and commitment probability in one place.",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % workflowSteps.length);
    }, 6800);
    return () => clearInterval(timer);
  }, [paused, workflowSteps.length]);

  const Pill = ({ children, tone = "neutral" }) => {
    const toneColor =
      tone === "green"
        ? C.green
        : tone === "amber"
        ? C.amber
        : tone === "teal"
        ? C.teal
        : tone === "purple"
        ? C.purple
        : C.textMuted;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 22,
          padding: "4px 7px",
          borderRadius: 6,
          border: `1px solid ${toneColor}2e`,
          background: `${toneColor}12`,
          color: tone === "neutral" ? C.textSoft : toneColor,
          fontSize: 10.5,
          fontWeight: 680,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  };

  const Stat = ({ label, value, tone = "neutral" }) => (
    <div
      style={{
        minHeight: 72,
        padding: "12px 12px 10px",
        borderRadius: 9,
        border: `1px solid ${C.borderSubtle}`,
        background: "rgba(255,255,255,.025)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          color: C.textMuted,
          fontSize: 10,
          fontWeight: 760,
          textTransform: "uppercase",
          letterSpacing: ".08em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: tone === "green" ? C.green : tone === "purple" ? C.accentBright : C.text,
          fontSize: 19,
          fontWeight: 820,
          lineHeight: 1.05,
          letterSpacing: "-.01em",
        }}
      >
        {value}
      </div>
    </div>
  );

  const Section = ({ title, children, compact = false }) => (
    <div
      style={{
        borderRadius: 9,
        border: `1px solid ${C.borderSubtle}`,
        background: "rgba(255,255,255,.02)",
        padding: compact ? 10 : 12,
        minHeight: 0,
      }}
    >
      <div
        style={{
          color: C.text,
          fontSize: 12.5,
          fontWeight: 760,
          marginBottom: 9,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  const DataRow = ({ label, value, tone = "neutral" }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 12,
        alignItems: "center",
        padding: "7px 0",
        borderTop: `1px solid ${C.borderSubtle}`,
        lineHeight: 1.25,
      }}
    >
      <span style={{ color: C.textSoft, fontSize: 11.5, fontWeight: 560 }}>{label}</span>
      <span
        style={{
          color: tone === "green" ? C.green : tone === "amber" ? C.amber : tone === "purple" ? C.accentBright : C.text,
          fontSize: 11.5,
          fontWeight: 760,
          textAlign: "right",
          maxWidth: 210,
        }}
      >
        {value}
      </span>
    </div>
  );

  const StatusRow = ({ label, detail, tone = "green" }) => {
    const color = tone === "amber" ? C.amber : tone === "purple" ? C.accentBright : tone === "teal" ? C.teal : C.green;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "18px minmax(0, 1fr)",
          gap: 8,
          alignItems: "start",
          padding: "7px 0",
          borderTop: `1px solid ${C.borderSubtle}`,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            border: `1px solid ${color}55`,
            background: `${color}14`,
            color,
            display: "grid",
            placeItems: "center",
            fontSize: 8,
            fontWeight: 900,
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          {tone === "amber" ? "!" : "OK"}
        </span>
        <span>
          <span style={{ display: "block", color: C.text, fontSize: 11.8, fontWeight: 720, lineHeight: 1.2 }}>
            {label}
          </span>
          {detail && (
            <span style={{ display: "block", color: C.textMuted, fontSize: 10.8, marginTop: 2, lineHeight: 1.25 }}>
              {detail}
            </span>
          )}
        </span>
      </div>
    );
  };

  const ActivityRow = ({ label, meta, tone = "neutral" }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        gap: 10,
        alignItems: "center",
        padding: "6px 0",
        borderTop: `1px solid ${C.borderSubtle}`,
      }}
    >
      <span style={{ color: C.textSoft, fontSize: 11.4, fontWeight: 570, lineHeight: 1.25 }}>{label}</span>
      <span
        style={{
          color: tone === "green" ? C.green : tone === "amber" ? C.amber : C.textMuted,
          fontSize: 10.6,
          fontWeight: 720,
          whiteSpace: "nowrap",
        }}
      >
        {meta}
      </span>
    </div>
  );

  const ProgressRow = ({ label, value, tone = "green" }) => {
    const color = tone === "purple" ? C.accentBright : tone === "amber" ? C.amber : C.green;
    const width = value === "Complete" ? 100 : value === "In review" ? 76 : value === "Pending" ? 28 : 54;
    return (
      <div style={{ padding: "7px 0", borderTop: `1px solid ${C.borderSubtle}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
          <span style={{ color: C.textSoft, fontSize: 11.4, fontWeight: 620 }}>{label}</span>
          <span style={{ color, fontSize: 10.8, fontWeight: 760 }}>{value}</span>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: C.borderSubtle, overflow: "hidden" }}>
          <div style={{ width: `${width}%`, height: "100%", background: color }} />
        </div>
      </div>
    );
  };

  const screens = [
    {
      step: "01 - LP defines mandate",
      title: "LP Mandate Builder",
      status: "LP View",
      object: "Hamilton Family Office",
      subtext: "2026 Private Equity Allocation - Growth / Buyout - North America & Europe",
      cursor: [73, 74],
      stats: [
        ["Allocation target", "$25M", "green"],
        ["Commitments planned", "4-6", "neutral"],
        ["Check size", "$2M-$7M", "purple"],
        ["Vintage focus", "2026", "neutral"],
      ],
      left: (
        <>
          <Section title="Criteria">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Growth Equity", "Buyout", "Software", "Healthcare IT", "Business Services", "North America", "Europe", "Fund II-IV"].map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </Section>
          <Section title="Exclusions" compact>
            {["Crypto", "Tobacco", "Weapons", "Distressed"].map((item) => (
              <StatusRow key={item} label={item} detail="Blocked from mandate fit" tone="amber" />
            ))}
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Required diligence materials">
            {["Deck required", "DDQ required", "Track record required", "References required", "Legal docs before IC"].map((item) => (
              <StatusRow key={item} label={item} tone="green" />
            ))}
          </Section>
          <Section title="Mandate weighting">
            {[
              ["Strategy fit", "30%"],
              ["Fund size", "20%"],
              ["Check size", "15%"],
              ["Geography", "15%"],
              ["Sector fit", "10%"],
              ["Materials readiness", "10%"],
            ].map(([label, value]) => (
              <DataRow key={label} label={label} value={value} />
            ))}
          </Section>
        </>
      ),
      actions: ["Publish mandate", "Review 3 funds above 85% fit", "Send requirement template to incoming GPs"],
      activity: [
        ["Mandate criteria saved", "Just now", "green"],
        ["Exclusions locked", "2m ago", "neutral"],
        ["12 matching funds found", "Live", "green"],
      ],
      bottom: "Mandate published - 12 matching funds found - 3 above 85% fit",
    },
    {
      step: "02 - GP submits fund profile",
      title: "GP Fund Profile",
      status: "GP View",
      object: "Northline Capital III",
      subtext: "Growth Equity - $300M target raise - Fund III - North America / Europe",
      cursor: [68, 67],
      stats: [
        ["Target raise", "$300M", "green"],
        ["Target check", "$5M-$15M", "purple"],
        ["Strategy", "Growth Equity", "neutral"],
        ["Target close", "Q3 2026", "neutral"],
      ],
      left: (
        <>
          <Section title="Fund profile fields">
            <DataRow label="Sector focus" value="B2B software" />
            <DataRow label="Healthcare IT" value="Included" tone="green" />
            <DataRow label="Business services" value="Included" tone="green" />
            <DataRow label="Target companies" value="$10M-$75M revenue" />
            <DataRow label="Ownership profile" value="Founder-owned" />
          </Section>
          <Section title="Fund terms">
            <DataRow label="Management fee" value="2.0%" />
            <DataRow label="Carry" value="20%" />
            <DataRow label="GP commit" value="$8M" tone="green" />
            <DataRow label="Fund life" value="10 years + extensions" />
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Uploaded materials">
            {["Fund deck.pdf", "DDQ.docx", "Track record.xlsx", "Team bios.pdf", "Reference list.pdf"].map((item) => (
              <StatusRow key={item} label={item} detail="Uploaded and parsed" tone="green" />
            ))}
            {["Final LPA", "Audited financials", "Final PPM"].map((item) => (
              <StatusRow key={item} label={item} detail="Pending before IC-ready" tone="amber" />
            ))}
          </Section>
          <Section title="Diligence readiness">
            <DataRow label="Readiness meter" value="82%" tone="green" />
            <StatusRow label="Final legal documents" detail="Needed before IC review" tone="amber" />
            <StatusRow label="Two references" detail="Requested by allocator" tone="amber" />
            <StatusRow label="Realized attribution detail" detail="Needed for Fund II exits" tone="amber" />
          </Section>
        </>
      ),
      actions: ["Complete final legal uploads", "Add two reference contacts", "Attach attribution detail for realized exits"],
      activity: [
        ["Track record uploaded", "4m ago", "green"],
        ["DDQ parsed", "6m ago", "green"],
        ["References pending", "Open", "amber"],
      ],
      bottom: "Reusable diligence packet created - Track record uploaded - DDQ parsed - References pending",
    },
    {
      step: "03 - Mandate fit scored",
      title: "Mandate Fit Analysis",
      status: "Scoring",
      object: "Northline Capital III -> Hamilton Family Office",
      subtext: "Matched against 2026 private equity allocation",
      cursor: [78, 50],
      stats: [
        ["Mandate fit", "92%", "green"],
        ["Review state", "Qualified", "purple"],
        ["Open items", "3", "amber"],
        ["Next action", "Diligence", "neutral"],
      ],
      left: (
        <>
          <Section title="Fit breakdown">
            <DataRow label="Strategy fit" value="98% - Growth equity match" tone="green" />
            <DataRow label="Check size fit" value="95% - inside pacing" tone="green" />
            <DataRow label="Geography fit" value="92% - NA / Europe" tone="green" />
            <DataRow label="Fund size fit" value="90% - preferred range" tone="green" />
            <DataRow label="Sector fit" value="88% - software + HIT" tone="green" />
            <DataRow label="Materials readiness" value="82% - legal pending" tone="amber" />
          </Section>
          <Section title="Open items">
            <StatusRow label="References pending" detail="Two calls required before IC" tone="amber" />
            <StatusRow label="Final LPA not uploaded" detail="Legal review cannot start" tone="amber" />
            <StatusRow label="Attribution detail needed" detail="Fund II realized exits" tone="amber" />
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Why surfaced">
            {[
              "Fund size sits inside the LP's preferred range.",
              "Strategy matches the 2026 private equity allocation.",
              "Target check size fits the LP's pacing model.",
              "Sector focus overlaps with the LP's mandate.",
              "Required diligence materials are mostly complete.",
            ].map((item) => (
              <StatusRow key={item} label={item} tone="green" />
            ))}
          </Section>
          <Section title="Recommended action">
            <DataRow label="Primary action" value="Request references" tone="purple" />
            <DataRow label="Secondary action" value="Move to diligence review" tone="green" />
            <DataRow label="Fallback" value="Pass if refs not supplied" tone="amber" />
          </Section>
        </>
      ),
      actions: ["Move to diligence", "Request more info", "Pass if references are not supplied"],
      activity: [
        ["Fit score calculated from mandate weights", "Now", "green"],
        ["LP exclusions cleared", "Now", "green"],
        ["Materials readiness below IC threshold", "Open", "amber"],
      ],
      bottom: "Qualified for LP review",
    },
    {
      step: "04 - Diligence review generated",
      title: "Diligence Review",
      status: "DiligenceOS",
      object: "Northline Capital III Diligence Packet",
      subtext: "Generated from deck, DDQ, track record, and reference list",
      cursor: [73, 77],
      stats: [
        ["Docs parsed", "5", "green"],
        ["Red flags", "3", "amber"],
        ["Follow-ups", "4", "purple"],
        ["Pending items", "2", "amber"],
      ],
      left: (
        <>
          <Section title="Review progress">
            <ProgressRow label="Extract fund terms" value="Complete" />
            <ProgressRow label="Parse track record" value="Complete" />
            <ProgressRow label="Identify missing items" value="Complete" />
            <ProgressRow label="Generate LP memo" value="In review" tone="purple" />
            <ProgressRow label="Prepare follow-up questions" value="Complete" />
          </Section>
          <Section title="Generated outputs">
            {["LP diligence memo", "Strategy overview", "Team background", "Track record summary", "Portfolio construction", "Key risks", "Follow-up questions"].map((item) => (
              <StatusRow key={item} label={item} tone="green" />
            ))}
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Red flags">
            <StatusRow label="Limited realized attribution detail" tone="amber" />
            <StatusRow label="References not completed" tone="amber" />
            <StatusRow label="Final legal docs pending" tone="amber" />
          </Section>
          <Section title="Missing information">
            {["Final LPA", "Audited financials", "Gross/net bridge by deal", "Loss ratio by vintage", "LP reference calls"].map((item) => (
              <StatusRow key={item} label={item} tone="amber" />
            ))}
          </Section>
          <Section title="Memo preview" compact>
            <p style={{ margin: 0, color: C.textSoft, fontSize: 11.4, lineHeight: 1.45 }}>
              Northline Capital III appears aligned with the LP's 2026 growth equity mandate based on strategy,
              fund size, check size, and geography. Remaining diligence items include references, legal
              documents, and attribution detail on realized investments.
            </p>
          </Section>
        </>
      ),
      actions: ["Send follow-up questions", "Assign reference calls", "Hold IC until legal docs arrive"],
      activity: [
        ["Memo draft generated", "1m ago", "green"],
        ["4 follow-up questions recommended", "Open", "purple"],
        ["2 diligence items pending", "Open", "amber"],
      ],
      bottom: "IC-ready summary generated - 4 follow-up questions recommended - 2 diligence items pending",
    },
    {
      step: "05 - Access approved",
      title: "Access & Disclosure",
      status: "Privacy",
      object: "Hamilton Family Office <-> Northline Capital III",
      subtext: "Controlled reveal before introduction",
      cursor: [72, 60],
      stats: [
        ["LP status", "Interested", "green"],
        ["GP status", "Approved", "purple"],
        ["Data room", "Granted", "green"],
        ["Intro status", "Ready", "neutral"],
      ],
      left: (
        <>
          <Section title="Visible to LP">
            {["Fund overview", "Strategy", "Target raise", "Team bios", "Track record summary"].map((item) => (
              <StatusRow key={item} label={item} tone="green" />
            ))}
          </Section>
          <Section title="Requires approval">
            {["Full track record", "LP references", "Legal documents", "Full data room"].map((item) => (
              <StatusRow key={item} label={item} tone="amber" />
            ))}
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Hidden until intro">
            {["Partner emails", "Full LP list", "Sensitive portfolio company detail"].map((item) => (
              <StatusRow key={item} label={item} tone="amber" />
            ))}
          </Section>
          <Section title="Approval timeline">
            <StatusRow label="LP requested access" detail="Submitted inside workflow" tone="green" />
            <StatusRow label="GP approved disclosure" detail="Disclosure logged" tone="green" />
            <StatusRow label="Data room opened" detail="Controlled access granted" tone="green" />
            <StatusRow label="Intro approved" detail="Ready for send" tone="purple" />
            <StatusRow label="Diligence started" detail="Awaiting next meeting" tone="green" />
          </Section>
        </>
      ),
      actions: ["Approve reveal", "Grant data room access", "Send intro", "Hold for review"],
      activity: [
        ["LP requested access", "8m ago", "green"],
        ["GP approved disclosure", "3m ago", "green"],
        ["Intro ready", "Now", "purple"],
      ],
      bottom: "Disclosure approved - Intro ready",
    },
    {
      step: "06 - Capital progress tracked",
      title: "Capital Progress",
      status: "Workflow",
      object: "Northline Capital III - Hamilton Family Office",
      subtext: "Relationship moved from match to active diligence",
      cursor: [72, 63],
      stats: [
        ["Current stage", "In DD", "purple"],
        ["Expected check", "$500K-$1.5M", "green"],
        ["Soft circle", "$500K", "green"],
        ["Close probability", "Med-high", "neutral"],
      ],
      left: (
        <>
          <Section title="Pipeline">
            {[
              ["Matched", "complete"],
              ["Reviewed", "complete"],
              ["In Diligence", "current"],
              ["IC Review", "future"],
              ["Soft Circle", "future"],
              ["Commitment", "future"],
            ].map(([stage, state]) => {
              const tone = state === "complete" ? "green" : state === "current" ? "purple" : "neutral";
              return (
                <DataRow
                  key={stage}
                  label={stage}
                  value={state === "complete" ? "Done" : state === "current" ? "Active" : "Queued"}
                  tone={tone === "neutral" ? "neutral" : tone}
                />
              );
            })}
          </Section>
          <Section title="Relationship details">
            <DataRow label="Next meeting" value="Partner diligence call" tone="purple" />
            <DataRow label="Meeting date" value="May 17" />
            <DataRow label="Expected check" value="$500K-$1.5M" tone="green" />
            <DataRow label="Soft circle" value="$500K" tone="green" />
          </Section>
        </>
      ),
      right: (
        <>
          <Section title="Task list">
            <StatusRow label="Send updated track record" detail="Owner: GP team" tone="amber" />
            <StatusRow label="Schedule reference calls" detail="Owner: LP analyst" tone="amber" />
            <StatusRow label="Upload final LPA" detail="Owner: counsel" tone="amber" />
            <StatusRow label="Prepare IC memo" detail="Owner: allocator" tone="purple" />
            <StatusRow label="Confirm target check size" detail="Owner: Hamilton FO" tone="green" />
          </Section>
          <Section title="Activity feed">
            <ActivityRow label="LP opened track record" meta="12m ago" />
            <ActivityRow label="GP granted data room access" meta="28m ago" />
            <ActivityRow label="Diligence memo generated" meta="1h ago" />
            <ActivityRow label="Follow-up questions sent" meta="2h ago" />
            <ActivityRow label="Soft circle added" meta="$500K" tone="green" />
          </Section>
        </>
      ),
      actions: ["Send updated track record", "Schedule reference calls", "Prepare IC memo", "Confirm target check size"],
      activity: [
        ["LP opened track record", "12m ago", "neutral"],
        ["Diligence memo generated", "1h ago", "green"],
        ["Soft circle added", "$500K", "green"],
      ],
      bottom: "Commitment tracking active",
    },
  ];

  const screen = screens[activeStep];

  const WorkflowPanel = ({ data }) => {
    const [cursorX, cursorY] = data.cursor;
    return (
      <div
        className="mandate-how-panel"
        key={data.title}
        style={{
          position: "relative",
          width: "100%",
          height: 760,
          borderRadius: 13,
          border: `1px solid rgba(124,111,247,.38)`,
          background: "linear-gradient(180deg, rgba(16,15,38,.98), rgba(8,8,23,.99))",
          boxShadow:
            "0 28px 70px rgba(0,0,0,.42), 0 0 0 1px rgba(124,111,247,.09), 0 0 42px rgba(124,111,247,.10)",
          overflow: "hidden",
          animation: "fadeIn .22s ease both",
        }}
      >
        <div
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 14px",
            borderBottom: `1px solid ${C.borderSubtle}`,
            background: "rgba(255,255,255,.028)",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {["#f87171", "#fbbf24", "#34d399"].map((color) => (
              <span key={color} style={{ width: 8, height: 8, borderRadius: 999, background: color, opacity: 0.86 }} />
            ))}
          </div>
          <span style={{ color: C.textMuted, fontSize: 10.5, fontWeight: 700 }}>
            mandateos.app/transaction-workflow
          </span>
        </div>

        <div
          style={{
            padding: 18,
            height: "calc(100% - 36px)",
            boxSizing: "border-box",
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto",
              gap: 16,
              alignItems: "start",
              marginBottom: 15,
            }}
          >
            <div>
              <div
                style={{
                  color: C.accentBright,
                  fontSize: 11,
                  fontWeight: 780,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginBottom: 7,
                }}
              >
                {data.step}
              </div>
              <h3
                style={{
                  color: C.text,
                  fontSize: 21,
                  fontWeight: 820,
                  letterSpacing: "-.02em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {data.title}
              </h3>
              <div style={{ color: C.textSoft, fontSize: 13.2, fontWeight: 660, marginTop: 9 }}>
                {data.object}
              </div>
              <div style={{ color: C.textMuted, fontSize: 11.8, marginTop: 3, lineHeight: 1.35 }}>
                {data.subtext}
              </div>
            </div>
            <Pill tone="purple">{data.status}</Pill>
          </div>

          <div
            className="mandate-how-panel-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {data.stats.map(([label, value, tone]) => (
              <Stat key={label} label={label} value={value} tone={tone} />
            ))}
          </div>

          <div
            className="mandate-how-panel-body"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gap: 12,
              alignItems: "stretch",
              marginBottom: 13,
            }}
          >
            <div style={{ display: "grid", gap: 10 }}>{data.left}</div>
            <div style={{ display: "grid", gap: 10 }}>{data.right}</div>
          </div>

          <div
            className="mandate-how-panel-actions"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Section title="Next actions" compact>
              {data.actions.map((item) => (
                <StatusRow key={item} label={item} tone={item.toLowerCase().includes("hold") || item.toLowerCase().includes("pending") ? "amber" : "purple"} />
              ))}
            </Section>
            <Section title="Activity / comments" compact>
              {data.activity.map(([label, meta, tone]) => (
                <ActivityRow key={`${label}-${meta}`} label={label} meta={meta} tone={tone} />
              ))}
            </Section>
          </div>

          <div
            style={{
              borderTop: `1px solid ${C.borderSubtle}`,
              paddingTop: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            <span style={{ color: C.green, fontSize: 12, fontWeight: 780 }}>{data.bottom}</span>
            <span style={{ color: C.textMuted, fontSize: 10.8, fontWeight: 650 }}>Updated live</span>
          </div>
        </div>

        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            width: 18,
            height: 24,
            background: "#fff",
            clipPath: "polygon(0 0, 0 100%, 6px 76%, 11px 97%, 15px 96%, 10px 73%, 18px 73%)",
            filter: "drop-shadow(0 5px 10px rgba(0,0,0,.42))",
            opacity: 0.92,
            transform: "translate3d(0,0,0)",
            transition: "left .45s cubic-bezier(.22,1,.36,1), top .45s cubic-bezier(.22,1,.36,1)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  };

  return (
    <section
      id="about"
      className="section-glow-top"
      style={{
        padding: "48px 0 62px",
        background: C.black,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Wrap style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ maxWidth: 760, marginBottom: 30 }}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 760,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.accentBright,
                marginBottom: 12,
              }}
            >
              Product workflow
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,3.2vw,44px)",
                fontWeight: 820,
                lineHeight: 1.04,
                letterSpacing: -1.2,
                marginBottom: 12,
              }}
            >
              How MandateOS works
            </h2>
            <p style={{ color: C.textSoft, fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
              One workflow from LP mandate definition to diligence-ready capital conversations.
            </p>
          </div>
        </Reveal>

        <div
          className="mandate-how-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px,.55fr) minmax(0,1.45fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <Reveal>
            <div style={{ display: "grid", gap: 8 }}>
              {workflowSteps.map((step, index) => {
                const active = index === activeStep;
                return (
                  <button
                    key={step.n}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: active ? "17px 16px 18px" : "15px 16px",
                      borderRadius: 10,
                      border: `1px solid ${active ? "rgba(124,111,247,.45)" : C.borderSubtle}`,
                      background: active ? "rgba(124,111,247,.105)" : "rgba(255,255,255,.018)",
                      color: C.text,
                      cursor: "pointer",
                      transition: "background .22s ease, border-color .22s ease, opacity .22s ease, padding .22s ease",
                      opacity: active ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr) 18px", gap: 10, alignItems: "center" }}>
                      <Mono size={12} weight={850} color={active ? C.accentBright : C.textMuted}>
                        {step.n}
                      </Mono>
                      <span style={{ fontSize: 14, fontWeight: 760 }}>{step.title}</span>
                      <span style={{ color: active ? C.accentBright : C.textMuted, fontSize: 16, fontWeight: 600, textAlign: "right" }}>
                        {active ? "-" : "+"}
                      </span>
                    </div>
                    {active && (
                      <p
                        style={{
                          margin: "11px 0 0 42px",
                          color: C.textSoft,
                          fontSize: 12.3,
                          lineHeight: 1.55,
                        }}
                      >
                        {step.detail}
                      </p>
                    )}
                  </button>
                );
              })}
              <div style={{ display: "flex", gap: 6, padding: "10px 4px 0" }}>
                {workflowSteps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show workflow step ${index + 1}`}
                    onClick={() => setActiveStep(index)}
                    style={{
                      width: activeStep === index ? 24 : 7,
                      height: 7,
                      borderRadius: 999,
                      border: "none",
                      background: activeStep === index ? C.accentBright : C.borderHover,
                      cursor: "pointer",
                      transition: "width .2s ease, background .2s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mandate-how-single" style={{ width: "100%" }}>
              <WorkflowPanel data={screen} />
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

export function HowMandateOSWorksFocused() {
  const steps = [
    {
      n: "01",
      title: "LP defines mandate",
      detail:
        "The LP sets pacing, check size, exclusions, and evidence requirements. MandateOS turns that into a working filter before any GP reaches review.",
    },
    {
      n: "02",
      title: "GP submits profile",
      detail:
        "The GP creates one structured packet with terms, materials, track record, and references. Missing items are visible before the packet is sent forward.",
    },
    {
      n: "03",
      title: "Fit is scored",
      detail:
        "The system explains why the fund qualifies against the mandate. Fit drivers, blockers, and next actions sit in the same review surface.",
    },
    {
      n: "04",
      title: "Diligence is drafted",
      detail:
        "DiligenceOS extracts fund terms, risks, missing information, and follow-up questions. The LP gets a memo-ready review instead of a pile of files.",
    },
    {
      n: "05",
      title: "Access is approved",
      detail:
        "Reveal, data-room access, references, and legal documents stay permissioned. Both sides can see what is visible, held, or newly approved.",
    },
    {
      n: "06",
      title: "Capital is tracked",
      detail:
        "The relationship moves through diligence, IC prep, soft circle, and commitment. Tasks, activity, and next actions stay tied to the same transaction.",
    },
  ];

  const screens = [
    {
      title: "LP Mandate Builder",
      badge: "LP View",
      object: "Hamilton Family Office",
      context: "2026 PE allocation - Growth / Buyout - North America & Europe",
      metrics: [
        ["Allocation", "$25M"],
        ["Check size", "$2M-$7M"],
        ["Matches", "12"],
      ],
      rows: [
        ["Criteria", "Growth, buyout, software, healthcare IT", "Set"],
        ["Materials", "Deck, DDQ, track record, references", "Required"],
        ["Exclusions", "Crypto, tobacco, weapons", "Locked"],
        ["Weighting", "Strategy 30%, fund size 20%, check 15%", "Active"],
        ["Next", "Review 3 funds above 85% fit", "Now"],
      ],
      activity: [
        ["Mandate published", "Just now"],
        ["12 matching funds found", "Live"],
        ["3 funds above threshold", "92 / 88 / 86"],
      ],
      bottom: "Mandate published. Incoming GP packets now route against the allocation rules.",
    },
    {
      title: "GP Fund Profile",
      badge: "GP View",
      object: "Northline Capital III",
      context: "Growth Equity - $300M target - Fund III - North America / Europe",
      metrics: [
        ["Target", "$300M"],
        ["Readiness", "82%"],
        ["Missing", "3"],
      ],
      rows: [
        ["Fund terms", "2.0% fee, 20% carry, $8M GP commit", "Filed"],
        ["Materials", "Deck, DDQ, track record, team bios", "Parsed"],
        ["Pending", "Final LPA, audited financials, final PPM", "Open"],
        ["References", "Two allocator-ready contacts needed", "Open"],
        ["Next", "Attach realized-exit attribution detail", "Owner"],
      ],
      activity: [
        ["Track record uploaded", "4m ago"],
        ["DDQ parsed", "6m ago"],
        ["References still pending", "Open"],
      ],
      bottom: "Reusable diligence packet created. Legal and reference items remain before IC-ready.",
    },
    {
      title: "Mandate Fit Analysis",
      badge: "Scoring",
      object: "Northline Capital III -> Hamilton Family Office",
      context: "Matched against the 2026 private equity allocation",
      metrics: [
        ["Fit", "92%"],
        ["State", "Qualified"],
        ["Open", "3"],
      ],
      rows: [
        ["Strategy", "Growth equity matches target allocation", "98%"],
        ["Check size", "$5M target inside $2M-$7M preference", "95%"],
        ["Geography", "North America and Europe aligned", "92%"],
        ["Materials", "DDQ and track record uploaded; legal pending", "82%"],
        ["Next", "Request references and move to diligence", "Action"],
      ],
      activity: [
        ["LP exclusions cleared", "Now"],
        ["Fit score recalculated", "Now"],
        ["Legal docs still below IC threshold", "Open"],
      ],
      bottom: "Qualified for LP review. The next move is diligence, not another generic intro.",
    },
    {
      title: "Diligence Review",
      badge: "DiligenceOS",
      object: "Northline Capital III diligence packet",
      context: "Generated from deck, DDQ, track record, PPM draft, and references",
      metrics: [
        ["Docs parsed", "5"],
        ["Flags", "3"],
        ["Follow-ups", "4"],
      ],
      rows: [
        ["Terms", "Fee, carry, GP commit, term extracted", "Done"],
        ["Track record", "Gross/net bridge still incomplete", "Gap"],
        ["Risks", "Realized attribution and legal docs pending", "Flag"],
        ["Memo", "LP diligence memo generated for review", "Draft"],
        ["Next", "Send follow-up request before IC scheduling", "Action"],
      ],
      activity: [
        ["Memo draft generated", "1m ago"],
        ["4 follow-up questions added", "Open"],
        ["2 diligence items unresolved", "Open"],
      ],
      bottom: "IC-ready summary generated with red flags, gaps, and follow-up questions.",
    },
    {
      title: "Access & Disclosure",
      badge: "Privacy",
      object: "Hamilton Family Office <-> Northline Capital III",
      context: "Controlled reveal before introduction",
      metrics: [
        ["LP status", "Interested"],
        ["GP status", "Approved"],
        ["Intro", "Ready"],
      ],
      rows: [
        ["Visible", "Fund overview, strategy, target raise, team bios", "LP"],
        ["Approval", "Full track record and references require consent", "Held"],
        ["Hidden", "Partner emails, LP list, sensitive company detail", "Private"],
        ["Data room", "Controlled access granted after approval", "Open"],
        ["Next", "Send intro and preserve disclosure trail", "Action"],
      ],
      activity: [
        ["LP requested access", "8m ago"],
        ["GP approved disclosure", "3m ago"],
        ["Intro cleared", "Now"],
      ],
      bottom: "Disclosure approved. Intro is ready without exposing sensitive files by default.",
    },
    {
      title: "Capital Progress",
      badge: "Workflow",
      object: "Northline Capital III - Hamilton Family Office",
      context: "Relationship moved from match to active diligence",
      metrics: [
        ["Stage", "In DD"],
        ["Expected", "$500K-$1.5M"],
        ["Soft circle", "$500K"],
      ],
      rows: [
        ["Pipeline", "Matched -> Reviewed -> In Diligence", "Active"],
        ["Meeting", "Partner diligence call on May 17", "Set"],
        ["Tasks", "Track record, references, final LPA, IC memo", "Open"],
        ["Probability", "Medium-high after disclosure approval", "Live"],
        ["Next", "Prepare IC memo and confirm target check size", "Action"],
      ],
      activity: [
        ["LP opened track record", "12m ago"],
        ["Diligence memo generated", "1h ago"],
        ["Soft circle added", "$500K"],
      ],
      bottom: "Commitment tracking active. The relationship is now managed as a transaction.",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 5600);
    return () => clearInterval(timer);
  }, [paused, steps.length]);

  const active = screens[activeStep];

  const badgeColor = active.badge === "DiligenceOS" || active.badge === "Scoring" ? C.accentBright : C.green;

  return (
    <section
      id="about"
      className="section-glow-top"
      style={{
        padding: "48px 0 58px",
        background: C.black,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Wrap style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ maxWidth: 760, marginBottom: 26 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 780,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: C.accentBright,
                marginBottom: 12,
              }}
            >
              Product workflow
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,3vw,42px)",
                fontWeight: 820,
                lineHeight: 1.05,
                letterSpacing: -1.1,
                marginBottom: 10,
              }}
            >
              How MandateOS works
            </h2>
            <p style={{ color: C.textSoft, fontSize: 15, lineHeight: 1.55, maxWidth: 610 }}>
              One controlled workflow from LP mandate definition to diligence-ready capital conversations.
            </p>
          </div>
        </Reveal>

        <div
          className="mandate-how-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px,.34fr) minmax(0,1.66fr)",
            gap: 26,
            alignItems: "start",
          }}
        >
          <Reveal>
            <div style={{ display: "grid", gap: 7 }}>
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                return (
                  <button
                    key={step.n}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: isActive ? "15px 14px 16px" : "13px 14px",
                      borderRadius: 9,
                      border: `1px solid ${isActive ? "rgba(124,111,247,.42)" : C.borderSubtle}`,
                      background: isActive ? "rgba(124,111,247,.10)" : "rgba(255,255,255,.018)",
                      color: C.text,
                      cursor: "pointer",
                      opacity: isActive ? 1 : 0.58,
                      transition: "background .2s ease, border-color .2s ease, opacity .2s ease",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "30px minmax(0,1fr)", gap: 8, alignItems: "center" }}>
                      <Mono size={11.5} weight={850} color={isActive ? C.accentBright : C.textMuted}>
                        {step.n}
                      </Mono>
                      <span style={{ fontSize: 13.2, fontWeight: 760, lineHeight: 1.2 }}>{step.title}</span>
                    </div>
                    {isActive && (
                      <p
                        style={{
                          margin: "10px 0 0 38px",
                          color: C.textSoft,
                          fontSize: 11.6,
                          lineHeight: 1.48,
                        }}
                      >
                        {step.detail}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="mandate-how-focused-panel"
              style={{
                borderRadius: 12,
                border: `1px solid rgba(124,111,247,.34)`,
                background: "linear-gradient(180deg, rgba(16,15,38,.98), rgba(8,8,23,.99))",
                boxShadow: "0 24px 62px rgba(0,0,0,.42), 0 0 34px rgba(124,111,247,.09)",
                overflow: "hidden",
                height: 540,
              }}
            >
              <div
                style={{
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 14px",
                  borderBottom: `1px solid ${C.borderSubtle}`,
                  background: "rgba(255,255,255,.025)",
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  {["#f87171", "#fbbf24", "#34d399"].map((color) => (
                    <span key={color} style={{ width: 8, height: 8, borderRadius: 999, background: color, opacity: 0.82 }} />
                  ))}
                </div>
                <span style={{ color: C.textMuted, fontSize: 10.5, fontWeight: 700 }}>
                  mandateos.app/workflow
                </span>
              </div>

              <div style={{ padding: 17 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) auto",
                    gap: 14,
                    alignItems: "start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: C.accentBright,
                        fontSize: 10.5,
                        fontWeight: 780,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      {steps[activeStep].n} - {steps[activeStep].title}
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        color: C.text,
                        fontSize: 20,
                        fontWeight: 820,
                        letterSpacing: "-.02em",
                        lineHeight: 1.08,
                      }}
                    >
                      {active.title}
                    </h3>
                    <div style={{ color: C.textSoft, fontSize: 12.7, fontWeight: 680, marginTop: 8 }}>
                      {active.object}
                    </div>
                    <div style={{ color: C.textMuted, fontSize: 11.6, marginTop: 3 }}>
                      {active.context}
                    </div>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 8px",
                      borderRadius: 7,
                      border: `1px solid ${badgeColor}36`,
                      background: `${badgeColor}13`,
                      color: badgeColor,
                      fontSize: 10.5,
                      fontWeight: 760,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {active.badge}
                  </span>
                </div>

                <div
                  className="mandate-how-focused-stats"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                    gap: 9,
                    marginBottom: 13,
                  }}
                >
                  {active.metrics.map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        borderRadius: 8,
                        border: `1px solid ${C.borderSubtle}`,
                        background: "rgba(255,255,255,.024)",
                        padding: "10px 11px",
                        minHeight: 62,
                      }}
                    >
                      <div style={{ color: C.textMuted, fontSize: 9.8, fontWeight: 760, textTransform: "uppercase", letterSpacing: ".08em" }}>
                        {label}
                      </div>
                      <div style={{ color: C.text, fontSize: 18, fontWeight: 820, marginTop: 8, lineHeight: 1 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mandate-how-focused-body"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) 250px",
                    gap: 12,
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      borderRadius: 9,
                      border: `1px solid ${C.borderSubtle}`,
                      background: "rgba(255,255,255,.018)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "118px minmax(0,1fr) 86px",
                        gap: 12,
                        padding: "9px 12px",
                        borderBottom: `1px solid ${C.borderSubtle}`,
                        color: C.textMuted,
                        fontSize: 9.8,
                        fontWeight: 780,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                      }}
                    >
                      <span>Field</span>
                      <span>Current</span>
                      <span style={{ textAlign: "right" }}>State</span>
                    </div>
                    {active.rows.map(([field, current, state]) => (
                      <div
                        key={field}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "118px minmax(0,1fr) 86px",
                          gap: 12,
                          alignItems: "center",
                          padding: "10px 12px",
                          borderBottom: `1px solid ${C.borderSubtle}`,
                        }}
                      >
                        <span style={{ color: C.text, fontSize: 12, fontWeight: 730, lineHeight: 1.25 }}>
                          {field}
                        </span>
                        <span style={{ color: C.textSoft, fontSize: 11.5, lineHeight: 1.35 }}>
                          {current}
                        </span>
                        <span style={{ color: state === "Open" || state === "Gap" || state === "Flag" || state === "Held" ? C.amber : state === "Action" || state === "Now" ? C.accentBright : C.green, fontSize: 11, fontWeight: 780, textAlign: "right" }}>
                          {state}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        borderRadius: 9,
                        border: `1px solid ${C.borderSubtle}`,
                        background: "rgba(255,255,255,.018)",
                        padding: 12,
                      }}
                    >
                      <div style={{ color: C.text, fontSize: 12.4, fontWeight: 760, marginBottom: 9 }}>
                        Activity
                      </div>
                      {active.activity.map(([label, time]) => (
                        <div
                          key={`${label}-${time}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0,1fr) auto",
                            gap: 8,
                            padding: "7px 0",
                            borderTop: `1px solid ${C.borderSubtle}`,
                          }}
                        >
                          <span style={{ color: C.textSoft, fontSize: 11.3, lineHeight: 1.25 }}>{label}</span>
                          <span style={{ color: C.textMuted, fontSize: 10.5, fontWeight: 720, whiteSpace: "nowrap" }}>{time}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        borderRadius: 9,
                        border: `1px solid ${C.borderSubtle}`,
                        background: "rgba(255,255,255,.018)",
                        padding: 12,
                      }}
                    >
                      <div style={{ color: C.text, fontSize: 12.4, fontWeight: 760, marginBottom: 7 }}>
                        What just happened
                      </div>
                      <p style={{ margin: 0, color: C.textSoft, fontSize: 11.4, lineHeight: 1.45 }}>
                        {active.bottom}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRODUCT SNAPSHOT — "See MandateOS in Action"
   ════════════════════════════════════════════ */
export function ProductSnapshot() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const matches = [
    {
      name: "Ribbit Capital",
      score: 92,
      tag: "Multi-strategy · Global",
      c: HERO_FIT,
    },
    {
      name: "Pritzker Group",
      score: 89,
      tag: "Buyout · North America",
      c: HERO_FIT,
    },
    {
      name: "Hall Capital Partners",
      score: 87,
      tag: "Secondaries · Global",
      c: HERO_ACCENT,
    },
    {
      name: "Willett Advisors",
      score: 83,
      tag: "Buyout · North America",
      c: HERO_ACCENT_SOFT,
    },
    {
      name: "Ontario Teachers'",
      score: 79,
      tag: "Multi-strategy · NA",
      c: HERO_STATUS_MUTED,
    },
  ];

  return (
    <section
      className="landing-band"
      style={{
        padding: "40px 0",
        position: "relative",
        background: "transparent",
      }}
    >
      <Wrap style={{ position: "relative" }}>
        <div
          className="product-snapshot-grid"
          style={{
            gridTemplateColumns: "1fr 1.3fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* LEFT — Text */}
          <Reveal>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 2,
                    background: C.accent,
                    borderRadius: 2,
                  }}
                />
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 750,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                    color: C.accent,
                  }}
                >
                  Product
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(22px, 2.7vw, 34px)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: -1,
                  marginBottom: 14,
                }}
              >
                Capital formation,{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.accent}, #8b6cf0)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  structured
                </span>
                .
              </h2>

              <p
                style={{
                  fontSize: 16.5,
                  color: C.textSoft,
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 420,
                }}
              >
                From fragmented outreach to a fully mapped pipeline — in
                seconds, not months.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  { text: "Identify high-fit LPs instantly", icon: "1" },
                  { text: "Understand why they match", icon: "2" },
                  {
                    text: "Track capital from first touch to close",
                    icon: "3",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {b.icon}
                    </div>
                    <span
                      style={{ fontSize: 15, fontWeight: 600, color: C.text }}
                    >
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Stacked Product Cards */}
          <Reveal delay={120}>
            <div style={{ position: "relative" }}>
              {/* ─── CARD 1: Match Engine (Main, top) ─── */}
              <div
                className="product-card-tight"
                onMouseEnter={() => setHoveredCard("match")}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: "22px 26px",
                  borderRadius: 18,
                  background:
                    "linear-gradient(160deg, rgba(19,16,48,.97), rgba(8,7,23,.99))",
                  border: `1px solid ${
                    hoveredCard === "match" ? C.borderHover : C.border
                  }`,
                  boxShadow:
                    hoveredCard === "match"
                      ? `0 24px 70px rgba(0,0,0,.55), 0 0 0 1px ${HERO_ACCENT}2a, 0 0 32px ${HERO_ACCENT}0c`
                      : "0 12px 40px rgba(0,0,0,.35)",
                  transform:
                    hoveredCard === "match" ? "translateY(-4px)" : "none",
                  transition: "all .3s cubic-bezier(.22,1,.36,1)",
                  position: "relative",
                  zIndex: 3,
                  marginBottom: -20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 720 }}>
                    Top Matches
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <Dot color={HERO_FIT} pulse size={5} />
                    <span
                      style={{
                        fontSize: 10.5,
                        color: HERO_FIT,
                        fontWeight: 650,
                      }}
                    >
                      Live
                    </span>
                  </div>
                </div>

                {matches.map((lp, i) => (
                  <div
                    key={lp.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${lp.c}10`,
                        border: `1px solid ${lp.c}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{ fontSize: 9, fontWeight: 800, color: lp.c }}
                      >
                        {lp.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 640,
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {lp.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: C.textMuted,
                          marginTop: 1,
                        }}
                      >
                        {lp.tag}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 4,
                          borderRadius: 2,
                          background: C.borderSubtle,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${lp.score}%`,
                            height: "100%",
                            background: lp.c,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <Mono size={12.5} weight={700} color={lp.c}>
                        {lp.score}%
                      </Mono>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Bottom row: Pipeline + Fund Progress ─── */}
              <div
                className="product-snapshot-stack"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gap: 12,
                  paddingLeft: 16,
                  paddingRight: 0,
                }}
              >
                {/* CARD 2: Pipeline */}
                <div
                  onMouseEnter={() => setHoveredCard("pipeline")}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, rgba(12,17,36,.97), rgba(8,12,24,.98))",
                    border: `1px solid ${
                      hoveredCard === "pipeline" ? C.borderHover : C.border
                    }`,
                    boxShadow:
                      hoveredCard === "pipeline"
                        ? "0 16px 50px rgba(0,0,0,.4)"
                        : "0 8px 30px rgba(0,0,0,.3)",
                    transform:
                      hoveredCard === "pipeline" ? "translateY(-2px)" : "none",
                    transition: "all .3s cubic-bezier(.22,1,.36,1)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{ fontSize: 12, fontWeight: 720, marginBottom: 12 }}
                  >
                    Pipeline
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 6,
                    }}
                  >
                    {[
                      { label: "Sourced", n: 12, c: C.textMuted },
                      { label: "Intro", n: 5, c: HERO_ACCENT },
                      { label: "DD", n: 3, c: HERO_REVIEW },
                      { label: "Closed", n: 1, c: HERO_FIT },
                    ].map((col) => (
                      <div key={col.label} style={{ textAlign: "center" }}>
                        <Mono size={16} weight={700} color={col.c}>
                          {col.n}
                        </Mono>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.textMuted,
                            fontWeight: 650,
                            marginTop: 2,
                          }}
                        >
                          {col.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: C.borderSubtle,
                      margin: "12px 0 10px",
                    }}
                  />
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {[
                      "Ribbit Capital → In DD",
                      "Pritzker Group → Intro sent",
                      "Willett Advisors → Sourced",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          fontSize: 11,
                          color: C.textSoft,
                          padding: "4px 8px",
                          borderRadius: 5,
                          background: C.bg,
                          border: `1px solid ${C.borderSubtle}`,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 3: Fund Progress */}
                <div
                  onMouseEnter={() => setHoveredCard("fund")}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, rgba(12,17,36,.97), rgba(8,12,24,.98))",
                    border: `1px solid ${
                      hoveredCard === "fund" ? C.borderHover : C.border
                    }`,
                    boxShadow:
                      hoveredCard === "fund"
                        ? "0 16px 50px rgba(0,0,0,.4)"
                        : "0 8px 30px rgba(0,0,0,.3)",
                    transform:
                      hoveredCard === "fund" ? "translateY(-2px)" : "none",
                    transition: "all .3s cubic-bezier(.22,1,.36,1)",
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{ fontSize: 12, fontWeight: 720, marginBottom: 12 }}
                  >
                    Fund Progress
                  </div>
                  <Mono size={24} weight={800} color={HERO_FIT}>
                    $120M
                  </Mono>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: C.textMuted,
                      marginTop: 2,
                      marginBottom: 12,
                    }}
                  >
                    of $300M target
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: C.borderSubtle,
                      borderRadius: 3,
                      overflow: "hidden",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        height: "100%",
                        background: `linear-gradient(90deg, ${HERO_FIT}, ${HERO_TRUST})`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textAlign: "right",
                    }}
                  >
                    40%
                  </div>

                  {/* Why match mini card */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 14,
                      borderTop: `1px solid ${C.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9.5,
                        fontWeight: 750,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginBottom: 8,
                      }}
                    >
                      Latest signal
                    </div>
                    {[
                      "Matches $8-15M check",
                      "Active in buyout",
                      "Recent allocations",
                    ].map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "3px 0",
                          fontSize: 11,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="6" fill={`${HERO_FIT}24`} />
                          <path
                            d="M3.5 6l1.5 1.5 3.5-3.5"
                            stroke={HERO_FIT}
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <span style={{ color: C.textSoft }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   PROBLEMS
   ════════════════════════════════════════════ */
export function Problems() {
  const rows = [
    {
      n: "01",
      t: "Networks decide access",
      d: "The best managers do not always win. The best-connected ones usually do.",
      c: C.red,
      fix: "Capital should move on fit and merit — not who already knows whom.",
    },
    {
      n: "02",
      t: "Diligence gets rebuilt every time",
      d: "The same documents, questions, and screening work are repeated across every potential LP relationship.",
      c: C.amber,
      fix: "A shared system should standardize the process instead of restarting it from zero.",
    },
    {
      n: "03",
      t: "Mandate fit is still opaque",
      d: "There is no clear system for knowing which LPs can allocate, under what conditions, and why.",
      c: C.accent,
      fix: "Structured mandate intelligence makes the right matches visible before the intro ever happens.",
    },
  ];

  const [active, setActive] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const target = window.innerHeight * 0.46;
      let closest = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - target);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActive(closest);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const jumpToCard = (index) => {
    setActive(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section
      className="market-failure-scroll-section"
      style={{
        padding: "34px 0 40px",
        borderTop: `1px solid transparent`,
        background: C.black,
      }}
    >
      <Wrap>
        <div>
          <div
            className="landing-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Left: headline */}
            <div className="landing-sticky" style={{ position: "sticky", top: 80 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: C.red,
                  marginBottom: 20,
                }}
              >
                The Market Failure
              </div>

              <h2
                style={{
                  fontSize: "clamp(24px,3vw,36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  marginBottom: 16,
                  maxWidth: 520,
                }}
              >
                Private Capital runs on relationships — not merit.
              </h2>

              <p
                style={{
                  fontSize: 14,
                  color: C.textSoft,
                  lineHeight: 1.7,
                  maxWidth: 420,
                  marginBottom: 32,
                }}
              >
                Private markets still depend on fragmented networks, repeated
                diligence, and unclear mandate fits.
              </p>

              {/* Selector tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {rows.map((r, i) => {
                  const isActive = active === i;

                  return (
                    <button
                      key={r.n}
                      onClick={() => jumpToCard(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: isActive ? C.surface : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background .18s ease, transform .18s ease",
                        transform: isActive
                          ? "translateX(4px)"
                          : "translateX(0px)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          fontWeight: 600,
                          color: isActive ? r.c : C.textMuted,
                          minWidth: 22,
                          transition: "color .18s ease",
                        }}
                      >
                        {r.n}
                      </span>

                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isActive ? C.white : C.textMuted,
                          transition: "color .18s ease",
                        }}
                      >
                        {r.t}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: active problem card */}
            <div className="problem-scroll-stack">
              {rows.map((r, i) => {
                const isActive = active === i;

                return (
                  <div
                    key={r.n}
                    ref={(node) => {
                      cardRefs.current[i] = node;
                    }}
                    data-problem-index={i}
                    onClick={() => jumpToCard(i)}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      marginBottom: 10,
                      padding: "20px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${isActive ? r.c + "40" : C.border}`,
                      background: isActive ? C.surface : C.card,
                      transition:
                        "border-color .22s ease, background .22s ease, transform .22s ease, box-shadow .22s ease",
                      transform: isActive
                        ? "translateY(-2px)"
                        : "translateY(0px)",
                      boxShadow: isActive
                        ? `0 0 0 1px ${r.c}18, 0 12px 32px ${r.c}12`
                        : "0 0 0 0 rgba(0,0,0,0)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: isActive
                          ? `radial-gradient(circle at top right, ${r.c}10, transparent 42%)`
                          : "transparent",
                        pointerEvents: "none",
                        transition: "background .22s ease",
                      }}
                    />

                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: 2,
                          background: r.c,
                        }}
                      />
                    )}

                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 13,
                          fontWeight: 700,
                          color: isActive ? r.c : C.textMuted,
                          transition: "color .2s ease",
                        }}
                      >
                        {r.n}
                      </span>

                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isActive ? r.c : C.textMuted,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: isActive ? r.c + "12" : C.raised,
                          border: `1px solid ${
                            isActive ? r.c + "24" : C.border
                          }`,
                          transition:
                            "color .2s ease, background .2s ease, border-color .2s ease",
                        }}
                      >
                        Thesis
                      </span>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.white,
                        marginBottom: 8,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {r.t}
                    </div>

                    <div
                      style={{
                        position: "relative",
                        fontSize: 13,
                        color: C.textSoft,
                        lineHeight: 1.65,
                        marginBottom: isActive ? 14 : 0,
                        transition: "margin-bottom .2s ease",
                        maxWidth: 520,
                      }}
                    >
                      {r.d}
                    </div>

                    {isActive && (
                      <div
                        className="fade-in"
                        style={{
                          position: "relative",
                          padding: "12px 14px",
                          background:
                            i === 2
                              ? C.accent + "10"
                              : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            i === 2 ? C.accent + "24" : C.border
                          }`,
                          borderRadius: 6,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: i === 2 ? C.accent : C.textMuted,
                            marginBottom: 4,
                          }}
                        >
                          What should exist instead
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            color: C.textSoft,
                            lineHeight: 1.6,
                          }}
                        >
                          {r.fix}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRODUCT MODULES
   ════════════════════════════════════════════ */
export function ProductModules() {
  const steps = [
    {
      n: "01",
      title: "LP mandate",
      body:
        "LPs define strategy, check size, geography, exclusions, pacing, and diligence requirements.",
      c: C.accentBright,
    },
    {
      n: "02",
      title: "GP fund packet",
      body:
        "GPs submit one structured profile with deck, DDQ, track record, terms, references, and data room links.",
      c: C.accentBright,
    },
    {
      n: "03",
      title: "Fit logic",
      body:
        "MandateOS shows which funds match the mandate, why they fit, and what still needs review.",
      c: C.accentBright,
    },
    {
      n: "04",
      title: "Diligence view",
      body:
        "LPs get missing items, red flags, follow-up questions, and a memo-ready summary from the fund materials.",
      c: C.accentBright,
    },
    {
      n: "05",
      title: "Controlled access",
      body:
        "Disclosure, data room access, contact reveal, and intro approvals move through a permissioned workflow.",
      c: C.accentBright,
    },
    {
      n: "06",
      title: "Capital progress",
      body:
        "Track intro, diligence, IC review, soft circle, and commitment from one shared workspace.",
      c: C.accentBright,
    },
  ];

  return (
    <section
      id="platform"
      style={{
        padding: "42px 0 48px",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <Wrap style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div
            className="product-modules-heading"
            style={{
              display: "block",
              marginBottom: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 780,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: C.accentBright,
                  marginBottom: 10,
                }}
              >
                Platform workflow
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px,2.65vw,34px)",
                  lineHeight: 1.06,
                  letterSpacing: 0,
                  fontWeight: 800,
                  marginBottom: 10,
                  maxWidth: 520,
                }}
              >
                From mandate to commitment.
              </h2>
              <p
                style={{
                  maxWidth: 460,
                  color: C.textSoft,
                  fontSize: 13,
                  lineHeight: 1.48,
                }}
              >
                Six connected workflow moments for mandate definition, manager
                packets, fit review, diligence, access control, and capital progress.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="product-modules-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
              alignItems: "stretch",
            }}
          >
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={130 + i * 35}>
                <div
                  style={{
                    minHeight: 204,
                    height: "100%",
                    padding: "24px 22px 21px",
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                    background: "rgba(255,255,255,.022)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.035)",
                    display: "grid",
                    gridTemplateRows: "auto auto 1fr",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <Mono size={13.5} weight={820} color={step.c}>
                      {step.n}
                    </Mono>
                    <span
                      style={{
                        color: C.textMuted,
                        fontSize: 10.5,
                        fontWeight: 700,
                      }}
                    >
                      Step
                    </span>
                  </div>
                  <div
                    style={{
                      color: C.text,
                      fontSize: 16.8,
                      fontWeight: 760,
                      lineHeight: 1.15,
                      letterSpacing: 0,
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: C.textSoft,
                      fontSize: 13.1,
                      lineHeight: 1.58,
                      maxWidth: 360,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   INTERACTIVE DEMO
   ════════════════════════════════════════════ */
const LP_DATABASE_STATIC = [
  {
    id: "demo-lp-1",
    name: "Hamilton Family Office",
    type: "Single Family Office",
    aum: "$2B-$5B",
    checkMin: 2,
    checkMax: 7,
    sectors: ["Technology", "Healthcare", "Software"],
    strategies: ["Venture Capital", "Growth Equity", "Buyout"],
    geographies: ["North America", "Europe"],
  },
  {
    id: "demo-lp-2",
    name: "Harborview Endowment",
    type: "University Endowment",
    aum: "$5B-$10B",
    checkMin: 5,
    checkMax: 20,
    sectors: ["Technology", "Climate", "Healthcare"],
    strategies: ["Venture Capital", "Growth Equity"],
    geographies: ["North America", "Global"],
  },
  {
    id: "demo-lp-3",
    name: "Summit Grove Foundation",
    type: "Foundation",
    aum: "$1B-$2B",
    checkMin: 1,
    checkMax: 5,
    sectors: ["Healthcare", "Education", "Climate"],
    strategies: ["Venture Capital", "Growth Equity"],
    geographies: ["North America"],
  },
];

function useLPs() {
  return { lps: LP_DATABASE_STATIC, loading: false };
}

export function DemoSection() {
  const [tab, setTab] = useState("lp");
  const tabs = [
    { id: "lp", label: "LP Mandate Builder", pill: "LP" },
    { id: "gp", label: "GP Submission", pill: "GP" },
    { id: "fit", label: "Fit Engine", pill: "Core" },
    { id: "reveal", label: "Reveal Flow", pill: "Privacy" },
  ];

  const handleTabClick = (id) => {
    setTab(id);
  };

  const activeGuidedStep = -1;
  const demoWorkflowAccent = "#6158bf";
  const demoWorkflowSoft = "rgba(97,88,191,.13)";

  return (
    <section
      id="demo"
      className="section-glow-top"
      style={{ padding: "40px 0", position: "relative", overflow: "hidden" }}
    >
      <Wrap>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                background: C.accent,
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Interactive Demo
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px,3vw,36px)",
                lineHeight: 1.02,
                letterSpacing: -1.2,
                fontWeight: 800,
                marginBottom: 12,
                maxWidth: 760,
              }}
            >
              Experience the{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, #8b6cf0, #b794f6)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                workflow
              </span>
            </h2>
            <p
              style={{
                fontSize: 14.5,
                color: C.textSoft,
                lineHeight: 1.6,
                maxWidth: 540,
              }}
            >
              Build profiles, run mandate-fit analysis, and simulate the full
              LP-GP matching pipeline.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              background: "rgba(12,15,30,.98)",
              boxShadow: "0 20px 64px rgba(0,0,0,.36)",
            }}
          >
            {/* Tab bar */}
            <div
              style={{
                borderBottom: `1px solid ${C.border}`,
                background: "rgba(15,18,34,.98)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "0 12px 0 4px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto",
                    flex: "1 1 560px",
                  }}
                >
                  {tabs.map((t) => {
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTabClick(t.id)}
                        style={{
                          padding: "13px 20px",
                          background: "transparent",
                          border: "none",
                          borderBottom: `2px solid ${
                            active ? demoWorkflowAccent : "transparent"
                          }`,
                          color: active ? C.text : C.textMuted,
                          fontSize: 13,
                          fontWeight: active ? 680 : 550,
                          cursor: "pointer",
                          transition: "all .15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.label}
                        <span
                          style={{
                            fontSize: 9,
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontWeight: 750,
                            letterSpacing: 0.5,
                            background: active ? demoWorkflowSoft : C.bg,
                            color: active ? "rgba(184,178,255,.86)" : C.textMuted,
                          }}
                        >
                          {t.pill}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 0",
                    marginLeft: "auto",
                  }}
                >
                  {["#ff5f57", "#ffbd2e", "#28c840"].map((color) => (
                    <span
                      key={color}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: "0 0 0 1px rgba(0,0,0,.28) inset",
                        opacity: 0.76,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: 28,
                minHeight: 520,
                background:
                  "linear-gradient(180deg, rgba(12,15,30,.99), rgba(10,13,27,.99))",
              }}
              key={tab}
              className="fade-in demo-panel-content"
            >
              {tab === "lp" && (
                <DemoLP guidedStep={activeGuidedStep} />
              )}
              {tab === "gp" && (
                <DemoGP guidedStep={activeGuidedStep} />
              )}
              {tab === "fit" && (
                <DemoFit guidedStep={activeGuidedStep} />
              )}
              {tab === "reveal" && (
                <DemoReveal guidedStep={activeGuidedStep} />
              )}
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

function LegacyDemoSection() {
  const [tab, setTab] = useState("mandate");
  const tabs = [
    {
      id: "mandate",
      label: "Mandate Builder",
      side: "LP Workspace",
      title: "Hamilton Family Office",
      subtitle: "2026 private equity allocation",
      status: "Mandate active",
      metrics: [
        ["Check size", "$2M-$7M"],
        ["Target allocation", "$25M"],
        ["Commitments", "4-6"],
        ["Pacing", "2026"],
      ],
      rows: [
        ["Strategy", "Growth equity / buyout"],
        ["Geography", "North America + Europe"],
        ["Sectors", "Software, healthcare IT, business services"],
        ["Exclusions", "Crypto, tobacco, weapons"],
        ["Required", "Deck, DDQ, track record, references"],
      ],
      footer: "12 matching funds found - 3 above 85% fit",
      color: C.green,
    },
    {
      id: "packet",
      label: "GP Submission",
      side: "GP Workspace",
      title: "Northline Capital III",
      subtitle: "Growth equity - Fund III - North America / Europe",
      status: "Packet created",
      metrics: [
        ["Check sought", "$5M-$15M"],
        ["Target", "$300M"],
        ["Minimum", "$2M"],
        ["Readiness", "82%"],
      ],
      rows: [
        ["Fund terms", "2.0% fee, 20% carry, $8M GP commit"],
        ["Uploaded", "Deck, DDQ, track record, team bios"],
        ["Pending", "Final LPA, audited financials, final PPM"],
        ["References", "Two allocator-ready calls needed"],
        ["Next action", "Attach realized-exit attribution detail"],
      ],
      footer: "Reusable fund packet ready for mandate review",
      color: C.purple,
    },
    {
      id: "fit",
      label: "Fit Logic",
      side: "Core System",
      title: "Northline -> Hamilton",
      subtitle: "Matched against 2026 PE allocation",
      status: "Qualified",
      metrics: [
        ["Fit score", "92"],
        ["Strategy", "98%"],
        ["Check size", "95%"],
        ["Open gaps", "3"],
      ],
      rows: [
        ["Why it fits", "Strategy, fund size, sector, geography"],
        ["Main blocker", "References and final legal docs pending"],
        ["LP requirement", "Track record and DDQ already parsed"],
        ["Review state", "Qualified for LP review"],
        ["Next action", "Request references and move to diligence"],
      ],
      footer: "Fit logic explains the match before an intro is made",
      color: C.accentBright,
    },
    {
      id: "diligence",
      label: "Diligence View",
      side: "DiligenceOS",
      title: "Generated LP diligence review",
      subtitle: "From deck, DDQ, PPM, track record, references",
      status: "Memo draft",
      metrics: [
        ["Docs parsed", "5"],
        ["Red flags", "3"],
        ["Missing", "2"],
        ["Questions", "4"],
      ],
      rows: [
        ["Extracted", "Terms, strategy, team, track record"],
        ["Red flags", "Gross-to-net bridge and legal docs missing"],
        ["Memo", "Strategy overview and risk summary drafted"],
        ["Follow-up", "Attribution, references, pacing questions"],
        ["Next action", "Send follow-up request before IC scheduling"],
      ],
      footer: "LP-grade review generated from fund materials",
      color: C.amber,
    },
    {
      id: "access",
      label: "Controlled Access",
      side: "Permissioned Room",
      title: "Hamilton Family Office <-> Northline",
      subtitle: "Disclosure before introduction",
      status: "Intro ready",
      metrics: [
        ["LP status", "Interested"],
        ["GP status", "Approved"],
        ["Data room", "Granted"],
        ["Reveal", "Ready"],
      ],
      rows: [
        ["Visible", "Fund overview, strategy, target raise, team bios"],
        ["Held", "Full track record, references, legal documents"],
        ["Hidden", "Partner emails and sensitive portfolio detail"],
        ["Audit", "Disclosure and data-room access logged"],
        ["Next action", "Send intro with permission trail attached"],
      ],
      footer: "Disclosure approved without opening everything by default",
      color: C.teal,
    },
    {
      id: "capital",
      label: "Capital Progress",
      side: "Decision Room",
      title: "Northline - Hamilton",
      subtitle: "Relationship moved into active diligence",
      status: "In diligence",
      metrics: [
        ["Stage", "In DD"],
        ["Expected check", "$500K-$1.5M"],
        ["Soft circle", "$500K"],
        ["Probability", "Med-high"],
      ],
      rows: [
        ["Pipeline", "Matched -> Reviewed -> In diligence"],
        ["Meeting", "Partner diligence call scheduled"],
        ["Open tasks", "Track record, references, LPA, IC memo"],
        ["Activity", "LP opened track record 12m ago"],
        ["Next action", "Prepare IC memo and confirm check size"],
      ],
      footer: "Commitment tracking active from the same workspace",
      color: C.green,
    },
  ];

  const active = tabs.find((item) => item.id === tab) || tabs[0];

  return (
    <section
      id="demo"
      className="section-glow-top"
      style={{ padding: "40px 0", position: "relative", overflow: "hidden" }}
    >
      <Wrap>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                background: C.accent,
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Interactive demo
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px,3vw,36px)",
                lineHeight: 1.02,
                letterSpacing: -1.2,
                fontWeight: 800,
                marginBottom: 12,
                maxWidth: 760,
              }}
            >
              Experience the{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, #8b6cf0, #b794f6)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                workflow
              </span>
            </h2>
            <p
              style={{
                fontSize: 14.5,
                color: C.textSoft,
                lineHeight: 1.6,
                maxWidth: 540,
              }}
            >
              Click through the same transaction surface from mandate setup to
              diligence, access approval, and capital progress.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${C.borderSubtle}`,
              background: "#151b24",
              boxShadow: "0 20px 64px rgba(0,0,0,.36)",
            }}
          >
            <div
              style={{
                height: 40,
                borderBottom: `1px solid rgba(237,234,248,.08)`,
                background: "#111720",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "0 14px",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {["#f87171", "#fbbf24", "#34d399"].map((color) => (
                  <span
                    key={color}
                    style={{ width: 8, height: 8, borderRadius: 999, background: color, opacity: 0.88 }}
                  />
                ))}
              </div>
              <Mono size={11} weight={700} color={C.textMuted}>
                mandateos.app/interactive-workflow
              </Mono>
            </div>

            <div
              className="demo-panel-content"
              style={{ padding: 18, background: "#151b24" }}
            >
              <div
                className="hero-film-tabs"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {tabs.map((item, index) => {
                  const selected = item.id === tab;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      style={{
                        minHeight: 54,
                        padding: "10px 10px",
                        borderRadius: 8,
                        border: `1px solid ${selected ? item.color + "55" : "rgba(237,234,248,.075)"}`,
                        background: selected ? `${item.color}12` : "rgba(255,255,255,.025)",
                        color: selected ? C.text : C.textMuted,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color .18s ease, background .18s ease, color .18s ease",
                      }}
                    >
                      <Mono size={10} weight={820} color={selected ? item.color : C.textMuted}>
                        {String(index + 1).padStart(2, "0")}
                      </Mono>
                      <div style={{ fontSize: 11.5, fontWeight: 760, marginTop: 5, lineHeight: 1.2 }}>
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                key={active.id}
                className="fade-in"
                style={{
                  minHeight: 430,
                  borderRadius: 10,
                  border: `1px solid rgba(237,234,248,.08)`,
                  background: "linear-gradient(180deg, rgba(24,31,42,.98), rgba(18,24,34,.98))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.035)",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateRows: "auto auto 1fr auto",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 16,
                    padding: "18px 18px 14px",
                    borderBottom: `1px solid rgba(237,234,248,.075)`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: active.color,
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        marginBottom: 7,
                      }}
                    >
                      {active.side}
                    </div>
                    <h3
                      style={{
                        margin: 0,
                        color: C.text,
                        fontSize: 21,
                        fontWeight: 820,
                        letterSpacing: 0,
                        lineHeight: 1.08,
                      }}
                    >
                      {active.title}
                    </h3>
                    <div style={{ color: C.textMuted, fontSize: 12.4, marginTop: 6 }}>
                      {active.subtitle}
                    </div>
                  </div>
                  <span
                    style={{
                      alignSelf: "start",
                      padding: "5px 9px",
                      borderRadius: 7,
                      border: `1px solid ${active.color}36`,
                      background: `${active.color}13`,
                      color: active.color,
                      fontSize: 11,
                      fontWeight: 780,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {active.status}
                  </span>
                </div>

                <div
                  className="demo-workflow-metrics"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 10,
                    padding: "14px 18px",
                    borderBottom: `1px solid rgba(237,234,248,.075)`,
                  }}
                >
                  {active.metrics.map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        minHeight: 62,
                        borderRadius: 8,
                        border: `1px solid rgba(237,234,248,.075)`,
                        background: "rgba(255,255,255,.025)",
                        padding: "10px 11px",
                      }}
                    >
                      <div style={{ color: C.textMuted, fontSize: 9.8, fontWeight: 760, textTransform: "uppercase", letterSpacing: ".08em" }}>
                        {label}
                      </div>
                      <div style={{ color: C.text, fontSize: 17.5, fontWeight: 820, marginTop: 8, lineHeight: 1 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "0 18px 14px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "138px minmax(0, 1fr)",
                      gap: 0,
                      border: `1px solid rgba(237,234,248,.075)`,
                      borderRadius: 9,
                      overflow: "hidden",
                      marginTop: 14,
                    }}
                  >
                    {active.rows.map(([label, value], index) => (
                      <Fragment key={label}>
                        <div
                          style={{
                            padding: "10px 12px",
                            background: index % 2 ? "rgba(255,255,255,.018)" : "rgba(255,255,255,.028)",
                            borderBottom: index === active.rows.length - 1 ? "none" : `1px solid rgba(237,234,248,.075)`,
                            color: C.text,
                            fontSize: 12,
                            fontWeight: 760,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            padding: "10px 12px",
                            background: index % 2 ? "rgba(255,255,255,.012)" : "rgba(255,255,255,.02)",
                            borderBottom: index === active.rows.length - 1 ? "none" : `1px solid rgba(237,234,248,.075)`,
                            borderLeft: `1px solid rgba(237,234,248,.075)`,
                            color: C.textSoft,
                            fontSize: 12,
                            lineHeight: 1.35,
                          }}
                        >
                          {value}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 18px",
                    borderTop: `1px solid rgba(237,234,248,.075)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ color: active.color, fontSize: 12, fontWeight: 780 }}>
                    {active.footer}
                  </span>
                  <Mono size={11} weight={760} color={C.textMuted}>
                    Same workspace data layer
                  </Mono>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   MANDATE SEARCH — FULL PRODUCT EXPERIENCE
   Search, filter, save mandates, pipeline view
   ════════════════════════════════════════════ */
function MandateSearch() {
  const { lps: lpDb, loading: lpLoading } = useLPs();
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("All");
  const [filterGeo, setFilterGeo] = useState("All");
  const [filterCheckMin, setFilterCheckMin] = useState("");
  const [filterCheckMax, setFilterCheckMax] = useState("");
  const [view, setView] = useState("cards"); // cards | pipeline | saved
  const [savedLPs, setSavedLPs] = useState(() => lsGet("saved_lps", []));
  const [shortlistedLPs, setShortlistedLPs] = useState(() =>
    lsGet("shortlisted_lps", [])
  );
  const [savedMandates, setSavedMandates] = useState(() =>
    lsGet("saved_mandates", [])
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [profileLP, setProfileLP] = useState(null);
  const [notesLpId, setNotesLpId] = useState(null);
  const [statusMap, setStatusMap] = useState(() => lsGet("lp_statuses", {}));
  const [emailLP, setEmailLP] = useState(null);

  const gpProfile = {
    strategy: "Venture Capital",
    sectors: ["Technology", "Healthcare"],
    geography: "North America",
    checkMin: 5,
    checkMax: 25,
  };
  const allResults = runFitEngine(gpProfile, lpDb);

  // Apply filters
  let filtered = allResults;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.lp.name.toLowerCase().includes(s) ||
        r.lp.type.toLowerCase().includes(s)
    );
  }
  if (filterSector !== "All")
    filtered = filtered.filter((r) => r.lp.sectors.includes(filterSector));
  if (filterGeo !== "All")
    filtered = filtered.filter((r) => r.lp.geographies.includes(filterGeo));
  if (filterCheckMin)
    filtered = filtered.filter((r) => r.lp.checkMax >= Number(filterCheckMin));
  if (filterCheckMax)
    filtered = filtered.filter((r) => r.lp.checkMin <= Number(filterCheckMax));

  const toggleSave = (lp) => {
    const exists = savedLPs.some((x) => x.id === lp.id);
    const next = exists
      ? savedLPs.filter((x) => x.id !== lp.id)
      : [...savedLPs, lp];
    setSavedLPs(next);
    lsSet("saved_lps", next);
    showToast(exists ? "Removed from saved" : "LP saved", "success");
  };
  const toggleShortlist = (lp) => {
    const exists = shortlistedLPs.some((x) => x.id === lp.id);
    const next = exists
      ? shortlistedLPs.filter((x) => x.id !== lp.id)
      : [...shortlistedLPs, lp];
    setShortlistedLPs(next);
    lsSet("shortlisted_lps", next);
    showToast(exists ? "Removed from shortlist" : "LP shortlisted", "success");
  };
  const removeShortlist = (id) => {
    const next = shortlistedLPs.filter((x) => x.id !== id);
    setShortlistedLPs(next);
    lsSet("shortlisted_lps", next);
  };

  const saveMandate = () => {
    const m = {
      id: Date.now(),
      strategy: gpProfile.strategy,
      sectors: gpProfile.sectors,
      geography: gpProfile.geography,
      checkMin: gpProfile.checkMin,
      checkMax: gpProfile.checkMax,
      date: new Date().toLocaleDateString(),
    };
    const next = [...savedMandates, m];
    setSavedMandates(next);
    lsSet("saved_mandates", next);
    showToast("Mandate saved", "success");
  };

  const setLPStatus = (lpId, status) => {
    const next = { ...statusMap, [lpId]: status };
    setStatusMap(next);
    lsSet("lp_statuses", next);
    showToast(`Status: ${status}`, "success");
  };

  const clearFilters = () => {
    setSearch("");
    setFilterSector("All");
    setFilterGeo("All");
    setFilterCheckMin("");
    setFilterCheckMax("");
  };
  const hasFilters =
    search ||
    filterSector !== "All" ||
    filterGeo !== "All" ||
    filterCheckMin ||
    filterCheckMax;

  const allSectors = [...new Set(lpDb.flatMap((l) => l.sectors))].sort();
  const allGeos = [...new Set(lpDb.flatMap((l) => l.geographies))].sort();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 720 }}>LP Discovery</h3>
        <Pill color={C.green}>New</Pill>
        <div
          className="mandate-view-actions"
          style={{ marginLeft: "auto", display: "flex", gap: 6 }}
        >
          <Btn
            variant={view === "cards" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("cards")}
          >
            Cards
          </Btn>
          <Btn
            variant={view === "pipeline" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("pipeline")}
          >
            Pipeline
          </Btn>
          <Btn
            variant={view === "saved" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("saved")}
          >
            Saved ({savedLPs.length})
          </Btn>
          <Btn
            variant="secondary"
            size="sm"
            onClick={() => setPanelOpen(true)}
            style={{ position: "relative" }}
          >
            ⭐ {shortlistedLPs.length}
          </Btn>
        </div>
      </div>
      <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 18 }}>
        Search and filter {lpLoading ? "..." : lpDb.length} institutional LPs.
        Save, shortlist, and track your pipeline.
      </p>

      {/* Search + Filters */}
      <div
        className="mandate-filters-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 0.7fr 0.7fr auto",
          gap: 8,
          marginBottom: 16,
          alignItems: "end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 4,
            }}
          >
            Search
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search LP name or type..."
          />
        </div>
        <FSelect
          label="Sector"
          options={[
            { value: "All", label: "All Sectors" },
            ...allSectors.map((s) => ({ value: s, label: s })),
          ]}
          value={filterSector}
          onChange={setFilterSector}
        />
        <FSelect
          label="Geography"
          options={[
            { value: "All", label: "All Regions" },
            ...allGeos.map((g) => ({ value: g, label: g })),
          ]}
          value={filterGeo}
          onChange={setFilterGeo}
        />
        <FInput
          label="Min ($M)"
          prefix="$"
          value={filterCheckMin}
          onChange={setFilterCheckMin}
          mono
          placeholder="0"
        />
        <FInput
          label="Max ($M)"
          prefix="$"
          value={filterCheckMax}
          onChange={setFilterCheckMax}
          mono
          placeholder="100"
        />
        <div style={{ marginBottom: 16 }}>
          {hasFilters && (
            <Btn
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              style={{ color: C.red, fontSize: 11 }}
            >
              Clear
            </Btn>
          )}
        </div>
      </div>

      {/* Mandate Actions */}
      <div
        className="mandate-actions-row"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Btn variant="secondary" size="sm" onClick={saveMandate}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M2 1.5h8a.5.5 0 01.5.5v9L6 8.5 1.5 11V2a.5.5 0 01.5-.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
          Save Mandate
        </Btn>
        {savedMandates.length > 0 && (
          <span style={{ fontSize: 11, color: C.textSoft }}>
            {savedMandates.length} mandate{savedMandates.length > 1 ? "s" : ""}{" "}
            saved
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.textMuted }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Pipeline View */}
      {view === "pipeline" && (
        <div
          className="pipeline-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Dot
                  color={
                    stage === "Closed"
                      ? C.green
                      : stage === "In DD"
                      ? C.amber
                      : stage === "Contacted"
                      ? C.accent
                      : C.textMuted
                  }
                  size={6}
                />
                {stage}
                <span
                  style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}
                >
                  ({PIPELINE_DATA.filter((p) => p.stage === stage).length})
                </span>
              </div>
              {PIPELINE_DATA.filter((p) => p.stage === stage).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 12,
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: 12.5 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <Mono
                      size={11}
                      weight={600}
                      color={getScoreColor(item.score)}
                    >
                      {item.score}
                    </Mono>
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Saved LPs View */}
      {view === "saved" && (
        <div>
          {savedLPs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 650, marginBottom: 6 }}>
                No saved LPs yet
              </div>
              <div style={{ fontSize: 13, color: C.textSoft }}>
                Save LPs from the Cards view to track them here.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 10,
              }}
            >
              {savedLPs.map((lp) => (
                <div
                  key={lp.id}
                  style={{
                    padding: 16,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: C.accentWash,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.accentBright,
                      }}
                    >
                      {getInitials(lp.name)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 660, fontSize: 13.5 }}>
                      {lp.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.textSoft }}>
                      {lp.type} · {lp.aum}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {/* Status dropdown */}
                    <select
                      value={statusMap[lp.id] || ""}
                      onChange={(e) => setLPStatus(lp.id, e.target.value)}
                      style={{
                        padding: "4px 6px",
                        fontSize: 10,
                        borderRadius: 5,
                        border: `1px solid ${C.border}`,
                        background: C.bg,
                        color: C.textSoft,
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Status</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In DD">In DD</option>
                      <option value="Passed">Passed</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button
                      onClick={() => toggleSave(lp)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 5,
                        border: `1px solid ${C.border}`,
                        background: "transparent",
                        color: C.red,
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 650,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Mandates */}
          {savedMandates.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 10,
                }}
              >
                Saved Mandates
              </div>
              {savedMandates.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: 12,
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    borderRadius: 8,
                    marginBottom: 6,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>
                      {m.strategy} · {m.sectors.join(", ")}
                    </div>
                    <div style={{ fontSize: 11, color: C.textSoft }}>
                      ${m.checkMin}-{m.checkMax}M · {m.geography} · {m.date}
                    </div>
                  </div>
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setView("cards");
                      showToast("Re-running mandate", "info");
                    }}
                  >
                    Re-run
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cards View */}
      {view === "cards" && (
        <div
          className="mandate-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "44px 0",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.5 }}>
                ∅
              </div>
              <div style={{ fontSize: 15, fontWeight: 650, marginBottom: 6 }}>
                No LPs match your criteria
              </div>
              <div
                style={{ fontSize: 12.5, color: C.textSoft, marginBottom: 14 }}
              >
                Try adjusting your filters or broadening your search.
              </div>
              {hasFilters && (
                <Btn variant="secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Btn>
              )}
            </div>
          ) : (
            filtered.map((r, i) => {
              const sc = getScoreColor(r.score);
              const isSaved = savedLPs.some((x) => x.id === r.lp.id);
              const isShortlisted = shortlistedLPs.some(
                (x) => x.id === r.lp.id
              );
              const status = statusMap[r.lp.id];
              return (
                <div
                  key={r.lp.id}
                  onClick={() => setProfileLP(r)}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all .25s cubic-bezier(.22,1,.36,1)",
                    animation: `popIn .25s cubic-bezier(.22,1,.36,1) ${
                      i * 0.02
                    }s both`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.borderHover;
                    e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,.3)`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "12px 14px 10px",
                      borderBottom: `1px solid ${C.borderSubtle}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: `linear-gradient(135deg, ${sc}20, ${sc}08)`,
                          border: `1px solid ${sc}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{ fontSize: 11, fontWeight: 800, color: sc }}
                        >
                          {getInitials(r.lp.name)}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 660,
                            fontSize: 13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {r.lp.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: C.textMuted,
                            marginTop: 1,
                          }}
                        >
                          {r.lp.type} · {r.lp.aum}
                          {status && (
                            <span
                              style={{
                                marginLeft: 4,
                                padding: "0px 4px",
                                borderRadius: 3,
                                fontSize: 8.5,
                                fontWeight: 700,
                                background:
                                  status === "Closed"
                                    ? C.greenWash
                                    : C.accentWash,
                                color: status === "Closed" ? C.green : C.accent,
                              }}
                            >
                              {status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: sc + "15",
                        border: `1px solid ${sc}25`,
                        borderRadius: 6,
                        padding: "3px 8px",
                        flexShrink: 0,
                      }}
                    >
                      <Mono size={13} weight={700} color={sc}>
                        {r.score}
                      </Mono>
                    </div>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      padding: "10px 14px 12px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        marginBottom: 8,
                      }}
                    >
                      {r.lp.sectors.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          style={{
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 9,
                            fontWeight: 650,
                            background: C.accentWash,
                            color: C.accentBright,
                            border: `1px solid ${C.accent}18`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {r.lp.geographies.slice(0, 1).map((g) => (
                        <span
                          key={g}
                          style={{
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 9,
                            fontWeight: 650,
                            background: C.tealWash,
                            color: C.teal,
                            border: `1px solid ${C.teal}18`,
                          }}
                        >
                          {g}
                        </span>
                      ))}
                      {r.lp.deploying && (
                        <span
                          style={{
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 9,
                            fontWeight: 650,
                            background: C.greenWash,
                            color: C.green,
                            border: `1px solid ${C.green}18`,
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                      <div>
                        <div
                          style={{
                            fontSize: 8.5,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                          }}
                        >
                          Check
                        </div>
                        <Mono size={10.5} weight={600}>
                          ${r.lp.checkMin}-{r.lp.checkMax}M
                        </Mono>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 8.5,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                          }}
                        >
                          AUM
                        </div>
                        <Mono size={10.5} weight={600}>
                          {r.lp.aum}
                        </Mono>
                      </div>
                    </div>

                    {/* Match reasons — compact */}
                    <div style={{ marginBottom: 8 }}>
                      {r.reasons
                        .filter((x) => x.ok)
                        .slice(0, 2)
                        .map((reason, j) => (
                          <div
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "1.5px 0",
                              fontSize: 10.5,
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 9 9">
                              <path
                                d="M1.5 4.5l2 2 4-4"
                                stroke={C.green}
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                            <span style={{ color: C.textMuted }}>
                              {reason.text}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginTop: "auto",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(r.lp);
                        }}
                        style={{
                          flex: 1,
                          padding: "5px 0",
                          borderRadius: 6,
                          border: `1px solid ${isSaved ? C.accent : C.border}`,
                          background: isSaved ? C.accentWash : "transparent",
                          color: isSaved ? C.accentBright : C.textMuted,
                          fontSize: 10,
                          fontWeight: 650,
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        {isSaved ? "✓ Saved" : "Save"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShortlist(r.lp);
                        }}
                        style={{
                          flex: 1,
                          padding: "5px 0",
                          borderRadius: 6,
                          border: `1px solid ${
                            isShortlisted ? C.green : C.border
                          }`,
                          background: isShortlisted
                            ? C.greenWash
                            : "transparent",
                          color: isShortlisted ? C.green : C.textMuted,
                          fontSize: 10,
                          fontWeight: 650,
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        {isShortlisted ? "★ Listed" : "Shortlist"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmailLP(r);
                        }}
                        style={{
                          padding: "5px 8px",
                          borderRadius: 6,
                          border: `1px solid ${C.border}`,
                          background: "transparent",
                          color: C.textMuted,
                          fontSize: 10,
                          fontWeight: 650,
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        ✉
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesLpId(notesLpId === r.lp.id ? null : r.lp.id);
                        }}
                        style={{
                          padding: "5px 8px",
                          borderRadius: 6,
                          border: `1px solid ${C.border}`,
                          background: "transparent",
                          color: C.textMuted,
                          fontSize: 10,
                          fontWeight: 650,
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        📝
                      </button>
                      {notesLpId === r.lp.id && (
                        <NotesPopover
                          lpId={r.lp.id}
                          onClose={() => setNotesLpId(null)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LP Profile Modal */}
      {profileLP && (
        <LPProfileModal
          lp={profileLP.lp}
          score={profileLP.score}
          reasons={profileLP.reasons}
          onClose={() => setProfileLP(null)}
        />
      )}

      {/* Email Simulation Modal */}
      {emailLP && (
        <EmailSimModal
          lp={{ name: emailLP.lp.name, score: emailLP.score }}
          gp="Meridian Ventures Fund III"
          onClose={() => setEmailLP(null)}
        />
      )}

      {/* Shortlist Panel */}
      <ShortlistPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        items={shortlistedLPs}
        onRemove={removeShortlist}
      />
    </div>
  );
}

function DemoLP({ guidedStep = -1 }) {
  const [st, setSt] = useState(["Venture Capital"]);
  const [cMin, setCMin] = useState("5");
  const [cMax, setCMax] = useState("25");
  const [geo, setGeo] = useState(["North America"]);
  const [exc, setExc] = useState([]);
  const [ddq, setDdq] = useState(["DDQ Required"]);
  const [saved, setSaved] = useState(false);
  const [fundGeneration, setFundGeneration] = useState("any");
  const [sectors, setSectors] = useState(["Technology", "Healthcare"]);
  const [targetReturn, setTargetReturn] = useState("15");
  const [esg, setEsg] = useState("preferred");
  const guidedPublished = guidedStep >= 0;
  const effectiveSaved = saved || guidedPublished;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 720 }}>
          Define Allocation Mandate
        </h3>
        <Pill color={C.green}>LP View</Pill>
      </div>
      <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 24 }}>
        Set your parameters. Only mandate-fit submissions surface in your
        pipeline.
      </p>
      <div
        className="demo-two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
      >
        <div>
          <FTags
            label="Strategy"
            options={[
              "Venture Capital",
              "Growth Equity",
              "Buyout",
              "Real Estate",
              "Infrastructure",
              "Credit",
              "Secondaries",
            ]}
            selected={st}
            onChange={setSt}
          />
          <FTags
            label="Sector Focus"
            options={[
              "Technology",
              "Healthcare",
              "Climate",
              "Fintech",
              "Consumer",
              "Education",
              "Energy",
              "Infrastructure",
            ]}
            selected={sectors}
            onChange={setSectors}
          />
          <div
            className="demo-two-col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <FInput
              label="Min Check ($M)"
              prefix="$"
              value={cMin}
              onChange={setCMin}
              mono
            />
            <FInput
              label="Max Check ($M)"
              prefix="$"
              value={cMax}
              onChange={setCMax}
              mono
            />
          </div>
          <div
            className="demo-two-col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <FSelect
              label="Fund Generation"
              options={[
                { value: "any", label: "Any" },
                { value: "emerging", label: "Emerging (I-II)" },
                { value: "est", label: "Established (III+)" },
              ]}
              value={fundGeneration}
              onChange={setFundGeneration}
            />
            <FInput
              label="Target Return (% IRR)"
              value={targetReturn}
              onChange={setTargetReturn}
              mono
              placeholder="15"
            />
          </div>
        </div>
        <div>
          <FTags
            label="Geography"
            options={[
              "North America",
              "Europe",
              "Asia-Pacific",
              "LATAM",
              "MENA",
              "Global",
            ]}
            selected={geo}
            onChange={setGeo}
          />
          <FTags
            label="Exclusions"
            options={[
              "Fossil Fuels",
              "Tobacco",
              "Weapons",
              "Gambling",
              "Crypto",
            ]}
            selected={exc}
            onChange={setExc}
          />
          <FTags
            label="Diligence Requirements"
            options={[
              "DDQ Required",
              "Track Record Audit",
              "Reference Checks",
              "Background Check",
              "ESG Policy",
            ]}
            selected={ddq}
            onChange={setDdq}
          />
          <FSelect
            label="ESG Mandate"
            options={[
              { value: "required", label: "Required" },
              { value: "preferred", label: "Preferred" },
              { value: "none", label: "No Preference" },
            ]}
            value={esg}
            onChange={setEsg}
          />
        </div>
      </div>
      <Separator />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 12.5, color: C.textMuted }}>
          {st.length} strategies · {sectors.length} sectors · {geo.length}{" "}
          geographies · {exc.length} exclusions
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {effectiveSaved && (
            <span
              style={{
                color: C.green,
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              className="fade-in"
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="7" fill={C.green} />
                <path
                  d="M4 7l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Mandate published
            </span>
          )}
          <Btn
            variant="secondary"
            size="sm"
            onClick={() => showToast("Draft saved", "success")}
          >
            Save Draft
          </Btn>
          <Btn
            variant="primary"
            onClick={() => {
              setSaved(true);
              showToast("Mandate published to matching pipeline", "success");
            }}
          >
            {effectiveSaved ? "Published" : "Publish Mandate"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function DemoGP({ guidedStep = -1 }) {
  const [fund, setFund] = useState("Meridian Ventures Fund III");
  const [strat, setStrat] = useState("Venture Capital");
  const [sz, setSz] = useState("150");
  const [geo, setGeo] = useState("North America");
  const [team, setTeam] = useState("4");
  const [moic, setMoic] = useState("2.1");
  const [irr, setIrr] = useState("28.4");
  const [sub, setSub] = useState(false);
  const tmpl = "2.2fr 1fr 1fr 1fr";
  const guidedSubmitted = guidedStep >= 1;
  const effectiveSubmitted = sub || guidedSubmitted;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 720 }}>
          Fund Profile Submission
        </h3>
        <Pill color="#8b6cf0">GP View</Pill>
      </div>
      <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 24 }}>
        Submit your profile once. MandateOS matches it against active LP
        mandates in real time.
      </p>
      <div
        className="demo-two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 750,
              color: C.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 14,
              paddingBottom: 7,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            Fund Details
          </div>
          <FInput
            label="Fund Name"
            value={fund}
            onChange={setFund}
            placeholder="Fund name"
          />
          <FSelect
            label="Strategy"
            options={[
              "Venture Capital",
              "Growth Equity",
              "Buyout",
              "Real Estate",
              "Credit",
            ]}
            value={strat}
            onChange={setStrat}
          />
          <div
            className="demo-two-col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <FInput
              label="Target Size ($M)"
              prefix="$"
              value={sz}
              onChange={setSz}
              mono
            />
            <FSelect
              label="Generation"
              options={["Fund I", "Fund II", "Fund III", "Fund IV+"]}
              value="Fund III"
              onChange={() => {}}
            />
          </div>
          <FSelect
            label="Geography"
            options={["North America", "Europe", "Asia-Pacific", "Global"]}
            value={geo}
            onChange={setGeo}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 750,
              color: C.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 14,
              paddingBottom: 7,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            Team & Performance
          </div>
          <FInput
            label="Team Size"
            value={team}
            onChange={setTeam}
            placeholder="4"
          />
          <div
            className="demo-two-col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <FInput
              label="Net MOIC"
              value={moic}
              onChange={setMoic}
              mono
              placeholder="2.1x"
            />
            <FInput
              label="Net IRR (%)"
              value={irr}
              onChange={setIrr}
              mono
              placeholder="28.4"
            />
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              marginBottom: 8,
              marginTop: 2,
            }}
          >
            Prior Funds
          </div>
          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <THead cols={["Fund", "Vintage", "MOIC", "IRR"]} template={tmpl} />
            {[
              { f: "Fund I", v: "2016", m: "3.2x", i: "38.1%" },
              { f: "Fund II", v: "2019", m: "2.1x", i: "28.4%" },
            ].map((r, i) => (
              <TRow key={i} template={tmpl}>
                <span style={{ fontWeight: 550 }}>{r.f}</span>
                <Mono size={12} color={C.textSoft}>
                  {r.v}
                </Mono>
                <Mono size={12} color={C.green}>
                  {r.m}
                </Mono>
                <Mono size={12} color={C.green}>
                  {r.i}
                </Mono>
              </TRow>
            ))}
          </div>
        </div>
      </div>
      <Separator />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {effectiveSubmitted && (
          <span
            style={{
              color: C.green,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginRight: "auto",
            }}
            className="fade-in"
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="7" fill={C.green} />
              <path
                d="M4 7l2 2 4-4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            Profile active in matching pipeline
          </span>
        )}
        <Btn variant="secondary" size="sm">
          Save Draft
        </Btn>
        <Btn variant="primary" onClick={() => setSub(true)}>
          {effectiveSubmitted ? "Submitted" : "Submit to Matching"}
        </Btn>
      </div>
    </div>
  );
}

const DEMO_FIT_UNIVERSE_SIZE = 312;
const DEMO_FIT_SUFFIXES = [
  "Core Mandate",
  "Growth Sleeve",
  "Venture Pool",
  "Innovation Sleeve",
  "Private Markets Book",
  "Emerging Manager Program",
  "Opportunistic Account",
  "Strategic Allocation",
];

function buildDemoFitResults(profile, lpDb) {
  const sourceDb = lpDb?.length ? lpDb : LP_DATABASE_STATIC;
  const baseResults = sourceDb
    .map((lp) => computeFitScore(profile, lp))
    .sort((a, b) => b.score - a.score);
  if (!baseResults.length) return [];

  const targetCount = Math.max(
    DEMO_FIT_UNIVERSE_SIZE,
    Math.min(420, sourceDb.length * 10)
  );

  return Array.from({ length: targetCount }, (_, i) => {
    const source = baseResults[i % baseResults.length];
    const cycle = Math.floor(i / baseResults.length);
    const scoreShift = ((i * 7) % 13) - 4 - Math.floor(cycle / 5);
    const score = Math.max(24, Math.min(99, source.score + scoreShift));
    const suffix = DEMO_FIT_SUFFIXES[cycle % DEMO_FIT_SUFFIXES.length];
    const sequence = cycle + 1;

    return {
      ...source,
      score,
      lp: {
        ...source.lp,
        id: `${source.lp.id}-demo-fit-${i}`,
        name:
          cycle === 0
            ? source.lp.name
            : `${source.lp.name} ${suffix} ${sequence}`,
      },
    };
  }).sort((a, b) => b.score - a.score);
}

export function DemoFit({ guidedStep = -1 }) {
  const { lps: lpDb } = useLPs();
  const [phase, setPhase] = useState("input"); // input | loading | results
  const [results, setResults] = useState(null);

  const [fundName, setFundName] = useState("Meridian Ventures Fund III");
  const [strategy, setStrategy] = useState("Venture Capital");
  const [sectors, setSectors] = useState(["Technology", "Healthcare"]);
  const [geography, setGeography] = useState("North America");
  const [checkMin, setCheckMin] = useState("5");
  const [checkMax, setCheckMax] = useState("25");
  const [fundSize, setFundSize] = useState("150");

  const allSectors = [
    "Technology",
    "Healthcare",
    "Climate",
    "Fintech",
    "Consumer",
    "Education",
    "Energy",
    "Infrastructure",
    "Real Estate",
    "Credit",
  ];

  useEffect(() => {
    if (guidedStep < 2) return;
    const profile = {
      strategy,
      sectors,
      geography,
      checkMin: Number(checkMin) || 0,
      checkMax: Number(checkMax) || 999,
    };
    setResults(buildDemoFitResults(profile, lpDb));
    setPhase("results");
  }, [guidedStep, lpDb, strategy, sectors, geography, checkMin, checkMax]);

  const run = () => {
    setPhase("loading");
    setResults(null);
    const profile = {
      strategy,
      sectors,
      geography,
      checkMin: Number(checkMin) || 0,
      checkMax: Number(checkMax) || 999,
    };
    setTimeout(() => {
      const r = buildDemoFitResults(profile, lpDb);
      setPhase("results");
      setResults(r);
    }, 1600);
  };

  const reset = () => {
    setPhase("input");
    setResults(null);
  };

  const strongCount = results ? results.filter((r) => r.score >= 75).length : 0;
  const partialCount = results
    ? results.filter((r) => r.score >= 45 && r.score < 75).length
    : 0;
  const lowCount = results ? results.filter((r) => r.score < 45).length : 0;
  const demoUniverseCount = results?.length || DEMO_FIT_UNIVERSE_SIZE;

  const panelStyle = {
    padding: "16px 20px",
    background: C.bg,
    borderRadius: 12,
    border: `1px solid ${C.borderSubtle}`,
  };

  const sectionLabelStyle = {
    fontSize: 10,
    fontWeight: 750,
    color: C.textMuted,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 10,
  };

  return (
    <div
      style={{
        height: 720,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* fixed header */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 5,
          }}
        >
          <h3 style={{ fontSize: 17, fontWeight: 720 }}>Mandate-Fit Engine</h3>
          <Pill color={C.accent}>Core</Pill>
        </div>
        <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 14 }}>
          Enter your fund profile. The engine scores every LP mandate and
          returns ranked matches with transparent reasoning.
        </p>
      </div>

      {/* scrollable body so overall component height stays identical */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* INPUT */}
        {phase === "input" && (
          <div>
            <div>
              <div style={{ ...panelStyle, marginBottom: 16 }}>
                <div style={sectionLabelStyle}>Your Fund Profile</div>
                <div
                  className="demo-two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 16,
                  }}
                >
                  <FInput
                    label="Fund Name"
                    value={fundName}
                    onChange={setFundName}
                    placeholder="Your fund name"
                  />
                  <FInput
                    label="Fund Size ($M)"
                    prefix="$"
                    value={fundSize}
                    onChange={setFundSize}
                    mono
                    placeholder="150"
                  />
                </div>
              </div>

              <div
                className="demo-two-col"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div style={panelStyle}>
                  <FSelect
                    label="Strategy"
                    options={[
                      "Venture Capital",
                      "Growth Equity",
                      "Buyout",
                      "Real Estate",
                      "Infrastructure",
                      "Credit",
                      "Secondaries",
                    ]}
                    value={strategy}
                    onChange={setStrategy}
                  />
                  <FSelect
                    label="Primary Geography"
                    options={[
                      "North America",
                      "Europe",
                      "Asia-Pacific",
                      "LATAM",
                      "MENA",
                      "Global",
                    ]}
                    value={geography}
                    onChange={setGeography}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <FInput
                      label="Min Check ($M)"
                      prefix="$"
                      value={checkMin}
                      onChange={setCheckMin}
                      mono
                      placeholder="5"
                    />
                    <FInput
                      label="Max Check ($M)"
                      prefix="$"
                      value={checkMax}
                      onChange={setCheckMax}
                      mono
                      placeholder="25"
                    />
                  </div>
                </div>

                <div style={panelStyle}>
                  <FTags
                    label="Sector Focus (select all that apply)"
                    options={allSectors}
                    selected={sectors}
                    onChange={setSectors}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: C.raised,
                  borderRadius: 10,
                  border: `1px solid ${C.borderSubtle}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 750,
                      color: C.textMuted,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Scoring Weights
                  </span>
                  {Object.entries(FIT_WEIGHTS).map(([k, v]) => (
                    <span
                      key={k}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 650,
                        background: C.bg,
                        color: C.textSoft,
                        border: `1px solid ${C.borderSubtle}`,
                      }}
                    >
                      {k === "checkSize"
                        ? "Check"
                        : k === "sector"
                        ? "Sector"
                        : k === "geography"
                        ? "Geo"
                        : "Strategy"}
                      : {v}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: C.textMuted }}>
                  Total: 100
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: `1px solid ${C.borderSubtle}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 12, color: C.textMuted }}>
                Will score against {DEMO_FIT_UNIVERSE_SIZE}+ active LP mandates
              </span>
              <Btn variant="primary" size="lg" onClick={run}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon points="5,3 11,7 5,11" fill="currentColor" />
                </svg>
                Run Fit Analysis
              </Btn>
            </div>
          </div>
        )}

        {/* LOADING */}
        {phase === "loading" && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
            className="fade-in"
          >
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  border: `3px solid ${C.border}`,
                  borderTopColor: C.accent,
                  borderRadius: "50%",
                  animation: "spin .7s linear infinite",
                  margin: "0 auto 20px",
                }}
              />
              <div
                style={{
                  color: C.text,
                  fontSize: 15,
                  fontWeight: 650,
                  marginBottom: 4,
                }}
              >
                Scoring {DEMO_FIT_UNIVERSE_SIZE}+ mandates for{" "}
                {fundName || "your fund"}
              </div>
              <div
                style={{ color: C.textMuted, fontSize: 12.5, marginBottom: 20 }}
              >
                {strategy} · {sectors.join(", ")} · {geography}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Matching strategies",
                  "Scoring sectors",
                  "Evaluating check sizes",
                  "Checking geographies",
                ].map((s, i) => (
                  <span
                    key={s}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 10.5,
                      fontWeight: 600,
                      background: C.bg,
                      border: `1px solid ${C.borderSubtle}`,
                      color: C.textMuted,
                      animation: `fadeIn .3s ease ${i * 0.25}s both`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {phase === "results" && results && (
          <div
            className="fade-in"
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* fixed results header */}
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    Results for {fundName}
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}
                  >
                    {strategy} · {sectors.join(", ")} · {geography} · $
                    {checkMin}-{checkMax}M
                    {" · "}
                    {demoUniverseCount} ranked fits
                  </div>
                </div>
                <Btn variant="secondary" size="sm" onClick={reset}>
                  ← Edit & Re-run
                </Btn>
              </div>

              <div
                className="dashboard-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  { l: "Fits Scored", n: demoUniverseCount, c: C.accent },
                  { l: "Strong Fit", n: strongCount, c: C.green },
                  { l: "Partial Fit", n: partialCount, c: C.amber },
                  { l: "Low Fit", n: lowCount, c: C.red },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: C.bg,
                      border: `1px solid ${C.borderSubtle}`,
                    }}
                  >
                    <Mono size={20} weight={700} color={s.c}>
                      {s.n}
                    </Mono>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: C.textMuted,
                        marginTop: 2,
                        fontWeight: 550,
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* scrollable table */}
            <div
              style={{
                height: 390,
                minHeight: 260,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.1fr 1fr .8fr 1.35fr .65fr",
                  padding: "8px 16px",
                  background: C.raised,
                  fontSize: 9.5,
                  fontWeight: 750,
                  color: C.textMuted,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                <span>LP</span>
                <span>Type</span>
                <span>Check Range</span>
                <span>Match Factors</span>
                <span>Score</span>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  background: C.card,
                }}
              >
                {results.map((r, i) => {
                  const sc = getScoreColor(r.score);
                  const positiveReasons = r.reasons.filter((x) => x.ok);
                  const negativeReasons = r.reasons.filter((x) => !x.ok);

                  return (
                    <div
                      key={r.lp.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2.1fr 1fr .8fr 1.35fr .65fr",
                        padding: "10px 16px",
                        borderTop: `1px solid ${C.borderSubtle}`,
                        alignItems: "center",
                        fontSize: 12.5,
                        animation: `popIn .25s cubic-bezier(.22,1,.36,1) ${
                          Math.min(i, 18) * 0.03
                        }s both`,
                        transition:
                          "background .15s ease, box-shadow .15s ease",
                        cursor: "default",
                        borderLeft: "3px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.cardHover;
                        e.currentTarget.style.borderLeftColor = C.accent + "80";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `linear-gradient(135deg, ${sc}18, ${sc}08)`,
                            border: `1px solid ${sc}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{ fontSize: 10, fontWeight: 800, color: sc }}
                          >
                            {getInitials(r.lp.name)}
                          </span>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 640,
                              fontSize: 12.5,
                              lineHeight: 1.2,
                            }}
                          >
                            {r.lp.name}
                          </div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>
                            {r.lp.aum}
                          </div>
                        </div>
                      </div>

                      <span style={{ color: C.textSoft, fontSize: 11.5 }}>
                        {r.lp.type}
                      </span>

                      <Mono size={11} weight={600} color={C.textSoft}>
                        ${r.lp.checkMin}-{r.lp.checkMax}M
                      </Mono>

                      <div
                        style={{ display: "flex", gap: 3, flexWrap: "wrap" }}
                      >
                        {positiveReasons.map((reason, j) => (
                          <span
                            key={j}
                            style={{
                              padding: "1px 6px",
                              borderRadius: 3,
                              fontSize: 9,
                              fontWeight: 650,
                              background: C.greenWash,
                              color: C.green,
                              border: `1px solid ${C.green}18`,
                            }}
                          >
                            ✓ {reason.label}
                          </span>
                        ))}
                        {negativeReasons.map((reason, j) => (
                          <span
                            key={j}
                            style={{
                              padding: "1px 6px",
                              borderRadius: 3,
                              fontSize: 9,
                              fontWeight: 650,
                              background: C.redWash,
                              color: C.red,
                              border: `1px solid ${C.red}18`,
                            }}
                          >
                            ✗ {reason.label}
                          </span>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 5,
                            borderRadius: 99,
                            background: C.borderSubtle,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${r.score}%`,
                              height: "100%",
                              borderRadius: 99,
                              background: `linear-gradient(90deg, ${sc}cc, ${sc})`,
                              boxShadow: `0 0 6px ${sc}50`,
                              transition: "width .6s cubic-bezier(.22,1,.36,1)",
                            }}
                          />
                        </div>
                        <Mono size={12} weight={780} color={sc}>
                          {r.score}
                        </Mono>
                      </div>
                    </div>
                  );
                })}

                {results.length === 0 && (
                  <div style={{ textAlign: "center", padding: "44px 0" }}>
                    <div
                      style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}
                    >
                      ∅
                    </div>
                    <div
                      style={{ fontSize: 15, fontWeight: 650, marginBottom: 6 }}
                    >
                      No matching LPs found
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: C.textSoft,
                        marginBottom: 16,
                      }}
                    >
                      Try broadening your sectors or geography.
                    </div>
                    <Btn variant="secondary" size="sm" onClick={reset}>
                      Edit Profile
                    </Btn>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoReveal({ guidedStep = -1 }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [hoveredChoice, setHoveredChoice] = useState(null);

  const reset = () => {
    setStep(0);
    setChoice(null);
    setHoveredChoice(null);
  };

  const steps = [
    "GP Requests Access",
    "LP Reviews Match",
    "LP Controls Disclosure",
  ];
  const actors = ["GP", "LP", "LP"];

  useEffect(() => {
    if (guidedStep < 3) return;
    if (guidedStep === 3) {
      setStep(0);
      setChoice(null);
      return;
    }
    if (guidedStep === 4) {
      setStep(2);
      setChoice(null);
      return;
    }
    setStep(2);
    setChoice("reveal");
  }, [guidedStep]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 720 }}>Permissioned Reveal</h3>
        <Pill color={C.teal}>Privacy Layer</Pill>
      </div>

      <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 12 }}>
        LPs stay anonymous until they decide to engage. GPs only see qualified
        matches, not a blind directory.
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {[
          "Protect allocator identity",
          "Reduce low-fit outreach",
          "Control disclosure timing",
          "Increase qualified introductions",
        ].map((x) => (
          <div
            key={x}
            style={{
              fontSize: 11,
              color: C.textSoft,
              padding: "6px 10px",
              borderRadius: 999,
              background: C.bg,
              border: `1px solid ${C.borderSubtle}`,
              lineHeight: 1.2,
            }}
          >
            {x}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ flex: 1, display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i <= step ? C.accent : C.bg,
                  border: `2px solid ${i <= step ? C.accent : C.border}`,
                  fontSize: 11,
                  fontWeight: 750,
                  color: i <= step ? C.white : C.textMuted,
                  transition: "all .3s",
                  boxShadow: i <= step ? `0 0 0 5px ${C.accent}12` : "none",
                }}
              >
                {i + 1}
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: i <= step ? C.text : C.textMuted,
                  marginTop: 6,
                  textAlign: "center",
                  maxWidth: 120,
                  lineHeight: 1.25,
                }}
              >
                {s}
              </div>

              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: i <= step ? C.accent : C.textMuted,
                  marginTop: 1,
                  letterSpacing: 0.45,
                }}
              >
                {actors[i]}
              </div>
            </div>

            {i < 2 && (
              <div
                style={{
                  flex: "0 0 48px",
                  height: 2,
                  background: i < step ? C.accent : C.border,
                  transition: "all .3s",
                  margin: "0 -8px",
                  marginBottom: 24,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <Card
        style={{
          background: C.raised,
          padding: 18,
          minHeight: 330,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div style={{ width: "100%" }}>
          {step === 0 && (
            <div className="fade-in">
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: "#8b6cf0",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                GP Action
              </div>

              <div style={{ fontWeight: 660, fontSize: 15, marginBottom: 6 }}>
                Request Access to a High-Fit LP
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.55,
                  marginBottom: 14,
                  maxWidth: 560,
                }}
              >
                Meridian Ventures sees a qualified LP match and requests access
                through a controlled workflow rather than guessing who to email.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 10,
                  padding: 12,
                  borderRadius: 10,
                  background: C.bg,
                  border: `1px solid ${C.borderSubtle}`,
                  marginBottom: 10,
                }}
              >
                {[
                  { k: "Fit", v: "94" },
                  { k: "Type", v: "Endowment" },
                  { k: "Mandate", v: "Active" },
                  { k: "Identity", v: "Protected" },
                ].map((d) => (
                  <div key={d.k}>
                    <div
                      style={{
                        fontSize: 9,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 2,
                      }}
                    >
                      {d.k}
                    </div>
                    <Mono size={12} weight={600}>
                      {d.v}
                    </Mono>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.borderSubtle}`,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.accent,
                    textTransform: "uppercase",
                    letterSpacing: 0.08,
                    marginBottom: 4,
                  }}
                >
                  Why this matters
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSoft,
                    lineHeight: 1.55,
                  }}
                >
                  GPs spend less time chasing cold intros and more time engaging
                  LPs that are actually in mandate.
                </div>
              </div>

              <Btn variant="primary" onClick={() => setStep(1)}>
                Request Access
              </Btn>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.green,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                LP Review
              </div>

              <div style={{ fontWeight: 660, fontSize: 15, marginBottom: 6 }}>
                Review Without Revealing Identity
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.55,
                  marginBottom: 14,
                  maxWidth: 560,
                }}
              >
                Pacific Endowment reviews the GP profile, fund data, and fit
                context while remaining fully protected.
              </p>

              <div
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: C.bg,
                  border: `1px solid ${C.borderSubtle}`,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    gap: 12,
                  }}
                >
                  <span style={{ fontWeight: 650, fontSize: 13.5 }}>
                    Meridian Ventures Fund III
                  </span>
                  <Pill color={C.green}>94 — Strong Fit</Pill>
                </div>

                <div
                  className="product-modules-stats"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {[
                    { k: "Strategy", v: "VC" },
                    { k: "Size", v: "$150M" },
                    { k: "MOIC", v: "2.1x" },
                    { k: "IRR", v: "28.4%" },
                    { k: "Team", v: "4" },
                    { k: "Gen", v: "III" },
                  ].map((d) => (
                    <div key={d.k}>
                      <div
                        style={{
                          fontSize: 9,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 2,
                        }}
                      >
                        {d.k}
                      </div>
                      <Mono size={11.5} weight={500}>
                        {d.v}
                      </Mono>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.borderSubtle}`,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.green,
                    textTransform: "uppercase",
                    letterSpacing: 0.08,
                    marginBottom: 4,
                  }}
                >
                  Why this matters
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSoft,
                    lineHeight: 1.55,
                  }}
                >
                  LPs can review serious opportunities without opening the
                  floodgates to unsolicited outreach.
                </div>
              </div>

              <Btn variant="primary" onClick={() => setStep(2)}>
                Proceed to Decision
              </Btn>
            </div>
          )}

          {step === 2 && !choice && (
            <div className="fade-in">
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 750,
                  color: C.green,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                LP Decision
              </div>

              <div style={{ fontWeight: 660, fontSize: 15, marginBottom: 6 }}>
                Control the Next Step
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.55,
                  marginBottom: 14,
                  maxWidth: 560,
                }}
              >
                The LP can open a direct channel, request more materials, or
                decline while staying protected.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {[
                  {
                    id: "reveal",
                    t: "Open Direct Channel",
                    d: "Reveal identity and start a qualified introduction.",
                    c: C.green,
                  },
                  {
                    id: "info",
                    t: "Request More Materials",
                    d: "Ask for more information before disclosing identity.",
                    c: C.amber,
                  },
                  {
                    id: "anon",
                    t: "Decline Securely",
                    d: "Pass without sharing identifying information.",
                    c: C.textMuted,
                  },
                ].map((o) => {
                  const isHovered = hoveredChoice === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => setChoice(o.id)}
                      onMouseEnter={() => setHoveredChoice(o.id)}
                      onMouseLeave={() => setHoveredChoice(null)}
                      style={{
                        padding: 14,
                        borderRadius: 11,
                        background: isHovered ? o.c + "08" : C.bg,
                        border: `1px solid ${isHovered ? o.c : C.border}`,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all .18s ease",
                        transform: isHovered
                          ? "translateY(-2px)"
                          : "translateY(0)",
                        boxShadow: isHovered ? `0 10px 24px ${o.c}12` : "none",
                        minHeight: 112,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 650,
                          fontSize: 13,
                          marginBottom: 5,
                          color: o.c,
                          lineHeight: 1.3,
                        }}
                      >
                        {o.t}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: C.textSoft,
                          lineHeight: 1.45,
                        }}
                      >
                        {o.d}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {choice === "reveal" && (
            <div
              className="fade-in"
              style={{
                padding: 18,
                borderRadius: 12,
                background: C.greenWash,
                border: `1px solid ${C.greenBorder}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="9" fill={C.green} />
                  <path
                    d="M5 9l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontWeight: 720, color: C.green, fontSize: 14 }}>
                  Direct Channel Opened
                </span>
              </div>

              <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
                <strong style={{ color: C.text }}>Pacific Endowment</strong> has
                chosen to engage with{" "}
                <strong style={{ color: C.text }}>Meridian Ventures</strong>.
                Identity is revealed only after intent is confirmed.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                {[
                  ["Pipeline", "Introduced"],
                  ["Intro Room", "Open"],
                  ["Next Step", "LP call"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: "10px 11px",
                      borderRadius: 10,
                      background: "rgba(5,8,16,0.34)",
                      border: `1px solid ${C.green}22`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <Mono size={12} weight={780} color={C.green}>
                      {value}
                    </Mono>
                  </div>
                ))}
              </div>

              <Btn variant="ghost" onClick={reset} style={{ marginTop: 12 }}>
                Reset Demo
              </Btn>
            </div>
          )}

          {choice === "info" && (
            <div
              className="fade-in"
              style={{
                padding: 18,
                borderRadius: 12,
                background: C.amberWash,
                border: `1px solid ${C.amberBorder}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="9" fill={C.amber} />
                  <path
                    d="M9 5.5v4M9 11.5v.5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ fontWeight: 720, color: C.amber, fontSize: 14 }}>
                  More Materials Requested
                </span>
              </div>

              <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
                The LP requests further diligence before opening a direct
                channel. The GP can respond while the allocator remains
                protected.
              </p>

              <Btn variant="ghost" onClick={reset} style={{ marginTop: 12 }}>
                Reset Demo
              </Btn>
            </div>
          )}

          {choice === "anon" && (
            <div
              className="fade-in"
              style={{
                padding: 18,
                borderRadius: 12,
                background: C.surface,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="9" fill={C.textMuted} />
                  <path
                    d="M6.5 6.5l5 5M11.5 6.5l-5 5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  style={{ fontWeight: 720, color: C.textSoft, fontSize: 14 }}
                >
                  Request Declined Securely
                </span>
              </div>

              <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
                The LP declined the request. No identifying information was
                shared, and the workflow closes cleanly.
              </p>

              <Btn variant="ghost" onClick={reset} style={{ marginTop: 12 }}>
                Reset Demo
              </Btn>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════
   MOCK DASHBOARDS
   ════════════════════════════════════════════ */
const DASHBOARD_VIEW_CONFIG = {
  lp: {
    id: "lp",
    tabLabel: "LP Dashboard",
    shellLabel: "LP Portal",
    color: C.green,
    badge: "For LP teams",
    title: "Screen managers with more control and less noise",
    summary:
      "LPs need a calm triage workflow: see fit, verify diligence, and decide when a GP has earned access.",
    bullets: [
      {
        label: "Mandate-first triage",
        text: "Rank inbound GPs against strategy, check size, geography, and real exclusions before anyone books a meeting.",
      },
      {
        label: "Blind reveal control",
        text: "Keep the LP identity masked until a manager clears your threshold and the opportunity is worth pursuing.",
      },
      {
        label: "Explainable diligence",
        text: "See why the score exists, what changed, and which diligence items are still missing before moving forward.",
      },
    ],
    chips: ["Blind review", "Mandate filters", "Approval-ready notes"],
    stageTitle: "LP workflow preview",
    stageSummary:
      "The LP side is optimized for evaluating inbound managers, protecting anonymity, and standardizing who gets through.",
    floatingNotes: [
      "Reveal only after fit and diligence clear the line",
      "Every score comes with reasons your team can defend",
    ],
    details: [
      {
        label: "Primary job",
        value: "Triage inbound funds against mandate rules",
      },
      {
        label: "Decision surface",
        value: "Reveal, hold, decline, or request more diligence",
      },
      {
        label: "Why it feels different",
        value: "The workflow protects attention and consistency, not just data visibility.",
      },
    ],
    metrics: [
      { label: "Review style", value: "Blind by default" },
      { label: "Decision basis", value: "Fit + diligence" },
      { label: "Team benefit", value: "Consistent screening" },
    ],
  },
  gp: {
    id: "gp",
    tabLabel: "GP Dashboard",
    shellLabel: "GP Portal",
    color: "#8b6cf0",
    badge: "For GPs",
    title: "Target the right LPs instead of guessing who might fit",
    summary:
      "GPs need an outbound workflow: find aligned LPs fast, understand why they match, and spend time where the odds are real.",
    bullets: [
      {
        label: "Live LP targeting",
        text: "Map your fund against active LP mandates and stop relying on stale notes, generic CRM tags, or memory.",
      },
      {
        label: "Reasoned match scores",
        text: "See which LPs are strong, partial, or weak fits and what specifically is driving that result.",
      },
      {
        label: "Sharper fundraising motion",
        text: "Prioritize outreach with context on strategy overlap, check size alignment, and current deployment behavior.",
      },
    ],
    chips: ["Live LP universe", "Prioritized pipeline", "Why-this-fits signals"],
    stageTitle: "GP workflow preview",
    stageSummary:
      "The GP side is optimized for targeting, sequencing outreach, and knowing which LPs deserve immediate attention.",
    floatingNotes: [
      "See the best-fit LPs first instead of working a cold list",
      "Every match explains what lines up before you reach out",
    ],
    details: [
      {
        label: "Primary job",
        value: "Find and prioritize the best LPs for this fundraise",
      },
      {
        label: "Decision surface",
        value: "Focus outreach where fit is strongest and most actionable",
      },
      {
        label: "Why it feels different",
        value: "The workflow creates fundraising momentum instead of another passive database.",
      },
    ],
    metrics: [
      { label: "Search style", value: "Targeted by fit" },
      { label: "Next step", value: "Prioritized outreach" },
      { label: "Team benefit", value: "Less wasted effort" },
    ],
  },
};

function DashboardSideCard({ view, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        textAlign: "left",
        width: "100%",
        borderRadius: 22,
        padding: 22,
        cursor: "pointer",
        border: `1px solid ${active ? view.color + "44" : C.border}`,
        background: `linear-gradient(165deg, ${
          active ? view.color + "14" : C.surface
        }, ${C.card} 42%, ${C.black})`,
        boxShadow: active
          ? `0 18px 40px rgba(0,0,0,.34), 0 0 0 1px ${view.color}18 inset, 0 0 40px ${view.color}10`
          : "0 12px 28px rgba(0,0,0,.2)",
        color: C.text,
        transition:
          "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = view.color + "55";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = active ? view.color + "44" : C.border;
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: view.color + "14",
              border: `1px solid ${view.color}26`,
              color: view.color,
              fontSize: 10.5,
              fontWeight: 750,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <Dot color={view.color} size={6} pulse={active} />
            {view.badge}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 780,
              lineHeight: 1.15,
              letterSpacing: 0,
              marginBottom: 10,
              maxWidth: 420,
            }}
          >
            {view.title}
          </div>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.7,
              color: active ? C.textSoft : C.textMuted,
              maxWidth: 500,
            }}
          >
            {view.summary}
          </p>
        </div>
        <div
          style={{
            flexShrink: 0,
            padding: "7px 10px",
            borderRadius: 999,
            border: `1px solid ${active ? view.color + "30" : C.borderSubtle}`,
            background: active ? view.color + "12" : C.raised,
            color: active ? view.color : C.textMuted,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {active ? "Showing preview" : "Preview this side"}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {view.bullets.map((item) => (
          <div
            key={item.label}
            style={{
              display: "grid",
              gridTemplateColumns: "20px minmax(0,1fr)",
              gap: 10,
              alignItems: "start",
              padding: "10px 0",
              borderTop: `1px solid ${C.borderSubtle}`,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: view.color + "16",
                border: `1px solid ${view.color}26`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: view.color,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 760,
                  color: C.text,
                  marginBottom: 3,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: C.textSoft,
                }}
              >
                {item.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {view.chips.map((chip) => (
          <span
            key={chip}
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              background: C.raised,
              border: `1px solid ${C.borderSubtle}`,
              fontSize: 11.5,
              fontWeight: 650,
              color: active ? C.text : C.textSoft,
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    </button>
  );
}

function DashboardSideRail({ view }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          borderRadius: 22,
          border: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, ${C.surface}, ${C.card})`,
          padding: 18,
          boxShadow: "0 18px 40px rgba(0,0,0,.26)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 760,
            letterSpacing: 0.9,
            textTransform: "uppercase",
            color: view.color,
            marginBottom: 14,
          }}
        >
          How this side is different
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {view.details.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "12px 0",
                borderTop: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 760,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: C.textMuted,
                  marginBottom: 5,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: C.text,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          borderRadius: 22,
          border: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, ${view.color}10, ${C.card})`,
          padding: 18,
          boxShadow: "0 18px 40px rgba(0,0,0,.22)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 760,
            letterSpacing: 0.9,
            textTransform: "uppercase",
            color: C.textSoft,
            marginBottom: 14,
          }}
        >
          What improves for this user
        </div>
        <div className="dashboard-metric-grid">
          {view.metrics.map((item) => (
            <div
              key={item.label}
              style={{
                padding: 14,
                borderRadius: 16,
                border: `1px solid ${C.borderSubtle}`,
                background: C.raised,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 760,
                  letterSpacing: 0.7,
                  textTransform: "uppercase",
                  color: C.textMuted,
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 760,
                  lineHeight: 1.35,
                  color: view.color,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboards() {
  const [v, setV] = useState("lp");
  const activeView = DASHBOARD_VIEW_CONFIG[v];

  return (
    <section
      style={{ padding: "50px 0", position: "relative", background: C.black }}
    >
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "28%",
          width: 680,
          height: 460,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${activeView.color}10, transparent 68%)`,
          filter: "blur(110px)",
          transition: "all 1s ease",
          opacity: 1,
          pointerEvents: "none",
        }}
      />
      <Wrap style={{ position: "relative" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                background: "#8b6cf0",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: "#8b6cf0",
              }}
            >
              
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: "clamp(25px,3.1vw,38px)",
                fontWeight: 780,
                lineHeight: 1.08,
                letterSpacing: -0.8,
                marginBottom: 12,
                maxWidth: 820,
              }}
            >
              
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.textSoft,
                lineHeight: 1.75,
                maxWidth: 760,
              }}
            >
              
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="dashboard-side-grid" style={{ marginBottom: 24 }}>
            {Object.values(DASHBOARD_VIEW_CONFIG).map((view) => (
              <DashboardSideCard
                key={view.id}
                view={view}
                active={v === view.id}
                onClick={() => setV(view.id)}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="dashboard-stage-grid">
            <div className="dashboard-stage-frame">
              <div
                style={{
                  position: "absolute",
                  inset: 24,
                  borderRadius: 30,
                  background: `radial-gradient(circle at top right, ${activeView.color}18, transparent 46%)`,
                  filter: "blur(18px)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="dashboard-floating-note"
                style={{
                  position: "absolute",
                  top: 22,
                  right: 20,
                  zIndex: 3,
                  maxWidth: 230,
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: `1px solid ${activeView.color}30`,
                  background: `${C.black}dd`,
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 18px 36px rgba(0,0,0,.38), 0 0 0 1px ${activeView.color}10 inset`,
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 760,
                    letterSpacing: 0.7,
                    textTransform: "uppercase",
                    color: activeView.color,
                    marginBottom: 6,
                  }}
                >
                  Product difference
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: C.text }}>
                  {activeView.floatingNotes[0]}
                </div>
              </div>
              <div
                className="dashboard-floating-note"
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 18,
                  zIndex: 3,
                  maxWidth: 220,
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: `1px solid ${C.border}`,
                  background: `${C.surface}dd`,
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 16px 32px rgba(0,0,0,.32)",
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 760,
                    letterSpacing: 0.7,
                    textTransform: "uppercase",
                    color: C.textMuted,
                    marginBottom: 6,
                  }}
                >
                  Why users notice it
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: C.textSoft,
                  }}
                >
                  {activeView.floatingNotes[1]}
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  padding: 1,
                  borderRadius: 30,
                  background: `linear-gradient(145deg, ${activeView.color}55, ${C.border} 38%, ${C.borderSubtle})`,
                  boxShadow: `0 34px 110px rgba(0,0,0,.52), 0 0 70px ${activeView.color}10`,
                }}
              >
                <div
                  style={{
                    borderRadius: 29,
                    overflow: "hidden",
                    background: `linear-gradient(180deg, ${C.black}, ${C.card})`,
                  }}
                >
                  <div
                    style={{
                      padding: "18px 22px",
                      borderBottom: `1px solid ${C.border}`,
                      background: `linear-gradient(180deg, ${C.raised}, ${C.card})`,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: activeView.color + "12",
                          border: `1px solid ${activeView.color}26`,
                          color: activeView.color,
                          fontSize: 10.5,
                          fontWeight: 760,
                          letterSpacing: 0.7,
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        <Dot color={activeView.color} size={6} pulse />
                        {activeView.stageTitle}
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 780,
                          letterSpacing: -0.55,
                          lineHeight: 1.1,
                          marginBottom: 8,
                        }}
                      >
                        {activeView.title}
                      </div>
                      <div
                        style={{
                          fontSize: 14.5,
                          color: C.textSoft,
                          lineHeight: 1.7,
                          maxWidth: 640,
                        }}
                      >
                        {activeView.stageSummary}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {activeView.chips.map((chip) => (
                        <span
                          key={chip}
                          style={{
                            padding: "8px 11px",
                            borderRadius: 999,
                            background: C.raised,
                            border: `1px solid ${C.borderSubtle}`,
                            fontSize: 11.5,
                            fontWeight: 650,
                            color: C.textSoft,
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 22,
                      background: `radial-gradient(circle at top right, ${activeView.color}12, transparent 28%), linear-gradient(180deg, ${C.card}, ${C.black})`,
                    }}
                    key={v}
                  >
                    <div
                      className="dashboard-preview-shell"
                      style={{
                        borderRadius: 24,
                        overflow: "hidden",
                        border: `1px solid ${activeView.color}20`,
                        boxShadow: `0 24px 60px rgba(0,0,0,.45), 0 0 0 1px ${activeView.color}12 inset`,
                        background: C.black,
                      }}
                    >
                      <DashBar label={activeView.shellLabel} />
                      <div
                        style={{
                          padding: 22,
                          background: `linear-gradient(180deg, ${C.card}, ${C.black})`,
                        }}
                        className="fade-in"
                      >
                        {v === "lp" ? <LPDash /> : <GPDash />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DashboardSideRail view={activeView} />
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

function DashBar({ label }) {
  return (
    <div
      style={{
        padding: "9px 18px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: C.raised,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <LogoMark size={20} />
        <span style={{ fontWeight: 650, fontSize: 12.5 }}>MandateOS</span>
        <span
          style={{
            fontSize: 10,
            color: C.textMuted,
            padding: "2px 7px",
            background: C.bg,
            borderRadius: 4,
            fontWeight: 650,
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="12" cy="4" r="2.5" fill={C.accent} />
          <path
            d="M1.5 3h6M1.5 7.5h11M1.5 12h11"
            stroke={C.textMuted}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: C.accent + "28",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 750, color: C.accent }}>
            PE
          </span>
        </div>
      </div>
    </div>
  );
}

function LPDash() {
  const { lps: lpDb } = useLPs();
  const [filter, setFilter] = useState("all");
  const [selectedGP, setSelectedGP] = useState(null);
  const gpProfile = {
    strategy: "Venture Capital",
    sectors: ["Technology", "Healthcare"],
    geography: "North America",
    checkMin: 5,
    checkMax: 25,
  };
  const allResults = runFitEngine(gpProfile, lpDb);
  const filtered =
    filter === "all"
      ? allResults
      : filter === "strong"
      ? allResults.filter((r) => r.score >= 75)
      : filter === "partial"
      ? allResults.filter((r) => r.score >= 45 && r.score < 75)
      : allResults.filter((r) => r.score < 45);
  const strongCount = allResults.filter((r) => r.score >= 75).length;
  const partialCount = allResults.filter(
    (r) => r.score >= 45 && r.score < 75
  ).length;

  return (
    <>
      <div
        className="dashboard-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <StatBox label="Pending" value="12" color={C.accent} />
        <StatBox
          label="Strong Fits"
          value={String(strongCount)}
          color={C.green}
        />
        <StatBox label="Revealed" value="8" color="#8b6cf0" />
        <StatBox label="Declined" value="23" color={C.textMuted} />
      </div>
      <div
        style={{
          padding: 14,
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.borderSubtle}`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 750,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Active Mandate
          </span>
          <Pill color={C.green}>Published</Pill>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[
            { k: "Strategy", v: "VC, Growth" },
            { k: "Check", v: "$5-25M" },
            { k: "Geo", v: "N. America" },
            { k: "Exclusions", v: "3" },
            { k: "Diligence", v: "DDQ + Audit" },
          ].map((d) => (
            <div key={d.k}>
              <div
                style={{
                  fontSize: 9.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {d.k}
              </div>
              <Mono size={12} weight={500}>
                {d.v}
              </Mono>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 750,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          GP Pipeline — {filtered.length} matches
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "all", label: "All" },
            { id: "strong", label: "Strong" },
            { id: "partial", label: "Partial" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 650,
                border: `1px solid ${filter === f.id ? C.accent : C.border}`,
                background: filter === f.id ? C.accentWash : "transparent",
                color: filter === f.id ? C.accentBright : C.textSoft,
                cursor: "pointer",
                transition: "all .12s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* GP Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 10,
        }}
      >
        {GP_DATABASE.slice(0, 6).map((gp, i) => {
          const sc = gp.deploying ? C.green : C.textMuted;
          return (
            <div
              key={gp.id}
              onClick={() => setSelectedGP(gp)}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "all .25s cubic-bezier(.22,1,.36,1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.borderHover;
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: `1px solid ${C.borderSubtle}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: `linear-gradient(135deg, #8b6cf022, #8b6cf00a)`,
                      border: "1px solid #8b6cf030",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#a78bfa",
                      }}
                    >
                      {getInitials(gp.name)}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 660,
                        fontSize: 13.5,
                        lineHeight: 1.2,
                      }}
                    >
                      {gp.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textSoft, marginTop: 2 }}
                    >
                      {gp.strategy} · {gp.fundSize}
                    </div>
                  </div>
                </div>
                {gp.deploying && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Dot color={C.green} size={5} pulse />
                    <span
                      style={{ fontSize: 9, fontWeight: 700, color: C.green }}
                    >
                      Active
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 16px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    marginBottom: 8,
                  }}
                >
                  {gp.sectors.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 9.5,
                        fontWeight: 650,
                        background: C.accentWash,
                        color: C.accentBright,
                        border: `1px solid ${C.accent}20`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Check
                    </div>
                    <Mono size={11} weight={600}>
                      {gp.checkSize}
                    </Mono>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      MOIC
                    </div>
                    <Mono size={11} weight={600} color={C.green}>
                      {gp.moic}
                    </Mono>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      IRR
                    </div>
                    <Mono size={11} weight={600} color={C.green}>
                      {gp.irr}
                    </Mono>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Stage
                    </div>
                    <Mono size={11} weight={600}>
                      {gp.stage}
                    </Mono>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GP Profile Modal */}
      {selectedGP && (
        <GPProfileModal gp={selectedGP} onClose={() => setSelectedGP(null)} />
      )}
    </>
  );
}

function GPDash() {
  const { lps: lpDb } = useLPs();
  const gpProfile = {
    strategy: "Venture Capital",
    sectors: ["Technology", "Healthcare"],
    geography: "North America",
    checkMin: 5,
    checkMax: 25,
  };
  const allResults = runFitEngine(gpProfile, lpDb);
  const strongCount = allResults.filter((r) => r.score >= 75).length;

  return (
    <>
      <div
        className="dashboard-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <StatBox
          label="LP Matches"
          value={String(allResults.length)}
          color={C.accent}
        />
        <StatBox label="Requests Sent" value="14" color="#8b6cf0" />
        <StatBox label="Connected" value="8" color={C.green} />
        <StatBox
          label="Avg Score"
          value={String(
            Math.round(
              allResults.reduce((a, b) => a + b.score, 0) / allResults.length
            )
          )}
          color={C.amber}
        />
      </div>
      <div
        style={{
          padding: 14,
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.borderSubtle}`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 650, fontSize: 14 }}>
              Meridian Ventures Fund III
            </div>
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 1 }}>
              Venture Capital / North America
            </div>
          </div>
          <Pill color={C.green}>Active</Pill>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[
            { k: "Target", v: "$150M" },
            { k: "MOIC", v: "2.1x" },
            { k: "IRR", v: "28.4%" },
            { k: "Team", v: "4" },
            { k: "Gen", v: "III" },
          ].map((d) => (
            <div key={d.k}>
              <div
                style={{
                  fontSize: 9.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {d.k}
              </div>
              <Mono size={12} weight={500}>
                {d.v}
              </Mono>
            </div>
          ))}
        </div>
      </div>

      {/* LP Cards Grid */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 750,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>LP Pipeline — Top {Math.min(allResults.length, 8)} Matches</span>
        <span style={{ fontWeight: 600, fontSize: 10, color: C.green }}>
          {strongCount} strong fits
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 10,
        }}
      >
        {allResults.slice(0, 8).map((r, i) => {
          const sc = getScoreColor(r.score);
          const isAnonymous = r.score < 80;
          const displayName = isAnonymous
            ? `Anonymous LP #${1000 + r.lp.id * 317}`
            : r.lp.name;
          return (
            <div
              key={r.lp.id}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "all .25s cubic-bezier(.22,1,.36,1)",
                cursor: "pointer",
                animation: `popIn .3s cubic-bezier(.22,1,.36,1) ${
                  i * 0.04
                }s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = sc + "55";
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,.3), 0 0 0 1px ${sc}15`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: `1px solid ${C.borderSubtle}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: `linear-gradient(135deg, ${sc}22, ${sc}0a)`,
                      border: `1px solid ${sc}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: sc }}>
                      {isAnonymous ? "?" : getInitials(r.lp.name)}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 660,
                        fontSize: 13.5,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textSoft, marginTop: 2 }}
                    >
                      {r.lp.type} · {r.lp.aum}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: sc + "18",
                    border: `1px solid ${sc}30`,
                    borderRadius: 7,
                    padding: "3px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <Mono size={14} weight={700} color={sc}>
                    {r.score}
                  </Mono>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: "10px 16px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    marginBottom: 8,
                  }}
                >
                  {r.lp.strategies.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 9.5,
                        fontWeight: 650,
                        background: "#8b6cf018",
                        color: "#a78bfa",
                        border: "1px solid #8b6cf020",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  {r.lp.geographies.slice(0, 1).map((g) => (
                    <span
                      key={g}
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 9.5,
                        fontWeight: 650,
                        background: C.tealWash,
                        color: C.teal,
                        border: `1px solid ${C.teal}20`,
                      }}
                    >
                      {g}
                    </span>
                  ))}
                  {r.lp.deploying && (
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 9.5,
                        fontWeight: 650,
                        background: C.greenWash,
                        color: C.green,
                        border: `1px solid ${C.green}20`,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Dot color={C.green} size={4} pulse /> Deploying
                    </span>
                  )}
                </div>
                {/* Why match — top 2 reasons */}
                <div style={{ marginBottom: 6 }}>
                  {r.reasons
                    .filter((x) => x.ok)
                    .slice(0, 2)
                    .map((reason, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "2px 0",
                          fontSize: 11,
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 9 9">
                          <path
                            d="M1.5 4.5l2 2 4-4"
                            stroke={C.green}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <span style={{ color: C.textSoft, fontSize: 10.5 }}>
                          {reason.text}
                        </span>
                      </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Check
                    </div>
                    <Mono size={11} weight={600}>
                      ${r.lp.checkMin}-{r.lp.checkMax}M
                    </Mono>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 8.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Sectors
                    </div>
                    <Mono size={11} weight={600}>
                      {r.lp.sectors.length}
                    </Mono>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS — EDITORIAL GRADE
   ════════════════════════════════════════════ */
function Testimonials() {
  const [active, setActive] = useState(0);
  const quotes = [
    {
      q: "MandateOS surfaced 3 emerging managers we never would have found through our existing network. Two are now in our portfolio.",
      name: "Sarah Chen",
      role: "Head of Alternatives",
      org: "Pacific Endowment",
      metric: "3 new managers found",
      metricSub: "2 now in portfolio",
    },
    {
      q: "The mandate-fit engine cut our GP screening time by 70%. We now spend time on diligence, not sourcing.",
      name: "James Whitfield",
      role: "Chief Investment Officer",
      org: "Great Lakes Pension",
      metric: "70% faster",
      metricSub: "GP screening time",
    },
    {
      q: "As a Fund I manager, getting in front of the right allocators was our biggest challenge. MandateOS changed that entirely.",
      name: "Priya Anand",
      role: "Managing Partner",
      org: "Cascade Climate Fund",
      metric: "12 LP intros",
      metricSub: "in first 60 days",
    },
  ];
  const q = quotes[active];

  return (
    <section
      style={{ padding: "50px 0", position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}06, transparent 60%)`,
          filter: "blur(120px)",
        }}
      />
      <Wrap style={{ position: "relative" }}>
        <Reveal>
          <SectionLabel>Testimonials</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <div style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 780,
                lineHeight: 1.12,
                letterSpacing: -0.6,
              }}
            >
              Trusted by institutional capital
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* Featured Quote — Large */}
          <div
            className="testimonial-feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 40,
              alignItems: "center",
              padding: "48px 52px",
              borderRadius: 20,
              background: `linear-gradient(135deg, ${C.card}, ${C.raised})`,
              border: `1px solid ${C.border}`,
              boxShadow: `0 24px 80px rgba(0,0,0,.3), inset 0 1px 0 ${C.border}`,
              marginBottom: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 120,
                height: 3,
                background: `linear-gradient(90deg, ${C.accent}, transparent)`,
                borderRadius: "0 0 4px 0",
              }}
            />

            <div key={active} className="fade-in">
              {/* Large quotation mark */}
              <svg
                width="48"
                height="36"
                viewBox="0 0 48 36"
                style={{ marginBottom: 20, opacity: 0.15 }}
              >
                <path
                  d="M0 24.2C0 14.6 5.6 6.4 14 2l2.8 5C10.4 10.4 7.6 15 7.2 20h6.4c3.2 0 5.6 2.4 5.6 5.6v4.8c0 3.2-2.4 5.6-5.6 5.6H8C3.6 36 0 32.4 0 28v-3.8zM26.4 24.2C26.4 14.6 32 6.4 40.4 2l2.8 5c-6.4 3.4-9.2 8-9.6 13h6.4c3.2 0 5.6 2.4 5.6 5.6v4.8c0 3.2-2.4 5.6-5.6 5.6H34.4C30 36 26.4 32.4 26.4 28v-3.8z"
                  fill={C.accent}
                />
              </svg>

              <p
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: C.text,
                  lineHeight: 1.6,
                  letterSpacing: -0.3,
                  marginBottom: 32,
                  maxWidth: 520,
                }}
              >
                {q.q}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${C.accent}25, ${C.accent}08)`,
                    border: `1px solid ${C.accent}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: C.accentBright,
                    }}
                  >
                    {getInitials(q.name)}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{q.name}</div>
                  <div style={{ fontSize: 13, color: C.textSoft }}>
                    {q.role}
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}
                  >
                    {q.org}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric highlight */}
            <div
              key={"m" + active}
              className="fade-in"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: `conic-gradient(${C.accent} 0deg, ${C.accent}40 120deg, ${C.border}20 120deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 156,
                    height: 156,
                    borderRadius: "50%",
                    background: C.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Mono size={28} weight={800} color={C.accentBright}>
                    {q.metric}
                  </Mono>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {q.metricSub}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote selector */}
          <div
            className="quote-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {quotes.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    background: isActive ? C.surface : "transparent",
                    border: `1px solid ${
                      isActive ? C.accent + "40" : C.border
                    }`,
                    transition: "all .2s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: C.accent,
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: isActive ? C.accentWash : C.bg,
                        border: `1px solid ${
                          isActive ? C.accent + "30" : C.borderSubtle
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: isActive ? C.accentBright : C.textMuted,
                        }}
                      >
                        {getInitials(item.name)}
                      </span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 660,
                          fontSize: 13,
                          color: isActive ? C.text : C.textSoft,
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {item.org}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.q}
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Define Your Mandate",
      d: "LPs set structured allocation criteria — strategy, geography, check size, exclusions. GPs build standardized profiles.",
      c: C.green,
    },
    {
      n: "02",
      t: "Run Mandate-Fit",
      d: "The engine scores every GP against every active mandate. Multi-factor, transparent, instant.",
      c: C.accent,
    },
    {
      n: "03",
      t: "Review & Connect",
      d: "LPs review matched profiles anonymously. GPs request introductions. Both sides control the process.",
      c: "#8b6cf0",
    },
  ];
  return (
    <section
      style={{
        padding: "48px 0",
        background: `linear-gradient(180deg, transparent, ${C.bg}80 20%, ${C.bg}80 80%, transparent)`,
      }}
    >
      <Wrap>
        <Reveal>
          <SectionLabel>Process</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <SectionTitle sub="Three steps from mandate definition to allocator introduction.">
            How it works
          </SectionTitle>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <Card
                hover
                style={{
                  padding: 28,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 50,
                    height: 3,
                    background: s.c,
                    borderRadius: "0 0 4px 0",
                  }}
                />
                <Mono size={32} weight={800} color={s.c + "30"}>
                  {s.n}
                </Mono>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 8,
                    marginTop: 12,
                  }}
                >
                  {s.t}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: C.textSoft,
                    lineHeight: 1.65,
                  }}
                >
                  {s.d}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   SOCIAL PROOF
   ════════════════════════════════════════════ */
function SocialProof() {
  const logos = [
    "Stanford Endowment",
    "CalPERS",
    "Sequoia Capital",
    "a16z",
    "Tiger Global",
    "Bridgewater",
  ];
  return (
    <section style={{ padding: "50px 0 30px" }}>
      <Wrap style={{ textAlign: "center" }}>
        <Reveal>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 22,
            }}
          >
            Trusted by leading institutional allocators
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
              opacity: 0.35,
            }}
          >
            {logos.map((l) => (
              <div
                key={l}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: C.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 10, fontWeight: 800, color: C.textSoft }}
                  >
                    {getInitials(l)}
                  </span>
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: C.textSoft }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRICING
   ════════════════════════════════════════════ */
export function PricingPreview() {
  const [hoverPlan, setHoverPlan] = useState(null);
  return (
    <section style={{ padding: "40px 0" }}>
      <Wrap>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                background: C.accent,
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Pricing
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontSize: "clamp(24px,3vw,36px)",
                fontWeight: 780,
                lineHeight: 1.12,
                letterSpacing: -0.6,
                marginBottom: 12,
              }}
            >
              Built for institutions
            </h2>
            <p
              style={{
                fontSize: 14.5,
                color: C.textSoft,
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              Simple pricing aligned with how institutional capital works. No
              per-seat fees.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            className="pricing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              maxWidth: 1040,
              margin: "0 auto",
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              background: C.border,
            }}
          >
            {/* Pilot */}
            <div
              onMouseEnter={() => setHoverPlan("pilot")}
              onMouseLeave={() => setHoverPlan(null)}
              style={{
                padding: "30px 28px",
                background:
                  hoverPlan === "pilot"
                    ? `linear-gradient(160deg, ${C.accent}0a, ${C.cardHover})`
                    : C.card,
                transition: "all .25s ease",
                position: "relative",
                boxShadow:
                  hoverPlan === "pilot"
                    ? `inset 0 0 40px ${C.accent}06`
                    : "none",
              }}
            >
              <Pill color={C.accent}>Pilot Program</Pill>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  marginTop: 14,
                  marginBottom: 6,
                }}
              >
                Free
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Full access during pilot. No commitment.
              </div>
              {[
                "Unlimited mandate-fit scoring",
                "Full LP/GP matching",
                "Anonymous reveal system",
                "Diligence workflow tools",
                "Priority onboarding",
              ].map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    fontSize: 13,
                    color: C.textSoft,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="7" fill={C.greenWash} />
                    <path
                      d="M4 7l2 2 4-4"
                      stroke={C.green}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            {/* Enterprise */}
            <div
              onMouseEnter={() => setHoverPlan("enterprise")}
              onMouseLeave={() => setHoverPlan(null)}
              style={{
                padding: "30px 28px",
                background: hoverPlan === "enterprise" ? C.cardHover : C.raised,
                transition: "all .25s ease",
                position: "relative",
              }}
            >
              {hoverPlan === "enterprise" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${C.accent}, #8b6cf0)`,
                  }}
                />
              )}
              <Pill color={C.textMuted}>Enterprise</Pill>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  marginTop: 14,
                  marginBottom: 6,
                  color: hoverPlan === "enterprise" ? C.text : C.textSoft,
                }}
              >
                Custom
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.textMuted,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                $1B+ institutions. Custom integration, compliance, SLA.
              </div>
              {[
                "Everything in Pilot",
                "Custom API integrations",
                "Dedicated account manager",
                "SOC 2 Type II compliance",
                "Custom data retention",
              ].map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    fontSize: 13,
                    color: C.textMuted,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="7" fill={C.surface} />
                    <path
                      d="M4 7l2 2 4-4"
                      stroke={
                        hoverPlan === "enterprise" ? C.textSoft : C.textMuted
                      }
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA
   ════════════════════════════════════════════ */
export function CTA({ onOpenDemo, onOpenPilot }) {
  return (
    <section
      style={{
        padding: "44px 0 40px",
        position: "relative",
        overflow: "hidden",
        background: C.black,
      }}
    >
      {/* Multi-layer glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}0c, transparent 55%)`,
          filter: "blur(100px)",
          opacity: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "35%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, #8b6cf006, transparent 55%)`,
          filter: "blur(80px)",
          opacity: 0,
        }}
      />

      <Wrap style={{ position: "relative", textAlign: "center" }}>
        <Reveal delay={60}>
          <h2
            style={{
              fontSize: "clamp(24px,3.4vw,38px)",
              fontWeight: 820,
              lineHeight: 1.06,
              letterSpacing: -1.2,
              marginBottom: 18,
            }}
          >
            Ready to standardize{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.accent}, #8b6cf0, #b794f6)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              capital formation
            </span>
            ?
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p
            style={{
              fontSize: 15.5,
              color: C.textSoft,
              maxWidth: 500,
              margin: "0 auto 32px",
              lineHeight: 1.65,
            }}
          >
            Join the pilot program. Be among the first institutions on
            merit-based fundraising infrastructure.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            <Btn
              variant="primary"
              size="lg"
              onClick={onOpenDemo}
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              Request Demo
            </Btn>
            <Btn
              variant="secondary"
              size="lg"
              onClick={onOpenPilot}
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              Join Pilot Program
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { v: "Free", l: "during pilot" },
              { v: "< 5 min", l: "to set up" },
              { v: "No lock-in", l: "cancel anytime" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <Mono size={18} weight={700}>
                  {s.v}
                </Mono>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    marginTop: 2,
                    fontWeight: 550,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

export function CalBookingModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a demo"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 12000,
        padding: 0,
        background: "#111111",
        display: "block",
        overflow: "hidden",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#111111",
          pointerEvents: "none",
        }}
      />
      <div
        className="modal-panel"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "none",
          maxHeight: "none",
          overflow: "hidden",
          background: "#111111",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          position: "relative",
          zIndex: 1,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "1px solid #2D2D2D",
            background: "#171717",
            color: C.textSoft,
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ padding: 0, height: "100vh", background: "#111111" }}>
          <div
            style={{
              overflow: "hidden",
              borderRadius: 0,
              background: "#111111",
              border: "none",
              height: "100%",
            }}
          >
            <iframe
              className="cal-booking-frame"
              src={CAL_BOOKING_EMBED_URL}
              title="Book a 1:1 Demo With a Founder"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="camera; microphone; fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
export function Footer() {
  const footerColumns = [
    {
      title: "Product",
      items: [
        { label: "Platform", href: "#platform" },
        { label: "Interactive Demo", href: "#demo" },
        { label: "LP / GP Screens", href: "#about" },
        {
          label: "Book a Demo",
          href: CAL_BOOKING_URL,
          external: true,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          label: "About",
          href: "https://www.linkedin.com/company/mandate-os/",
          external: true,
        },
        {
          label: "Careers",
          href: "https://www.linkedin.com/company/mandate-os/",
          external: true,
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/company/mandate-os/",
          external: true,
        },
        {
          label: "Contact",
          href: "https://www.linkedin.com/company/mandate-os/",
          external: true,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Fit Engine", href: "#platform" },
        { label: "Reveal Workflow", href: "#demo" },
        { label: "Why It Works", href: "#about" },
        {
          label: "Pilot Access",
          href: CAL_BOOKING_URL,
          external: true,
        },
      ],
    },
  ];

  const footerLinkStyle = {
    display: "block",
    fontSize: 12.5,
    color: C.textSoft,
    padding: "3px 0",
    cursor: "pointer",
    transition: "color .15s",
    textDecoration: "none",
    lineHeight: 1.35,
  };

  return (
    <footer
      style={{ borderTop: `1px solid ${C.border}`, padding: "38px 0 26px" }}
    >
      <Wrap>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(250px, 1.35fr) repeat(3, minmax(130px, .65fr))",
            columnGap: 46,
            rowGap: 28,
            alignItems: "start",
            marginBottom: 30,
          }}
        >
          <div>
            <LogoFull size={24} />
            <p
              style={{
                fontSize: 13,
                color: C.textMuted,
                lineHeight: 1.65,
                marginTop: 12,
                maxWidth: 280,
              }}
            >
              Capital intelligence for private markets. Structured LP-GP
              matching infrastructure.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div
              key={col.title}
              style={{
                display: "grid",
                gap: 8,
                alignContent: "start",
                justifyItems: "start",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 2,
                }}
              >
                {col.title}
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                {col.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    style={footerLinkStyle}
                    onMouseOver={(e) => (e.target.style.color = C.text)}
                    onMouseOut={(e) => (e.target.style.color = C.textSoft)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: C.textMuted }}>
            © 2026 MandateOS, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/mandate-os/",
              },
              {
                label: "Book Demo",
                href: CAL_BOOKING_URL,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "color .15s",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => (e.target.style.color = C.textSoft)}
                onMouseOut={(e) => (e.target.style.color = C.textMuted)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Wrap>
    </footer>
  );
}

/* ════════════════════════════════════════════
   APP ROOT
   ════════════════════════════════════════════ */
