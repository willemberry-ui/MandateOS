import { useState, useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
import { USE_MARKETPLACE_DEMO, USE_CAL_BOOKING_EXPERIENCE, CAL_BOOKING_URL, CAL_BOOKING_EMBED_URL } from "./constants";
import { C_ORIGINAL, C_NEW, C } from "./tokens";
import {
  getInitials,
  getScoreColor,
  getScoreLabel,
  lsGet,
  lsSet,
  formatMoneyRange,
  scoreBucket,
  normalizeUserRole,
} from "./lib/helpers";
import {
  FIT_WEIGHTS,
  computeFitScore,
  runFitEngine,
  standardizeFundSubmission,
  computeReadinessScore,
  buildGpMarketFeedback,
} from "./lib/fitEngine";
// Legacy — not used by active components; kept to avoid dead-code reference errors
const API_BASE = "";

/* ════════════════════════════════════════════
   LP DATABASE CONTEXT — live from Supabase
   ════════════════════════════════════════════ */
const LPContext = createContext({ lps: [], loading: true });
function useLPs() {
  return useContext(LPContext);
}

/** Map a Supabase lp_profiles_capitalos row → the shape the fit engine expects */
function mapSupabaseLP(row) {
  return {
    id: row.id,
    name: row.lp_name,
    type: row.lp_type || "Unknown",
    aum: row.aum_usd_m
      ? `$${
          row.aum_usd_m >= 1000
            ? (row.aum_usd_m / 1000).toFixed(1) + "B"
            : row.aum_usd_m + "M"
        }`
      : "N/A",
    checkMin: row.check_size_min_usd_m || 0,
    checkMax: row.check_size_max_usd_m || 999,
    // Derive sectors / strategies / geographies from primary_strategy string
    sectors: deriveSectors(row.primary_strategy),
    strategies: deriveStrategies(row.primary_strategy),
    geographies: ["Global"],
    deploying: row.is_active !== false,
    logo: null,
    _raw: row,
  };
}

const SECTOR_KEYWORDS = {
  Technology: ["tech", "digital", "software", "saas"],
  Healthcare: ["health", "bio", "medtech", "life sci"],
  Climate: ["climate", "clean", "sustain", "green", "impact"],
  Fintech: ["fintech", "finance", "financial"],
  Consumer: ["consumer", "retail", "media", "sports"],
  Education: ["education", "edtech"],
  Energy: ["energy", "oil", "infra"],
  "Real Estate": ["real estate", "property", "real assets"],
  Infrastructure: ["infra", "real assets"],
  Credit: ["credit", "debt", "lending"],
};

function deriveSectors(strategy) {
  if (!strategy) return ["Technology"];
  const s = strategy.toLowerCase();
  const found = [];
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((k) => s.includes(k))) found.push(sector);
  }
  return found.length ? found : ["Technology", "Healthcare"];
}

const STRATEGY_MAP = {
  Venture: "Venture Capital",
  "Seed Venture": "Venture Capital",
  "Climate Venture": "Venture Capital",
  "Venture Growth": "Growth Equity",
  "Venture Growth Biotech": "Growth Equity",
  "Venture Growth Buyout": "Growth Equity",
  "Venture Growth Funds": "Growth Equity",
  "Venture Growth Impact": "Growth Equity",
  "Venture Growth and Funds": "Growth Equity",
  "Growth Buyout": "Buyout",
  "Growth Buyout Venture": "Buyout",
  "Growth Real Estate": "Real Estate",
  "Buyout Funds": "Buyout",
  "Buyout Growth Credit": "Buyout",
  "Buyout Growth Real Assets": "Buyout",
  "Buyout Growth Venture": "Buyout",
  "Buyout Real Assets": "Buyout",
  "Impact Funds": "Venture Capital",
  "Impact Growth Funds": "Growth Equity",
  "Impact Growth Venture": "Growth Equity",
  "Impact Private Equity": "Buyout",
  "Impact Private Markets": "Buyout",
  "Impact Venture": "Venture Capital",
  "Mission Related Investing": "Venture Capital",
  "Funds Secondaries": "Secondaries",
  "Funds and Co Investments": "Venture Capital",
  "Funds and Directs": "Venture Capital",
  "Funds and Secondaries": "Secondaries",
  Alternatives: "Venture Capital",
  "Private Markets": "Buyout",
  "Global Private Markets": "Buyout",
  "Multi Asset Private Markets": "Buyout",
  "Private Equity Credit Real Assets": "Buyout",
  "Private Equity Real Assets": "Buyout",
  "Private Equity and Real Assets": "Buyout",
  "Real Assets Private Equity": "Real Estate",
  "Public Pension Private Equity": "Buyout",
  "Balanced with PE": "Buyout",
  "Balanced with Private Markets": "Buyout",
  "Endowment Multi Asset": "Growth Equity",
  "Global Endowment Multi Asset": "Growth Equity",
  "Global Balanced Private Markets": "Buyout",
  "Global Multi Asset": "Growth Equity",
  "Sports Media Growth": "Growth Equity",
};

function deriveStrategies(strategy) {
  if (!strategy) return ["Venture Capital"];
  return [STRATEGY_MAP[strategy] || "Venture Capital"];
}
// Colors imported from ./tokens (C, C_ORIGINAL, C_NEW)

/* ════════════════════════════════════════════
   GLOBAL STYLES
   ════════════════════════════════════════════ */
