import { useState, useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
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
/* ════════════════════════════════════════════
   DESIGN TOKENS
   Institutional dark — cooler than typical navy
   ════════════════════════════════════════════ */
const C = {
  black: "#050810",
  bg: "#080c18",
  raised: "#0c1124",
  surface: "#111730",
  surfaceHover: "#151d3a",
  card: "#0e1428",
  cardHover: "#121a34",
  border: "#1a2340",
  borderHover: "#253060",
  borderSubtle: "#141c35",

  accent: "#4f6af0",
  accentBright: "#6b82ff",
  accentDim: "#3a50c0",
  accentGhost: "#4f6af012",
  accentWash: "#4f6af01a",

  teal: "#14b8a6",
  tealWash: "#14b8a618",
  green: "#22c55e",
  greenWash: "#22c55e18",
  greenBorder: "#22c55e35",
  amber: "#f59e0b",
  amberWash: "#f59e0b18",
  amberBorder: "#f59e0b35",
  red: "#ef4444",
  redWash: "#ef444418",
  redBorder: "#ef444435",

  text: "#e4e9f2",
  textSoft: "#9aa3be",
  textMuted: "#5e6a88",
  white: "#fff",
};

/* ════════════════════════════════════════════
   GLOBAL STYLES
   ════════════════════════════════════════════ */
const injectStyles = () => {
  const existing = document.getElementById("capitalos-global-styles");
  if (existing) return;

  const s = document.createElement("style");
  s.id = "capitalos-global-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@400;500;600;700&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body {
      background:${C.black};
      color:${C.text};
      font-family:'Manrope',system-ui,-apple-system,sans-serif;
      -webkit-font-smoothing:antialiased;
      overflow-x:hidden;
      line-height:1.5;
    }
    ::selection { background:${C.accent}; color:white }
    ::-webkit-scrollbar { width:4px }
    ::-webkit-scrollbar-track { background:${C.black} }
    ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px }

    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes subtlePulse { 0%,100%{opacity:.5} 50%{opacity:1} }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(10px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(.92); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 20px ${C.accent}10; }
      50% { box-shadow: 0 0 40px ${C.accent}20; }
    }
    @keyframes borderGlow {
      0%, 100% { border-color: ${C.border}; }
      50% { border-color: ${C.accent}40; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .reveal { opacity:0; transform:translateY(20px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
    .reveal.visible { opacity:1; transform:translateY(0); }
    .fade-in { animation:fadeIn .35s ease both }
    .slide-in { animation: slideInRight .4s cubic-bezier(.22,1,.36,1) both }
    .scale-in { animation: scaleIn .3s cubic-bezier(.22,1,.36,1) both }

    input:focus, select:focus, textarea:focus {
      outline:none !important;
      border-color:${C.accent} !important;
      box-shadow:0 0 0 3px ${C.accentGhost}, 0 0 0 1px ${C.accent} !important;
    }
    button { font-family:inherit; }

    .grain {
      position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.025;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-repeat:repeat; background-size:180px;
    }

    @media (max-width: 768px) {
      .nav-desktop { display: none !important; }
      .nav-hamburger { display: flex !important; }
    }
    @media (min-width: 769px) {
      .nav-hamburger { display: none !important; }
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 16, 0.72);
      backdrop-filter: blur(10px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn .18s ease both;
    }

    .modal-panel {
      width: 100%;
      max-width: 560px;
      background: ${C.card};
      border: 1px solid ${C.border};
      border-radius: 18px;
      box-shadow: 0 30px 100px rgba(0,0,0,.5);
      animation: popIn .22s cubic-bezier(.22,1,.36,1) both;
      overflow: hidden;
    }
  `;
  document.head.appendChild(s);
};
injectStyles();

/* ════════════════════════════════════════════
   FIT ENGINE — REAL SCORING SYSTEM
   ════════════════════════════════════════════ */
const FIT_WEIGHTS = {
  sector: 30,
  checkSize: 25,
  geography: 15,
  strategy: 30,
};

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

function computeFitScore(gpProfile, lp) {
  let raw = 0;
  let maxRaw =
    FIT_WEIGHTS.sector +
    FIT_WEIGHTS.checkSize +
    FIT_WEIGHTS.geography +
    FIT_WEIGHTS.strategy;
  const reasons = [];

  // Strategy match (+30)
  const strategyMatch = lp.strategies.some(
    (s) => s.toLowerCase() === gpProfile.strategy.toLowerCase()
  );
  if (strategyMatch) {
    raw += FIT_WEIGHTS.strategy;
    reasons.push({
      ok: true,
      label: "Strategy",
      text: `Matches strategy: ${gpProfile.strategy}`,
    });
  } else {
    reasons.push({
      ok: false,
      label: "Strategy",
      text: `LP targets ${lp.strategies.join(", ")} — no ${
        gpProfile.strategy
      } mandate`,
    });
  }

  // Sector match (+30)
  const gpSectors = gpProfile.sectors || [];
  const overlapSectors = gpSectors.filter((s) => lp.sectors.includes(s));
  if (overlapSectors.length > 0) {
    const ratio = overlapSectors.length / Math.max(gpSectors.length, 1);
    raw += FIT_WEIGHTS.sector * ratio;
    reasons.push({
      ok: true,
      label: "Sector",
      text: `Matches sector${
        overlapSectors.length > 1 ? "s" : ""
      }: ${overlapSectors.join(", ")}`,
    });
  } else {
    reasons.push({
      ok: false,
      label: "Sector",
      text: `No sector overlap — LP targets ${lp.sectors
        .slice(0, 3)
        .join(", ")}`,
    });
  }

  // Check size overlap (+25)
  const gpMin = gpProfile.checkMin || 0;
  const gpMax = gpProfile.checkMax || 999;
  const overlap = Math.min(gpMax, lp.checkMax) - Math.max(gpMin, lp.checkMin);
  const range = Math.max(lp.checkMax - lp.checkMin, 1);
  if (overlap > 0) {
    const ratio = Math.min(overlap / range, 1);
    raw += FIT_WEIGHTS.checkSize * ratio;
    reasons.push({
      ok: true,
      label: "Check Size",
      text: `Check size aligned: $${lp.checkMin}-${lp.checkMax}M overlaps GP range`,
    });
  } else {
    reasons.push({
      ok: false,
      label: "Check Size",
      text: `Check size mismatch — LP range $${lp.checkMin}-${lp.checkMax}M`,
    });
  }

  // Geography match (+15)
  const geoMatch = lp.geographies.some(
    (g) =>
      g.toLowerCase() === gpProfile.geography.toLowerCase() ||
      g.toLowerCase() === "global"
  );
  if (geoMatch) {
    raw += FIT_WEIGHTS.geography;
    reasons.push({
      ok: true,
      label: "Geography",
      text: `Geography match: ${gpProfile.geography}`,
    });
  } else {
    reasons.push({
      ok: false,
      label: "Geography",
      text: `Geography mismatch — LP targets ${lp.geographies.join(", ")}`,
    });
  }

  const score = Math.round((raw / maxRaw) * 100);
  return { score, reasons, lp };
}

function runFitEngine(gpProfile, lpDb) {
  lpDb = lpDb || LP_DATABASE;
  const results = lpDb.map((lp) => computeFitScore(gpProfile, lp));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 15);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getScoreColor(score) {
  if (score >= 75) return C.green;
  if (score >= 45) return C.amber;
  return C.red;
}

function getScoreLabel(score) {
  if (score >= 75) return "Strong Fit";
  if (score >= 45) return "Partial Fit";
  return "Low Fit";
}

/* ════════════════════════════════════════════
   LOCALSTORAGE PERSISTENCE
   ════════════════════════════════════════════ */
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem("cos_" + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, val) {
  try {
    localStorage.setItem("cos_" + key, JSON.stringify(val));
  } catch {}
}

/* ════════════════════════════════════════════
   TOAST SYSTEM
   ════════════════════════════════════════════ */
let _toastCb = null;
function showToast(msg, type = "info") {
  if (_toastCb) _toastCb({ msg, type, id: Date.now() });
}

function ToastContainer() {
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
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            background:
              t.type === "success"
                ? C.green
                : t.type === "error"
                ? C.red
                : C.accent,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            animation: "popIn .25s cubic-bezier(.22,1,.36,1) both",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {t.type === "success" && (
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="7" fill="rgba(255,255,255,.25)" />
              <path
                d="M4 7l2 2 4-4"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          )}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   SKELETON CARD
   ════════════════════════════════════════════ */
function SkeletonCard() {
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

/* ════════════════════════════════════════════
   LP PROFILE MODAL
   ════════════════════════════════════════════ */
function LPProfileModal({ lp, score, reasons, onClose }) {
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
function GPProfileModal({ gp, onClose }) {
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
function ShortlistPanel({ open, onClose, items, onRemove }) {
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
function SearchBar({ value, onChange, placeholder = "Search..." }) {
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
function NotesPopover({ lpId, onClose }) {
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
function EmailSimModal({ lp, gp, onClose }) {
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
      }/100\n\nPlease let me know if you'd like to schedule a call.\n\nBest,\nCapitalOS Platform`
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
function useReveal(threshold = 0.12) {
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

function Reveal({ children, delay = 0, style: s = {}, className = "" }) {
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
function LogoMark({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="9" fill="url(#logoG)" />
      <path
        d="M16.5 10.5C12.36 10.5 9 13.86 9 18s3.36 7.5 7.5 7.5c2.1 0 4-.87 5.35-2.25"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="20.5"
        cy="18"
        r="5.8"
        stroke="white"
        strokeWidth="2.4"
        fill="none"
        opacity=".55"
      />
      <circle cx="24" cy="11.5" r="1.5" fill="white" opacity=".4" />
      <defs>
        <linearGradient
          id="logoG"
          x1="0"
          y1="0"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f6af0" />
          <stop offset="1" stopColor="#7c5bf0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoFull({ size = 32, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <LogoMark size={size} />
      <span
        style={{
          fontWeight: 750,
          fontSize: size * 0.52,
          letterSpacing: -0.4,
          color: C.text,
        }}
      >
        CapitalOS
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════ */
function Wrap({ children, style: s = {} }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px", ...s }}>
      {children}
    </div>
  );
}

function Mono({ children, color = C.text, size = 13, weight = 600 }) {
  return (
    <span
      style={{
        fontFamily: "'Source Code Pro',monospace",
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: -0.2,
      }}
    >
      {children}
    </span>
  );
}

function Pill({ children, color = C.accent, size }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "xs" ? "2px 7px" : "3px 10px",
        borderRadius: 6,
        fontSize: size === "xs" ? 10 : 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        background: color + "16",
        color,
        border: `1px solid ${color}28`,
        lineHeight: 1.1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Dot({ color = C.green, size = 7, pulse = false }) {
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

function Btn({
  children,
  variant = "primary",
  onClick,
  size = "md",
  disabled = false,
  style: sx = {},
  type = "button",
}) {
  const [h, setH] = useState(false);
  const pad = { lg: "13px 28px", md: "10px 22px", sm: "7px 16px" }[size];
  const fs = { lg: 15, md: 14, sm: 13 }[size];
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: pad,
    fontSize: fs,
    fontWeight: 650,
    borderRadius: 10,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    transition: "all .2s ease",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
  };
  const v = {
    primary: {
      background: h && !disabled ? C.accentBright : C.accent,
      color: C.white,
      boxShadow:
        h && !disabled
          ? `0 8px 28px ${C.accent}55`
          : `0 2px 12px ${C.accent}30`,
    },
    secondary: {
      background: h ? C.raised : "transparent",
      color: C.text,
      border: `1px solid ${h ? C.borderHover : C.border}`,
    },
    ghost: {
      background: "transparent",
      color: C.textSoft,
      padding: pad,
    },
    green: {
      background: h ? "#16a34a" : C.green,
      color: C.white,
      boxShadow: h ? `0 8px 28px ${C.green}45` : `0 2px 12px ${C.green}25`,
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

function Card({ children, style: s = {}, hover = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        background: h && hover ? C.cardHover : C.card,
        border: `1px solid ${h && hover ? C.borderHover : C.border}`,
        borderRadius: 14,
        padding: 24,
        transition: "all .25s ease",
        boxShadow:
          h && hover
            ? "0 12px 40px rgba(0,0,0,.35)"
            : "0 1px 4px rgba(0,0,0,.2)",
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
function FInput({
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
            padding: prefix ? "9px 12px 9px 24px" : "9px 12px",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            color: C.text,
            fontSize: 13.5,
            transition: "all .15s",
            fontFamily: mono ? "'Source Code Pro',monospace" : "inherit",
          }}
        />
      </div>
    </div>
  );
}

function FSelect({ label, options, value, onChange }) {
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
          padding: "9px 12px",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          color: C.text,
          fontSize: 13.5,
          appearance: "none",
          cursor: "pointer",
          transition: "all .15s",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 4l3 3 3-3' stroke='%235e6a88' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
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

function FTags({ label, options, selected, onChange }) {
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
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: 550,
                border: `1px solid ${on ? C.accent : C.border}`,
                background: on ? C.accentWash : "transparent",
                color: on ? C.accentBright : C.textSoft,
                cursor: "pointer",
                transition: "all .12s",
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

function Separator() {
  return <div style={{ height: 1, background: C.border, margin: "22px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={{ width: 18, height: 2, background: C.accent, borderRadius: 2 }}
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
        {children}
      </span>
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <h2
        style={{
          fontSize: "clamp(26px,3.5vw,42px)",
          fontWeight: 780,
          lineHeight: 1.12,
          letterSpacing: -0.6,
          marginBottom: sub ? 14 : 0,
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: 16,
            color: C.textSoft,
            lineHeight: 1.65,
            maxWidth: 540,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function StatBox({ label, value, color = C.accent }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: C.bg,
        borderRadius: 10,
        border: `1px solid ${C.borderSubtle}`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <Mono size={22} weight={700} color={color}>
        {value}
      </Mono>
    </div>
  );
}

function THead({ cols, template }) {
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

function TRow({ children, template }) {
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
function RequestAccessModal({ open, mode = "login", onClose }) {
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
    ? "Sign in to your CapitalOS workspace."
    : isDemo
    ? "Tell us about yourself and we’ll schedule a personalized walkthrough."
    : "CapitalOS is invite-only. Apply below and we’ll be in touch if there’s a fit.";

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
                CapitalOS
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
function Nav({ onOpenDemo, onOpenPilot, onOpenLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { t: "Platform", id: "platform" },
    { t: "Demo", id: "demo" },
    { t: "About", id: "about" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
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
          height: 60,
          background: scrolled ? C.black + "ee" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all .3s ease",
        }}
      >
        <Wrap
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LogoFull
              size={28}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <Pill color={C.teal}>Beta</Pill>
          </div>
          {/* Desktop Nav */}
          <div
            className="nav-desktop"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {navItems.map((n) => (
              <button
                key={n.t}
                onClick={() => scrollTo(n.id)}
                style={{
                  color: C.textSoft,
                  textDecoration: "none",
                  fontSize: 13.5,
                  fontWeight: 550,
                  padding: "6px 14px",
                  borderRadius: 8,
                  transition: "all .15s",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.background = C.raised;
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
              style={{
                width: 1,
                height: 20,
                background: C.border,
                margin: "0 8px",
              }}
            />
            <Btn variant="ghost" size="sm" onClick={onOpenLogin}>
              Log in
            </Btn>
            <Btn variant="primary" size="sm" onClick={onOpenPilot}>
              Join Pilot Program
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
            top: 60,
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
              onClick={() => scrollTo(n.id)}
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
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              onOpenLogin();
              setMobileOpen(false);
            }}
          >
            Log in
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => {
              onOpenPilot();
              setMobileOpen(false);
            }}
          >
            Join Pilot Program
          </Btn>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */

function Hero({ onOpenDemo, onOpenPilot }) {
  const productRows = [
    {
      name: "Pacific Endowment",
      strategy: "Venture",
      region: "North America",
      score: "94%",
      tone: C.green,
    },
    {
      name: "Harborview Allocators",
      strategy: "Growth",
      region: "Global",
      score: "88%",
      tone: C.accentBright,
    },
    {
      name: "Blue Peak Foundation",
      strategy: "Venture",
      region: "North America",
      score: "82%",
      tone: C.teal,
    },
  ];

  const dashboardStats = [
    { label: "Active LPs", value: "142" },
    { label: "Avg Fit Score", value: "78" },
    { label: "Time to Match", value: "< 48h" },
  ];

  return (
    <section
      style={{
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 15%, ${C.accent}07, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border}0d 1px, transparent 1px), linear-gradient(90deg, ${C.border}0d 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "18%",
          width: 540,
          height: 540,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}10, transparent 60%)`,
          filter: "blur(110px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "34%",
          left: "8%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal}07, transparent 60%)`,
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 240,
          background: `linear-gradient(to top, ${C.black}, transparent)`,
        }}
      />

      <Wrap
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          paddingTop: 0,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.02fr) minmax(420px, 0.98fr)",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <Reveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 16px 5px 8px",
                  borderRadius: 100,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  marginBottom: 22,
                }}
              >
                <Dot color={C.green} pulse />
                <span
                  style={{ fontSize: 13, color: C.textSoft, fontWeight: 550 }}
                >
                  Accepting pilot applications for Q2 2026
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                style={{
                  fontSize: "clamp(42px,6.2vw,76px)",
                  fontWeight: 820,
                  lineHeight: 1.02,
                  letterSpacing: -2.7,
                  marginBottom: 24,
                  maxWidth: 760,
                }}
              >
                Capital Intelligence for{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #9b8cff 0%, #6c63ff 34%, #56c2ff 72%, #b6a7ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "180% 180%",
                    filter: "drop-shadow(0 10px 30px rgba(108,99,255,0.20))",
                  }}
                >
                  Private Markets
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p
                style={{
                  fontSize: "clamp(16px,1.7vw,19px)",
                  color: "rgba(203, 213, 235, 0.82)",
                  lineHeight: 1.72,
                  maxWidth: 600,
                  marginBottom: 34,
                  letterSpacing: "-0.01em",
                }}
              >
                Standardize LP mandates, GP submissions, and fit scoring in one
                workflow.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  marginBottom: 34,
                }}
              >
                <Btn variant="primary" size="lg" onClick={onOpenDemo}>
                  Request Demo
                </Btn>
                <Btn
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("demo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polygon points="5,3 11,7 5,11" fill="currentColor" />
                  </svg>
                  Try Interactive Demo
                </Btn>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div
                style={{
                  display: "inline-flex",
                  gap: 1,
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(120,130,255,0.22), rgba(80,210,255,0.10))",
                  borderRadius: 18,
                  overflow: "hidden",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.03) inset",
                }}
              >
                {dashboardStats.map((s, i) => (
                  <div
                    key={s.label}
                    style={{
                      padding: "18px 30px",
                      background:
                        i % 2 === 0
                          ? "linear-gradient(180deg, rgba(13,18,38,0.96) 0%, rgba(9,13,28,0.98) 100%)"
                          : "linear-gradient(180deg, rgba(16,22,46,0.96) 0%, rgba(10,14,30,0.98) 100%)",
                      textAlign: "center",
                      minWidth: 152,
                      borderLeft:
                        i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <Mono
                      size={22}
                      weight={750}
                      style={{
                        color: "#f7f9ff",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {s.value}
                    </Mono>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "rgba(148, 163, 184, 0.9)",
                        marginTop: 5,
                        fontWeight: 650,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div
              style={{
                position: "relative",
                minHeight: 540,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 360,
                  height: 360,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(108,99,255,0.24) 0%, rgba(108,99,255,0.12) 28%, rgba(108,99,255,0) 72%)",
                  filter: "blur(68px)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 0,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(79,209,255,0.14) 0%, rgba(79,209,255,0.07) 34%, rgba(79,209,255,0) 74%)",
                  filter: "blur(64px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 640,
                  borderRadius: 32,
                  background:
                    "linear-gradient(180deg, rgba(18,24,52,0.97) 0%, rgba(8,12,26,0.99) 100%)",
                  border: "1px solid rgba(129,140,248,0.20)",
                  boxShadow:
                    "0 50px 140px rgba(2,6,23,0.70), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 90px rgba(108,99,255,0.14)",
                  overflow: "hidden",
                  transform: "perspective(1800px) rotateY(-9deg) rotateX(6deg)",
                  transformOrigin: "center left",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 18%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ display: "flex", gap: 7 }}>
                      {["#ff5f57", "#ffbd2f", "#28c840"].map((dot) => (
                        <span
                          key={dot}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: dot,
                            display: "inline-block",
                            boxShadow: `0 0 12px ${dot}55`,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "rgba(226, 232, 240, 0.88)",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      CapitalOS · Match Workspace
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Pill color={C.green}>Live mandate</Pill>
                    <Pill color={C.accentBright}>12 new matches</Pill>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "230px minmax(0, 1fr)",
                    minHeight: 450,
                  }}
                >
                  <div
                    style={{
                      borderRight: "1px solid rgba(255,255,255,0.05)",
                      padding: 18,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.00) 100%)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(148, 163, 184, 0.85)",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      Active mandate
                    </div>

                    <div
                      style={{
                        padding: 15,
                        borderRadius: 18,
                        background:
                          "linear-gradient(180deg, rgba(7,11,24,0.95) 0%, rgba(10,14,30,0.98) 100%)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow:
                          "0 14px 34px rgba(0,0,0,0.24), 0 0 0 1px rgba(255,255,255,0.02) inset",
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14.5,
                          fontWeight: 760,
                          marginBottom: 6,
                          color: "#f8fbff",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Fund III · Growth / Venture
                      </div>

                      <div
                        style={{
                          fontSize: 12.5,
                          color: "rgba(191, 203, 224, 0.78)",
                          lineHeight: 1.62,
                          marginBottom: 12,
                        }}
                      >
                        North America · $8M–$20M checks · Enterprise SaaS,
                        Fintech, AI / Data
                      </div>

                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <Pill color={C.accentBright}>Enterprise SaaS</Pill>
                        <Pill color={C.teal}>Fintech</Pill>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(148, 163, 184, 0.85)",
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      Pipeline
                    </div>

                    {[
                      ["Sourced", 48],
                      ["Contacted", 19],
                      ["In DD", 7],
                      ["Closed", 2],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "13px 14px",
                          borderRadius: 16,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          marginBottom: 10,
                          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "rgba(226,232,240,0.88)",
                            fontWeight: 600,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            color: "#f8fbff",
                            fontWeight: 760,
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div style={{ padding: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                        marginBottom: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textMuted,
                            marginBottom: 4,
                          }}
                        >
                          Top matches
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 760 }}>
                          Ranked LP Coverage
                        </div>
                      </div>
                      <div
                        style={{
                          minWidth: 180,
                          flex: "0 0 220px",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: `1px solid ${C.border}`,
                          background: C.bg,
                          color: C.textMuted,
                          fontSize: 12.5,
                        }}
                      >
                        Search LPs, mandates, notes...
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                      {productRows.map((row, index) => (
                        <div
                          key={row.name}
                          style={{
                            padding: 14,
                            borderRadius: 16,
                            border: `1px solid ${C.border}`,
                            background:
                              index === 0
                                ? "linear-gradient(135deg, rgba(91,124,240,.12), rgba(124,91,240,.07))"
                                : C.bg,
                            boxShadow:
                              index === 0
                                ? "0 0 0 1px rgba(124,91,240,.08), inset 0 1px 0 rgba(255,255,255,.02)"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, rgba(79,106,240,.28), rgba(124,91,240,.18))",
                                  border: `1px solid ${C.borderHover}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: C.text,
                                  flexShrink: 0,
                                }}
                              >
                                {row.name
                                  .split(" ")
                                  .map((p) => p[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 720,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12.5,
                                    color: C.textSoft,
                                    marginTop: 4,
                                  }}
                                >
                                  {row.strategy} · {row.region}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                padding: "7px 10px",
                                borderRadius: 999,
                                border: `1px solid ${row.tone}33`,
                                background: `${row.tone}14`,
                                color: row.tone,
                                fontSize: 12,
                                fontWeight: 750,
                                flexShrink: 0,
                              }}
                            >
                              {row.score}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 8,
                            }}
                          >
                            {[
                              "Sector overlap: Fintech, SaaS",
                              "Check size aligned",
                              "Actively deploying",
                              "Warm intro available",
                            ].map((item) => (
                              <div
                                key={item}
                                style={{
                                  padding: "8px 10px",
                                  borderRadius: 10,
                                  background: "rgba(255,255,255,.02)",
                                  border: `1px solid ${C.borderSubtle}`,
                                  fontSize: 11.5,
                                  color: C.textSoft,
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
                        display: "grid",
                        gridTemplateColumns: "1.2fr .8fr",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: C.textMuted,
                            fontWeight: 700,
                            marginBottom: 8,
                          }}
                        >
                          Recent activity
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {[
                            "Saved Pacific Endowment to shortlist",
                            "Generated intro draft for Harborview",
                            "Re-ran Fund III mandate against 48 LPs",
                          ].map((item) => (
                            <div
                              key={item}
                              style={{
                                fontSize: 12.5,
                                color: C.textSoft,
                                padding: "8px 0",
                                borderBottom: `1px solid ${C.borderSubtle}`,
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            color: C.textMuted,
                            fontWeight: 700,
                            marginBottom: 8,
                          }}
                        >
                          Conversion
                        </div>
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 820,
                            letterSpacing: -1,
                            marginBottom: 4,
                          }}
                        >
                          27%
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: C.textSoft,
                            lineHeight: 1.6,
                          }}
                        >
                          Higher response rate on LPs with structured mandate
                          alignment.
                        </div>
                      </div>
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
   PRODUCT SNAPSHOT — "See CapitalOS in Action"
   ════════════════════════════════════════════ */
function ProductSnapshot() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const matches = [
    {
      name: "Ribbit Capital",
      score: 92,
      tag: "Multi-strategy · Global",
      c: C.green,
    },
    {
      name: "Pritzker Group",
      score: 89,
      tag: "Buyout · North America",
      c: C.green,
    },
    {
      name: "Hall Capital Partners",
      score: 87,
      tag: "Secondaries · Global",
      c: C.accent,
    },
    {
      name: "Willett Advisors",
      score: 83,
      tag: "Buyout · North America",
      c: C.accent,
    },
    {
      name: "Ontario Teachers'",
      score: 79,
      tag: "Multi-strategy · NA",
      c: C.amber,
    },
  ];

  return (
    <section style={{ padding: "120px 0", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}06, transparent 60%)`,
          filter: "blur(120px)",
        }}
      />

      <Wrap style={{ position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 60,
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
                  marginBottom: 20,
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
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: -1,
                  marginBottom: 18,
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
                onMouseEnter={() => setHoveredCard("match")}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: "22px 26px",
                  borderRadius: 18,
                  background:
                    "linear-gradient(180deg, rgba(14,20,40,.97), rgba(10,15,30,.98))",
                  border: `1px solid ${
                    hoveredCard === "match" ? C.borderHover : C.border
                  }`,
                  boxShadow:
                    hoveredCard === "match"
                      ? "0 20px 60px rgba(0,0,0,.45)"
                      : "0 12px 40px rgba(0,0,0,.35)",
                  transform:
                    hoveredCard === "match" ? "translateY(-3px)" : "none",
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
                    <Dot color={C.green} pulse size={5} />
                    <span
                      style={{
                        fontSize: 10.5,
                        color: C.green,
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
                      { label: "Intro", n: 5, c: C.accent },
                      { label: "DD", n: 3, c: C.amber },
                      { label: "Closed", n: 1, c: C.green },
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
                  <Mono size={24} weight={800} color={C.green}>
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
                        background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
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
                          <circle cx="6" cy="6" r="6" fill={C.greenWash} />
                          <path
                            d="M3.5 6l1.5 1.5 3.5-3.5"
                            stroke={C.green}
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
function Problems() {
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

  return (
    <section
      style={{
        padding: "80px 0 100px",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <Wrap>
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            {/* Left: headline */}
            <div style={{ position: "sticky", top: 80 }}>
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
                  fontSize: "clamp(30px,4vw,48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  marginBottom: 20,
                  maxWidth: 520,
                }}
              >
                Private Capital runs on relationships — not merit.
              </h2>

              <p
                style={{
                  fontSize: 15,
                  color: C.textSoft,
                  lineHeight: 1.75,
                  maxWidth: 420,
                  marginBottom: 40,
                }}
              >
                Private markets still depend on fragmented networks, repeated
                diligence, and unclear mandate fits.
              </p>

              {/* Selector tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {rows.map((r, i) => {
                  const isActive = active === i;

                  return (
                    <button
                      key={r.n}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
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
            <div>
              {rows.map((r, i) => {
                const isActive = active === i;

                return (
                  <div
                    key={r.n}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      marginBottom: 12,
                      padding: "24px",
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
                        fontSize: 18,
                        fontWeight: 600,
                        color: C.white,
                        marginBottom: 10,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {r.t}
                    </div>

                    <div
                      style={{
                        position: "relative",
                        fontSize: 14,
                        color: C.textSoft,
                        lineHeight: 1.7,
                        marginBottom: isActive ? 16 : 0,
                        transition: "margin-bottom .2s ease",
                        maxWidth: 520,
                      }}
                    >
                      {r.d}
                    </div>

                    {isActive && (
                      <div
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
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRODUCT MODULES
   ════════════════════════════════════════════ */
function ProductModules() {
  const [hoveredMod, setHoveredMod] = useState(null);

  const mods = [
    {
      tag: "LP",
      name: "Mandate Profile Builder",
      d: "Institutional intake for strategy, check size, sector focus, geography, exclusions, pacing, co-invest appetite, and diligence requirements.",
      c: C.green,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 9.5h8M8 13h8M8 16.5h5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      tag: "GP",
      name: "Fund Submission Profile",
      d: "Standardized manager profiles across strategy, team, realized track record, target raise, terms, references, and supporting diligence materials.",
      c: "#8b6cf0",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L4 7.2 12 11.4 20 7.2 12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 12.2L12 16.4 20 12.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 17.2L12 21 20 17.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      tag: "Core",
      name: "Mandate-Fit Engine",
      d: "A transparent scoring engine that evaluates strategy, structure, geography, ticket size, pacing, and exclusions to rank the highest-conviction LP-manager matches.",
      c: C.accent,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 7.5v4.5l3.2 2.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      tag: "Ops",
      name: "Diligence Intake Hub",
      d: "Centralize DDQs, legal documents, track records, references, and supporting files so managers submit once and reuse everywhere.",
      c: C.amber,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 9.5h8M8 13h8M8 16.5h5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      tag: "Privacy",
      name: "Permissioned Reveal",
      d: "Preserve confidentiality until both sides are ready. LP identity, diligence access, and disclosure timing stay permissioned and controlled.",
      c: C.teal,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L19 6v5c0 5-3.3 8.3-7 10-3.7-1.7-7-5-7-10V6l7-3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12.2 11 14l3.8-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      tag: "Connect",
      name: "Email Introductions",
      d: "Simulate a warm intro with fit score, mandate context, and next-step recommendations so outreach feels qualified from the first touch.",
      c: "#e879f9",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4.5 7l7.5 5.6L19.5 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="platform"
      style={{
        padding: "132px 0",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
              radial-gradient(circle at 18% 22%, ${C.accent}10, transparent 30%),
              radial-gradient(circle at 82% 24%, ${C.teal}08, transparent 26%),
              radial-gradient(circle at 50% 72%, rgba(139,108,240,0.06), transparent 34%)
            `,
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          left: "-10%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `${C.accent}08`,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-8%",
          top: "24%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `${C.teal}07`,
          filter: "blur(125px)",
          pointerEvents: "none",
        }}
      />

      <Wrap style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.borderSubtle || C.border}`,
              marginBottom: 22,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.accent,
                boxShadow: `0 0 20px ${C.accent}66`,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Platform Modules
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, .8fr)",
              gap: 28,
              alignItems: "end",
              marginBottom: 42,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(32px,4.2vw,54px)",
                  lineHeight: 1.02,
                  letterSpacing: -1.6,
                  fontWeight: 800,
                  marginBottom: 16,
                  maxWidth: 760,
                }}
              >
                One institutional system for the{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.accent}, #8b6cf0, #b794f6)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  full LP–GP workflow
                </span>
              </h2>

              <p
                style={{
                  maxWidth: 700,
                  color: C.textSoft,
                  fontSize: 16.5,
                  lineHeight: 1.72,
                }}
              >
                Replace scattered decks, disconnected CRM notes, repeated DDQs,
                and opaque matching with a platform that feels structured,
                permissioned, and built for institutional capital formation.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {[
                { k: "6", v: "Core modules" },
                { k: "1x", v: "Shared data layer" },
                { k: "360°", v: "Lifecycle coverage" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 14px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.028)",
                    border: `1px solid ${C.borderSubtle || C.border}`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 780,
                      letterSpacing: -0.4,
                      marginBottom: 4,
                    }}
                  >
                    {item.k}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: C.textMuted,
                      lineHeight: 1.45,
                    }}
                  >
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: 14,
              background: "rgba(255,255,255,0.015)",
              border: `1px solid ${C.borderSubtle || C.border}`,
              boxShadow:
                "0 18px 50px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.035)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 28,
                padding: 1,
                background: `linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.015), rgba(139,108,240,0.08))`,
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
                alignItems: "stretch",
                gridAutoRows: "1fr",
              }}
            >
              {mods.map((m, i) => {
                const isHovered = hoveredMod === i;

                return (
                  <Reveal key={i} delay={150 + i * 50}>
                    <div
                      onMouseEnter={() => setHoveredMod(i)}
                      onMouseLeave={() => setHoveredMod(null)}
                      style={{
                        position: "relative",
                        minHeight: 290,
                        height: "100%",
                        padding: "24px 22px 22px",
                        borderRadius: 22,
                        overflow: "hidden",
                        background: isHovered
                          ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))"
                          : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.018))",
                        border: `1px solid ${
                          isHovered ? `${m.c}38` : C.borderSubtle || C.border
                        }`,
                        boxShadow: isHovered
                          ? "0 18px 44px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
                          : "inset 0 1px 0 rgba(255,255,255,0.03)",
                        transform: isHovered
                          ? "translateY(-4px)"
                          : "translateY(0)",
                        transition:
                          "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s cubic-bezier(.22,1,.36,1), border-color .3s ease, background .3s ease",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: `linear-gradient(90deg, transparent, ${m.c}, transparent)`,
                          opacity: isHovered ? 1 : 0.45,
                          transition: "opacity .3s ease",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 22,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 14,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isHovered ? m.c : C.textMuted,
                              background: isHovered
                                ? `${m.c}14`
                                : "rgba(255,255,255,0.03)",
                              border: `1px solid ${
                                isHovered
                                  ? `${m.c}32`
                                  : C.borderSubtle || C.border
                              }`,
                              boxShadow: isHovered
                                ? `0 0 0 4px ${m.c}08`
                                : "none",
                              transition: "all .3s ease",
                            }}
                          >
                            {m.icon}
                          </div>

                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                              background: `${m.c}14`,
                              color: m.c,
                              border: `1px solid ${m.c}22`,
                            }}
                          >
                            {m.tag}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 760,
                          letterSpacing: -0.45,
                          lineHeight: 1.12,
                          marginBottom: 12,
                          maxWidth: 320,
                        }}
                      >
                        {m.name}
                      </div>

                      <div
                        style={{
                          fontSize: 13.5,
                          color: C.textSoft,
                          lineHeight: 1.72,
                          maxWidth: 340,
                          flex: 1,
                        }}
                      >
                        {m.d}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   INTERACTIVE DEMO
   ════════════════════════════════════════════ */
function DemoSection() {
  const [tab, setTab] = useState("lp");
  const tabs = [
    { id: "lp", label: "LP Mandate Builder", pill: "LP" },
    { id: "gp", label: "GP Submission", pill: "GP" },
    { id: "fit", label: "Fit Engine", pill: "Core" },
    { id: "reveal", label: "Reveal Flow", pill: "Privacy" },
  ];
  return (
    <section id="demo" style={{ padding: "120px 0" }}>
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
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: "clamp(32px,4.2vw,54px)",
                lineHeight: 1.02,
                letterSpacing: -1.6,
                fontWeight: 800,
                marginBottom: 16,
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
                fontSize: 16,
                color: C.textSoft,
                lineHeight: 1.65,
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
              background: C.card,
              boxShadow: "0 24px 80px rgba(0,0,0,.4)",
            }}
          >
            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${C.border}`,
                background: C.raised,
                padding: "0 4px",
                overflowX: "auto",
              }}
            >
              {tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      padding: "13px 20px",
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${
                        active ? C.accent : "transparent"
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
                        background: active ? C.accentWash : C.bg,
                        color: active ? C.accent : C.textMuted,
                      }}
                    >
                      {t.pill}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div
              style={{ padding: 28, minHeight: 520 }}
              key={tab}
              className="fade-in"
            >
              {tab === "lp" && <DemoLP />}
              {tab === "gp" && <DemoGP />}
              {tab === "fit" && <DemoFit />}
              {tab === "reveal" && <DemoReveal />}
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
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
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

function DemoLP() {
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
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
          {saved && (
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
            Publish Mandate
          </Btn>
        </div>
      </div>
    </div>
  );
}

function DemoGP() {
  const [fund, setFund] = useState("Meridian Ventures Fund III");
  const [strat, setStrat] = useState("Venture Capital");
  const [sz, setSz] = useState("150");
  const [geo, setGeo] = useState("North America");
  const [team, setTeam] = useState("4");
  const [moic, setMoic] = useState("2.1");
  const [irr, setIrr] = useState("28.4");
  const [sub, setSub] = useState(false);
  const tmpl = "2.2fr 1fr 1fr 1fr";
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
        Submit your profile once. CapitalOS matches it against active LP
        mandates in real time.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
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
        {sub && (
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
          Submit to Matching
        </Btn>
      </div>
    </div>
  );
}

function DemoFit() {
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
      const r = runFitEngine(profile, lpDb);
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
  const avgScore =
    results && results.length
      ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
      : 0;

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
                Will score against {lpDb.length} active LP mandates
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
                Scoring {lpDb.length} mandates for {fundName || "your fund"}
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
                  </div>
                </div>
                <Btn variant="secondary" size="sm" onClick={reset}>
                  ← Edit & Re-run
                </Btn>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  { l: "Strong Fit", n: strongCount, c: C.green },
                  { l: "Partial Fit", n: partialCount, c: C.amber },
                  { l: "Low Fit", n: lowCount, c: C.red },
                  { l: "Avg Score", n: avgScore, c: C.accent },
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
                flex: 1,
                minHeight: 0,
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
                          i * 0.03
                        }s both`,
                        transition: "background .15s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.cardHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
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
                            height: 4,
                            borderRadius: 2,
                            background: C.borderSubtle,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${r.score}%`,
                              height: "100%",
                              borderRadius: 2,
                              background: sc,
                              transition: "width .6s cubic-bezier(.22,1,.36,1)",
                            }}
                          />
                        </div>
                        <Mono size={12} weight={700} color={sc}>
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

function DemoReveal() {
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
function Dashboards() {
  const [v, setV] = useState("lp");
  return (
    <section style={{ padding: "120px 0", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "30%",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${
            v === "lp" ? C.green : "#8b6cf0"
          }05, transparent 65%)`,
          filter: "blur(100px)",
          transition: "all 1s ease",
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
              Product Screens
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(26px,3.5vw,42px)",
                  fontWeight: 780,
                  lineHeight: 1.12,
                  letterSpacing: -0.6,
                  marginBottom: 10,
                }}
              >
                Built for both sides of the table
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: C.textSoft,
                  lineHeight: 1.65,
                  maxWidth: 480,
                }}
              >
                Purpose-built interfaces for institutional capital workflows.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 3,
                background: C.raised,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
              }}
            >
              {[
                { id: "lp", label: "LP Dashboard", c: C.green },
                { id: "gp", label: "GP Dashboard", c: "#8b6cf0" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setV(t.id)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 650,
                    cursor: "pointer",
                    border: "none",
                    background: v === t.id ? C.surface : "transparent",
                    color: v === t.id ? C.text : C.textMuted,
                    transition: "all .2s ease",
                    boxShadow: v === t.id ? `0 2px 8px rgba(0,0,0,.3)` : "none",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              background: C.black,
              boxShadow: `0 30px 100px rgba(0,0,0,.5), 0 0 60px ${
                v === "lp" ? C.green : "#8b6cf0"
              }04`,
              transition: "box-shadow 1s ease",
            }}
            key={v}
          >
            <DashBar label={v === "lp" ? "LP Portal" : "GP Portal"} />
            <div
              style={{ padding: 22, background: C.card }}
              className="fade-in"
            >
              {v === "lp" ? <LPDash /> : <GPDash />}
            </div>
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
        <span style={{ fontWeight: 650, fontSize: 12.5 }}>CapitalOS</span>
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
   WHY SECTION
   ════════════════════════════════════════════ */
function WhySection() {
  const [hoveredImpact, setHoveredImpact] = useState(null);
  const items = [
    {
      t: "Merit-Based Access",
      d: "Mandate-fit scoring surfaces qualified managers regardless of existing networks. Allocators discover talent they would otherwise miss.",
      c: C.green,
      stat: "3.2x",
      statLabel: "More qualified matches",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      t: "Eliminate Wasted Effort",
      d: "Every interaction pre-filtered through structured criteria. No more blind outreach, no more irrelevant pitches clogging the pipeline.",
      c: C.accent,
      stat: "70%",
      statLabel: "Less time screening",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 7v5l3 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      t: "Shared Standards",
      d: "Common formats for mandates, profiles, and diligence create an interoperable language across the entire LP-GP lifecycle.",
      c: C.teal,
      stat: "1",
      statLabel: "Unified platform",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];
  return (
    <section id="about" style={{ padding: "120px 0", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.accent}04, transparent 65%)`,
          filter: "blur(100px)",
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
                background: C.teal,
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: C.teal,
              }}
            >
              Impact
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 780,
                lineHeight: 1.12,
                letterSpacing: -0.6,
                maxWidth: 500,
              }}
            >
              The infrastructure private markets have been waiting for
            </h2>
            <p
              style={{
                fontSize: 15,
                color: C.textSoft,
                maxWidth: 360,
                lineHeight: 1.65,
              }}
            >
              Built from first principles to replace fragmented workflows with
              institutional-grade matching.
            </p>
          </div>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            background: C.border,
          }}
        >
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div
                onMouseEnter={() => setHoveredImpact(i)}
                onMouseLeave={() => setHoveredImpact(null)}
                style={{
                  padding: "36px 30px",
                  background: hoveredImpact === i ? C.cardHover : C.card,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .3s cubic-bezier(.22,1,.36,1)",
                  cursor: "default",
                }}
              >
                {/* Hover accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${item.c}, transparent)`,
                    opacity: hoveredImpact === i ? 1 : 0.4,
                    transition: "opacity .3s ease",
                  }}
                />

                {/* Icon + Stat row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <Mono
                      size={44}
                      weight={800}
                      color={hoveredImpact === i ? item.c : item.c + "80"}
                    >
                      {item.stat}
                    </Mono>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.textMuted,
                        fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      {item.statLabel}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: hoveredImpact === i ? item.c + "14" : C.bg,
                      border: `1px solid ${
                        hoveredImpact === i ? item.c + "30" : C.borderSubtle
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: hoveredImpact === i ? item.c : C.textMuted,
                      transition: "all .3s ease",
                    }}
                  >
                    {item.icon}
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
                  {item.t}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: C.textSoft,
                    lineHeight: 1.65,
                  }}
                >
                  {item.d}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS — EDITORIAL GRADE
   ════════════════════════════════════════════ */
function Testimonials() {
  const [active, setActive] = useState(0);
  const quotes = [
    {
      q: "CapitalOS surfaced 3 emerging managers we never would have found through our existing network. Two are now in our portfolio.",
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
      q: "As a Fund I manager, getting in front of the right allocators was our biggest challenge. CapitalOS changed that entirely.",
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
      style={{ padding: "120px 0", position: "relative", overflow: "hidden" }}
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
        padding: "100px 0",
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
function PricingPreview() {
  const [hoverPlan, setHoverPlan] = useState(null);
  return (
    <section style={{ padding: "120px 0" }}>
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
          <div style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 780,
                lineHeight: 1.12,
                letterSpacing: -0.6,
                marginBottom: 14,
              }}
            >
              Built for institutions
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.textSoft,
                lineHeight: 1.65,
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
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              maxWidth: 780,
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
                padding: "36px 32px",
                background: hoverPlan === "pilot" ? C.cardHover : C.card,
                transition: "all .25s ease",
                position: "relative",
              }}
            >
              <Pill color={C.accent}>Pilot Program</Pill>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  marginTop: 16,
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
                padding: "36px 32px",
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
                  fontSize: 40,
                  fontWeight: 800,
                  marginTop: 16,
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
function CTA({ onOpenDemo, onOpenPilot }) {
  return (
    <section
      style={{
        padding: "140px 0 120px",
        position: "relative",
        overflow: "hidden",
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
        }}
      />

      <Wrap style={{ position: "relative", textAlign: "center" }}>
        <Reveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
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
              Get Started
            </span>
            <div
              style={{
                width: 18,
                height: 2,
                background: C.accent,
                borderRadius: 2,
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h2
            style={{
              fontSize: "clamp(34px,5.5vw,60px)",
              fontWeight: 820,
              lineHeight: 1.06,
              letterSpacing: -2,
              marginBottom: 22,
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
              fontSize: 18,
              color: C.textSoft,
              maxWidth: 500,
              margin: "0 auto 42px",
              lineHeight: 1.7,
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
              marginBottom: 48,
            }}
          >
            <Btn
              variant="primary"
              size="lg"
              onClick={onOpenDemo}
              style={{ padding: "15px 36px", fontSize: 16 }}
            >
              Request Demo
            </Btn>
            <Btn
              variant="secondary"
              size="lg"
              onClick={onOpenPilot}
              style={{ padding: "15px 36px", fontSize: 16 }}
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

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{ borderTop: `1px solid ${C.border}`, padding: "48px 0 32px" }}
    >
      <Wrap>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 40,
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
          {[
            {
              t: "Product",
              items: ["Platform", "Fit Engine", "Mandates", "Diligence Hub"],
            },
            { t: "Company", items: ["About", "Careers", "Blog", "Contact"] },
            { t: "Legal", items: ["Privacy", "Terms", "Security", "SOC 2"] },
          ].map((col) => (
            <div key={col.t}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 750,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 14,
                }}
              >
                {col.t}
              </div>
              {col.items.map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: 13,
                    color: C.textSoft,
                    padding: "4px 0",
                    cursor: "pointer",
                    transition: "color .15s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = C.text)}
                  onMouseOut={(e) => (e.target.style.color = C.textSoft)}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
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
            © 2026 CapitalOS, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Twitter", "LinkedIn", "GitHub"].map((l) => (
              <span
                key={l}
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "color .15s",
                }}
                onMouseOver={(e) => (e.target.style.color = C.textSoft)}
                onMouseOut={(e) => (e.target.style.color = C.textMuted)}
              >
                {l}
              </span>
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

function getStoredToken() {
  return localStorage.getItem("capitalos_token") || "";
}

function clearStoredToken() {
  localStorage.removeItem("capitalos_token");
}

async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function WorkspaceSidebar({ page, setPage, onLogout, user }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "applications", label: "Applications" },
    { id: "profile", label: "Profile" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div
      style={{
        width: 240,
        background: C.raised,
        borderRight: `1px solid ${C.border}`,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <LogoFull size={26} />
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: C.bg,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
          Logged in as
        </div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          {user?.name || "User"}
        </div>
        <div style={{ fontSize: 12, color: C.textSoft, marginTop: 2 }}>
          {user?.email || ""}
        </div>
        <div style={{ marginTop: 10 }}>
          <Pill color={C.teal}>{user?.role || "user"}</Pill>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                textAlign: "left",
                padding: "11px 12px",
                borderRadius: 10,
                border: `1px solid ${active ? C.accent : C.border}`,
                background: active ? C.accentWash : "transparent",
                color: active ? C.accentBright : C.textSoft,
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto" }}>
        <Btn
          variant="secondary"
          size="sm"
          onClick={onLogout}
          style={{ width: "100%" }}
        >
          Log Out
        </Btn>
      </div>
    </div>
  );
}

function WorkspaceTopbar({ title, refresh, refreshing }) {
  return (
    <div
      style={{
        height: 64,
        borderBottom: `1px solid ${C.border}`,
        background: C.black + "ee",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 780 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
          CapitalOS Workspace
        </div>
      </div>

      <Btn
        variant="secondary"
        size="sm"
        onClick={refresh}
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "Refresh"}
      </Btn>
    </div>
  );
}

function WorkspaceDashboard({ dashboard }) {
  const totals = dashboard?.totals || {};
  const byStatus = dashboard?.byStatus || {};
  const recentApplications = dashboard?.recentApplications || [];
  const recentActivity = dashboard?.recentActivity || [];

  return (
    <div style={{ padding: 22 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatBox
          label="Applications"
          value={totals.applications || 0}
          color={C.accent}
        />
        <StatBox label="Demos" value={totals.demos || 0} color={C.green} />
        <StatBox label="Pilots" value={totals.pilots || 0} color={C.amber} />
        <StatBox label="Users" value={totals.users || 0} color={C.teal} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr .9fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <Card>
          <div style={{ fontWeight: 740, fontSize: 16, marginBottom: 14 }}>
            Recent Applications
          </div>

          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <THead
              cols={["Name / Org", "Mode", "Status", "Created"]}
              template={"2.2fr .8fr .9fr 1fr"}
            />
            {recentApplications.length ? (
              recentApplications.map((item) => (
                <TRow key={item.id} template={"2.2fr .8fr .9fr 1fr"}>
                  <div>
                    <div style={{ fontWeight: 650 }}>
                      {item.name || item.email}
                    </div>
                    <div style={{ color: C.textMuted, fontSize: 12 }}>
                      {item.org || item.email}
                    </div>
                  </div>
                  <Pill color={item.mode === "pilot" ? C.amber : C.accent}>
                    {item.mode || "demo"}
                  </Pill>
                  <span style={{ color: C.textSoft }}>
                    {item.status || "new"}
                  </span>
                  <span style={{ color: C.textMuted }}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </TRow>
              ))
            ) : (
              <div style={{ padding: 18, color: C.textMuted }}>
                No applications yet.
              </div>
            )}
          </div>
        </Card>

        <div style={{ display: "grid", gap: 14 }}>
          <Card>
            <div style={{ fontWeight: 740, fontSize: 16, marginBottom: 14 }}>
              Funnel Snapshot
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "new",
                "contacted",
                "scheduled",
                "pilot",
                "active",
                "rejected",
              ].map((status) => (
                <div
                  key={status}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{ textTransform: "capitalize", color: C.textSoft }}
                  >
                    {status}
                  </span>
                  <Mono>{byStatus[status] || 0}</Mono>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 740, fontSize: 16, marginBottom: 14 }}>
              Recent Activity
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {recentActivity.length ? (
                recentActivity.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px 12px",
                      background: C.bg,
                      border: `1px solid ${C.borderSubtle}`,
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: 650 }}>
                      {item.message}
                    </div>
                    <div
                      style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}
                    >
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Just now"}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: C.textMuted }}>No recent activity.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ApplicationsWorkspace({ applications, onStatusChange, updatingId }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected =
    applications.find((item) => item.id === selectedId) ||
    applications[0] ||
    null;

  useEffect(() => {
    if (!selectedId && applications[0]?.id) {
      setSelectedId(applications[0].id);
    }
  }, [applications, selectedId]);

  const statuses = [
    "new",
    "contacted",
    "scheduled",
    "pilot",
    "active",
    "rejected",
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr .95fr",
        gap: 14,
        padding: 22,
      }}
    >
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <THead
          cols={["Applicant", "Mode", "Status", "Email"]}
          template={"1.8fr .7fr .8fr 1.6fr"}
        />
        {applications.length ? (
          applications.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr .7fr .8fr 1.6fr",
                padding: "12px 16px",
                borderBottom: `1px solid ${C.borderSubtle}`,
                alignItems: "center",
                cursor: "pointer",
                background:
                  selected?.id === item.id ? C.accentGhost : "transparent",
              }}
            >
              <div>
                <div style={{ fontWeight: 650 }}>{item.name || "Unnamed"}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  {item.org || "No organization"}
                </div>
              </div>
              <Pill color={item.mode === "pilot" ? C.amber : C.accent}>
                {item.mode}
              </Pill>
              <span style={{ color: C.textSoft, textTransform: "capitalize" }}>
                {item.status}
              </span>
              <span style={{ color: C.textMuted, fontSize: 12 }}>
                {item.email}
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: 18, color: C.textMuted }}>
            No applications yet.
          </div>
        )}
      </Card>

      <Card>
        {selected ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 760 }}>
                  {selected.name || "Unnamed applicant"}
                </div>
                <div style={{ fontSize: 13, color: C.textSoft, marginTop: 4 }}>
                  {selected.org || "No organization"} · {selected.email}
                </div>
              </div>
              <Pill color={selected.mode === "pilot" ? C.amber : C.accent}>
                {selected.mode}
              </Pill>
            </div>

            <Separator />

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Role
                </div>
                <div>{selected.role || "-"}</div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Notes
                </div>
                <div style={{ color: C.textSoft, lineHeight: 1.6 }}>
                  {selected.message || "No notes submitted."}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Created
                </div>
                <div style={{ color: C.textSoft }}>
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Update Status
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {statuses.map((status) => (
                    <Btn
                      key={status}
                      size="sm"
                      variant={
                        selected.status === status ? "primary" : "secondary"
                      }
                      disabled={updatingId === selected.id}
                      onClick={() => onStatusChange(selected.id, status)}
                    >
                      {status}
                    </Btn>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: C.textMuted }}>Select an application.</div>
        )}
      </Card>
    </div>
  );
}

function ProfileWorkspace({ profile, user, onSave, saving }) {
  const [headline, setHeadline] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [strategies, setStrategies] = useState([]);
  const [geography, setGeography] = useState([]);
  const [checkMin, setCheckMin] = useState("");
  const [checkMax, setCheckMax] = useState("");

  useEffect(() => {
    setHeadline(profile?.headline || "");
    setVisibility(profile?.visibility || "private");
    setStrategies(profile?.strategies || []);
    setGeography(profile?.geography || []);
    setCheckMin(profile?.checkMin ?? "");
    setCheckMax(profile?.checkMax ?? "");
  }, [profile]);

  return (
    <div style={{ padding: 22 }}>
      <Card style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 24, fontWeight: 760, marginBottom: 6 }}>
          {user?.name || "Profile"}
        </div>
        <div style={{ color: C.textSoft, marginBottom: 22 }}>
          {user?.email} · {user?.org || "No organization"}
        </div>

        <FInput
          label="Headline"
          value={headline}
          onChange={setHeadline}
          placeholder="Institutional allocator focused on venture and growth"
        />

        <FSelect
          label="Visibility"
          value={visibility}
          onChange={setVisibility}
          options={[
            { value: "private", label: "Private" },
            { value: "limited", label: "Limited" },
            { value: "public", label: "Public" },
          ]}
        />

        <FTags
          label="Strategies"
          options={[
            "Venture Capital",
            "Growth Equity",
            "Buyout",
            "Credit",
            "Infrastructure",
            "Secondaries",
            "Real Estate",
          ]}
          selected={strategies}
          onChange={setStrategies}
        />

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
          selected={geography}
          onChange={setGeography}
        />

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <FInput
            label="Check Min"
            value={checkMin}
            onChange={setCheckMin}
            placeholder="5"
            prefix="$"
            mono
          />
          <FInput
            label="Check Max"
            value={checkMax}
            onChange={setCheckMax}
            placeholder="25"
            prefix="$"
            mono
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <Btn
            variant="primary"
            onClick={() =>
              onSave({
                headline,
                visibility,
                strategies,
                geography,
                checkMin: checkMin === "" ? null : Number(checkMin),
                checkMax: checkMax === "" ? null : Number(checkMax),
              })
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </Btn>
        </div>
      </Card>
    </div>
  );
}

function ActivityWorkspace({ activity }) {
  const items = activity?.items || [];

  return (
    <div style={{ padding: 22 }}>
      <Card>
        <div style={{ fontWeight: 760, fontSize: 18, marginBottom: 14 }}>
          Activity Feed
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: C.bg,
                  border: `1px solid ${C.borderSubtle}`,
                }}
              >
                <div style={{ fontWeight: 650 }}>{item.message}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                  {item.type || "event"} ·{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Just now"}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: C.textMuted }}>No activity yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Workspace({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  const loadAll = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setRefreshing(true);
      setWorkspaceError("");

      const [dashboardRes, applicationsRes, profileRes, activityRes] =
        await Promise.all([
          apiRequest("/admin/dashboard").catch(() => null),
          apiRequest("/applications").catch(() => ({ items: [] })),
          apiRequest("/profile").catch(() => ({ profile: null })),
          apiRequest("/activity").catch(() => ({ items: [] })),
        ]);

      setDashboard(dashboardRes);
      setApplications(applicationsRes?.items || []);
      setProfile(profileRes?.profile || null);
      setActivity(activityRes || { items: [] });
    } catch (err) {
      setWorkspaceError(err.message || "Failed to load workspace");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll(true);
  }, []);

  const updateApplicationStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await apiRequest(`/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadAll(false);
    } catch (err) {
      setWorkspaceError(err.message || "Failed to update application");
    } finally {
      setUpdatingId("");
    }
  };

  const saveProfile = async (payload) => {
    try {
      setSavingProfile(true);
      await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      await loadAll(false);
    } catch (err) {
      setWorkspaceError(err.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    applications: "Applications",
    profile: "Profile",
    activity: "Activity",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.black,
        color: C.text,
        display: "grid",
        gridTemplateColumns: "240px 1fr",
      }}
    >
      <WorkspaceSidebar
        page={page}
        setPage={setPage}
        onLogout={onLogout}
        user={user}
      />

      <div>
        <WorkspaceTopbar
          title={titleMap[page] || "Workspace"}
          refresh={() => loadAll(false)}
          refreshing={refreshing}
        />

        {workspaceError && (
          <div
            style={{
              margin: 22,
              padding: "12px 14px",
              borderRadius: 12,
              background: C.redWash,
              border: `1px solid ${C.redBorder}`,
              color: C.red,
              fontWeight: 600,
            }}
          >
            {workspaceError}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 22 }}>
            <Card>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                Loading workspace...
              </div>
              <div style={{ color: C.textSoft }}>
                Pulling dashboard stats, applications, profile, and activity.
              </div>
            </Card>
          </div>
        ) : (
          <>
            {page === "dashboard" && (
              <WorkspaceDashboard dashboard={dashboard} />
            )}
            {page === "applications" && (
              <ApplicationsWorkspace
                applications={applications}
                onStatusChange={updateApplicationStatus}
                updatingId={updatingId}
              />
            )}
            {page === "profile" && (
              <ProfileWorkspace
                profile={profile}
                user={user}
                onSave={saveProfile}
                saving={savingProfile}
              />
            )}
            {page === "activity" && <ActivityWorkspace activity={activity} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   LP DATABASE TABLE — searchable, scrollable
   ════════════════════════════════════════════ */
function LPDatabaseTable({ lpDb }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? lpDb.filter((lp) => {
        const q = search.toLowerCase();
        return (
          lp.name?.toLowerCase().includes(q) ||
          lp.type?.toLowerCase().includes(q) ||
          lp._raw?.primary_strategy?.toLowerCase().includes(q)
        );
      })
    : lpDb;

  const COLS = "2fr 1fr 1fr 1fr 1fr .8fr";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle
              cx="6"
              cy="6"
              r="4.5"
              stroke={C.textMuted}
              strokeWidth="1.5"
            />
            <path
              d="M10 10l2.5 2.5"
              stroke={C.textMuted}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search LPs, type, strategy…"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 10px 7px 30px",
              color: C.text,
              fontSize: 12.5,
              outline: "none",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>
          {filtered.length} of {lpDb.length} LPs
        </span>
      </div>

      {/* Table container — fixed header + scrollable body */}
      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            padding: "8px 16px",
            background: C.raised,
            fontSize: 9.5,
            fontWeight: 750,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            flexShrink: 0,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span>LP</span>
          <span>Type</span>
          <span>AUM</span>
          <span>Check Size</span>
          <span>Strategy</span>
          <span>Status</span>
        </div>

        {/* Scrollable rows */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: C.textMuted,
                fontSize: 13,
              }}
            >
              No LPs match "{search}"
            </div>
          )}
          {filtered.map((lp) => (
            <div
              key={lp.id}
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                padding: "10px 16px",
                borderTop: `1px solid ${C.borderSubtle}`,
                alignItems: "center",
                fontSize: 12,
                transition: "background .1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.cardHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* LP name + avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: C.accentWash,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: C.accentBright,
                    }}
                  >
                    {getInitials(lp.name || "LP")}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 620 }}>{lp.name || "—"}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>
                    {lp.type || "—"}
                  </div>
                </div>
              </div>

              {/* Type */}
              <span style={{ color: C.textSoft }}>{lp.type || "—"}</span>

              {/* AUM */}
              <Mono size={11} weight={600}>
                {lp.aum || "—"}
              </Mono>

              {/* Check Size */}
              <Mono size={11} weight={600} color={C.teal}>
                ${lp.checkMin}–${lp.checkMax}M
              </Mono>

              {/* Strategy */}
              <div
                style={{
                  color: C.textMuted,
                  fontSize: 11,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {lp._raw?.primary_strategy || lp.strategies?.[0] || "—"}
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Dot color={lp.deploying ? C.green : C.textMuted} size={5} />
                <span
                  style={{
                    fontSize: 10.5,
                    color: lp.deploying ? C.green : C.textMuted,
                    fontWeight: 600,
                  }}
                >
                  {lp.deploying ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SHARED WORKSPACE SHELL
   ════════════════════════════════════════════════════════════════════════════ */
function WorkspaceShell({ user, onLogout, nav, children, topRight }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.black,
        color: C.text,
        display: "grid",
        gridTemplateColumns: "220px 1fr",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          background: C.raised,
          borderRight: `1px solid ${C.border}`,
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ marginBottom: 20, cursor: "pointer" }}
          onClick={onLogout}
          title="Back to homepage"
        >
          <LogoFull size={24} />
        </div>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            background: C.bg,
            border: `1px solid ${C.borderSubtle}`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 3 }}>
            Signed in as
          </div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 1 }}>
            {user.name}
          </div>
          <div style={{ fontSize: 11.5, color: C.textSoft }}>{user.email}</div>
          <div style={{ marginTop: 8 }}>
            <Pill
              color={
                user.role === "lp"
                  ? C.teal
                  : user.role === "admin"
                  ? "#8b6cf0"
                  : C.accent
              }
            >
              {user.role === "lp"
                ? "LP"
                : user.role === "admin"
                ? "Admin"
                : "GP"}
            </Pill>
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}
        >
          {nav}
        </div>
        <Btn
          variant="secondary"
          size="sm"
          onClick={onLogout}
          style={{ width: "100%", marginTop: 12 }}
        >
          Log Out
        </Btn>
      </div>
      {/* Main */}
      <div
        style={{ overflow: "auto", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            height: 56,
            borderBottom: `1px solid ${C.border}`,
            background: C.black + "ee",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {topRight}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: C.accentWash,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: C.accent }}>
                {getInitials(user.name)}
              </span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 24 }} className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "9px 12px",
        borderRadius: 8,
        border: "none",
        background: active ? C.accentWash : "transparent",
        color: active ? C.accentBright : C.textSoft,
        fontWeight: 620,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all .15s",
      }}
    >
      <span style={{ fontSize: 15, opacity: active ? 1 : 0.5 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            background: C.accent,
            color: "#fff",
            borderRadius: 99,
            padding: "1px 6px",
            minWidth: 18,
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   /* ════════════════════════════════════════════════════════════════════════════
   REAL WORKFLOW HELPERS
   ════════════════════════════════════════════════════════════════════════════ */

const GP_PIPELINE_STAGES = [
  "Requested",
  "Viewed",
  "Accepted",
  "Passed",
  "In Diligence",
  "IC Pending",
  "Soft Circled",
  "Committed",
];

const LP_OPPORTUNITY_STATES = [
  "New",
  "Saved",
  "Requested Info",
  "Review",
  "Diligence",
  "Future Cycle",
  "Passed",
  "Approved",
  "Committed",
];

const REVEAL_STATUSES = ["Pending", "Approved", "Declined"];
const DILIGENCE_STATUSES = ["Not Started", "Open", "Waiting", "Complete"];

const STAGE_COLORS = {
  Requested: C.accent,
  Viewed: C.textSoft,
  Accepted: C.teal,
  Passed: C.red,
  "In Diligence": C.amber,
  "IC Pending": "#8b6cf0",
  "Soft Circled": C.green,
  Committed: C.green,
  New: C.accent,
  Saved: C.teal,
  "Requested Info": "#8b6cf0",
  Review: C.amber,
  Diligence: C.amber,
  "Future Cycle": C.textMuted,
  Approved: C.green,
};

function formatMoneyRange(min, max) {
  return `$${min}M–$${max}M`;
}

function scoreBucket(score) {
  if (score >= 85) return "High";
  if (score >= 70) return "Qualified";
  if (score >= 55) return "Moderate";
  return "Low";
}

function standardizeFundSubmission(profile, submission) {
  const strategy =
    submission.fundType === "Buyout"
      ? "Lower Middle Market Buyout"
      : submission.fundType === "Growth Equity"
      ? "Growth Equity"
      : submission.fundType || profile.strategy || "Private Markets";

  const geography = profile.geography || "North America";

  const targetLP =
    profile.targetLPTypes?.length > 0
      ? profile.targetLPTypes.join(" + ")
      : "Family offices + small institutions";

  const minCommitment = profile.minTicket || "$1M";

  let status = "Active";
  if (submission.currentStatus === "Pre-Launch") status = "Pre-launch";
  if (submission.currentStatus === "First Close")
    status = "First close targeted";
  if (submission.currentStatus === "Final Close")
    status = "Final close underway";

  return {
    strategy,
    geography,
    targetLP,
    minCommitment,
    status,
    targetFundSize: submission.targetFundSize || profile.fundSize || "—",
    timeline: submission.timeline || profile.timeline || "—",
    dataRoomReady: submission.dataRoomReadiness || "Not specified",
    materialsCompleteness: [
      submission.deckUploaded ? 25 : 0,
      submission.teamBiosUploaded ? 20 : 0,
      submission.performanceUploaded ? 25 : 0,
      submission.dataRoomLink ? 30 : 0,
    ].reduce((a, b) => a + b, 0),
  };
}

function buildGpMarketFeedback(pipeline, fitResults, standardized) {
  const familyOfficeHits = fitResults.filter(
    (x) => x.lp.type === "Family Office" && x.score >= 75
  ).length;
  const endowmentHits = fitResults.filter(
    (x) => x.lp.type === "Endowment" && x.score >= 75
  ).length;
  const passed = pipeline.filter((p) => p.stage === "Passed").length;
  const dd = pipeline.filter((p) => p.stage === "In Diligence").length;
  const softCircled = pipeline.filter((p) => p.stage === "Soft Circled").length;

  const insights = [
    familyOfficeHits >= endowmentHits
      ? "Family offices are engaging more than endowments for this raise."
      : "Endowments are showing stronger fit than family offices for this raise.",
    standardized.materialsCompleteness < 70
      ? "Your materials are underspecified. Completing deck, performance, and data room fields should improve conversion."
      : "Your materials are reasonably complete. Conversion risk is more about positioning than missing information.",
    passed >= 2
      ? "Repeated pass risk appears tied to track record depth and team attribution clarity."
      : "No strong negative pattern yet. Continue testing outreach against the highest-fit LPs first.",
    dd > 0 || softCircled > 0
      ? "Qualified momentum is strongest once LPs enter diligence. Prioritize reveal approvals and diligence readiness."
      : "You have match potential, but need more reveal approvals and stronger first-touch conversion.",
  ];

  return insights;
}

function buildLpFitReason(opp, mandate) {
  const reasons = [];

  if (mandate.strategies.includes(opp.type)) reasons.push("Strategy aligns");
  if (mandate.geographies.includes(opp.geo)) reasons.push("Geography fits");
  if (opp.score >= 75) reasons.push("Above fit threshold");
  if (mandate.emergingManagers && opp.emergingManagerFriendly)
    reasons.push("Open to emerging managers");
  if (
    opp.minTicketValue >= mandate.checkMin &&
    opp.minTicketValue <= mandate.checkMax
  ) {
    reasons.push("Check size fits");
  }

  return reasons.slice(0, 4);
}

function computeReadinessScore(profile, submission, standardized) {
  let score = 0;
  if (profile.firmName) score += 10;
  if (profile.strategy) score += 10;
  if (profile.geography) score += 10;
  if (profile.trackRecord) score += 15;
  if (profile.differentiators) score += 10;
  if (submission.deckUploaded) score += 15;
  if (submission.teamBiosUploaded) score += 10;
  if (submission.performanceUploaded) score += 10;
  if (submission.dataRoomLink) score += 10;
  return Math.min(100, score);
}

function WorkspaceHeaderTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 780, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13.5, color: C.textSoft }}>{subtitle}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   GP WORKSPACE — REAL WORKFLOW
   ════════════════════════════════════════════════════════════════════════════ */
function NextBestActionCard({ title, body, cta, onClick, color = C.accent }) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        background: `linear-gradient(135deg, ${color}12, ${C.card})`,
        border: `1px solid ${color}35`,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: 0.7,
          textTransform: "uppercase",
          color,
          marginBottom: 8,
        }}
      >
        Next Best Action
      </div>
      <div style={{ fontSize: 15, fontWeight: 720, marginBottom: 6 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: C.textSoft,
          lineHeight: 1.55,
          marginBottom: 12,
        }}
      >
        {body}
      </div>
      <Btn variant="primary" size="sm" onClick={onClick}>
        {cta}
      </Btn>
    </div>
  );
}
function OnboardingChecklist({ title, items }) {
  const done = items.filter((x) => x.done).length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 720, fontSize: 14 }}>{title}</div>
        <Mono size={12} weight={800} color={pct === 100 ? C.green : C.amber}>
          {done}/{total}
        </Mono>
      </div>

      <div
        style={{
          height: 4,
          borderRadius: 999,
          background: C.borderSubtle,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: pct === 100 ? C.green : C.accent,
            borderRadius: 999,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: item.done ? C.green : "transparent",
                border: `1px solid ${item.done ? C.green : C.border}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{ fontSize: 12.5, color: item.done ? C.text : C.textSoft }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
function ActivityFeed({ items }) {
  return (
    <Card>
      <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 12 }}>
        Recent Activity
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 12px",
              background: C.bg,
              borderRadius: 8,
              border: `1px solid ${C.borderSubtle}`,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: a.color || C.accent,
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.45 }}
              >
                {a.text}
              </div>
              <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>
                {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function EmptyState({ icon, title, body, cta, onClick }) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        background: C.card,
      }}
    >
      <div style={{ fontSize: 34, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 720, marginBottom: 8 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: C.textSoft,
          maxWidth: 480,
          margin: "0 auto 16px",
          lineHeight: 1.6,
        }}
      >
        {body}
      </div>
      {cta && (
        <Btn variant="primary" size="sm" onClick={onClick}>
          {cta}
        </Btn>
      )}
    </div>
  );
}
<WorkflowBanner
  title="CapitalOS system monitor"
  subtitle="Track the shared workflow across GP intake, LP matching, reveal approvals, diligence, and conversion."
  stats={[
    { label: "Qualified matches", value: strongCount, color: C.green },
    {
      label: "Reveal requests",
      value: workflowStats.revealRequests,
      color: C.amber,
    },
    {
      label: "Reveal approved",
      value: workflowStats.revealApproved,
      color: C.teal,
    },
    {
      label: "Open diligence",
      value: workflowStats.diligenceOpen,
      color: "#8b6cf0",
    },
  ]}
/>;
function GPWorkspace({ user, onLogout }) {
  const { lps: lpDb } = useLPs();
  const [page, setPage] = useState("dashboard");
  const filteredMatches = fitResults.filter((r) => {
    const q = matchSearch.toLowerCase();
    return (
      r.score >= matchThreshold &&
      (r.lp.name.toLowerCase().includes(q) ||
        r.lp.type.toLowerCase().includes(q))
    );
  });
  const [gpProfile, setGpProfile] = useState({
    firmName: user.org || "Meridian Capital Partners",
    strategy: "Buyout",
    geography: "North America",
    sectorFocus: "Industrials, Business Services, Healthcare",
    checkSizeSought: "$1M–$5M",
    targetLPTypes: ["Family Office", "Endowment"],
    trackRecord:
      "Prior realized and unrealized track record across lower middle market control investments.",
    structure: "Fund II",
    raiseStage: "First Close",
    minTicket: "$2M",
    differentiators:
      "Independent sponsor sourcing network, operator-led diligence, lower middle market specialization.",
  });

  const [fundSubmission, setFundSubmission] = useState({
    fundName: "Meridian Fund II",
    targetFundSize: "$150M",
    fundType: "Buyout",
    priorPerformance: "2.1x MOIC / 24% gross IRR",
    teamBios: "Senior team bios completed",
    currentStatus: "First Close",
    dataRoomReadiness: "Partial",
    timeline: "90 days",
    deckUploaded: true,
    teamBiosUploaded: true,
    performanceUploaded: true,
    dataRoomLink: "",
  });

  const standardized = standardizeFundSubmission(gpProfile, fundSubmission);
  const readinessScore = computeReadinessScore(
    gpProfile,
    fundSubmission,
    standardized
  );
  const fitResults = runFitEngine(
    {
      strategy: gpProfile.strategy,
      geography: gpProfile.geography,
      sectors: gpProfile.sectorFocus.split(",").map((x) => x.trim()),
      checkMin: 1,
      checkMax: 5,
    },
    lpDb
  );

  const [revealRequests, setRevealRequests] = useState([
    {
      id: 1,
      lpName: "Anonymous Family Office",
      lpType: "Family Office",
      fitScore: 84,
      status: "Pending",
      note: "High fit on check size and emerging manager openness",
      createdAt: "Today",
    },
    {
      id: 2,
      lpName: "Northwest Endowment",
      lpType: "Endowment",
      fitScore: 79,
      status: "Approved",
      note: "Strong geography fit; prefers differentiated sector angles",
      createdAt: "Yesterday",
    },
  ]);

  const [pipeline, setPipeline] = useState([
    {
      id: 101,
      lpName: "Northwest Endowment",
      lpType: "Endowment",
      fitScore: 79,
      stage: "In Diligence",
      note: "Requested team attribution detail",
      probability: 58,
      lastUpdate: "Today",
    },
    {
      id: 102,
      lpName: "Anonymous Family Office",
      lpType: "Family Office",
      fitScore: 84,
      stage: "Requested",
      note: "Reveal request pending",
      probability: 41,
      lastUpdate: "Today",
    },
    {
      id: 103,
      lpName: "Sterling Family Office",
      lpType: "Family Office",
      fitScore: 76,
      stage: "Soft Circled",
      note: "Soft verbal interest; next step IC prep",
      probability: 72,
      lastUpdate: "1 day ago",
    },
    {
      id: 104,
      lpName: "Harbor Foundation",
      lpType: "Foundation",
      fitScore: 64,
      stage: "Passed",
      note: "Too early-stage for mandate",
      probability: 0,
      lastUpdate: "2 days ago",
    },
  ]);

  const [outreachDrafts, setOutreachDrafts] = useState([
    {
      id: 1,
      target: "Anonymous Family Office",
      angle:
        "Lead with check size fit, independent sponsor openness, and lower middle market discipline.",
      status: "Ready",
    },
    {
      id: 2,
      target: "Northwest Endowment",
      angle:
        "Emphasize institutional process, team attribution, and first-close timeline.",
      status: "Sent",
    },
  ]);

  const marketFeedback = buildGpMarketFeedback(
    pipeline,
    fitResults,
    standardized
  );
  const strongMatches = fitResults.filter((x) => x.score >= 75);
  const approvedRevealCount = revealRequests.filter(
    (x) => x.status === "Approved"
  ).length;

  const requestReveal = (match) => {
    const already = revealRequests.some((r) => r.lpName === match.lp.name);
    if (already) {
      showToast("Reveal request already exists", "info");
      return;
    }

    const newReveal = {
      id: Date.now(),
      lpName: match.lp.name,
      lpType: match.lp.type,
      fitScore: match.score,
      status: "Pending",
      note: match.reasons?.[0] || "Qualified fit request submitted",
      createdAt: "Just now",
    };

    setRevealRequests((prev) => [newReveal, ...prev]);
    setPipeline((prev) => [
      {
        id: Date.now() + 1,
        lpName: match.lp.name,
        lpType: match.lp.type,
        fitScore: match.score,
        stage: "Requested",
        note: "Reveal request submitted",
        probability: Math.max(20, Math.round(match.score * 0.5)),
        lastUpdate: "Just now",
      },
      ...prev,
    ]);
    showToast(`Reveal request sent to ${match.lp.name}`, "success");
  };

  const nav = (
    <>
      <NavItem
        label="Dashboard"
        icon="◻"
        active={page === "dashboard"}
        onClick={() => setPage("dashboard")}
      />
      <NavItem
        label="Firm Profile"
        icon="◈"
        active={page === "profile"}
        onClick={() => setPage("profile")}
      />
      <NavItem
        label="Fund Submission"
        icon="↑"
        active={page === "submission"}
        onClick={() => setPage("submission")}
      />
      <NavItem
        label="Standardization"
        icon="⇄"
        active={page === "standardization"}
        onClick={() => setPage("standardization")}
      />
      <NavItem
        label="LP Matches"
        icon="⚡"
        active={page === "matches"}
        onClick={() => setPage("matches")}
        badge={strongMatches.length}
      />
      <NavItem
        label="Reveal Requests"
        icon="🔓"
        active={page === "reveal"}
        onClick={() => setPage("reveal")}
        badge={revealRequests.filter((r) => r.status === "Pending").length}
      />
      <NavItem
        label="Pipeline"
        icon="→"
        active={page === "pipeline"}
        onClick={() => setPage("pipeline")}
        badge={
          pipeline.filter((p) => !["Passed", "Committed"].includes(p.stage))
            .length
        }
      />
      <NavItem
        label="Outreach"
        icon="✉"
        active={page === "outreach"}
        onClick={() => setPage("outreach")}
      />
      <NavItem
        label="Market Feedback"
        icon="↗"
        active={page === "feedback"}
        onClick={() => setPage("feedback")}
      />
    </>
  );

  return (
    <WorkspaceShell
      user={user}
      onLogout={onLogout}
      nav={nav}
      topRight={
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
          GP Workspace
        </span>
      }
    >
      {page === "dashboard" && (
        <div>
          <WorkspaceHeaderTitle
            title={`Good morning, ${user.name.split(" ")[0]} 👋`}
            subtitle="Run your raise as an actual workflow: profile, submission, match, reveal, diligence, and feedback."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <StatBox
              label="Readiness Score"
              value={`${readinessScore}%`}
              color={readinessScore >= 75 ? C.green : C.amber}
            />
            <StatBox
              label="Strong LP Fits"
              value={String(strongMatches.length)}
              color={C.accent}
            />
            <StatBox
              label="Approved Reveals"
              value={String(approvedRevealCount)}
              color={C.teal}
            />
            <StatBox
              label="Soft Circled / Committed"
              value={`${
                pipeline.filter((p) => p.stage === "Soft Circled").length
              }/${pipeline.filter((p) => p.stage === "Committed").length}`}
              color="#8b6cf0"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                Workflow Progress
              </div>
              {[
                {
                  label: "1. Firm profile created",
                  done: !!gpProfile.firmName,
                },
                { label: "2. Fund submitted", done: !!fundSubmission.fundName },
                {
                  label: "3. Opportunity standardized",
                  done: !!standardized.strategy,
                },
                { label: "4. LPs matched", done: strongMatches.length > 0 },
                {
                  label: "5. Reveal requests sent",
                  done: revealRequests.length > 0,
                },
                {
                  label: "6. Diligence opened",
                  done: pipeline.some((p) => p.stage === "In Diligence"),
                },
                {
                  label: "7. Market feedback loop active",
                  done: marketFeedback.length > 0,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: C.textSoft }}>
                    {item.label}
                  </span>
                  <Pill color={item.done ? C.green : C.textMuted} size="xs">
                    {item.done ? "Live" : "Pending"}
                  </Pill>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                Auto-Standardized Snapshot
              </div>
              {[
                ["Strategy", standardized.strategy],
                ["Geography", standardized.geography],
                ["Target LP", standardized.targetLP],
                ["Min Commitment", standardized.minCommitment],
                ["Raise Status", standardized.status],
                ["Timeline", standardized.timeline],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: C.textMuted }}>{k}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 650 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
              Top Matched LPs
            </div>
            {fitResults.slice(0, 6).map((r, i) => {
              const sc = getScoreColor(r.score);
              return (
                <div
                  key={r.lp.id}
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
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: `2px solid ${sc}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${sc}10`,
                    }}
                  >
                    <Mono size={12} weight={800} color={sc}>
                      {r.score}
                    </Mono>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 660, fontSize: 13.5 }}>
                      {r.lp.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textMuted }}>
                      {r.lp.type} ·{" "}
                      {formatMoneyRange(r.lp.checkMin, r.lp.checkMax)} ·{" "}
                      {scoreBucket(r.score)} fit
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: C.textSoft,
                        marginTop: 2,
                      }}
                    >
                      {r.reasons?.slice(0, 2).join(" · ") ||
                        "Qualified by fit engine"}
                    </div>
                  </div>
                  <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => requestReveal(r)}
                  >
                    Request Reveal
                  </Btn>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {page === "profile" && (
        <div style={{ maxWidth: 760 }}>
          <WorkspaceHeaderTitle
            title="Firm Profile"
            subtitle="This is the GP identity layer. It should describe who you are, what you raise, and what kind of capital is aligned."
          />
          <Card style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FInput
                label="Firm Name"
                value={gpProfile.firmName}
                onChange={(v) => setGpProfile((p) => ({ ...p, firmName: v }))}
              />
              <FSelect
                label="Strategy"
                value={gpProfile.strategy}
                onChange={(v) => setGpProfile((p) => ({ ...p, strategy: v }))}
                options={[
                  "Buyout",
                  "Growth Equity",
                  "Venture Capital",
                  "Real Estate",
                  "Credit",
                  "Secondaries",
                ]}
              />
              <FInput
                label="Geography"
                value={gpProfile.geography}
                onChange={(v) => setGpProfile((p) => ({ ...p, geography: v }))}
              />
              <FInput
                label="Sector Focus"
                value={gpProfile.sectorFocus}
                onChange={(v) =>
                  setGpProfile((p) => ({ ...p, sectorFocus: v }))
                }
              />
              <FInput
                label="Check Size Sought"
                value={gpProfile.checkSizeSought}
                onChange={(v) =>
                  setGpProfile((p) => ({ ...p, checkSizeSought: v }))
                }
              />
              <FInput
                label="Current Fund / SPV / Co-Invest Structure"
                value={gpProfile.structure}
                onChange={(v) => setGpProfile((p) => ({ ...p, structure: v }))}
              />
              <FInput
                label="Raise Stage"
                value={gpProfile.raiseStage}
                onChange={(v) => setGpProfile((p) => ({ ...p, raiseStage: v }))}
              />
              <FInput
                label="Minimum Ticket"
                value={gpProfile.minTicket}
                onChange={(v) => setGpProfile((p) => ({ ...p, minTicket: v }))}
              />
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Target LP Types
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  "Family Office",
                  "Endowment",
                  "Foundation",
                  "Pension Fund",
                  "Fund of Funds",
                  "RIA",
                ].map((type) => {
                  const active = gpProfile.targetLPTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() =>
                        setGpProfile((p) => ({
                          ...p,
                          targetLPTypes: active
                            ? p.targetLPTypes.filter((x) => x !== type)
                            : [...p.targetLPTypes, type],
                        }))
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: `1px solid ${active ? C.accent : C.border}`,
                        background: active ? C.accentWash : "transparent",
                        color: active ? C.accentBright : C.textSoft,
                        fontSize: 11.5,
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Track Record
              </label>
              <textarea
                value={gpProfile.trackRecord}
                onChange={(e) =>
                  setGpProfile((p) => ({ ...p, trackRecord: e.target.value }))
                }
                style={{
                  width: "100%",
                  minHeight: 90,
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

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Differentiators
              </label>
              <textarea
                value={gpProfile.differentiators}
                onChange={(e) =>
                  setGpProfile((p) => ({
                    ...p,
                    differentiators: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  minHeight: 90,
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
          </Card>

          <Btn
            variant="primary"
            onClick={() => showToast("Firm profile saved", "success")}
          >
            Save Firm Profile
          </Btn>
        </div>
      )}

      {page === "submission" && (
        <div style={{ maxWidth: 760 }}>
          <WorkspaceHeaderTitle
            title="Fund Submission"
            subtitle="This is the actual intake step. The point is not to store PDFs. It is to convert a fundraise into structured fundraising intelligence."
          />

          <Card style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FInput
                label="Fund Name"
                value={fundSubmission.fundName}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, fundName: v }))
                }
              />
              <FSelect
                label="Fund Type"
                value={fundSubmission.fundType}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, fundType: v }))
                }
                options={[
                  "Buyout",
                  "Growth Equity",
                  "Venture Capital",
                  "SPV",
                  "Co-Investment",
                  "Secondaries",
                ]}
              />
              <FInput
                label="Target Fund Size"
                value={fundSubmission.targetFundSize}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, targetFundSize: v }))
                }
              />
              <FInput
                label="Prior Performance"
                value={fundSubmission.priorPerformance}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, priorPerformance: v }))
                }
              />
              <FInput
                label="Team Bios"
                value={fundSubmission.teamBios}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, teamBios: v }))
                }
              />
              <FSelect
                label="Current Status of Raise"
                value={fundSubmission.currentStatus}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, currentStatus: v }))
                }
                options={["Pre-Launch", "First Close", "Active", "Final Close"]}
              />
              <FSelect
                label="Data Room Readiness"
                value={fundSubmission.dataRoomReadiness}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, dataRoomReadiness: v }))
                }
                options={["Not Ready", "Partial", "Ready"]}
              />
              <FInput
                label="Timeline"
                value={fundSubmission.timeline}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, timeline: v }))
                }
              />
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 12 }}>
              Materials
            </div>
            {[
              ["Fund Deck / One-Pager", "deckUploaded"],
              ["Team Bios", "teamBiosUploaded"],
              ["Prior Performance", "performanceUploaded"],
            ].map(([label, key], i) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <span style={{ fontSize: 13 }}>{label}</span>
                <div
                  onClick={() =>
                    setFundSubmission((s) => ({ ...s, [key]: !s[key] }))
                  }
                  style={{
                    width: 38,
                    height: 20,
                    borderRadius: 999,
                    background: fundSubmission[key] ? C.accent : C.borderSubtle,
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: fundSubmission[key] ? 20 : 2,
                      transition: "left .18s",
                    }}
                  />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <FInput
                label="Data Room Link"
                value={fundSubmission.dataRoomLink}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, dataRoomLink: v }))
                }
                placeholder="https://..."
              />
            </div>
          </Card>

          <Btn
            variant="primary"
            onClick={() => {
              showToast("Fund submission saved", "success");
              setPage("standardization");
            }}
          >
            Save Submission & Continue
          </Btn>
        </div>
      )}

      {page === "standardization" && (
        <div style={{ maxWidth: 760 }}>
          <WorkspaceHeaderTitle
            title="CapitalOS Standardization"
            subtitle="This is the real product layer. Your materials are converted into structured fields the system can actually match against LP mandate data."
          />
          <Card style={{ marginBottom: 14 }}>
            {[
              ["Strategy", standardized.strategy],
              ["Geography", standardized.geography],
              ["Target LP", standardized.targetLP],
              ["Min Commitment", standardized.minCommitment],
              ["Raise Status", standardized.status],
              ["Target Fund Size", standardized.targetFundSize],
              ["Timeline", standardized.timeline],
              ["Data Room Ready", standardized.dataRoomReady],
              [
                "Materials Completeness",
                `${standardized.materialsCompleteness}%`,
              ],
            ].map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <span style={{ fontSize: 13, color: C.textMuted }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 650 }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Why this matters
            </div>
            <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
              CapitalOS should not behave like a PDF locker. Standardization is
              what makes matching, reveal requests, LP filtering, diligence
              routing, and market intelligence actually work.
            </div>
          </Card>

          <Btn variant="primary" onClick={() => setPage("matches")}>
            Run Matching →
          </Btn>
        </div>
      )}

      {page === "matches" && (
        <div>
          <WorkspaceHeaderTitle
            title="Ranked LP Matches"
            subtitle="See top matched LPs, why they fit, where the gaps are, and what objections are most likely before outreach."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <StatBox
              label="Total Matches"
              value={String(fitResults.length)}
              color={C.accent}
            />
            <StatBox
              label="75+ Qualified"
              value={String(strongMatches.length)}
              color={C.green}
            />
            <StatBox
              label="Ready for Reveal Request"
              value={String(strongMatches.length)}
              color="#8b6cf0"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fitResults.slice(0, 20).map((r) => {
              const sc = getScoreColor(r.score);
              const likelyObjection =
                r.score >= 80
                  ? "Concern: first-time or attribution risk if team detail is thin."
                  : r.score >= 65
                  ? "Concern: mandate fit is partial and may need tighter positioning."
                  : "Concern: fit is weak on mandate, size, or strategy.";

              return (
                <div
                  key={r.lp.id}
                  style={{
                    padding: "16px 18px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    display: "flex",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      border: `2.5px solid ${sc}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${sc}10`,
                      flexShrink: 0,
                    }}
                  >
                    <Mono size={15} weight={800} color={sc}>
                      {r.score}
                    </Mono>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {r.lp.name}
                      </span>
                      <Pill color={C.textMuted} size="xs">
                        {r.lp.type}
                      </Pill>
                      <Pill color={sc} size="xs">
                        {scoreBucket(r.score)}
                      </Pill>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: C.textMuted,
                        marginBottom: 6,
                      }}
                    >
                      {formatMoneyRange(r.lp.checkMin, r.lp.checkMax)} check
                      size · {r.lp.aum} AUM
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: C.textSoft,
                        marginBottom: 6,
                      }}
                    >
                      <strong style={{ color: C.text }}>Why it matches:</strong>{" "}
                      {r.reasons?.length
                        ? r.reasons.join(" · ")
                        : "Size, geography, and mandate criteria overlap."}
                    </div>

                    <div style={{ fontSize: 12.5, color: C.textSoft }}>
                      <strong style={{ color: C.text }}>
                        Likely objection:
                      </strong>{" "}
                      {likelyObjection}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <Btn
                      variant="primary"
                      size="sm"
                      onClick={() => requestReveal(r)}
                    >
                      Request Reveal
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setOutreachDrafts((prev) => [
                          {
                            id: Date.now(),
                            target: r.lp.name,
                            angle: `Lead with fit on ${
                              r.reasons?.[0] || "strategy"
                            } and address likely objection early.`,
                            status: "Ready",
                          },
                          ...prev,
                        ]);
                        showToast("Outreach draft created", "success");
                      }}
                    >
                      Build Outreach
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {page === "reveal" && (
        <div style={{ maxWidth: 860 }}>
          <WorkspaceHeaderTitle
            title="Permissioned Reveal"
            subtitle="This is where GP workflow touches LP privacy. GPs request access. LPs approve or decline. Identity unlocks only if the LP wants it."
          />
          <Card>
            {revealRequests.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr .8fr 1.2fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <div>
                  <div style={{ fontWeight: 650, fontSize: 13.5 }}>
                    {r.lpName}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>
                    {r.note}
                  </div>
                </div>
                <span style={{ fontSize: 12.5, color: C.textSoft }}>
                  {r.lpType}
                </span>
                <Mono size={12} weight={800} color={getScoreColor(r.fitScore)}>
                  {r.fitScore}
                </Mono>
                <span>
                  <Pill
                    color={
                      r.status === "Approved"
                        ? C.green
                        : r.status === "Declined"
                        ? C.red
                        : C.amber
                    }
                    size="xs"
                  >
                    {r.status}
                  </Pill>
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {page === "pipeline" && (
        <div>
          <WorkspaceHeaderTitle
            title="Fundraising Pipeline"
            subtitle="This is not generic CRM. It is capital formation workflow: request, reveal, diligence, IC, soft circle, commit."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {["Requested", "In Diligence", "Soft Circled", "Committed"].map(
              (stage) => (
                <StatBox
                  key={stage}
                  label={stage}
                  value={String(
                    pipeline.filter((p) => p.stage === stage).length
                  )}
                  color={STAGE_COLORS[stage] || C.accent}
                />
              )
            )}
          </div>

          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr .8fr 1fr 1fr 1.2fr",
                padding: "9px 16px",
                background: C.raised,
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              <span>LP</span>
              <span>Type</span>
              <span>Fit</span>
              <span>Stage</span>
              <span>Probability</span>
              <span>Last Update</span>
            </div>

            {pipeline.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr .8fr 1fr 1fr 1.2fr",
                  padding: "12px 16px",
                  borderTop: `1px solid ${C.borderSubtle}`,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 640, fontSize: 13 }}>
                    {p.lpName}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {p.note}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: C.textSoft }}>
                  {p.lpType}
                </span>
                <Mono size={12} weight={800} color={getScoreColor(p.fitScore)}>
                  {p.fitScore}
                </Mono>
                <select
                  value={p.stage}
                  onChange={(e) =>
                    setPipeline((prev) =>
                      prev.map((x) =>
                        x.id === p.id
                          ? {
                              ...x,
                              stage: e.target.value,
                              lastUpdate: "Just now",
                            }
                          : x
                      )
                    )
                  }
                  style={{
                    fontSize: 11,
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    color: C.textSoft,
                    borderRadius: 7,
                    padding: "5px 8px",
                  }}
                >
                  {GP_PIPELINE_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                <Mono
                  size={12}
                  weight={700}
                  color={
                    p.probability >= 60
                      ? C.green
                      : p.probability >= 35
                      ? C.amber
                      : C.textMuted
                  }
                >
                  {p.probability}%
                </Mono>
                <span style={{ fontSize: 12, color: C.textMuted }}>
                  {p.lastUpdate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "outreach" && (
        <div style={{ maxWidth: 820 }}>
          <WorkspaceHeaderTitle
            title="Outreach Builder"
            subtitle="Tailor your intro request based on fit. The point is not generic messaging. The point is highest-probability, fit-aware outreach."
          />
          {outreachDrafts.map((d) => (
            <Card key={d.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 680, fontSize: 14 }}>
                    {d.target}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>
                    Structured intro request
                  </div>
                </div>
                <Pill
                  color={d.status === "Sent" ? C.green : C.accent}
                  size="xs"
                >
                  {d.status}
                </Pill>
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: C.bg,
                  border: `1px solid ${C.borderSubtle}`,
                  fontSize: 12.5,
                  color: C.textSoft,
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                {d.angle}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setOutreachDrafts((prev) =>
                      prev.map((x) =>
                        x.id === d.id ? { ...x, status: "Sent" } : x
                      )
                    );
                    showToast("Outreach marked as sent", "success");
                  }}
                >
                  Mark Sent
                </Btn>
                <Btn variant="secondary" size="sm">
                  Edit
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {page === "feedback" && (
        <div style={{ maxWidth: 860 }}>
          <WorkspaceHeaderTitle
            title="Market Feedback"
            subtitle="This is the learning layer. Not just pipeline tracking — actual signal about what the market is rewarding and rejecting."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {marketFeedback.map((insight, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 18px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.6,
                }}
              >
                {insight}
              </div>
            ))}
          </div>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Recommended next step
            </div>
            <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
              Tighten track record attribution, complete the data room, and
              prioritize LPs with high fit scores and emerging-manager openness
              before broadening outreach.
            </div>
          </Card>
        </div>
      )}
    </WorkspaceShell>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LP WORKSPACE — REAL WORKFLOW
   ════════════════════════════════════════════════════════════════════════════ */

function LPWorkspace({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const [mandate, setMandate] = useState({
    lpType: "Family Office",
    aum: "$400M",
    strategies: ["Buyout", "Growth Equity"],
    geographies: ["North America"],
    checkMin: 1,
    checkMax: 5,
    emergingManagers: true,
    coInvestInterest: true,
    sectorPreferences: ["Industrials", "Business Services", "Healthcare"],
    targetFundSizes: "$50M–$300M",
    pacing: "3 commitments / year",
    mustHaveCriteria:
      "North America, disciplined GP process, coherent attribution",
    hardNos: "No venture, no non-North America, no unfocused mandates",
  });

  const [privacyMode, setPrivacyMode] = useState("attributes");
  const [revealRule, setRevealRule] = useState("manual");
  const [opportunities, setOpportunities] = useState([
    {
      id: 201,
      name: "Meridian Fund II",
      type: "Buyout",
      geo: "North America",
      size: "$150M",
      score: 84,
      stage: "First Close",
      minTicket: "$2M",
      minTicketValue: 2,
      status: "New",
      fitReason: "Strong size and mandate alignment",
      dataCompleteness: 82,
      diligenceReadiness: 77,
      emergingManagerFriendly: true,
    },
    {
      id: 202,
      name: "Harbor Growth Fund I",
      type: "Growth Equity",
      geo: "North America",
      size: "$120M",
      score: 72,
      stage: "Active",
      minTicket: "$1M",
      minTicketValue: 1,
      status: "Saved",
      fitReason: "Interesting but needs more track record detail",
      dataCompleteness: 67,
      diligenceReadiness: 55,
      emergingManagerFriendly: true,
    },
    {
      id: 203,
      name: "Blue Coast Venture III",
      type: "Venture Capital",
      geo: "North America",
      size: "$250M",
      score: 38,
      stage: "Active",
      minTicket: "$3M",
      minTicketValue: 3,
      status: "Passed",
      fitReason: "Outside mandate",
      dataCompleteness: 74,
      diligenceReadiness: 48,
      emergingManagerFriendly: false,
    },
  ]);

  const [revealQueue, setRevealQueue] = useState([
    {
      id: 1,
      gpName: "Meridian Fund II",
      fitScore: 84,
      status: "Pending",
      submittedAt: "Today",
    },
  ]);

  const [diligenceWork, setDiligenceWork] = useState({
    201: {
      status: "Open",
      checklist: {
        "Track record reviewed": false,
        "Team background verified": false,
        "Fund terms reviewed": false,
        "References requested": false,
        "Data room accessed": false,
        "IC memo drafted": false,
      },
      notes: "",
      missingItems: "Team attribution by deal, reference call list",
    },
  });

  const filteredOpportunities = opportunities.filter((opp) => opp.score >= 0);

  const updateOpportunityStatus = (id, status) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const nav = (
    <>
      <NavItem
        label="Dashboard"
        icon="◻"
        active={page === "dashboard"}
        onClick={() => setPage("dashboard")}
      />
      <NavItem
        label="Mandate Builder"
        icon="◈"
        active={page === "mandate"}
        onClick={() => setPage("mandate")}
      />
      <NavItem
        label="Reveal Controls"
        icon="🔒"
        active={page === "privacy"}
        onClick={() => setPage("privacy")}
        badge={revealQueue.filter((x) => x.status === "Pending").length}
      />
      <NavItem
        label="Inbound Screening"
        icon="↓"
        active={page === "inbound"}
        onClick={() => setPage("inbound")}
        badge={opportunities.filter((x) => x.status === "New").length}
      />
      <NavItem
        label="Diligence"
        icon="🔍"
        active={page === "diligence"}
        onClick={() => setPage("diligence")}
        badge={Object.keys(diligenceWork).length}
      />
      <NavItem
        label="Exposure Tracker"
        icon="📊"
        active={page === "tracker"}
        onClick={() => setPage("tracker")}
      />
    </>
  );

  return (
    <WorkspaceShell
      user={user}
      onLogout={onLogout}
      nav={nav}
      topRight={
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
          LP Workspace
        </span>
      }
    >
      {page === "dashboard" && (
        <div>
          <WorkspaceHeaderTitle
            title="LP Dashboard"
            subtitle="Define mandate, stay private, filter noise, and only diligence what actually fits."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <StatBox
              label="New Opportunities"
              value={String(
                opportunities.filter((o) => o.status === "New").length
              )}
              color={C.accent}
            />
            <StatBox
              label="Saved / Review"
              value={String(
                opportunities.filter((o) =>
                  ["Saved", "Review", "Diligence"].includes(o.status)
                ).length
              )}
              color={C.amber}
            />
            <StatBox
              label="Reveal Requests"
              value={String(
                revealQueue.filter((r) => r.status === "Pending").length
              )}
              color={C.teal}
            />
            <StatBox
              label="Current Privacy"
              value={
                privacyMode === "full"
                  ? "Locked"
                  : privacyMode === "attributes"
                  ? "Attributes"
                  : "Open"
              }
              color="#8b6cf0"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 16,
            }}
          >
            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                Top Qualified Opportunities
              </div>
              {filteredOpportunities
                .filter((o) => o.status !== "Passed")
                .slice(0, 4)
                .map((opp, i) => {
                  const sc = getScoreColor(opp.score);
                  return (
                    <div
                      key={opp.id}
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
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: `2px solid ${sc}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${sc}10`,
                        }}
                      >
                        <Mono size={12} weight={800} color={sc}>
                          {opp.score}
                        </Mono>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 650, fontSize: 13.5 }}>
                          {opp.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: C.textMuted }}>
                          {opp.type} · {opp.geo} · {opp.size}
                        </div>
                      </div>
                      <Pill
                        color={STAGE_COLORS[opp.status] || C.textMuted}
                        size="xs"
                      >
                        {opp.status}
                      </Pill>
                    </div>
                  );
                })}
            </Card>

            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                Mandate Snapshot
              </div>
              {[
                ["LP Type", mandate.lpType],
                ["AUM", mandate.aum],
                [
                  "Check Size",
                  formatMoneyRange(mandate.checkMin, mandate.checkMax),
                ],
                ["Strategies", mandate.strategies.join(", ")],
                ["Geography", mandate.geographies.join(", ")],
                ["Pacing", mandate.pacing],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: C.textMuted }}>{k}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 650 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {page === "mandate" && (
        <div style={{ maxWidth: 800 }}>
          <WorkspaceHeaderTitle
            title="Mandate Builder"
            subtitle="This is the LP control surface. Define what fits, what does not, and what should never reach your workflow."
          />

          <Card style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FSelect
                label="LP Type"
                value={mandate.lpType}
                onChange={(v) => setMandate((m) => ({ ...m, lpType: v }))}
                options={[
                  "Family Office",
                  "Endowment",
                  "Foundation",
                  "Pension Fund",
                  "Fund of Funds",
                ]}
              />
              <FInput
                label="AUM"
                value={mandate.aum}
                onChange={(v) => setMandate((m) => ({ ...m, aum: v }))}
              />
              <FInput
                label="Check Size Min ($M)"
                value={String(mandate.checkMin)}
                onChange={(v) =>
                  setMandate((m) => ({ ...m, checkMin: Number(v) || 0 }))
                }
              />
              <FInput
                label="Check Size Max ($M)"
                value={String(mandate.checkMax)}
                onChange={(v) =>
                  setMandate((m) => ({ ...m, checkMax: Number(v) || 0 }))
                }
              />
              <FInput
                label="Target Fund Sizes"
                value={mandate.targetFundSizes}
                onChange={(v) =>
                  setMandate((m) => ({ ...m, targetFundSizes: v }))
                }
              />
              <FInput
                label="Pacing"
                value={mandate.pacing}
                onChange={(v) => setMandate((m) => ({ ...m, pacing: v }))}
              />
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Preferred Strategies
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  "Buyout",
                  "Growth Equity",
                  "Venture Capital",
                  "Credit",
                  "Real Estate",
                  "Secondaries",
                ].map((s) => {
                  const on = mandate.strategies.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() =>
                        setMandate((m) => ({
                          ...m,
                          strategies: on
                            ? m.strategies.filter((x) => x !== s)
                            : [...m.strategies, s],
                        }))
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: `1px solid ${on ? C.accent : C.border}`,
                        background: on ? C.accentWash : "transparent",
                        color: on ? C.accentBright : C.textSoft,
                        fontSize: 11.5,
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Geographies
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["North America", "Europe", "Asia", "Global"].map((g) => {
                  const on = mandate.geographies.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() =>
                        setMandate((m) => ({
                          ...m,
                          geographies: on
                            ? m.geographies.filter((x) => x !== g)
                            : [...m.geographies, g],
                        }))
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: `1px solid ${on ? C.accent : C.border}`,
                        background: on ? C.accentWash : "transparent",
                        color: on ? C.accentBright : C.textSoft,
                        fontSize: 11.5,
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textMuted,
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  Must-Have Criteria
                </label>
                <textarea
                  value={mandate.mustHaveCriteria}
                  onChange={(e) =>
                    setMandate((m) => ({
                      ...m,
                      mustHaveCriteria: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    minHeight: 80,
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

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textMuted,
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  Hard No’s
                </label>
                <textarea
                  value={mandate.hardNos}
                  onChange={(e) =>
                    setMandate((m) => ({ ...m, hardNos: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    minHeight: 80,
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
            </div>
          </Card>

          <Btn
            variant="primary"
            onClick={() => showToast("Mandate updated", "success")}
          >
            Save Mandate
          </Btn>
        </div>
      )}

      {page === "privacy" && (
        <div style={{ maxWidth: 800 }}>
          <WorkspaceHeaderTitle
            title="Privacy & Reveal Controls"
            subtitle="LPs should control anonymity. This is one of the strongest parts of the product."
          />

          <Card style={{ marginBottom: 14 }}>
            {[
              {
                id: "full",
                label: "Fully Anonymous",
                desc: "Visible to no one until you manually approve reveal.",
              },
              {
                id: "type",
                label: "LP Type Only",
                desc: "Show LP category only, not identity.",
              },
              {
                id: "attributes",
                label: "Attributes But Not Name",
                desc: "Show LP type, AUM band, check size, strategy preferences, but not identity.",
              },
              {
                id: "threshold",
                label: "Reveal Only Above Fit Threshold",
                desc: "Auto-reveal only above a configured score.",
              },
            ].map((opt, i) => (
              <div
                key={opt.id}
                onClick={() => setPrivacyMode(opt.id)}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: `1px solid ${
                    privacyMode === opt.id ? C.accent : C.border
                  }`,
                  background: privacyMode === opt.id ? C.accentWash : C.card,
                  cursor: "pointer",
                  marginTop: i ? 10 : 0,
                }}
              >
                <div
                  style={{ fontWeight: 650, fontSize: 13.5, marginBottom: 4 }}
                >
                  {opt.label}
                </div>
                <div style={{ fontSize: 12.5, color: C.textSoft }}>
                  {opt.desc}
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Reveal Approval Rule
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["manual", "Manual approval only"],
                ["fit75", "Auto-approve above 75 fit"],
                ["fit85", "Auto-approve above 85 fit"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setRevealRule(id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${
                      revealRule === id ? C.accent : C.border
                    }`,
                    background:
                      revealRule === id ? C.accentWash : "transparent",
                    color: revealRule === id ? C.accentBright : C.textSoft,
                    fontSize: 11.5,
                    fontWeight: 650,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Reveal Request Queue
            </div>
            {revealQueue.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr .8fr 1fr 1.4fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <div>
                  <div style={{ fontWeight: 650, fontSize: 13 }}>
                    {r.gpName}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {r.submittedAt}
                  </div>
                </div>
                <Mono size={12} weight={800} color={getScoreColor(r.fitScore)}>
                  {r.fitScore}
                </Mono>
                <Pill
                  color={
                    r.status === "Approved"
                      ? C.green
                      : r.status === "Declined"
                      ? C.red
                      : C.amber
                  }
                  size="xs"
                >
                  {r.status}
                </Pill>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setRevealQueue((prev) =>
                        prev.map((x) =>
                          x.id === r.id ? { ...x, status: "Approved" } : x
                        )
                      );
                      showToast("Reveal approved", "success");
                    }}
                  >
                    Approve
                  </Btn>
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRevealQueue((prev) =>
                        prev.map((x) =>
                          x.id === r.id ? { ...x, status: "Declined" } : x
                        )
                      );
                      showToast("Reveal declined", "info");
                    }}
                  >
                    Decline
                  </Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {page === "inbound" && (
        <div>
          <WorkspaceHeaderTitle
            title="Structured Deal Flow"
            subtitle="Instead of random PDFs, LPs should receive standardized GP cards, fit scores, comparisons, and simple action choices."
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredOpportunities.map((opp) => {
              const sc = getScoreColor(opp.score);
              const reasons = buildLpFitReason(opp, mandate);

              return (
                <div
                  key={opp.id}
                  style={{
                    padding: "16px 18px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    display: "flex",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      border: `2.5px solid ${sc}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${sc}10`,
                      flexShrink: 0,
                    }}
                  >
                    <Mono size={15} weight={800} color={sc}>
                      {opp.score}
                    </Mono>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {opp.name}
                      </span>
                      <Pill color={C.textMuted} size="xs">
                        {opp.type}
                      </Pill>
                      <Pill
                        color={STAGE_COLORS[opp.status] || C.textMuted}
                        size="xs"
                      >
                        {opp.status}
                      </Pill>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: C.textMuted,
                        marginBottom: 6,
                      }}
                    >
                      {opp.geo} · {opp.size} · {opp.stage} · Min ticket{" "}
                      {opp.minTicket}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: C.textSoft,
                        marginBottom: 6,
                      }}
                    >
                      <strong style={{ color: C.text }}>Why it matches:</strong>{" "}
                      {reasons.join(" · ")}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: C.textSoft,
                        marginBottom: 6,
                      }}
                    >
                      <strong style={{ color: C.text }}>Review factors:</strong>{" "}
                      data completeness {opp.dataCompleteness}% · diligence
                      readiness {opp.diligenceReadiness}%
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Btn
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          updateOpportunityStatus(opp.id, "Diligence");
                          setPage("diligence");
                        }}
                      >
                        Open Diligence
                      </Btn>
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => updateOpportunityStatus(opp.id, "Saved")}
                      >
                        Save
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateOpportunityStatus(opp.id, "Requested Info")
                        }
                      >
                        Request Info
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateOpportunityStatus(opp.id, "Future Cycle")
                        }
                      >
                        Future Cycle
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        style={{ color: C.red }}
                        onClick={() =>
                          updateOpportunityStatus(opp.id, "Passed")
                        }
                      >
                        Pass
                      </Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {page === "diligence" && (
        <div>
          <WorkspaceHeaderTitle
            title="Diligence Workspace"
            subtitle="Once interested, the LP should be able to run diligence, track missing information, build notes, and move toward IC."
          />

          {Object.entries(diligenceWork).map(([oppId, work]) => {
            const opp = opportunities.find(
              (x) => String(x.id) === String(oppId)
            );
            if (!opp) return null;

            const checklist = work.checklist;
            const done = Object.values(checklist).filter(Boolean).length;
            const total = Object.keys(checklist).length;

            return (
              <Card key={oppId} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {opp.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>
                      {opp.type} · {opp.geo} · {opp.size}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      Checklist
                    </div>
                    <Mono
                      size={14}
                      weight={800}
                      color={done === total ? C.green : C.amber}
                    >
                      {done}/{total}
                    </Mono>
                  </div>
                </div>

                <div
                  style={{
                    height: 4,
                    borderRadius: 999,
                    background: C.borderSubtle,
                    overflow: "hidden",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: `${(done / total) * 100}%`,
                      height: "100%",
                      background: done === total ? C.green : C.amber,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {Object.entries(checklist).map(([item, checked]) => (
                    <div
                      key={item}
                      onClick={() =>
                        setDiligenceWork((prev) => ({
                          ...prev,
                          [oppId]: {
                            ...prev[oppId],
                            checklist: {
                              ...prev[oppId].checklist,
                              [item]: !checked,
                            },
                          },
                        }))
                      }
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: `1px solid ${
                          checked ? C.green : C.borderSubtle
                        }`,
                        background: C.bg,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 4,
                          background: checked ? C.green : "transparent",
                          border: `1px solid ${checked ? C.green : C.border}`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12.5,
                          color: checked ? C.text : C.textSoft,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      marginBottom: 5,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                    }}
                  >
                    Missing Info Tracker
                  </label>
                  <textarea
                    value={work.missingItems}
                    onChange={(e) =>
                      setDiligenceWork((prev) => ({
                        ...prev,
                        [oppId]: {
                          ...prev[oppId],
                          missingItems: e.target.value,
                        },
                      }))
                    }
                    style={{
                      width: "100%",
                      minHeight: 70,
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

                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      marginBottom: 5,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                    }}
                  >
                    Notes / IC Prep
                  </label>
                  <textarea
                    value={work.notes}
                    onChange={(e) =>
                      setDiligenceWork((prev) => ({
                        ...prev,
                        [oppId]: { ...prev[oppId], notes: e.target.value },
                      }))
                    }
                    placeholder="Key takeaways, diligence concerns, and investment committee notes..."
                    style={{
                      width: "100%",
                      minHeight: 90,
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

                <div style={{ display: "flex", gap: 8 }}>
                  <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => updateOpportunityStatus(opp.id, "Approved")}
                  >
                    Mark IC Ready
                  </Btn>
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => showToast("IC memo draft queued", "info")}
                  >
                    Draft IC Memo
                  </Btn>
                  <Btn
                    variant="ghost"
                    size="sm"
                    style={{ color: C.green }}
                    onClick={() => updateOpportunityStatus(opp.id, "Committed")}
                  >
                    Mark Committed
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {page === "tracker" && (
        <div>
          <WorkspaceHeaderTitle
            title="Exposure & Pacing Tracker"
            subtitle="Portfolio / exposure tracking should show where the LP pipeline sits by strategy, geography, and commitment plan."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <StatBox
              label="Pipeline by Strategy"
              value={String(
                opportunities.filter((o) => o.status !== "Passed").length
              )}
              color={C.accent}
            />
            <StatBox
              label="Approved / Committed"
              value={String(
                opportunities.filter((o) =>
                  ["Approved", "Committed"].includes(o.status)
                ).length
              )}
              color={C.green}
            />
            <StatBox label="Pacing vs Plan" value="67%" color={C.amber} />
            <StatBox
              label="North America Exposure"
              value="84%"
              color={C.teal}
            />
          </div>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              Current pipeline summary
            </div>
            {[
              [
                "Under review",
                opportunities.filter((o) =>
                  ["Saved", "Review", "Diligence"].includes(o.status)
                ).length,
              ],
              [
                "Passed",
                opportunities.filter((o) => o.status === "Passed").length,
              ],
              [
                "Committed",
                opportunities.filter((o) => o.status === "Committed").length,
              ],
              ["Target pacing", mandate.pacing],
            ].map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <span style={{ fontSize: 12.5, color: C.textMuted }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 650 }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </WorkspaceShell>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN WORKSPACE — FIXED
   ════════════════════════════════════════════════════════════════════════════ */

function AdminWorkspace({ user, onLogout }) {
  const { lps: lpDb } = useLPs();
  const [page, setPage] = useState("dashboard");
  const [viewMode, setViewMode] = useState("admin");

  // IMPORTANT FIX:
  // Do NOT auto-route away unless you explicitly want to.
  // This preserves your admin workspace even if you're testing GP/LP views.
  if (viewMode === "gp")
    return <GPWorkspace user={{ ...user, role: "gp" }} onLogout={onLogout} />;
  if (viewMode === "lp")
    return <LPWorkspace user={{ ...user, role: "lp" }} onLogout={onLogout} />;

  const pages = [
    { id: "dashboard", label: "Dashboard", icon: "◻" },
    { id: "lps", label: "LP Database", icon: "◈" },
    { id: "gps", label: "GP Database", icon: "◇" },
    { id: "workflow", label: "Workflow Monitor", icon: "⇄" },
    { id: "fit", label: "Fit Engine", icon: "⚡" },
    { id: "pipeline", label: "System Pipeline", icon: "→" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const gpProfile = {
    strategy: "Buyout",
    sectors: ["Industrials", "Business Services", "Healthcare"],
    geography: "North America",
    checkMin: 1,
    checkMax: 5,
  };

  const fitResults = runFitEngine(gpProfile, lpDb);
  const strongCount = fitResults.filter((r) => r.score >= 75).length;

  const workflowStats = {
    gpProfiles: 12,
    submittedFunds: 9,
    revealRequests: 21,
    revealApproved: 8,
    diligenceOpen: 5,
    softCircled: 3,
    committed: 1,
  };

  return (
    <WorkspaceShell
      user={{ ...user, role: "admin" }}
      onLogout={onLogout}
      nav={
        <>
          {pages.map((p) => (
            <NavItem
              key={p.id}
              label={p.label}
              icon={p.icon}
              active={page === p.id}
              onClick={() => setPage(p.id)}
            />
          ))}
        </>
      }
      topRight={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
            Admin Workspace
          </span>
          <Btn variant="secondary" size="sm" onClick={() => setViewMode("gp")}>
            View GP
          </Btn>
          <Btn variant="secondary" size="sm" onClick={() => setViewMode("lp")}>
            View LP
          </Btn>
        </div>
      }
    >
      {page === "dashboard" && (
        <div>
          <WorkspaceHeaderTitle
            title="CapitalOS Admin"
            subtitle="Monitor the real shared workflow across GP intake, LP privacy, fit, reveal, diligence, and conversion."
          />
          <WorkflowBanner
            title="Raise in progress"
            subtitle="You are through setup and now in active matching, reveal, and diligence flow."
            stats={[
              {
                label: "Strong fits",
                value: strongCount,
                color: C.green,
              },
              {
                label: "Reveal approved",
                value: approvedRevealCount,
                color: C.teal,
              },
              {
                label: "In diligence",
                value: pipeline.filter((p) => p.stage === "In Diligence")
                  .length,
                color: C.amber,
              },
              {
                label: "Soft circled",
                value: pipeline.filter((p) => p.stage === "Soft Circled")
                  .length,
                color: "#8b6cf0",
              },
            ]}
          />

          <div style={{ marginBottom: 16 }}>
            <NextBestActionCard
              title="Tighten team attribution before broader outreach"
              body="Your highest-fit LPs are good, but recurring friction is around track record clarity and data room readiness. Fix that before scaling requests."
              cta="Open Market Feedback"
              onClick={() => setPage("feedback")}
              color={C.amber}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <StatBox
              label="LP Records"
              value={String(lpDb.length)}
              color={C.accent}
            />
            <StatBox
              label="Qualified Matches"
              value={String(strongCount)}
              color={C.green}
            />
            <StatBox
              label="Open Reveal Requests"
              value={String(workflowStats.revealRequests)}
              color={C.amber}
            />
            <StatBox
              label="Open Diligence"
              value={String(workflowStats.diligenceOpen)}
              color="#8b6cf0"
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <OnboardingChecklist
              title="GP Onboarding"
              items={[
                { label: "Complete firm profile", done: !!gpProfile.firmName },
                {
                  label: "Submit fund/opportunity",
                  done: !!fundSubmission.fundName,
                },
                { label: "Upload deck", done: !!fundSubmission.deckUploaded },
                {
                  label: "Add track record detail",
                  done: !!gpProfile.trackRecord,
                },
                {
                  label: "Set data room readiness",
                  done: !!fundSubmission.dataRoomReadiness,
                },
                {
                  label: "Request first reveal",
                  done: revealRequests.length > 0,
                },
              ]}
            />

            <ActivityFeed
              items={[
                {
                  text: "Northwest Endowment approved reveal",
                  time: "12 min ago",
                  color: C.green,
                },
                {
                  text: "Anonymous Family Office viewed standardized profile",
                  time: "47 min ago",
                  color: C.accent,
                },
                {
                  text: "Sterling Family Office moved to soft circled",
                  time: "2 hrs ago",
                  color: "#8b6cf0",
                },
                {
                  text: "Market feedback updated: track record depth cited again",
                  time: "Today",
                  color: C.amber,
                },
              ]}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 16,
            }}
          >
            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                System Workflow Funnel
              </div>
              {[
                ["GP Profiles Created", workflowStats.gpProfiles],
                ["Funds Submitted", workflowStats.submittedFunds],
                ["Reveal Requests", workflowStats.revealRequests],
                ["Reveal Approved", workflowStats.revealApproved],
                ["Diligence Open", workflowStats.diligenceOpen],
                ["Soft Circled", workflowStats.softCircled],
                ["Committed", workflowStats.committed],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: C.textSoft }}>{k}</span>
                  <Mono size={13} weight={800}>
                    {v}
                  </Mono>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                Mode Control
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                Your admin workspace is preserved here. Use the buttons in the
                top right to jump into GP or LP views without losing admin
                access.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => setViewMode("gp")}
                >
                  Open GP Workflow
                </Btn>
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewMode("lp")}
                >
                  Open LP Workflow
                </Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {page === "workflow" && (
        <div>
          <WorkspaceHeaderTitle
            title="Workflow Monitor"
            subtitle="This is the shared connection layer: structured profiles, fit engine, permissioned reveal, diligence exchange, and market intelligence."
          />
          <Card>
            {[
              "A. Structured profiles — both sides need structured data or matching breaks.",
              "B. Fit engine — strategy overlap, size alignment, geography fit, fund-stage fit, exclusions, and prior interest logic.",
              "C. Permissioned reveal — GP requests access, LP approves or declines, identity unlocks only by LP decision.",
              "D. Diligence exchange — docs shared, questions logged, missing items tracked, process moves into diligence.",
              "E. Market intelligence — active LP types, GP conversion patterns, drop-off points, and recurring pass criteria.",
            ].map((x, i) => (
              <div
                key={i}
                style={{
                  padding: "11px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.6,
                }}
              >
                {x}
              </div>
            ))}
          </Card>
        </div>
      )}

      {page === "lps" && <LPDatabaseTable lpDb={lpDb} />}
      {page === "gps" && (
        <div>
          <Card>
            <div style={{ fontSize: 13, color: C.textSoft }}>
              Hook your GP database table here the same way you do
              LPDatabaseTable.
            </div>
          </Card>
        </div>
      )}
      {page === "fit" && <DemoFit />}
      {page === "pipeline" && (
        <div>
          <Card>
            <div style={{ fontSize: 13, color: C.textSoft }}>
              System-wide pipeline view can aggregate reveal requests, diligence
              jobs, and commitment progression here.
            </div>
          </Card>
        </div>
      )}
      {page === "settings" && (
        <div>
          <Card>
            <div style={{ fontSize: 13, color: C.textSoft }}>
              Admin controls go here.
            </div>
          </Card>
        </div>
      )}
    </WorkspaceShell>
  );
}

export default function CapitalOS() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
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
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setUserProfile(data || null);
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
    setModalMode("demo");
    setModalOpen(true);
  };
  const openPilot = () => {
    setModalMode("pilot");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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
            Loading CapitalOS…
          </div>
        </div>
      </div>
    );
  }

  const lpContextValue = { lps: lpList, loading: lpLoading };

  // Merge Supabase user with profile row into a single user object for components
  const currentUser = authedUser
    ? {
        id: authedUser.id,
        email: authedUser.email,
        name:
          userProfile?.full_name ||
          authedUser.user_metadata?.full_name ||
          authedUser.email,
        role: userProfile?.role || "gp",
        org: userProfile?.org || "",
      }
    : null;

  if (currentUser) {
    return (
      <LPContext.Provider value={lpContextValue}>
        <AdminWorkspace user={currentUser} onLogout={handleLogout} />
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
      <Hero onOpenDemo={openDemo} onOpenPilot={openPilot} />
      <Problems />
      <ProductSnapshot />
      <ProductModules />
      <DemoSection />
      <Dashboards />
      <WhySection />
      <PricingPreview />
      <CTA onOpenDemo={openDemo} onOpenPilot={openPilot} />
      <Footer />
      <RequestAccessModal
        open={modalOpen}
        mode={modalMode}
        onClose={closeModal}
      />
      <ToastContainer />
    </LPContext.Provider>
  );
}