const injectStyles = () => {
  // Always update — never skip so hot reload and token changes take effect
  let s = document.getElementById("mandateos-global-styles");
  if (!s) {
    s = document.createElement("style");
    s.id = "mandateos-global-styles";
    document.head.appendChild(s);
  }
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@400;500;600;700&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; width:100%; min-height:100vh; }

    body {
      width:100%;
      min-height:100vh;
      background:${C.black};
      color:${C.text};
      font-family:'Manrope',system-ui,-apple-system,sans-serif;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      overflow-x:hidden;
      line-height:1.6;
    }

    body::before {
      content:'';
      position:fixed;
      inset:0;
      pointer-events:none;
      z-index:0;
      background:
        radial-gradient(ellipse 60% 40% at 20% 0%, ${C.accent}06, transparent 52%),
        radial-gradient(ellipse 40% 30% at 80% 10%, ${C.purple}04, transparent 42%),
        radial-gradient(ellipse 50% 60% at 0% 60%, ${C.teal}03, transparent 52%),
        radial-gradient(ellipse 30% 30% at 90% 80%, ${C.accent}02, transparent 42%);
    }

    body::after {
      content:'';
      position:fixed;
      inset:0;
      pointer-events:none;
      z-index:0;
      background-image:
        linear-gradient(${C.border}10 1px, transparent 1px),
        linear-gradient(90deg, ${C.border}10 1px, transparent 1px);
      background-size:80px 80px;
      mask-image:radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%);
    }

    /* All content above the glow/grid layers */
    #root { position:relative; z-index:1; width:100%; min-height:100vh; }

    ::selection { background:${C.accent}; color:white }
    ::-webkit-scrollbar { width:4px }
    ::-webkit-scrollbar-track { background:${C.black} }
    ::-webkit-scrollbar-thumb {
      background:linear-gradient(${C.accent},${C.purple});
      border-radius:4px;
    }
    ::-webkit-scrollbar-thumb:hover { background:${C.accent} }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes subtlePulse { 0%,100%{opacity:.45} 50%{opacity:1} }
    @keyframes glowRing  { 0%,100%{opacity:.3} 50%{opacity:.8} }
    @keyframes popIn {
      from { opacity:0; transform:translateY(12px) scale(.98); }
      to   { opacity:1; transform:translateY(0)    scale(1); }
    }
    @keyframes slideInRight {
      from { opacity:0; transform:translateX(20px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity:0; transform:scale(.94); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow:0 0 20px ${C.accent}10; }
      50%     { box-shadow:0 0 40px ${C.accent}22; }
    }
    @keyframes floatSlow {
      0%,100% { transform:translateY(0); }
      50%     { transform:translateY(-5px); }
    }
    @keyframes accentLine {
      from { transform:scaleX(0); opacity:0; }
      to   { transform:scaleX(1); opacity:1; }
    }
    @keyframes heroFilmIn {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes heroFilmProgress {
      from { transform:scaleX(0); }
      to   { transform:scaleX(1); }
    }
    @keyframes heroFilmBar {
      from { width:0; }
    }
    @keyframes heroFilmDrift {
      0%,100% { transform:translateY(0); }
      50%     { transform:translateY(-4px); }
    }
    @keyframes heroCursorClick {
      0%,100% { transform:scale(1); opacity:.75; }
      45%     { transform:scale(2.4); opacity:.18; }
    }
    @keyframes filmCursorClick {
      0%   { transform:scale(.72); opacity:.86; }
      56%  { transform:scale(2.1); opacity:.24; }
      100% { transform:scale(2.65); opacity:0; }
    }
    @keyframes marketplaceReveal {
      0%   { opacity:0; transform:translateY(16px) scale(.98); filter:blur(8px); }
      58%  { opacity:1; transform:translateY(0) scale(1.01); filter:blur(0); }
      100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
    }
    @keyframes marketplaceUnlock {
      0%   { transform:rotate(-10deg) scale(.92); opacity:.55; }
      48%  { transform:rotate(8deg) scale(1.08); opacity:1; }
      100% { transform:rotate(0) scale(1); opacity:1; }
    }

    /* ── Scroll reveal base ── */
    .reveal { opacity:0; transform:translateY(24px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
    .reveal.visible { opacity:1; transform:translateY(0); }
    .fade-in  { animation:fadeIn .4s ease both }
    .slide-in { animation:slideInRight .45s cubic-bezier(.22,1,.36,1) both }
    .scale-in { animation:scaleIn .35s cubic-bezier(.22,1,.36,1) both }

    /* ── Inputs ── */
    input, select, textarea {
      transition:border-color .2s, box-shadow .2s;
    }
    input:focus, select:focus, textarea:focus {
      outline:none !important;
      border-color:${C.accent} !important;
      box-shadow:0 0 0 3px ${C.accentGhost}, 0 0 0 1px ${C.accent}60 !important;
    }
    button { font-family:inherit; }

    .marketplace-demo-shell,
    .marketplace-demo-shell button,
    .marketplace-demo-shell input,
    .marketplace-demo-shell textarea,
    .marketplace-demo-shell select {
      font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      letter-spacing:0;
    }

    .marketplace-demo-shell h1,
    .marketplace-demo-shell h2,
    .marketplace-demo-shell h3 {
      font-family:'Manrope','Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      letter-spacing:0;
    }

    .marketplace-mono {
      font-family:'IBM Plex Mono','Source Code Pro',monospace;
      font-variant-numeric:tabular-nums;
      font-feature-settings:'tnum';
    }

    .marketplace-demo-shell {
      height:100vh;
      overflow:hidden;
      display:grid;
      grid-template-columns:164px minmax(0, 1fr);
      background:#151b24;
    }

    .marketplace-demo-sidebar,
    .marketplace-right-rail {
      height:100vh;
      overflow:auto;
      overscroll-behavior:contain;
    }

    .marketplace-center-shell {
      min-width:0;
      height:100vh;
      overflow:hidden;
      display:grid;
      grid-template-rows:52px minmax(0, 1fr) 56px;
      background:#151b24;
    }

    .marketplace-center-scroll {
      min-width:0;
      overflow:auto;
      overscroll-behavior:contain;
    }

    .marketplace-grid-2,
    .marketplace-grid-3,
    .marketplace-grid-4,
    .marketplace-overview-grid,
    .marketplace-workflow-room,
    .marketplace-review-layout,
    .marketplace-doc-grid {
      display:grid;
      gap:16px;
    }

    .marketplace-grid-2 { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    .marketplace-grid-3 { grid-template-columns:repeat(3, minmax(0, 1fr)); }
    .marketplace-grid-4 { grid-template-columns:repeat(4, minmax(0, 1fr)); }
    .marketplace-grid-2,
    .marketplace-grid-3,
    .marketplace-grid-4,
    .marketplace-review-layout,
    .marketplace-doc-grid { align-items:stretch; }
    .marketplace-grid-2 > *,
    .marketplace-grid-3 > *,
    .marketplace-grid-4 > *,
    .marketplace-review-layout > *,
    .marketplace-doc-grid > * { min-width:0; height:100%; box-sizing:border-box; }
    .marketplace-overview-grid { grid-template-columns:repeat(12, minmax(0, 1fr)); gap:16px; align-items:start; }
    .marketplace-overview-grid > [class*="marketplace-overview-span-"] { min-width:0; height:100%; }
    .marketplace-overview-span-12 { grid-column:span 12; }
    .marketplace-overview-span-10 { grid-column:span 10; }
    .marketplace-overview-span-9 { grid-column:span 9; }
    .marketplace-overview-span-8 { grid-column:span 8; }
    .marketplace-overview-span-7 { grid-column:span 7; }
    .marketplace-overview-span-6 { grid-column:span 6; }
    .marketplace-overview-span-5 { grid-column:span 5; }
    .marketplace-overview-span-4 { grid-column:span 4; }
    .marketplace-overview-span-3 { grid-column:span 3; }
    .marketplace-overview-span-2 { grid-column:span 2; }
    .marketplace-capital-path-map {
      display:grid;
      grid-template-columns:repeat(7, minmax(118px, 1fr));
      min-width:0;
    }
    .marketplace-capital-path-stage {
      min-height:82px;
    }
    .marketplace-workflow-room { grid-template-columns:minmax(300px, .82fr) minmax(0, 1.18fr); align-items:stretch; }
    .marketplace-review-layout { grid-template-columns:minmax(280px, .72fr) minmax(0, 1.28fr); }
    .marketplace-doc-grid { grid-template-columns:minmax(0, 1.15fr) minmax(300px, .85fr); }
    .marketplace-command-hero {
      display:grid;
      grid-template-columns:minmax(0, 1.3fr) minmax(320px, .82fr);
      gap:0;
      min-width:0;
    }
    .marketplace-command-metrics {
      display:grid;
      grid-template-columns:repeat(4, minmax(0, 1fr));
      gap:16px;
    }
    .marketplace-command-signal-grid {
      display:grid;
      grid-template-columns:repeat(2, minmax(0, 1fr));
      gap:0;
      border-top:1px solid rgba(255,255,255,.07);
    }
    .marketplace-brief-grid {
      display:grid;
      gap:24px;
      align-content:start;
    }
    .marketplace-brief-metrics {
      display:grid;
      grid-template-columns:repeat(2, minmax(0, 1fr));
      gap:16px;
    }
    .marketplace-priority-queue {
      display:grid;
      gap:0;
    }
    .marketplace-priority-queue-head,
    .marketplace-priority-queue-row {
      display:grid;
      grid-template-columns:34px minmax(0, 1.15fr) 72px 82px 94px minmax(160px, .95fr);
      gap:12px;
      align-items:center;
    }
    .marketplace-priority-hero {
      display:grid;
      grid-template-columns:minmax(0, 1.26fr) minmax(320px, .84fr);
      gap:0;
      min-width:0;
    }
    .marketplace-decision-band {
      display:grid;
      grid-template-columns:minmax(220px, .72fr) minmax(0, 1.28fr) minmax(240px, .82fr);
      gap:20px;
      align-items:start;
      min-width:0;
    }
    .marketplace-decision-center {
      display:grid;
      gap:16px;
      min-width:0;
      align-content:start;
    }
    .marketplace-decision-support {
      display:grid;
      grid-template-columns:repeat(2, minmax(0, 1fr));
      gap:16px;
      min-width:0;
    }
    .marketplace-panel-stack {
      display:grid;
      gap:16px;
      align-content:start;
    }
    .marketplace-priority-side-grid {
      display:grid;
      gap:24px;
      align-content:start;
    }
    .marketplace-priority-intel-list {
      display:grid;
      gap:0;
    }
    .marketplace-priority-intel-head,
    .marketplace-priority-intel-row {
      display:grid;
      grid-template-columns:40px minmax(0, 1.18fr) minmax(210px, .84fr) minmax(230px, .98fr);
      gap:14px;
      align-items:center;
    }

    .marketplace-reveal-card {
      animation:marketplaceReveal .7s cubic-bezier(.18,1,.28,1) both;
    }

    .marketplace-unlock {
      animation:marketplaceUnlock .65s cubic-bezier(.18,1,.28,1) both;
    }

    @media (max-width: 1180px) {
      .marketplace-demo-shell { grid-template-columns:164px minmax(0, 1fr) !important; }
      .marketplace-right-rail { display:none !important; }
      .marketplace-grid-4 { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
      .marketplace-command-hero { grid-template-columns:1fr !important; }
      .marketplace-command-metrics { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
      .marketplace-capital-path-map {
        grid-template-columns:repeat(7, minmax(132px, 1fr)) !important;
        overflow-x:auto;
      }
      .marketplace-priority-hero { grid-template-columns:1fr !important; }
      .marketplace-decision-band { grid-template-columns:1fr !important; }
      .marketplace-decision-support { grid-template-columns:1fr 1fr !important; }
      .marketplace-priority-queue-head,
      .marketplace-priority-queue-row {
        grid-template-columns:34px minmax(0, 1fr) 68px 82px minmax(140px, .9fr) !important;
      }
      .marketplace-priority-intel-head,
      .marketplace-priority-intel-row {
        grid-template-columns:36px minmax(0, 1fr) minmax(184px, .8fr) minmax(180px, .9fr) !important;
      }
      .marketplace-priority-queue-head > :nth-child(5),
      .marketplace-priority-queue-row > :nth-child(5) { display:none !important; }
      .marketplace-overview-span-9,
      .marketplace-overview-span-10,
      .marketplace-overview-span-8,
      .marketplace-overview-span-7,
      .marketplace-overview-span-6,
      .marketplace-overview-span-5,
      .marketplace-overview-span-4,
      .marketplace-overview-span-3,
      .marketplace-overview-span-2 { grid-column:span 12 !important; }
	      .marketplace-overview-grid,
	      .marketplace-grid-2,
	      .marketplace-grid-3,
	      .marketplace-grid-4,
	      .marketplace-review-layout,
	      .marketplace-doc-grid { gap:16px !important; }
	      .marketplace-workflow-room,
	      .marketplace-review-layout,
	      .marketplace-doc-grid { grid-template-columns:1fr !important; }
	      .marketplace-data-room-shell { grid-template-columns:180px minmax(0, 1fr) !important; }
	      .marketplace-data-room-shell > aside:last-child { display:none !important; }
	    }

    @media (max-width: 820px) {
      .marketplace-grid-2,
      .marketplace-grid-3,
      .marketplace-grid-4 { grid-template-columns:1fr !important; }
      .marketplace-command-metrics,
      .marketplace-command-signal-grid,
      .marketplace-brief-metrics,
      .marketplace-decision-support { grid-template-columns:1fr !important; }
      .marketplace-capital-path-map {
        grid-template-columns:repeat(7, minmax(150px, 1fr)) !important;
      }
      .marketplace-capital-path-stage { min-height:92px !important; }
      .marketplace-priority-hero { grid-template-columns:1fr !important; }
      .marketplace-decision-band { grid-template-columns:1fr !important; }
      .marketplace-demo-shell { grid-template-columns:1fr !important; height:auto !important; min-height:100vh !important; overflow:visible !important; }
      .marketplace-demo-sidebar { position:relative !important; height:auto !important; min-height:auto !important; border-right:none !important; border-bottom:1px solid rgba(237,234,248,.075) !important; }
      .marketplace-center-shell { height:auto !important; min-height:100vh !important; grid-template-rows:auto minmax(0, 1fr) auto !important; }
      .marketplace-center-scroll { overflow:visible !important; }
      .marketplace-overview-grid,
      .marketplace-grid-2,
      .marketplace-grid-3,
      .marketplace-grid-4,
      .marketplace-review-layout,
      .marketplace-doc-grid { gap:16px !important; }
      .marketplace-right-rail { display:none !important; }
      .marketplace-overview-grid { grid-template-columns:1fr !important; }
      .marketplace-overview-span-12,
      .marketplace-overview-span-10,
      .marketplace-overview-span-9,
      .marketplace-overview-span-8,
      .marketplace-overview-span-7,
      .marketplace-overview-span-6,
      .marketplace-overview-span-5,
	      .marketplace-overview-span-4,
	      .marketplace-overview-span-3,
        .marketplace-overview-span-2 { grid-column:1 / -1 !important; }
	      .marketplace-action-strip { grid-template-columns:1fr !important; }
	      .marketplace-data-room-shell { grid-template-columns:1fr !important; min-height:auto !important; }
	      .marketplace-data-room-shell > aside,
	      .marketplace-data-room-shell > main { border-right:none !important; border-bottom:1px solid rgba(237,234,248,.075) !important; }
	      .marketplace-kpi-strip { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
	      .marketplace-priority-queue-head,
	      .marketplace-priority-queue-row { grid-template-columns:30px minmax(0, 1fr) 60px auto !important; }
	      .marketplace-priority-queue-head > :nth-child(4),
	      .marketplace-priority-queue-head > :nth-child(5),
	      .marketplace-priority-queue-row > :nth-child(4),
	      .marketplace-priority-queue-row > :nth-child(5) { display:none !important; }
	      .marketplace-priority-intel-head { display:none !important; }
	      .marketplace-priority-intel-row {
	        grid-template-columns:32px minmax(0, 1fr) !important;
	        gap:8px 12px !important;
	      }
	      .marketplace-priority-intel-row > :nth-child(3),
	      .marketplace-priority-intel-row > :nth-child(4) { grid-column:2 !important; }
	      .marketplace-match-rank-row,
	      .marketplace-match-rank-head { grid-template-columns:30px minmax(0, 1fr) 54px auto !important; }
	      .marketplace-match-rank-row > :nth-child(4),
	      .marketplace-match-rank-head > :nth-child(4) { display:none !important; }
    }

    /* ── Grain texture — very subtle, premium ── */
    .grain {
      position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.035;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-repeat:repeat; background-size:180px;
    }

    /* ── Lift card — premium magnetic hover ── */
    .glow-card {
      transition: transform .3s cubic-bezier(.16,1,.3,1),
                  box-shadow .3s cubic-bezier(.16,1,.3,1),
                  border-color .3s ease;
    }
    .glow-card:hover {
      transform: translateY(-3px);
      box-shadow:
        0 24px 64px rgba(0,0,0,.5),
        0 0 0 1px ${C.accent}30,
        0 0 32px ${C.accent}10;
    }

    /* ── Section ambient glow ── */
    .section-glow-top::before {
      content:none;
    }

    /* ── Responsive nav ── */
    @media (max-width: 768px) {
      .nav-desktop  { display:none !important; }
      .nav-hamburger{ display:flex !important; }
    }
    @media (min-width: 769px) {
      .nav-hamburger{ display:none !important; }
    }

    /* ── Modal ── */
    .modal-backdrop {
      position:fixed; inset:0;
      background:rgba(4,4,11,0.84);
      backdrop-filter:blur(20px) saturate(1.6);
      z-index:9998;
      display:flex; align-items:center; justify-content:center;
      padding:24px;
      animation:fadeIn .2s ease both;
    }
    .modal-panel {
      width:100%; max-width:560px;
      background:${C.card};
      border:1px solid ${C.border};
      border-radius:20px;
      box-shadow:
        0 48px 128px rgba(0,0,0,.7),
        0 0 0 1px ${C.accent}12;
      animation:popIn .25s cubic-bezier(.16,1,.3,1) both;
      overflow:hidden;
    }

    /* ── Premium border — hairline gradient edge ── */
    .premium-border {
      position:relative;
    }
    .premium-border::before {
      content:'';
      position:absolute;
      inset:-1px;
      border-radius:inherit;
      padding:1px;
      background:linear-gradient(135deg, ${C.accent}40, ${C.purple}20, transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;
      mask-composite:exclude;
      pointer-events:none;
    }

    /* ══════════════════════════════════════════
       COMPONENT-LEVEL POLISH
       ══════════════════════════════════════════ */

    /* ── Primary button: gradient + glow ── */
    button[style*="background: ${C.accent}"],
    button[style*="background:${C.accent}"] {
      background: linear-gradient(135deg, ${C.accent}, ${C.accentDim}) !important;
      position: relative;
      overflow: hidden;
    }

    /* ── Table rows: sleek hover ── */
    .lp-row {
      transition: background .15s ease, box-shadow .15s ease;
      border-bottom: 1px solid ${C.borderSubtle};
    }
    .lp-row:hover {
      background: ${C.surfaceHover} !important;
      box-shadow: inset 3px 0 0 ${C.accent};
    }

    /* ── Stat/metric number displays ── */
    .stat-number {
      font-feature-settings: 'tnum';
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.04em;
    }

    /* ── Score bar track ── */
    .score-bar-track {
      height: 6px;
      border-radius: 99px;
      background: ${C.borderSubtle};
      overflow: hidden;
    }
    .score-bar-fill {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, ${C.accent}, ${C.accentBright});
      box-shadow: 0 0 8px ${C.accent}40;
      transition: width .6s cubic-bezier(.22,1,.36,1);
    }

    /* ── Sidebar nav items ── */
    .sidebar-item {
      transition: background .15s ease, color .15s ease, box-shadow .15s ease;
      border-radius: 10px;
    }
    .sidebar-item:hover {
      background: ${C.surfaceHover};
    }
    .sidebar-item.active {
      background: ${C.accentWash};
      box-shadow: inset 3px 0 0 ${C.accent};
      color: ${C.accent};
    }

    /* ── Section dividers with gradient ── */
    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${C.border}, transparent);
      margin: 32px 0;
    }

    /* ── Workspace panel header ── */
    .panel-header {
      background: linear-gradient(180deg, ${C.raised}f8, ${C.card}f0);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid ${C.borderSubtle};
    }

    /* ── Match score badge ── */
    .match-score {
      font-feature-settings: 'tnum';
      font-weight: 800;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }

    /* ── Tag / chip elements ── */
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: ${C.surface};
      color: ${C.textSoft};
      border: 1px solid ${C.borderSubtle};
      transition: background .15s, border-color .15s, color .15s;
    }
    .tag:hover {
      background: ${C.accentGhost};
      border-color: ${C.accent}40;
      color: ${C.accentBright};
    }

    /* ── Glass panel utility ── */
    .glass-panel {
      background: ${C.card}e0;
      backdrop-filter: blur(20px) saturate(1.4);
      border: 1px solid ${C.border};
      border-radius: 16px;
    }

    /* ── Empty state ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
      text-align: center;
      opacity: .6;
    }

    /* ── Loading shimmer ── */
    .shimmer {
      background: linear-gradient(90deg,
        ${C.surface} 0%,
        ${C.surfaceHover} 40%,
        ${C.surface} 80%
      );
      background-size: 200% 100%;
      animation: shimmer 1.8s ease infinite;
    }

    /* ── Focused form rows ── */
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: ${C.textMuted};
    }

    /* ── Data table header ── */
    .table-header {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${C.textMuted};
      border-bottom: 1px solid ${C.border};
      padding-bottom: 10px;
    }

    /* ── Notification / alert ── */
    .alert {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      border: 1px solid;
    }
    .alert-info  { background:${C.accentGhost};  border-color:${C.accent}30;  color:${C.accentBright}; }
    .alert-green { background:${C.greenWash};  border-color:${C.greenBorder}; color:${C.green}; }
    .alert-amber { background:${C.amberWash};  border-color:${C.amberBorder}; color:${C.amber}; }
    .alert-red   { background:${C.redWash};    border-color:${C.redBorder};   color:${C.red}; }

    /* ── Responsive improvements ── */
    @media (max-width: 640px) {
      h1 { font-size: clamp(32px, 8vw, 48px) !important; }
      .hide-mobile { display: none !important; }
    }

    .cal-booking-frame {
      width: 100%;
      height: 100vh;
      min-height: 0;
      border: 0;
      display: block;
      background: #111111;
    }

    .landing-band {
      position: relative;
      isolation: isolate;
      background:${C.black};
    }

    .non-hero-landing-bg {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      background: ${C.black};
      display: grid;
      gap: 42px;
    }

    .non-hero-landing-bg::before {
      content: none;
    }

    .non-hero-landing-bg::after {
      content: none;
    }

    .non-hero-landing-bg > * {
      position: relative;
      z-index: 1;
    }

    .hero-grid,
    .product-snapshot-grid {
      display: grid;
      align-items: center;
    }

    .hero-stat-cluster {
      display: inline-flex;
      flex-wrap: wrap;
      max-width: 100%;
    }

    .dashboard-side-grid,
    .dashboard-stage-grid,
    .dashboard-metric-grid {
      display: grid;
      gap: 14px;
    }

    .dashboard-side-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dashboard-stage-grid {
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.72fr);
      align-items: stretch;
    }

    .dashboard-metric-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .dashboard-stage-frame {
      position: relative;
      isolation: isolate;
    }

    .dashboard-preview-shell {
      transform: perspective(1800px) rotateX(2deg);
      transform-origin: top center;
      transition: transform .35s ease, box-shadow .35s ease;
    }

    .lp-demo-command-grid,
    .lp-demo-command-support,
    .lp-demo-command-metrics,
    .lp-demo-triad-grid,
    .lp-demo-inbox-layout,
    .lp-demo-diligence-layout,
    .lp-demo-pipeline-stats,
    .lp-demo-column-stack {
      display:grid;
      gap:14px;
    }

    .lp-demo-command-grid {
      grid-template-columns:minmax(0, 1.22fr) minmax(320px, .78fr);
    }

    .lp-demo-command-support {
      grid-template-columns:minmax(0, 1.15fr) minmax(320px, .85fr);
    }

    .lp-demo-command-metrics {
      grid-template-columns:repeat(5, minmax(0, 1fr));
    }

    .lp-demo-triad-grid {
      grid-template-columns:repeat(3, minmax(0, 1fr));
    }

    .lp-demo-inbox-layout {
      grid-template-columns:220px minmax(0, 1fr) 360px;
      align-items:start;
    }

    .lp-demo-diligence-layout {
      grid-template-columns:280px minmax(0, 1fr) 320px;
      align-items:start;
    }

    .lp-demo-pipeline-stats {
      grid-template-columns:repeat(4, minmax(0, 1fr));
    }

    .lp-demo-column-stack {
      grid-template-columns:1fr;
    }

    .dashboard-stage-frame:hover .dashboard-preview-shell {
      transform: perspective(1800px) rotateX(0deg) translateY(-2px);
    }

    @media (max-width: 1040px) {
      .hero-grid,
      .product-snapshot-grid,
      .dashboard-stage-grid,
      .lp-demo-command-grid,
      .lp-demo-command-support,
      .lp-demo-inbox-layout,
      .lp-demo-diligence-layout {
        grid-template-columns: 1fr !important;
      }

      .hero-stage {
        max-width: 720px;
        margin: 0 auto;
      }
    }

    @media (max-width: 820px) {
      .hero-stage {
        min-height: auto !important;
      }

      .hero-dashboard-shell {
        transform: none !important;
        border-radius: 24px !important;
      }

      .hero-product-tilt {
        width: 100% !important;
        margin: 0 auto !important;
        transform: none !important;
        filter: none !important;
      }

      .hero-dashboard-body {
        grid-template-columns: 1fr !important;
      }

      .hero-dashboard-sidebar {
        border-right: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .hero-lp-grid,
      .hero-bottom-grid,
      .hero-film-grid,
      .hero-film-pipeline,
      .hero-film-status {
        grid-template-columns: 1fr !important;
      }

      .hero-scene-frame {
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
      }

      .hero-product-cursor {
        display: none !important;
      }

      .product-snapshot-stack {
        padding-left: 0 !important;
      }
    }

    @media (max-width: 640px) {
      .hero-stat-cluster {
        display: grid !important;
        width: 100%;
      }

      .hero-stat-card {
        min-width: 0 !important;
        width: 100%;
      }

      .hero-actions {
        display: grid !important;
        width: 100%;
      }

      .hero-actions button {
        width: 100%;
      }

      .hero-live-demo-btn {
        width: 100%;
      }

      .hero-demo-buttons {
        grid-template-columns: 1fr !important;
      }

      .hero-dashboard-shell,
      .product-card-tight {
        border-radius: 20px !important;
      }

      .hero-film-tabs {
        overflow-x: auto !important;
      }

    }

    @media (max-width: 1120px) {
      .landing-two-col,
      .diligence-docflow-grid,
      .mandate-how-grid,
      .product-modules-heading,
      .testimonial-feature-grid,
      .footer-grid {
        grid-template-columns: 1fr !important;
      }

      .landing-sticky {
        position: relative !important;
        top: auto !important;
      }

      .problem-scroll-stack > div {
        min-height: 0 !important;
        margin-bottom: 10px !important;
        opacity: 1 !important;
        filter: none !important;
        transform: none !important;
      }

      .product-modules-grid,
      .impact-grid,
      .quote-grid,
      .pricing-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .dashboard-stats-grid,
      .pipeline-grid,
      .lp-demo-command-metrics,
      .lp-demo-pipeline-stats,
      .demo-workflow-metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .mandate-filters-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }

      .mandate-card-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      }
    }

    @media (max-width: 820px) {
      .dashboard-side-grid,
      .dashboard-metric-grid,
      .mandate-how-cards,
      .mandate-how-panel-body,
      .mandate-how-panel-actions,
      .mandate-how-focused-body,
      .product-snapshot-stack,
      .product-modules-stats,
      .product-modules-grid,
      .lp-demo-triad-grid,
      .impact-grid,
      .testimonial-feature-grid,
      .quote-grid,
      .pricing-grid,
      .footer-grid,
      .demo-two-col {
        grid-template-columns: 1fr !important;
      }

      .demo-panel-content {
        padding: 20px !important;
      }

      .problem-scroll-stack > div {
        min-height: 0 !important;
        margin-bottom: 10px !important;
        opacity: 1 !important;
        filter: none !important;
        transform: none !important;
      }

      .diligence-teaser-stage {
        min-height: auto !important;
        padding: 0 !important;
      }

      .diligence-doc-stack {
        min-height: 332px !important;
      }

      .diligence-teaser-bottom,
      .diligence-teaser-memo-grid {
        grid-template-columns: 1fr !important;
      }

      .diligence-teaser-bottom {
        padding-left: 0 !important;
        margin-top: 18px !important;
      }

      .dashboard-preview-shell {
        transform: none !important;
      }

      .dashboard-floating-note {
        display: none !important;
      }

      .mandate-filters-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .landing-sticky {
        position: relative !important;
        top: auto !important;
      }

      .mandate-how-panel {
        height: auto !important;
      }

      .mandate-how-focused-panel {
        height: auto !important;
      }

      .mandate-how-panel-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .mandate-how-focused-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 560px) {
      .dashboard-stats-grid,
      .dashboard-metric-grid,
      .pipeline-grid,
      .lp-demo-command-metrics,
      .lp-demo-pipeline-stats,
      .lp-demo-triad-grid,
      .mandate-how-panel-stats,
      .mandate-how-focused-stats,
      .demo-workflow-metrics,
      .mandate-filters-grid {
        grid-template-columns: 1fr !important;
      }

      .mandate-view-actions,
      .mandate-actions-row {
        width: 100%;
        flex-wrap: wrap !important;
        margin-left: 0 !important;
      }

      .mandate-view-actions > *,
      .mandate-actions-row > * {
        flex: 1 1 auto;
      }
    }
  `;
};
injectStyles();

// FIT_WEIGHTS, computeFitScore, runFitEngine imported from ./lib/fitEngine

// Legacy static fallback — replaced at runtime by Supabase data via LPContext
const LP_DATABASE_STATIC = [
  {
    id: 1,
    name: "Pacific Endowment",
    type: "University Endowment",
    aum: "$3.2B",
    checkMin: 5,
    checkMax: 25,
    sectors: ["Technology", "Healthcare", "Climate"],
    geographies: ["North America"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 2,
    name: "Nordic Pension Fund",
    type: "Sovereign Pension",
    aum: "$18.7B",
    checkMin: 10,
    checkMax: 50,
    sectors: ["Technology", "Infrastructure", "Real Estate"],
    geographies: ["Europe", "North America"],
    strategies: ["Venture Capital", "Buyout", "Infrastructure"],
    deploying: true,
    logo: null,
  },
  {
    id: 3,
    name: "Meridian Family Office",
    type: "Family Office",
    aum: "$850M",
    checkMin: 2,
    checkMax: 15,
    sectors: ["Technology", "Consumer", "Fintech"],
    geographies: ["North America", "Europe"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 4,
    name: "Apex Sovereign Wealth",
    type: "Sovereign Wealth",
    aum: "$42B",
    checkMin: 50,
    checkMax: 200,
    sectors: ["Infrastructure", "Real Estate", "Energy"],
    geographies: ["Global"],
    strategies: ["Buyout", "Infrastructure", "Real Estate"],
    deploying: false,
    logo: null,
  },
  {
    id: 5,
    name: "Cascade Foundation",
    type: "Foundation",
    aum: "$1.8B",
    checkMin: 3,
    checkMax: 20,
    sectors: ["Healthcare", "Education", "Climate"],
    geographies: ["North America", "Asia-Pacific"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 6,
    name: "Sterling Partners Group",
    type: "Fund of Funds",
    aum: "$5.4B",
    checkMin: 10,
    checkMax: 40,
    sectors: ["Technology", "Healthcare", "Fintech"],
    geographies: ["North America", "Europe"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 7,
    name: "Great Lakes Pension",
    type: "Public Pension",
    aum: "$12.6B",
    checkMin: 15,
    checkMax: 75,
    sectors: ["Technology", "Infrastructure", "Real Estate"],
    geographies: ["North America"],
    strategies: ["Venture Capital", "Buyout", "Real Estate"],
    deploying: true,
    logo: null,
  },
  {
    id: 8,
    name: "Zurich Re Investments",
    type: "Insurance Co.",
    aum: "$8.2B",
    checkMin: 20,
    checkMax: 60,
    sectors: ["Infrastructure", "Real Estate", "Credit"],
    geographies: ["Europe", "Global"],
    strategies: ["Credit", "Infrastructure", "Real Estate"],
    deploying: false,
    logo: null,
  },
  {
    id: 9,
    name: "Horizon Asia Capital",
    type: "Family Office",
    aum: "$620M",
    checkMin: 1,
    checkMax: 10,
    sectors: ["Technology", "Consumer", "Fintech"],
    geographies: ["Asia-Pacific"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 10,
    name: "Atlas Endowment Trust",
    type: "University Endowment",
    aum: "$2.1B",
    checkMin: 5,
    checkMax: 30,
    sectors: ["Technology", "Healthcare", "Climate", "Education"],
    geographies: ["North America", "Europe"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 11,
    name: "Crescent Gulf Wealth",
    type: "Sovereign Wealth",
    aum: "$28B",
    checkMin: 25,
    checkMax: 100,
    sectors: ["Technology", "Real Estate", "Energy"],
    geographies: ["MENA", "Global"],
    strategies: ["Buyout", "Growth Equity", "Real Estate"],
    deploying: true,
    logo: null,
  },
  {
    id: 12,
    name: "Vanguard Institutional",
    type: "Insurance Co.",
    aum: "$6.8B",
    checkMin: 10,
    checkMax: 50,
    sectors: ["Technology", "Healthcare", "Infrastructure"],
    geographies: ["North America", "Europe"],
    strategies: ["Venture Capital", "Growth Equity", "Buyout"],
    deploying: true,
    logo: null,
  },
  {
    id: 13,
    name: "Redwood Capital Group",
    type: "Family Office",
    aum: "$380M",
    checkMin: 1,
    checkMax: 8,
    sectors: ["Technology", "Consumer", "Climate"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 14,
    name: "Baltic Investment Corp",
    type: "Public Pension",
    aum: "$4.2B",
    checkMin: 5,
    checkMax: 25,
    sectors: ["Infrastructure", "Real Estate", "Credit"],
    geographies: ["Europe"],
    strategies: ["Credit", "Infrastructure"],
    deploying: false,
    logo: null,
  },
  {
    id: 15,
    name: "Summit Peak Advisors",
    type: "Fund of Funds",
    aum: "$3.1B",
    checkMin: 5,
    checkMax: 30,
    sectors: ["Technology", "Healthcare", "Fintech"],
    geographies: ["North America", "Asia-Pacific"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 16,
    name: "Andes Wealth Partners",
    type: "Family Office",
    aum: "$520M",
    checkMin: 2,
    checkMax: 12,
    sectors: ["Technology", "Fintech", "Consumer"],
    geographies: ["LATAM", "North America"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 17,
    name: "Thames Capital Trust",
    type: "Foundation",
    aum: "$1.4B",
    checkMin: 3,
    checkMax: 18,
    sectors: ["Healthcare", "Education", "Climate"],
    geographies: ["Europe", "North America"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 18,
    name: "Pacific Rim Ventures",
    type: "Fund of Funds",
    aum: "$2.8B",
    checkMin: 5,
    checkMax: 25,
    sectors: ["Technology", "Consumer", "Healthcare"],
    geographies: ["Asia-Pacific", "North America"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 19,
    name: "Evergreen Capital Partners",
    type: "Family Office",
    aum: "$1.2B",
    checkMin: 3,
    checkMax: 20,
    sectors: ["Technology", "Climate", "Infrastructure"],
    geographies: ["North America", "Europe"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 20,
    name: "Ontario Teachers' Fund",
    type: "Public Pension",
    aum: "$24.5B",
    checkMin: 20,
    checkMax: 80,
    sectors: ["Technology", "Healthcare", "Infrastructure"],
    geographies: ["North America", "Global"],
    strategies: ["Venture Capital", "Buyout", "Infrastructure"],
    deploying: true,
    logo: null,
  },
  {
    id: 21,
    name: "Abu Dhabi Growth Corp",
    type: "Sovereign Wealth",
    aum: "$35B",
    checkMin: 30,
    checkMax: 150,
    sectors: ["Technology", "Energy", "Real Estate"],
    geographies: ["MENA", "Global"],
    strategies: ["Growth Equity", "Buyout"],
    deploying: true,
    logo: null,
  },
  {
    id: 22,
    name: "Midwest Endowment Trust",
    type: "University Endowment",
    aum: "$980M",
    checkMin: 2,
    checkMax: 12,
    sectors: ["Technology", "Healthcare", "Education"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 23,
    name: "Geneva Wealth Advisors",
    type: "Family Office",
    aum: "$720M",
    checkMin: 2,
    checkMax: 15,
    sectors: ["Fintech", "Consumer", "Healthcare"],
    geographies: ["Europe", "North America"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: false,
    logo: null,
  },
  {
    id: 24,
    name: "Singapore Ventures Ltd",
    type: "Sovereign Wealth",
    aum: "$16B",
    checkMin: 15,
    checkMax: 60,
    sectors: ["Technology", "Fintech", "Infrastructure"],
    geographies: ["Asia-Pacific", "Global"],
    strategies: ["Venture Capital", "Growth Equity", "Infrastructure"],
    deploying: true,
    logo: null,
  },
  {
    id: 25,
    name: "Apex Pension Fund",
    type: "Pension",
    aum: "$6.8B",
    checkMin: 5,
    checkMax: 20,
    sectors: [
      "Industrials",
      "Business Services",
      "Healthcare",
      "Infrastructure",
    ],
    geographies: ["North America"],
    strategies: ["Buyout", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 26,
    name: "Northwest Endowment",
    type: "Endowment",
    aum: "$2.4B",
    checkMin: 3,
    checkMax: 15,
    sectors: ["Industrials", "Healthcare", "Business Services"],
    geographies: ["North America"],
    strategies: ["Buyout", "Venture Capital"],
    deploying: true,
    logo: null,
  },
  {
    id: 27,
    name: "Broadstone Foundation",
    type: "Foundation",
    aum: "$1.6B",
    checkMin: 3,
    checkMax: 12,
    sectors: ["Business Services", "Industrials", "Healthcare"],
    geographies: ["North America"],
    strategies: ["Buyout", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 28,
    name: "Sterling Family Office",
    type: "Family Office",
    aum: "$920M",
    checkMin: 2,
    checkMax: 10,
    sectors: ["Business Services", "Healthcare", "Industrials"],
    geographies: ["North America", "Europe"],
    strategies: ["Buyout"],
    deploying: true,
    logo: null,
  },
  {
    id: 29,
    name: "Summit Capital RIA",
    type: "RIA",
    aum: "$540M",
    checkMin: 2,
    checkMax: 8,
    sectors: ["Industrials", "Business Services"],
    geographies: ["North America"],
    strategies: ["Buyout", "Growth Equity"],
    deploying: true,
    logo: null,
  },
  {
    id: 30,
    name: "Cascade Family Office",
    type: "Family Office",
    aum: "$680M",
    checkMin: 2,
    checkMax: 8,
    sectors: ["Healthcare", "Business Services", "Industrials"],
    geographies: ["North America"],
    strategies: ["Buyout"],
    deploying: true,
    logo: null,
  },
  {
    id: 31,
    name: "Harbor Pension",
    type: "Pension",
    aum: "$4.2B",
    checkMin: 5,
    checkMax: 25,
    sectors: ["Industrials", "Infrastructure", "Healthcare"],
    geographies: ["North America"],
    strategies: ["Buyout", "Infrastructure"],
    deploying: true,
    logo: null,
  },
];

// LP_DATABASE is a module-level variable; at runtime it gets replaced with
// live Supabase data. All component reads via useLPs() hook get the live array.
let LP_DATABASE = LP_DATABASE_STATIC;

const GP_DATABASE = [
  {
    id: 1,
    name: "Meridian Ventures Fund III",
    strategy: "Venture Capital",
    sectors: ["Technology", "Healthcare"],
    checkSize: "$5-25M",
    geography: "North America",
    fundSize: "$150M",
    stage: "Fund III",
    moic: "2.1x",
    irr: "28.4%",
    team: 4,
    deploying: true,
  },
  {
    id: 2,
    name: "Horizon Growth Partners II",
    strategy: "Growth Equity",
    sectors: ["Technology", "Fintech"],
    checkSize: "$15-40M",
    geography: "North America",
    fundSize: "$320M",
    stage: "Fund II",
    moic: "1.9x",
    irr: "24.1%",
    team: 6,
    deploying: true,
  },
  {
    id: 3,
    name: "Atlas Credit Partners IV",
    strategy: "Credit",
    sectors: ["Infrastructure", "Real Estate"],
    checkSize: "$20-60M",
    geography: "Europe",
    fundSize: "$500M",
    stage: "Fund IV",
    moic: "1.5x",
    irr: "14.2%",
    team: 8,
    deploying: true,
  },
  {
    id: 4,
    name: "Terra Real Assets I",
    strategy: "Real Estate",
    sectors: ["Real Estate", "Infrastructure"],
    checkSize: "$10-30M",
    geography: "North America",
    fundSize: "$200M",
    stage: "Fund I",
    moic: "1.8x",
    irr: "18.6%",
    team: 3,
    deploying: true,
  },
  {
    id: 5,
    name: "Ironclad Buyout Fund V",
    strategy: "Buyout",
    sectors: ["Consumer", "Healthcare"],
    checkSize: "$50-150M",
    geography: "Global",
    fundSize: "$1.2B",
    stage: "Fund V",
    moic: "2.4x",
    irr: "22.0%",
    team: 12,
    deploying: false,
  },
  {
    id: 6,
    name: "Cascade Climate Fund I",
    strategy: "Venture Capital",
    sectors: ["Climate", "Energy"],
    checkSize: "$3-12M",
    geography: "North America",
    fundSize: "$80M",
    stage: "Fund I",
    moic: "—",
    irr: "—",
    team: 3,
    deploying: true,
  },
  {
    id: 7,
    name: "Nova Digital Ventures II",
    strategy: "Venture Capital",
    sectors: ["Technology", "Fintech", "Consumer"],
    checkSize: "$2-10M",
    geography: "North America",
    fundSize: "$120M",
    stage: "Fund II",
    moic: "3.4x",
    irr: "42.1%",
    team: 4,
    deploying: true,
  },
  {
    id: 8,
    name: "Sequoia Infra Partners III",
    strategy: "Infrastructure",
    sectors: ["Infrastructure", "Energy"],
    checkSize: "$25-80M",
    geography: "Global",
    fundSize: "$600M",
    stage: "Fund III",
    moic: "1.7x",
    irr: "15.8%",
    team: 9,
    deploying: true,
  },
  {
    id: 9,
    name: "Vertex Health Ventures I",
    strategy: "Venture Capital",
    sectors: ["Healthcare", "Education"],
    checkSize: "$2-8M",
    geography: "North America",
    fundSize: "$95M",
    stage: "Fund I",
    moic: "—",
    irr: "—",
    team: 3,
    deploying: true,
  },
  {
    id: 10,
    name: "BlackPine Growth IV",
    strategy: "Growth Equity",
    sectors: ["Technology", "Consumer"],
    checkSize: "$20-60M",
    geography: "North America",
    fundSize: "$450M",
    stage: "Fund IV",
    moic: "2.3x",
    irr: "26.5%",
    team: 8,
    deploying: true,
  },
  {
    id: 11,
    name: "Sahara Secondaries II",
    strategy: "Secondaries",
    sectors: ["Technology", "Healthcare"],
    checkSize: "$15-50M",
    geography: "Global",
    fundSize: "$380M",
    stage: "Fund II",
    moic: "1.6x",
    irr: "18.2%",
    team: 5,
    deploying: false,
  },
  {
    id: 12,
    name: "Greenfield Agri Fund I",
    strategy: "Venture Capital",
    sectors: ["Climate", "Consumer"],
    checkSize: "$1-5M",
    geography: "North America",
    fundSize: "$55M",
    stage: "Fund I",
    moic: "—",
    irr: "—",
    team: 2,
    deploying: true,
  },
];

// computeFitScore, runFitEngine, getInitials, getScoreColor, getScoreLabel imported from ./lib/fitEngine and ./lib/helpers

// lsGet, lsSet imported from ./lib/helpers

/* ════════════════════════════════════════════
   TOAST SYSTEM
   ════════════════════════════════════════════ */

import { ToastContainer, showToast, RequestAccessModal, Wrap } from "./components/ui";
import { Nav, Hero, Problems, ProductSnapshot, ProductModules, DemoSection, PricingPreview, CTA, Footer, CalBookingModal } from "./components/Landing";
import { GPWorkspace } from "./components/workspace/GP";
import { LPWorkspace, AdminWorkspace } from "./components/workspace/LP";
import { DiligenceOSDemoWorkspace, MarketplaceFilmDemoWorkspace, MarketplaceGPDemoWorkspace, MarketplaceLPDemoWorkspace } from "./components/workspace/Marketplace";
import { AdminDashboard } from "./components/workspace/AdminDashboard";

const MAINTENANCE_PAGES = {
  "/platform": "Platform",
  "/decision-room": "Decision Room",
  "/intelligence": "Intelligence",
  "/for-allocators": "For Allocators",
  "/for-managers": "For Managers",
};

function MaintenancePage({ title, onOpenPilot }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "132px 0 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "20% 14% auto",
          height: 360,
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,111,247,.18), transparent 62%)",
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />
      <Wrap
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1360,
          padding: "0 clamp(22px, 4vw, 64px)",
        }}
      >
        <section
          style={{
            width: "min(760px, 100%)",
            textAlign: "left",
            padding: "46px clamp(22px, 5vw, 62px)",
            borderRadius: 18,
            border: `1px solid ${C.border}`,
            background:
              "linear-gradient(155deg, rgba(16,14,38,.9), rgba(5,4,18,.96))",
            boxShadow:
              "0 28px 90px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.045)",
          }}
        >
        <div
          style={{
            color: C.accentBright,
            fontSize: 11,
            fontWeight: 820,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {title}
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 58px)",
            lineHeight: 1,
            letterSpacing: 0,
            fontWeight: 850,
            marginBottom: 16,
          }}
        >
          Down for maintenance.
        </h1>
        <p
          style={{
            color: C.textSoft,
            fontSize: 15.5,
            lineHeight: 1.65,
            maxWidth: 520,
            margin: "0 0 26px",
          }}
        >
          This page is being redesigned. The main MandateOS homepage is still
          available while this section is under construction.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              minHeight: 42,
              padding: "0 18px",
              borderRadius: 8,
              border: `1px solid ${C.borderHover}`,
              background: "rgba(255,255,255,.03)",
              color: C.text,
              fontSize: 13,
              fontWeight: 740,
              cursor: "pointer",
            }}
          >
            Back Home
          </button>
          <button
            type="button"
            onClick={onOpenPilot}
            style={{
              minHeight: 42,
              padding: "0 18px",
              borderRadius: 8,
              border: `1px solid ${C.accentBright}66`,
              background: C.accentWash,
              color: C.accentBright,
              fontSize: 13,
              fontWeight: 780,
              cursor: "pointer",
            }}
          >
            Request Pilot Access
          </button>
        </div>
        </section>
      </Wrap>
    </main>
  );
}

export default function MandateOS() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const [calBookingOpen, setCalBookingOpen] = useState(false);
  const [demoWorkspace, setDemoWorkspace] = useState(() => {
    const demo = new URLSearchParams(window.location.search).get("demo");
    return ["gp", "lp", "diligence"].includes(demo) ? demo : null;
  });
  const [demoInitialPage, setDemoInitialPage] = useState(() => {
    return new URLSearchParams(window.location.search).get("page") || null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [authedUser, setAuthedUser] = useState(null); // Supabase user object
  const [userProfile, setUserProfile] = useState(null); // row from public.profiles

  // ── Supabase LP fetch ──────────────────────────────────────────────────────
  const [lpList, setLpList] = useState(LP_DATABASE_STATIC);
  const [lpLoading, setLpLoading] = useState(true);

  useEffect(() => {
    async function fetchLPs() {
      try {
        const { data, error } = await supabase
          .from("lp_profiles_capitalos")
          .select("*")
          .order("lp_name", { ascending: true });
        if (error) throw error;
        const mapped = data.map(mapSupabaseLP);
        LP_DATABASE = mapped;
        setLpList(mapped);
      } catch (err) {
        console.warn("LP fetch failed, using fallback:", err.message);
        LP_DATABASE = LP_DATABASE_STATIC;
        setLpList(LP_DATABASE_STATIC);
      } finally {
        setLpLoading(false);
      }
    }
    fetchLPs();
  }, []);

  // ── Supabase Auth ──────────────────────────────────────────────────────────
  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.warn("Profile fetch failed:", error.message);
        }
        setUserProfile(null);
        return null;
      }

      setUserProfile(data || null);
      return data || null;
    } catch (err) {
      console.warn("Profile fetch failed:", err.message);
      setUserProfile(null);
      return null;
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthedUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setAuthLoading(false);
    });

    // Listen for login / logout / token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthedUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const openLogin = () => {
    setModalMode("login");
    setModalOpen(true);
  };
  const openDemo = () => {
    if (USE_CAL_BOOKING_EXPERIENCE) {
      setCalBookingOpen(true);
      return;
    }
    setModalMode("demo");
    setModalOpen(true);
  };
  const openPilot = () => {
    setModalMode("pilot");
    setModalOpen(true);
  };
  const openGpDemo = (page = "overview") => {
    setDemoInitialPage(page);
    setDemoWorkspace("gp");
  };
  const openLpDemo = (page = "room") => {
    setDemoInitialPage(page);
    setDemoWorkspace("lp");
  };
  const openDiligenceDemo = () => {
    setDemoInitialPage(null);
    setDemoWorkspace("diligence");
  };
  const openAdminDemo = () => setDemoWorkspace("admin");
  const closeDemoWorkspace = () => {
    setDemoWorkspace(null);
    setDemoInitialPage(null);
  };
  const closeModal = () => setModalOpen(false);
  const closeCalBooking = () => setCalBookingOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthedUser(null);
    setUserProfile(null);
    showToast("Logged out", "info");
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.black,
          color: C.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${C.border}`,
              borderTopColor: C.accent,
              borderRadius: "50%",
              animation: "spin .7s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ fontSize: 14, color: C.textSoft }}>
            Loading MandateOS…
          </div>
        </div>
      </div>
    );
  }

  const lpContextValue = { lps: lpList, loading: lpLoading };
  const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/";
  const maintenanceTitle = MAINTENANCE_PAGES[normalizedPath];

  if (maintenanceTitle) {
    return (
      <LPContext.Provider value={lpContextValue}>
        <div className="grain" />
        <Nav onOpenPilot={openPilot} onOpenLogin={openLogin} />
        <MaintenancePage title={maintenanceTitle} onOpenPilot={openPilot} />
        <RequestAccessModal
          open={modalOpen}
          mode={modalMode}
          onClose={closeModal}
        />
        <ToastContainer />
      </LPContext.Provider>
    );
  }

  if (demoWorkspace) {
    const demoUser =
      demoWorkspace === "lp"
        ? {
            id: "demo-lp",
            email: "lp-demo@mandateos.io",
            name: "LP Demo User",
            role: "lp",
            org: "MandateOS Demo Allocator",
          }
        : {
            id: "demo-gp",
            email: "gp-demo@mandateos.io",
            name: "GP Demo User",
            role: "gp",
            org: "Northstar Venture Partners",
          };

    return (
      <LPContext.Provider value={lpContextValue}>
        {demoWorkspace === "admin" ? (
          <AdminDashboard onLogout={closeDemoWorkspace} />
        ) : demoWorkspace === "diligence" ? (
          <DiligenceOSDemoWorkspace
            user={demoUser}
            onLogout={closeDemoWorkspace}
          />
        ) : demoWorkspace === "film" ? (
          <MarketplaceFilmDemoWorkspace
            user={demoUser}
            onLogout={closeDemoWorkspace}
          />
        ) : demoWorkspace === "lp" ? (
          USE_MARKETPLACE_DEMO ? (
            <MarketplaceLPDemoWorkspace
              user={demoUser}
              onLogout={closeDemoWorkspace}
              initialPage={demoInitialPage}
            />
          ) : (
            <LPWorkspace user={demoUser} onLogout={closeDemoWorkspace} />
          )
        ) : USE_MARKETPLACE_DEMO ? (
          <MarketplaceGPDemoWorkspace
            user={demoUser}
            onLogout={closeDemoWorkspace}
            initialPage={demoInitialPage}
          />
        ) : (
          <GPWorkspace user={demoUser} onLogout={closeDemoWorkspace} />
        )}
        <ToastContainer />
      </LPContext.Provider>
    );
  }

  // Merge Supabase user with profile row into a single user object for components
  const currentUser = authedUser
    ? {
        id: authedUser.id,
        email: authedUser.email,
        name:
          userProfile?.full_name ||
          authedUser.user_metadata?.full_name ||
          authedUser.email,
        role: normalizeUserRole(userProfile?.role),
        org: userProfile?.org || "",
      }
    : null;

  if (currentUser) {
    const workspaceByRole =
      currentUser.role === "admin" ? (
        <AdminWorkspace user={currentUser} onLogout={handleLogout} />
      ) : currentUser.role === "lp" ? (
        <LPWorkspace user={currentUser} onLogout={handleLogout} />
      ) : (
        <GPWorkspace user={currentUser} onLogout={handleLogout} />
      );

    return (
      <LPContext.Provider value={lpContextValue}>
        {workspaceByRole}
        <ToastContainer />
      </LPContext.Provider>
    );
  }

  return (
    <LPContext.Provider value={lpContextValue}>
      <div className="grain" />
      <Nav
        onOpenDemo={openDemo}
        onOpenPilot={openPilot}
        onOpenLogin={openLogin}
      />
      <Hero
        onOpenDemo={openDemo}
        onOpenGpDemo={openGpDemo}
        onOpenLpDemo={openLpDemo}
        onOpenDiligenceDemo={openDiligenceDemo}
      />
      <Problems />
      <ProductSnapshot />
      <ProductModules />
      <DemoSection />
      <PricingPreview />
      <CTA onOpenDemo={openDemo} onOpenPilot={openPilot} />
      <Footer />
      {USE_CAL_BOOKING_EXPERIENCE && (
        <CalBookingModal open={calBookingOpen} onClose={closeCalBooking} />
      )}
      <RequestAccessModal
        open={modalOpen}
        mode={modalMode}
        onClose={closeModal}
      />
      <ToastContainer />
    </LPContext.Provider>
  );
}
