import { useState, useEffect, useRef } from "react";
import { C } from "../../tokens";
import { getScoreColor, getInitials, lsGet, lsSet, formatMoneyRange, scoreBucket } from "../../lib/helpers";
import { showToast, Btn, Pill, Mono, Dot, Card, FInput, FSelect, StatBox, SectionLabel, THead, TRow, LPProfileModal } from "../ui";
import { WorkspaceShell, NavItem, WorkspaceHeaderTitle } from "../WorkspaceShell";
import { LogoMark } from "../ui";

export function DemoLaunchBanner({
  title,
  subtitle,
  stats = [],
  actions = [],
  color = C.accent,
}) {
  return (
    <div
      style={{
        marginBottom: 18,
        padding: 22,
        borderRadius: 18,
        background: `radial-gradient(circle at top right, ${color}18, transparent 34%), linear-gradient(135deg, ${C.surface}, ${C.card})`,
        border: `1px solid ${color}30`,
        boxShadow: `0 22px 48px rgba(0,0,0,.24), 0 0 0 1px ${color}10 inset`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div style={{ maxWidth: 700 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: color + "14",
              border: `1px solid ${color}22`,
              color,
              fontSize: 10.5,
              fontWeight: 760,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <Dot color={color} size={6} pulse />
            Launch Demo
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 780,
              lineHeight: 1.08,
              letterSpacing: 0,
              marginBottom: 8,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textSoft,
              lineHeight: 1.7,
              maxWidth: 680,
            }}
          >
            {subtitle}
          </div>
        </div>

        {actions.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {actions.map((action) => (
              <Btn
                key={action.label}
                variant={action.variant || "secondary"}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Btn>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 10,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "14px 15px",
              borderRadius: 14,
              background: `${C.black}55`,
              border: `1px solid ${C.borderSubtle}`,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 760,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                marginBottom: 8,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 760,
                color: stat.color || C.text,
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
	    </div>
	  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PARALLEL MARKETPLACE DEMO — GP/LP PERMISSIONED WORKFLOW
   ════════════════════════════════════════════════════════════════════════════ */

const MP = {
  shell: "#121720",
  sidebar: "#111620",
  sidebarSoft: "#151b26",
  workspace: "#151b24",
  workspace2: "#171e28",
  panel: "#1b222d",
  panel2: "#202834",
  panel3: "#27303d",
  line: "rgba(225,232,242,0.09)",
  lineStrong: "rgba(225,232,242,0.15)",
  text: "#eef2f7",
  soft: "#98a2b3",
  muted: "#687386",
  accent: "#7166d8",
  accent2: "#8176e4",
  accentSoft: "rgba(113,102,216,.085)",
  green: "#62c992",
  green2: "#62c992",
  blue: "#9aa7ba",
  amber: "#c7a96b",
  red: "#c7a96b",
  ink: "#FFFFFF",
  white: "#FFFFFF",
  radius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
  },
  shadow: {
    panel: "0 1px 1px rgba(0,0,0,.16)",
    elevated: "0 8px 18px rgba(0,0,0,.18)",
    cta: "none",
  },
  type: {
    display: "'Manrope', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'IBM Plex Mono','Source Code Pro',monospace",
  },
  space: {
    pageX: 28,
    pageY: 22,
    panel: 16,
    section: 22,
    row: 12,
  },
};

const GP_LAUNCH_SURFACE = {
  bg: MP.panel,
  border: `1px solid ${MP.line}`,
  borderTop: "1px solid rgba(255,255,255,.06)",
  borderRadius: MP.radius.sm,
  boxShadow: "none",
};

const MP_TYPE = {
  label: {
    fontSize: 9.6,
    fontWeight: 660,
    color: MP.muted,
    textTransform: "uppercase",
    letterSpacing: 0.36,
  },
  rowTitle: {
    fontSize: 13.2,
    fontWeight: 620,
    color: MP.text,
    lineHeight: 1.25,
  },
  rowMeta: {
    fontSize: 11.3,
    color: MP.soft,
    lineHeight: 1.35,
  },
  number: {
    fontSize: 14.5,
    fontWeight: 720,
    color: MP.text,
    lineHeight: 1.05,
  },
};

const MP_ROW_BASE = {
  alignItems: "center",
  gap: "0 14px",
  minHeight: 46,
  padding: "10px 0",
  borderTop: `1px solid ${MP.line}`,
};

const MP_COMPACT_ROW_BASE = {
  ...MP_ROW_BASE,
  minHeight: 34,
  padding: "7px 0",
};

const MARKETPLACE_PRIMARY_MATCH_ID = "match-yc-pacific";
const MARKETPLACE_DEMO_STORAGE_KEY = "marketplace_demo_state_v9";

const getMarketplaceInitialPage = (fallback = "overview") => {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get("page") || fallback;
};

const CAPITAL_PATH_STAGES = [
  {
    label: "LPs Matched",
    count: "15",
    unit: "allocators",
    value: "$18.4M",
    bottleneck: "Unprioritized fit list",
    unlock: "Rank by mandate strength",
    tone: "neutral",
  },
  {
    label: "Reveal Requested",
    count: "7",
    unit: "allocators",
    value: "$9.6M",
    bottleneck: "Allocator consent pending",
    unlock: "Tighten request packets",
    tone: "accent",
  },
  {
    label: "LP's reviewing",
    count: "5",
    unit: "allocators",
    value: "$7.9M",
    bottleneck: "Attribution proof",
    unlock: "Complete memo + refs",
    tone: "amber",
  },
  {
    label: "In Diligence",
    count: "3",
    unit: "rooms",
    value: "$2.3M",
    bottleneck: "Open diligence asks",
    unlock: "Close active asks",
    tone: "green",
  },
  {
    label: "IC Review",
    count: "1",
    unit: "allocator",
    value: "$500K-$1M",
    bottleneck: "IC prep window",
    unlock: "Finalize ref pack",
    tone: "amber",
  },
  {
    label: "Soft Circle",
    count: "0",
    unit: "allocators",
    value: "$0",
    bottleneck: "No signed indication",
    unlock: "Convert Cedar Grove",
    tone: "neutral",
  },
  {
    label: "Committed",
    count: "0",
    unit: "allocators",
    value: "$0",
    bottleneck: "Awaiting IC",
    unlock: "Move first close",
    tone: "neutral",
  },
];

const demoGpProfile = {
  id: "gp-northstar",
  firmName: "Northstar Venture Partners",
  accountName: "Northstar Venture Partners",
  type: "GP / Fund Manager",
  headquarters: "Menlo Park, CA",
  website: "northstarvp.example",
  team: [
    "Kendall Roy, Managing Partner",
    "Siobhan Roy, Partner",
    "Roman Roy, Venture Partner",
    "Tom Wambsgans, COO",
    "Frank Vernon, Operating Partner",
    "Gerri Kellman, General Counsel",
  ],
  teamSummary:
    "Operator-led venture platform focused on applied AI, infrastructure software, vertical SaaS, and founder-led enterprise networks.",
  trackRecord:
    "126 companies backed. 3.1x TVPI, 39% Gross IRR. Follow-on rate 64%. Operator-heavy sourcing with documented pre-fund attribution.",
  completeness: 100,
};

const demoFundProfile = {
  id: "fund-northstar-i",
  fundName: "Northstar Venture Fund I",
  strategy: "Early-Stage Venture Capital",
  targetFundSize: "$700M",
  fundGeneration: "Core Fund",
  geography: "Global / U.S.-led",
  sectors: ["AI Infrastructure", "Developer Tools", "B2B SaaS", "Fintech", "Healthcare AI", "Vertical AI", "Enterprise Software"],
  checkSought: "$1M–$10M LP commitments",
  raiseStage: "Continuity raise",
  raisedToDate: "$410M",
  targetFirstClose: "$225M",
  closeTimeline: "60 days",
  minimumCommitment: "$1M",
  profileCompleteness: 100,
  fundCompleteness: 100,
  readinessScore: 84,
};

const demoDocuments = {
  required: [
    {
      id: "deck",
      name: "Fund Pitch Deck",
      status: "Ready",
      required: true,
      visible: true,
      updated: "Updated today",
      note: "Required before any LP request; this is the first material LPs open in review.",
    },
    {
      id: "terms",
      name: "Fund Terms Summary",
      status: "Ready",
      required: true,
      visible: true,
      updated: "Updated yesterday",
      note: "Institutional terms check: fee, carry, target size, close timing, and GP commitment.",
    },
    {
      id: "bios",
      name: "Team Bios",
      status: "Ready",
      required: true,
      visible: true,
      updated: "Updated Mar 28",
      note: "Supports team diligence and founder-market fit before reveal approval.",
    },
    {
      id: "attribution",
      name: "Track Record / Attribution",
      status: "Ready",
      required: true,
      visible: true,
      updated: "Updated Apr 8",
      note: "Core approval lever for endowments: partner attribution, sourcing, ownership, and outcomes.",
    },
    {
      id: "ddq",
      name: "Standardized DDQ",
      status: "Ready",
      required: true,
      visible: true,
      updated: "Updated Apr 9",
      note: "Standardized answers reduce back-and-forth before the LP approves reveal.",
    },
  ],
  optional: [
    {
      id: "references",
      name: "References",
      status: "Partial",
      required: false,
      visible: true,
      updated: "2 of 4 uploaded",
      note: "Partial — commonly requested by endowments before IC or first call.",
    },
    {
      id: "legal",
      name: "Legal / LPA Summary",
      status: "Partial",
      required: false,
      visible: false,
      updated: "Counsel reviewing",
      note: "Locked until LP approves reveal; legal summary should not be exposed pre-consent.",
    },
    {
      id: "impact",
      name: "ESG / Impact Reporting",
      status: "Optional",
      required: false,
      visible: true,
      updated: "Template ready",
      note: "Improves mission-aligned allocator confidence but does not gate requests.",
    },
    {
      id: "construction",
      name: "Portfolio Construction Model",
      status: "Partial",
      required: false,
      visible: true,
      updated: "Needs sensitivity view",
      note: "Missing downside scenario; may block institutional review for larger LPs.",
    },
    {
      id: "cases",
      name: "Case Studies",
      status: "Ready",
      required: false,
      visible: true,
      updated: "3 examples",
      note: "Evidence for sourcing edge, post-investment support, and repeatability.",
    },
    {
      id: "index",
      name: "Data Room Index",
      status: "Ready",
      required: false,
      visible: true,
      updated: "Synced today",
      note: "Keeps every LP-visible file auditable inside the workflow.",
    },
    {
      id: "coinvest",
      name: "Co-investment Examples",
      status: "Optional",
      required: false,
      visible: false,
      updated: "Not shared yet",
      note: "Unlocked only after LP approval and specific co-invest interest.",
    },
  ],
};

const demoLpProfile = {
  id: "lp-pacific",
  publicAlias: "University Endowment, $2B-$5B AUM",
  revealedName: "Stanford Endowment",
  type: "University Endowment",
  aumBand: "$2B-$5B",
  location: "North America",
  privacyMode: "Identity hidden until LP approval",
  team: ["Avery Sloan, CIO", "Priya Raman, Private Markets", "Miles Ortega, Analyst"],
  preferences:
    "Emerging GP access, first-close venture allocations, high-quality attribution, and mission-aligned innovation exposure.",
};

const demoLpMandates = [
  {
    id: "mandate-emerging-vc",
    name: "Emerging VC Fund I",
    status: "Active",
    strategy: "Venture Capital",
    fundGeneration: "Fund I / II",
    fundSizeRange: "$25M-$100M",
    targetCheck: "$1M-$5M",
    sectors: ["AI Infrastructure", "Healthcare Software", "Climate Software"],
    geographies: ["North America"],
    pacing: "3 commitments this year",
    exclusions: "No generalist mega-funds, no unfocused consumer mandates",
    emergingManagerAppetite: "High",
    coInvestAppetite: "Selective",
    trackRecordRequirement:
      "Pre-fund attribution accepted if sourcing and ownership are clearly documented.",
  },
  {
    id: "mandate-lmm-coinvest",
    name: "Lower Middle Market / Co-invest",
    status: "Draft",
    strategy: "Buyout / Co-invest",
    fundGeneration: "Fund II+",
    fundSizeRange: "$100M-$500M",
    targetCheck: "$3M-$12M",
    sectors: ["Business Services", "Healthcare Services", "Industrial Tech"],
    geographies: ["North America"],
    pacing: "2 commitments this year",
    exclusions: "No oil and gas services, no rollups without operating bench",
    emergingManagerAppetite: "Medium",
    coInvestAppetite: "High",
    trackRecordRequirement:
      "Realized or partially realized deal attribution required before IC.",
  },
];

const demoMatches = [
  {
    id: MARKETPLACE_PRIMARY_MATCH_ID,
    lpAlias: demoLpProfile.publicAlias,
    lpName: demoLpProfile.revealedName,
    lpType: demoLpProfile.type,
    aumBand: demoLpProfile.aumBand,
    mandate: "Emerging VC Fund I",
    checkRange: "$1M-$5M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Healthcare Software", "Climate Software"],
    score: 92,
    threshold: 75,
    requestable: true,
    why: [
      "Allocator has active appetite for first-time and emerging managers.",
      "Fund sectors align with the allocator's highest-priority focus areas: AI infrastructure and healthcare software.",
      "Target check size sits within the allocator's current pacing band.",
      "First-close timing aligns with the allocator's current pacing window.",
    ],
    blockers: [
      "References are partial; LP may request two more founder calls.",
      "Portfolio construction model needs downside sensitivity before IC.",
    ],
    lpSeesToday: "Standardized profile, pitch deck, DDQ, attribution summary",
    revealUnlocksIf: "References completed and downside case uploaded",
    nextActions: [
      "Upload two founder references before the LP reviews the request.",
      "Add downside sensitivity to the portfolio construction model.",
    ],
  },
  {
    id: "match-family-office-climate",
    lpAlias: "Single Family Office, $500M-$1B AUM",
    lpName: "Cedar Grove Family Office",
    lpType: "Family Office",
    aumBand: "$500M-$1B",
    mandate: "Climate software and AI-enabled services",
    checkRange: "$500K-$2M",
    geography: "North America",
    sectors: ["Climate Software", "AI Infrastructure"],
    score: 88,
    threshold: 75,
    requestable: true,
    why: [
      "Strong climate software overlap.",
      "Fast first-close pacing and flexible check sizing.",
      "Family office accepts pre-fund track record with references.",
    ],
    blockers: ["Legal summary is not yet LP-visible."],
    lpSeesToday: "Standardized profile, pitch deck, DDQ, climate case study",
    revealUnlocksIf: "Legal summary made LP-visible after consent",
    nextActions: [
      "Make the legal / LPA summary LP-visible after reveal approval.",
      "Add climate software case study to improve first-call conversion.",
    ],
  },
  {
    id: "match-foundation-health",
    lpAlias: "Foundation, $750M-$1B AUM",
    lpName: "Blue Lake Foundation",
    lpType: "Foundation",
    aumBand: "$750M-$1B",
    mandate: "Mission-aligned healthcare software",
    checkRange: "$500K-$1.5M",
    geography: "North America",
    sectors: ["Healthcare Software", "Climate Software"],
    score: 84,
    threshold: 75,
    requestable: true,
    why: [
      "Healthcare software is a high-priority mission sleeve.",
      "Fund size is below the LP's emerging manager cap.",
      "Impact reporting template is already prepared.",
    ],
    blockers: ["LP will likely ask for portfolio company outcome detail."],
    lpSeesToday: "Profile, pitch deck, DDQ, mission reporting template",
    revealUnlocksIf: "Portfolio outcome detail attached to request packet",
    nextActions: [
      "Attach healthcare portfolio company outcome detail.",
      "Add mission reporting template to the request packet.",
    ],
  },
  {
    id: "match-fof-seed",
    lpAlias: "Fund of Funds, $500M-$1B AUM",
    lpName: "Launchpad Fund of Funds",
    lpType: "Fund of Funds",
    aumBand: "$500M-$1B",
    mandate: "Seed-stage access vehicles",
    checkRange: "$1M-$3M",
    geography: "Global",
    sectors: ["AI Infrastructure", "Healthcare Software"],
    score: 79,
    threshold: 75,
    requestable: true,
    why: [
      "Seed-stage strategy fits the FoF access mandate.",
      "Global geography is broad enough for Northstar.",
      "Track record summary gives enough early proof.",
    ],
    blockers: ["Fund of funds wants more detail on ownership targets."],
    lpSeesToday: "Profile, pitch deck, DDQ, track record summary",
    revealUnlocksIf: "Ownership targets and reserve model clarified",
    nextActions: [
      "Add ownership target range to portfolio construction notes.",
      "Clarify reserve strategy before requesting this match.",
    ],
  },
  {
    id: "match-ocio-emerging",
    lpAlias: "OCIO Emerging Manager Sleeve, $2B-$4B AUM",
    lpName: "Northstar OCIO Platform",
    lpType: "OCIO Platform",
    aumBand: "$2B-$4B",
    mandate: "Emerging manager venture allocation",
    checkRange: "$1M-$4M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Healthcare Software", "Vertical SaaS"],
    score: 90,
    threshold: 75,
    requestable: true,
    why: [
      "OCIO platform is actively sourcing small Fund I / II venture managers.",
      "Check size aligns with Northstar's target LP commitment range.",
      "Vertical SaaS and AI infrastructure fit the current innovation sleeve.",
      "Allocator accepts pre-fund track record when attribution is clearly mapped.",
    ],
    blockers: [
      "Wants a concise benchmark comparison against other emerging VC managers.",
      "May ask for clearer ownership reserve policy before partner review.",
    ],
    lpSeesToday: "Structured fund profile, deck, DDQ, track record table, QuantumX case study",
    revealUnlocksIf: "Benchmark comparison and reserve policy are added to the packet",
    nextActions: [
      "Add emerging-manager benchmark comparison before submitting.",
      "Attach ownership reserve policy to the data room.",
    ],
  },
  {
    id: "match-health-system-foundation",
    lpAlias: "Healthcare System Foundation, $1B-$2B AUM",
    lpName: "Meridian Health Foundation",
    lpType: "Foundation",
    aumBand: "$1B-$2B",
    mandate: "Healthcare AI and infrastructure managers",
    checkRange: "$1M-$3M",
    geography: "North America",
    sectors: ["Healthcare Software", "AI Infrastructure"],
    score: 86,
    threshold: 75,
    requestable: true,
    why: [
      "Healthcare software is the allocator's highest-priority innovation mandate.",
      "Northstar's operator-led support maps well to commercialization risk.",
      "QuantumX and healthcare AI case studies make the strategy tangible.",
    ],
    blockers: [
      "LP may need stronger healthcare-specific outcome reporting.",
      "References should include at least one healthcare founder or operator.",
    ],
    lpSeesToday: "Fund profile, deck, DDQ, track record, healthcare reporting template",
    revealUnlocksIf: "Healthcare founder reference and outcome reporting addendum are attached",
    nextActions: [
      "Attach healthcare outcome reporting addendum.",
      "Add one healthcare founder reference before request.",
    ],
  },
  {
    id: "match-euro-family-office",
    lpAlias: "European Family Office, $1B-$2B AUM",
    lpName: "Asteria Family Capital",
    lpType: "Family Office",
    aumBand: "$1B-$2B",
    mandate: "US / EU applied AI venture exposure",
    checkRange: "$1M-$3M",
    geography: "US / select EU",
    sectors: ["AI Infrastructure", "Vertical SaaS", "Climate Software"],
    score: 83,
    threshold: 75,
    requestable: true,
    why: [
      "Mandate explicitly targets US / EU applied AI managers.",
      "Family office has flexibility around Fund I manager risk.",
      "Check size and first-close timing align with current pacing.",
    ],
    blockers: [
      "Wants clearer European sourcing angle.",
      "May ask whether the fund can support companies outside the US.",
    ],
    lpSeesToday: "Profile, pitch deck, DDQ, AI infrastructure thesis, selected EU sourcing notes",
    revealUnlocksIf: "US / EU sourcing note and cross-border support plan are added",
    nextActions: [
      "Add a short US / EU sourcing note.",
      "Clarify cross-border company support before request.",
    ],
  },
  {
    id: "match-insurance-strategic",
    lpAlias: "Insurance Strategic LP, $5B-$10B AUM",
    lpName: "Atlas Mutual Strategic Investments",
    lpType: "Strategic LP",
    aumBand: "$5B-$10B",
    mandate: "Enterprise automation and risk analytics",
    checkRange: "$2M-$6M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Vertical SaaS"],
    score: 82,
    threshold: 75,
    requestable: true,
    why: [
      "Enterprise workflow automation overlaps with the strategic innovation mandate.",
      "AI infrastructure thesis maps to internal risk analytics priorities.",
      "Potential co-investment interest creates upside beyond fund commitment.",
    ],
    blockers: [
      "Strategic LP may over-index on corporate relevance.",
      "Needs co-investment examples before larger allocation discussion.",
    ],
    lpSeesToday: "Fund profile, pitch deck, DDQ, QuantumX case study, co-invest examples index",
    revealUnlocksIf: "Co-investment examples and strategic relevance memo are attached",
    nextActions: [
      "Attach co-investment examples.",
      "Add strategic relevance memo for enterprise AI workflows.",
    ],
  },
  {
    id: "match-corporate-pension",
    lpAlias: "Corporate Pension Venture Sleeve, $3B-$6B AUM",
    lpName: "NorthBridge Corporate Pension",
    lpType: "Corporate Pension",
    aumBand: "$3B-$6B",
    mandate: "Emerging venture innovation sleeve",
    checkRange: "$2M-$5M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Healthcare Software"],
    score: 77,
    threshold: 75,
    requestable: true,
    why: [
      "Mandate has room for one emerging venture manager this pacing cycle.",
      "AI infrastructure and healthcare software are both approved sectors.",
      "Check size is within the lower end of the pension's innovation sleeve.",
    ],
    blockers: [
      "Institutional process may require stronger legal and operations review.",
      "First-time fund risk could slow committee approval.",
    ],
    lpSeesToday: "Profile, pitch deck, DDQ, terms summary, operations checklist",
    revealUnlocksIf: "Legal summary and operations review packet are made LP-visible",
    nextActions: [
      "Make operations checklist visible.",
      "Add legal summary before submitting the request.",
    ],
  },
  {
    id: "match-bank-wealth-platform",
    lpAlias: "Private Bank Wealth Platform, $5B-$10B AUM",
    lpName: "Summit Private Wealth Platform",
    lpType: "Private Bank",
    aumBand: "$5B-$10B",
    mandate: "Emerging venture access for UHNW clients",
    checkRange: "$1M-$4M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Healthcare Software", "Vertical SaaS"],
    score: 87,
    threshold: 75,
    requestable: true,
    why: ["UHNW sleeve is actively looking for differentiated Fund I venture access.", "Check sizing and sector exposure fit the current platform model."],
    blockers: ["Requires a clean client-facing fund summary."],
    lpSeesToday: "Fund profile, deck, DDQ, track record, client summary",
    revealUnlocksIf: "Client-facing summary and reference list are approved",
    nextActions: ["Upload client-facing fund summary.", "Add two founder references to the request packet."],
  },
  {
    id: "match-regional-endowment",
    lpAlias: "Regional University Endowment, $1B-$2B AUM",
    lpName: "Northgate University Endowment",
    lpType: "Endowment",
    aumBand: "$1B-$2B",
    mandate: "Early-stage venture innovation sleeve",
    checkRange: "$1M-$3M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Healthcare Software"],
    score: 85,
    threshold: 75,
    requestable: true,
    why: ["Emerging manager allocation is open this quarter.", "AI infrastructure and healthcare software are approved focus areas."],
    blockers: ["Needs vintage-level attribution before investment office review."],
    lpSeesToday: "Profile, deck, DDQ, track record, university reference index",
    revealUnlocksIf: "Vintage-level attribution memo is attached",
    nextActions: ["Complete attribution memo.", "Add university-style reference index."],
  },
  {
    id: "match-multi-family-office",
    lpAlias: "Multi-Family Office, $2B-$4B AUM",
    lpName: "Veridian Multi-Family Office",
    lpType: "Multi-Family Office",
    aumBand: "$2B-$4B",
    mandate: "Operator-led venture managers",
    checkRange: "$750K-$2M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Vertical SaaS"],
    score: 81,
    threshold: 75,
    requestable: true,
    why: ["Operator-led GP profile matches the office's access mandate.", "Smaller check range works for a first-close path."],
    blockers: ["Wants clearer portfolio support examples."],
    lpSeesToday: "Profile, deck, DDQ, operator support examples",
    revealUnlocksIf: "Portfolio support appendix is uploaded",
    nextActions: ["Add portfolio support appendix.", "Highlight operating examples in the deck."],
  },
  {
    id: "match-healthcare-fof",
    lpAlias: "Healthcare Fund of Funds, $1B-$2B AUM",
    lpName: "Riverside Healthcare FoF",
    lpType: "Fund of Funds",
    aumBand: "$1B-$2B",
    mandate: "Specialist healthcare and AI venture",
    checkRange: "$1M-$4M",
    geography: "North America",
    sectors: ["Healthcare Software", "AI Infrastructure"],
    score: 80,
    threshold: 75,
    requestable: true,
    why: ["Healthcare software is a direct mandate match.", "FoF can underwrite emerging managers with clean attribution."],
    blockers: ["Needs stronger healthcare outcome reporting."],
    lpSeesToday: "Profile, deck, DDQ, healthcare case study",
    revealUnlocksIf: "Healthcare outcome addendum is attached",
    nextActions: ["Attach healthcare outcome addendum.", "Add healthcare founder reference."],
  },
  {
    id: "match-outsourced-cio",
    lpAlias: "Boutique OCIO, $750M-$1B AUM",
    lpName: "Clearwater OCIO",
    lpType: "OCIO",
    aumBand: "$750M-$1B",
    mandate: "Small manager venture program",
    checkRange: "$500K-$1.5M",
    geography: "North America",
    sectors: ["Climate Software", "Healthcare Software"],
    score: 78,
    threshold: 75,
    requestable: true,
    why: ["Small manager program is built for sub-$100M funds.", "Climate and healthcare software both match approved sleeves."],
    blockers: ["Investment memo template needs more downside detail."],
    lpSeesToday: "Profile, deck, DDQ, climate and healthcare cases",
    revealUnlocksIf: "Downside detail is added to the memo",
    nextActions: ["Add downside section to investment memo.", "Attach climate case study."],
  },
  {
    id: "match-bank-foundation",
    lpAlias: "Bank Foundation, $500M-$750M AUM",
    lpName: "Evergreen Bank Foundation",
    lpType: "Foundation",
    aumBand: "$500M-$750M",
    mandate: "Mission-aligned technology exposure",
    checkRange: "$250K-$1M",
    geography: "North America",
    sectors: ["Healthcare Software", "Climate Software"],
    score: 76,
    threshold: 75,
    requestable: true,
    why: ["Mission-aligned software exposure fits the foundation's impact sleeve.", "Check range is compatible with a first close."],
    blockers: ["Impact reporting detail is thin."],
    lpSeesToday: "Profile, deck, DDQ, impact reporting template",
    revealUnlocksIf: "Impact reporting detail is attached",
    nextActions: ["Attach impact reporting detail.", "Clarify climate and healthcare outcomes."],
  },
  {
    id: "match-large-family-office-ai",
    lpAlias: "Large Family Office, $3B-$5B AUM",
    lpName: "Bellwether Family Capital",
    lpType: "Family Office",
    aumBand: "$3B-$5B",
    mandate: "Applied AI venture exposure",
    checkRange: "$2M-$5M",
    geography: "US / select EU",
    sectors: ["AI Infrastructure", "Vertical SaaS"],
    score: 74,
    threshold: 75,
    requestable: false,
    why: ["Strong AI overlap, but the requested check may be large for the current close."],
    blockers: ["One point below request threshold.", "Needs clearer EU sourcing edge."],
    lpSeesToday: "Held from allocator review until threshold is met",
    revealUnlocksIf: "EU sourcing note and partner attribution improve",
    nextActions: ["Add EU sourcing note.", "Re-run after attribution memo is complete."],
  },
  {
    id: "match-corporate-venture-lp",
    lpAlias: "Corporate Venture LP, $2B-$4B AUM",
    lpName: "Keystone Strategic Ventures",
    lpType: "Strategic LP",
    aumBand: "$2B-$4B",
    mandate: "Enterprise AI and automation managers",
    checkRange: "$1M-$3M",
    geography: "North America",
    sectors: ["AI Infrastructure", "Vertical SaaS"],
    score: 73,
    threshold: 75,
    requestable: false,
    why: ["Enterprise AI overlap is strong but strategic relevance needs sharpening."],
    blockers: ["Below request threshold.", "Needs strategic relevance memo."],
    lpSeesToday: "Held from allocator review until strategic memo is complete",
    revealUnlocksIf: "Strategic relevance memo is uploaded",
    nextActions: ["Write strategic relevance memo.", "Add enterprise AI case examples."],
  },
  {
    id: "match-sovereign-innovation",
    lpAlias: "Sovereign Innovation Program, $25B+ AUM",
    lpName: "Commonwealth Innovation Program",
    lpType: "Sovereign Program",
    aumBand: "$25B+",
    mandate: "Scaled technology transfer and growth innovation",
    checkRange: "$8M-$20M",
    geography: "Global",
    sectors: ["AI Infrastructure", "Deep Tech"],
    score: 58,
    threshold: 75,
    requestable: false,
    why: [
      "Sector relevance exists, but the mandate is too scaled for this Fund I cycle.",
      "Typical check size would create concentration risk for the current raise.",
    ],
    blockers: [
      "Below request threshold.",
      "Requires larger fund scale and more institutional references.",
    ],
    lpSeesToday: "Not sent to allocator review queue because request threshold is not met",
    revealUnlocksIf: "Fund scale, realized attribution, and institutional references improve in later cycles",
    nextActions: [
      "Do not request now; keep as a later-cycle institutional target.",
      "Build proof through smaller LP workflows first.",
    ],
  },
  {
    id: "match-pension-innovation",
    lpAlias: "Public Pension Innovation Sleeve, $10B+ AUM",
    lpName: "Harborline Pension Innovation Sleeve",
    lpType: "Pension",
    aumBand: "$10B+",
    mandate: "Institutional venture innovation sleeve",
    checkRange: "$10M-$25M",
    geography: "North America",
    sectors: ["AI Infrastructure"],
    score: 61,
    threshold: 75,
    requestable: false,
    why: ["Sector overlap exists, but the check size is outside the fund's current ask."],
    blockers: ["Below request threshold.", "Pension allocation size is too large for this raise."],
    lpSeesToday: "Not sent to allocator review queue because request threshold is not met",
    revealUnlocksIf: "Fundraise scale and institutional proof improve in later cycles",
    nextActions: [
      "Do not request now; keep this as a future institutional target.",
      "Build proof through smaller LP workflows first.",
    ],
  },
];

const demoMatchRequests = [
  {
    id: "req-yc-pacific",
    matchId: MARKETPLACE_PRIMARY_MATCH_ID,
    gpName: demoFundProfile.fundName,
    firmName: demoGpProfile.firmName,
    fundSize: demoFundProfile.targetFundSize,
    strategy: demoFundProfile.strategy,
    generation: demoFundProfile.fundGeneration,
    sectors: demoFundProfile.sectors,
    score: 92,
    status: "Pending",
    requestedAt: "Today 2:14 PM",
    source: "GP requested match",
    readiness: demoFundProfile.readinessScore,
    snapshot:
      "Northstar is a Fund I venture vehicle raising a first institutional close with strong AI infrastructure, healthcare software, and climate software overlap.",
    feedback: "",
    docs: [
      ["Fund Pitch Deck", "Ready"],
      ["Fund Terms Summary", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record / Attribution", "Ready"],
      ["Standardized DDQ", "Ready"],
    ],
    lpOnly: true,
  },
  {
    id: "req-yc-cedar",
    matchId: "match-family-office-climate",
    gpName: "Ridgeway AI Partners I",
    firmName: "Ridgeway AI Partners",
    fundSize: "$92M",
    strategy: "Early-Stage Venture Capital",
    generation: "Fund I",
    sectors: ["AI Infrastructure", "Developer Tools", "Enterprise Software"],
    score: 84,
    status: "Approved",
    requestedAt: "Yesterday",
    source: "GP requested match",
    readiness: demoFundProfile.readinessScore,
    snapshot: "Ridgeway AI Partners I — early-stage venture, $92M target. Cedar Grove approved after reviewing attribution and standardized DDQ.",
    feedback: "",
    docs: [
      ["Fund Pitch Deck", "Ready"],
      ["Fund Terms Summary", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record / Attribution", "Ready"],
      ["Standardized DDQ", "Ready"],
    ],
  },
  {
    id: "req-aurora-pacific",
    matchId: "match-aurora-pacific",
    gpName: "Aurora Bio Systems Fund II",
    firmName: "Aurora Bio Systems",
    fundSize: "$110M",
    strategy: "Venture Capital",
    generation: "Fund II",
    sectors: ["Healthcare Software", "Life Sciences Data"],
    score: 88,
    status: "Declined",
    requestedAt: "Today 9:12 AM",
    source: "GP requested match",
    readiness: 84,
    snapshot:
      "Healthcare software specialist with clear DPI from a prior SPV and strong hospital operator references.",
    feedback: "",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Ready"],
      ["DDQ", "Partial"],
    ],
  },
  {
    id: "req-northline-pacific",
    matchId: "match-northline-pacific",
    gpName: "Northline Climate Seed I",
    firmName: "Northline Partners",
    fundSize: "$62M",
    strategy: "Venture Capital",
    generation: "Fund I",
    sectors: ["Climate Software", "Industrial AI"],
    score: 81,
    status: "More Info Requested",
    requestedAt: "Yesterday",
    source: "Algorithmic recommendation plus GP request",
    readiness: 73,
    snapshot:
      "Strong climate software thesis, but attribution detail is still thin for an IC path.",
    feedback: "Please upload partner-level attribution and two founder references.",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Partial"],
      ["DDQ", "Ready"],
    ],
  },
  {
    id: "req-cobalt-pacific",
    matchId: "match-cobalt-pacific",
    gpName: "Cobalt Operator Ventures I",
    firmName: "Cobalt Capital",
    fundSize: "$85M",
    strategy: "Venture Capital",
    generation: "Fund I",
    sectors: ["B2B SaaS", "Developer Tools"],
    score: 86,
    status: "Pending",
    requestedAt: "Today 11:04 AM",
    source: "GP requested match",
    readiness: 88,
    snapshot:
      "Operator-led Fund I with strong B2B SaaS sourcing and a complete data room. First close targeting 60 days.",
    feedback: "",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Ready"],
      ["DDQ", "Ready"],
    ],
  },
  {
    id: "req-meridian-pacific",
    matchId: "match-meridian-pacific",
    gpName: "Meridian Ventures Fund II",
    firmName: "Meridian Partners",
    fundSize: "$140M",
    strategy: "Venture Capital",
    generation: "Fund II",
    sectors: ["Fintech", "Enterprise Software"],
    score: 84,
    status: "Pending",
    requestedAt: "Today 8:55 AM",
    source: "Algorithmic recommendation",
    readiness: 82,
    snapshot:
      "Fintech-focused Fund II with realized DPI from Fund I and strong institutional co-investor references.",
    feedback: "",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Ready"],
      ["DDQ", "Partial"],
    ],
  },
  {
    id: "req-horizon-pacific",
    matchId: "match-horizon-pacific",
    gpName: "Horizon Data Infrastructure I",
    firmName: "Horizon Data Partners",
    fundSize: "$74M",
    strategy: "Venture Capital",
    generation: "Fund I",
    sectors: ["AI Infrastructure", "Data Platforms"],
    score: 79,
    status: "Pending",
    requestedAt: "Today 1:25 PM",
    source: "Algorithmic recommendation",
    readiness: 78,
    snapshot:
      "Data infrastructure Fund I with strong technical sourcing but a partially complete attribution memo.",
    feedback: "",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Partial"],
      ["DDQ", "Ready"],
    ],
  },
  {
    id: "req-lattice-pacific",
    matchId: "match-lattice-pacific",
    gpName: "Lattice Health Software I",
    firmName: "Lattice Ventures",
    fundSize: "$68M",
    strategy: "Venture Capital",
    generation: "Fund I",
    sectors: ["Healthcare Software", "Enterprise Software"],
    score: 82,
    status: "Pending",
    requestedAt: "Yesterday",
    source: "GP requested match",
    readiness: 80,
    snapshot:
      "Healthcare software specialist with mission-aligned exposure and early founder references indexed.",
    feedback: "",
    docs: [
      ["Pitch Deck", "Ready"],
      ["Fund Terms", "Ready"],
      ["Team Bios", "Ready"],
      ["Track Record", "Partial"],
      ["DDQ", "Ready"],
    ],
  },
];

const demoLpRecommendations = [
  {
    bucket: "Emerging VC Fund I",
    items: [
      {
        gpName: "Northline Climate Seed I",
        score: 81,
        whyNow: "Climate software thesis matches a secondary sector priority.",
        tags: ["Climate", "Seed", "Partial docs"],
      },
      {
        gpName: "Horizon Data Infrastructure I",
        score: 79,
        whyNow: "Data infrastructure thesis fits the emerging VC mandate if attribution improves.",
        tags: ["AI", "Data", "Attribution gap"],
      },
    ],
  },
  {
    bucket: "First-close ready",
    items: [
      {
        gpName: "Cobalt Operator Ventures I",
        score: 86,
        whyNow: "Data room complete and references are already indexed.",
        tags: ["Ready", "Operator-led", "Healthcare"],
      },
      {
        gpName: "Lattice Health Software I",
        score: 82,
        whyNow: "Founder reference pack is indexed and check size fits current pacing.",
        tags: ["Healthcare", "Ready", "Fund I"],
      },
    ],
  },
  {
    bucket: "Healthcare software",
    items: [
      {
        gpName: "Aurora Bio Systems Fund II",
        score: 88,
        whyNow: "Highest healthcare overlap in the current request queue.",
        tags: ["Fund II", "Healthcare", "Inbound"],
      },
    ],
  },
  {
    bucket: "Strong attribution",
    items: [
      {
        gpName: "Ridgeway AI Partners I",
        score: 83,
        whyNow: "Clean partner attribution across 14 pre-fund investments.",
        tags: ["Attribution", "AI", "Watch"],
      },
    ],
  },
  {
    bucket: "Co-invest potential",
    items: [
      {
        gpName: "Fieldstone Applied AI Growth",
        score: 77,
        whyNow: "Portfolio has two near-term co-investment candidates.",
        tags: ["Co-invest", "Growth", "Monitor"],
      },
    ],
  },
  {
    bucket: "Outside mandate but notable",
    items: [
      {
        gpName: "Harborline Credit Opportunities",
        score: 54,
        whyNow: "Outside active mandate but useful for next private credit cycle.",
        tags: ["Credit", "Future", "Out of mandate"],
      },
    ],
  },
];

const demoWorkflowRooms = {
  "room-yc-cedar": {
    id: "room-yc-cedar",
    matchId: "match-family-office-climate",
    gpName: demoFundProfile.fundName,
    lpName: "Cedar Grove Family Office",
    lpAlias: "Single Family Office, $500M-$1B AUM",
    status: "Revealed",
    stage: "Diligence",
    pipelineStage: "Meeting scheduled",
    meeting: "Wednesday, Apr 15 at 9:00 AM PT",
    lastLpAction: "Cedar Grove approved reveal and requested founder references.",
    nextMilestone: "First LP/GP call prep",
    decisionRisk: "Waiting on reference pack and downside construction case.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: "msg-yc-1",
        from: "Cedar Grove Family Office",
        body: "We approved the match. Please use this room for the attribution follow-up and meeting prep.",
        time: "Yesterday",
      },
      {
        id: "msg-yc-2",
        from: demoFundProfile.fundName,
        body: "Confirmed. Pitch deck, DDQ, and attribution file are ready for review.",
        time: "Today",
      },
    ],
    qas: [
      {
        id: "qa-yc-1",
        question: "Which pre-fund deals were sourced directly by the current GP team?",
        status: "Open",
      },
      {
        id: "qa-yc-2",
        question: "Can you provide references for two marked-up portfolio companies?",
        status: "Answered",
      },
    ],
    tasks: [
      { id: "task-yc-1", label: "Review Cedar Grove mandate notes", done: true },
      { id: "task-yc-2", label: "Prepare first LP call agenda", done: false },
      { id: "task-yc-3", label: "Send founder reference availability", done: false },
    ],
    docRequests: [
      { id: "doc-yc-1", label: "Founder reference pack", done: false },
      { id: "doc-yc-2", label: "Portfolio construction downside case", done: false },
      { id: "doc-yc-3", label: "Updated data room index", done: true },
    ],
    events: [
      "LP approved match",
      "Identity revealed inside workflow room",
      "Meeting scheduled for Wednesday, Apr 15 at 9:00 AM PT",
      "Reference pack requested",
      "Downside construction case added to packet",
      "First call agenda drafted",
      "Allocator review checklist updated",
    ],
  },
  "room-ridgeway-pacific": {
    id: "room-ridgeway-pacific",
    matchId: "match-ridgeway-pacific",
    gpName: "Ridgeway AI Partners I",
    lpName: demoLpProfile.revealedName,
    lpAlias: "University Endowment, $2B-$5B AUM",
    status: "Revealed",
    stage: "Diligence",
    pipelineStage: "Intro room open",
    meeting: "Tuesday, Apr 14 at 11:00 AM PT",
    lastLpAction: "Pacific requested the attribution appendix before IC prep.",
    nextMilestone: "IC prep after attribution support is reviewed",
    decisionRisk: "Waiting on attribution support and updated ownership schedule.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: "msg-room-1",
        from: "University Endowment",
        body: "Thanks for opening the room. Please add the attribution appendix before our call.",
        time: "Yesterday",
      },
      {
        id: "msg-room-2",
        from: "Ridgeway AI Partners I",
        body: "Uploaded. We also added two founder references to the data room.",
        time: "Today",
      },
    ],
    qas: [
      {
        id: "qa-room-1",
        question: "Which deals were sourced directly by the GP team?",
        status: "Answered",
      },
    ],
    tasks: [
      { id: "task-room-1", label: "Review attribution appendix", done: false },
      { id: "task-room-2", label: "Confirm founder reference calls", done: true },
      { id: "task-room-3", label: "Prepare LP call agenda", done: true },
    ],
    docRequests: [
      { id: "doc-room-1", label: "Updated ownership schedule", done: true },
      { id: "doc-room-2", label: "Downside portfolio construction case", done: false },
    ],
    events: [
      "Room opened after LP approval",
      "Data room access granted",
      "Attribution appendix uploaded",
      "Ownership schedule reviewed",
      "Downside case requested",
      "IC prep note started",
    ],
  },
  "room-mosaic-diligence": {
    id: "room-mosaic-diligence",
    matchId: "match-mosaic-diligence",
    gpName: demoFundProfile.fundName,
    lpName: "Mosaic Endowment",
    lpAlias: "University Endowment, $1B-$2B AUM",
    status: "Revealed",
    stage: "Diligence",
    pipelineStage: "Diligence active",
    meeting: "Friday, Apr 18 at 2:00 PM PT",
    lastLpAction: "Mosaic completed first call and requested diligence materials.",
    nextMilestone: "Diligence materials review before partner meeting",
    decisionRisk: "Attribution depth and portfolio construction case needed.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: "msg-mosaic-1",
        from: "Mosaic Endowment",
        body: "First call was very helpful. Please share the full diligence package including attribution appendix and downside case.",
        time: "2 days ago",
      },
      {
        id: "msg-mosaic-2",
        from: demoFundProfile.fundName,
        body: "Diligence package uploaded. Let us know if you have questions before Friday's partner meeting.",
        time: "Yesterday",
      },
    ],
    qas: [
      {
        id: "qa-mosaic-1",
        question: "What is the GP team's direct attribution on the top 5 pre-fund deals?",
        status: "Answered",
      },
      {
        id: "qa-mosaic-2",
        question: "Can you provide the downside portfolio construction scenario?",
        status: "Open",
      },
    ],
    tasks: [
      { id: "task-mosaic-1", label: "Upload attribution appendix", done: true },
      { id: "task-mosaic-2", label: "Prepare partner meeting agenda", done: false },
      { id: "task-mosaic-3", label: "Share founder reference contacts", done: false },
    ],
    docRequests: [
      { id: "doc-mosaic-1", label: "Downside portfolio construction case", done: false },
      { id: "doc-mosaic-2", label: "Full DDQ response", done: true },
      { id: "doc-mosaic-3", label: "Founder reference pack", done: false },
    ],
    events: [
      "LP approved match",
      "First call completed",
      "Diligence materials requested",
      "Attribution appendix uploaded",
    ],
  },
  "room-launchpad-diligence": {
    id: "room-launchpad-diligence",
    matchId: "match-launchpad-diligence",
    gpName: demoFundProfile.fundName,
    lpName: "Launchpad Fund of Funds",
    lpAlias: "Fund of Funds, $500M AUM",
    status: "Revealed",
    stage: "Diligence",
    pipelineStage: "Diligence active",
    meeting: "Thursday, Apr 17 at 3:30 PM PT",
    lastLpAction: "Launchpad requested benchmark comparison and portfolio construction details.",
    nextMilestone: "Benchmark review and portfolio construction discussion",
    decisionRisk: "Benchmark alignment and repeatability narrative need strengthening.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: "msg-launchpad-1",
        from: "Launchpad Fund of Funds",
        body: "We've reviewed the initial materials. Please provide a benchmark comparison and details on portfolio construction methodology.",
        time: "3 days ago",
      },
      {
        id: "msg-launchpad-2",
        from: demoFundProfile.fundName,
        body: "Benchmark comparison and portfolio construction memo attached. Happy to walk through it on Thursday's call.",
        time: "Today",
      },
    ],
    qas: [
      {
        id: "qa-launchpad-1",
        question: "How does Northstar's return profile compare to vintage benchmarks?",
        status: "Answered",
      },
      {
        id: "qa-launchpad-2",
        question: "What is the target portfolio size and follow-on reserve strategy?",
        status: "Open",
      },
    ],
    tasks: [
      { id: "task-launchpad-1", label: "Prepare benchmark comparison memo", done: true },
      { id: "task-launchpad-2", label: "Confirm Thursday call logistics", done: true },
      { id: "task-launchpad-3", label: "Draft portfolio construction summary", done: false },
    ],
    docRequests: [
      { id: "doc-launchpad-1", label: "Benchmark comparison analysis", done: true },
      { id: "doc-launchpad-2", label: "Portfolio construction memo", done: false },
    ],
    events: [
      "LP approved match",
      "First call completed",
      "Diligence materials requested",
      "Benchmark comparison uploaded",
    ],
  },
  "room-atlantic-ic": {
    id: "room-atlantic-ic",
    matchId: "match-atlantic-ic",
    gpName: demoFundProfile.fundName,
    lpName: "Atlantic Capital Partners",
    lpAlias: "Institutional Allocator, $3B AUM",
    status: "Revealed",
    stage: "IC Review",
    pipelineStage: "IC review",
    meeting: "Monday, Apr 21 at 10:00 AM PT",
    lastLpAction: "Atlantic completed references and submitted IC memo for review.",
    nextMilestone: "IC meeting on Monday — final decision expected within 2 weeks",
    decisionRisk: "IC approval pending; no blocking issues identified in diligence.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: "msg-atlantic-1",
        from: "Atlantic Capital Partners",
        body: "Diligence is complete and our IC memo has been submitted. The IC meeting is scheduled for Monday. We may follow up on a couple of reference details.",
        time: "2 days ago",
      },
      {
        id: "msg-atlantic-2",
        from: demoFundProfile.fundName,
        body: "Excellent news — we're ready for the IC. Please let us know if any additional materials are needed before Monday.",
        time: "Yesterday",
      },
    ],
    qas: [
      {
        id: "qa-atlantic-1",
        question: "Can you provide one additional LP reference from your pre-fund period?",
        status: "Answered",
      },
    ],
    tasks: [
      { id: "task-atlantic-1", label: "Confirm IC meeting logistics", done: true },
      { id: "task-atlantic-2", label: "Prepare IC presentation materials", done: true },
      { id: "task-atlantic-3", label: "Send final reference contact details", done: false },
    ],
    docRequests: [
      { id: "doc-atlantic-1", label: "IC presentation deck", done: true },
      { id: "doc-atlantic-2", label: "Additional LP reference", done: false },
    ],
    events: [
      "IC memo submitted",
      "IC meeting scheduled",
      "References reviewed",
      "Diligence complete",
    ],
  },
};

function cloneMarketplaceValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildMarketplaceDemoState() {
  return {
    gpProfile: cloneMarketplaceValue(demoGpProfile),
    fundProfile: cloneMarketplaceValue(demoFundProfile),
    documents: cloneMarketplaceValue(demoDocuments),
    lpProfile: cloneMarketplaceValue(demoLpProfile),
    lpMandates: cloneMarketplaceValue(demoLpMandates),
    matches: cloneMarketplaceValue(demoMatches),
    matchRequests: cloneMarketplaceValue(demoMatchRequests),
    recommendations: cloneMarketplaceValue(demoLpRecommendations),
    workflowRooms: cloneMarketplaceValue(demoWorkflowRooms),
  };
}

function normalizeMarketplaceDemoState(saved) {
  const base = buildMarketplaceDemoState();
  if (!saved || typeof saved !== "object") return base;
  const savedRequests = Array.isArray(saved.matchRequests) ? saved.matchRequests : [];
  const requestById = new Map(
    [...base.matchRequests, ...savedRequests].map((request) => [request.id, request])
  );
  return {
    ...base,
    ...saved,
    documents: {
      required: saved.documents?.required || base.documents.required,
      optional: saved.documents?.optional || base.documents.optional,
    },
    workflowRooms: {
      ...base.workflowRooms,
      ...(saved.workflowRooms || {}),
    },
    matches: base.matches,
    recommendations: base.recommendations,
    lpMandates: base.lpMandates,
    matchRequests: Array.from(requestById.values()),
  };
}

function useMarketplaceDemoState() {
  const [demoState, setDemoState] = useState(() =>
    normalizeMarketplaceDemoState(lsGet(MARKETPLACE_DEMO_STORAGE_KEY, null))
  );

  const updateDemoState = (updater) => {
    setDemoState((prev) => {
      const next =
        typeof updater === "function"
          ? normalizeMarketplaceDemoState(updater(prev))
          : normalizeMarketplaceDemoState(updater);
      lsSet(MARKETPLACE_DEMO_STORAGE_KEY, next);
      return next;
    });
  };

  const resetDemoState = () => {
    const next = buildMarketplaceDemoState();
    lsSet(MARKETPLACE_DEMO_STORAGE_KEY, next);
    setDemoState(next);
  };

  return [demoState, updateDemoState, resetDemoState];
}

function marketplaceRequiredReady(state) {
  const requiredDocs = state.documents.required || [];
  const pitchDeckReady = requiredDocs.some(
    (doc) => doc.id === "deck" && doc.status === "Ready"
  );
  return (
    state.gpProfile.completeness === 100 &&
    state.fundProfile.profileCompleteness === 100 &&
    state.fundProfile.fundCompleteness === 100 &&
    pitchDeckReady
  );
}

function createMarketplaceRoomFromRequest(request) {
  return {
    id: `room-${request.matchId}`,
    matchId: request.matchId,
    gpName: request.gpName,
    lpName: demoLpProfile.revealedName,
    lpAlias: demoLpProfile.publicAlias,
    status: "Revealed",
    stage: "Diligence",
    pipelineStage: "Decision room open",
    meeting: "Not scheduled",
    lastLpAction: "LP approved reveal and opened the permissioned workflow room.",
    nextMilestone: "Schedule first LP/GP diligence call",
    decisionRisk: "Waiting on founder reference pack and portfolio construction downside case.",
    permissionScope: "LP identity visible only inside this approved workflow.",
    messages: [
      {
        id: `msg-${Date.now()}-open`,
        from: demoLpProfile.revealedName,
        body: "Match approved. This room is now the shared workflow for diligence, scheduling, and Q&A.",
        time: "Just now",
      },
    ],
    qas: [
      {
        id: `qa-${Date.now()}-1`,
        question: "Confirm attribution for the top five pre-fund investments.",
        status: "Open",
      },
    ],
    tasks: [
      { id: `task-${Date.now()}-1`, label: "Review GP pitch deck", done: true },
      { id: `task-${Date.now()}-2`, label: "Schedule first LP/GP call", done: false },
      { id: `task-${Date.now()}-3`, label: "Confirm reference call list", done: false },
    ],
    docRequests: [
      { id: `doc-${Date.now()}-1`, label: "Founder reference pack", done: false },
      { id: `doc-${Date.now()}-2`, label: "Portfolio construction downside case", done: false },
    ],
    events: [
      "LP approved the match",
      "LP identity revealed inside workflow only",
      "Shared room opened",
    ],
  };
}

function MPButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary: {
      background: disabled
        ? "rgba(255,255,255,0.06)"
        : hovered
        ? "#786de0"
        : "#6f64d5",
      color: MP.white,
      border: `1px solid ${disabled ? MP.lineStrong : "rgba(255,255,255,0.08)"}`,
      boxShadow: "none",
    },
    secondary: {
      background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
      color: hovered ? MP.text : MP.soft,
      border: `1px solid ${hovered ? MP.lineStrong : MP.line}`,
    },
    ghost: {
      background: "transparent",
      color: hovered ? MP.text : MP.soft,
      border: "1px solid transparent",
    },
    danger: {
      background: hovered ? "rgba(199,169,107,.13)" : "rgba(199,169,107,.08)",
      color: MP.amber,
      border: "1px solid rgba(199,169,107,.20)",
    },
  };
  const sizes = {
    sm: { minHeight: 32, padding: "0 12px", fontSize: 11.5 },
    md: { minHeight: 36, padding: "0 16px", fontSize: 12.2 },
    lg: { minHeight: 42, padding: "0 20px", fontSize: 13 },
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: MP.radius.sm,
        fontWeight: 720,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.62 : 1,
        transition: "all .16s ease",
        whiteSpace: "nowrap",
        letterSpacing: 0,
        fontFamily: MP.type.body,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function MPPill({ children, tone = "neutral", style = {} }) {
  const tones = {
    neutral: { color: MP.soft, bg: "transparent", border: MP.line },
    accent: { color: MP.text, bg: "transparent", border: "rgba(123,111,232,.22)" },
    green: { color: MP.text, bg: "transparent", border: "rgba(98,201,146,.22)" },
    blue: { color: MP.soft, bg: "transparent", border: MP.line },
    amber: { color: MP.text, bg: "transparent", border: "rgba(199,169,107,.22)" },
    red: { color: MP.text, bg: "transparent", border: "rgba(199,169,107,.22)" },
    dark: { color: MP.text, bg: "transparent", border: MP.lineStrong },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "3px 8px",
        fontSize: 9.6,
        lineHeight: 1.1,
        fontWeight: 560,
        letterSpacing: 0,
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function MPStatusDot({ tone = "neutral", style = {} }) {
  const color =
    tone === "green"
      ? MP.green
      : tone === "amber" || tone === "red"
      ? MP.amber
      : tone === "accent"
      ? MP.accent
      : MP.muted;
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: 999,
        background: color,
        boxShadow: "none",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function MPCard({ children, style = {}, elevated = false, fill = false }) {
  return (
    <div
      style={{
        background: MP.panel,
        border: `1px solid ${MP.line}`,
        borderTop: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: MP.radius.sm,
        padding: 14,
        boxShadow: elevated ? MP.shadow.panel : "none",
        color: MP.text,
        height: fill ? "100%" : undefined,
        minWidth: 0,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MPSectionTitle({ title, kicker, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 10,
        paddingBottom: 9,
        borderBottom: `1px solid ${MP.line}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 9, minWidth: 0 }}>
        <div style={{ fontSize: 13.8, fontWeight: 680, color: MP.text, letterSpacing: 0 }}>
          {title}
        </div>
        {kicker && (
          <div style={{ fontSize: 10.8, color: MP.muted, fontWeight: 520 }}>
            {kicker}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

function MPTableHeader({ columns, template, style = {} }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: template,
        gap: "0 12px",
        padding: "0 0 8px",
        borderBottom: `1px solid ${MP.line}`,
        ...style,
      }}
    >
      {columns.map((column) => (
        <span key={column} style={MP_TYPE.label}>
          {column}
        </span>
      ))}
    </div>
  );
}

function MPTableButtonRow({ children, template, active = false, onClick, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: template,
        ...MP_ROW_BASE,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        background: active ? MP.accentSoft : "transparent",
        boxShadow: active ? `inset 2px 0 0 ${MP.accent}` : "none",
        color: MP.text,
        textAlign: "left",
        cursor: "pointer",
        fontFamily: MP.type.body,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function MPPageHeader({ title, subtitle, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${MP.line}`,
      }}
    >
      <div style={{ maxWidth: 760 }}>
        <h1
          style={{
            fontSize: 27,
            lineHeight: 1.12,
            letterSpacing: 0,
            fontWeight: 650,
            marginBottom: subtitle ? 6 : 0,
            color: MP.text,
            fontFamily: MP.type.display,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: MP.soft, lineHeight: 1.45, maxWidth: 620 }}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function MPProgress({ value, color = MP.green, label }) {
  return (
    <div>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 12,
            color: MP.soft,
            fontWeight: 680,
          }}
        >
          <span>{label}</span>
          <span className="marketplace-mono">{value}%</span>
        </div>
      )}
      <div
        style={{
          height: 8,
          background: "rgba(255,255,255,.04)",
          borderRadius: 999,
          overflow: "hidden",
          border: `1px solid ${MP.line}`,
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width .35s ease",
          }}
        />
      </div>
    </div>
  );
}

const MARKETPLACE_STEPS = [
  "Profile",
  "Readiness",
  "Anonymous match",
  "Submit request",
  "LP review",
  "Reveal decision",
  "Decision room",
];

function MPWorkflowStepper({ activeStep = 0 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(96px, 1fr))",
        gap: 16,
        alignItems: "center",
        height: 56,
        padding: "0 40px",
        borderTop: `1px solid ${MP.line}`,
        background: MP.panel,
        overflowX: "auto",
      }}
    >
      {MARKETPLACE_STEPS.map((step, index) => {
        const done = index < activeStep;
        const active = index === activeStep;
        return (
          <div
            key={step}
            style={{
              minWidth: 0,
              display: "grid",
              gap: 8,
              color: active || done ? MP.text : MP.muted,
              fontSize: 11,
              fontWeight: active ? 700 : 620,
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                height: 2,
                borderRadius: 999,
                background: done ? "rgba(98,201,146,.72)" : active ? MP.accent : "rgba(255,255,255,.08)",
              }}
            />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MPRecommendedAction({ title, body, cta, onClick, tone = "green", meta }) {
  const color = tone === "blue" ? MP.blue : tone === "amber" ? MP.amber : MP.accent;
  return (
    <MPCard
      style={{
        marginBottom: 16,
        padding: "13px 14px",
        background: MP.panel2,
        borderColor: MP.line,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 260, flex: 1 }}>
          <div
            style={{
              fontSize: 9.6,
              fontWeight: 760,
              color,
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            Recommended next action
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0, lineHeight: 1.25 }}>
            {title}
          </div>
          <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.4, marginTop: 3 }}>
            {body}
          </div>
          {meta && (
            <div style={{ color: MP.muted, fontSize: 11.5, marginTop: 6 }}>
              {meta}
            </div>
          )}
        </div>
        {cta && (
          <MPButton onClick={onClick} variant={tone === "amber" ? "secondary" : "primary"}>
            {cta}
          </MPButton>
        )}
      </div>
    </MPCard>
  );
}

function MPStatusRail({ status }) {
  const steps = [
    { label: "Sent", full: "Submitted" },
    { label: "In Review", full: "In LP Review" },
    {
      label: status === "More Info Requested" ? "More Info" : status === "Declined" ? "Declined" : "Decision",
      full: status === "More Info Requested" ? "More Info Requested" : status === "Declined" ? "Declined" : "Reveal Decision",
    },
    { label: "Room Open", full: "Workflow Open" },
  ];
  const activeIndex =
    status === "Approved"
      ? 3
      : status === "More Info Requested" || status === "Declined"
      ? 2
      : 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {steps.map(({ label, full }, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div
            key={full}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 10px",
              borderRadius: 7,
              background: done ? "rgba(98,201,146,.08)" : active ? MP.accentSoft : MP.panel2,
              border: `1px solid ${done ? "rgba(98,201,146,.16)" : active ? "rgba(123,111,232,.24)" : MP.line}`,
              color: done ? MP.green : active ? MP.text : MP.muted,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 999, background: done ? MP.green : active ? MP.accent : MP.muted, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>
            {done && <span style={{ marginLeft: "auto", fontSize: 9, color: MP.green, fontWeight: 800 }}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function MPRoomStatusPanel({ room }) {
  const outstandingTasks = (room.tasks || []).filter((task) => !task.done).length;
  const outstandingDocs = (room.docRequests || []).filter((doc) => !doc.done).length;
  const openQuestions = (room.qas || []).filter((qa) => qa.status !== "Answered").length;
  const outstanding = outstandingTasks + outstandingDocs + openQuestions;
  const requiredBeforeIc = Math.min(2, outstanding);
  const followUpItems = Math.max(0, outstanding - requiredBeforeIc);
  return (
    <MPCard
      elevated
      style={{
        marginBottom: 18,
        background: MP.panel,
        borderColor: MP.line,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, color: MP.muted, fontWeight: 780, textTransform: "uppercase", marginBottom: 6 }}>
            <MPStatusDot tone="accent" />
            Decision room
          </div>
          <div style={{ fontSize: 16, fontWeight: 760, letterSpacing: 0 }}>
            {room.pipelineStage}
          </div>
          <div style={{ color: MP.soft, fontSize: 13, marginTop: 6 }}>
            {room.permissionScope || "LP identity visible only inside this approved workflow."}
          </div>
        </div>
        <MPPill tone="accent">Identity revealed only in-room</MPPill>
      </div>
      <div className="marketplace-grid-4">
        {[
          [
            "Open diligence items",
            String(outstanding),
            `${requiredBeforeIc} required before IC · ${followUpItems} follow-up items`,
            MP.amber,
          ],
          ["Last LP action", room.lastLpAction || "LP opened the workflow", "", MP.blue],
          ["Next milestone", room.nextMilestone || "Diligence follow-up", "", MP.text],
          ["Current decision risk", room.decisionRisk || "Waiting on open diligence items", "", MP.text],
        ].map(([label, value, sub, color]) => (
          <div
            key={label}
            style={{
              padding: 12,
              borderRadius: 8,
              background: MP.panel,
              border: `1px solid ${MP.line}`,
              minHeight: 96,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5, color: MP.muted, fontWeight: 760, textTransform: "uppercase", marginBottom: 7 }}>
              <MPStatusDot tone={label === "Open diligence items" ? "amber" : label === "Last LP action" ? "accent" : label === "Next milestone" ? "green" : "neutral"} />
              <span>{label}</span>
            </div>
            <div
              className={label === "Open diligence items" ? "marketplace-mono" : undefined}
              style={{
                color,
                fontWeight: 820,
                fontSize: label === "Open diligence items" ? 25 : 12.5,
                lineHeight: 1.35,
              }}
            >
              {value}
            </div>
            {sub && (
              <div style={{ color: MP.soft, fontSize: 11.5, lineHeight: 1.35, marginTop: 5 }}>
                {sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </MPCard>
  );
}

function MPRequiredMilestonePanel() {
  const items = [
    ["Upload 2 founder references", "Missing", "red"],
    ["Add downside construction scenario", "In progress", "amber"],
    ["Confirm meeting agenda and attendees", "Ready", "green"],
  ];
  return (
    <MPCard elevated>
      <MPSectionTitle title="Required for next milestone" kicker="IC prep gate" />
      <div style={{ display: "grid", gap: 9 }}>
        {items.map(([label, status, tone]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              padding: "10px 0",
              borderTop: `1px solid ${MP.line}`,
              fontSize: 12.5,
            }}
          >
            <span style={{ color: MP.text, fontWeight: 720 }}>{label}</span>
            <MPPill tone={tone}>{status}</MPPill>
          </div>
        ))}
      </div>
    </MPCard>
  );
}

function MPMetricCard({ label, value, sub, tone = "green" }) {
  const color = tone === "blue" ? MP.blue : tone === "amber" || tone === "red" ? MP.amber : MP.green;
  return (
    <MPCard style={{ padding: 16 }}>
      <div
        style={{
          fontSize: 11,
          color: MP.muted,
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 8,
          letterSpacing: 0.6,
        }}
      >
        {label}
      </div>
      <div
        className="marketplace-mono"
        style={{ fontSize: 22, lineHeight: 1, fontWeight: 620, color }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: MP.soft, marginTop: 16, lineHeight: 1.5 }}>
          {sub}
        </div>
      )}
    </MPCard>
  );
}

function MPCapitalPathMap({ onOpenRoom }) {
  return (
    <section
      style={{
        background: MP.panel,
        border: `1px solid ${MP.line}`,
        borderTop: `1px solid ${MP.line}`,
        borderRadius: MP.radius.sm,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          padding: "10px 16px 9px",
          borderBottom: `1px solid ${MP.line}`,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: MP.text, fontSize: 14.5, fontWeight: 680, lineHeight: 1.2 }}>
            Capital Path
          </div>
        </div>
        {onOpenRoom && (
          <MPButton
            size="sm"
            variant="secondary"
            onClick={onOpenRoom}
            style={{
              background: "rgba(123,111,232,.12)",
              borderColor: "rgba(123,111,232,.28)",
              color: MP.text,
            }}
          >
            Decision Room
          </MPButton>
        )}
      </div>

      <div className="marketplace-capital-path-map">
        {CAPITAL_PATH_STAGES.map((stage, index) => {
          const displayCount = stage.count === "0" ? "—" : stage.count;
          return (
            <div
              key={stage.label}
              className="marketplace-capital-path-stage"
              style={{
                position: "relative",
                minWidth: 0,
                padding: "10px 13px 9px",
                background: "transparent",
                borderLeft: index === 0 ? "none" : `1px solid ${MP.line}`,
                boxShadow: `inset 0 2px 0 rgba(98,201,146,.35)`,
              }}
            >
              {index < CAPITAL_PATH_STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 38,
                    right: -6,
                    zIndex: 2,
                    width: 12,
                    height: 1,
                    background: MP.line,
                  }}
                />
              )}
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ ...MP_TYPE.label, color: MP.muted, lineHeight: 1.15 }}>{stage.label}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="marketplace-mono" style={{ color: stage.count === "0" ? MP.muted : MP.text, fontSize: 23, fontWeight: 740, lineHeight: 0.95 }}>
                    {displayCount}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MPActionStrip({ label, title, body, cta, onClick, tone = "accent" }) {
  const color =
    tone === "green" ? MP.green : tone === "amber" ? MP.amber : tone === "blue" ? MP.blue : MP.accent;
  return (
    <div
      className="marketplace-action-strip"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 110px) minmax(0, 1fr) auto",
        gap: 18,
        alignItems: "center",
        padding: "18px 20px",
        borderRadius: MP.radius.md,
        background: MP.panel,
        border: `1px solid ${MP.line}`,
        boxShadow: "none",
      }}
    >
      <div
        style={{
          color: MP.muted,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: MP.text, fontSize: 16, fontWeight: 720, lineHeight: 1.25, fontFamily: MP.type.display }}>
          {title}
        </div>
        <div style={{ color: MP.soft, fontSize: 13.2, lineHeight: 1.55, marginTop: 6 }}>
          {body}
        </div>
      </div>
      {cta && (
        <MPButton size="md" onClick={onClick}>
          {cta}
        </MPButton>
      )}
    </div>
  );
}

function MPOperatingKpiStrip({ items }) {
  return (
    <MPCard style={{ padding: 0, overflow: "hidden", background: MP.panel }}>
      <div
        className="marketplace-kpi-strip"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.label}
            style={{
              padding: "14px 16px",
              borderLeft: index === 0 ? "none" : `1px solid ${MP.line}`,
              minHeight: 78,
            }}
          >
            <div
              style={{
                color: MP.muted,
                fontSize: 9.5,
                fontWeight: 760,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {item.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                className="marketplace-mono"
                style={{ color: item.color || MP.text, fontSize: 23, fontWeight: 620, lineHeight: 1 }}
              >
                {item.value}
              </span>
              {item.meta && (
                <span style={{ color: MP.soft, fontSize: 11.5, fontWeight: 700 }}>
                  {item.meta}
                </span>
              )}
            </div>
            {item.sub && (
              <div style={{ color: MP.soft, fontSize: 11.5, lineHeight: 1.35, marginTop: 7 }}>
                {item.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </MPCard>
  );
}

function MPMatchRankRow({ match, rank, request, onInspect, onRequest, onOpenRoom, showSubmit = true }) {
  const statusTone =
    request?.status === "Approved"
      ? "green"
      : request?.status === "Declined"
      ? "red"
      : request?.status === "More Info Requested"
      ? "amber"
      : request?.status === "Pending"
      ? "blue"
      : "neutral";
  const canRequest = match.requestable && !request;
  return (
    <div
      className="marketplace-match-rank-row"
      style={{
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr) 72px 116px auto",
        gap: 14,
        alignItems: "center",
        padding: "14px 0",
        borderTop: `1px solid ${MP.line}`,
      }}
    >
      <div
        className="marketplace-mono"
        style={{
          width: 24,
          height: 24,
          borderRadius: MP.radius.xs,
          border: `1px solid ${rank === 1 ? "rgba(123,111,232,.22)" : MP.line}`,
          background: rank === 1 ? MP.accentSoft : "rgba(237,234,248,.04)",
          color: rank === 1 ? MP.text : MP.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9.8,
          fontWeight: 700,
        }}
      >
        {rank}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: MP.text, fontSize: 13.6, fontWeight: 700, lineHeight: 1.25 }}>
          {request?.status === "Approved" ? match.lpName : match.lpAlias}
        </div>
        <div style={{ color: MP.soft, fontSize: 11.7, lineHeight: 1.35, marginTop: 4 }}>
          {match.mandate} · {match.checkRange} · {match.geography}
        </div>
      </div>
      <div>
        <div className="marketplace-mono" style={{ color: match.score >= 85 ? MP.green : MP.blue, fontSize: 20, fontWeight: 620, lineHeight: 1 }}>
          {match.score}
        </div>
        <div style={{ color: MP.muted, fontSize: 9.2, textTransform: "uppercase", fontWeight: 760, marginTop: 3 }}>
          fit
        </div>
      </div>
      <MPPill tone={request ? statusTone : match.requestable ? "green" : "red"}>
        {request ? request.status : match.requestable ? "Requestable" : "Below gate"}
      </MPPill>
      <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
        <MPButton size="sm" variant="secondary" onClick={onInspect}>
          View LP Fit
        </MPButton>
        {request?.status === "Approved" ? (
          <MPButton size="sm" onClick={onOpenRoom}>
            Open Room
          </MPButton>
        ) : canRequest && showSubmit ? (
          <MPButton size="sm" onClick={onRequest}>
            Submit Request
          </MPButton>
        ) : request || !match.requestable ? (
          <MPButton size="sm" variant="secondary" disabled>
            {request ? "Submitted" : "Blocked"}
          </MPButton>
        ) : null}
      </div>
    </div>
  );
}

function MPDeskPanel({ title, kicker, action, children, style = {}, elevated = false, fill = true }) {
  return (
    <MPCard
      elevated={elevated}
      fill={fill}
      style={{
        padding: 16,
        background: MP.panel,
        display: fill ? "flex" : undefined,
        flexDirection: fill ? "column" : undefined,
        ...style,
      }}
    >
      {(title || kicker || action) && (
        <MPSectionTitle title={title} kicker={kicker} action={action} />
      )}
      <div
        style={{
          flex: fill ? 1 : undefined,
          minHeight: 0,
          display: fill ? "flex" : undefined,
          flexDirection: fill ? "column" : undefined,
        }}
      >
        {children}
      </div>
    </MPCard>
  );
}

function MPCompactStat({ label, value, note, tone = "neutral" }) {
  const color =
    tone === "green"
      ? MP.green
      : tone === "amber"
      ? MP.amber
      : tone === "blue"
      ? MP.blue
      : tone === "accent"
      ? MP.accent
      : MP.text;
  return (
    <div
      style={{
        padding: "16px 0",
        borderTop: `1px solid ${MP.line}`,
      }}
    >
      <div
        style={{
          color: MP.muted,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span
          className="marketplace-mono"
          style={{ color, fontSize: 24, fontWeight: 620, lineHeight: 1 }}
        >
          {value}
        </span>
        {note && (
          <span style={{ color: MP.soft, fontSize: 12, lineHeight: 1.4 }}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

function GPCommandPanel({ title, body, fund, readiness, cta, onClick }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 240px) auto",
        gap: 18,
        alignItems: "center",
        padding: "18px 20px",
        borderRadius: MP.radius.md,
        background: MP.panel,
        border: `1px solid ${MP.line}`,
        boxShadow: "none",
      }}
      className="marketplace-action-strip"
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: MP.muted,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            marginBottom: 6,
          }}
        >
          GP fundraising command
        </div>
        <div style={{ color: MP.text, fontSize: 20, fontWeight: 760, lineHeight: 1.1, fontFamily: MP.type.display }}>
          {title}
        </div>
        <div style={{ color: MP.soft, fontSize: 13.5, lineHeight: 1.55, marginTop: 8 }}>
          {body}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 80px",
          gap: 12,
          alignItems: "center",
          paddingLeft: 24,
          borderLeft: `1px solid ${MP.line}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: MP.text, fontSize: 14, fontWeight: 700 }}>
            {fund.fundName}
          </div>
          <div style={{ color: MP.muted, fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
            {fund.fundGeneration} · {fund.targetFundSize} target · {fund.raiseStage}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="marketplace-mono" style={{ color: MP.green, fontSize: 22, fontWeight: 620 }}>
            {readiness}%
          </div>
          <div style={{ color: MP.muted, fontSize: 11, textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.6 }}>
            ready
          </div>
        </div>
      </div>
      <MPButton onClick={onClick}>{cta}</MPButton>
    </div>
  );
}

function LPReviewPanel({ title, body, profile, activeMandates, cta, onClick }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 240px) auto",
        gap: 18,
        alignItems: "center",
        padding: "18px 20px",
        borderRadius: MP.radius.md,
        background: MP.panel,
        border: `1px solid ${MP.line}`,
        boxShadow: "none",
      }}
      className="marketplace-action-strip"
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: MP.muted,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            marginBottom: 6,
          }}
        >
          Allocator review desk
        </div>
        <div style={{ color: MP.text, fontSize: 20, fontWeight: 760, lineHeight: 1.1, fontFamily: MP.type.display }}>
          {title}
        </div>
        <div style={{ color: MP.soft, fontSize: 13.5, lineHeight: 1.55, marginTop: 8 }}>
          {body}
        </div>
      </div>
      <div
        style={{
          paddingLeft: 24,
          borderLeft: `1px solid ${MP.line}`,
        }}
      >
        <div style={{ color: MP.text, fontSize: 14, fontWeight: 700 }}>
          {profile.revealedName}
        </div>
        <div style={{ color: MP.muted, fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
          {profile.type} · {profile.aumBand} AUM · {activeMandates} active mandate
        </div>
      </div>
      <MPButton onClick={onClick}>{cta}</MPButton>
    </div>
  );
}

function RequestPacketTable({ groups, onToggle }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {groups.map((group) => (
        <MPDocumentPacketTable
          key={group.title}
          title={group.title}
          kicker={group.kicker}
          docs={group.docs}
          group={group.group}
          tone={group.tone}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function GPRequestRow({ request, match, onPrimary, onSecondary }) {
  const tone =
    request.status === "Approved"
      ? "green"
      : request.status === "Declined"
      ? "red"
      : request.status === "More Info Requested"
      ? "amber"
      : "blue";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 132px auto",
        gap: 12,
        alignItems: "center",
        padding: "12px 0",
        borderTop: `1px solid ${MP.line}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: MP.text, fontSize: 13.5, fontWeight: 700 }}>
            {request.status === "Approved" ? match?.lpName : match?.lpAlias}
          </span>
          <MPPill tone={tone}>{request.status}</MPPill>
        </div>
        <div style={{ color: MP.soft, fontSize: 11.8, lineHeight: 1.4, marginTop: 4 }}>
          Submitted {request.requestedAt} · {request.score} fit · identity hidden until approval
        </div>
        <button
          type="button"
          onClick={onSecondary}
          style={{
            border: "none",
            background: "transparent",
            color: request.status === "Approved" ? MP.green : MP.amber,
            padding: 0,
            cursor: "pointer",
            fontSize: 11.6,
            fontWeight: 680,
            textAlign: "left",
            marginTop: 5,
          }}
        >
          {request.status === "Approved" ? "Best next move: open room" : "Best next move: improve packet"}
        </button>
      </div>
      <div>
        <div style={{ color: MP.muted, fontSize: 9.5, fontWeight: 760, textTransform: "uppercase", marginBottom: 4 }}>
          Review status
        </div>
        <div style={{ color: MP.text, fontSize: 12, lineHeight: 1.35 }}>
          {request.status === "Pending"
            ? "In allocator queue"
            : request.status === "Approved"
            ? "Reveal approved"
            : request.status === "More Info Requested"
            ? "More info requested"
            : request.status === "Declined"
            ? "Not proceeding"
            : "Saved"}
        </div>
      </div>
      <MPButton size="sm" variant={request.status === "Approved" ? "primary" : "secondary"} onClick={onPrimary}>
        {request.status === "Approved" ? "Open Room" : "View Request"}
      </MPButton>
    </div>
  );
}

function ReviewQueueTable({ requests, selectedId, onSelect }) {
  const template = "28px minmax(0,1.3fr) 56px 96px 96px 86px 70px minmax(0,.9fr)";
  return (
    <div>
      <MPTableHeader
        columns={["#", "Manager / source", "Fit", "Status", "Owner", "Due", "Docs", "Last activity"]}
        template={template}
      />
      {requests.map((request, index) => {
        const active = selectedId === request.id;
        const tone =
          request.status === "Approved"
            ? "green"
            : request.status === "Declined"
            ? "red"
            : request.status === "More Info Requested"
            ? "amber"
            : "blue";
        const statusLabel =
          request.status === "More Info Requested" ? "More info" : request.status;
        const reviewOwners = ["Avery Sloan", "Priya Raman", "Miles Ortega", "Helena Park", "Omar Fields", "Nina Patel"];
        const owner = reviewOwners[index % reviewOwners.length];
        const due = index < 2 ? "Today" : index < 5 ? "This week" : "Next week";
        const lastActivity =
          index === 0
            ? "Packet opened 12m ago"
            : index === 1
            ? "Room opened yesterday"
            : index === 2
            ? "IC owner left comment"
            : request.status === "More Info Requested"
            ? "Info request sent"
            : "Docs synced today";
        return (
          <button
            key={request.id}
            type="button"
            onClick={() => onSelect(request)}
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: template,
              gap: "0 12px",
              alignItems: "center",
              textAlign: "left",
              border: "none",
              borderTop: `1px solid ${MP.line}`,
              background: active ? MP.accentSoft : "transparent",
              color: MP.text,
              padding: active ? "10px 0 10px 8px" : "10px 0",
              cursor: "pointer",
              boxShadow: active ? `inset 2px 0 0 ${MP.accent}` : "none",
            }}
          >
            <span
              className="marketplace-mono"
              style={{
                color: active ? MP.text : MP.muted,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>
                {request.gpName}
              </span>
              <span style={{ display: "block", color: MP.soft, fontSize: 12, lineHeight: 1.35, marginTop: 4 }}>
                {request.source} · {request.fundSize} · {request.generation}
              </span>
            </span>
            <span className="marketplace-mono" style={{ color: request.score >= 85 ? MP.green : MP.soft, fontSize: 20, fontWeight: 740, textAlign: "center" }}>
              {request.score}
            </span>
            <MPPill
              tone={tone}
              style={{
                justifySelf: "start",
                maxWidth: 94,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {statusLabel}
            </MPPill>
            <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{owner}</span>
            <span style={{ ...MP_TYPE.rowMeta, color: index < 2 ? MP.amber : MP.soft }}>{due}</span>
            <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{request.docs?.length || 0} files</span>
            <span style={{ ...MP_TYPE.rowMeta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastActivity}</span>
          </button>
        );
      })}
    </div>
  );
}

function MandateCard({ mandate }) {
  return (
    <MPDeskPanel
      title={mandate.name}
      kicker={`${mandate.status} investment policy`}
      action={<MPPill tone={mandate.status === "Active" ? "green" : "amber"}>{mandate.status}</MPPill>}
      elevated
    >
      <div className="marketplace-grid-2">
        <div>
          <MPDataRow label="Strategy" value={mandate.strategy} />
          <MPDataRow label="Fund generation" value={mandate.fundGeneration} />
          <MPDataRow label="Fund size range" value={mandate.fundSizeRange} />
          <MPDataRow label="Target check" value={mandate.targetCheck} />
          <MPDataRow label="Pacing window" value={mandate.pacing} />
        </div>
        <div>
          <MPDataRow label="Emerging manager appetite" value={mandate.emergingManagerAppetite} />
          <MPDataRow label="Co-invest appetite" value={mandate.coInvestAppetite} />
          <MPDataRow label="Track record requirement" value={mandate.trackRecordRequirement} />
          <MPDataRow label="Exclusions" value={mandate.exclusions} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>
        {[...mandate.sectors, ...mandate.geographies].map((tag) => (
          <MPPill key={tag} tone="neutral">
            {tag}
          </MPPill>
        ))}
      </div>
    </MPDeskPanel>
  );
}

function DiligenceRoomLayout({ children }) {
  return <div className="marketplace-workflow-room">{children}</div>;
}

function MPDataRow({ label, value, mono = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(90px, .82fr) minmax(0, 1.18fr)",
        alignItems: "center",
        gap: 10,
        padding: "7px 0",
        borderTop: `1px solid ${MP.line}`,
        minHeight: 34,
        boxSizing: "border-box",
      }}
    >
      <span style={{ ...MP_TYPE.label, color: MP.muted, minWidth: 0 }}>{label}</span>
      <span
        className={mono ? "marketplace-mono" : undefined}
        style={{ color: MP.text, fontSize: 12.2, fontWeight: 500, textAlign: "right", lineHeight: 1.34, overflowWrap: "anywhere" }}
      >
        {value}
      </span>
    </div>
  );
}

function MPLpNameCell({ title, meta }) {
  return (
    <span style={{ minWidth: 0 }}>
      <span
        style={{
          ...MP_TYPE.rowTitle,
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
      {meta && (
        <span
          style={{
            ...MP_TYPE.rowMeta,
            display: "block",
            marginTop: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {meta}
        </span>
      )}
    </span>
  );
}

function MPNumberCell({ value, color = MP.text, label, style = {} }) {
  return (
    <span style={style}>
      <span className="marketplace-mono" style={{ ...MP_TYPE.number, color }}>
        {value}
      </span>
      {label && (
        <span style={{ display: "block", ...MP_TYPE.label, fontSize: 8.8, marginTop: 2 }}>
          {label}
        </span>
      )}
    </span>
  );
}

function MPDocRow({ doc, onToggle, compact = false }) {
  const tone =
    doc.status === "Ready"
      ? "green"
      : doc.status === "Partial"
      ? "amber"
      : doc.status === "Missing"
      ? "red"
      : "neutral";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr auto" : "minmax(0, 1fr) auto auto",
        gap: 12,
        alignItems: "center",
        padding: compact ? "10px 0" : "12px 0",
        borderTop: `1px solid ${MP.line}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 760 }}>{doc.name || doc[0]}</span>
          {doc.required && <MPPill tone="blue">Required</MPPill>}
        </div>
        {!compact && (
          <div style={{ fontSize: 11.5, color: MP.soft, marginTop: 4, lineHeight: 1.45 }}>
            {doc.note || doc.updated || "LP-visible document"}
          </div>
        )}
      </div>
      <MPPill tone={tone}>{doc.status || doc[1]}</MPPill>
      {!compact && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            border: `1px solid ${doc.visible ? "rgba(52,211,153,.28)" : MP.line}`,
            background: doc.visible ? "rgba(52,211,153,.12)" : MP.panel2,
            color: doc.visible ? MP.green : MP.soft,
            borderRadius: 8,
            padding: "6px 9px",
            fontSize: 11,
            fontWeight: 760,
            cursor: onToggle ? "pointer" : "default",
          }}
        >
          {doc.visible ? "LP visible" : "Locked"}
        </button>
      )}
    </div>
  );
}

function MPDocumentPacketTable({ title, kicker, docs, onToggle, group, tone = "neutral" }) {
  const toneColor =
    tone === "green" ? MP.green : tone === "amber" || tone === "red" ? MP.amber : MP.muted;
  return (
    <MPCard
      style={{
        padding: 0,
        overflow: "hidden",
        borderColor: MP.line,
      }}
    >
      <div
        style={{
          padding: "13px 15px",
          borderBottom: `1px solid ${MP.line}`,
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "center",
          background: MP.panel,
        }}
      >
        <div>
          <div style={{ fontSize: 10.5, color: toneColor, fontWeight: 760, textTransform: "uppercase", marginBottom: 3 }}>
            {kicker}
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 820 }}>{title}</div>
        </div>
        <MPPill tone={tone}>{docs.length} items</MPPill>
      </div>
      <div>
        {docs.map((doc) => {
          const visibleTone = doc.visible ? "green" : "neutral";
          const statusTone =
            doc.status === "Ready"
              ? "green"
              : doc.status === "Partial"
              ? "amber"
              : doc.status === "Missing"
              ? "red"
              : "neutral";
          return (
            <div
              key={doc.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 96px 92px auto",
                gap: 12,
                alignItems: "center",
                padding: "12px 15px",
                borderTop: `1px solid ${MP.line}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.2, fontWeight: 780, color: MP.text }}>
                  {doc.name}
                </div>
                <div style={{ fontSize: 11.5, color: MP.soft, lineHeight: 1.35, marginTop: 3 }}>
                  {doc.note || doc.updated || "LP-visible packet item"}
                </div>
              </div>
              <MPPill tone={statusTone}>{doc.status}</MPPill>
              <MPPill tone={visibleTone}>{doc.visible ? "Visible" : "Locked"}</MPPill>
              <button
                type="button"
                onClick={() => onToggle(group, doc.id)}
                style={{
                  border: `1px solid ${MP.line}`,
                  background: "transparent",
                  color: MP.soft,
                  borderRadius: 7,
                  padding: "6px 8px",
                  fontSize: 11,
                  fontWeight: 760,
                  cursor: "pointer",
                }}
              >
                {doc.visible ? "Lock" : "Share"}
              </button>
            </div>
          );
        })}
      </div>
    </MPCard>
  );
}

function MPActivityIcon({ tone = "neutral", label = "" }) {
  const tones = {
    accent: { color: MP.text, bg: "rgba(123,111,232,.10)", border: "rgba(123,111,232,.18)" },
    green: { color: MP.green, bg: "rgba(98,201,146,.08)", border: "rgba(98,201,146,.17)" },
    amber: { color: MP.amber, bg: "rgba(199,169,107,.08)", border: "rgba(199,169,107,.16)" },
    red: { color: MP.amber, bg: "rgba(199,169,107,.08)", border: "rgba(199,169,107,.16)" },
    neutral: { color: MP.soft, bg: "rgba(237,234,248,.055)", border: "rgba(237,234,248,.075)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      className="marketplace-mono"
      style={{
        width: 26,
        height: 26,
        borderRadius: MP.radius.sm,
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 760,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

function MPActivityRow({ title, time, tone = "neutral", icon = "*" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "26px minmax(0, 1fr)",
        gap: 10,
        alignItems: "start",
        padding: "8px 0",
      }}
    >
      <MPActivityIcon tone={tone} label={icon} />
      <div style={{ minWidth: 0 }}>
        <div style={{ color: MP.text, fontSize: 12.6, lineHeight: 1.28, fontWeight: 560 }}>
          {title}
        </div>
        <div style={{ color: MP.muted, fontSize: 11.2, lineHeight: 1.25, marginTop: 3 }}>
          {time}
        </div>
      </div>
    </div>
  );
}

function MPActivitySection({ title, children }) {
  return (
    <section style={{ display: "grid", gap: 3 }}>
      <div
        style={{
          color: MP.text,
          fontSize: 13.2,
          lineHeight: 1.2,
          fontWeight: 650,
          padding: "4px 0 8px",
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function MPRightRail({ role = "gp" }) {
  const isLp = role === "lp";
  const notifications = isLp
    ? [
        ["Northstar submitted a reveal request.", "Just now", "accent", "RQ"],
        ["Aurora Bio updated DDQ.", "59 minutes ago", "green", "DD"],
        ["Northline responded to info request.", "12 hours ago", "amber", "IR"],
        ["New recommendation surfaced for emerging VC mandate.", "Today, 11:59 AM", "accent", "AI"],
        ["IC prep item still open.", "Yesterday", "amber", "IC"],
      ]
    : [
        ["University Endowment opened your request packet.", "Just now", "accent", "PK"],
        ["Cedar Grove approved reveal.", "59 minutes ago", "green", "OK"],
        ["Founder references still missing.", "12 hours ago", "amber", "RF"],
        ["Downside case requested before IC.", "Today, 11:59 AM", "amber", "IC"],
        ["University Endowment request remains in allocator queue.", "Yesterday", "neutral", "Q"],
      ];
  const activities = isLp
    ? [
        ["Mandate fit updated.", "Just now", "accent", "FT"],
        ["Request moved to review.", "59 minutes ago", "accent", "RV"],
        ["Reveal approved.", "12 hours ago", "green", "OK"],
        ["GP documents opened.", "Today, 11:59 AM", "neutral", "DC"],
        ["More info request sent.", "Yesterday", "amber", "IR"],
      ]
    : [
        ["Request submitted to LP queue.", "Just now", "accent", "RQ"],
        ["Pitch deck viewed.", "59 minutes ago", "green", "PD"],
        ["DDQ marked ready.", "12 hours ago", "green", "DD"],
        ["Decision room opened.", "Today, 11:59 AM", "accent", "DR"],
        ["Packet blocker updated.", "Yesterday", "amber", "BL"],
      ];
  const contacts = isLp
    ? ["Northstar Venture Fund I", "Aurora Bio Systems Fund II", "Northline Climate Seed I"]
    : ["University Endowment", "Cedar Grove Family Office", "Blue Lake Foundation"];
  return (
    <aside
      className="marketplace-right-rail"
      style={{
        background: MP.sidebar,
        borderLeft: `1px solid ${MP.line}`,
        padding: "18px 18px 22px",
        display: "grid",
        alignContent: "start",
        gap: 24,
      }}
    >
      <MPActivitySection title="Notifications">
        {notifications.map(([title, time, tone, icon]) => (
          <MPActivityRow key={title} title={title} time={time} tone={tone} icon={icon} />
        ))}
      </MPActivitySection>
      <MPActivitySection title="Activity">
        {activities.map(([title, time, tone, icon]) => (
          <MPActivityRow key={title} title={title} time={time} tone={tone} icon={icon} />
        ))}
      </MPActivitySection>
      <MPActivitySection title={isLp ? "Active Reviews" : "Decision Rooms"}>
        {contacts.map((contact, index) => (
          <div
            key={contact}
            style={{
              display: "grid",
              gridTemplateColumns: "26px minmax(0, 1fr)",
              gap: 10,
              alignItems: "center",
              padding: "8px 0",
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: index === 0 ? MP.accentSoft : "rgba(237,234,248,.055)",
                border: `1px solid ${index === 0 ? "rgba(123,111,232,.20)" : MP.line}`,
                color: index === 0 ? MP.text : MP.soft,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 760,
              }}
            >
              {getInitials(contact)}
            </span>
            <span style={{ color: MP.text, fontSize: 12.6, fontWeight: 560, lineHeight: 1.25 }}>
              {contact}
            </span>
          </div>
        ))}
      </MPActivitySection>
    </aside>
  );
}

function MPNavButton({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        textAlign: "left",
        height: 32,
        padding: "0 8px 0 10px",
        borderRadius: MP.radius.xs,
        border: "none",
        borderLeft: `2px solid ${active ? MP.accent : "transparent"}`,
        background: active
          ? MP.accentSoft
          : hovered
          ? "rgba(255,255,255,.04)"
          : "transparent",
        color: active ? MP.text : hovered ? MP.soft : MP.muted,
        cursor: "pointer",
        fontWeight: active ? 600 : 500,
        fontSize: 12,
        transition: "all .12s ease",
        fontFamily: MP.type.body,
      }}
    >
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.label}
      </span>
      {item.badge != null && item.badge > 0 && (
        <span
          style={{
            flexShrink: 0,
            minWidth: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px",
            borderRadius: 999,
            background: active ? MP.accent : "rgba(255,255,255,.08)",
            color: active ? "#fff" : MP.soft,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: MP.type.mono,
          }}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

function MPDemoShell({
  user,
  roleLabel,
  account,
  page,
  setPage,
  nav,
  topStatus,
  activeStep,
  children,
  onLogout,
  onReset,
  contextLabel,
  statusMetric,
}) {
  const isLp = String(roleLabel || "").toLowerCase().includes("lp");
  const activeNav = nav.find((item) => item.id === page) || nav[0] || {};
  return (
    <div
      className="marketplace-demo-shell"
      style={{ color: MP.text, fontFamily: MP.type.body }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="marketplace-demo-sidebar"
        style={{
          background: MP.sidebar,
          borderRight: `1px solid ${MP.line}`,
          padding: "18px 10px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Logo + workspace identity */}
        <div style={{ padding: "0 2px 16px", borderBottom: `1px solid ${MP.line}`, marginBottom: 12 }}>
          <button
            type="button"
            onClick={onLogout}
            style={{
              border: "none",
              background: "transparent",
              color: MP.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              padding: "6px 5px",
              borderRadius: 8,
              marginBottom: 12,
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogoMark size={20} />
            <span style={{ fontWeight: 700, fontSize: 13, fontFamily: MP.type.display, letterSpacing: -0.1 }}>
              MandateOS
            </span>
          </button>
            <div style={{ padding: "8px 7px", borderRadius: MP.radius.sm, background: MP.panel, border: `1px solid ${MP.line}` }}>
            <div style={{ fontSize: 10.5, color: MP.muted, fontWeight: 600, marginBottom: 3 }}>
              {isLp ? "LP Workspace" : "GP Workspace"}
            </div>
            <div style={{ fontSize: 12, color: MP.text, fontWeight: 600, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {account}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {nav.map((item) => (
            <MPNavButton
              key={item.id}
              item={item}
              active={page === item.id}
              onClick={() => setPage(item.id)}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ borderTop: `1px solid ${MP.line}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <MPNavButton item={{ id: "_reset", label: "Reset" }} active={false} onClick={onReset} />
          <MPNavButton item={{ id: "_home", label: "← Back to site" }} active={false} onClick={onLogout} />
        </div>
      </aside>

      <main className="marketplace-center-shell">
        {/* ── Topbar ── */}
        <div
          style={{
            borderBottom: `1px solid ${MP.line}`,
            background: MP.panel,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "0 24px",
            height: 52,
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 560, fontSize: 13, color: MP.soft, letterSpacing: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {account}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isLp ? (
              <MPPill tone="accent">{statusMetric || "Privacy on"}</MPPill>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "18px minmax(0, 1fr)",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: MP.panel2,
                  border: `1px solid ${MP.line}`,
                  minWidth: 220,
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: 999, border: `1px solid ${MP.lineStrong}`, color: MP.muted, fontSize: 10, lineHeight: "14px", textAlign: "center" }}>/</span>
                <input aria-label="Search anything" placeholder="Search anything" readOnly style={{ width: "100%", minWidth: 0, border: "none", background: "transparent", color: MP.text, fontSize: 12, lineHeight: 1.2, padding: 0, boxShadow: "none" }} />
              </div>
            )}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                background: MP.panel2,
                border: `1px solid ${MP.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: MP.text,
                fontSize: 11,
                fontWeight: 760,
              }}
            >
              {getInitials(user.name || account)}
            </div>
          </div>
        </div>
        <div className="marketplace-center-scroll">
          <div style={{ padding: `${MP.space.pageY}px ${MP.space.pageX}px 56px`, width: "100%", boxSizing: "border-box" }}>{children}</div>
        </div>
        <MPWorkflowStepper activeStep={activeStep} />
      </main>
    </div>
  );
}

function MPDetailModal({ detail, onClose }) {
  if (!detail) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 12000,
        background: "rgba(8,11,17,.58)",
        backdropFilter: "blur(12px) saturate(1.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        className="marketplace-reveal-card"
        style={{
          width: "min(760px, 100%)",
          maxHeight: "82vh",
          overflow: "auto",
          background: `linear-gradient(180deg, ${MP.panel2}, ${MP.panel})`,
          border: `1px solid rgba(113,102,216,.24)`,
          borderRadius: 8,
          boxShadow: "0 28px 76px rgba(4,7,14,.5), 0 0 0 1px rgba(113,102,216,.04)",
          color: MP.text,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${MP.line}`,
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10.5,
                color: MP.green,
                fontWeight: 860,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {detail.kicker || "Detail"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 760, letterSpacing: 0 }}>
              {detail.title}
            </div>
            {detail.subtitle && (
              <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.55, marginTop: 6 }}>
                {detail.subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: `1px solid ${MP.line}`,
              background: MP.panel2,
              color: MP.soft,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div style={{ padding: 20, display: "grid", gap: 16 }}>
          {detail.body && (
            <div style={{ fontSize: 14, lineHeight: 1.7, color: MP.text }}>
              {detail.body}
            </div>
          )}
          {detail.chips?.length > 0 && (
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {detail.chips.map((chip) => (
                <MPPill key={chip} tone="blue">
                  {chip}
                </MPPill>
              ))}
            </div>
          )}
          {detail.rows?.length > 0 && (
            <MPCard style={{ padding: "6px 16px", background: MP.panel2 }}>
              {detail.rows.map(([label, value]) => (
                <MPDataRow key={label} label={label} value={value} />
              ))}
            </MPCard>
          )}
          {detail.sections?.map((section) => (
            <MPCard key={section.title} style={{ background: MP.panel2 }}>
              <MPSectionTitle title={section.title} kicker={section.kicker} />
              <div style={{ display: "grid", gap: 8 }}>
                {section.items.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 9, fontSize: 13, color: MP.soft, lineHeight: 1.55 }}>
                    <span style={{ color: section.tone === "warn" ? MP.amber : MP.green, fontWeight: 900 }}>
                      {section.tone === "warn" ? "!" : "+"}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </MPCard>
          ))}
          {detail.actions?.length > 0 && (
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${MP.line}`, paddingTop: 14 }}>
              {detail.actions.map((action) => (
                <MPButton
                  key={action.label}
                  variant={action.variant || "primary"}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </MPButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MPMatchCard({
  match,
  request,
  onRequest,
  onOpenRoom,
  onInspect,
  compact = false,
}) {
  const blocked = !match.requestable;
  const statusTone =
    request?.status === "Approved"
      ? "green"
      : request?.status === "Declined"
      ? "red"
      : request?.status === "More Info Requested"
      ? "amber"
      : request?.status === "Pending"
      ? "blue"
      : "neutral";
  const recommendedNextStep =
    match.id === MARKETPLACE_PRIMARY_MATCH_ID
      ? "Upload references + downside case before submitting"
      : match.nextActions?.[0] || "Request only after the fund packet is LP-review ready.";
  return (
    <MPCard elevated={!compact} style={{ padding: compact ? 14 : 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 7 }}>
            <MPPill tone="neutral">{match.lpType}</MPPill>
            <MPPill tone="neutral">{match.aumBand} AUM</MPPill>
            <MPPill tone="blue">{match.checkRange} check</MPPill>
            {request && <MPPill tone={statusTone}>{request.status}</MPPill>}
          </div>
          <div style={{ fontSize: compact ? 15 : 18, fontWeight: 850, letterSpacing: 0 }}>
            {request?.status === "Approved" ? match.lpName : match.lpAlias}
          </div>
          <div style={{ color: MP.soft, fontSize: 12.5, marginTop: 4 }}>
            {match.mandate} · {match.geography}
          </div>
        </div>
        <div
          className="marketplace-mono"
          style={{
            width: 52,
            height: 52,
            borderRadius: 8,
            background: match.score >= 85 ? "rgba(98,201,146,.08)" : MP.accentSoft,
            border: `1px solid ${match.score >= 85 ? "rgba(98,201,146,.18)" : "rgba(123,111,232,.16)"}`,
            color: match.score >= 85 ? MP.green : MP.text,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 760,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>{match.score}</span>
          <span style={{ fontSize: 8.5, lineHeight: 1.2 }}>fit</span>
        </div>
      </div>

      {!compact && (
        <>
          <div className="marketplace-grid-2" style={{ marginTop: 14 }}>
            <div
              style={{
                padding: 13,
                borderRadius: 8,
                background: "rgba(52,211,153,.08)",
                border: "1px solid rgba(52,211,153,.22)",
              }}
            >
              <div style={{ fontSize: 11, color: MP.green, fontWeight: 860, textTransform: "uppercase", marginBottom: 8 }}>
                Why this fits
              </div>
              <div style={{ display: "grid", gap: 7 }}>
                {match.why.slice(0, 3).map((reason) => (
                  <div key={reason} style={{ display: "flex", gap: 8, fontSize: 12.5, color: MP.text, lineHeight: 1.45 }}>
                    <span style={{ color: MP.green, fontWeight: 900 }}>+</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 13,
                borderRadius: 8,
                background: "rgba(216,164,74,.08)",
                border: "1px solid rgba(216,164,74,.24)",
              }}
            >
              <div style={{ fontSize: 11, color: MP.amber, fontWeight: 860, textTransform: "uppercase", marginBottom: 8 }}>
                What could block approval
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {match.blockers.map((blocker) => (
                  <div key={blocker} style={{ display: "flex", gap: 8, fontSize: 12.2, color: MP.soft, lineHeight: 1.45 }}>
                    <span style={{ color: MP.amber, fontWeight: 800 }}>!</span>
                    <span>{blocker}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gap: 10,
              marginTop: 12,
            }}
          >
            <div
              style={{
                padding: "10px 11px",
                borderRadius: 8,
                background: MP.panel2,
                border: `1px solid ${MP.line}`,
              }}
            >
              <div style={{ fontSize: 10.5, color: MP.muted, fontWeight: 840, textTransform: "uppercase", marginBottom: 4 }}>
                LP sees today
              </div>
              <div style={{ fontSize: 12.3, color: MP.text, lineHeight: 1.45 }}>
                {match.lpSeesToday || "Standardized profile, pitch deck, DDQ, attribution summary"}
              </div>
            </div>
            <div
              style={{
                padding: "10px 11px",
                borderRadius: 8,
                background: MP.panel2,
                border: `1px solid ${MP.line}`,
              }}
            >
              <div style={{ fontSize: 10.5, color: MP.muted, fontWeight: 840, textTransform: "uppercase", marginBottom: 4 }}>
                To unlock reveal
              </div>
              <div style={{ fontSize: 12.3, color: MP.text, lineHeight: 1.45 }}>
                {match.revealUnlocksIf || "References completed and downside case uploaded"}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "11px 12px",
              border: `1px solid ${MP.line}`,
              borderRadius: 8,
              background: MP.panel2,
            }}
          >
            <div style={{ fontSize: 11, color: MP.green, fontWeight: 820, textTransform: "uppercase", marginBottom: 7 }}>
              Recommended next step
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 12.2, color: MP.text, lineHeight: 1.45 }}>
              <span style={{ color: MP.green, fontWeight: 900 }}>→</span>
              <span>{recommendedNextStep}</span>
            </div>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 15, flexWrap: "wrap" }}>
        {onInspect && (
          <MPButton variant="secondary" onClick={onInspect}>
            View LP Fit
          </MPButton>
        )}
        {request?.status === "Approved" ? (
          <MPButton onClick={onOpenRoom}>Open Room</MPButton>
        ) : request ? (
          <MPButton variant="secondary" disabled>
            {request.status === "Pending" ? "Submitted" : request.status}
          </MPButton>
        ) : (
          <MPButton onClick={onRequest} disabled={blocked}>
            {blocked ? "Not requestable" : "Submit Request"}
          </MPButton>
        )}
      </div>
    </MPCard>
  );
}

function MPRevealMoment({ request }) {
  if (!request) return null;
  return (
    <div
      className="marketplace-reveal-card"
      style={{
        marginBottom: 18,
        padding: 22,
        borderRadius: 8,
        background: MP.panel,
        border: "1px solid rgba(52,211,153,.28)",
        boxShadow: "0 22px 42px rgba(0,0,0,.24)",
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr)",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div
        className="marketplace-unlock"
        style={{
          width: 54,
          height: 54,
          borderRadius: 8,
          background: MP.green,
          color: MP.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 900,
        }}
      >
        U
      </div>
      <div>
        <div style={{ fontSize: 11, color: MP.green, fontWeight: 880, textTransform: "uppercase", marginBottom: 5 }}>
          Match approved
        </div>
        <div style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 760, letterSpacing: 0 }}>
          {request.gpName} is connected with {demoLpProfile.revealedName}.
        </div>
        <div style={{ color: MP.soft, fontSize: 13, marginTop: 7 }}>
          Identity is visible inside this room only.
        </div>
      </div>
    </div>
  );
}

function MarketplaceWorkflowRoom({
  state,
  updateState,
  role,
  matchId,
  onBack,
  freshRevealRequest,
}) {
  const rooms = Object.values(state.workflowRooms || {});
  const [messageDraft, setMessageDraft] = useState("");
  const [qaDraft, setQaDraft] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [schedulePickerOpen, setSchedulePickerOpen] = useState(false);
  const gpRooms = role === "gp"
    ? rooms.filter((r) => r.gpName === state.fundProfile?.fundName && r.pipelineStage !== "Soft circle")
    : [];
  const lpRooms = role === "lp"
    ? rooms.filter((r) => r.lpName === state.lpProfile?.revealedName)
    : [];
  const roomChoices = role === "gp" ? gpRooms : lpRooms;
  const defaultRoomId = matchId && roomChoices.find((r) => r.matchId === matchId)
    ? roomChoices.find((r) => r.matchId === matchId).id
    : role === "gp"
    ? (rooms.find((r) => r.gpName === state.fundProfile?.fundName) || {}).id
    : (lpRooms[0] || {}).id;
  const [selectedRoomId, setSelectedRoomId] = useState(defaultRoomId);
  const room =
    (selectedRoomId && rooms.find((r) => r.id === selectedRoomId))
      ? rooms.find((r) => r.id === selectedRoomId)
      : matchId && rooms.find((entry) => entry.matchId === matchId)
      ? rooms.find((entry) => entry.matchId === matchId)
      : role === "gp"
      ? rooms.find((entry) => entry.gpName === state.fundProfile.fundName) || null
      : rooms.find((entry) => entry.lpName === state.lpProfile.revealedName);
  if (!room) {
    return (
      <div>
        <MPPageHeader
          eyebrow="Decision room"
          title="No approved room yet"
          right={<MPButton onClick={onBack}>Back</MPButton>}
        />
        <MPCard>
          <div style={{ fontSize: 15, fontWeight: 780, marginBottom: 6 }}>
            Approval required
          </div>
          <div style={{ color: MP.soft, fontSize: 13 }}>
            Request a match from the GP side or approve one from the LP side to open
            a shared decision room.
          </div>
        </MPCard>
      </div>
    );
  }

  const updateRoom = (updater) => {
    updateState((prev) => {
      const current = prev.workflowRooms[room.id] || room;
      const nextRoom = typeof updater === "function" ? updater(current) : updater;
      return {
        ...prev,
        workflowRooms: {
          ...prev.workflowRooms,
          [room.id]: nextRoom,
        },
      };
    });
  };

  const addRoomEvent = (label) => {
    updateRoom((current) => ({
      ...current,
      events: [label, ...(current.events || [])].slice(0, 8),
    }));
  };

  const sendMessage = () => {
    const body = messageDraft.trim();
    if (!body) return;
    updateRoom((current) => ({
      ...current,
      messages: [
        ...(current.messages || []),
        {
          id: `msg-${Date.now()}`,
          from: role === "gp" ? current.gpName : current.lpName,
          body,
          time: "Just now",
        },
      ],
    }));
    setMessageDraft("");
    addRoomEvent(`${role === "gp" ? "GP" : "LP"} posted a workflow update`);
    showToast("Message added to workflow room", "success");
  };

  const addQuestion = () => {
    const question = qaDraft.trim();
    if (!question) return;
    updateRoom((current) => ({
      ...current,
      qas: [
        ...(current.qas || []),
        { id: `qa-${Date.now()}`, question, status: "Open" },
      ],
    }));
    setQaDraft("");
    addRoomEvent("Structured Q&A item added");
    showToast("Q&A item added", "success");
  };

  const scheduleOptions = [
    "Tuesday, Apr 14 at 11:00 AM PT",
    "Wednesday, Apr 15 at 9:00 AM PT",
    "Thursday, Apr 16 at 10:30 AM PT",
    "Friday, Apr 18 at 2:00 PM PT",
  ];

  const scheduleMeeting = (slot = scheduleOptions[2]) => {
    updateRoom((current) => ({
      ...current,
      meeting: slot,
      pipelineStage: "Meeting scheduled",
      events: [`Schedule requested for ${slot}`, ...(current.events || [])],
    }));
    setSchedulePickerOpen(false);
    showToast("Meeting scheduled inside the workflow", "success");
  };

  const toggleTask = (id) => {
    updateRoom((current) => ({
      ...current,
      tasks: (current.tasks || []).map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }));
  };

  const toggleDocRequest = (id) => {
    updateRoom((current) => ({
      ...current,
      docRequests: (current.docRequests || []).map((doc) =>
        doc.id === id ? { ...doc, done: !doc.done } : doc
      ),
    }));
  };

  const advanceStage = () => {
    const stages = ["Decision room open", "Meeting scheduled", "Diligence active", "IC review", "Soft circle"];
    const currentIndex = stages.indexOf(room.pipelineStage);
    const nextStage = stages[(currentIndex + 1 + stages.length) % stages.length];
    updateRoom((current) => ({
      ...current,
      pipelineStage: nextStage,
      events: [`Pipeline stage moved to ${nextStage}`, ...(current.events || [])],
    }));
    showToast(`Pipeline moved to ${nextStage}`, "success");
  };

  const visibleDocs =
    room.gpName === demoFundProfile.fundName
      ? [...state.documents.required, ...state.documents.optional].filter((doc) => doc.visible)
      : [
          { name: "Pitch Deck", status: "Ready", note: "LP-visible" },
          { name: "Terms Summary", status: "Ready", note: "LP-visible" },
          { name: "Track Record", status: "Ready", note: "LP-visible" },
          { name: "DDQ", status: "Partial", note: "LP requested update" },
        ];

  const lpContacts = room.lpName === "Cedar Grove Family Office"
    ? [{ name: "Sarah Chen", title: "CIO", email: "s.chen@cedargrove.io" }, { name: "Mark Torres", title: "Analyst", email: "m.torres@cedargrove.io" }]
    : room.lpName === "Atlantic Capital Partners"
    ? [{ name: "David Park", title: "Head of Private Markets", email: "d.park@atlanticcap.com" }, { name: "Lisa Wu", title: "Portfolio Manager", email: "l.wu@atlanticcap.com" }]
    : [{ name: "Investment Team", title: "Portfolio Management", email: "investments@lp.com" }];
  const counterpartyName = role === "lp" ? room.gpName : room.lpName;
  const counterpartyMeta =
    role === "lp"
      ? `${room.stage || "Diligence"} · GP packet`
      : room.lpAlias;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "packet", label: "GP Packet" },
    { id: "messages", label: "Messages" },
    { id: "lpprofile", label: "LP Profile" },
    { id: "schedule", label: "Schedule" },
  ];
  const openAskCount = (room.docRequests || []).filter((doc) => !doc.done).length;

  return (
    <div>
      {freshRevealRequest && <MPRevealMoment request={freshRevealRequest} />}

      <MPCard style={{ padding: 0, overflow: "hidden", minHeight: 660 }}>
        <div style={{ padding: "24px 28px 0", background: MP.panel }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 650, letterSpacing: 0, color: MP.text }}>
                  Decision Room
                </div>
                <MPPill tone={room.pipelineStage === "IC review" ? "accent" : room.pipelineStage === "Soft circle" ? "green" : "blue"}>
                  {room.pipelineStage}
                </MPPill>
              </div>
              <select
                value={room.id}
                onChange={(event) => {
                  setSelectedRoomId(event.target.value);
                  setActiveTab("overview");
                }}
                style={{
                  width: "min(520px, 100%)",
                  height: 38,
                  borderRadius: 999,
                  border: `1px solid ${MP.lineStrong}`,
                  background: MP.panel2,
                  color: MP.text,
                  padding: "0 14px",
                  fontSize: 13.5,
                  fontWeight: 560,
                  outline: "none",
                }}
              >
                {roomChoices.map((r) => (
                  <option key={r.id} value={r.id}>
                    {role === "lp" ? r.gpName : r.lpName} - {r.pipelineStage}
                  </option>
                ))}
              </select>
              <div style={{ color: MP.soft, fontSize: 12.5, lineHeight: 1.45, marginTop: 9 }}>
                {counterpartyMeta} · {openAskCount} open ask{openAskCount === 1 ? "" : "s"} · {visibleDocs.length} visible materials
              </div>
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <MPButton size="sm" variant="secondary" onClick={onBack}>Back</MPButton>
              <MPButton size="sm" onClick={advanceStage}>Advance Stage</MPButton>
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, borderBottom: `1px solid ${MP.line}`, marginTop: 30, overflowX: "auto" }}>
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    border: "none",
                    borderBottom: `2px solid ${active ? MP.accent2 : "transparent"}`,
                    background: "transparent",
                    color: active ? MP.text : MP.soft,
                    padding: "0 2px 13px",
                    fontSize: 14,
                    fontWeight: active ? 640 : 520,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding: "18px 22px" }}>
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(260px,.65fr)", gap: 14, alignItems: "stretch" }}>
              <MPCard style={{ background: MP.panel2, padding: 0, overflow: "hidden", minHeight: 500 }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${MP.line}`, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 14, alignItems: "center" }}>
                  <div>
                    <div style={{ ...MP_TYPE.label, color: MP.accent }}>Current stage</div>
                    <div style={{ color: MP.text, fontSize: 22, fontWeight: 760, lineHeight: 1.05, marginTop: 6 }}>{room.pipelineStage}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="marketplace-mono" style={{ color: MP.green, fontSize: 24, fontWeight: 760, lineHeight: 1 }}>76%</div>
                    <div style={{ ...MP_TYPE.label, marginTop: 5 }}>Advance probability</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(250px,.62fr)", gap: 0, minHeight: 360 }}>
                  <div style={{ padding: 16, borderRight: `1px solid ${MP.line}`, display: "flex", flexDirection: "column" }}>
                    <MPSectionTitle title="Shared Process Trail" kicker="What is known" />
                    <MPTableHeader columns={["#", "Event", "Time", "Actor", "Status"]} template="28px minmax(0,1fr) 72px 76px 70px" style={{ paddingBottom: 6 }} />
                    {(room.events || []).slice(0, 6).map((event, i) => (
                      <div key={`${event}-${i}`} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) 72px 76px 70px", gap: 12, alignItems: "center", padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
                        <span className="marketplace-mono" style={{ color: i < 2 ? MP.green : MP.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ color: MP.text, fontSize: 12.5, fontWeight: 560, lineHeight: 1.32 }}>{event}</span>
                        <span style={MP_TYPE.rowMeta}>{i === 0 ? "Today" : i === 1 ? "1h ago" : i === 2 ? "Yesterday" : "2d ago"}</span>
                        <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{i % 2 === 0 ? (role === "gp" ? "LP" : "GP") : "System"}</span>
                        <MPPill tone={i < 2 ? "green" : "neutral"}>{i < 2 ? "Done" : "Logged"}</MPPill>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 16, display: "flex", flexDirection: "column" }}>
                    <MPSectionTitle title="Active Asks" kicker="Blocking movement" />
                    {(room.docRequests || []).map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => toggleDocRequest(doc.id)}
                        style={{ width: "100%", display: "grid", gridTemplateColumns: "18px minmax(0,1fr) 68px", gap: 10, alignItems: "start", border: "none", borderTop: `1px solid ${MP.line}`, background: "transparent", color: MP.text, padding: "13px 0", cursor: "pointer", textAlign: "left" }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: `1px solid ${doc.done ? "rgba(98,201,146,.55)" : MP.lineStrong}`,
                            background: doc.done ? "rgba(98,201,146,.16)" : "transparent",
                            color: doc.done ? MP.green : MP.muted,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        >
                          {doc.done ? "✓" : ""}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 12.8, fontWeight: 560, lineHeight: 1.25 }}>{doc.label}</span>
                          <span style={{ display: "block", ...MP_TYPE.rowMeta, marginTop: 4 }}>
                            {role === "gp" ? state.gpProfile.firmName : room.gpName} · {doc.done ? "Filed" : "Due today"} · {doc.label.includes("reference") ? "Reference index" : doc.label.includes("case") ? "Portfolio model" : "Data room"}
                          </span>
                        </span>
                        <MPPill tone={doc.done ? "green" : "amber"}>{doc.done ? "Filed" : "Open"}</MPPill>
                      </button>
                    ))}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
                      <MPDataRow label="Meeting" value={room.meeting} />
                      <MPDataRow label="Memo status" value={room.pipelineStage === "IC review" ? "IC memo submitted" : "Drafting from room evidence"} />
                      <MPDataRow label="Room risk" value={room.decisionRisk || "References and downside case"} />
                    </div>
                  </div>
                </div>
              </MPCard>

              <div style={{ display: "grid", gap: 12 }}>
                <MPDeskPanel title="Fit Logic" kicker="Mandate reasoning">
                  {[
                    ["Strategy fit", "Early-stage venture mandate", "green"],
                    ["Allocator appetite", "Emerging managers active", "green"],
                    ["Check size", "$500K-$5M path", "green"],
                    ["Primary risk", room.decisionRisk || "References and downside case", "amber"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ padding: "11px 0", borderTop: `1px solid ${MP.line}` }}>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", ...MP_TYPE.label }}>{label}</span>
                        <span style={{ display: "block", color: MP.text, fontSize: 12.4, fontWeight: 500, lineHeight: 1.35, marginTop: 3 }}>{value}</span>
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
                    <MPDataRow label="Probability" value="76%" mono />
                    <MPDataRow label="Next stage" value={room.nextMilestone || "Move to next decision"} />
                  </div>
                </MPDeskPanel>
                <MPDeskPanel title="Next Best Move" kicker="Platform recommendation">
                  <div style={{ color: MP.text, fontSize: 15, fontWeight: 760, lineHeight: 1.28 }}>
                    {room.nextMilestone || "Move diligence to the next allocator decision point."}
                  </div>
                  <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.4, marginTop: 9 }}>
                    Close every open evidence request in this room before pushing the next meeting or IC step.
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12 }}>
                  <MPButton size="sm" onClick={() => setActiveTab("packet")} style={{ width: "100%" }}>
                    Review Evidence
                  </MPButton>
                  </div>
                </MPDeskPanel>
              </div>
            </div>
          )}

          {activeTab === "packet" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                <MPCard style={{ background: MP.panel2, minHeight: 300 }}>
                  <MPSectionTitle title="Fund Documents" kicker="GP packet" />
                  {visibleDocs.map((doc) => (
                    <MPDocRow key={doc.id || doc.name} doc={doc} compact />
                  ))}
                </MPCard>
                <MPCard style={{ background: MP.panel2, minHeight: 300 }}>
                  <MPSectionTitle title="Diligence Requests" kicker="Outstanding items" />
                  {(room.docRequests || []).map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => toggleDocRequest(doc.id)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "13px 0", border: "none", borderTop: `1px solid ${MP.line}`, background: "transparent", color: doc.done ? MP.soft : MP.text, cursor: "pointer", textAlign: "left", fontSize: 12.5 }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          border: `1px solid ${doc.done ? "rgba(98,201,146,.55)" : MP.lineStrong}`,
                          background: doc.done ? "rgba(98,201,146,.16)" : "transparent",
                          color: doc.done ? MP.green : MP.muted,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {doc.done ? "✓" : ""}
                      </span>
                      <span>{doc.label}</span>
                      {doc.done && <span style={{ marginLeft: "auto", fontSize: 10, color: MP.green, fontWeight: 800 }}>Done</span>}
                    </button>
                  ))}
                  {(room.qas || []).length > 0 && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
                      <div style={{ ...MP_TYPE.label, marginBottom: 8 }}>Open Q&A</div>
                      {(room.qas || []).filter(q => q.status !== "Answered").map((qa) => (
                        <div key={qa.id} style={{ padding: "12px 0", borderTop: `1px solid ${MP.line}`, fontSize: 12.2, color: MP.soft, lineHeight: 1.45 }}>{qa.question}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 12.2, lineHeight: 1.5 }}>
                    Outstanding diligence should be answered with source documents, not free-form notes, so both sides keep the same evidence record.
                  </div>
                </MPCard>
              </div>
              <MPCard style={{ background: MP.panel2 }}>
                <MPSectionTitle title="Key Fund Facts" kicker="From GP profile" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                  {[["Strategy","Early-Stage Venture Capital"],["Target","$700M"],["Raised","$410M"],["Geography","Global / U.S.-led"],["TVPI","3.1x"],["Gross IRR","39%"]].map(([l,v])=>(
                    <div key={l} style={{ padding: "10px 12px", background: MP.panel, border: `1px solid ${MP.line}`, borderRadius: MP.radius.sm }}>
                      <div style={MP_TYPE.label}>{l}</div>
                      <div className="marketplace-mono" style={{ ...MP_TYPE.number, marginTop: 5 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </MPCard>
            </div>
          )}

          {activeTab === "messages" && (
            (() => {
              const messageRows = [
                ...(room.messages || []).map((message, index) => ({
                  id: message.id,
                  time: message.time,
                  from: message.from,
                  type: index === 0 ? "Room note" : "Evidence update",
                  body: message.body,
                  visibility: "Room-only",
                  attachments: index === 0 ? "0" : "2",
                })),
                {
                  id: "memo-status",
                  time: "Today",
                  from: "System",
                  type: "Memo event",
                  body: room.pipelineStage === "IC review" ? "IC memo submitted from room evidence." : "Shared memo draft updated from open evidence.",
                  visibility: "Internal + room",
                  attachments: String(visibleDocs.length),
                },
                {
                  id: "qa-status",
                  time: "Yesterday",
                  from: role === "gp" ? room.lpName : room.gpName,
                  type: "Q&A",
                  body: `${(room.qas || []).filter((qa) => qa.status !== "Answered").length} open diligence question remains unresolved.`,
                  visibility: "Room-only",
                  attachments: "1",
                },
              ];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 18, alignItems: "stretch" }}>
                  <MPCard style={{ background: MP.panel2, padding: 0, overflow: "hidden", minHeight: 560, display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${MP.line}`, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div>
                        <div style={{ ...MP_TYPE.label, color: MP.accent }}>Room messages</div>
                        <div style={{ ...MP_TYPE.rowTitle, marginTop: 5 }}>{room.gpName} / {room.lpName}</div>
                      </div>
                      <MPPill tone="green">Audited private channel</MPPill>
                    </div>
                    <div style={{ padding: "10px 18px 16px", flex: 1, minHeight: 0, overflow: "auto" }}>
                      {messageRows.map((message) => (
                        <div key={message.id} style={{ display: "grid", gridTemplateColumns: "88px minmax(0,1fr)", gap: 14, padding: "14px 0", borderTop: `1px solid ${MP.line}` }}>
                          <div>
                            <div className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{message.time}</div>
                            <div style={{ ...MP_TYPE.label, marginTop: 6 }}>{message.type}</div>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: MP.text, fontSize: 13.2, fontWeight: 620, lineHeight: 1.25, marginBottom: 5 }}>{message.from}</div>
                            <div style={{ color: MP.soft, fontSize: 12.6, lineHeight: 1.48 }}>{message.body}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 9 }}>
                              <MPPill tone="neutral">{message.visibility}</MPPill>
                              <MPPill tone={Number(message.attachments) > 0 ? "accent" : "neutral"}>{message.attachments} files</MPPill>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: 16, borderTop: `1px solid ${MP.line}`, background: MP.panel }}>
                      <textarea
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        placeholder="Add a diligence update, meeting note, or answer..."
                        style={{
                          width: "100%",
                          minHeight: 74,
                          resize: "vertical",
                          borderRadius: 8,
                          border: `1px solid ${MP.line}`,
                          background: MP.panel2,
                          color: MP.text,
                          padding: 12,
                          fontSize: 13,
                          lineHeight: 1.45,
                          marginBottom: 10,
                          boxSizing: "border-box",
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <span style={{ color: MP.muted, fontSize: 11.5 }}>Messages become room events and stay attached to the diligence trail.</span>
                        <MPButton onClick={sendMessage}>Send Update</MPButton>
                      </div>
                    </div>
                  </MPCard>
                  <div style={{ display: "grid", gap: 12 }}>
                    <MPDeskPanel title="Message Context" kicker="What needs reply">
                      {(room.docRequests || []).filter((doc) => !doc.done).slice(0, 4).map((doc) => (
                        <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 54px", gap: 8, padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", color: MP.text, fontSize: 12.5, lineHeight: 1.35 }}>{doc.label}</span>
                            <span style={{ display: "block", ...MP_TYPE.rowMeta, marginTop: 4 }}>Attach source file before next stage</span>
                          </span>
                          <MPPill tone="amber">Open</MPPill>
                        </div>
                      ))}
                      <div style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
                        <MPDataRow label="Q&A open" value={String((room.qas || []).filter((qa) => qa.status !== "Answered").length)} />
                        <MPDataRow label="Unread" value="3 room updates" />
                        <MPDataRow label="Last viewed" value={role === "gp" ? "LP 18m ago" : "GP yesterday"} />
                      </div>
                    </MPDeskPanel>
                    <MPDeskPanel title="Recent Events" kicker="Audit trail">
                      {(room.events || []).slice(0, 5).map((event, i) => (
                        <div key={`${event}-${i}`} style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr)", gap: 8, padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
                          <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 10 }}>{i + 1}</span>
                          <span style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.35 }}>{event}</span>
                        </div>
                      ))}
                    </MPDeskPanel>
                  </div>
                </div>
              );
            })()
          )}

          {activeTab === "lpprofile" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 16 }}>
              <div style={{ display: "grid", gap: 16 }}>
                <MPCard style={{ background: MP.panel2, minHeight: 240 }}>
                  <MPSectionTitle title="LP Contacts" kicker="Key decision-makers" />
                  {lpContacts.map((contact) => (
                    <div key={contact.email} style={{ padding: "17px 0", borderTop: `1px solid ${MP.line}` }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: MP.text }}>{contact.name}</div>
                      <div style={{ fontSize: 12, color: MP.soft, marginTop: 2 }}>{contact.title}</div>
                      <div style={{ fontSize: 11.5, color: MP.muted, marginTop: 2 }}>{contact.email}</div>
                    </div>
                  ))}
                </MPCard>
                <MPCard style={{ background: MP.panel2, minHeight: 240 }}>
                  <MPSectionTitle title="Fit Breakdown" kicker="Why this LP matches" />
                  <MPDataRow label="LP type" value={room.lpAlias} />
                  <MPDataRow label="Pipeline stage" value={room.pipelineStage} />
                  <MPDataRow label="Next milestone" value={room.nextMilestone} />
                </MPCard>
              </div>
              <MPCard style={{ background: MP.panel2, minHeight: 500 }}>
                <MPSectionTitle title="Open Gaps" kicker="What LP is missing" />
                {(room.docRequests || []).filter((d) => !d.done).length === 0 ? (
                  <div style={{ color: MP.green, fontSize: 13, paddingTop: 10 }}>No open gaps — all documents fulfilled.</div>
                ) : (
                  (room.docRequests || []).filter((d) => !d.done).map((doc) => (
                    <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", borderTop: `1px solid ${MP.line}` }}>
                      <span style={{ fontSize: 13, color: MP.text }}>{doc.label}</span>
                      <MPPill tone="amber">Missing</MPPill>
                    </div>
                  ))
                )}
                <div style={{ marginTop: 12 }}>
                  <MPSectionTitle title="Allocator Q&A" kicker="Diligence requests" />
                  {(room.qas || []).map((qa) => (
                    <div
                      key={qa.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "15px 0",
                        borderTop: `1px solid ${MP.line}`,
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ color: MP.text }}>{qa.question}</span>
                      <MPPill tone={qa.status === "Answered" ? "green" : "amber"}>
                        {qa.status}
                      </MPPill>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <input
                      value={qaDraft}
                      onChange={(event) => setQaDraft(event.target.value)}
                      placeholder="Ask for attribution, references, terms..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        borderRadius: 8,
                        border: `1px solid ${MP.line}`,
                        background: MP.panel2,
                        padding: "9px 11px",
                        fontSize: 13,
                        color: MP.text,
                      }}
                    />
                    <MPButton onClick={addQuestion}>Add</MPButton>
                  </div>
                </div>
              </MPCard>
            </div>
          )}

          {activeTab === "schedule" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
              <MPCard style={{ background: MP.panel2, minHeight: 430, display: "flex", flexDirection: "column" }}>
                <MPSectionTitle
                  title="Meeting"
                  kicker="Scheduling"
                  action={<MPButton size="sm" onClick={() => setSchedulePickerOpen((open) => !open)}>Request Schedule</MPButton>}
                />
                <div style={{ fontSize: 14, fontWeight: 720, lineHeight: 1.4, marginBottom: 6, marginTop: 8, color: MP.text }}>
                  {room.meeting || "No meeting scheduled"}
                </div>
                <div style={{ color: MP.soft, fontSize: 12.5, lineHeight: 1.5, marginBottom: 10 }}>
                  Meetings are recorded as workflow events, not email side channels.
                </div>
                <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
                  <MPDataRow label="Current stage" value={room.pipelineStage} />
                  <MPDataRow label="Meeting owner" value={role === "gp" ? room.lpName : room.gpName} />
                  <MPDataRow label="Prep item" value={room.nextMilestone || "Confirm diligence agenda"} />
                  <MPDataRow label="Evidence due" value={(room.docRequests || []).filter((doc) => !doc.done)[0]?.label || "No open evidence"} />
                  <MPDataRow label="Agenda" value="Review fit, open asks, and next IC step" />
                </div>
                {schedulePickerOpen && (
                  <div style={{ marginTop: 14, padding: 10, borderRadius: MP.radius.sm, border: `1px solid ${MP.lineStrong}`, background: MP.panel }}>
                    <div style={{ ...MP_TYPE.label, marginBottom: 8 }}>Available windows</div>
                    {scheduleOptions.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => scheduleMeeting(slot)}
                        style={{
                          width: "100%",
                          border: "none",
                          borderTop: `1px solid ${MP.line}`,
                          background: "transparent",
                          color: MP.text,
                          padding: "9px 0",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: 12.5,
                          fontWeight: 620,
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </MPCard>

              <MPCard style={{ background: MP.panel2, minHeight: 430 }}>
                <MPSectionTitle
                  title={role === "gp" ? "Attribution File" : "GP Materials"}
                  kicker="Data room"
                />
                {visibleDocs.slice(0, 7).map((doc) => (
                  <MPDocRow key={doc.id || doc.name} doc={doc} compact />
                ))}
                <div style={{ marginTop: "auto", paddingTop: 12, color: MP.soft, fontSize: 12.2, lineHeight: 1.5 }}>
                  Materials shown here are the current allocator-visible packet for the room.
                </div>
              </MPCard>

              <MPCard style={{ background: MP.panel2, minHeight: 430 }}>
                <MPSectionTitle
                  title={role === "gp" ? "Diligence Checklist" : "Review Tasks"}
                  kicker="Workflow"
                />
                {(room.tasks || []).map((task) => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "16px minmax(0,1fr)",
                      gap: 9,
                      padding: "15px 0",
                      border: "none",
                      borderTop: `1px solid ${MP.line}`,
                      background: "transparent",
                      color: task.done ? MP.soft : MP.text,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 12.5,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `1px solid ${task.done ? "rgba(98,201,146,.45)" : MP.lineStrong}`,
                        background: task.done ? MP.green : "transparent",
                      flexShrink: 0,
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", color: MP.text, fontSize: 12.6, fontWeight: 560 }}>{task.label}</span>
                      <span style={{ display: "block", color: MP.soft, fontSize: 11.4, lineHeight: 1.4, marginTop: 3 }}>
                        {task.done ? "Completed in room trail" : "Open before next allocator step"}
                      </span>
                    </span>
                  </button>
                ))}
                <div style={{ marginTop: "auto", paddingTop: 12, color: MP.soft, fontSize: 12.2, lineHeight: 1.5 }}>
                  The checklist keeps meeting prep, diligence follow-up, and room evidence in one auditable trail.
                </div>
              </MPCard>
            </div>
          )}
        </div>
      </MPCard>
    </div>
  );
}

function GPContextCTA({ state, page, setPage, gpRequests, approvedRequest, activeRoom }) {
  const readyToRequest = marketplaceRequiredReady(state);
  const hasApproved = !!approvedRequest;
  const openQAs = Object.values(state.workflowRooms || {})
    .flatMap(r => (r.qas || []).filter(q => q.status === "Open"));
  const icRoom = Object.values(state.workflowRooms || {})
    .find(r => r.pipelineStage === "IC review");
  const openDocRequests = Object.values(state.workflowRooms || {})
    .flatMap(r => (r.docRequests || []).filter(d => !d.done));

  let cta = null;
  if (openQAs.length > 0) {
    cta = { label: "Respond to Diligence Question", sub: `${openQAs.length} open allocator question${openQAs.length > 1 ? "s" : ""}`, action: () => setPage("room"), tone: "accent" };
  } else if (openDocRequests.length > 0) {
    cta = { label: "Upload Reference Pack", sub: `${openDocRequests.length} document${openDocRequests.length > 1 ? "s" : ""} requested by allocator`, action: () => setPage("documents"), tone: "amber" };
  } else if (hasApproved && activeRoom) {
    cta = { label: "Open Diligence Room", sub: "LP identity revealed — room is active", action: () => setPage("room"), tone: "green" };
  } else if (gpRequests.some(r => r.status === "Pending")) {
    cta = { label: "Complete LP Request", sub: "Reveal request pending allocator review", action: () => setPage("requests"), tone: "blue" };
  } else if (readyToRequest && state.matches.some(m => m.requestable)) {
    cta = { label: "Request LP Intro", sub: "Packet complete — you can now submit a reveal request", action: () => setPage("matches"), tone: "green" };
  } else {
    cta = { label: "Complete LP Packet", sub: "Finish your packet to unlock reveal requests", action: () => setPage("documents"), tone: "amber" };
  }

  const toneColors = {
    accent: { bg: "rgba(123,111,232,.10)", border: "rgba(123,111,232,.28)", color: MP.accent, dot: MP.accent },
    green: { bg: "rgba(98,201,146,.08)", border: "rgba(98,201,146,.25)", color: MP.green, dot: MP.green },
    amber: { bg: "rgba(245,166,35,.07)", border: "rgba(245,166,35,.22)", color: MP.amber, dot: MP.amber },
    blue: { bg: "rgba(96,165,250,.08)", border: "rgba(96,165,250,.22)", color: "#60a5fa", dot: "#60a5fa" },
  };
  const tc = toneColors[cta.tone] || toneColors.accent;

  return (
    <button
      type="button"
      onClick={cta.action}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        padding: "14px 20px",
        borderRadius: MP.radius.md,
        border: `1px solid ${tc.border}`,
        background: tc.bg,
        cursor: "pointer",
        textAlign: "left",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: tc.dot, flexShrink: 0, boxShadow: `0 0 6px ${tc.dot}` }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 760, color: tc.color, lineHeight: 1.2 }}>{cta.label}</div>
          <div style={{ fontSize: 12, color: MP.soft, marginTop: 3, lineHeight: 1.3 }}>{cta.sub}</div>
        </div>
      </div>
      <span style={{ fontSize: 18, color: tc.color, flexShrink: 0 }}>→</span>
    </button>
  );
}

const FILM_TIMELINE = [
  { t: 0, label: "Opening", time: "0:00-0:06" },
  { t: 6, label: "Fund Upload", time: "0:06-0:14" },
  { t: 14, label: "Mandate Intelligence", time: "0:14-0:24" },
  { t: 24, label: "Fit Engine", time: "0:24-0:34" },
  { t: 34, label: "GP Requests Match", time: "0:34-0:44" },
  { t: 44, label: "LP Matches Back", time: "0:44-0:54" },
  { t: 54, label: "Diligence Copilot", time: "0:54-1:02" },
  { t: 62, label: "Permissioned Reveal", time: "1:02-1:10" },
  { t: 70, label: "Workflow", time: "1:10-1:24" },
  { t: 84, label: "Close", time: "1:24-1:30" },
];

const FILM_TOTAL_DURATION = 90;

const FILM_CLICK_WINDOW = 0.42;

const FILM_TRANSITION_CLICK_OFFSET = 0.18;

const FILM_CLICK_EVENTS = FILM_TIMELINE.slice(1).map((item) => ({
  t: item.t - FILM_TRANSITION_CLICK_OFFSET,
  target: item.label,
}));

const FILM_STORY_BEATS = {
  Opening: {
    phase: "Market problem",
    agent: "Mandate Intelligence",
    headline: "Fragmented fundraising becomes a structured decision workflow.",
    detail: "The demo starts with one GP, one LP, and one permissioned workflow that gets built by AI instead of scattered decks and inboxes.",
    action: "Enter GP workspace",
    output: "Capital intelligence layer ready",
    next: "Create the fund profile",
    metrics: [
      ["LP mandates", "124"],
      ["Top fit", "91%"],
      ["Profile state", "Draft"],
    ],
  },
  "Fund Upload": {
    phase: "GP submission",
    agent: "GP Readiness Agent",
    headline: "Northline uploads the raw materials LPs normally receive as PDFs.",
    detail: "Fund attributes, deck, DDQ, and track record are captured in a single submission before AI starts indexing.",
    action: "Generate Structured Profile",
    output: "3 documents indexed",
    next: "AI structures the profile",
    metrics: [
      ["Deck", "Uploaded"],
      ["DDQ", "Uploaded"],
      ["Track record", "Uploaded"],
    ],
  },
  "Mandate Intelligence": {
    phase: "AI structuring",
    agent: "Mandate Intelligence",
    headline: "The raw packet becomes an institutional GP intelligence profile.",
    detail: "AI extracts strategy, check size, geography, sector exposure, maturity, diligence gaps, risk flags, and target LP categories.",
    action: "Run Fit Engine",
    output: "87% profile complete",
    next: "Score LP mandates",
    metrics: [
      ["Attributes", "18"],
      ["Risk flags", "2"],
      ["Readiness", "Moderate"],
    ],
  },
  "Fit Engine": {
    phase: "Mandate matching",
    agent: "Fit Engine",
    headline: "The GP sees which LPs are actually a fit and why.",
    detail: "Matching is not a directory search. It scores mandate alignment, check-size compatibility, investor appetite, and diligence blockers.",
    action: "View LP Match Details",
    output: "124 mandates scored",
    next: "Request the best match",
    metrics: [
      ["Best LP", "Aster"],
      ["Fit score", "91%"],
      ["Reveal gate", "Eligible"],
    ],
  },
  "GP Requests Match": {
    phase: "GP action",
    agent: "Capital Formation Agent",
    headline: "The GP requests Aster because the rationale is strong enough to progress.",
    detail: "The GP can see the LP type and mandate without exposing private identity until the LP reciprocates.",
    action: "Request Match",
    output: "Match request sent",
    next: "LP reviews and matches back",
    metrics: [
      ["GP action", "Requested"],
      ["LP identity", "Hidden"],
      ["Blocker", "Attribution"],
    ],
  },
  "LP Matches Back": {
    phase: "LP decision",
    agent: "LP Review Agent",
    headline: "The LP receives a decision room, not a cold deck.",
    detail: "Aster reviews the GP dossier, AI analysis, materials, watchpoints, and chooses to match back before direct reveal.",
    action: "Match Back",
    output: "LP reciprocated interest",
    next: "Generate diligence memo",
    metrics: [
      ["Manager fit", "91%"],
      ["Watchpoints", "3"],
      ["Decision", "Match back"],
    ],
  },
  "Diligence Copilot": {
    phase: "Diligence",
    agent: "Diligence Copilot",
    headline: "AI generates an LP-specific diligence memo and material request.",
    detail: "The LP gets fit rationale, key risks, questions to ask, and a next-best action before reveal is approved.",
    action: "Send Diligence Request",
    output: "Request packet created",
    next: "Approve permissioned reveal",
    metrics: [
      ["Memo", "Generated"],
      ["Requests", "4"],
      ["Owner", "GP + LP"],
    ],
  },
  "Permissioned Reveal": {
    phase: "Reveal gate",
    agent: "Permissioning Layer",
    headline: "Identity is unlocked only after both sides create signal.",
    detail: "The GP sees an anonymous allocator until Aster matches back and the workflow has enough diligence context to justify reveal.",
    action: "Approve Reveal",
    output: "Aster identity unlocked",
    next: "Activate the workflow",
    metrics: [
      ["Sharing", "Permissioned"],
      ["Identity", "Revealed"],
      ["Connection", "Approved"],
    ],
  },
  Workflow: {
    phase: "Capital workflow",
    agent: "Capital Formation Agent",
    headline: "The relationship becomes a trackable capital formation workflow.",
    detail: "Intro scheduling, diligence requests, ownership, and next actions now live in a single system of record.",
    action: "Open Workflow",
    output: "Workflow active",
    next: "Show the closing frame",
    metrics: [
      ["Stages complete", "4"],
      ["Open tasks", "4"],
      ["Next step", "Intro"],
    ],
  },
  Close: {
    phase: "Positioning",
    agent: "MandateOS",
    headline: "MandateOS is the AI infrastructure layer for private capital formation.",
    detail: "The story lands on the core wedge: GP fundraising, LP review, diligence, reveal, and workflow in one structured system.",
    action: "End frame",
    output: "Demo complete",
    next: "Ready to film",
    metrics: [
      ["Workflow", "Structured"],
      ["Decisioning", "AI-led"],
      ["Reveal", "Permissioned"],
    ],
  },
};

function getFilmStoryBeat(scene) {
  return FILM_STORY_BEATS[scene.label] || FILM_STORY_BEATS.Opening;
}

function getFilmClickEvent(elapsed) {
  return FILM_CLICK_EVENTS.find((event) => Math.abs(event.t - elapsed) <= FILM_CLICK_WINDOW);
}

function getFilmSceneProgress(elapsed, scene) {
  const sceneIndex = FILM_TIMELINE.findIndex((item) => item.label === scene.label);
  const nextScene = FILM_TIMELINE[sceneIndex + 1];
  const start = scene.t;
  const end = nextScene ? nextScene.t : FILM_TOTAL_DURATION;
  return Math.min(100, Math.max(0, ((elapsed - start) / Math.max(0.01, end - start)) * 100));
}

function FilmDemoShell({ scene, elapsed, playing, onStart, onPause, onRestart, onBack, children }) {
  const progress = Math.min(100, (elapsed / FILM_TOTAL_DURATION) * 100);
  const story = getFilmStoryBeat(scene);
  const sceneProgress = getFilmSceneProgress(elapsed, scene);
  const clickEvent = getFilmClickEvent(elapsed);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#10161f",
        color: MP.text,
        fontFamily: MP.type.body,
        position: "relative",
        overflow: "hidden",
        cursor: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 70% 12%, rgba(123,111,232,.075), transparent 28%), radial-gradient(circle at 20% 90%, rgba(98,201,146,.055), transparent 28%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", gridTemplateRows: "50px minmax(0,1fr)" }}>
        <div
          style={{
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            borderBottom: `1px solid ${MP.line}`,
            background: "rgba(16,22,31,.9)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={22} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>MandateOS</div>
              <div style={{ fontSize: 10.5, color: MP.muted }}>{scene.time} · {scene.label}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${FILM_TIMELINE.length}, 46px)`, gap: 4, alignItems: "center" }}>
            {FILM_TIMELINE.map((item) => (
              <div
                key={item.label}
                style={{
                  height: 3,
                  borderRadius: 999,
                  background: elapsed >= item.t ? MP.accent : "rgba(237,234,248,.12)",
                  opacity: elapsed >= item.t ? 1 : 0.55,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MPButton size="sm" variant="secondary" onClick={onBack}>Back</MPButton>
            <MPButton size="sm" variant="secondary" onClick={onRestart}>Restart</MPButton>
            <MPButton size="sm" onClick={playing ? onPause : onStart}>{playing ? "Pause" : "Start"}</MPButton>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: 0, overflow: "hidden" }}>
          <div key={scene.label} style={{ height: "100%", animation: "marketplaceReveal .55s cubic-bezier(.22,1,.36,1) both" }}>
            {children}
          </div>
          <FilmStoryRail scene={scene} story={story} sceneProgress={sceneProgress} />
          <FilmSceneCue clickEvent={clickEvent} scene={scene} story={story} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "rgba(237,234,248,.08)", zIndex: 3 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: MP.accent }} />
      </div>
      <FilmCursor elapsed={elapsed} />
    </div>
  );
}

function FilmStoryRail({ scene, story, sceneProgress }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 238,
        right: 24,
        bottom: 20,
        zIndex: 18,
        display: "grid",
        gridTemplateColumns: "minmax(0,1.15fr) 420px",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          border: `1px solid ${MP.line}`,
          background: "rgba(17,22,31,.88)",
          backdropFilter: "blur(18px)",
          borderRadius: MP.radius.sm,
          padding: "13px 14px",
          boxShadow: "0 14px 34px rgba(0,0,0,.22)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "118px minmax(0,1fr) 112px", gap: 14, alignItems: "center" }}>
          <div>
            <div style={MP_TYPE.label}>{story.phase}</div>
            <div style={{ ...MP_TYPE.rowTitle, marginTop: 5 }}>{scene.label}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FilmAiBadge label={story.agent} />
              <span style={{ ...MP_TYPE.label, color: MP.muted }}>{story.output}</span>
            </div>
            <div style={{ color: MP.text, fontSize: 13.5, lineHeight: 1.35, fontWeight: 610, marginTop: 8 }}>
              {story.headline}
            </div>
            <div style={{ color: MP.soft, fontSize: 11.5, lineHeight: 1.45, marginTop: 4 }}>
              {story.detail}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={MP_TYPE.label}>Next click</div>
            <div style={{ ...MP_TYPE.rowTitle, marginTop: 5, color: MP.accent }}>{story.action}</div>
          </div>
        </div>
        <div style={{ marginTop: 11, height: 3, borderRadius: 999, background: "rgba(237,234,248,.10)", overflow: "hidden" }}>
          <div style={{ width: `${sceneProgress}%`, height: "100%", background: MP.accent }} />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 8,
        }}
      >
        {story.metrics.map(([label, value]) => (
          <div
            key={label}
            style={{
              border: `1px solid ${MP.line}`,
              background: "rgba(17,22,31,.86)",
              backdropFilter: "blur(18px)",
              borderRadius: MP.radius.sm,
              padding: "12px 13px",
              boxShadow: "0 14px 34px rgba(0,0,0,.18)",
            }}
          >
            <div style={MP_TYPE.label}>{label}</div>
            <div
              className={String(value).match(/[0-9$%]/) ? "marketplace-mono" : undefined}
              style={{ color: value === "91%" || value === "Uploaded" || value === "Structured" ? MP.green : MP.text, fontSize: 15.5, fontWeight: 650, marginTop: 7 }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmSceneCue({ clickEvent, scene, story }) {
  if (!clickEvent) return null;
  return (
    <div
      key={`${scene.label}-${clickEvent.target}`}
      style={{
        position: "absolute",
        right: 24,
        top: 68,
        zIndex: 22,
        minWidth: 270,
        borderRadius: MP.radius.sm,
        border: `1px solid rgba(255,255,255,.16)`,
        background: "rgba(17,22,31,.92)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 18px 42px rgba(0,0,0,.32)",
        padding: 14,
        animation: "marketplaceReveal .38s cubic-bezier(.22,1,.36,1) both",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.label, color: MP.accent }}>
        <MPStatusDot tone="accent" />
        Cursor action
      </div>
      <div style={{ color: MP.text, fontSize: 14, fontWeight: 650, marginTop: 7 }}>{story.action}</div>
      <div style={{ color: MP.soft, fontSize: 11.5, lineHeight: 1.45, marginTop: 4 }}>
        Advancing to {clickEvent.target}
      </div>
    </div>
  );
}

function FilmChrome({ title, subtitle, side = "GP Workspace", active = "Fit Engine", children, right, footer }) {
  const navItems = ["Profile", "Fit Engine", "LP Match", "Diligence", "Reveal", "Workflow"];
  return (
    <div style={{ height: "100%", padding: 24, display: "grid", gridTemplateColumns: "198px minmax(0,1fr)", gap: 16 }}>
      <aside
        style={{
          border: `1px solid ${MP.line}`,
          background: MP.sidebar,
          borderRadius: MP.radius.sm,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: `1px solid ${MP.line}` }}>
          <LogoMark size={20} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>MandateOS</div>
            <div style={{ fontSize: 10.5, color: MP.muted }}>{side}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "18px minmax(0,1fr)", gap: 8, alignItems: "center", padding: "8px 9px", borderRadius: 8, border: `1px solid ${MP.line}`, background: MP.workspace2 }}>
          <span style={{ width: 15, height: 15, borderRadius: 999, border: `1px solid ${MP.lineStrong}`, color: MP.muted, fontSize: 9, lineHeight: "13px", textAlign: "center" }}>/</span>
          <span style={{ color: MP.muted, fontSize: 11.5 }}>Search anything</span>
        </div>
        {navItems.map((item, index) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 8px",
              borderRadius: 8,
              color: item === active ? MP.text : MP.soft,
              background: item === active ? MP.accentSoft : "transparent",
              fontSize: 12,
              fontWeight: 560,
            }}
          >
            <MPStatusDot tone={index < navItems.indexOf(active) ? "green" : item === active ? "accent" : "neutral"} />
            {item}
          </div>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
          <div style={MP_TYPE.label}>Workspace</div>
          <div style={{ ...MP_TYPE.rowTitle, marginTop: 6 }}>Northline Capital III</div>
          <div style={{ ...MP_TYPE.rowMeta, marginTop: 4 }}>Private Equity · 2026 vintage</div>
        </div>
      </aside>
      <main style={{ minWidth: 0, display: "grid", gridTemplateRows: "auto minmax(0,1fr)", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, paddingBottom: 12, borderBottom: `1px solid ${MP.line}` }}>
          <div>
            <h1 style={{ color: MP.text, fontSize: 22, lineHeight: 1.1, fontWeight: 650, margin: 0 }}>{title}</h1>
            {subtitle && <div style={{ color: MP.soft, fontSize: 12.5, marginTop: 6 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
        <div style={{ minHeight: 0 }}>{children}</div>
        {footer}
      </main>
    </div>
  );
}

function FilmField({ label, value }) {
  return (
    <div style={{ padding: "11px 0", borderTop: `1px solid ${MP.line}` }}>
      <div style={MP_TYPE.label}>{label}</div>
      <div style={{ ...MP_TYPE.rowTitle, fontSize: 14, marginTop: 5 }}>{value}</div>
    </div>
  );
}

function FilmUploadBox({ progress = 100 }) {
  return (
    <div
      style={{
        height: "100%",
        border: `1px dashed rgba(123,111,232,.36)`,
        borderRadius: MP.radius.sm,
        background: MP.panel2,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ ...MP_TYPE.label, color: MP.accent }}>Upload Deck / DDQ / Data Room Materials</div>
        <div style={{ marginTop: 28, height: 92, borderRadius: 10, border: `1px solid ${MP.line}`, background: "rgba(123,111,232,.08)", display: "grid", placeItems: "center", color: MP.text, fontSize: 13, fontWeight: 650 }}>
          PDF dropped into upload box
        </div>
        <div style={{ marginTop: 14 }}>
          <MPProgress value={progress} color={progress >= 100 ? MP.green : MP.accent} />
        </div>
      </div>
      <div>
        {["Northline_Capital_III_Deck.pdf", "DDQ_2026.docx", "Track_Record.xlsx"].map((file) => (
          <div key={file} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 12.5 }}>
            <MPStatusDot tone="green" />
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmMatchCard({ name, score, tags, blocker, active }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: MP.radius.sm,
        border: `1px solid ${active ? "rgba(123,111,232,.38)" : MP.line}`,
        background: active ? MP.accentSoft : MP.panel,
        minHeight: 190,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ ...MP_TYPE.rowTitle, fontSize: 15 }}>{name}</div>
        <div className="marketplace-mono" style={{ color: score >= 85 ? MP.green : MP.text, fontSize: 18, lineHeight: 1 }}>{score}%</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {tags.map((tag) => <MPPill key={tag} tone={active ? "accent" : "neutral"}>{tag}</MPPill>)}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
        <div style={MP_TYPE.label}>Blocker</div>
        <div style={{ ...MP_TYPE.rowMeta, marginTop: 5 }}>{blocker}</div>
      </div>
    </div>
  );
}

const FILM_CURSOR_POINTS = [
  { t: 0, x: 50, y: 54, show: false },
  { t: 1.6, x: 46, y: 59, show: false },
  { t: 5.82, x: 62, y: 65, show: true, intent: "Enter GP workspace" },
  { t: 6.6, x: 68, y: 28, show: true },
  { t: 7.6, x: 77, y: 38, show: true, intent: "Drag fund deck" },
  { t: 9.2, x: 79, y: 46, show: true },
  { t: 11.2, x: 78, y: 68, show: true },
  { t: 13.82, x: 73, y: 15, show: true, intent: "Generate Structured Profile" },
  { t: 15.2, x: 68, y: 58, show: true },
  { t: 18.2, x: 48, y: 42, show: true },
  { t: 21.2, x: 78, y: 47, show: true },
  { t: 23.82, x: 75, y: 15, show: true, intent: "Run Fit Engine" },
  { t: 25.4, x: 31, y: 38, show: true },
  { t: 28.7, x: 39, y: 45, show: true },
  { t: 31.6, x: 58, y: 38, show: true },
  { t: 33.82, x: 75, y: 15, show: true, intent: "View LP Match Details" },
  { t: 35.4, x: 36, y: 34, show: true },
  { t: 38.6, x: 52, y: 50, show: true },
  { t: 41.5, x: 78, y: 67, show: true },
  { t: 43.82, x: 77, y: 15, show: true, intent: "Request Match" },
  { t: 45.4, x: 79, y: 38, show: true },
  { t: 48.2, x: 47, y: 39, show: true },
  { t: 51.2, x: 80, y: 30, show: true },
  { t: 53.82, x: 77, y: 15, show: true, intent: "Match Back" },
  { t: 55.6, x: 47, y: 42, show: true },
  { t: 58.4, x: 64, y: 56, show: true },
  { t: 61.82, x: 78, y: 15, show: true, intent: "Send Diligence Request" },
  { t: 63.4, x: 78, y: 58, show: true },
  { t: 66.2, x: 51, y: 49, show: true },
  { t: 69.82, x: 80, y: 15, show: true, intent: "Approve Reveal" },
  { t: 72.4, x: 45, y: 25, show: true },
  { t: 77.6, x: 65, y: 55, show: true },
  { t: 83.82, x: 78, y: 55, show: true, intent: "Open Workflow" },
  { t: 84, x: 50, y: 54, show: false },
];

function interpolateFilmCursor(elapsed) {
  const points = FILM_CURSOR_POINTS;
  let previous = points[0];
  let next = points[points.length - 1];
  for (let index = 0; index < points.length; index += 1) {
    if (points[index].t <= elapsed) previous = points[index];
    if (points[index].t >= elapsed) {
      next = points[index];
      break;
    }
  }
  const span = Math.max(0.01, next.t - previous.t);
  const progress = Math.min(1, Math.max(0, (elapsed - previous.t) / span));
  const ease = progress * progress * (3 - 2 * progress);
  const eventClick = getFilmClickEvent(elapsed);
  const pointClick = points.some((point) => point.intent && Math.abs(point.t - elapsed) < FILM_CLICK_WINDOW);
  return {
    x: previous.x + (next.x - previous.x) * ease,
    y: previous.y + (next.y - previous.y) * ease,
    show: previous.show || next.show,
    click: Boolean(eventClick || pointClick),
    intent: eventClick?.target || previous.intent || next.intent,
  };
}

function FilmCursor({ elapsed }) {
  const cursor = interpolateFilmCursor(elapsed);
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 60,
        opacity: cursor.show ? 1 : 0,
        transform: `translate3d(calc(${cursor.x}vw - 3px), calc(${cursor.y}vh - 2px), 0)`,
        transition: "opacity .18s ease",
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      {cursor.click && (
        <span
          key={cursor.intent || "click"}
          style={{
            position: "absolute",
            left: -13,
            top: -12,
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.72)",
            background: "rgba(255,255,255,.10)",
            animation: "filmCursorClick .52s ease-out both",
          }}
        />
      )}
      <span
        style={{
          display: "block",
          width: 18,
          height: 24,
          background: "#fff",
          clipPath: "polygon(0 0, 0 100%, 6px 76%, 11px 97%, 15px 96%, 10px 73%, 18px 73%)",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,.45))",
        }}
      />
      {cursor.click && cursor.intent && (
        <span
          style={{
            position: "absolute",
            left: 22,
            top: 18,
            padding: "5px 8px",
            borderRadius: 7,
            border: `1px solid ${MP.lineStrong}`,
            background: "rgba(17,22,31,.92)",
            color: MP.text,
            fontSize: 10.5,
            fontWeight: 650,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 18px rgba(0,0,0,.28)",
          }}
        >
          {cursor.intent}
        </span>
      )}
    </div>
  );
}

function FilmStatStrip({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`, gap: 10 }}>
      {items.map(([label, value, tone = "neutral"]) => (
        <div key={label} style={{ ...GP_LAUNCH_SURFACE, background: MP.panel2, padding: "12px 13px", minHeight: 78 }}>
          <div style={MP_TYPE.label}>{label}</div>
          <div className={String(value).match(/[0-9$%]/) ? "marketplace-mono" : undefined} style={{ ...MP_TYPE.rowTitle, color: tone === "green" ? MP.green : tone === "accent" ? MP.accent : MP.text, fontSize: 17, marginTop: 8 }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilmStatusRow({ label, value, tone = "neutral", meta }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center", padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
      <span style={{ minWidth: 0 }}>
        <span style={MP_TYPE.rowTitle}>{label}</span>
        {meta && <span style={{ display: "block", ...MP_TYPE.rowMeta, marginTop: 3 }}>{meta}</span>}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
        <MPStatusDot tone={tone} />
        {value}
      </span>
    </div>
  );
}

function FilmDataGrid({ columns, rows, template, maxHeight = 320 }) {
  return (
    <div style={{ minHeight: 0 }}>
      <MPTableHeader columns={columns} template={template} />
      <div style={{ maxHeight, overflow: "hidden" }}>
        {rows.map((row, index) => (
          <div key={`${row[0]}-${index}`} style={{ display: "grid", gridTemplateColumns: template, gap: "0 12px", alignItems: "center", minHeight: 40, padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
            {row.map((cell, cellIndex) => (
              <span
                key={`${row[0]}-${cellIndex}`}
                className={cellIndex > 0 && String(cell).match(/[0-9$%]/) ? "marketplace-mono" : undefined}
                style={{
                  ...(cellIndex === 0 ? MP_TYPE.rowTitle : MP_TYPE.rowMeta),
                  color: cellIndex === 1 && String(cell).includes("%") ? MP.green : cellIndex === 2 && String(cell).startsWith("$") ? MP.text : undefined,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmProcessingRail({ activeStep = 3 }) {
  const steps = [
    ["Parsing documents", "Deck, DDQ, track record"],
    ["Extracting fund attributes", "Strategy, sector, check size"],
    ["Detecting mandate signals", "LP categories and constraints"],
    ["Assessing diligence completeness", "Readiness and missing items"],
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {steps.map(([title, meta], index) => (
        <div
          key={title}
          style={{
            display: "grid",
            gridTemplateColumns: "22px minmax(0,1fr)",
            gap: 9,
            alignItems: "center",
            padding: "10px 0",
            borderTop: `1px solid ${MP.line}`,
            opacity: index <= activeStep ? 1 : 0.45,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              border: `1px solid ${index <= activeStep ? "rgba(98,201,146,.36)" : MP.line}`,
              display: "grid",
              placeItems: "center",
              background: index <= activeStep ? "rgba(98,201,146,.08)" : "transparent",
            }}
          >
            <MPStatusDot tone={index <= activeStep ? "green" : "neutral"} style={{ width: 5, height: 5 }} />
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={MP_TYPE.rowTitle}>{title}</span>
            <span style={{ display: "block", ...MP_TYPE.rowMeta, marginTop: 2 }}>{meta}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function FilmDocumentPreview({ title = "Northline Capital III Deck", rows = [] }) {
  return (
    <div style={{ borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2, padding: 14, minHeight: 250 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${MP.line}` }}>
        <div style={MP_TYPE.rowTitle}>{title}</div>
        <MPPill tone="green">Indexed</MPPill>
      </div>
      <div style={{ display: "grid", gap: 7, marginTop: 14 }}>
        {(rows.length ? rows : ["Executive summary", "Fund terms", "Team biography", "Track record", "Portfolio construction", "Risk factors"]).map((row, index) => (
          <div key={row} style={{ display: "grid", gridTemplateColumns: "18px minmax(0,1fr) 42px", gap: 8, alignItems: "center" }}>
            <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 10 }}>{index + 1}</span>
            <span style={{ height: 8, borderRadius: 999, background: `linear-gradient(90deg, rgba(237,234,248,.18), rgba(237,234,248,${0.08 + index * 0.01}))`, width: `${92 - index * 7}%` }} />
            <span style={{ ...MP_TYPE.label, fontSize: 8.5 }}>{row.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilmMandateMatrix() {
  const rows = [
    ["Strategy", "Lower MM Buyout", "Buyout / control-oriented PE", "96"],
    ["Check size", "$5M-15M", "$5M-10M target", "93"],
    ["Geography", "North America", "US / Canada mandate", "91"],
    ["Sector", "Services / Industrials / Healthcare", "Three approved sleeves", "88"],
    ["Maturity", "Fund III", "Prefers Fund II+", "86"],
    ["Readiness", "87% complete", "Financials + refs open", "74"],
  ];
  return <FilmDataGrid columns={["Signal", "Manager", "LP Mandate", "Score"]} rows={rows} template="1fr 1.1fr 1.1fr 56px" maxHeight={300} />;
}

function FilmWorkflowNode({ label, status, active }) {
  return (
    <div style={{ padding: 12, borderRadius: MP.radius.sm, border: `1px solid ${active ? "rgba(98,201,146,.28)" : MP.line}`, background: active ? "rgba(98,201,146,.06)" : MP.panel2, minHeight: 94 }}>
      <MPStatusDot tone={active ? "green" : "neutral"} />
      <div style={{ ...MP_TYPE.rowTitle, marginTop: 10 }}>{label}</div>
      <div style={{ ...MP_TYPE.rowMeta, marginTop: 4 }}>{status}</div>
    </div>
  );
}

function FilmAiBadge({ label = "Mandate Intelligence", tone = "accent" }) {
  const color = tone === "green" ? MP.green : tone === "amber" ? MP.amber : MP.accent;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 999,
        border: `1px solid ${color}40`,
        background: `${color}12`,
        color: MP.text,
        fontSize: 11,
        fontWeight: 650,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: `0 0 0 3px ${color}1f` }} />
      {label}
    </span>
  );
}

function FilmAiWorkCard({ title, detail, rows = [], action }) {
  return (
    <MPCard
      style={{
        padding: 16,
        background: `linear-gradient(180deg, rgba(123,111,232,.075), rgba(22,28,38,.94))`,
        borderColor: "rgba(123,111,232,.22)",
        minHeight: 170,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <FilmAiBadge label={title} />
        {action && <span style={MP_TYPE.label}>{action}</span>}
      </div>
      <div style={{ ...MP_TYPE.rowMeta, color: MP.soft, marginTop: 10, lineHeight: 1.45 }}>{detail}</div>
      <div style={{ marginTop: 12 }}>
        {rows.map(([label, value, tone = "neutral"]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 10, alignItems: "center", padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
            <span style={MP_TYPE.rowTitle}>{label}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
              <MPStatusDot tone={tone} />
              {value}
            </span>
          </div>
        ))}
      </div>
    </MPCard>
  );
}

function FilmMemoSection({ title, items = [], tone = "green" }) {
  return (
    <div style={{ padding: 14, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.label, color: tone === "amber" ? MP.amber : tone === "accent" ? MP.accent : MP.green }}>
        <MPStatusDot tone={tone} />
        {title}
      </div>
      <div style={{ marginTop: 8 }}>
        {items.map((item) => (
          <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, ...MP_TYPE.rowTitle }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceFilmDemoWorkspace({ user, onLogout }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const elapsedRef = useRef(0);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(null);

  useEffect(() => {
    if (!playing) return undefined;
    lastFrameRef.current = performance.now();
    const tick = (now) => {
      const previous = lastFrameRef.current || now;
      const delta = Math.min(0.08, Math.max(0, (now - previous) / 1000));
      lastFrameRef.current = now;
      const nextElapsed = Math.min(FILM_TOTAL_DURATION, elapsedRef.current + delta);
      elapsedRef.current = nextElapsed;
      setElapsed(nextElapsed);
      if (nextElapsed >= FILM_TOTAL_DURATION) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = null;
    };
  }, [playing]);

  const sceneIndex = FILM_TIMELINE.reduce((current, scene, index) => (elapsed >= scene.t ? index : current), 0);
  const scene = FILM_TIMELINE[sceneIndex];
  const setFilmElapsed = (value) => {
    const nextValue = Math.min(FILM_TOTAL_DURATION, Math.max(0, value));
    elapsedRef.current = nextValue;
    setElapsed(nextValue);
  };
  const restart = () => {
    setPlaying(false);
    setFilmElapsed(0);
  };
  const start = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const uploadProgress = elapsed < 7 ? 0 : elapsed < 9.5 ? 38 : elapsed < 11.5 ? 72 : 100;
  const structuringProgress = elapsed < 14 ? 0 : Math.min(100, Math.round(((elapsed - 14) / 8) * 100));
  const matchUniverseRows = [
    ["Aster Family Office", "91%", "$5M-10M", "Reveal eligible", "Check size, sector, Fund III fit"],
    ["Harbor Endowment", "84%", "$10M-15M", "Diligence first", "Strategy fit, needs stronger DPI"],
    ["Northgate Foundation", "76%", "$3M-7M", "Reference gate", "Geography fit, smaller check likely"],
    ["Stonebridge LP", "62%", "$15M-25M", "Below gate", "Check size mismatch"],
    ["Mercer FoF", "41%", "$1M-3M", "Hold", "Too early-stage"],
  ];
  const activityEvents = [
    ["09:41", "Fund profile submitted", "green"],
    ["09:42", "Diligence Copilot indexed materials", "green"],
    ["09:43", "Fit Engine scored 124 LP mandates", "accent"],
    ["09:45", "Aster opened GP intelligence profile", "green"],
    ["09:47", "LP-specific diligence memo generated", "amber"],
  ];

  const intro = (
    <div style={{ minHeight: "100%", display: "grid", gridTemplateColumns: "minmax(0,1fr) 420px", gap: 28, alignItems: "center", padding: "56px 72px" }}>
      <div style={{ animation: "fadeIn .7s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 999, border: `1px solid ${MP.line}`, color: MP.soft, fontSize: 11, marginBottom: 18 }}>
          <MPStatusDot tone="accent" />
          AI infrastructure for private capital formation
        </div>
        <div style={{ color: MP.text, fontSize: 28, lineHeight: 1.1, fontWeight: 680, maxWidth: 760 }}>
          Capital formation is still fragmented.
        </div>
        <div style={{ color: MP.soft, fontSize: 14, lineHeight: 1.5, marginTop: 14, maxWidth: 680 }}>
          MandateOS uses AI to evaluate mandate fit, diligence readiness, and investor intent so GPs and LPs can move from fragmented fundraising conversations to structured capital formation decisions.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,150px))", gap: 10, marginTop: 30 }}>
          {[
            ["124", "LP mandates"],
            ["87%", "profile complete"],
            ["91%", "top fit score"],
          ].map(([value, label]) => (
            <div key={label} style={{ ...GP_LAUNCH_SURFACE, background: MP.panel, padding: 14 }}>
              <div className="marketplace-mono" style={{ color: value === "91%" ? MP.green : MP.text, fontSize: 24, lineHeight: 1 }}>{value}</div>
              <div style={{ ...MP_TYPE.label, marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <MPCard style={{ padding: 0, overflow: "hidden", minHeight: 420, animation: "heroFilmDrift 4s ease-in-out infinite" }}>
        <div style={{ padding: 14, borderBottom: `1px solid ${MP.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={20} />
            <span style={MP_TYPE.rowTitle}>MandateOS</span>
          </div>
          <MPPill tone="green">Workflow active</MPPill>
        </div>
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <FilmDataGrid
            columns={["Signal", "Status", "Owner"]}
            template="1fr 90px 92px"
            maxHeight={220}
            rows={[
              ["Fund profile", "Ready", "GP"],
              ["Fit Engine", "Running", "System"],
              ["LP review", "Queued", "LP"],
              ["Reveal", "Locked", "Both"],
            ]}
          />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 10 }}>
            <MPCard style={{ background: MP.panel2, padding: 12 }}>
              <div style={MP_TYPE.label}>Current match</div>
              <div style={{ ...MP_TYPE.rowTitle, marginTop: 8 }}>Aster Family Office</div>
            </MPCard>
            <MPCard style={{ background: MP.panel2, padding: 12 }}>
              <div style={MP_TYPE.label}>Next action</div>
              <div style={{ ...MP_TYPE.rowTitle, marginTop: 8 }}>Generate LP memo</div>
            </MPCard>
          </div>
        </div>
      </MPCard>
    </div>
  );

  const upload = (
    <FilmChrome
      title="Create Fund Profile"
      subtitle="Submit fund attributes and supporting materials"
      active="Profile"
      right={<MPButton>Generate Structured Profile</MPButton>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", gap: 16, minHeight: 0 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <FilmAiWorkCard
            title="GP Readiness Agent"
            detail="The GP submits raw fund attributes and materials. AI begins turning the submission into a structured institutional profile."
            action="Working"
            rows={[
              ["Fund profile", "Captured", "green"],
              ["Document packet", uploadProgress >= 100 ? "Uploaded" : "Uploading", uploadProgress >= 100 ? "green" : "accent"],
              ["Readiness model", "Queued", "neutral"],
            ]}
          />
          <MPCard style={{ padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", columnGap: 18 }}>
              {[
                ["Fund Name", "Northline Capital III"],
                ["Strategy", "Lower Middle Market Buyout"],
                ["Target Raise", "$300M"],
                ["Geography", "North America"],
                ["Check Size", "$5M-15M"],
                ["Sector Focus", "Business Services, Industrials, Healthcare"],
                ["Vintage", "2026"],
                ["Target LP Profile", "Family offices, endowments, PE allocators"],
              ].map(([label, value]) => <FilmField key={label} label={label} value={value} />)}
            </div>
          </MPCard>
          <MPDeskPanel title="Submission Quality" style={{ minHeight: 168 }}>
            <FilmStatStrip items={[["Profile completeness", "64%", "accent"], ["Documents attached", "3", "neutral"], ["Fields required", "0", "green"], ["Ready to structure", uploadProgress >= 100 ? "Yes" : "Uploading", uploadProgress >= 100 ? "green" : "accent"]]} />
          </MPDeskPanel>
        </div>
        <FilmUploadBox progress={uploadProgress} />
      </div>
    </FilmChrome>
  );

  const structured = (
    <FilmChrome
      title="Northline Capital III"
      subtitle="Under Review"
      active="Profile"
      right={<MPPill tone="amber">Diligence readiness: Moderate</MPPill>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <FilmAiWorkCard
          title="Mandate Intelligence"
          detail="AI converts unstructured fund materials into a private-capital intelligence profile the Fit Engine and LP Review Agent can use."
          action="Profile generated"
          rows={[
            ["Strategy", "Lower MM Buyout", "green"],
            ["Risk flags", "2 open", "amber"],
            ["Missing diligence", "Financials, references", "amber"],
          ]}
        />
        <MPCard style={{ padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 220px", gap: 18, alignItems: "center" }}>
            <FilmStatStrip items={[
              ["Strategy", "Lower MM Buyout"],
              ["Raise Target", "$300M"],
              ["Geography", "North America"],
              ["Status", "Active"],
              ["Profile", `${Math.max(64, Math.min(87, 64 + Math.round(structuringProgress * 0.23)))}%`, "green"],
            ]} />
            <div>
              <div style={MP_TYPE.label}>Structuring profile</div>
              <div style={{ marginTop: 8 }}><MPProgress value={Math.max(72, structuringProgress)} color={MP.accent} /></div>
            </div>
          </div>
        </MPCard>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 310px", gap: 14 }}>
          <MPCard style={{ padding: 16 }}>
            <FilmProcessingRail activeStep={3} />
          </MPCard>
          <FilmDocumentPreview />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr) minmax(0,1fr)", gap: 14 }}>
          <MPDeskPanel title="Fund Overview" style={{ height: 430 }}>
            {["Fund name", "Manager name", "Strategy", "Sector focus", "Check size", "Target LP profile"].map((item, index) => (
              <FilmField key={item} label={item} value={["Northline Capital III", "Northline Capital", "Lower Middle Market Buyout", "Business Services, Industrials, Healthcare", "$5M-15M", "Family offices, endowments, PE allocators"][index]} />
            ))}
          </MPDeskPanel>
          <MPDeskPanel title="AI Attributes Extracted" style={{ height: 430 }}>
            <FilmDataGrid
              columns={["Attribute", "Extracted"]}
              template="1fr 1fr"
              maxHeight={360}
              rows={[
                ["Strategy match type", "Control buyout"],
                ["Sector exposure", "Services / Industrials / Healthcare"],
                ["Geographic alignment", "North America"],
                ["Check-size range", "$5M-15M"],
                ["Target LP categories", "FO / Endowment / PE allocator"],
                ["Fund maturity", "Fund III"],
                ["Track record highlights", "18 realized / partial exits"],
                ["Key differentiators", "Sector specialization + Fund III"],
                ["Risk flags", "Financials, realized DPI"],
              ]}
            />
          </MPDeskPanel>
          <MPDeskPanel title="Materials & Readiness" style={{ height: 430 }}>
            {[
              ["Deck", "Ready", "green"],
              ["DDQ", "Ready", "green"],
              ["Track Record", "Ready", "green"],
              ["Financials", "Attention", "amber"],
              ["References", "Attention", "amber"],
              ["Data Room Access", "Ready", "green"],
            ].map(([label, value, tone]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 92px", ...MP_COMPACT_ROW_BASE }}>
                <span style={MP_TYPE.rowTitle}>{label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
                  <MPStatusDot tone={tone} />
                  {value}
                </span>
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${MP.line}`, ...MP_TYPE.rowTitle }}>
              2 missing diligence items
            </div>
          </MPDeskPanel>
        </div>
      </div>
    </FilmChrome>
  );

  const engine = (
    <FilmChrome
      title="Fit Engine Results"
      subtitle="AI-ranked LP matches based on mandate alignment, diligence readiness, and investor intent"
      active="Fit Engine"
      right={<MPButton>View LP Match Details</MPButton>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <FilmAiWorkCard
          title="Fit Engine"
          detail="The Fit Engine compares Northline against LP mandates, check-size ranges, strategy appetite, geography, and historical preference indicators."
          action="124 mandates scored"
          rows={[
            ["Mandate fit", "Weighted", "green"],
            ["Investor intent", "Detected", "accent"],
            ["Diligence blockers", "Included", "amber"],
          ]}
        />
        <MPCard style={{ padding: 0, overflow: "hidden", borderColor: "rgba(123,111,232,.28)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", minHeight: 188 }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.label, color: MP.accent }}>
                <MPStatusDot tone="accent" />
                Highest confidence match
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 18, marginTop: 12 }}>
                <div>
                  <div style={{ color: MP.text, fontSize: 18, lineHeight: 1.05, fontWeight: 660 }}>Aster Family Office</div>
                  <div style={{ color: MP.soft, fontSize: 13, marginTop: 8 }}>Family Office · United States · $5M-10M typical check</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="marketplace-mono" style={{ color: MP.green, fontSize: 28, lineHeight: 1 }}>91%</div>
                  <div style={MP_TYPE.label}>Fit Score</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18 }}>
                {["Buyout strategy match", "Check size aligned", "North America mandate", "Active in emerging managers"].map((tag) => <MPPill key={tag} tone="accent">{tag}</MPPill>)}
              </div>
            </div>
            <div style={{ padding: 16, background: MP.panel2, borderLeft: `1px solid ${MP.line}` }}>
              <div style={MP_TYPE.label}>Signal Quality</div>
              {[
                ["Mandate", 96],
                ["Check size", 93],
                ["Geography", 91],
                ["Current appetite", 88],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={MP_TYPE.rowTitle}>{label}</span>
                    <span className="marketplace-mono" style={MP_TYPE.number}>{value}</span>
                  </div>
                  <MPProgress value={value} color={value > 90 ? MP.green : MP.accent} />
                </div>
              ))}
            </div>
          </div>
        </MPCard>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) 330px", gap: 16 }}>
          <MPDeskPanel title="AI-Ranked LP Matches" style={{ height: 385, overflow: "hidden" }}>
            <FilmDataGrid columns={["LP", "Fit", "Check", "Decision", "Reason"]} rows={matchUniverseRows} template="1.15fr 52px 78px 96px 1.1fr" maxHeight={320} />
          </MPDeskPanel>
          <MPDeskPanel title="Why this LP fits" style={{ height: 385 }}>
            {["Mandate alignment", "Check-size compatibility", "Geography match", "Strategy overlap", "Current appetite", "Historical preference indicators"].map((item, index) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
                <MPStatusDot tone={index < 5 ? "green" : "accent"} />
                <span style={MP_TYPE.rowTitle}>{item}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>
        <MPDeskPanel title="AI Mandate Alignment Matrix" style={{ minHeight: 250 }}>
          <FilmMandateMatrix />
        </MPDeskPanel>
      </div>
    </FilmChrome>
  );

  const gpMatchRequest = (
    <FilmChrome
      title="LP Matches"
      subtitle="The GP reviews ranked matches and requests the highest-fit allocator"
      active="LP Match"
      right={<MPButton>Request Match</MPButton>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 16, minHeight: 0 }}>
        <MPDeskPanel title="Ranked LP Matches" style={{ height: 610, overflow: "hidden" }}>
          <FilmDataGrid
            columns={["LP", "Fit", "Check", "Decision", "Next step"]}
            rows={[
              ["Aster Family Office", "91%", "$5M-10M", "Requestable", "Request match"],
              ["Harbor Endowment", "84%", "$10M-15M", "Diligence first", "Complete financials"],
              ["Northgate Foundation", "76%", "$3M-7M", "Reference gate", "Add case studies"],
              ["Stonebridge LP", "62%", "$15M-25M", "Below gate", "Check size mismatch"],
              ["Mercer FoF", "41%", "$1M-3M", "Hold", "Too early-stage"],
              ["Greylock Trust", "38%", "$4M-8M", "Below gate", "Strategy mismatch"],
              ["Bayline Capital", "34%", "$8M-15M", "Hold", "No active mandate"],
            ]}
            template="1.25fr 52px 82px 96px 1fr"
            maxHeight={520}
          />
        </MPDeskPanel>
        <MPDeskPanel title="Selected Match" style={{ height: 610 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <div>
              <div style={{ color: MP.text, fontSize: 21, lineHeight: 1.1, fontWeight: 660 }}>Aster Family Office</div>
              <div style={{ ...MP_TYPE.rowMeta, marginTop: 7 }}>Family Office · United States · $5M-10M typical check</div>
            </div>
            <div className="marketplace-mono" style={{ color: MP.green, fontSize: 24, lineHeight: 1 }}>91%</div>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 16 }}>
            {["Buyout strategy", "Check aligned", "North America", "Active mandate"].map((tag) => <MPPill key={tag} tone="accent">{tag}</MPPill>)}
          </div>
          <div style={{ marginTop: 18 }}>
            <MPDataRow label="GP-visible identity" value="Anonymous family office" />
            <MPDataRow label="LP type" value="Family Office" />
            <MPDataRow label="Mandate" value="Lower MM buyout exposure" />
            <MPDataRow label="Reveal gate" value="LP must match back" />
            <MPDataRow label="Primary blocker" value="Requests deal-level attribution" />
          </div>
          <div style={{ marginTop: "auto", display: "grid", gap: 9 }}>
            <MPButton style={{ width: "100%" }}>Request Match</MPButton>
            <MPButton variant="secondary" style={{ width: "100%" }}>Add to Watchlist</MPButton>
          </div>
        </MPDeskPanel>
      </div>
    </FilmChrome>
  );

  const lpMatchBack = (
    <FilmChrome
      title="Inbound Match Review"
      subtitle="Aster Family Office receives Northline Capital III and chooses whether to match back"
      side="LP Workspace"
      active="LP Match"
      right={<MPButton>Match Back</MPButton>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr) 310px", gap: 14, minHeight: 0 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <MPDeskPanel title="GP Dossier" style={{ height: 330 }}>
            {["Fund Name", "Strategy", "Raise Target", "Geography", "Team snapshot", "Track record summary"].map((label, index) => (
              <FilmField key={label} label={label} value={["Northline Capital III", "Lower MM Buyout", "$300M", "North America", "4 partners, 18 platform investments", "Strong gross MOIC; financials pending"][index]} />
            ))}
          </MPDeskPanel>
          <FilmDocumentPreview title="Deck preview" rows={["Overview", "Strategy", "Team", "Track", "Terms"]} />
        </div>
        <MPDeskPanel title="MandateOS Analysis" style={{ height: 596 }}>
          <div style={{ display: "grid", gridTemplateColumns: "132px minmax(0,1fr)", gap: 18, alignItems: "center" }}>
            <div>
              <div className="marketplace-mono" style={{ color: MP.green, fontSize: 22, lineHeight: 1 }}>91%</div>
              <div style={{ ...MP_TYPE.label, marginTop: 6 }}>Manager fit</div>
            </div>
            <FilmStatStrip items={[["Mandate", "96%", "green"], ["Check", "93%", "green"], ["Geo", "91%", "green"]]} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 14, marginTop: 18 }}>
            <div>
              <div style={MP_TYPE.label}>Why it fits</div>
              {["Buyout mandate aligned", "Check size within range", "North America focus aligned", "Relevant sector exposure"].map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <MPStatusDot tone="green" />
                  <span style={MP_TYPE.rowTitle}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={MP_TYPE.label}>Watchpoints</div>
              {["Missing audited financials", "Limited realized exits in prior vintage", "References not yet scheduled"].map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <MPStatusDot tone="amber" />
                  <span style={MP_TYPE.rowMeta}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <FilmDataGrid
              columns={["Document", "Status", "Signal"]}
              template="1fr 84px 1fr"
              maxHeight={190}
              rows={[
                ["Deck", "Ready", "Strategy and team parsed"],
                ["DDQ", "Ready", "Ops controls indexed"],
                ["Track record", "Ready", "Attribution extracted"],
                ["Financials", "Open", "Requested before IC"],
              ]}
            />
          </div>
        </MPDeskPanel>
        <MPDeskPanel title="LP Match Decision" style={{ height: 596 }}>
          {["Pass", "Request More Information", "Match Back", "Open Diligence"].map((action, index) => (
            <MPButton key={action} variant={index === 2 ? "primary" : "secondary"} style={{ width: "100%", marginBottom: 9 }}>{action}</MPButton>
          ))}
          <div style={{ marginTop: 14 }}>
            {[
              ["09:43", "GP requested match with Aster", "accent"],
              ["09:44", "Northline profile received", "green"],
              ["09:45", "Materials checked", "green"],
              ["09:46", "LP matched back", "green"],
              ["09:47", "Diligence workspace queued", "amber"],
            ].map(([time, event, tone]) => (
              <div key={event} style={{ display: "grid", gridTemplateColumns: "42px minmax(0,1fr)", gap: 8, alignItems: "center", padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 10 }}>{time}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta }}>
                  <MPStatusDot tone={tone} />
                  {event}
                </span>
              </div>
            ))}
          </div>
        </MPDeskPanel>
      </div>
    </FilmChrome>
  );

  const diligence = (
    <FilmChrome title="AI Diligence Memo" subtitle="Diligence Copilot generates an LP-specific investment review before reveal" side="LP Workspace" active="Diligence" right={<MPButton>Send Diligence Request</MPButton>}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 350px", gap: 16 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <FilmAiWorkCard
            title="Diligence Copilot"
            detail="AI turns Northline's GP profile and Aster's mandate into a diligence memo with fit rationale, risks, questions, and a recommended next step."
            action="Memo generated"
            rows={[
              ["LP-specific memo", "Generated", "green"],
              ["Risk flags", "Prioritized", "amber"],
              ["Next step", "Request attribution", "accent"],
            ]}
          />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12 }}>
            <FilmMemoSection
              title="Why this GP fits your mandate"
              tone="green"
              items={["Fund III maturity fits Aster's preference", "$5M-15M check range maps to target allocation", "Business services and healthcare exposure match approved sleeves"]}
            />
            <FilmMemoSection
              title="Key risks"
              tone="amber"
              items={["DPI needs more support", "Audited financials not yet uploaded", "Attribution should be reviewed deal by deal"]}
            />
          </div>
          <FilmMemoSection
            title="Questions to ask"
            tone="accent"
            items={["Which realized deals are attributable to the current GP team?", "How much of the target raise is soft-circled?", "What case studies best prove operating improvement?"]}
          />
          <MPCard style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", columnGap: 18 }}>
              {["Audited financials", "Full track record attribution", "Portfolio company case studies", "Reference calls", "DDQ clarifications", "Management company budget"].map((item, index) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${MP.lineStrong}`, background: index < 3 ? MP.accent : "transparent" }} />
                  <span style={MP_TYPE.rowTitle}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 14, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2, color: MP.text, fontSize: 13 }}>
              Recommended next step: approve reveal after requesting attribution by deal.
            </div>
          </MPCard>
          <MPDeskPanel title="Request Packet" style={{ minHeight: 220 }}>
            <FilmDataGrid
              columns={["Requested item", "Owner", "Due"]}
              template="1fr 92px 90px"
              maxHeight={170}
              rows={[
                ["Audited financials", "GP", "3 days"],
                ["Portfolio case studies", "GP", "5 days"],
                ["Reference calls", "Both", "7 days"],
                ["DDQ clarification", "GP", "2 days"],
              ]}
            />
          </MPDeskPanel>
        </div>
        <MPDeskPanel title="Activity Feed" style={{ height: 520 }}>
          {["Diligence memo generated", "Aster requested deal-level attribution", "GP notification delivered", "Request packet created", "Workflow owner assigned"].map((event, index) => (
            <div key={event} style={{ display: "flex", gap: 8, padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
              <MPStatusDot tone={index === 0 ? "green" : index < 3 ? "accent" : "neutral"} />
              <span style={MP_TYPE.rowTitle}>{event}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: 14, borderRadius: MP.radius.sm, border: `1px solid rgba(98,201,146,.24)`, background: "rgba(98,201,146,.06)" }}>
            <div style={MP_TYPE.label}>GP side notification</div>
            <div style={{ ...MP_TYPE.rowTitle, marginTop: 7 }}>Aster requested attribution by deal before reveal</div>
          </div>
        </MPDeskPanel>
      </div>
    </FilmChrome>
  );

  const reveal = (
    <FilmChrome title="Reveal Request" subtitle="Identity stays hidden until both sides are ready" active="Reveal" right={<MPButton>Approve Reveal</MPButton>}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px minmax(0,1fr)", gap: 16, alignItems: "stretch" }}>
        <MPDeskPanel title="Before Approval" style={{ height: 470 }}>
          <div style={{ display: "grid", placeItems: "center", minHeight: 120, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2, marginBottom: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, animation: "marketplaceUnlock .9s ease both" }}>Locked</div>
              <div style={{ ...MP_TYPE.label, marginTop: 8 }}>LP Identity Hidden</div>
            </div>
          </div>
          <MPDataRow label="LP Identity" value="Hidden" />
          <MPDataRow label="Sharing Mode" value="Permissioned" />
          <MPDataRow label="LP Type" value="Family Office" />
          <MPDataRow label="Geography" value="United States" />
          <MPDataRow label="Typical Check Size" value="$5M-10M" />
          <MPDataRow label="Status" value="In Diligence" />
        </MPDeskPanel>
        <div style={{ display: "grid", placeItems: "center" }}>
          <div style={{ width: 80, height: 1, background: MP.lineStrong, position: "relative" }}>
            <span style={{ position: "absolute", left: 28, top: -12, width: 26, height: 26, borderRadius: 999, border: `1px solid ${MP.accent}`, background: MP.workspace2, display: "grid", placeItems: "center", color: MP.accent }}>→</span>
          </div>
        </div>
        <MPDeskPanel title="After Approval" style={{ height: 470, borderColor: "rgba(98,201,146,.28)" }}>
          <div style={{ display: "grid", placeItems: "center", minHeight: 150, borderRadius: MP.radius.sm, border: `1px solid rgba(98,201,146,.24)`, background: "rgba(98,201,146,.06)", marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...MP_TYPE.label, color: MP.green }}>Revealed</div>
              <div style={{ color: MP.text, fontSize: 17, fontWeight: 650, marginTop: 8 }}>Aster Family Office</div>
            </div>
          </div>
          <MPDataRow label="Contact" value="Principal / Investment Team" />
          <MPDataRow label="Status" value="Reveal Approved" />
          <MPDataRow label="Connection" value="Northline <-> Aster" />
          <MPDataRow label="Next stage" value="Intro scheduling" />
        </MPDeskPanel>
      </div>
    </FilmChrome>
  );

  const workflow = (
    <FilmChrome title="Capital Formation Workflow Activated" subtitle="Northline Capital III <-> Aster Family Office" active="Workflow" right={<MPPill tone="green">Workflow Active</MPPill>}>
      <div style={{ display: "grid", gap: 16 }}>
        <MPCard style={{ padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 8 }}>
            {[
              ["Matched", "Complete"],
              ["Reviewed", "Complete"],
              ["Diligence Started", "Complete"],
              ["Reveal Approved", "Complete"],
              ["Intro Scheduled", "Next"],
              ["Closing Diligence", "Queued"],
              ["Committed", "Future"],
            ].map(([stage, status], index) => (
              <FilmWorkflowNode key={stage} label={stage} status={status} active={index < 4} />
            ))}
          </div>
        </MPCard>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 16 }}>
          <MPCard style={{ padding: 18, minHeight: 320 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 80px minmax(0,1fr)", gap: 14, alignItems: "center", minHeight: 120 }}>
              {[
                ["Northline Capital III", "Lower MM Buyout", "$300M target"],
                ["Aster Family Office", "Family Office", "$5M-10M check"],
              ].map(([name, type, meta], index) => (
                <div key={name} style={{ padding: 18, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2, textAlign: "center" }}>
                  <div style={{ color: MP.text, fontSize: 20, lineHeight: 1.15, fontWeight: 650 }}>{name}</div>
                  <div style={{ ...MP_TYPE.rowMeta, marginTop: 8 }}>{type} · {meta}</div>
                </div>
              )).reduce((acc, item, index) => index === 0 ? [item, <div key="connector" style={{ textAlign: "center", color: MP.accent, fontSize: 20 }}>↔</div>] : [...acc, item], [])}
            </div>
            <div style={{ marginTop: 22 }}>
              <FilmDataGrid
                columns={["Workflow object", "Status", "Owner", "Due"]}
                template="1fr 92px 84px 74px"
                maxHeight={170}
                rows={[
                  ["Intro agenda", "Next", "Both", "2 days"],
                  ["Audited financials", "Open", "GP", "3 days"],
                  ["Reference calls", "Queued", "Both", "7 days"],
                  ["IC memo", "Draft", "LP", "10 days"],
                ]}
              />
            </div>
          </MPCard>
          <MPDeskPanel title="Activity Timeline" style={{ minHeight: 360 }}>
            {["Match generated", "LP reviewed manager", "Additional diligence requested", "Reveal approved", "Intro opened", "Workflow owner assigned"].map((event, index) => (
              <div key={event} style={{ display: "grid", gridTemplateColumns: "24px minmax(0,1fr)", gap: 8, padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
                <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 10 }}>{index + 1}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MPStatusDot tone={index < 5 ? "green" : "accent"} />
                  <span style={MP_TYPE.rowTitle}>{event}</span>
                </span>
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, color: MP.green }}>Final stat</div>
              <div style={{ color: MP.text, fontSize: 20, fontWeight: 650, lineHeight: 1.2, marginTop: 7 }}>
                One relationship. One workflow. Structured capital formation.
              </div>
            </div>
          </MPDeskPanel>
        </div>
      </div>
    </FilmChrome>
  );

  const close = (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 32 }}>
      <div style={{ textAlign: "center", maxWidth: 760 }}>
        <LogoMark size={48} />
        <div style={{ color: MP.text, fontSize: 28, lineHeight: 1.05, fontWeight: 700, marginTop: 18 }}>MandateOS</div>
        <div style={{ color: MP.soft, fontSize: 16, marginTop: 14 }}>Capital Intelligence for Private Markets</div>
        <div style={{ color: MP.muted, fontSize: 13, marginTop: 16 }}>From fragmented fundraising to structured allocation</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 28 }}>
          {[
            ["Discover", "Mandate-aligned LPs"],
            ["Evaluate", "Structured diligence"],
            ["Allocate", "Trackable capital workflow"],
          ].map(([title, meta]) => (
            <MPCard key={title} style={{ background: MP.panel2, padding: 16 }}>
              <div style={{ color: MP.text, fontSize: 14, fontWeight: 650 }}>{title}</div>
              <div style={{ color: MP.soft, fontSize: 12, marginTop: 6 }}>{meta}</div>
            </MPCard>
          ))}
        </div>
      </div>
    </div>
  );

  const scenes = [intro, upload, structured, engine, gpMatchRequest, lpMatchBack, diligence, reveal, workflow, close];
  return (
    <FilmDemoShell
      scene={scene}
      elapsed={elapsed}
      playing={playing}
      onStart={start}
      onPause={pause}
      onRestart={restart}
      onBack={onLogout}
    >
      {scenes[sceneIndex]}
    </FilmDemoShell>
  );
}

export function MarketplaceGPDemoWorkspace({ user, onLogout, initialPage }) {
  const [state, updateState, resetState] = useMarketplaceDemoState();
  const [page, setPage] = useState(() => getMarketplaceInitialPage(initialPage || "overview"));
  const [selectedMatchId, setSelectedMatchId] = useState(MARKETPLACE_PRIMARY_MATCH_ID);
  const [selectedPipelineId, setSelectedPipelineId] = useState("tier-1-family-office");
  const [dataRoomSection, setDataRoomSection] = useState("documents");
  const [detail, setDetail] = useState(null);
  const [packetEditMode, setPacketEditMode] = useState(false);
  const [updateGenerated, setUpdateGenerated] = useState(false);
  const [matchWeights, setMatchWeights] = useState({ strategy: 30, sector: 30, checkSize: 25, geography: 15 });
  const [matchSubView, setMatchSubView] = useState("engine");
  const [revealQueueIds, setRevealQueueIds] = useState(() => new Set());
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  const gpRequests = state.matchRequests.filter(
    (request) => request.gpName === state.fundProfile.fundName
  );
  const pendingCount = gpRequests.filter((request) =>
    ["Pending", "More Info Requested"].includes(request.status)
  ).length;
  const approvedRequest = gpRequests.find((request) => request.status === "Approved");
  const activeRoom =
    (approvedRequest &&
      Object.values(state.workflowRooms).find(
        (room) => room.matchId === approvedRequest.matchId
      )) ||
    Object.values(state.workflowRooms).find(
      (room) => room.gpName === state.fundProfile.fundName
    ) ||
    null;
  const readyToRequest = marketplaceRequiredReady(state);
  const gpPerformanceMetrics = [
    ["TVPI", "3.1x", "marked portfolio value"],
    ["Gross IRR", "39%", "realized + marked"],
    ["Companies backed", "5,000+", "batch portfolio"],
    ["Follow-on rate", "64%", "institutional follow-on"],
  ];
  const gpTrackRecordRows = [
    ["Batch companies", "5,000+", "total companies backed across all batches"],
    ["Follow-on rate", "64%", "companies with institutional follow-on investment"],
    ["Partner attribution", "Batch selection / founder sourcing / follow-on support", ""],
    ["Loss ratio", "Power-law driven", "high-dispersion seed portfolio"],
  ];
  const gpPipelineRows = [
    {
      id: "tier-1-family-office",
      lp: "Tier 1 Family Office",
      context: "West Coast • typical check $2M-$5M",
      type: "Family Office",
      geography: "West Coast",
      stage: "Active diligence",
      daysInStage: 9,
      fit: 84,
      fitTone: "green",
      fitSummary: "Strong fit driven by strategy overlap, check size alignment, and appetite for early-stage applied AI.",
      fitBreakdown: [
        ["Strategy", 92],
        ["Check size", 86],
        ["Stage", 80],
        ["Geography", 78],
        ["Risk profile", 74],
        ["Sector appetite", 88],
      ],
      engagementScore: 72,
      engagementLabel: "High",
      engagementTrend: "Rising",
      engagementDetail: "Viewed track record twice this week",
      viewed: [
        ["Overview", "2x"],
        ["Track record", "2x"],
        ["Case study", "1x"],
        ["References", "No"],
      ],
      probability: 68,
      probabilityMove: "Up from 57% last week",
      estimatedCheck: "$3.5M",
      estimatedCheckValue: 3.5,
      expectedValue: "$2.38M",
      expectedValueValue: 2.38,
      status: "Rising",
      statusReason: "Repeat track record views + new reference request",
      blockers: ["Founder references missing", "Attribution appendix incomplete"],
      request: "Founder reference pack",
      urgency: "High",
      evAtRisk: "$2.38M",
      next: "Send founder references within 48 hours",
      whyNow: "Repeat data room engagement after track record upload",
      impact: "+9 pts commit probability",
      probabilityLift: "68% -> 77%",
      evLift: "+$315K EV",
      milestone: "Partner discussion",
      lastAction: "Requested references",
      spendTime: "Yes",
      tone: "green",
    },
    {
      id: "institutional-endowment",
      lp: "Institutional Endowment",
      context: "University-backed • typical check $3M-$7M",
      type: "Endowment",
      geography: "Northeast",
      stage: "Active diligence",
      daysInStage: 14,
      fit: 81,
      fitTone: "green",
      fitSummary: "Strong mandate fit, but risk controls and downside case are now the gating items.",
      fitBreakdown: [
        ["Strategy", 88],
        ["Check size", 84],
        ["Stage", 76],
        ["Geography", 82],
        ["Risk profile", 68],
        ["Sector appetite", 86],
      ],
      engagementScore: 54,
      engagementLabel: "Medium",
      engagementTrend: "Falling",
      engagementDetail: "DDQ opened, no follow-up in 6 days",
      viewed: [
        ["Overview", "3x"],
        ["Track record", "1x"],
        ["Case study", "0x"],
        ["References", "No"],
      ],
      probability: 44,
      probabilityMove: "Down 8 pts after stalled review",
      estimatedCheck: "$5.0M",
      estimatedCheckValue: 5,
      expectedValue: "$2.20M",
      expectedValueValue: 2.2,
      status: "Blocked",
      statusReason: "Downside case not uploaded",
      blockers: ["Downside case memo missing", "Prefers stronger realized attribution"],
      request: "Downside case memo",
      urgency: "High",
      evAtRisk: "$2.2M",
      next: "Send downside case before IC prep",
      whyNow: "Requested downside case this week",
      impact: "+11 pts commit probability",
      probabilityLift: "44% -> 55%",
      evLift: "+$550K EV",
      milestone: "IC prep review",
      lastAction: "Requested downside case",
      spendTime: "Yes, if resolved this week",
      tone: "amber",
    },
    {
      id: "mission-foundation",
      lp: "Mission-aligned Foundation",
      context: "Healthcare outcomes • typical check $750K-$2M",
      type: "Foundation",
      geography: "US",
      stage: "First meeting",
      daysInStage: 5,
      fit: 73,
      fitTone: "accent",
      fitSummary: "Good healthcare software overlap, but foundation mandate needs clearer outcome reporting.",
      fitBreakdown: [
        ["Strategy", 78],
        ["Check size", 72],
        ["Stage", 70],
        ["Geography", 88],
        ["Risk profile", 66],
        ["Sector appetite", 75],
      ],
      engagementScore: 46,
      engagementLabel: "Medium",
      engagementTrend: "Flat",
      engagementDetail: "Deck opened once; no data room expansion yet",
      viewed: [
        ["Overview", "1x"],
        ["Track record", "0x"],
        ["Case study", "0x"],
        ["References", "No"],
      ],
      probability: 36,
      probabilityMove: "Flat week over week",
      estimatedCheck: "$1.2M",
      estimatedCheckValue: 1.2,
      expectedValue: "$432K",
      expectedValueValue: 0.432,
      status: "Watching",
      statusReason: "Early engagement, not yet enough signal",
      blockers: ["Impact reporting not reviewed", "Needs healthcare case study"],
      request: "Healthcare outcome summary",
      urgency: "Medium",
      evAtRisk: "$432K",
      next: "Send healthcare outcome detail",
      whyNow: "Moved from overview to mandate fit screen",
      impact: "+5 pts commit probability",
      probabilityLift: "36% -> 41%",
      evLift: "+$60K EV",
      milestone: "Second meeting",
      lastAction: "Intro call completed",
      spendTime: "Selective",
      tone: "accent",
    },
    {
      id: "emerging-manager-fof",
      lp: "Pioneer Fund-of-Funds LP",
      context: "National FoF • typical check $1M-$3M",
      type: "FoF",
      geography: "US",
      stage: "Watching",
      daysInStage: 18,
      fit: 69,
      fitTone: "amber",
      fitSummary: "Emerging-manager appetite is real, but portfolio construction questions are weakening conversion.",
      fitBreakdown: [
        ["Strategy", 72],
        ["Check size", 80],
        ["Stage", 64],
        ["Geography", 84],
        ["Risk profile", 58],
        ["Sector appetite", 66],
      ],
      engagementScore: 31,
      engagementLabel: "Low",
      engagementTrend: "Falling",
      engagementDetail: "No room activity in 8 days",
      viewed: [
        ["Overview", "1x"],
        ["Track record", "0x"],
        ["Case study", "0x"],
        ["References", "No"],
      ],
      probability: 28,
      probabilityMove: "Down 12 pts from inactivity",
      estimatedCheck: "$2.0M",
      estimatedCheckValue: 2,
      expectedValue: "$560K",
      expectedValueValue: 0.56,
      status: "Cooling",
      statusReason: "No activity in 8 days",
      blockers: ["Ownership reserve model unclear", "Benchmark alignment not shown"],
      request: "Portfolio construction memo",
      urgency: "Medium",
      evAtRisk: "$560K",
      next: "Reframe ownership reserve model",
      whyNow: "Engagement dropped after portfolio construction review",
      impact: "+7 pts commit probability",
      probabilityLift: "28% -> 35%",
      evLift: "+$140K EV",
      milestone: "Re-engagement",
      lastAction: "Viewed fund terms",
      spendTime: "Only after higher-EV items",
      tone: "red",
    },
    {
      id: "university-mandate",
      lp: "University Emerging Manager Mandate",
      context: "University-affiliated • typical check $2M-$4M",
      type: "Endowment",
      geography: "Midwest",
      stage: "Partner discussion",
      daysInStage: 6,
      fit: 88,
      fitTone: "green",
      fitSummary: "Best fit for Fund I profile with high emerging-manager appetite and strong check-size alignment.",
      fitBreakdown: [
        ["Strategy", 90],
        ["Check size", 91],
        ["Stage", 86],
        ["Geography", 80],
        ["Risk profile", 78],
        ["Sector appetite", 92],
      ],
      engagementScore: 76,
      engagementLabel: "Very High",
      engagementTrend: "Rising",
      engagementDetail: "Partner memo viewed; second meeting scheduled",
      probability: 79,
      probabilityMove: "Up 10 pts after partner memo view",
      estimatedCheck: "$3.0M",
      estimatedCheckValue: 3,
      expectedValue: "$2.37M",
      expectedValueValue: 2.37,
      status: "High conviction",
      statusReason: "Repeat case-study and partner memo engagement",
      blockers: ["IC date not confirmed", "Attribution appendix still partial"],
      request: "Partner meeting agenda",
      urgency: "High",
      evAtRisk: "$2.37M",
      next: "Push partner meeting this week",
      whyNow: "Reviewed team section twice in 48 hours",
      impact: "+8 pts commit probability",
      probabilityLift: "79% -> 87%",
      evLift: "+$240K EV",
      milestone: "Anchor discussion",
      lastAction: "Partner memo viewed",
      viewed: [
        ["Overview", "4x"],
        ["Track record", "3x"],
        ["Case study", "2x"],
        ["References", "Partial"],
      ],
      spendTime: "Yes, top priority",
      tone: "green",
    },
  ];
  const dataRoomLpViews = [
    ["Cedar Grove Family Office", "Tier 3", "Opened deck 2x", "6 min on track record", "Case studies unlock after 2nd meeting"],
    ["University Endowment", "Tier 2", "Opened DDQ", "Attribution viewed", "Full room unlock requires reveal approval"],
    ["Blue Lake Foundation", "Tier 2", "Deck opened once", "No track record open", "Impact reporting requested"],
    ["Launchpad Fund of Funds", "Tier 1", "Teaser only", "No data room open", "Unlock after ownership model review"],
  ];
  const weeklyReportActions = [
    "Send attribution memo to University Endowment",
    "Upload founder references for Pacific IC prep",
    "Push partner meeting with Northgate University",
  ];

  const requestMatch = (match) => {
    if (!readyToRequest) {
      showToast("Complete profile, fund profile, and pitch deck before requesting matches", "error");
      return;
    }
    if (!match.requestable) {
      showToast("This opportunity is below the request threshold", "info");
      return;
    }
    const existing = state.matchRequests.find((request) => request.matchId === match.id && !request.lpOnly);
    if (existing) {
      showToast(`Request already ${existing.status.toLowerCase()}`, "info");
      return;
    }

    const nextRequest = {
      id: `req-${match.id}`,
      matchId: match.id,
      gpName: state.fundProfile.fundName,
      firmName: state.gpProfile.firmName,
      fundSize: state.fundProfile.targetFundSize,
      strategy: state.fundProfile.strategy,
      generation: state.fundProfile.fundGeneration,
      sectors: state.fundProfile.sectors,
      score: match.score,
      status: "Pending",
      requestedAt: "Just now",
      source: "GP requested match",
      readiness: state.fundProfile.readinessScore,
      snapshot: `${state.fundProfile.fundName} — ${state.fundProfile.strategy}, ${state.fundProfile.geography}. Raising ${state.fundProfile.targetFundSize}, ${state.fundProfile.raisedToDate} committed.`,
      feedback: "",
      docs: state.documents.required.map((doc) => [doc.name, doc.status]),
    };

    updateState((prev) => ({
      ...prev,
      matchRequests: [nextRequest, ...prev.matchRequests],
    }));
    setSelectedMatchId(match.id);
    setPage("requests");
    showToast("Match request sent to LP workflow", "success");
  };

  const resetDemo = () => {
    resetState();
    setPage("overview");
    setSelectedMatchId(MARKETPLACE_PRIMARY_MATCH_ID);
    setSelectedPipelineId("tier-1-family-office");
    showToast("Workflow reset", "info");
  };

  const nav = [
    { id: "overview", label: "Home", icon: "HM" },
    { id: "profile", label: "Fund Profile", icon: "FD" },
    { id: "matches", label: "LP Matches", icon: "LM", badge: state.matches.filter((match) => match.requestable).length },
    { id: "documents", label: "LP Packet", icon: "PK" },
    { id: "requests", label: "Reveal Requests", icon: "RQ", badge: pendingCount || (approvedRequest ? 1 : 0) },
    { id: "room", label: "Decision Room", icon: "DR", badge: activeRoom ? 1 : 0 },
    { id: "intelligence", label: "Market Intelligence", icon: "MI" },
  ];
  const gpActiveStep =
    page === "profile"
      ? 0
      : page === "documents" || page === "overview" || page === "pipeline"
      ? 1
      : page === "matches" || page === "engine" || page === "narrative" || page === "intelligence"
      ? 2
      : page === "requests" || page === "room"
      ? 3
      : 1;

  const shell = (content) => (
    <MPDemoShell
      user={user}
      roleLabel="GP"
      account={state.gpProfile.firmName}
      page={page}
      setPage={setPage}
      nav={nav}
      topStatus=""
      activeStep={gpActiveStep}
      contextLabel={state.fundProfile.fundName}
      statusMetric={`${state.fundProfile.readinessScore}% fundraising ready`}
      onLogout={onLogout}
      onReset={resetDemo}
    >
      {content}
      <MPDetailModal detail={detail} onClose={() => setDetail(null)} />
    </MPDemoShell>
  );

  const inspectMatch = (match) => {
    const scoreDrivers = {
      [MARKETPLACE_PRIMARY_MATCH_ID]: ["Strategy 94", "Check size 91", "Sector overlap 90", "Evidence gap -8"],
      "match-family-office-climate": ["Climate overlap 93", "Flexible check size 88", "Reference tolerance 86", "Legal summary -5"],
      "match-foundation-health": ["Healthcare mandate 90", "Impact reporting 84", "Fund size 82", "Outcome proof -6"],
      "match-fof-seed": ["Seed access 82", "Global mandate 80", "Track record proof 78", "Ownership model -4"],
      "match-ocio-emerging": ["Emerging manager appetite 92", "Vertical SaaS 90", "Attribution accepted 88", "Benchmark memo -3"],
    };
    setDetail({
      kicker: "Anonymous LP opportunity",
      title: match.lpAlias,
      subtitle: `${match.lpType} · ${match.aumBand} AUM · ${match.mandate}`,
      chips: [match.checkRange, match.geography, ...match.sectors],
      rows: [
        ["Fit score", String(match.score)],
        ["Request threshold", String(match.threshold)],
        ["LP type", match.lpType],
        ["Mandate", match.mandate],
        ["Target check", match.checkRange],
      ],
      sections: [
        { title: "Score construction", items: scoreDrivers[match.id] || [`Mandate fit ${match.score}`, `Threshold ${match.threshold}`, "Manual IC review required"] },
        { title: "Why this fits", items: match.why },
        { title: "What could block approval", tone: "warn", items: match.blockers },
        { title: "Recommended next step", items: match.nextActions || [] },
      ],
    });
  };

  if (page === "room") {
    return shell(
      <MarketplaceWorkflowRoom
        state={state}
        updateState={updateState}
        role="gp"
        matchId={approvedRequest?.matchId || activeRoom?.matchId}
        onBack={() => setPage("requests")}
      />
    );
  }

  if (page === "engine") {
    const weightTotal = Object.values(matchWeights).reduce((sum, value) => sum + Number(value || 0), 0) || 1;
    const engineSignals = [
      ["strategy", "Strategy fit", "Early-stage venture", "Emerging VC / innovation sleeve", matchWeights.strategy],
      ["sector", "Sector overlap", "AI infrastructure, healthcare, climate", "Allocator mandate sectors", matchWeights.sector],
      ["checkSize", "Check sizing", "$500K-$2M target check", "$500K-$5M preferred range", matchWeights.checkSize],
      ["geography", "Geography", "US / select EU", "North America / approved global", matchWeights.geography],
    ];
    const readinessSignals = [
      ["Fund profile", "Complete", "green"],
      ["Pitch deck", "Ready", "green"],
      ["DDQ", "70% complete", "amber"],
      ["Attribution memo", "Needs detail", "amber"],
      ["Founder references", "Missing", "amber"],
      ["Terms summary", "Complete", "green"],
    ];
    const engineRows = state.matches
      .map((match) => {
        const sectorOverlap = match.sectors.filter((sector) => state.fundProfile.sectors.includes(sector)).length;
        const sectorScore = Math.min(100, 62 + sectorOverlap * 12);
        const strategyScore = match.mandate.toLowerCase().includes("emerging") || match.mandate.toLowerCase().includes("venture") ? 94 : 72;
        const checkScore = match.checkRange.includes("$1M") || match.checkRange.includes("$500K") ? 88 : match.checkRange.includes("$2M") ? 76 : 46;
        const geoScore = match.geography.includes("North America") || match.geography.includes("US") ? 90 : 66;
        const weightedScore = Math.round(
          (strategyScore * matchWeights.strategy +
            sectorScore * matchWeights.sector +
            checkScore * matchWeights.checkSize +
            geoScore * matchWeights.geography) /
            weightTotal
        );
        const readinessPenalty = match.blockers.length > 1 ? 5 : 2;
        const engineScore = Math.max(0, Math.min(99, Math.round(weightedScore * 0.72 + match.score * 0.28 - readinessPenalty)));
        return {
          ...match,
          strategyScore,
          sectorScore,
          checkScore,
          geoScore,
          engineScore,
          gate: engineScore >= match.threshold && match.requestable ? "Reveal eligible" : engineScore >= match.threshold ? "Packet review" : "Hold",
          constraint: match.blockers[0] || "No blocker",
        };
      })
      .sort((a, b) => b.engineScore - a.engineScore);
    const leadEngineMatch = engineRows[0];
    const setWeight = (key, value) => {
      setMatchWeights((prev) => ({ ...prev, [key]: Number(value) }));
    };
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Match Engine"
            title="Match Engine"
            right={<MPButton onClick={() => setPage("matches")}>View LP Matches</MPButton>}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard
            style={{
              padding: 0,
              overflow: "hidden",
              background: MP.panel,
              borderColor: "rgba(123,111,232,.26)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) 300px", minHeight: 256 }}>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.label, color: MP.accent }}>
                    <MPStatusDot tone="accent" />
                    Highest confidence match
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 18, alignItems: "start", marginTop: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: MP.text, fontSize: 17, fontWeight: 640, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {leadEngineMatch.lpAlias}
                      </div>
                      <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.45, marginTop: 7 }}>
                        {leadEngineMatch.lpType} · {leadEngineMatch.aumBand} AUM · {leadEngineMatch.mandate}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="marketplace-mono" style={{ color: MP.green, fontSize: 28, fontWeight: 520, lineHeight: 1 }}>
                        {leadEngineMatch.engineScore}
                      </div>
                      <div style={{ ...MP_TYPE.label, marginTop: 5 }}>Engine score</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
                  {[
                    ["Potential LPs", String(engineRows.length), "neutral"],
                    ["Gate", leadEngineMatch.gate, "green"],
                    ["Expected check", leadEngineMatch.checkRange, "neutral"],
                    ["Blocker", leadEngineMatch.constraint, "amber"],
                  ].map(([label, value, tone]) => (
                    <div key={label} style={{ borderTop: `1px solid ${MP.line}`, paddingTop: 10, minWidth: 0 }}>
                      <div style={MP_TYPE.label}>{label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowTitle, marginTop: 6, overflow: "hidden" }}>
                        {tone !== "neutral" && <MPStatusDot tone={tone} />}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${MP.line}`, background: MP.panel2, padding: 18, display: "flex", flexDirection: "column" }}>
                <div style={MP_TYPE.label}>Signal stack</div>
                {[
                  ["Strategy", leadEngineMatch.strategyScore],
                  ["Sector", leadEngineMatch.sectorScore],
                  ["Check", leadEngineMatch.checkScore],
                  ["Geo", leadEngineMatch.geoScore],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
                      <span style={MP_TYPE.rowTitle}>{label}</span>
                      <span className="marketplace-mono" style={MP_TYPE.number}>{value}</span>
                    </div>
                    <MPProgress value={value} color={value >= 85 ? MP.green : MP.accent} />
                  </div>
                ))}
              </div>
            </div>
          </MPCard>
        </div>

        <div className="marketplace-overview-span-8">
          <MPDeskPanel title="Ranked LP Output" style={{ height: 640, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr) 70px 112px minmax(116px,.42fr)", gap: 12, paddingBottom: 8 }}>
              {["#", "LP", "Score", "Decision", "Primary blocker"].map((column) => (
                <span key={column} style={MP_TYPE.label}>{column}</span>
              ))}
            </div>
            <div style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
            {engineRows.slice(0, 14).map((match, index) => (
              <button
                key={match.id}
                type="button"
                onClick={() => {
                  setSelectedMatchId(match.id);
                  setPage("matches");
                }}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "32px minmax(0,1fr) 70px 112px minmax(116px,.42fr)",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 0",
                  border: "none",
                  borderTop: `1px solid ${MP.line}`,
                  background: "transparent",
                  color: MP.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 11 }}>{index + 1}</span>
                <MPLpNameCell title={match.lpAlias} meta={`${match.lpType} · ${match.checkRange}`} />
                <MPNumberCell value={match.engineScore} color={match.engineScore >= 85 ? MP.green : match.engineScore >= 75 ? MP.text : MP.muted} />
                <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
                  <MPStatusDot tone={match.gate === "Reveal eligible" ? "green" : match.gate === "Packet review" ? "amber" : "neutral"} />
                  {match.gate}
                </span>
                <span style={{ ...MP_TYPE.rowMeta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {match.constraint}
                </span>
              </button>
            ))}
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4" style={{ display: "grid", gap: 12 }}>
          <MPDeskPanel title="Scoring Weights" style={{ height: 314 }}>
            {engineSignals.map(([key, label, fundValue, lpValue, weight]) => (
              <div key={key} style={{ padding: "7px 0", borderTop: `1px solid ${MP.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <span style={MP_TYPE.rowTitle}>{label}</span>
                  <span className="marketplace-mono" style={MP_TYPE.number}>{weight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={weight}
                  onChange={(event) => setWeight(key, event.target.value)}
                  style={{ width: "100%", accentColor: MP.accent }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 8, marginTop: 4 }}>
                  <span style={{ ...MP_TYPE.rowMeta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fundValue}</span>
                  <span style={{ ...MP_TYPE.rowMeta, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lpValue}</span>
                </div>
              </div>
            ))}
          </MPDeskPanel>
          <MPDeskPanel title="Readiness Gate" style={{ height: 314 }}>
            {readinessSignals.map(([label, status, tone]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 104px", ...MP_COMPACT_ROW_BASE }}>
                <span style={MP_TYPE.rowTitle}>{label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
                  <MPStatusDot tone={tone} />
                  {status}
                </span>
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
              <MPDataRow label="Gate result" value={leadEngineMatch.gate} />
              <MPDataRow label="Blocking item" value={leadEngineMatch.constraint} />
            </div>
          </MPDeskPanel>
        </div>

      </div>
    );
  }

  if (page === "profile") {
    const profileRows = [
      ["Strategy", state.fundProfile.strategy, "Terms v3.2", "Today 9:12 AM", "LP-visible"],
      ["Geography", state.fundProfile.geography, "Profile v2.8", "Yesterday", "LP-visible"],
      ["Check sought", state.fundProfile.checkSought, "Terms v3.2", "Today 9:12 AM", "LP-visible"],
      ["Minimum", state.fundProfile.minimumCommitment, "LPA draft", "Apr 8", "Room-only"],
      ["Target", state.fundProfile.targetFundSize, "Raise plan v4", "Apr 8", "LP-visible"],
      ["Raised", state.fundProfile.raisedToDate, "CRM sync", "18m ago", "Internal"],
      ["Readiness", `${state.fundProfile.readinessScore}% fundraising ready`, "Readiness run", "42m ago", "Internal"],
      ["Close timeline", state.fundProfile.closeTimeline, "Raise plan v4", "Apr 7", "LP-visible"],
    ];
    const selectedProfileRow = profileRows[5];
    const teamRows = state.gpProfile.team.map((member, index) => {
      const [name, role] = member.split(",");
      return [
        name,
        role?.trim() || "Partner",
        index < 2 ? "Allocator-facing" : index < 4 ? "Attribution support" : "Founder reference support",
        index < 2 ? "Team bio v2.1" : "Reference index",
        index < 3 ? "LP-visible" : "Room-only",
        index === 0 ? "Viewed by LP 2h ago" : index === 1 ? "Bio updated Apr 8" : "No unread changes",
      ];
    });
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Manager profile"
            title="Fund Profile Ledger"
            right={<MPButton onClick={() => setPage("documents")}>Open Packet</MPButton>}
          />
        </div>
        <div className="marketplace-overview-span-8">
          <MPDeskPanel title="Fund Terms Table" kicker="Versioned, permissioned, allocator-visible fields" style={{ minHeight: 520 }}>
            <MPTableHeader columns={["Field", "Value", "Version", "Last edit", "Visibility"]} template="118px minmax(0,1.2fr) 108px 116px 96px" />
            {profileRows.map((row, index) => (
              <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "118px minmax(0,1.2fr) 108px 116px 96px", ...MP_ROW_BASE, minHeight: 51 }}>
                <span style={MP_TYPE.label}>{row[0]}</span>
                <span className={index >= 3 && index <= 5 ? "marketplace-mono" : undefined} style={{ ...MP_TYPE.rowTitle, fontWeight: 540 }}>{row[1]}</span>
                <span style={MP_TYPE.rowMeta}>{row[2]}</span>
                <span style={MP_TYPE.rowMeta}>{row[3]}</span>
                <MPPill tone={row[4] === "LP-visible" ? "green" : row[4] === "Room-only" ? "accent" : "neutral"}>{row[4]}</MPPill>
              </div>
            ))}
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Selected Field" kicker={selectedProfileRow[0]} style={{ minHeight: 520 }}>
            <MPDataRow label="Current value" value={selectedProfileRow[1]} mono />
            <MPDataRow label="Source" value={selectedProfileRow[2]} />
            <MPDataRow label="Last edit" value={selectedProfileRow[3]} />
            <MPDataRow label="Permission" value={selectedProfileRow[4]} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, marginBottom: 7 }}>Audit trail</div>
              {[
                ["18m ago", "CRM sync updated raised-to-date amount", "System"],
                ["Today 9:12 AM", "Siobhan reviewed fund terms source", "Siobhan Roy"],
                ["Yesterday", "LP-visible packet rebuilt from latest terms", "Kendall Roy"],
                ["Apr 8", "Finance locked minimum commitment field", "Finance"],
              ].map(([time, event, actor]) => (
                <div key={`${time}-${event}`} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr)", gap: 10, padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <span className="marketplace-mono" style={MP_TYPE.rowMeta}>{time}</span>
                  <span style={{ color: MP.soft, fontSize: 12.1, lineHeight: 1.35 }}>{event} · {actor}</span>
                </div>
              ))}
            </div>
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-12">
          <MPDeskPanel title="Team / Attribution Ledger" kicker="Decision-makers, source files, permissions, last activity">
            <MPTableHeader columns={["Team member", "Role", "Coverage", "Source doc", "Permission", "Last activity"]} template="minmax(0,1fr) 156px minmax(0,1fr) 130px 100px 150px" />
            {teamRows.map(([name, role, coverage, source, permission, activity]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 156px minmax(0,1fr) 130px 100px 150px", ...MP_ROW_BASE }}>
                <span style={MP_TYPE.rowTitle}>{name}</span>
                <span style={MP_TYPE.rowMeta}>{role}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{coverage}</span>
                <span style={MP_TYPE.rowMeta}>{source}</span>
                <MPPill tone={permission === "LP-visible" ? "green" : "accent"}>{permission}</MPPill>
                <span style={MP_TYPE.rowMeta}>{activity}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (page === "pipeline") {
    const rankedPipeline = gpPipelineRows
      .slice()
      .sort((a, b) => b.expectedValueValue - a.expectedValueValue);
    const selectedPipeline =
      rankedPipeline.find((row) => row.id === selectedPipelineId) || rankedPipeline[0];
    const stageFunnel = [
      ["Watching", 2, "$3.2M", "Low-signal paths"],
      ["First meeting", 1, "$1.2M", "Still qualifying"],
      ["Active diligence", 2, "$8.5M", "Packet-sensitive capital"],
      ["Partner discussion", 1, "$3.0M", "Highest-quality near-term path"],
    ];
    const requestRows = rankedPipeline.filter((row) => row.request);
    const atRiskRows = rankedPipeline.filter((row) =>
      ["Blocked", "Cooling", "At risk"].includes(row.status) || row.engagementTrend === "Falling"
    );
    const leverageMoves = rankedPipeline
      .slice()
      .sort((a, b) => {
        const leverageScore = (row) =>
          row.expectedValueValue * 10 +
          (row.request ? 4 : 0) +
          (row.urgency === "High" ? 4 : row.urgency === "Medium" ? 2 : 0) +
          (row.engagementTrend === "Rising" ? 2 : row.engagementTrend === "Falling" ? -1 : 0);
        return leverageScore(b) - leverageScore(a);
      })
      .slice(0, 3);
    const totalExpectedClose = rankedPipeline.reduce(
      (sum, row) => sum + row.expectedValueValue,
      0
    );
    const readyNowCount = rankedPipeline.filter(
      (row) => row.probability >= 55 && row.status !== "Blocked"
    ).length;
    const partnerStageCount = rankedPipeline.filter((row) =>
      ["Active diligence", "Partner discussion"].includes(row.stage)
    ).length;
    const pressureCapital = atRiskRows.reduce(
      (sum, row) => sum + row.expectedValueValue,
      0
    );
    const topFitDrivers = selectedPipeline.fitBreakdown
      .slice()
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const lpTableTemplate = "32px minmax(0,1.7fr) 48px 52px 64px minmax(0,.95fr)";
    return shell(
      <div style={{ display: "grid", gap: 16 }}>
      <MPPageHeader
        eyebrow="Pipeline"
        title="Priority LPs"
        right={<MPButton size="sm" variant="secondary" onClick={() => setPage("overview")}>Home</MPButton>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 272px", gap: 12, alignItems: "stretch" }}>
        {/* Queue table */}
        <MPDeskPanel title="Priority LPs" style={{ height: 660, overflow: "hidden" }}>
          <MPTableHeader columns={["#", "Investor", "Fit", "Prob", "EV", "Next action"]} template={lpTableTemplate} />
          <div style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
          {rankedPipeline.map((row, i) => {
            const active = selectedPipeline?.id === row.id;
            return (
              <MPTableButtonRow
                key={row.id}
                onClick={() => setSelectedPipelineId(row.id)}
                active={active}
                template={lpTableTemplate}
              >
                <span className="marketplace-mono" style={{ fontSize: 11, color: MP.muted }}>{i + 1}</span>
                <MPLpNameCell title={row.lp} meta={row.stage} />
                <MPNumberCell value={row.fit} color={MP.accent} />
                <MPNumberCell value={`${row.probability}%`} color={row.probability >= 65 ? MP.green : MP.text} />
                <MPNumberCell value={row.expectedValue} />
                <span style={{ fontSize: 11.5, color: MP.soft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.next}</span>
              </MPTableButtonRow>
            );
          })}
          </div>
        </MPDeskPanel>

        {/* Selected investor detail */}
        <MPDeskPanel title={selectedPipeline.lp} style={{ height: 660 }}>
          <div style={{ fontSize: 11, color: MP.soft, marginBottom: 12 }}>{selectedPipeline.stage} · {selectedPipeline.type}</div>
          <MPDataRow label="Fit" value={String(selectedPipeline.fit)} />
          <MPDataRow label="Prob." value={`${selectedPipeline.probability}%`} />
          <MPDataRow label="EV" value={selectedPipeline.expectedValue} />
          <MPDataRow label="Days in stage" value={String(selectedPipeline.daysInStage)} />
          <MPDataRow label="Status" value={selectedPipeline.statusReason} />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MP.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Action required</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: MP.text, lineHeight: 1.45, marginBottom: 8 }}>{selectedPipeline.request || selectedPipeline.next}</div>
            <div style={{ fontSize: 11.5, color: MP.soft, lineHeight: 1.45 }}>{selectedPipeline.probabilityLift} · {selectedPipeline.evLift}</div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
            <div style={{ ...MP_TYPE.label, marginBottom: 4 }}>Fit drivers</div>
            {topFitDrivers.map(([label, value]) => (
              <MPDataRow key={label} label={label} value={`${value}/100`} mono />
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
            <div style={{ ...MP_TYPE.label, marginBottom: 4 }}>Open blockers</div>
            {(selectedPipeline.blockers || []).slice(0, 3).map((blocker) => (
              <div key={blocker} style={{ padding: "7px 0", borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 12.1, lineHeight: 1.38 }}>
                {blocker}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", paddingTop: 12, display: "grid", gap: 8 }}>
            <MPButton onClick={() => setPage("documents")} style={{ width: "100%" }}>Resolve Gap</MPButton>
            <MPButton variant="secondary" onClick={() => setPage("overview")} style={{ width: "100%" }}>Home</MPButton>
          </div>
        </MPDeskPanel>
      </div>
      </div>
    );
  }

  if (page === "documents") {
    const toggleDoc = (group, id) => {
      updateState((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [group]: prev.documents[group].map((doc) =>
            doc.id === id ? { ...doc, visible: !doc.visible } : doc
          ),
        },
      }));
    };

    const requiredDocs = state.documents.required;
    const recommendedDocs = state.documents.optional.filter((doc) => doc.visible);
    const lockedDocs = state.documents.optional.filter((doc) => !doc.visible);
    const dataRoomTabs = [
      ["documents", "Documents", "Files"],
      ["overview", "Overview", "First look"],
      ["track", "Track Record", "Deal-level proof"],
      ["case", "Case Study", "QuantumX"],
      ["team", "Team", "Why us"],
      ["strategy", "Strategy", "Tight thesis"],
      ["references", "References", "Proof calls"],
    ];
    const activeDataRoomTab =
      dataRoomTabs.find(([id]) => id === dataRoomSection) || dataRoomTabs[0];
    const fundFacts = [
      ["Target Fund Size", "$50M"],
      ["Stage", "Fund I (Emerging Manager)"],
      ["Strategy", "Early-stage venture"],
      ["Check Size", "$500k-$2M"],
      ["Ownership Target", "5-12%"],
      ["Geography", "US / select EU"],
    ];
    const fundTerms = [
      ["Fund Life", "10 years"],
      ["First Close Target", "$15-20M"],
      ["GP Commitment", "$1.5M (3%)"],
      ["Fees / Carry", "2% / 20%"],
      ["Deployment Period", "3-4 years"],
    ];
    const whereWeWin = [
      ["Sourcing Edge", "Proprietary founder network across AI operators and technical communities."],
      ["Selection Edge", "Focus on commercial readiness, not just technical novelty."],
      ["Execution Edge", "Hands-on operator support in GTM and early scaling."],
    ];
    const whatWeDoNotDo = [
      "No pre-seed or idea-stage investments.",
      "No capital-intensive hardware or deep R&D bets.",
      "No generalist or opportunistic deals.",
    ];
    const tractionProof = [
      ["8", "investments sourced pre-fund"],
      ["2", "companies at Series A"],
      ["1", "realized exit"],
      ["200+", "founder relationships"],
    ];
    const pipelineSnapshot = [
      ["120", "deals reviewed in last 6 months"],
      ["15", "active conversations"],
      ["5", "strong near-term opportunities"],
    ];
    const trackRecordDeals = [
      {
        company: "QuantumX",
        entry: "$550K",
        current: "$32M",
        moic: "5.8x",
        status: "Unrealized",
        role: "Lead",
      },
      {
        company: "Helios AI",
        entry: "$8M",
        current: "Exit @ $60M",
        moic: "7.5x",
        status: "Realized",
        role: "Sourced",
      },
      {
        company: "NovaTech",
        entry: "$3M",
        current: "$12M",
        moic: "4.0x",
        status: "Unrealized",
        role: "Board",
      },
      {
        company: "SignalForge",
        entry: "$1.2M",
        current: "$18M",
        moic: "6.1x",
        status: "Unrealized",
        role: "Lead",
      },
      {
        company: "MedQuery",
        entry: "$2M",
        current: "Exit @ $28M",
        moic: "4.7x",
        status: "Realized",
        role: "Sourced",
      },
    ];
    const activityRows = [
      {
        lp: "XYZ Family Office",
        status: "Active review",
        tone: "amber",
        events: ["Viewed Track Record 2x", "Time spent: 6 min", "Did not open Case Studies"],
      },
      {
        lp: "ABC Endowment",
        status: "High engagement",
        tone: "green",
        events: ["Opened every section", "Returned to Risk & Downside", "Downloaded DDQ"],
      },
      {
        lp: "Cedar Grove Family Office",
        status: "Tier 3 room",
        tone: "green",
        events: ["Deck opened 2x", "Case studies unlocked", "Reference request pending"],
      },
    ];
    const documentRows = [
      ["Pitch deck", "Ready", "Tier 2", "Visible", "Kendall Roy", "v3.2", "Viewed 4x", "2"],
      ["Fund model", "Ready", "Tier 3", "After reveal", "Finance", "v2.0", "No LP access", "0"],
      ["DDQ", "Ready", "Tier 2", "Visible", "Siobhan Roy", "v4.1", "Opened today", "1"],
      ["Case studies", "Ready", "Tier 3", "After 2nd meeting", "Roman Roy", "v1.6", "Viewed 2x", "3"],
      ["Reference list", "Partial", "Tier 3", "On request", "Gerri Kellman", "v0.9", "Requested", "4"],
      ["Attribution memo", "Ready", "Tier 2", "Visible", "Siobhan Roy", "v1.8", "Reopened 42m ago", "6"],
      ["Portfolio construction", "Ready", "Tier 3", "After reveal", "Finance", "v2.1", "Viewed yesterday", "2"],
      ["Legal terms summary", "Ready", "Tier 2", "Visible", "Counsel", "v1.1", "Locked", "0"],
      ["Founder reference pack", "Partial", "Tier 3", "On request", "Kendall Roy", "v0.7", "Blocking room", "5"],
    ];
    const compactCell = {
      color: MP.muted,
      fontSize: 10.5,
      fontWeight: 780,
      textTransform: "uppercase",
      letterSpacing: 0,
    };
    const sectionTitle = {
      color: MP.text,
      fontSize: 17,
      fontWeight: 760,
      lineHeight: 1.15,
      margin: 0,
    };
    const renderMetric = ([label, value], tone = "neutral") => (
      <div
        key={label}
        style={{
          padding: 14,
          borderRadius: MP.radius.md,
          background: MP.panel2,
          border: `1px solid ${MP.line}`,
          minWidth: 0,
        }}
      >
        <div style={compactCell}>{label}</div>
        <div
          className="marketplace-mono"
          style={{
            color: tone === "green" ? MP.green : tone === "accent" ? MP.accent : MP.text,
            fontSize: 17,
            fontWeight: 640,
            marginTop: 8,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
      </div>
    );
    const renderDataRoomContent = () => {
      if (dataRoomSection === "track") {
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div style={compactCell}>Deal-level clarity</div>
              <h3 style={sectionTitle}>Track Record</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 640 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(140px,1.3fr) 84px 118px 76px 110px 84px",
                    gap: 12,
                    paddingBottom: 9,
                    ...compactCell,
                  }}
                >
                  <span>Company</span>
                  <span>Entry</span>
                  <span>Current</span>
                  <span>MOIC</span>
                  <span>Status</span>
                  <span>Role</span>
                </div>
                {trackRecordDeals.map((deal) => (
                  <div
                    key={deal.company}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(140px,1.3fr) 84px 118px 76px 110px 84px",
                      gap: 12,
                      alignItems: "center",
                      padding: "13px 0",
                      borderTop: `1px solid ${MP.line}`,
                    }}
                  >
                    <span style={{ color: MP.text, fontSize: 14, fontWeight: 760 }}>{deal.company}</span>
                    <span className="marketplace-mono" style={{ color: MP.soft, fontSize: 13 }}>{deal.entry}</span>
                    <span className="marketplace-mono" style={{ color: MP.text, fontSize: 13 }}>{deal.current}</span>
                    <span className="marketplace-mono" style={{ color: MP.green, fontSize: 17 }}>{deal.moic}</span>
                    <MPPill tone={deal.status === "Realized" ? "green" : "neutral"}>{deal.status}</MPPill>
                    <span style={{ color: MP.soft, fontSize: 13 }}>{deal.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              {[
                ["TVPI", "4.8x"],
                ["DPI", "1.6x"],
                ["Realized / Unrealized", "40% / 60%"],
              ].map((metric) => renderMetric(metric, "green"))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              {[
                ["Sourced", "70%"],
                ["Led", "55%"],
                ["Operator involvement", "High"],
              ].map((metric) => renderMetric(metric, "green"))}
            </div>
          </div>
        );
      }

      if (dataRoomSection === "case") {
        const caseStats = [
          ["Sector", "Quantum simulation infrastructure"],
          ["Stage at Entry", "Seed"],
          ["Entry Check", "$550K"],
          ["Ownership", "7.5%"],
        ];
        const beforeAfter = [
          ["Revenue", "$0", "$2.8M ARR"],
          ["Customers", "0", "4 enterprise"],
          ["Team", "5", "16"],
          ["Valuation", "$5.5M", "$32M"],
        ];
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div style={compactCell}>Deep case study</div>
              <h3 style={sectionTitle}>QuantumX</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
              {caseStats.map(([label, value]) => (
                <div key={label} style={{ padding: 12, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}`, minWidth: 0 }}>
                  <div style={compactCell}>{label}</div>
                  <div style={{ color: MP.text, fontSize: 13.2, fontWeight: 760, lineHeight: 1.25, marginTop: 7 }}>{value}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: 18,
                borderRadius: MP.radius.md,
                background: MP.panel2,
                border: `1px solid ${MP.line}`,
              }}
            >
              <div style={{ color: MP.muted, fontSize: 11, fontWeight: 780, textTransform: "uppercase", marginBottom: 8 }}>
                Investment thesis
              </div>
              <div style={{ color: MP.text, fontSize: 16, fontWeight: 760, lineHeight: 1.4 }}>
                QuantumX was building a simulation layer enabling enterprises to model complex physical systems without requiring full quantum hardware.
              </div>
              <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
                While most capital was flowing into hardware-first approaches, the software infrastructure layer was underfunded despite nearer-term commercial applications.
              </div>
            </div>
            <div className="marketplace-grid-2">
              <MPDeskPanel title="Why We Invested" kicker="Selection edge" fill>
                {[
                  "Gap between research progress and enterprise usability.",
                  "Stanford + national lab technical founding team.",
                  "Early inbound interest from pharma and materials companies.",
                  "Revenue potential before full quantum hardware maturity.",
                ].map((item) => (
                  <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13 }}>
                    {item}
                  </div>
                ))}
              </MPDeskPanel>
              <MPDeskPanel title="How Northstar Operated" kicker="Actions taken" fill>
                {[
                  "Sourced through Stanford / national labs network.",
                  "Led Seed round and set initial pricing.",
                  "Helped recruit CTO with enterprise systems background.",
                  "Introduced 3 early design partners.",
                  "Refined GTM from research-focused to enterprise-first.",
                ].map((item) => (
                  <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13 }}>
                    {item}
                  </div>
                ))}
              </MPDeskPanel>
            </div>
            <div className="marketplace-grid-2">
              <MPDeskPanel title="Key Decisions" kicker="Operating judgment" fill>
                {[
                  "Prioritized enterprise pilots over academic contracts.",
                  "Focused roadmap on commercial simulation tools.",
                  "Structured follow-on to maintain ownership through Series A.",
                ].map((item) => (
                  <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13 }}>
                    {item}
                  </div>
                ))}
              </MPDeskPanel>
              <MPDeskPanel title="Outcome" kicker="Current state" fill>
                <MPDataRow label="Current value" value="$32M" mono />
                <MPDataRow label="MOIC" value="5.8x" mono />
                <MPDataRow label="Status" value="Unrealized" />
                <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
                  Active enterprise deployments across pharma and industrial verticals, with additional pilot conversions expected.
                </div>
              </MPDeskPanel>
            </div>
            <MPDeskPanel title="Before vs After" kicker="Commercial progress" fill>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 110px 130px", gap: 12, paddingBottom: 8, ...compactCell }}>
                <span>Metric</span>
                <span>At entry</span>
                <span>Current</span>
              </div>
              {beforeAfter.map(([metric, entry, current]) => (
                <div key={metric} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 110px 130px", gap: 12, padding: "10px 0", borderTop: `1px solid ${MP.line}`, alignItems: "center" }}>
                  <span style={{ color: MP.text, fontSize: 13.2, fontWeight: 720 }}>{metric}</span>
                  <span className="marketplace-mono" style={{ color: MP.soft, fontSize: 12.5 }}>{entry}</span>
                  <span className="marketplace-mono" style={{ color: MP.green, fontSize: 12.5 }}>{current}</span>
                </div>
              ))}
            </MPDeskPanel>
            <div className="marketplace-grid-2">
              <MPDeskPanel title="What This Proves" kicker="Repeatability" fill>
                {[
                  "Infrastructure layers can monetize before core technology fully matures.",
                  "Technical networks generate differentiated early deal flow.",
                  "Early GTM intervention changes company trajectory.",
                ].map((item) => (
                  <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13 }}>
                    {item}
                  </div>
                ))}
              </MPDeskPanel>
              <MPDeskPanel title="Reference" kicker="Operational involvement" fill>
                <MPDataRow label="CEO" value="Aisha Raman, QuantumX" />
                <MPDataRow label="Phone" value="+1 (415) 555-0148" mono />
                <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
                  Available to speak to Northstar's hiring, GTM, and founder support.
                </div>
              </MPDeskPanel>
            </div>
          </div>
        );
      }

      if (dataRoomSection === "team") {
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div style={compactCell}>30-second credibility</div>
              <h3 style={sectionTitle}>Team</h3>
            </div>
            <div className="marketplace-grid-2">
              {[
                ["Kendall Roy", "Former operator", "Led 8 investments", "AI infrastructure"],
                ["Siobhan Roy", "Platform strategist", "Scaled enterprise partnerships across the portfolio", "Go-to-market"],
              ].map(([name, background, proof, domain]) => (
                <MPDeskPanel key={name} title={name} kicker={background} fill>
                  <MPDataRow label="Proof" value={proof} />
                  <MPDataRow label="Domain" value={domain} />
                </MPDeskPanel>
              ))}
            </div>
            <MPDeskPanel title="Why this team wins" kicker="Repeatability" fill>
              {["Rare technical + operator blend", "Strong sourcing network", "Repeatable commercialization strategy"].map((item) => (
                <div key={item} style={{ padding: "10px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13.5 }}>
                  {item}
                </div>
              ))}
            </MPDeskPanel>
          </div>
        );
      }

      if (dataRoomSection === "strategy") {
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div style={compactCell}>Investment policy</div>
              <h3 style={sectionTitle}>Strategy</h3>
            </div>
            <div className="marketplace-grid-3">
              {[
                ["What we invest in", ["Applied deep tech", "AI infrastructure", "Commercialization-stage software"]],
                ["What we avoid", ["Pure research risk", "Undifferentiated AI apps", "Capital plans without milestones"]],
                ["Why now", ["Enterprise adoption pressure", "Research moving into deployment", "Technical teams need operator capital"]],
              ].map(([title, items]) => (
                <MPDeskPanel key={title} title={title} fill>
                  {items.map((item) => (
                    <div key={item} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13 }}>
                      {item}
                    </div>
                  ))}
                </MPDeskPanel>
              ))}
            </div>
            <MPDeskPanel title="Sourcing" kicker="Access channels" fill>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Founder network", "Research institutions", "Prior portfolio", "Technical operators"].map((item) => (
                  <MPPill key={item} tone="accent">{item}</MPPill>
                ))}
              </div>
            </MPDeskPanel>
            <div className="marketplace-grid-3">
              {[
                ["How we add value", ["Recruiting support for first technical leaders", "Enterprise design partners for early pilots", "GTM help before Series A diligence"]],
                ["Portfolio construction", ["35-45 core positions", "Reserve policy tied to commercial proof", "Ownership maintained through first institutional rounds"]],
                ["Risk discipline", ["No science projects without customer pull", "No unfocused generalist consumer exposure", "Downside case prepared before allocator meetings"]],
              ].map(([title, items]) => (
                <MPDeskPanel key={title} title={title} fill>
                  {items.map((item) => (
                    <div key={item} style={{ padding: "10px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 13, lineHeight: 1.4 }}>
                      {item}
                    </div>
                  ))}
                </MPDeskPanel>
              ))}
            </div>
          </div>
        );
      }

      if (dataRoomSection === "references") {
        const refRows = [
          { type: "Founder", name: "Aisha Raman, QuantumX CEO", note: "Available to speak to sourcing, board value-add, and GTM support.", tier: "Tier 3", access: "Approved" },
          { type: "Founder", name: "Marcus Wei, Helios AI CTO", note: "Available to speak to technical diligence process and co-investment relationship.", tier: "Tier 3", access: "Approved" },
          { type: "Co-investor", name: "Breakthrough Capital (lead, Series A)", note: "Available on request. Confirmed Northstar sourced and led the seed round.", tier: "Tier 2", access: "On request" },
          { type: "Co-investor", name: "Operator Ventures (seed syndicate)", note: "Available after partner intro. Focus on GTM and team operations.", tier: "Tier 2", access: "On request" },
          { type: "LP Reference", name: "Fund I LP (institutional, $2B AUM)", note: "Available after reveal approval. Will speak to reporting quality and GP accessibility.", tier: "Tier 3", access: "Post-reveal" },
          { type: "LP Reference", name: "Fund I LP (family office, $400M AUM)", note: "Available on request. Will speak to co-investment access and communication cadence.", tier: "Tier 3", access: "Post-reveal" },
        ];
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ paddingBottom: 16, borderBottom: `2px solid ${MP.line}`, marginBottom: 4 }}>
              <div style={compactCell}>Attribution & Proof Calls</div>
              <h3 style={sectionTitle}>Reference Pack</h3>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1fr) 80px 110px", gap: 14, paddingBottom: 8, ...compactCell }}>
                <span>Type</span><span>Contact</span><span>Tier</span><span>Access</span>
              </div>
              {refRows.map((ref) => (
                <div key={ref.name} style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1fr) 80px 110px", gap: 14, alignItems: "start", padding: "14px 0", borderTop: `1px solid ${MP.line}` }}>
                  <MPPill tone="neutral">{ref.type}</MPPill>
                  <div>
                    <div style={{ color: MP.text, fontSize: 13.5, fontWeight: 740 }}>{ref.name}</div>
                    <div style={{ color: MP.soft, fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>{ref.note}</div>
                  </div>
                  <span style={{ color: MP.muted, fontSize: 12 }}>{ref.tier}</span>
                  <MPPill tone={ref.access === "Approved" ? "green" : ref.access === "Post-reveal" ? "accent" : "neutral"}>{ref.access}</MPPill>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: MP.muted, textTransform: "uppercase", marginBottom: 8 }}>Reference process</div>
              <div style={{ display: "grid", gap: 6 }}>
                {["All reference calls are coordinated through the platform — no direct email outreach.", "Tier 2 references available after LP identity is confirmed.", "Tier 3 references unlocked after first partner call is completed.", "GP provides 48-hour availability notice for all approved calls."].map(step => (
                  <div key={step} style={{ display: "flex", gap: 10, color: MP.soft, fontSize: 12.5 }}>
                    <span style={{ color: MP.accent, flexShrink: 0 }}>—</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      if (dataRoomSection === "documents") {
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ paddingBottom: 16, borderBottom: `2px solid ${MP.line}`, marginBottom: 4 }}>
              <div style={compactCell}>Attribution File</div>
              <h3 style={sectionTitle}>Documents</h3>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) 78px 70px 96px 110px 70px 124px 58px", gap: 12, paddingBottom: 8, ...compactCell }}>
                <span>Document</span><span>Status</span><span>Tier</span><span>Access</span><span>Owner</span><span>Version</span><span>Last viewed</span><span>Com.</span>
              </div>
              {documentRows.map(([name, status, tier, access, owner, version, lastViewed, comments]) => (
                <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) 78px 70px 96px 110px 70px 124px 58px", gap: 12, alignItems: "center", padding: "13px 0", borderTop: `1px solid ${MP.line}` }}>
                  <span style={{ color: MP.text, fontSize: 14, fontWeight: 740 }}>{name}</span>
                  <MPPill tone={status === "Ready" ? "green" : "amber"}>{status}</MPPill>
                  <span style={{ color: MP.soft, fontSize: 12.5 }}>{tier}</span>
                  <span style={{ color: access === "Visible" ? MP.green : MP.amber, fontSize: 12.5 }}>{access}</span>
                  <span style={{ color: MP.text, fontSize: 12.2 }}>{owner}</span>
                  <span className="marketplace-mono" style={{ color: MP.soft, fontSize: 12 }}>{version}</span>
                  <span style={{ color: MP.soft, fontSize: 12 }}>{lastViewed}</span>
                  <span className="marketplace-mono" style={{ color: MP.text, fontSize: 12 }}>{comments}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <div>
              <div style={compactCell}>LP first view</div>
              {packetEditMode ? (
                <input defaultValue="Northstar Venture Fund I" style={{ fontSize: 20, fontWeight: 820, background: "transparent", border: `1px solid ${MP.accent}`, borderRadius: 6, color: MP.text, padding: "2px 8px", width: "100%" }} />
              ) : (
                <h3 style={{ ...sectionTitle, fontSize: 20 }}>Northstar Venture Fund I</h3>
              )}
            </div>
            <MPPill tone="accent">Fund I Emerging Manager</MPPill>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {fundFacts.map(([label, value], index) => (
              <div
                key={label}
                style={{
                  padding: "10px 11px",
                  borderRadius: MP.radius.md,
                  background: MP.panel2,
                  border: `1px solid ${MP.line}`,
                  minWidth: 0,
                  minHeight: 72,
                }}
              >
                <div style={{ ...compactCell, fontSize: 9.4 }}>{label}</div>
                <div
                  className={index === 0 || index === 3 ? "marketplace-mono" : undefined}
                  style={{
                    color: index === 0 ? MP.accent : MP.text,
                    fontSize: label === "Stage" || label === "Strategy" ? 12.8 : 14.2,
                    fontWeight: 740,
                    lineHeight: 1.2,
                    marginTop: 7,
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: MP.radius.md,
              background: MP.panel2,
              border: `1px solid ${MP.line}`,
            }}
          >
            <div style={compactCell}>Why this fund exists</div>
            <div style={{ color: MP.text, fontSize: 15, lineHeight: 1.4, fontWeight: 720, marginTop: 8 }}>
              Northstar was formed after identifying a gap in how early-stage AI is being applied in vertical SaaS.
            </div>
            {packetEditMode ? (
              <textarea defaultValue="Technical capability is ahead of real-world deployment. We focus on founders building commercially viable AI systems, not research-heavy bets." style={{ fontSize: 13.2, lineHeight: 1.48, marginTop: 8, maxWidth: 820, background: "transparent", border: `1px solid ${MP.accent}`, borderRadius: 6, color: MP.text, padding: "4px 8px", width: "100%", resize: "vertical" }} rows={3} />
            ) : (
              <div style={{ color: MP.soft, fontSize: 13.2, lineHeight: 1.48, marginTop: 8, maxWidth: 820 }}>
                Technical capability is ahead of real-world deployment. We focus on founders building commercially viable AI systems, not research-heavy bets.
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 10 }}>
            <MPDeskPanel title="Where We Win" kicker="Three edges" fill style={{ padding: 16 }}>
              {whereWeWin.map(([label, body]) => (
                <div key={label} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <div style={{ color: MP.text, fontSize: 12.6, fontWeight: 780 }}>{label}</div>
                  <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.42, marginTop: 3 }}>{body}</div>
                </div>
              ))}
            </MPDeskPanel>
            <MPDeskPanel title="What We Don't Do" kicker="Discipline" fill style={{ padding: 16 }}>
              {whatWeDoNotDo.map((item) => (
                <div key={item} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 12.8, lineHeight: 1.4 }}>
                  {item}
                </div>
              ))}
            </MPDeskPanel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <MPDeskPanel title="Fund Terms" kicker="Allocator filters" fill style={{ padding: 16 }}>
              {fundTerms.map(([label, value]) => (
                <MPDataRow key={label} label={label} value={value} mono={label !== "Fund Life"} />
              ))}
            </MPDeskPanel>
            <MPDeskPanel title="Proof of Early Traction" kicker="Emerging manager proof" fill style={{ padding: 16 }}>
              {tractionProof.map(([value, label]) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "48px minmax(0, 1fr)", gap: 10, alignItems: "baseline", padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
                  <span className="marketplace-mono" style={{ color: MP.green, fontSize: 18, fontWeight: 640 }}>{value}</span>
                  <span style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.35 }}>{label}</span>
                </div>
              ))}
            </MPDeskPanel>
            <MPDeskPanel title="Pipeline Snapshot" kicker="Current pipeline" fill style={{ padding: 16 }}>
              {pipelineSnapshot.map(([value, label]) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "48px minmax(0, 1fr)", gap: 10, alignItems: "baseline", padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
                  <span className="marketplace-mono" style={{ color: MP.accent, fontSize: 18, fontWeight: 640 }}>{value}</span>
                  <span style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.35 }}>{label}</span>
                </div>
              ))}
            </MPDeskPanel>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {[
              ["Track Record", "track"],
              ["Case Study", "case"],
              ["Team", "team"],
            ].map(([label, target], index) => (
              <MPButton key={label} variant={index === 0 ? "primary" : "secondary"} onClick={() => setDataRoomSection(target)} style={{ width: "100%" }}>
                {label}
              </MPButton>
            ))}
          </div>
        </div>
      );
    };

    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="LP Packet"
            title="LP Packet"
            right={<MPButton onClick={() => showToast("Packet marked complete", "success")}>Complete Packet</MPButton>}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "196px minmax(0, 1fr)",
                minHeight: 660,
              }}
              className="marketplace-data-room-shell"
            >
              <aside
                style={{
                  padding: 14,
                  background: MP.panel,
                  borderRight: `1px solid ${MP.line}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <div style={compactCell}>Packet Sections</div>
                  <div style={{ color: MP.text, fontSize: 14, fontWeight: 780, marginTop: 5 }}>
                    LP Presentation Layer
                  </div>
                </div>
                {dataRoomTabs.map(([id, label, note]) => {
                  const active = dataRoomSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDataRoomSection(id)}
                      style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr)",
                        gap: 2,
                        minHeight: 52,
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: MP.radius.md,
                        border: `1px solid ${active ? "rgba(123,111,232,.20)" : "transparent"}`,
                        background: active ? MP.accentSoft : "transparent",
                        color: active ? MP.text : MP.soft,
                        cursor: "pointer",
                        boxShadow: active ? `inset 2px 0 0 ${MP.accent}` : "none",
                      }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 760 }}>{label}</span>
                      <span style={{ color: active ? MP.soft : MP.muted, fontSize: 10.8 }}>{note}</span>
                    </button>
                  );
                })}
                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${MP.line}` }}>
                  <MPDataRow label="Access model" value="Tiered" />
                  <MPDataRow label="Locked files" value={String(lockedDocs.length)} mono />
                  <button
                    type="button"
                    onClick={() => setPacketEditMode(prev => !prev)}
                    style={{
                      width: "100%",
                      marginTop: 10,
                      padding: "8px 12px",
                      borderRadius: MP.radius.md,
                      border: `1px solid ${packetEditMode ? MP.accent : MP.line}`,
                      background: packetEditMode ? MP.accentSoft : "transparent",
                      color: packetEditMode ? MP.accent : MP.soft,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {packetEditMode ? "✓ Done editing" : "Edit packet"}
                  </button>
                </div>
              </aside>

              <main
                style={{
                  padding: "24px 28px",
                  minWidth: 0,
                  background: MP.workspace2,
                  borderRight: `1px solid ${MP.line}`,
                  minHeight: 660,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={compactCell}>{activeDataRoomTab[2]}</div>
                    <div style={{ color: MP.text, fontSize: 15, fontWeight: 780, marginTop: 5 }}>
                      {activeDataRoomTab[1]}
                    </div>
                  </div>
                  <MPPill tone="accent">LP view</MPPill>
                </div>
                {renderDataRoomContent()}
              </main>

            </div>
          </MPCard>
        </div>
      </div>
    );
  }

  if (page === "narrative") {
    const narrativeStatus = [
      ["Narrative Strength", "7.2 / 10", MP.text],
      ["LP Clarity", "High", MP.green],
      ["Differentiation", "Moderate", MP.amber],
      ["Risk Perception", "Elevated", MP.amber],
    ];
    const perceptionBlocks = [
      {
        title: "Strengths",
        tone: MP.green,
        items: [
          "Clear sector focus: applied AI in vertical SaaS.",
          "Strong early traction in pipeline.",
          "Credible technical sourcing network.",
        ],
      },
      {
        title: "Weaknesses",
        tone: MP.amber,
        items: [
          "Limited realized exits creates Fund I risk.",
          "Positioning overlaps with other AI-focused funds.",
          "Attribution is not immediately obvious.",
        ],
      },
      {
        title: "LP Risks",
        tone: MP.amber,
        items: [
          "Is this just another AI fund?",
          "Can they actually win deals?",
          "Is this too early-stage for our mandate?",
        ],
      },
    ];
    const lpPositioning = [
      ["Endowment LP", "Emphasize long-term compounding, discipline, and selectivity. De-emphasize early-stage volatility."],
      ["Family Office", "Emphasize upside, access, founder relationships, and standout deal-level proof."],
      ["Fund-of-Funds", "Emphasize portfolio construction, repeatability, and benchmark alignment."],
    ];
    const narrativeMetrics = [
      ["Clarity Score", "8.1 / 10", MP.green],
      ["Differentiation Score", "6.3 / 10", MP.amber],
      ["Credibility Score", "7.0 / 10", MP.text],
    ];
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Narrative optimizer"
            title="Narrative"
            right={null}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 16,
              alignItems: "center",
              padding: "14px 16px",
              background: MP.panel2,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase", marginBottom: 5 }}>
                Narrative tools
              </div>
              <div style={{ color: MP.text, fontSize: 13.5, fontWeight: 700, lineHeight: 1.4 }}>
                LP-specific positioning and call prep.
              </div>
            </div>
            <MPButton onClick={() => showToast("Narrative tools enabled", "info")}>
              Upgrade Now
            </MPButton>
          </MPCard>
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, padding: 14 }}>
            {narrativeStatus.map(([label, value, color]) => (
              <div key={label} style={{ padding: 12, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}`, minWidth: 0 }}>
                <div style={{ color: MP.muted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
                <div className="marketplace-mono" style={{ color, fontSize: 20, fontWeight: 640, marginTop: 7, lineHeight: 1.05 }}>{value}</div>
              </div>
            ))}
          </MPCard>
        </div>

        <div className="marketplace-overview-span-7">
          <MPDeskPanel title="Core Narrative" kicker="Current narrative" fill style={{ height: 220 }}>
            <div style={{ color: MP.text, fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>
              Northstar is an early-stage fund focused on applied AI in vertical SaaS, backing companies at the commercialization inflection point.
            </div>
            <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.5, marginTop: 14 }}>
              Strong direction, but the LP conversation needs sharper proof of repeatability, deal access, and why Northstar wins in a crowded AI market.
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-5">
          <MPDeskPanel title="Narrative Metrics" kicker="Decision signals" fill style={{ height: 220 }}>
            {narrativeMetrics.map(([label, value, color]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 86px", gap: 12, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ color: MP.soft, fontSize: 13 }}>{label}</span>
                <span className="marketplace-mono" style={{ color, fontSize: 17, textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-12">
          <MPDeskPanel title="LP Perception Analysis" kicker="What allocators will believe or question" fill>
            <div className="marketplace-grid-3">
              {perceptionBlocks.map((block) => (
                <div key={block.title} style={{ padding: 14, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}`, minWidth: 0 }}>
                <div style={{ color: MP.muted, fontSize: 11, fontWeight: 820, textTransform: "uppercase", marginBottom: 8 }}>{block.title}</div>
                  {block.items.map((item) => (
                    <div key={item} style={{ padding: "8px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 12.6, lineHeight: 1.4 }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-5">
          <MPDeskPanel title="Top LP Objections" kicker="Prepare answers before calls" fill style={{ minHeight: 340 }}>
            {[
              "Lack of realized track record.",
              "Differentiation vs crowded AI funds.",
              "Unclear repeatability of edge.",
              "Early-stage risk profile.",
            ].map((item, index) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: 10, padding: "11px 0", borderTop: `1px solid ${MP.line}`, alignItems: "center" }}>
                <span className="marketplace-mono" style={{ color: MP.amber, fontSize: 13 }}>{index + 1}</span>
                <span style={{ color: MP.text, fontSize: 13.2, lineHeight: 1.35 }}>{item}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-7">
          <MPDeskPanel title="LP-Specific Positioning" kicker="$5K-tier narrative routing" fill style={{ minHeight: 340 }}>
            {lpPositioning.map(([lpType, guidance]) => (
              <div key={lpType} style={{ display: "grid", gridTemplateColumns: "132px minmax(0, 1fr)", gap: 14, padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ color: MP.text, fontSize: 13.2, fontWeight: 760 }}>{lpType}</span>
                <span style={{ color: MP.soft, fontSize: 12.8, lineHeight: 1.42 }}>{guidance}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-12">
          <MPDeskPanel title="Placement-Agent Recommendations" kicker="What to fix before the next LP conversation">
            <div className="marketplace-grid-3">
              {[
                ["Lead with proof", "Open with deal-level attribution and sourced pre-fund investments."],
                ["Sharpen crowded-market answer", "Make vertical SaaS commercialization the wedge, not broad AI exposure."],
                ["Pre-handle risk", "Show downside controls before LPs ask about Fund I risk."],
              ].map(([title, body]) => (
                <div key={title} style={{ padding: 14, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}` }}>
                  <div style={{ color: MP.text, fontSize: 15, fontWeight: 760 }}>{title}</div>
                  <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.45, marginTop: 8 }}>{body}</div>
                </div>
              ))}
            </div>
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (false && page === "forecast") {
    const scenarios = [
      {
        label: "Base Case",
        range: "$42M-$52M",
        probability: "62%",
        time: "5.3 months",
        tone: MP.text,
        notes: ["Current pipeline holds", "No anchor LP assumed"],
      },
      {
        label: "Add Anchor",
        range: "$48M-$55M",
        probability: "79%",
        time: "4.1 months",
        tone: MP.green,
        notes: ["Mosaic or Pacific commits", "Improves LP confidence"],
      },
      {
        label: "Top 2 Stall",
        range: "$32M-$44M",
        probability: "41%",
        time: "7.8 months",
        tone: MP.amber,
        notes: ["Cedar Grove + Pacific lost", "Negative signaling effect"],
      },
      {
        label: "References Complete",
        range: "$45M-$52M",
        probability: "71%",
        time: "4.8 months",
        tone: MP.green,
        notes: ["Unlocks stalled LPs", "Improves conversion"],
      },
    ];
    const capitalDrivers = [
      ["Anchor LP closes", "Mosaic or Pacific commits", "+$10M", "+17 pts", MP.green],
      ["Top 2 LPs stall", "Cedar Grove + Pacific go cold", "-$18M", "-21 pts", MP.amber],
      ["References completed", "Unlocks Cedar Grove + Mosaic", "+$6M", "+9 pts", MP.green],
      ["Narrative narrowed", "Improves clarity across LPs", "+$4M", "+6 pts", MP.text],
    ];
    const criticalPath = [
      "Convert 1 anchor LP: Mosaic or Pacific.",
      "Complete attribution appendix.",
      "Add 3 founder references.",
      "Push 2 partner meetings in next 10 days.",
    ];
    const pipelineImpact = [
      ["Cedar Grove", "$3.2M", "82%"],
      ["Mosaic", "$2.4M", "60%"],
      ["Pacific", "$1.8M", "45%"],
    ];
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Raise Forecast"
            title="Raise Forecast"
            right={<MPButton onClick={() => setPage("report")}>Weekly Update</MPButton>}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard style={{ padding: 16, minHeight: 150 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(140px, .65fr) minmax(240px, 1fr) minmax(210px, .8fr)",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase" }}>Fund Target</div>
                <div className="marketplace-mono" style={{ color: MP.text, fontSize: 22, fontWeight: 640, marginTop: 6 }}>$50M</div>
              </div>
              <div>
                <div style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase" }}>Expected Close</div>
                <div className="marketplace-mono" style={{ color: MP.text, fontSize: 20, fontWeight: 640, lineHeight: 1, marginTop: 6 }}>$42M-$52M</div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 12 }}>
                  <span style={{ color: MP.soft, fontSize: 12.5 }}>Probability of hitting $50M</span>
                  <span className="marketplace-mono" style={{ color: MP.green, fontSize: 17 }}>62%</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 12 }}>
                  <span style={{ color: MP.soft, fontSize: 12.5 }}>Time to close</span>
                  <span className="marketplace-mono" style={{ color: MP.text, fontSize: 17 }}>5.3 mo</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${MP.line}`, display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
              <div>
                <span style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase", marginRight: 8 }}>Status</span>
                <span style={{ color: MP.text, fontSize: 14, fontWeight: 760 }}>On track with risk</span>
              </div>
              <span style={{ color: MP.soft, fontSize: 12.5 }}>Anchor LP not yet secured. Attribution + references are the swing factors.</span>
            </div>
          </MPCard>
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, padding: 14 }}>
            {scenarios.map((scenario) => (
              <div key={scenario.label} style={{ padding: 14, borderRadius: MP.radius.sm, background: MP.panel2, border: `1px solid ${MP.line}`, minWidth: 0, minHeight: 210 }}>
                <div style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase" }}>{scenario.label}</div>
                <div className="marketplace-mono" style={{ color: scenario.tone, fontSize: 25, fontWeight: 640, lineHeight: 1, marginTop: 9 }}>{scenario.range}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  <MPPill tone={scenario.tone === MP.green ? "green" : scenario.tone === MP.amber ? "amber" : "neutral"}>{scenario.probability} success</MPPill>
                  <MPPill tone="neutral">{scenario.time}</MPPill>
                </div>
                <div style={{ marginTop: 10 }}>
                  {scenario.notes.map((note) => (
                    <div key={note} style={{ padding: "6px 0", borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 11.8, lineHeight: 1.35 }}>
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </MPCard>
        </div>

        <div className="marketplace-overview-span-7">
          <MPDeskPanel title="Capital Drivers" fill style={{ height: 360, overflow: "hidden" }}>
            {capitalDrivers.map(([event, note, raiseImpact, probabilityImpact, color]) => (
              <div key={event} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 86px 74px", gap: 12, alignItems: "center", padding: "13px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", color: MP.text, fontSize: 14.2, fontWeight: 740 }}>{event}</span>
                  <span style={{ display: "block", color: MP.soft, fontSize: 12.2, marginTop: 4 }}>{note}</span>
                </span>
                <span className="marketplace-mono" style={{ color, fontSize: 17 }}>{raiseImpact}</span>
                <span className="marketplace-mono" style={{ color, fontSize: 16 }}>{probabilityImpact}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-5">
          <MPDeskPanel title="Close Risk" fill style={{ height: 360, overflow: "hidden" }}>
            <div style={{ color: MP.text, fontSize: 14, fontWeight: 760, lineHeight: 1.4 }}>
              You can still hit first close, but attribution + references are now the constraint.
            </div>
            <div style={{ marginTop: 16 }}>
              <MPProgress value={62} label="Base-case close probability" color={MP.accent} />
            </div>
            {["Pacific waits on downside case.", "Cedar Grove needs references before partner call.", "Launchpad is going cold."].map((risk) => (
              <div key={risk} style={{ padding: "11px 0", borderTop: `1px solid ${MP.line}`, color: MP.amber, fontSize: 13 }}>
                {risk}
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-7">
          <MPDeskPanel title="Critical Path to Close" fill style={{ minHeight: 300 }}>
            {criticalPath.map((item, index) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: 12, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <span className="marketplace-mono" style={{ color: MP.accent, fontSize: 13 }}>{index + 1}</span>
                <span style={{ color: MP.text, fontSize: 13.5, fontWeight: 700, lineHeight: 1.35 }}>{item}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-5">
          <MPDeskPanel title="Top Contributors to Close" fill style={{ minHeight: 300 }}>
            {pipelineImpact.map(([lp, expected, probability]) => (
              <div key={lp} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 80px 56px", gap: 12, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ color: MP.text, fontSize: 13.5, fontWeight: 740 }}>{lp}</span>
                <span className="marketplace-mono" style={{ color: MP.green, fontSize: 15 }}>{expected}</span>
                <span className="marketplace-mono" style={{ color: MP.soft, fontSize: 13, textAlign: "right" }}>{probability}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (page === "report") {
    const capitalMovement = [
      ["+", "$4.8M", "Pacific", "Reveal approved; diligence room opened", "green"],
      ["-", "$1.4M", "Pacific", "Attribution memo still blocks IC prep", "amber"],
      ["+", "$1.7M", "Northgate", "Next endowment path ranked by engine", "green"],
    ];
    const topExpectedValue = [
      ["1", "Pacific", "$4.8M", "78%", "Attribution memo unlocks IC prep", "green"],
      ["2", "Northgate", "$2.7M", "64%", "Endowment mandate fit is strong", "accent"],
      ["3", "Cedar Grove", "$2.1M", "58%", "References unlock next call", "green"],
      ["4", "Launchpad", "$1.5M", "32%", "Falling engagement", "amber"],
    ];
    const reportRisks = [
      ["Pacific stalled", "-$2M impact", "Cause: weak downside case.", "amber"],
      ["Attribution incomplete", "-12% conversion", "Affects Pacific and Mosaic.", "amber"],
      ["Launchpad engagement dropping", "Likely loss", "No action within 2 weeks.", "amber"],
    ];
    const criticalGaps = [
      ["Attribution appendix missing", "Blocking Pacific IC prep"],
      ["Founder references incomplete", "Delaying Pacific and Cedar Grove"],
      ["Case study depth weak", "Reducing conviction across pipeline"],
    ];
    const lpBreakdown = [
      ["Pacific", "Diligence active", "Upload attribution memo", "$4-5M", "5 days", "green"],
      ["Northgate", "Rising", "Review match rationale", "$1-3M", "This week", "accent"],
      ["Cedar Grove", "High conviction", "Send founder references", "$2-3M", "7-10 days", "green"],
    ];
    const priorityActions = [
      ["Send attribution memo to Pacific", "Protects $4-5M expected path"],
      ["Upload founder references for Pacific", "Moves room toward IC prep"],
      ["Review Northgate match rationale", "Creates second endowment path"],
      ["Add 3 founder references to data room", "Improves conversion by 10-15%"],
    ];
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow={<span>Capital Update{updateGenerated && <span style={{ marginLeft: 10, color: MP.green, fontSize: 10, fontWeight: 700 }}>Updated just now</span>}</span>}
            title="Capital Movement Report"
            right={<MPButton onClick={() => { setUpdateGenerated(true); showToast("Weekly update refreshed", "success"); }}>{updateGenerated ? "Update current" : "New update available"}</MPButton>}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <MPCard style={{ display: "grid", gridTemplateColumns: "minmax(220px, .9fr) repeat(3, minmax(0, 1fr))", gap: 10, alignItems: "stretch", padding: 14 }}>
            <div>
              <div style={{ color: MP.muted, fontSize: 10, fontWeight: 820, textTransform: "uppercase" }}>Fundraising Status</div>
              <div style={{ color: MP.text, fontSize: 18, fontWeight: 760, lineHeight: 1, marginTop: 8 }}>At risk</div>
              <div style={{ color: MP.soft, fontSize: 12.5, lineHeight: 1.45, marginTop: 9 }}>
                No anchor LP secured. Largest risk is Pacific stalling before IC prep.
              </div>
            </div>
            {[
              ["Hit $50M", "54%", "down 6% WoW", MP.text],
              ["Expected close", "$42M-$58M", "base range", MP.text],
              ["Time to close", "5.8 mo", "current pace", MP.text],
            ].map(([label, value, note, color]) => (
              <div key={label} style={{ padding: 13, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}`, minWidth: 0 }}>
                <div style={{ color: MP.muted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
                <div className="marketplace-mono" style={{ color, fontSize: 24, fontWeight: 640, lineHeight: 1, marginTop: 9 }}>{value}</div>
                <div style={{ color: MP.soft, fontSize: 11.5, marginTop: 7 }}>{note}</div>
              </div>
            ))}
          </MPCard>
        </div>

        <div className="marketplace-overview-span-6">
          <MPDeskPanel title="Capital Movement" kicker="This week" fill style={{ height: 330 }}>
            {capitalMovement.map(([sign, amount, lp, note, tone]) => (
              <div key={lp} style={{ display: "grid", gridTemplateColumns: "22px 74px minmax(0, 1fr)", gap: 10, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <MPStatusDot tone={tone} />
                <span className="marketplace-mono" style={{ color: tone === "green" ? MP.green : MP.text, fontSize: 16 }}>{amount}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", color: MP.text, fontSize: 13.5, fontWeight: 740 }}>{lp}</span>
                  <span style={{ display: "block", color: MP.soft, fontSize: 12, marginTop: 3 }}>{note}</span>
                </span>
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${MP.line}`, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ color: MP.text, fontSize: 13.5, fontWeight: 740 }}>Net Momentum</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MPStatusDot tone="green" />
                <span className="marketplace-mono" style={{ color: MP.text, fontSize: 18 }}>+$3.6M</span>
              </span>
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-6">
          <MPDeskPanel title="Top LPs by Expected Value" kicker="Where to focus" fill style={{ height: 330 }}>
            {topExpectedValue.map(([rank, lp, value, probability, note, tone]) => (
              <div key={lp} style={{ display: "grid", gridTemplateColumns: "48px minmax(0, 1fr) 70px 54px", gap: 10, alignItems: "center", padding: "11px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MPStatusDot tone={tone} />
                  <span className="marketplace-mono" style={{ color: MP.muted }}>{rank}</span>
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", color: MP.text, fontSize: 13.5, fontWeight: 740 }}>{lp}</span>
                  <span style={{ display: "block", color: MP.soft, fontSize: 11.5, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note}</span>
                </span>
                <span className="marketplace-mono" style={{ color: tone === "green" ? MP.green : MP.text, fontSize: 15 }}>{value}</span>
                <span className="marketplace-mono" style={{ color: MP.soft, fontSize: 14, textAlign: "right" }}>{probability}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Top Risks" kicker="Quantified" fill style={{ height: 350 }}>
            {reportRisks.map(([risk, impact, cause, tone], index) => (
              <div key={risk} style={{ padding: "11px 0", borderTop: `1px solid ${MP.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, color: MP.text, fontSize: 13, fontWeight: 740 }}>
                    <MPStatusDot tone={tone} />
                    {index + 1}. {risk}
                  </span>
                  <span className="marketplace-mono" style={{ color: MP.text, fontSize: 12.5 }}>{impact}</span>
                </div>
                <div style={{ color: MP.soft, fontSize: 12, lineHeight: 1.4, marginTop: 5 }}>{cause}</div>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Critical Gaps" kicker="Tied to money" fill style={{ height: 350 }}>
            {criticalGaps.map(([gap, impact]) => (
              <div key={gap} style={{ padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <div style={{ color: MP.text, fontSize: 13.2, fontWeight: 740 }}>{gap}</div>
                <div style={{ color: MP.soft, fontSize: 12, lineHeight: 1.4, marginTop: 5 }}>{impact}</div>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Momentum" kicker="Psychological read" fill style={{ height: 350 }}>
            <MPDataRow label="Deals advancing" value="4" mono />
            <MPDataRow label="Deals stalling" value="2" mono />
            <MPDataRow label="Overall trend" value="Positive" />
            <div style={{ marginTop: "auto", padding: 14, borderRadius: MP.radius.md, background: MP.panel2, border: `1px solid ${MP.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: MP.text, fontSize: 13, fontWeight: 760, textTransform: "uppercase" }}>
                <MPStatusDot tone="green" />
                Improving
              </div>
              <div style={{ color: MP.soft, fontSize: 12.5, lineHeight: 1.45, marginTop: 7 }}>
                Momentum is positive, but the raise still depends on converting a top-tier LP.
              </div>
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-7">
          <MPDeskPanel title="LP-Level Breakdown" kicker="Mini playbooks" fill style={{ minHeight: 360 }}>
            {lpBreakdown.map(([lp, status, action, check, timing, tone]) => (
              <div key={lp} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 96px 78px", gap: 12, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, color: MP.text, fontSize: 13.8, fontWeight: 760 }}>
                    {lp} <MPPill tone={tone}>{status}</MPPill>
                  </span>
                  <span style={{ display: "block", color: MP.soft, fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>{action}</span>
                </span>
                <span className="marketplace-mono" style={{ color: tone === "green" ? MP.green : MP.text, fontSize: 13.5 }}>{check}</span>
                <span style={{ color: MP.muted, fontSize: 12, textAlign: "right" }}>{timing}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-5">
          <MPDeskPanel title="Forecast Update" kicker="This week" fill style={{ minHeight: 360 }}>
            <MPDataRow label="Last week expected" value="$65M" mono />
            <MPDataRow label="This week expected" value="$68M" mono />
            <MPDataRow label="If Pacific drops" value="$61M" mono />
            <div style={{ marginTop: 14 }}>
              {["+ Pacific reveal approved", "- Attribution memo still open"].map((driver) => (
                <div key={driver} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 13 }}>
                  <MPStatusDot tone={driver.startsWith("+") ? "green" : "amber"} />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-8">
          <MPDeskPanel title="Priority Actions" kicker="Next 7 days" fill>
            {priorityActions.map(([action, impact], index) => (
              <button
                key={action}
                type="button"
                onClick={() => setPage(index === 0 ? "room" : index === 1 ? "documents" : index === 2 ? "engine" : "documents")}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "26px minmax(0, 1fr) minmax(180px, .55fr)",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 0",
                  border: "none",
                  borderTop: `1px solid ${MP.line}`,
                  background: "transparent",
                  color: MP.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span className="marketplace-mono" style={{ color: MP.muted }}>{index + 1}</span>
                <span style={{ fontSize: 13.4, fontWeight: 720 }}>{action}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: MP.soft, fontSize: 12.2, lineHeight: 1.35 }}>
                  <MPStatusDot tone={index < 2 ? "green" : "amber"} />
                  {impact}
                </span>
              </button>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="What This Means" kicker="Interpretation" fill>
            <div style={{ color: MP.text, fontSize: 14, fontWeight: 760, lineHeight: 1.35 }}>
              Strong progress, but still anchor-dependent.
            </div>
            <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.5, marginTop: 12 }}>
              The next 2-3 weeks are critical. Pacific is the anchor path; Northgate is the next high-fit endowment route.
            </div>
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (page === "matches") {
    const rankedMatches = [...state.matches].sort((first, second) => second.score - first.score);
    const selectedMatch =
      rankedMatches.find((match) => match.id === selectedMatchId) ||
      rankedMatches[0];
    const selectedRequest = selectedMatch
      ? state.matchRequests.find((entry) => entry.matchId === selectedMatch.id && !entry.lpOnly)
      : null;
    const requestableMatches = state.matches.filter((match) => match.requestable);
    const selectedStatusTone =
      selectedRequest?.status === "Approved"
        ? "green"
        : selectedRequest?.status === "Declined"
        ? "red"
        : selectedRequest?.status === "More Info Requested"
        ? "amber"
        : selectedRequest
        ? "blue"
        : selectedMatch?.requestable
        ? "green"
        : "red";
    const selectedActionLabel =
      selectedRequest?.status === "Approved"
        ? "Open Room"
        : selectedRequest
        ? "View Request"
        : selectedMatch?.requestable
        ? "Request Access"
        : "Complete Packet";
    const handleSelectedAction = () => {
      if (!selectedMatch) return;
      if (selectedRequest?.status === "Approved") {
        setPage("room");
        return;
      }
      if (selectedRequest) {
        setPage("requests");
        return;
      }
      if (selectedMatch.requestable) {
        requestMatch(selectedMatch);
        return;
      }
      setPage("documents");
    };
    const renderInsightRows = (items, tone) =>
      items.map((item) => (
        <div
          key={item}
          style={{
            padding: "8px 0",
            borderTop: `1px solid ${MP.line}`,
            color: tone === "green" ? MP.text : MP.soft,
            fontSize: 12.4,
            lineHeight: 1.42,
          }}
        >
          <span>{item}</span>
        </div>
      ));
    const matchTableTemplate = "30px minmax(0, 1fr) 52px 96px 64px 94px";

    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="LP Matches"
            title="LP Matches"
            right={
              <MPButton onClick={handleSelectedAction} disabled={!selectedMatch}>
                {selectedActionLabel}
              </MPButton>
            }
          />
        </div>
        <div className="marketplace-overview-span-8">
          <MPDeskPanel
            title="LP Matches"
            kicker={`${requestableMatches.length} above gate · status, source docs, last activity`}
            style={{ padding: "14px 16px 6px", height: 760, overflow: "hidden" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: matchTableTemplate,
                gap: "0 14px",
                padding: "0 0 8px",
                borderBottom: `1px solid ${MP.line}`,
              }}
            >
              <span style={MP_TYPE.label}>#</span>
              <span style={MP_TYPE.label}>Allocator</span>
              <span style={{ ...MP_TYPE.label, textAlign: "center" }}>Score</span>
              <span style={MP_TYPE.label}>Status</span>
              <span style={MP_TYPE.label}>Docs</span>
              <span style={MP_TYPE.label}>Last</span>
            </div>
            <div style={{ paddingRight: 2, overflow: "auto", flex: 1, minHeight: 0 }}>
              {rankedMatches.map((match, index) => {
                const request = state.matchRequests.find((entry) => entry.matchId === match.id && !entry.lpOnly);
                const active = selectedMatch?.id === match.id;
                const statusTone =
                  request?.status === "Approved"
                    ? "green"
                    : request?.status === "Declined"
                    ? "red"
                    : request?.status === "More Info Requested"
                    ? "amber"
                    : request
                    ? "blue"
                    : match.requestable
                    ? "green"
                    : "red";
                const statusLabel = request
                  ? request.status === "More Info Requested"
                    ? "More info"
                    : request.status
                  : match.requestable
                  ? "Requestable"
                  : "Below gate";
                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => setSelectedMatchId(match.id)}
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: matchTableTemplate,
                      alignItems: "center",
                      gap: "0 14px",
                      minHeight: 68,
                      padding: "14px 0",
                      borderTop: `1px solid ${MP.line}`,
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      background: active ? MP.accentSoft : "transparent",
                      boxShadow: active ? `inset 2px 0 0 ${MP.accent}` : "none",
                      color: MP.text,
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: MP.type.body,
                    }}
                  >
                    <span
                      className="marketplace-mono"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: MP.radius.xs,
                        border: `1px solid ${index === 0 ? "rgba(123,111,232,.22)" : MP.line}`,
                        background: index === 0 ? MP.accentSoft : "rgba(237,234,248,.035)",
                        color: index === 0 ? MP.text : MP.muted,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 14.5, fontWeight: 620, color: MP.text, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {request?.status === "Approved" ? match.lpName : match.lpAlias}
                      </span>
                    <span style={{ display: "block", fontSize: 12.1, color: MP.soft, lineHeight: 1.35, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {`${match.checkRange} · ${match.geography}`}
                      </span>
                    </span>
                    <MPNumberCell value={match.score} color={match.score >= 85 ? MP.green : MP.text} label="fit" style={{ textAlign: "center" }} />
                    <MPPill tone={statusTone} style={{ justifySelf: "start", minWidth: 0, maxWidth: 92 }}>
                      {statusLabel}
                    </MPPill>
                    <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>
                      {match.requestable ? "5" : "2"} files
                    </span>
                    <span style={{ ...MP_TYPE.rowMeta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {index < 3 ? "Viewed today" : index < 8 ? "Synced Apr 8" : "Model only"}
                    </span>
                  </button>
                );
              })}
            </div>
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-4">
          {selectedMatch && (
            <MPCard
              elevated
              fill
              style={{
                padding: 0,
                display: "flex",
                flexDirection: "column",
                background: MP.panel,
                height: 760,
                overflow: "hidden",
              }}
            >
              <MPCard
                style={{
                  padding: 0,
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  background: MP.panel,
                  borderBottom: `1px solid ${MP.line}`,
                }}
              >
                <div
                  style={{
                    padding: "15px 16px 13px",
                  }}
                >
                  <div
                    style={{
                      color: MP.muted,
                      fontSize: 9.5,
                      fontWeight: 780,
                      textTransform: "uppercase",
                      marginBottom: 9,
                    }}
                  >
                    Selected LP
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 14, alignItems: "start" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: MP.text, fontSize: 16, fontWeight: 720, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedRequest?.status === "Approved" ? selectedMatch.lpName : selectedMatch.lpAlias}
                      </div>
                      <div style={{ color: MP.soft, fontSize: 11.6, lineHeight: 1.35, marginTop: 5 }}>
                        {selectedMatch.lpType} · {selectedMatch.aumBand} AUM
                      </div>
                    </div>
                    <div
                      style={{
                        minWidth: 58,
                        padding: "9px 10px",
                        borderRadius: MP.radius.sm,
                        border: `1px solid ${selectedMatch.score >= 85 ? "rgba(98,201,146,.18)" : MP.line}`,
                        background: selectedMatch.score >= 85 ? "rgba(98,201,146,.07)" : MP.panel2,
                        textAlign: "center",
                      }}
                    >
                      <div className="marketplace-mono" style={{ color: selectedMatch.score >= 85 ? MP.green : MP.text, fontSize: 20, fontWeight: 620, lineHeight: 1 }}>
                        {selectedMatch.score}
                      </div>
                      <div style={{ color: MP.muted, fontSize: 9, textTransform: "uppercase", fontWeight: 760, marginTop: 4 }}>
                        fit
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 16px 14px" }}>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
                    <MPPill tone="neutral">{selectedMatch.lpType}</MPPill>
                    <MPPill tone="neutral">{selectedMatch.aumBand} AUM</MPPill>
                    <MPPill tone="neutral">{selectedMatch.checkRange}</MPPill>
                    <MPPill tone={selectedStatusTone}>
                      {selectedRequest ? selectedRequest.status : selectedMatch.requestable ? "Requestable" : "Below gate"}
                    </MPPill>
                  </div>
                  <MPDataRow label="Mandate" value={selectedMatch.mandate} />
                  <MPDataRow label="Geography" value={selectedMatch.geography} />
                  <MPDataRow label="Request threshold" value={`${selectedMatch.threshold}+`} />
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 8, marginTop: 14 }}>
                    <MPButton onClick={handleSelectedAction} disabled={!selectedMatch} style={{ width: "100%" }}>
                      {selectedActionLabel}
                    </MPButton>
                    <MPButton variant="secondary" onClick={() => inspectMatch(selectedMatch)}>
                      View LP Fit
                    </MPButton>
                  </div>
                </div>
              </MPCard>

              <div style={{ padding: "12px 16px 16px", flex: 1, minHeight: 0, overflow: "auto" }}>
                <div style={{ marginBottom: 11 }}>
                  <div style={{ color: MP.muted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>
                    Why this fits
                  </div>
                  {renderInsightRows(selectedMatch.why, "green")}
                </div>
                <div style={{ marginBottom: 11 }}>
                  <div style={{ color: MP.muted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>
                    Approval checks
                  </div>
                  {renderInsightRows(selectedMatch.blockers, "amber")}
                </div>

                <div style={{ borderTop: `1px solid ${MP.line}`, paddingTop: 10 }}>
                  <div style={{ color: MP.muted, fontSize: 9.6, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>
                    Reveal gate
                  </div>
                <MPDataRow label="LP sees today" value={selectedMatch.lpSeesToday} />
                <MPDataRow label="To unlock reveal" value={selectedMatch.revealUnlocksIf} />
                <MPDataRow label="Target check" value={selectedMatch.checkRange} />
                <MPDataRow label="Sector overlap" value={(selectedMatch.sectors || []).slice(0, 2).join(" / ")} />
                <div style={{ marginTop: 10, borderTop: `1px solid ${MP.line}`, paddingTop: 8 }}>
                  <div style={{ color: MP.muted, fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>
                    Recommended actions
                  </div>
                  {(selectedMatch.nextActions || []).slice(0, 3).map((action) => (
                    <div key={action} style={{ padding: "7px 0", borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 12.1, lineHeight: 1.4 }}>
                      {action}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                      marginTop: 10,
                      padding: 11,
                    borderRadius: MP.radius.sm,
                      border: `1px solid ${MP.line}`,
                      background: MP.panel2,
                  }}
                >
                  <div style={{ color: MP.muted, fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", marginBottom: 5 }}>
                      Next step
                  </div>
                  <div style={{ color: MP.text, fontSize: 12.5, lineHeight: 1.45, fontWeight: 620 }}>
                    {selectedMatch.nextActions?.[0] || "Review packet before submitting."}
                  </div>
                </div>
                </div>
              </div>
            </MPCard>
          )}
        </div>
      </div>
    );
  }

  if (page === "requests") {
    const leadRequest = gpRequests[0] || null;
    const revealRows = [
      {
        id: leadRequest?.id || "req-yc-pacific",
        lp: "Stanford Endowment",
        alias: "University Endowment, $2B-$5B AUM",
        status: leadRequest?.status || "Pending",
        score: leadRequest?.score || 92,
        owner: "Siobhan Roy",
        due: "Today 4:00 PM",
        source: "Request packet v3.2",
        permissions: "Identity locked",
        lastActivity: "Allocator opened request 12m ago",
        next: "Complete attribution memo and reference pack",
        matchId: MARKETPLACE_PRIMARY_MATCH_ID,
      },
      {
        id: "req-cedar-active",
        lp: "Cedar Grove Family Office",
        alias: "Single Family Office, $500M-$1B AUM",
        status: "Approved",
        score: 88,
        owner: "Kendall Roy",
        due: "Tomorrow 9:00 AM",
        source: "Climate case + DDQ",
        permissions: "Room-only",
        lastActivity: "Room opened after approval",
        next: "Upload founder reference pack",
        matchId: "match-family-office-climate",
      },
      {
        id: "req-mosaic-active",
        lp: "Mosaic Endowment",
        alias: "University Endowment, $1B-$2B AUM",
        status: "More Info Requested",
        score: 86,
        owner: "Roman Roy",
        due: "Fri 2:00 PM",
        source: "Attribution appendix",
        permissions: "GP-visible ask",
        lastActivity: "Downside case requested yesterday",
        next: "Attach downside construction case",
        matchId: "match-mosaic-diligence",
      },
      {
        id: "req-launchpad-active",
        lp: "Launchpad Fund of Funds",
        alias: "Fund of Funds, $500M AUM",
        status: "Approved",
        score: 79,
        owner: "Siobhan Roy",
        due: "Thu 3:30 PM",
        source: "Benchmark memo",
        permissions: "Room-only",
        lastActivity: "Portfolio construction memo viewed",
        next: "Confirm benchmark review agenda",
        matchId: "match-launchpad-diligence",
      },
      {
        id: "req-atlantic-ic",
        lp: "Atlantic Capital Partners",
        alias: "Institutional Allocator, $3B AUM",
        status: "IC review",
        score: 91,
        owner: "Gerri Kellman",
        due: "Monday 10:00 AM",
        source: "IC deck v1.4",
        permissions: "Revealed",
        lastActivity: "IC memo submitted 2d ago",
        next: "Send final reference contact details",
        matchId: "match-atlantic-ic",
      },
    ];
    const leadRow = revealRows[0];
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
        <MPPageHeader
          eyebrow="Reveal Requests"
          title="Reveal Requests"
            right={<MPButton onClick={() => setPage("matches")}>LP Matches</MPButton>}
        />
        </div>
        <div className="marketplace-overview-span-9">
          <MPDeskPanel title="Reveal Decision Ledger" kicker="Status, source docs, permissions, next action" style={{ minHeight: 470 }}>
            <MPTableHeader columns={["LP / alias", "Fit", "Status", "Due", "Source", "Next action"]} template="minmax(0,1.3fr) 54px 104px 100px 132px minmax(0,1.15fr)" />
            {revealRows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  setSelectedMatchId(row.matchId);
                  setPage(row.status === "Approved" || row.status === "IC review" ? "room" : "matches");
                }}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.3fr) 54px 104px 100px 132px minmax(0,1.15fr)",
                  ...MP_ROW_BASE,
                  minHeight: 58,
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  background: row.id === leadRow.id ? MP.accentSoft : "transparent",
                  color: MP.text,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <MPLpNameCell title={row.lp} meta={`${row.alias} · ${row.lastActivity}`} />
                <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: row.score >= 85 ? MP.green : MP.text }}>{row.score}</span>
                <MPPill tone={row.status === "Approved" || row.status === "IC review" ? "green" : row.status === "More Info Requested" ? "amber" : "blue"}>{row.status === "More Info Requested" ? "More info" : row.status}</MPPill>
                <span style={{ ...MP_TYPE.rowMeta, color: row.due.includes("Today") ? MP.amber : MP.soft }}>{row.due}</span>
                <span style={MP_TYPE.rowMeta}>{row.source}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.next}</span>
              </button>
            ))}
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-3">
          <MPDeskPanel title="Selected Request" kicker={leadRow.lp} style={{ minHeight: 470 }}>
            <MPDataRow label="Status" value={leadRow.status} />
            <MPDataRow label="Fit score" value={String(leadRow.score)} mono />
            <MPDataRow label="Owner" value={leadRow.owner} />
            <MPDataRow label="Due" value={leadRow.due} />
            <MPDataRow label="Source docs" value={leadRow.source} />
            <MPDataRow label="Permissions" value={leadRow.permissions} />
            <MPDataRow label="Last activity" value={leadRow.lastActivity} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, marginBottom: 8 }}>Allocator review path</div>
              <MPStatusRail status={leadRequest?.status || "Pending"} />
            </div>
            <div style={{ marginTop: "auto", paddingTop: 12 }}>
              <MPButton size="sm" onClick={() => setPage("documents")} style={{ width: "100%" }}>
                Complete Blocking Evidence
              </MPButton>
            </div>
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  const requestableCount = state.matches.filter((match) => match.requestable).length;
  const requiredReady = state.documents.required.filter((doc) => doc.status === "Ready").length;
  const requiredTotal = state.documents.required.length;
  const readinessChecks = [
    ["GP profile", "Firm, team, track record", state.gpProfile.completeness === 100],
    ["Fund profile", "Strategy, generation, terms", state.fundProfile.fundCompleteness === 100],
    ["Pitch deck", "Required for allocator packet", state.documents.required.some((doc) => doc.id === "deck" && doc.status === "Ready")],
    ["Required packet", `${requiredReady}/${requiredTotal} required files ready`, requiredReady === requiredTotal],
  ];
  const rankedPipeline = gpPipelineRows
    .slice()
    .sort((a, b) => {
      if (b.expectedValueValue !== a.expectedValueValue) {
        return b.expectedValueValue - a.expectedValueValue;
      }
      if (b.probability !== a.probability) return b.probability - a.probability;
      return b.fit - a.fit;
    });
  const commandInvestor =
    rankedPipeline.find((row) => row.id === selectedPipelineId) || rankedPipeline[0];
  const commandDrivers = commandInvestor.fitBreakdown
    .slice()
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const commandPressurePoints = commandInvestor.fitBreakdown
    .slice()
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);
  const totalExpectedValue = rankedPipeline.reduce(
    (sum, row) => sum + row.expectedValueValue,
    0
  );
  const activeReviewCount = rankedPipeline.filter((row) =>
    ["Active diligence", "Partner discussion"].includes(row.stage)
  ).length;
  const highConvictionCapital = rankedPipeline
    .filter((row) => row.probability >= 60)
    .reduce((sum, row) => sum + row.estimatedCheckValue, 0);
  const packetGaps = [
    ...state.documents.required.filter((doc) => doc.status !== "Ready"),
    ...state.documents.optional.filter(
      (doc) => doc.status !== "Ready" || !doc.visible
    ),
  ]
    .filter(
      (doc, index, docs) =>
        docs.findIndex((entry) => entry.id === doc.id) === index
    )
    .slice(0, 4);
  const weeklyFocus = rankedPipeline
    .slice()
    .sort((a, b) => {
      const pressureScore = (row) =>
        (row.urgency === "High" ? 2 : row.urgency === "Medium" ? 1 : 0) +
        (row.engagementTrend === "Falling" ? 2 : 0) +
        (row.status === "Blocked" ? 2 : row.status === "Cooling" ? 1 : 0);
      return pressureScore(b) - pressureScore(a) || b.expectedValueValue - a.expectedValueValue;
    })
    .slice(0, 3);
  const rankedMatchRows = state.matches.slice().sort((a, b) => b.score - a.score);
  const lpTableTemplate = "32px minmax(0,1.45fr) 52px 104px 92px minmax(0,.9fr)";

  if (page === "intelligence") {
    const segmentRows = [
      ["Endowments", "71%", "$2.8M", "6.4 days", "Attribution sensitivity"],
      ["Family offices", "64%", "$1.6M", "3.2 days", "Reference velocity"],
      ["Fund of funds", "58%", "$2.1M", "8.1 days", "Portfolio construction"],
      ["Foundations", "42%", "$950K", "5.7 days", "Impact reporting"],
    ];
    const frictionRows = [
      ["Founder references", "5 rooms", "High", "Blocks IC prep"],
      ["Attribution memo", "3 rooms", "High", "Blocks endowments"],
      ["Downside case", "2 rooms", "Medium", "Blocks risk teams"],
      ["Legal terms summary", "2 rooms", "Low", "Late-stage ask"],
    ];
    const heatRows = rankedPipeline.slice(0, 5).map((row) => [
      row.lp,
      row.engagementTrend,
      row.expectedValue,
      `${row.probability}%`,
      row.next,
      row.tone,
    ]);
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Market Intelligence"
            title="Capital Movement Signals"
            right={<MPButton size="sm" variant="secondary" onClick={() => setPage("overview")}>Command Center</MPButton>}
          />
        </div>

        <div className="marketplace-overview-span-12">
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              background: MP.panel,
              border: `1px solid ${MP.line}`,
              borderTop: `1px solid ${MP.line}`,
              borderRadius: MP.radius.sm,
              overflow: "hidden",
            }}
          >
            {[
              ["Best allocator segment", "Endowments"],
              ["Highest-friction diligence item", "Attribution memo"],
              ["Fastest-moving segment", "Family offices"],
              ["Most urgent capital path", "Pacific University Endowment"],
            ].map(([label, value], index) => (
              <div
                key={label}
                style={{
                  minHeight: 96,
                  display: "grid",
                  alignContent: "space-between",
                  padding: "15px 16px",
                  borderLeft: index === 0 ? "none" : `1px solid ${MP.line}`,
                }}
              >
                <div style={MP_TYPE.label}>{label}</div>
                <div>
                  <div style={{ color: MP.text, fontSize: 17, fontWeight: 620, lineHeight: 1.15 }}>{value}</div>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="marketplace-overview-span-8">
          <MPDeskPanel title="Allocator Segment Response" kicker="Where the fund resonates">
            <MPTableHeader columns={["Segment", "Accept", "Avg check", "Response", "Primary diligence issue"]} template="minmax(0,1fr) 64px 86px 86px minmax(0,1fr)" />
            {segmentRows.map(([segment, accept, check, response, issue]) => (
              <div key={segment} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 64px 86px 86px minmax(0,1fr)", ...MP_ROW_BASE }}>
                <span style={MP_TYPE.rowTitle}>{segment}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: MP.green }}>{accept}</span>
                <span className="marketplace-mono" style={MP_TYPE.number}>{check}</span>
                <span style={MP_TYPE.rowMeta}>{response}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{issue}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Diligence Friction" kicker="Conversion blockers">
            {frictionRows.map(([item, rooms, severity, effect]) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 58px 64px", gap: 10, alignItems: "center", padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", ...MP_TYPE.rowTitle }}>{item}</span>
                  <span style={{ display: "block", ...MP_TYPE.rowMeta, marginTop: 3 }}>{effect}</span>
                </span>
                <span className="marketplace-mono" style={MP_TYPE.number}>{rooms}</span>
                <MPPill tone={severity === "High" ? "amber" : "neutral"}>{severity}</MPPill>
              </div>
            ))}
          </MPDeskPanel>
        </div>

        <div className="marketplace-overview-span-12">
          <MPDeskPanel title="Capital Path Heat Map" kicker="Who is heating up or stalling">
            <MPTableHeader columns={["Allocator", "Signal", "EV", "Prob.", "Next move"]} template="minmax(0,1.25fr) 96px 74px 64px minmax(0,1.2fr)" />
            {heatRows.map(([lp, signal, ev, prob, next, tone]) => (
              <button key={lp} type="button" onClick={() => setPage("pipeline")} style={{ width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.25fr) 96px 74px 64px minmax(0,1.2fr)", ...MP_ROW_BASE, borderLeft: "none", borderRight: "none", borderBottom: "none", background: "transparent", color: MP.text, textAlign: "left", cursor: "pointer" }}>
                <MPLpNameCell title={lp} meta="Allocator relationship" />
                <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowTitle }}><MPStatusDot tone={tone === "green" ? "green" : tone === "amber" ? "amber" : "neutral"} />{signal}</span>
                <span className="marketplace-mono" style={MP_TYPE.number}>{ev}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: Number(String(prob).replace("%","")) >= 65 ? MP.green : MP.text }}>{prob}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next}</span>
              </button>
            ))}
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  const commandRows = [
    { lp: "Cedar Grove Family Office", stage: "Meeting scheduled", potential: "$500K-$1M", next: "Upload founder reference pack", priority: "High", tone: "green", owner: "Kendall Roy", due: "Today 4:00 PM", sourceDocs: "Deck, DDQ, refs", permissions: "Room-only", unread: 2, comments: 4, attachments: 7, docsReady: 7, version: "Packet v3.2", lastActivity: "LP viewed references 18m ago", stateChange: "Reveal approved -> meeting scheduled" },
    { lp: "Pacific University Endowment", stage: "Reveal approved", potential: "$1M-$5M", next: "Complete attribution memo", priority: "Critical", tone: "amber", owner: "Siobhan Roy", due: "Tomorrow 10:00 AM", sourceDocs: "Attribution memo", permissions: "LP review", unread: 3, comments: 6, attachments: 5, docsReady: 6, version: "Memo v1.8", lastActivity: "Analyst reopened attribution 42m ago", stateChange: "Pending -> approved" },
    { lp: "Mosaic Endowment", stage: "Diligence active", potential: "$1M-$3M", next: "Answer downside case", priority: "High", tone: "amber", owner: "Roman Roy", due: "Fri 2:00 PM", sourceDocs: "Downside case", permissions: "Room-only", unread: 1, comments: 3, attachments: 8, docsReady: 8, version: "Case v2.1", lastActivity: "Q&A added yesterday", stateChange: "Meeting complete -> diligence active" },
    { lp: "Launchpad Fund of Funds", stage: "Packet viewed 4x", potential: "$1M-$2M", next: "Request reveal", priority: "Medium", tone: "accent", owner: "Kendall Roy", due: "Mon 9:00 AM", sourceDocs: "Benchmark memo", permissions: "Anonymous", unread: 0, comments: 2, attachments: 6, docsReady: 6, version: "Packet v3.1", lastActivity: "Track record viewed 4x", stateChange: "Matched -> packet engaged" },
    { lp: "Atlantic Capital Partners", stage: "IC review", potential: "$2M-$4M", next: "Send final reference contacts", priority: "Critical", tone: "green", owner: "Gerri Kellman", due: "Today 1:30 PM", sourceDocs: "IC deck, refs", permissions: "Revealed", unread: 1, comments: 5, attachments: 9, docsReady: 9, version: "IC deck v1.4", lastActivity: "IC memo submitted 2d ago", stateChange: "Diligence complete -> IC review" },
    { lp: "Northgate University Mandate", stage: "Partner discussion", potential: "$2M-$4M", next: "Confirm IC agenda and memo owner", priority: "High", tone: "green", owner: "Roman Roy", due: "Tue 11:00 AM", sourceDocs: "University ref index", permissions: "LP review", unread: 0, comments: 2, attachments: 5, docsReady: 7, version: "Memo v1.2", lastActivity: "Partner note added this morning", stateChange: "First call -> partner discussion" },
    { lp: "Blue Lake Foundation", stage: "First meeting", potential: "$750K-$2M", next: "Send healthcare case study", priority: "Medium", tone: "accent", owner: "Tom Wambsgans", due: "Wed 3:00 PM", sourceDocs: "Healthcare case", permissions: "Anonymous", unread: 1, comments: 1, attachments: 4, docsReady: 5, version: "Case v1.0", lastActivity: "Meeting invite accepted", stateChange: "Reveal requested -> first meeting" },
    { lp: "Riverside Healthcare FoF", stage: "LP review", potential: "$1M-$4M", next: "Attach healthcare outcome addendum", priority: "Medium", tone: "green", owner: "Frank Vernon", due: "Thu 12:00 PM", sourceDocs: "Outcome addendum", permissions: "LP review", unread: 1, comments: 3, attachments: 6, docsReady: 7, version: "Addendum v1.3", lastActivity: "Healthcare template opened", stateChange: "Matched -> LP review" },
    { lp: "Summit Private Wealth Platform", stage: "Packet engaged", potential: "$1M-$4M", next: "Upload client-facing fund summary", priority: "Medium", tone: "accent", owner: "Siobhan Roy", due: "Fri 9:00 AM", sourceDocs: "Client summary", permissions: "Anonymous", unread: 0, comments: 2, attachments: 5, docsReady: 6, version: "Summary v0.8", lastActivity: "Client summary requested", stateChange: "Matched -> packet engaged" },
    { lp: "Veridian Multi-Family Office", stage: "Reveal requested", potential: "$750K-$2M", next: "Add portfolio support appendix", priority: "Medium", tone: "accent", owner: "Roman Roy", due: "Next week", sourceDocs: "Support appendix", permissions: "Anonymous", unread: 0, comments: 1, attachments: 4, docsReady: 5, version: "Appendix v1.0", lastActivity: "Operator support viewed", stateChange: "Matched -> reveal requested" },
    { lp: "Clearwater OCIO", stage: "Below threshold", potential: "$500K-$1.5M", next: "Add downside section to investment memo", priority: "Low", tone: "amber", owner: "Tom Wambsgans", due: "Next week", sourceDocs: "Investment memo", permissions: "Internal", unread: 0, comments: 1, attachments: 3, docsReady: 4, version: "Memo v0.9", lastActivity: "Threshold model refreshed", stateChange: "Watchlist -> below threshold" },
  ];
  const selectedCommand = commandRows[1];
  const pathLedger = [
    ["LPs matched", "15", "Ranked queue", "Rank by mandate strength", "Updated 22m ago"],
    ["Reveal requested", "7", "Consent pending", "Tighten request packets", "2 unread replies"],
    ["LPs reviewing", "5", "Attribution blocking", "Complete memo + refs", "Pacific reopened memo"],
    ["In diligence", "3", "Open asks", "Close document requests", "Mosaic added Q&A"],
    ["IC review", "1", "Committee prep", "Finalize reference pack", "Atlantic IC Monday"],
    ["Soft circle", "0", "No indication", "Convert Cedar Grove", "No change"],
    ["Committed", "0", "Awaiting IC", "Move first close", "No change"],
  ];
  return shell(
    <div className="marketplace-overview-grid">
      <div className="marketplace-overview-span-12">
        <MPPageHeader
          eyebrow="GP work queue"
          title="Capital Formation Desk"
          right={<MPButton size="sm" variant="secondary" onClick={() => setPage("intelligence")}>Market Intelligence</MPButton>}
        />
      </div>
      <div className="marketplace-overview-span-9">
        <MPDeskPanel title="Allocator Work Queue" kicker="Due dates, permissions, source docs">
          <MPTableHeader columns={["#", "Allocator / last activity", "State", "Potential", "Next action", "Due", "Docs"]} template="28px minmax(0,1.35fr) 124px 96px minmax(0,1.25fr) 104px 64px" />
          {commandRows.map((row, index) => (
            <button
              key={row.lp}
              type="button"
              onClick={() => setDetail({
                kicker: "Allocator work item",
                title: row.lp,
                subtitle: `${row.stage} · ${row.potential} potential · ${row.permissions}`,
                rows: [
                  ["Next action", row.next],
                  ["Owner", row.owner],
                  ["Due", row.due],
                  ["Source docs", row.sourceDocs],
                  ["Packet version", row.version],
                  ["Docs ready", `${row.docsReady}/9`],
                  ["Unread", `${row.unread} updates`],
                  ["Last activity", row.lastActivity],
                  ["State change", row.stateChange],
                ],
                sections: [
                  {
                    title: "Audit trail",
                    items: [
                      row.lastActivity,
                      `${row.owner} owns next action`,
                      `${row.sourceDocs} attached to ${row.permissions} workflow`,
                    ],
                  },
                ],
                actions: [
                  { label: "Open Decision Room", onClick: () => { setDetail(null); setPage("room"); } },
                ],
              })}
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "28px minmax(0,1.35fr) 124px 96px minmax(0,1.25fr) 104px 64px",
                ...MP_ROW_BASE,
                minHeight: 52,
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "none",
                background: index === 1 ? MP.accentSoft : "transparent",
                color: MP.text,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span className="marketplace-mono" style={{ color: index === 1 ? MP.text : MP.muted, fontSize: 11, fontWeight: 700 }}>{index + 1}</span>
              <MPLpNameCell title={row.lp} meta={row.lastActivity} />
              <span style={{ display: "flex", alignItems: "center", gap: 8, ...MP_TYPE.rowMeta, color: MP.text }}>
                <span style={{ width: 2, height: 16, borderRadius: 2, background: row.tone === "green" ? MP.green : row.tone === "amber" ? MP.amber : MP.accent }} />
                {row.stage}
              </span>
              <span className="marketplace-mono" style={{ color: MP.text, fontSize: 12.2, fontWeight: 560 }}>{row.potential}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.next}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: row.priority === "Critical" ? MP.amber : MP.soft }}>{row.due}</span>
              <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{row.docsReady}/9</span>
            </button>
          ))}
        </MPDeskPanel>
      </div>
      <div className="marketplace-overview-span-3">
        <MPDeskPanel title="Selected Work Item" kicker={selectedCommand.lp} style={{ minHeight: 430 }}>
          <MPDataRow label="Owner" value={selectedCommand.owner} />
          <MPDataRow label="Due" value={selectedCommand.due} />
          <MPDataRow label="Blocked capital" value={selectedCommand.potential} />
          <MPDataRow label="Source docs" value={selectedCommand.sourceDocs} />
          <MPDataRow label="Permissions" value={selectedCommand.permissions} />
          <MPDataRow label="Unread" value={`${selectedCommand.unread} updates`} />
          <MPDataRow label="Next action" value={selectedCommand.next} />
          <MPDataRow label="Docs ready" value={`${selectedCommand.docsReady}/9`} />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
            <div style={{ ...MP_TYPE.label, marginBottom: 7 }}>Audit trail</div>
            {["Analyst reopened attribution memo", "Siobhan assigned memo owner", "LP viewed source documents"].map((item, index) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr)", gap: 8, padding: "7px 0", borderTop: `1px solid ${MP.line}` }}>
                <span className="marketplace-mono" style={{ color: MP.muted, fontSize: 10 }}>{index + 1}</span>
                <span style={{ color: MP.soft, fontSize: 12, lineHeight: 1.35 }}>{item}</span>
              </div>
            ))}
          </div>
        </MPDeskPanel>
      </div>
      <div className="marketplace-overview-span-12">
        <MPDeskPanel title="Capital Path Ledger" kicker="Movement and next unlock">
          <MPTableHeader columns={["Stage", "Count", "State", "Next unlock", "Last movement"]} template="minmax(0,1fr) 58px 150px minmax(0,1.2fr) 170px" />
          {pathLedger.map(([stage, count, stateLabel, unlock, movement]) => (
            <div key={stage} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 58px 150px minmax(0,1.2fr) 170px", ...MP_ROW_BASE, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
              <span style={MP_TYPE.rowTitle}>{stage}</span>
              <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: count === "0" ? MP.muted : MP.text }}>{count}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{stateLabel}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{unlock}</span>
              <span style={MP_TYPE.rowMeta}>{movement}</span>
            </div>
          ))}
        </MPDeskPanel>
      </div>
    </div>
  );
}

export function DiligenceOSDemoWorkspace({ user, onLogout }) {
  const managerName = "Crescent Ridge Partners IV";
  const fileInputRef = useRef(null);
  const [screen, setScreen] = useState(() => {
    if (typeof window === "undefined") return "upload";
    return new URLSearchParams(window.location.search).get("screen") || "upload";
  });
  const [uploadedFiles, setUploadedFiles] = useState([
    ["Blue Heron Growth IV Overview.pdf", "Uploaded"],
    ["PPM.pdf", "Uploaded"],
    ["Track Record.xlsx", "Uploaded"],
    ["DDQ.docx", "Uploaded"],
    ["LPA.pdf", "Uploaded"],
    ["Capital Account Statements.pdf", "Uploaded"],
    ["Portfolio Company List.xlsx", "Uploaded"],
  ]);
  const [processingPulse, setProcessingPulse] = useState(0);
  const [extractionProgress, setExtractionProgress] = useState([0, 0, 0, 0, 0]);
  const [reviewReady, setReviewReady] = useState(false);
  const [selectedDecisionStage, setSelectedDecisionStage] = useState("Follow-Up Requested");
  const [followUpType, setFollowUpType] = useState("performance");
  const [uploadPromptOpen, setUploadPromptOpen] = useState(false);
  const [lpMenuOpen, setLpMenuOpen] = useState(false);

  useEffect(() => {
    if (screen !== "processing") return undefined;
    setReviewReady(false);
    setExtractionProgress([0, 0, 0, 0, 0]);
    setProcessingPulse(0);
    const stepTicks = [0, 0, 0, 0, 0];
    const stepIncrements = [
      [0, 14, 0, 18, 8, 0, 16, 20, 0, 14, 10],
      [0, 12, 0, 16, 10, 0, 18, 15, 0, 17, 12],
      [0, 15, 0, 14, 12, 0, 18, 16, 0, 15, 10],
      [0, 12, 0, 18, 8, 0, 14, 20, 0, 16, 12],
      [0, 6, 0, 8, 0, 7, 5, 0, 9, 0, 6, 8, 0, 7, 5, 0, 9, 6, 0, 7, 5],
    ];
    const timer = setInterval(() => {
      setExtractionProgress((current) => {
        const activeIndex = current.findIndex((value) => value < 100);
        if (activeIndex === -1) {
          clearInterval(timer);
          setTimeout(() => setReviewReady(true), 300);
          return current;
        }
        setProcessingPulse(activeIndex);
        const next = [...current];
        const increments = stepIncrements[activeIndex];
        next[activeIndex] = Math.min(100, next[activeIndex] + increments[stepTicks[activeIndex] % increments.length]);
        stepTicks[activeIndex] += 1;
        if (next.every((value) => value >= 100)) {
          clearInterval(timer);
          setTimeout(() => setReviewReady(true), 650);
        }
        return next;
      });
    }, 450);
    return () => clearInterval(timer);
  }, [screen]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadPromptOpen(false);
    setUploadedFiles((files) => [[file.name, "Uploading", 0], ...files]);
    let progress = 0;
    let tick = 0;
    const startedAt = Date.now();
    const uploadSteps = [0, 0, 2, 0, 4, 0, 8, 0, 3, 0, 10, 0, 4, 0, 8, 0, 12, 0, 5, 0, 10, 0, 6, 0, 9, 0, 12];
    const uploadTimer = window.setInterval(() => {
      tick += 1;
      const elapsed = Date.now() - startedAt;
      const maxProgress = elapsed >= 13500 ? 100 : 96;
      progress = elapsed >= 14000 ? 100 : Math.min(maxProgress, progress + uploadSteps[(tick - 1) % uploadSteps.length]);
      setUploadedFiles((files) =>
        files.map((entry) =>
          entry[0] === file.name ? [entry[0], progress >= 100 ? "Uploaded" : "Uploading", progress] : entry
        )
      );
      if (progress >= 100) {
        window.clearInterval(uploadTimer);
        setUploadPromptOpen(true);
        showToast(`${file.name} uploaded`, "success");
      }
    }, 500);
    event.target.value = "";
  };
  const supportedFiles = [
    "Fund Deck",
    "PPM",
    "DDQ",
    "LPA",
    "Track Record",
    "Data Room Export",
    "Capital Account Statements",
    "Portfolio Company List",
  ];
  const processingSteps = [
    ["Analyzing fund terms", "Target fund size, management fee, carry, GP commit, hurdle, term."],
    ["Parsing track record", "Gross MOIC, net TVPI, DPI, loss ratio, realized vs. unrealized value."],
    ["Mapping strategy fit", "Stage, sector, geography, check size, return profile, liquidity."],
    ["Identifying diligence gaps", "Missing documents, unanswered DDQ fields, unclear performance metrics."],
    ["Generating LP memo", "Summary, risks, follow-up questions, suggested next action."],
  ];
  const sourceMaterials = [
    [`${managerName} Investment Memo.pdf`, "Parsed: strategy, team, portfolio construction"],
    ["PPM.pdf", "Parsed: fund terms, risk disclosures, fees"],
    ["Track Record.xlsx", "Parsed: realized/unrealized performance, company-level returns"],
    ["DDQ.docx", "Parsed: operations, compliance, team, references"],
    ["LPA.pdf", "Parsed: governance, key person, fees, side letter terms"],
  ];
  const lpProfileRows = [
    ["Allocator", "Stanford Endowment"],
    ["Mandate", "Software growth equity"],
    ["Target check", "$8M-$15M"],
    ["Fund size", "$100M-$250M"],
    ["Stage", "Fund III / IV"],
    ["IC constraint", "Net performance required"],
  ];
  const missingItems = [
    "Net performance bridge",
    "Full cash-flow schedule",
    "Portfolio company ownership detail",
    "Reference list",
    "Valuation policy",
  ];
  const trackMetrics = [
    ["Gross MOIC", "2.8x", "High"],
    ["Net TVPI", "Missing", "Low"],
    ["DPI", "0.4x", "Medium"],
    ["Loss Ratio", "Missing", "Low"],
    ["Realized Deals", "3", "Medium"],
  ];
  const fitBreakdown = [
    ["Strategy Fit", "94%"],
    ["Check Size Fit", "88%"],
    ["Geography Fit", "91%"],
    ["Return Profile Fit", "76%"],
    ["Liquidity Fit", "68%"],
    ["Risk Fit", "64%"],
    ["Terms Fit", "71%"],
  ];
  const redFlags = [
    ["Missing gross-to-net bridge", "Manager provides gross MOIC but no full net TVPI bridge."],
    ["Low realized performance detail", "DPI is referenced but not supported with full cash-flow data."],
    ["Concentration risk", "Marked returns appear dependent on a small number of unrealized assets."],
    ["Key person exposure", "Sourcing appears concentrated across two senior partners."],
  ];
  const missingChecklist = [
    "Full fund-level cash flows",
    "Net TVPI / DPI by vintage",
    "Gross-to-net performance bridge",
    "Portfolio company ownership %",
    "Valuation policy",
    "LP reference list",
    "Co-investment allocation policy",
  ];
  const stages = [
    "New Opportunity",
    "Materials Received",
    "Initial Review Complete",
    "Follow-Up Requested",
    "Diligence Meeting Scheduled",
    "IC Review",
    "Soft Circle",
    "Commit / Pass",
  ];
  const nextBestActions = {
    "New Opportunity": "Confirm the manager fits the software growth mandate before requesting more files.",
    "Materials Received": "Run extraction and identify missing diligence materials.",
    "Initial Review Complete": "Review red flags with the private markets team before scheduling a manager call.",
    "Follow-Up Requested": "Request missing performance materials before scheduling IC review.",
    "Diligence Meeting Scheduled": "Prepare agenda around net performance, valuation policy, and key-person exposure.",
    "IC Review": "Attach final memo, source documents, and risk summary to the IC packet.",
    "Soft Circle": "Confirm allocation size, legal review timing, and final reference calls.",
    "Commit / Pass": "Record final decision, rationale, and audit trail.",
  };
  const followUpCopies = {
    performance: `Hi [Manager Name],

Thank you for sharing the materials for ${managerName}. We have completed an initial review and would appreciate a few additional performance items before moving forward:

Full fund-level cash-flow schedule for prior funds
Gross-to-net performance bridge, including management fees, carry, and expenses
Net TVPI, DPI, and RVPI by vintage
Realized vs. unrealized attribution by portfolio company
Portfolio company ownership percentages and entry valuations
Valuation policy for unrealized holdings

Once we receive these materials, we can complete the diligence memo and determine whether to advance the opportunity to IC review.

Best,
[Allocator Name]`,
    legal: `Hi [Manager Name],

Thank you for the initial materials for ${managerName}. Before we proceed, please send the legal and governance materials below:

Current LPA and side letter template
Key person clause detail
Fee and expense allocation language
GP commitment documentation
Valuation policy for unrealized holdings
Co-investment allocation policy

These materials will help us complete legal review before the opportunity is advanced.

Best,
[Allocator Name]`,
    references: `Hi [Manager Name],

Thank you for sharing the ${managerName} materials. We would like to complete reference diligence before deciding whether to move the opportunity forward:

LP reference list
Founder / management team references for realized deals
Co-investor references for the top three marked positions
Reference availability for the two senior sourcing partners
Any third-party valuation support for unrealized assets

Once received, we can complete the follow-up section of the diligence memo.

Best,
[Allocator Name]`,
  };

  const tabs = [
    ["upload", "Upload"],
    ["processing", "AI Analysis"],
    ["dashboard", "Diligence Review"],
    ["followup", "Follow-Up"],
    ["decision", "Decision Room"],
  ];
  const memoExportActions = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {[
        ["Download review", "/downloadbutton.png", () => showToast("Diligence review downloaded", "success"), 18],
        ["Send to Google Drive", "/google-drive-icon.png", () => showToast("Sent to Google Drive", "success"), 20],
      ].map(([label, src, onClick, size]) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          onClick={onClick}
          style={{
            width: 34,
            height: 30,
            borderRadius: MP.radius.xs,
            border: `1px solid ${MP.lineStrong}`,
            background: MP.panel2,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img src={src} alt="" style={{ width: size, height: size, objectFit: "contain" }} />
        </button>
      ))}
    </div>
  );

  const showUpload = () => {
    const activeUpload = uploadedFiles.find(([, status]) => status === "Uploading");
    const activeProgress = activeUpload?.[2] || 0;

    return (
    <div style={{ display: "grid", placeItems: "center", padding: "18px 0 40px" }}>
      <MPCard
        style={{
          width: "min(760px, 100%)",
          padding: 0,
          overflow: "hidden",
          background: MP.panel,
          borderColor: "rgba(113,102,216,.28)",
          boxShadow: "0 0 0 1px rgba(113,102,216,.05), 0 22px 64px rgba(5,8,14,.34), 0 0 42px rgba(113,102,216,.08)",
        }}
      >
        <div style={{ padding: "30px 32px", borderBottom: `1px solid ${MP.line}`, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 720, color: MP.text, lineHeight: 1.1 }}>Upload Fund Materials</div>
          <div style={{ color: MP.soft, fontSize: 13.5, lineHeight: 1.5, margin: "10px auto 0", maxWidth: 560 }}>
            Drop a manager packet into one workflow and generate an allocator-ready review.
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
            {supportedFiles.map((file) => (
              <MPPill key={file} tone="neutral">{file}</MPPill>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <MPButton
            onClick={() => fileInputRef.current?.click()}
            style={{ marginTop: 22, minWidth: 180 }}
          >
            Upload Documents
          </MPButton>
          {activeUpload && (
            <div style={{ maxWidth: 430, margin: "16px auto 0", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
                <span style={{ color: MP.soft, fontSize: 12, fontWeight: 560, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Uploading {activeUpload[0]}
                </span>
                <span className="marketplace-mono" style={{ color: MP.green, fontSize: 11, fontWeight: 760 }}>
                  {Math.round(activeProgress)}%
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: MP.line, overflow: "hidden" }}>
                <div style={{ width: `${activeProgress}%`, height: "100%", background: MP.green, transition: "width .5s ease" }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "20px 24px 24px" }}>
          <MPTableHeader columns={["Past Documents", "Status"]} template="minmax(0,1fr) 112px" />
          {uploadedFiles.map(([file, status], index) => (
            <div key={`${file}-${index}`} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 112px", ...MP_ROW_BASE, minHeight: 46, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
              <span style={MP_TYPE.rowTitle}>{file}</span>
              <MPPill tone={status === "Uploading" ? "amber" : "green"}>{status}</MPPill>
            </div>
          ))}
        </div>
      </MPCard>
      {uploadPromptOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 12000,
            display: "grid",
            placeItems: "center",
            background: "rgba(8,11,17,.58)",
            backdropFilter: "blur(12px) saturate(1.1)",
            padding: 24,
          }}
        >
          <MPCard
            style={{
              width: "min(460px, 100%)",
              background: `linear-gradient(180deg, ${MP.panel2}, ${MP.panel})`,
              borderColor: "rgba(113,102,216,.28)",
              boxShadow: "0 24px 70px rgba(4,7,14,.46), 0 0 0 1px rgba(113,102,216,.06)",
              textAlign: "left",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, color: MP.green }}>Upload complete</div>
              <div style={{ fontSize: 23, fontWeight: 740, color: MP.text, lineHeight: 1.15, marginTop: 7 }}>
                Generate Diligence Review
              </div>
            </div>
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ color: MP.soft, fontSize: 13.2, lineHeight: 1.55 }}>
                The uploaded document is ready to be analyzed against the allocator mandate and source-material checklist.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <div style={{ padding: "10px 12px", borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: "rgba(255,255,255,.025)" }}>
                  <div style={MP_TYPE.label}>Status</div>
                  <div style={{ color: MP.text, fontSize: 13, fontWeight: 660, marginTop: 5 }}>Uploaded</div>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: "rgba(255,255,255,.025)" }}>
                  <div style={MP_TYPE.label}>Next step</div>
                  <div style={{ color: MP.text, fontSize: 13, fontWeight: 660, marginTop: 5 }}>AI Analysis</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
                <MPButton variant="secondary" onClick={() => setUploadPromptOpen(false)}>
                  Stay Here
                </MPButton>
                <MPButton onClick={() => { setUploadPromptOpen(false); setScreen("processing"); }}>
                  Generate Review
                </MPButton>
              </div>
            </div>
          </MPCard>
        </div>
      )}
    </div>
    );
  };

  const showProcessing = () => (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap", padding: "0 4px 0 16px" }}>
        <div>
          <div style={{ ...MP_TYPE.label, color: MP.accent2 }}>AI analysis pipeline</div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.08, marginTop: 7 }}>Analyzing Fund Materials</div>
        </div>
      </div>
      <div className="marketplace-grid-3">
        {processingSteps.map(([title, body], index) => {
          const active = processingPulse === index;
          const progress = extractionProgress[index] || 0;
          return (
            <MPCard key={title} style={{ minHeight: 184, display: "flex", flexDirection: "column", background: active ? MP.panel2 : MP.panel, borderColor: active ? "rgba(113,102,216,.34)" : MP.line }}>
              <div style={{ width: 24, height: 24, borderRadius: 999, border: `1px solid ${active ? MP.accent2 : MP.lineStrong}`, display: "grid", placeItems: "center", color: active ? MP.accent2 : MP.muted, fontSize: 11, fontWeight: 800, marginBottom: 18 }}>
                {index + 1}
              </div>
              <div style={{ color: MP.text, fontSize: 16, fontWeight: 680, lineHeight: 1.25 }}>{title}</div>
              <div style={{ color: MP.soft, fontSize: 13, lineHeight: 1.55, marginTop: 10 }}>{body}</div>
              <div style={{ height: 5, background: MP.line, borderRadius: 999, overflow: "hidden", marginTop: "auto" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: MP.green, transition: "width .42s ease" }} />
              </div>
              <div className="marketplace-mono" style={{ color: progress >= 100 ? MP.green : MP.soft, fontSize: 11, marginTop: 8 }}>
                {progress >= 100 ? "Complete" : `${progress}%`}
              </div>
            </MPCard>
          );
        })}
      </div>
      {reviewReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 12000,
            display: "grid",
            placeItems: "center",
            background: "rgba(8,11,17,.58)",
            backdropFilter: "blur(12px) saturate(1.1)",
            padding: 24,
          }}
        >
          <MPCard
            style={{
              width: "min(480px, 100%)",
              background: `linear-gradient(180deg, ${MP.panel2}, ${MP.panel})`,
              borderColor: "rgba(98,201,146,.32)",
              boxShadow: "0 24px 70px rgba(4,7,14,.46), 0 0 0 1px rgba(98,201,146,.06)",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, color: MP.green }}>Review complete</div>
              <div style={{ fontSize: 24, fontWeight: 740, color: MP.text, lineHeight: 1.15, marginTop: 7 }}>
                Diligence review ready
              </div>
            </div>
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ color: MP.soft, fontSize: 13.3, lineHeight: 1.55 }}>
                The memo, red flags, missing information checklist, and mandate fit score are ready for review.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 14 }}>
                {[
                  ["Memo", "Generated"],
                  ["Red flags", "4"],
                  ["Missing", "7 items"],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "10px 12px", borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: "rgba(255,255,255,.025)" }}>
                    <div style={MP_TYPE.label}>{label}</div>
                    <div style={{ color: MP.text, fontSize: 13, fontWeight: 680, marginTop: 5 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
                <MPButton onClick={() => setScreen("dashboard")}>
                  Open Diligence Review
                </MPButton>
              </div>
            </div>
          </MPCard>
        </div>
      )}
    </div>
  );

  const showDashboard = () => (
    <div style={{ display: "grid", gap: 20 }}>
      <MPCard
        style={{
          padding: "18px 20px",
          background: MP.panel,
          borderColor: "rgba(113,102,216,.22)",
          boxShadow: "0 0 0 1px rgba(113,102,216,.035), 0 12px 34px rgba(5,8,14,.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ ...MP_TYPE.label, color: MP.green }}>AI review complete</div>
            <div style={{ fontSize: 24, fontWeight: 720, lineHeight: 1.1, marginTop: 6 }}>{managerName} - Diligence Review</div>
          </div>
        </div>
      </MPCard>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(360px,.75fr)", gap: 20, alignItems: "start" }}>
        <MPDeskPanel
          title="Generated LP Diligence Memo"
          kicker="Allocator-ready memo"
          action={memoExportActions}
          style={{
            minHeight: 650,
            borderColor: "rgba(113,102,216,.28)",
            boxShadow: "0 0 0 1px rgba(113,102,216,.04), 0 18px 46px rgba(5,8,14,.22)",
          }}
        >
          <MPCard style={{ background: MP.panel2, marginBottom: 16 }}>
            <MPSectionTitle title="1. Executive Summary" />
            <div style={{ color: MP.soft, fontSize: 13, fontWeight: 420, lineHeight: 1.6 }}>
              {managerName} is a $175M lower-middle-market growth equity fund focused on vertical software and tech-enabled services. The manager shows strong sourcing discipline and early realized performance, but materials lack a complete gross-to-net bridge and detailed attribution by deal.
            </div>
          </MPCard>
          <MPCard style={{ background: MP.panel2, marginBottom: 16 }}>
            <MPSectionTitle title="2. Strategy Overview" />
            {[
              "Lower-middle-market growth equity",
              "Vertical software / tech-enabled services",
              "North America focus",
              "$5M-$15M equity checks",
              "Targeting founder-led businesses with $3M-$15M ARR",
            ].map((item) => (
              <div key={item} style={{ padding: "7px 0", borderTop: `1px solid ${MP.line}`, color: MP.text, fontSize: 12.8, fontWeight: 520 }}>{item}</div>
            ))}
          </MPCard>
          <MPCard style={{ background: MP.panel2, marginBottom: 16 }}>
            <MPSectionTitle title="3. Market & Macro Environment" />
            {[
              ["Sector Outlook", "Software growth remains supported by workflow automation budgets and vertical AI adoption, with risk from elongated enterprise sales cycles and valuation compression."],
              ["Competitive Landscape", "Other specialist growth GPs are bidding for the same founder-led software assets, especially in compliance, healthcare operations, and industrial workflow software."],
            ].map(([label, body]) => (
              <div key={label} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                <div style={{ color: MP.text, fontSize: 12.8, fontWeight: 650 }}>{label}</div>
                <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.48, marginTop: 4 }}>{body}</div>
              </div>
            ))}
          </MPCard>
          <MPCard style={{ background: MP.panel2, marginBottom: 16 }}>
            <MPSectionTitle title="4. Track Record Assessment" />
            <MPTableHeader columns={["Metric", "Extracted Value", "Confidence"]} template="minmax(0,1fr) 116px 90px" />
            {trackMetrics.map(([metric, value, confidence]) => (
              <div key={metric} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 116px 90px", ...MP_COMPACT_ROW_BASE }}>
                <span style={MP_TYPE.rowTitle}>{metric}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: value === "Missing" ? MP.amber : MP.text }}>{value}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: confidence === "High" ? MP.green : confidence === "Low" ? MP.amber : MP.soft }}>{confidence}</span>
              </div>
            ))}
            <div style={{ color: MP.soft, fontSize: 12.3, fontWeight: 420, lineHeight: 1.55, marginTop: 12 }}>
              The track record appears promising but is not yet institutionally complete. Net returns, fund-level cash flows, and realized/unrealized attribution are required before IC review.
            </div>
          </MPCard>
          <div className="marketplace-grid-2">
            <MPCard style={{ background: MP.panel2 }}>
              <MPSectionTitle title="5. Fund Terms" />
              {[
                ["Management fee", "2.0%"],
                ["Carry", "20%"],
                ["Hurdle", "8%"],
                ["GP commit", "2.5%"],
                ["Fund term", "10 years + extensions"],
                ["Key person clause", "Present; language requires review"],
              ].map(([label, value]) => (
                <MPDataRow key={label} label={label} value={value} />
              ))}
            </MPCard>
            <MPCard style={{ background: MP.panel2 }}>
              <MPSectionTitle title="6. Investment Risks" />
              {[
                ["Performance opacity", "Net returns and fund-level cash flows are missing."],
                ["Key person risk", "Two senior partners appear responsible for most sourcing."],
                ["Portfolio concentration", "Top 3 deals represent a high percentage of marked value."],
                ["Valuation risk", "Unrealized marks lack detailed third-party valuation support."],
              ].map(([title, body]) => (
                <div key={title} style={{ padding: "9px 0", borderTop: `1px solid ${MP.line}` }}>
                  <div style={{ color: MP.text, fontSize: 12.7, fontWeight: 640 }}>{title}</div>
                  <div style={{ color: MP.soft, fontSize: 12.1, lineHeight: 1.4, marginTop: 3 }}>{body}</div>
                </div>
              ))}
            </MPCard>
          </div>
        </MPDeskPanel>

        <MPDeskPanel
          title="Decision Panel"
          kicker="LP action system"
          style={{
            minHeight: 650,
            borderColor: "rgba(113,102,216,.22)",
            boxShadow: "0 0 0 1px rgba(113,102,216,.035), 0 18px 46px rgba(5,8,14,.2)",
          }}
        >
          <div style={{ textAlign: "center", padding: "10px 0 18px", borderBottom: `1px solid ${MP.line}` }}>
            <div style={{ ...MP_TYPE.label, color: MP.accent2 }}>Mandate Fit Score</div>
            <div className="marketplace-mono" style={{ fontSize: 54, fontWeight: 760, color: MP.green, lineHeight: 1, marginTop: 8 }}>82%</div>
          </div>
          <MPTableHeader columns={["Category", "Score"]} template="minmax(0,1fr) 62px" style={{ marginTop: 14 }} />
          {fitBreakdown.map(([label, score]) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 62px", ...MP_COMPACT_ROW_BASE }}>
              <span style={MP_TYPE.rowTitle}>{label}</span>
              <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: Number(score.replace("%", "")) >= 80 ? MP.green : MP.amber }}>{score}</span>
            </div>
          ))}
          <div style={{ ...MP_TYPE.label, marginTop: 4 }}>Red Flags</div>
          {redFlags.map(([title, body], index) => (
            <div key={title} style={{ padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
              <div style={{ color: MP.text, fontSize: 12.8, fontWeight: 640 }}>{index + 1}. {title}</div>
              <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.42, marginTop: 4 }}>{body}</div>
            </div>
          ))}
          <div style={{ ...MP_TYPE.label, marginTop: 20 }}>Missing Information</div>
          {missingChecklist.map((item) => (
            <div key={item} style={{ display: "grid", gridTemplateColumns: "16px minmax(0,1fr)", gap: 9, padding: "8px 0", borderTop: `1px solid ${MP.line}` }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${MP.lineStrong}`, marginTop: 1 }} />
              <span style={{ color: MP.soft, fontSize: 12.1, lineHeight: 1.35 }}>{item}</span>
            </div>
          ))}
          <div style={{ ...MP_TYPE.label, marginTop: 16 }}>Follow-Up Plan</div>
          {[
            ["Primary ask", "Gross-to-net bridge + cash-flow schedule"],
            ["Legal queue", "Key person and expense language review"],
            ["Reference track", "Two LP calls and one founder reference"],
            ["IC readiness", "Hold until performance support is attached"],
          ].map(([label, value]) => (
            <MPDataRow key={label} label={label} value={value} />
          ))}
          <div style={{ marginTop: 14, padding: 12, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2 }}>
            <div style={{ ...MP_TYPE.label, color: MP.green }}>Recommended next move</div>
            <div style={{ color: MP.text, fontSize: 13, fontWeight: 620, lineHeight: 1.45, marginTop: 7 }}>
              Send the performance follow-up request before scheduling IC prep. Advance only after net returns, cash flows, and valuation policy are reconciled against the source files.
            </div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
            <MPButton onClick={() => setScreen("followup")} style={{ width: "100%" }}>Generate Follow-Up Request</MPButton>
          </div>
        </MPDeskPanel>
      </div>
    </div>
  );

  const showFollowUp = () => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 16, alignItems: "start" }}>
      <MPDeskPanel title="AI-Generated Follow-Up Request" kicker="Drafted allocator message" style={{ minHeight: 540 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            ["performance", "Performance"],
            ["legal", "Legal"],
            ["references", "References"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFollowUpType(id)}
              style={{
                border: `1px solid ${followUpType === id ? "rgba(113,102,216,.42)" : MP.line}`,
                background: followUpType === id ? MP.accentSoft : MP.panel2,
                color: followUpType === id ? MP.text : MP.soft,
                borderRadius: 999,
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ background: MP.panel2, border: `1px solid ${MP.line}`, borderRadius: MP.radius.sm, padding: "22px 18px 18px", color: MP.text, fontSize: 13.2, lineHeight: 1.66, whiteSpace: "pre-line" }}>
          {followUpCopies[followUpType]}
        </div>
      </MPDeskPanel>
      <MPDeskPanel title="Actions" kicker="Follow-up workflow" style={{ minHeight: 540 }}>
        <MPButton onClick={() => showToast("Request copied", "success")} style={{ width: "100%", marginBottom: 10 }}>Copy Request</MPButton>
        <MPButton variant="secondary" onClick={() => showToast("Sent to manager", "success")} style={{ width: "100%", marginBottom: 10 }}>Send to Manager</MPButton>
        <MPButton variant="secondary" onClick={() => setScreen("decision")} style={{ width: "100%" }}>Move to Decision Room</MPButton>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${MP.line}` }}>
          {missingChecklist.map((item) => (
            <div key={item} style={{ display: "grid", gridTemplateColumns: "16px minmax(0,1fr)", gap: 9, padding: "6px 0", borderTop: `1px solid ${MP.line}` }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${MP.amber}`, marginTop: 2 }} />
              <span style={{ color: MP.soft, fontSize: 12.1 }}>{item}</span>
            </div>
          ))}
        </div>
      </MPDeskPanel>
    </div>
  );

  const showDecisionMove = () => (
    <div style={{ display: "grid", placeItems: "center", padding: "18px 0 40px" }}>
      <MPCard style={{ width: "min(860px, 100%)", background: MP.panel, padding: 24 }}>
        <MPSectionTitle title="Move Opportunity to Decision Room" kicker="MandateOS workflow handoff" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginTop: 12 }}>
          {stages.map((stage) => {
            const active = stage === selectedDecisionStage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedDecisionStage(stage)}
                style={{ minHeight: 72, borderRadius: MP.radius.sm, border: `1px solid ${active ? "rgba(113,102,216,.42)" : MP.line}`, background: active ? MP.accentSoft : MP.panel2, color: active ? MP.text : MP.soft, fontSize: 12.5, fontWeight: active ? 700 : 540, cursor: "pointer", textAlign: "left", padding: 12 }}
              >
                {stage}
              </button>
            );
          })}
        </div>
        <MPCard style={{ background: MP.panel2, marginTop: 18 }}>
          <MPSectionTitle title="Next Best Action" />
          <div style={{ color: MP.text, fontSize: 15, fontWeight: 650, lineHeight: 1.45 }}>
            {nextBestActions[selectedDecisionStage]}
          </div>
        </MPCard>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <MPButton variant="secondary" onClick={() => showToast("Review saved", "success")}>Save Review</MPButton>
          <MPButton variant="secondary" onClick={() => showToast("Shared internally", "success")}>Share Internally</MPButton>
          <MPButton variant="secondary" onClick={() => setScreen("followup")}>Create Manager Follow-Up</MPButton>
          <MPButton onClick={() => showToast("Opportunity moved to Decision Room", "success")}>Move to Decision Room</MPButton>
        </div>
      </MPCard>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: MP.workspace, color: MP.text, fontFamily: MP.type.body }}>
      <div style={{ height: 58, borderBottom: `1px solid ${MP.line}`, background: MP.panel, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <button type="button" onClick={onLogout} style={{ border: "none", background: "transparent", color: MP.text, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 720 }}>
          <LogoMark size={22} />
          MandateOS
        </button>
        <MPButton size="sm" variant="secondary" onClick={onLogout}>Back to site</MPButton>
      </div>
      <main style={{ maxWidth: 1500, margin: "0 auto", padding: "28px 28px 54px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <div style={{ maxWidth: 760, padding: "2px 0 4px" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 740,
                lineHeight: 1.08,
                letterSpacing: 0,
                color: MP.text,
              }}
            >
              DiligenceOS
            </div>
            <div style={{ color: MP.soft, fontSize: 15, lineHeight: 1.5, marginTop: 9 }}>
              Allocator-grade fund diligence in minutes.
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setLpMenuOpen((open) => !open)}
              style={{
                minWidth: 210,
                height: 42,
                borderRadius: 999,
                border: `1px solid ${MP.lineStrong}`,
                background: MP.panel,
                color: MP.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "0 12px 0 8px",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: MP.accentSoft, border: `1px solid rgba(113,102,216,.28)`, display: "grid", placeItems: "center", color: MP.text, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                  LP
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 680, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Stanford Endowment
                  </span>
                  <span style={{ display: "block", color: MP.soft, fontSize: 10.5, marginTop: 1 }}>
                    LP workspace
                  </span>
                </span>
              </span>
              <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" style={{ flexShrink: 0 }}>
                <path d="M3 3.2 9 7.4 15 3.2" fill="none" stroke={MP.soft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {lpMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 48,
                  right: 0,
                  zIndex: 20,
                  width: 230,
                  borderRadius: MP.radius.sm,
                  border: `1px solid ${MP.lineStrong}`,
                  background: MP.panel,
                  boxShadow: MP.shadow.elevated,
                  padding: 8,
                }}
              >
                {[
                  ["Stanford Endowment", "Active LP profile"],
                  ["LP Mandate", "Software growth equity"],
                  ["Edit", "Update allocator profile"],
                  ["Settings", "Workspace preferences"],
                  ["Log out", "Back to site"],
                ].map(([label, meta]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={label === "Log out" ? onLogout : () => setLpMenuOpen(false)}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      color: MP.text,
                      padding: "9px 10px",
                      borderRadius: MP.radius.xs,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ display: "block", fontSize: 12.5, fontWeight: 640 }}>{label}</span>
                    <span style={{ display: "block", color: MP.soft, fontSize: 10.8, marginTop: 2 }}>{meta}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 26, borderBottom: `1px solid ${MP.line}`, marginBottom: 20, overflowX: "auto" }}>
          {tabs.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setScreen(id)} style={{ border: "none", borderBottom: `2px solid ${screen === id ? MP.accent2 : "transparent"}`, background: "transparent", color: screen === id ? MP.text : MP.soft, padding: "0 2px 12px", fontSize: 13.5, fontWeight: screen === id ? 680 : 520, cursor: "pointer", whiteSpace: "nowrap" }}>
              {label}
            </button>
          ))}
        </div>

        {screen === "upload" && showUpload()}
        {screen === "processing" && showProcessing()}
        {screen === "dashboard" && showDashboard()}
        {screen === "followup" && showFollowUp()}
        {screen === "decision" && showDecisionMove()}
      </main>
    </div>
  );
}

export function MarketplaceLPDemoWorkspace({ user, onLogout, initialPage }) {
  const [state, updateState, resetState] = useMarketplaceDemoState();
  const [page, setPage] = useState(() => getMarketplaceInitialPage(initialPage || "overview"));
  const [selectedRequestId, setSelectedRequestId] = useState(state.matchRequests[0]?.id || null);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [freshRevealRequest, setFreshRevealRequest] = useState(null);
  const [detail, setDetail] = useState(null);
  const selectedRequest =
    state.matchRequests.find((request) => request.id === selectedRequestId) ||
    state.matchRequests[0] ||
    null;
  const pendingRequests = state.matchRequests.filter((request) =>
    ["Pending", "More Info Requested"].includes(request.status)
  );
  const approvedRequest = state.matchRequests.find(
    (request) => request.status === "Approved"
  );
  const activeMandate =
    state.lpMandates.find((mandate) => mandate.status === "Active") ||
    state.lpMandates[0] ||
    null;
  const recommendationCount = state.recommendations.reduce(
    (sum, bucket) => sum + bucket.items.length,
    0
  );
  const lpWorkflowRooms = Object.values(state.workflowRooms || {}).filter(
    (room) => room.lpName === state.lpProfile.revealedName
  );
  const activeWorkflowCount = lpWorkflowRooms.length;

  const updateRequestStatus = (request, status, feedback = "") => {
    updateState((prev) => {
      const nextRequest = {
        ...request,
        status,
        feedback,
        decidedAt: "Just now",
      };
      const nextRooms = { ...prev.workflowRooms };
      if (status === "Approved") {
        const room = createMarketplaceRoomFromRequest(nextRequest);
        nextRooms[room.id] = room;
      }
      return {
        ...prev,
        matchRequests: prev.matchRequests.map((entry) =>
          entry.id === request.id ? nextRequest : entry
        ),
        workflowRooms: nextRooms,
      };
    });

    if (status === "Approved") {
      const approved = { ...request, status: "Approved" };
      setFreshRevealRequest(approved);
      setPage("room");
      showToast("Match approved. Decision room opened.", "success");
      return;
    }
    showToast(`Request marked ${status}`, status === "Declined" ? "info" : "success");
  };

  const resetDemo = () => {
    resetState();
    setPage("overview");
    setSelectedRequestId(null);
    setFreshRevealRequest(null);
    showToast("Workflow reset", "info");
  };

  const nav = [
    { id: "overview", label: "Home", icon: "HM" },
    { id: "profile", label: "Allocator Profile", icon: "AP" },
    { id: "mandates", label: "Mandates", icon: "MD" },
    { id: "inbound", label: "Reveal Queue", icon: "RQ", badge: pendingRequests.length },
    { id: "recommendations", label: "Recommendations", icon: "RC" },
    { id: "room", label: "Decision Rooms", icon: "DR", badge: activeWorkflowCount },
  ];
  const lpActiveStep =
    page === "profile" || page === "mandates"
      ? 0
      : page === "inbound" || page === "recommendations" || page === "overview"
      ? 4
      : page === "room"
      ? 6
      : 4;

  const shell = (content) => (
    <MPDemoShell
      user={user}
      roleLabel="LP workspace"
      account={state.lpProfile.revealedName}
      page={page}
      setPage={setPage}
      nav={nav}
      topStatus="Identity stays protected until allocator consent. Review the manager, decide on reveal, and keep diligence contained in-platform."
      activeStep={lpActiveStep}
      contextLabel="Emerging VC Mandate"
      statusMetric="Privacy locked"
      onLogout={onLogout}
      onReset={resetDemo}
    >
      {content}
      <MPDetailModal detail={detail} onClose={() => setDetail(null)} />
    </MPDemoShell>
  );

  const inspectRequest = (request) => {
    setDetail({
      kicker: "GP dossier",
      title: request.gpName,
      subtitle: `${request.firmName} · ${request.strategy} · ${request.generation}`,
      body: request.snapshot,
      chips: request.sectors || [],
      rows: [
        ["Fund size", request.fundSize],
        ["Fit score", String(request.score)],
        ["Readiness", `${request.readiness}%`],
        ["Source", request.source],
        ["Requested", request.requestedAt],
        ["Status", request.status],
      ],
      sections: [
        {
          title: "LP review focus",
          items: [
            "Verify partner-level attribution before IC.",
            "Confirm fund size and check size are aligned with mandate pacing.",
            "Review pitch deck, terms summary, track record, and standardized DDQ.",
          ],
        },
        {
          title: "Potential asks",
          tone: "warn",
          items: [
            "Founder references may be required before a meeting.",
            "Portfolio construction downside case may be requested.",
          ],
        },
      ],
    });
  };

  if (page === "room") {
    return shell(
      <MarketplaceWorkflowRoom
        state={state}
        updateState={updateState}
        role="lp"
        matchId={approvedRequest?.matchId}
        onBack={() => setPage("inbound")}
        freshRevealRequest={freshRevealRequest}
      />
    );
  }

  if (page === "profile") {
    const allocatorProfileRows = [
      ["AUM band", state.lpProfile.aumBand, "Avery Sloan", "Profile v4.1", "LP-visible pre-approval"],
      ["Privacy mode", "Identity hidden until approval", "Avery Sloan", "Access policy", "System-enforced"],
      ["Before approval", "LP type, AUM band, fit rationale", "System", "Disclosure rules", "GP-visible"],
      ["Reveal channel", "Decision room only", "Priya Raman", "Workflow policy", "Room-only"],
      ["Cold outreach", "Blocked", "System", "Permission rule", "No direct contact"],
      ["Preferences", state.lpProfile.preferences, "Private Markets", "Mandate notes", "Internal"],
      ["Decision process", "CIO approval + IC vote", "Avery Sloan", "IC policy", "Internal"],
      ["IC cadence", "Weekly private markets meeting", "Miles Ortega", "Calendar sync", "Internal"],
    ];
    const reviewTeamRows = state.lpProfile.team.map((member, index) => {
      const [name, role] = member.split(",");
      return [
        name,
        role?.trim() || "Private Markets",
        index === 0 ? "Final approval" : index === 1 ? "Mandate owner" : "Packet review",
        index === 0 ? "Weekly IC" : index === 1 ? "Daily queue" : "As assigned",
        index === 0 ? "2 unread notes" : index === 1 ? "Assigned today" : "No unread changes",
      ];
    });
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Allocator profile"
            title="Disclosure & Mandate Ledger"
            right={<MPButton onClick={() => setPage("inbound")}>Open Review Queue</MPButton>}
          />
        </div>
        <div className="marketplace-overview-span-8">
          <MPDeskPanel title="Allocator Profile Table" kicker="Disclosure fields, source docs, permission state" style={{ minHeight: 560 }}>
            <MPTableHeader columns={["Field", "Current value", "Owner", "Source", "Permission"]} template="124px minmax(0,1.35fr) 116px 120px 142px" />
            {allocatorProfileRows.map(([field, value, owner, source, permission]) => (
              <div key={field} style={{ display: "grid", gridTemplateColumns: "124px minmax(0,1.35fr) 116px 120px 142px", ...MP_ROW_BASE, minHeight: 53 }}>
                <span style={MP_TYPE.label}>{field}</span>
                <span style={{ ...MP_TYPE.rowTitle, fontWeight: 520 }}>{value}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{owner}</span>
                <span style={MP_TYPE.rowMeta}>{source}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: permission.includes("GP") || permission.includes("System") ? MP.text : MP.soft }}>{permission}</span>
              </div>
            ))}
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-4">
          <MPDeskPanel title="Review Team" kicker="Responsibilities and unread work" style={{ minHeight: 560 }}>
            <MPDataRow label="Disclosure" value="Locked" />
            <MPDataRow label="Active mandates" value={String(state.lpMandates.filter((m) => m.status === "Active").length)} mono />
            <MPDataRow label="Pending review" value={String(pendingRequests.length)} mono />
            <MPDataRow label="Active rooms" value={String(activeWorkflowCount)} mono />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
              {reviewTeamRows.map(([name, role, authority, cadence, activity]) => (
                <div key={name} style={{ padding: "10px 0", borderTop: `1px solid ${MP.line}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={MP_TYPE.rowTitle}>{name}</span>
                    <span style={MP_TYPE.rowMeta}>{role}</span>
                  </div>
                  <div style={{ color: MP.soft, fontSize: 11.7, lineHeight: 1.35, marginTop: 4 }}>{authority} · {cadence} · {activity}</div>
                </div>
              ))}
            </div>
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-12">
          <MPDeskPanel title="Active Mandate Detail" kicker="The review queue is governed by this mandate">
            <MPTableHeader columns={["Mandate", "Strategy", "Target check", "Fund size", "Emerging mgr", "Track record requirement", "Queue rule"]} template="minmax(0,1fr) 120px 112px 112px 88px minmax(0,1.2fr) 160px" />
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 112px 112px 88px minmax(0,1.2fr) 160px", ...MP_ROW_BASE }}>
              <span style={MP_TYPE.rowTitle}>{activeMandate?.name || "Emerging VC Fund I"}</span>
              <span style={MP_TYPE.rowMeta}>{activeMandate?.strategy || "Venture Capital"}</span>
              <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{activeMandate?.targetCheck || "$1M-$5M"}</span>
              <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{activeMandate?.fundSizeRange || "$25M-$100M"}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{activeMandate?.emergingManagerAppetite || "High"}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{activeMandate?.trackRecordRequirement || "Pre-fund attribution accepted if clearly documented."}</span>
              <span style={MP_TYPE.rowMeta}>Do not blend co-invest mandates</span>
            </div>
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (page === "mandates") {
    const selectedMandate = activeMandate || state.lpMandates[0];
    const mandateRows = state.lpMandates.map((mandate, index) => ({
      ...mandate,
      owner: index === 0 ? "Priya Raman" : "Avery Sloan",
      lastReview: index === 0 ? "Today 10:18 AM" : "Apr 5",
      nextReview: index === 0 ? "Friday IC screen" : "Next quarter",
      source: index === 0 ? "IC policy v6" : "Draft mandate note",
    }));
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
        <MPPageHeader
          eyebrow="LP mandates"
          title="Mandates"
          right={<MPButton onClick={() => setPage("inbound")}>Review Inbound</MPButton>}
        />
        </div>
        <div className="marketplace-overview-span-9">
          <MPDeskPanel title="Mandate Table" kicker="Investment policy, pacing, source, owner" style={{ minHeight: 560 }}>
            <MPTableHeader columns={["Mandate", "Status", "Strategy", "Check", "Fund size", "Owner", "Last review", "Next review"]} template="minmax(0,1.2fr) 82px 110px 92px 108px 100px 120px 120px" />
            {mandateRows.map((mandate) => (
              <div key={mandate.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) 82px 110px 92px 108px 100px 120px 120px", ...MP_ROW_BASE, minHeight: 58 }}>
                <MPLpNameCell title={mandate.name} meta={`${mandate.pacing} · ${mandate.source}`} />
                <MPPill tone={mandate.status === "Active" ? "green" : "amber"}>{mandate.status}</MPPill>
                <span style={MP_TYPE.rowMeta}>{mandate.strategy}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{mandate.targetCheck}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{mandate.fundSizeRange}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{mandate.owner}</span>
                <span style={MP_TYPE.rowMeta}>{mandate.lastReview}</span>
                <span style={MP_TYPE.rowMeta}>{mandate.nextReview}</span>
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
              <MPTableHeader columns={["Queue rule", "Source doc", "Permission", "Open reviews", "Unread changes"]} template="minmax(0,1.3fr) 140px 112px 100px 120px" />
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) 140px 112px 100px 120px", ...MP_COMPACT_ROW_BASE }}>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>Do not blend co-invest mandates into emerging VC queue</span>
                <span style={MP_TYPE.rowMeta}>Mandate policy</span>
                <span style={MP_TYPE.rowMeta}>Internal</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{pendingRequests.length}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>3</span>
              </div>
            </div>
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-3">
          <MPDeskPanel title="Selected Mandate" kicker={selectedMandate?.name} style={{ minHeight: 560 }}>
            <MPDataRow label="Status" value={selectedMandate?.status || "Active"} />
            <MPDataRow label="Strategy" value={selectedMandate?.strategy || "Venture Capital"} />
            <MPDataRow label="Target check" value={selectedMandate?.targetCheck || "$1M-$5M"} />
            <MPDataRow label="Fund size" value={selectedMandate?.fundSizeRange || "$25M-$100M"} />
            <MPDataRow label="Pacing" value={selectedMandate?.pacing || "3 commitments this year"} />
            <MPDataRow label="Emerging mgr" value={selectedMandate?.emergingManagerAppetite || "High"} />
            <MPDataRow label="Co-invest" value={selectedMandate?.coInvestAppetite || "Selective"} />
            <MPDataRow label="Track record req." value={selectedMandate?.trackRecordRequirement || "Pre-fund accepted with attribution."} />
            <MPDataRow label="Exclusions" value={selectedMandate?.exclusions || "No unfocused consumer mandates"} />
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  if (page === "inbound") {
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
          <MPPageHeader
            eyebrow="Allocator review queue"
            title="Review Queue"
            right={<MPButton onClick={() => selectedRequest && updateRequestStatus(selectedRequest, "Approved")}>Approve Selected</MPButton>}
          />
        </div>
        {selectedRequest ? (
          <>
            <div className="marketplace-overview-span-12">
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 12, alignItems: "stretch", minHeight: 650 }}>
                {/* Queue */}
                <MPDeskPanel
                  title="Review Queue"
                  kicker={`${state.matchRequests.length} GP packets`}
                  action={
                    <MPButton
                      size="sm"
                      variant="secondary"
                      onClick={() => inspectRequest(selectedRequest)}
                      style={{ background: "rgba(113,102,216,.12)", borderColor: "rgba(113,102,216,.24)", color: MP.text }}
                    >
                      Inspect
                    </MPButton>
                  }
                  style={{ overflow: "hidden" }}
                >
                  <ReviewQueueTable
                    requests={state.matchRequests}
                    selectedId={selectedRequest?.id}
                    onSelect={(req) => { setSelectedRequestId(req.id); setFeedbackDraft(req.feedback || ""); }}
                  />
                </MPDeskPanel>

                {/* Decision panel */}
                <MPDeskPanel title="GP Packet" kicker={selectedRequest.gpName}>
                  <div style={{ fontSize: 11, color: MP.soft, marginBottom: 10 }}>{selectedRequest.fundSize} · {selectedRequest.strategy} · {selectedRequest.generation}</div>
                  {selectedRequest.snapshot && (
                    <div style={{ fontSize: 12.2, color: MP.soft, lineHeight: 1.55, padding: "10px 12px", background: MP.panel2, borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, marginBottom: 12 }}>
                      {selectedRequest.snapshot}
                    </div>
                  )}
                  <MPDataRow label="Fit score" value={String(selectedRequest.score)} />
                  <MPDataRow label="Readiness" value={`${selectedRequest.readiness}%`} />
                  <MPDataRow label="Status" value={selectedRequest.status} />
                  <MPDataRow label="Mandate" value={activeMandate?.name || "Emerging VC"} />
                  <MPDataRow label="Requested" value={selectedRequest.requestedAt} />
                  <MPDataRow label="Source" value={selectedRequest.source} />
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: MP.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Submitted Documents</div>
                    {(selectedRequest.docs || []).map(([name, status]) => (
                      <div key={name} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "7px 0", borderTop: `1px solid ${MP.line}` }}>
                        <span style={{ fontSize: 12, color: MP.soft }}>{name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: status === "Ready" ? MP.green : MP.amber }}>{status}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
                    <div style={{ ...MP_TYPE.label, marginBottom: 6 }}>Review path</div>
                    {[
                      "Confirm mandate fit and check size.",
                      "Review track record and attribution proof.",
                      "Approve reveal or request missing evidence.",
                    ].map((step) => (
                      <div key={step} style={{ padding: "6px 0", borderTop: `1px solid ${MP.line}`, color: MP.soft, fontSize: 12, lineHeight: 1.35 }}>{step}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${MP.line}` }}>
                    <div style={{ ...MP_TYPE.label, marginBottom: 6 }}>Review team</div>
                    <MPDataRow label="Primary" value="Avery Sloan" />
                    <MPDataRow label="Private markets" value="Priya Raman" />
                    <MPDataRow label="Analyst" value="Miles Ortega" />
                    <MPDataRow label="IC source" value="Weekly private markets memo" />
                  </div>
                  <textarea
                    value={feedbackDraft}
                    onChange={(e) => setFeedbackDraft(e.target.value)}
                    placeholder="Optional feedback to GP..."
                    style={{ width: "100%", minHeight: 64, resize: "vertical", borderRadius: MP.radius.sm, border: `1px solid ${MP.line}`, background: MP.panel2, color: MP.text, padding: "10px 12px", fontSize: 12.5, lineHeight: 1.5, fontFamily: MP.type.body, marginTop: 12 }}
                  />
                  <div style={{ display: "grid", gap: 8, marginTop: "auto", paddingTop: 12 }}>
                    <MPButton onClick={() => updateRequestStatus(selectedRequest, "Approved")} style={{ width: "100%" }}>Approve Reveal</MPButton>
                    <MPButton variant="secondary" style={{ width: "100%" }} onClick={() => updateRequestStatus(selectedRequest, "More Info Requested", feedbackDraft || "Please upload additional attribution.")}>Request More Info</MPButton>
                    <MPButton variant="danger" style={{ width: "100%" }} onClick={() => updateRequestStatus(selectedRequest, "Declined", feedbackDraft || "Not proceeding.")}>Decline</MPButton>
                  </div>
                </MPDeskPanel>
              </div>
            </div>
          </>
        ) : (
          <div className="marketplace-overview-span-12">
            <MPDeskPanel title="No requests available" kicker="Inbound queue">
              <div style={{ color: MP.soft, fontSize: 15, lineHeight: 1.6 }}>
                New GP requests and allocator-sourced recommendations will appear here.
              </div>
            </MPDeskPanel>
          </div>
        )}
      </div>
    );
  }

  if (page === "recommendations") {
    const recommendationRows = state.recommendations.flatMap((bucket, bucketIndex) =>
      bucket.items.map((item, itemIndex) => ({
        ...item,
        bucket: bucket.bucket,
        owner: bucketIndex % 2 === 0 ? "Miles Ortega" : "Priya Raman",
        due: bucketIndex < 2 ? "This week" : "Next cycle",
        source: itemIndex === 0 ? "Mandate engine" : "Engagement model",
        permissions: item.score >= 80 ? "Internal review" : "Watchlist",
        lastActivity: bucketIndex === 0 ? "Scored 24m ago" : bucketIndex === 1 ? "Docs indexed today" : "Model refreshed yesterday",
        attachments: item.score >= 80 ? 5 : 2,
      }))
    );
    const selectedRecommendation = recommendationRows[0];
    return shell(
      <div className="marketplace-overview-grid">
        <div className="marketplace-overview-span-12">
        <MPPageHeader
          eyebrow="Algorithmic recommendations"
          title="Recommendations"
          right={<MPButton onClick={() => setPage("inbound")}>Review Queue</MPButton>}
        />
        </div>
        <div className="marketplace-overview-span-9">
          <MPDeskPanel title="Recommendation Ledger" kicker="Bucket, source model, owner, due date, attachments" style={{ minHeight: 640 }}>
            <MPTableHeader columns={["Manager / signal", "Fit", "Bucket", "Owner", "Due", "Source", "Files"]} template="minmax(0,1.35fr) 54px 152px 100px 86px 118px 58px" />
            {recommendationRows.map((item, index) => (
              <button
                key={`${item.bucket}-${item.gpName}`}
                type="button"
                onClick={() =>
                  setDetail({
                    kicker: item.bucket,
                    title: item.gpName,
                    subtitle: `${item.score} fit · ${item.source}`,
                    body: item.whyNow,
                    chips: item.tags,
                    rows: [
                      ["Recommendation bucket", item.bucket],
                      ["Fit score", String(item.score)],
                      ["Owner", item.owner],
                      ["Due", item.due],
                      ["Source model", item.source],
                      ["Permissions", item.permissions],
                    ],
                    sections: [
                      {
                        title: "Review path",
                        items: [
                          "Open GP packet and verify document readiness.",
                          "Compare against active mandate criteria.",
                          "Move to reveal queue only if source evidence supports the score.",
                        ],
                      },
                    ],
                  })
                }
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.35fr) 54px 152px 100px 86px 118px 58px",
                  ...MP_ROW_BASE,
                  minHeight: 58,
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  background: index === 0 ? MP.accentSoft : "transparent",
                  color: MP.text,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <MPLpNameCell title={item.gpName} meta={`${item.whyNow} · ${item.lastActivity}`} />
                <span className="marketplace-mono" style={{ ...MP_TYPE.number, color: item.score >= 85 ? MP.green : MP.text }}>{item.score}</span>
                <MPPill tone="accent" style={{ justifySelf: "start", maxWidth: 142, overflow: "hidden", textOverflow: "ellipsis" }}>{item.bucket}</MPPill>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{item.owner}</span>
                <span style={MP_TYPE.rowMeta}>{item.due}</span>
                <span style={MP_TYPE.rowMeta}>{item.source}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{item.attachments}</span>
              </button>
            ))}
          </MPDeskPanel>
        </div>
        <div className="marketplace-overview-span-3">
          <MPDeskPanel title="Selected Recommendation" kicker={selectedRecommendation?.gpName} style={{ minHeight: 640 }}>
            <MPDataRow label="Fit score" value={String(selectedRecommendation?.score || "")} mono />
            <MPDataRow label="Bucket" value={selectedRecommendation?.bucket || ""} />
            <MPDataRow label="Owner" value={selectedRecommendation?.owner || ""} />
            <MPDataRow label="Due" value={selectedRecommendation?.due || ""} />
            <MPDataRow label="Source" value={selectedRecommendation?.source || ""} />
            <MPDataRow label="Files" value={`${selectedRecommendation?.attachments || 0} attachments`} />
            <MPDataRow label="Permission" value={selectedRecommendation?.permissions || ""} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
              <div style={{ ...MP_TYPE.label, marginBottom: 7 }}>Mandate capacity</div>
              <MPDataRow label="Open commitments" value="2 slots" />
              <MPDataRow label="Target check" value="$1M-$5M" />
              <MPDataRow label="Priority" value="Fund I / first close" />
              <MPDataRow label="Decision owner" value="Private markets team" />
            </div>
            <div style={{ marginTop: "auto", paddingTop: 12 }}>
              <MPButton size="sm" onClick={() => setPage("inbound")} style={{ width: "100%" }}>Move to Review Queue</MPButton>
            </div>
          </MPDeskPanel>
        </div>
      </div>
    );
  }

  const selectedHomeRequest = selectedRequest || state.matchRequests[0];
  const selectedHomeRoom = lpWorkflowRooms[0];
  const homeQueueRows = [
    ...state.matchRequests,
    ...state.recommendations.flatMap((bucket) =>
      bucket.items.map((item) => ({
        id: `rec-${bucket.bucket}-${item.gpName}`,
        gpName: item.gpName,
        source: `Recommendation · ${bucket.bucket}`,
        fundSize: item.score >= 85 ? "$90M-$140M" : "$50M-$90M",
        generation: item.tags?.includes("Fund I") ? "Fund I" : item.tags?.includes("Fund II") ? "Fund II" : "Watchlist",
        score: item.score,
        status: "Recommended",
        docs: Array.from({ length: item.score >= 80 ? 4 : 2 }),
      }))
    ),
  ].slice(0, 11);
  return shell(
    <div className="marketplace-overview-grid">
      <div className="marketplace-overview-span-12">
        <MPPageHeader
          eyebrow="Allocator review desk"
          title="GP Packet Work Queue"
          right={<MPButton onClick={() => setPage("inbound")}>Open Review Queue</MPButton>}
        />
      </div>
      <div className="marketplace-overview-span-9">
        <MPDeskPanel title="Inbound GP Packet Ledger" kicker="Status, owner, due date, source documents, permissions" action={<MPButton size="sm" variant="secondary" onClick={() => setPage("recommendations")}>Recommendations</MPButton>} style={{ minHeight: 590 }}>
          <MPTableHeader columns={["#", "Manager / source", "Fit", "Status", "Owner", "Due", "Docs", "Last activity"]} template="28px minmax(0,1.25fr) 58px 96px 100px 92px 68px minmax(0,.95fr)" />
          {homeQueueRows.map((request, index) => {
            const active = selectedHomeRequest?.id === request.id;
            const statusLabel = request.status === "More Info Requested" ? "More info" : request.status;
            const statusTone =
              request.status === "Approved"
                ? "green"
                : request.status === "Declined"
                ? "red"
                : request.status === "More Info Requested"
                ? "amber"
                : request.status === "Recommended"
                ? "accent"
                : "blue";
            return (
              <button
                key={request.id}
                type="button"
                onClick={() => { setSelectedRequestId(request.id); setFeedbackDraft(request.feedback || ""); }}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "28px minmax(0,1.25fr) 58px 96px 100px 92px 68px minmax(0,.95fr)",
                  ...MP_ROW_BASE,
                  minHeight: 52,
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  background: active ? MP.accentSoft : "transparent",
                  color: MP.text,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span className="marketplace-mono" style={{ color: active ? MP.text : MP.muted, fontSize: 11, fontWeight: 700 }}>{index + 1}</span>
                <MPLpNameCell title={request.gpName} meta={`${request.source} · ${request.fundSize} · ${request.generation}`} />
                <span className="marketplace-mono" style={{ color: request.score >= 85 ? MP.green : MP.soft, fontSize: 18, fontWeight: 740, textAlign: "center" }}>{request.score}</span>
                <MPPill tone={statusTone} style={{ justifySelf: "start" }}>{statusLabel}</MPPill>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{index % 3 === 0 ? "Avery Sloan" : index % 3 === 1 ? "Priya Raman" : "Miles Ortega"}</span>
                <span style={{ ...MP_TYPE.rowMeta, color: index < 2 ? MP.amber : MP.soft }}>{index < 2 ? "Today" : index < 5 ? "This week" : "Next week"}</span>
                <span className="marketplace-mono" style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{request.docs?.length || 0} files</span>
                <span style={{ ...MP_TYPE.rowMeta, color: MP.soft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {index === 0 ? "Packet opened 12m ago" : index === 1 ? "Room opened yesterday" : index === 2 ? "IC owner left comment" : "Docs synced today"}
                </span>
              </button>
            );
          })}
        </MPDeskPanel>
      </div>
      <div className="marketplace-overview-span-3">
        <MPDeskPanel title="Selected GP Packet" kicker={selectedHomeRequest?.gpName} style={{ minHeight: 590 }}>
          <MPDataRow label="Fit score" value={String(selectedHomeRequest?.score || "")} />
          <MPDataRow label="Status" value={selectedHomeRequest?.status || "Pending"} />
          <MPDataRow label="Mandate" value={activeMandate?.name || "Emerging VC"} />
          <MPDataRow label="Owner" value="Priya Raman" />
          <MPDataRow label="Due" value="Today 3:00 PM" />
          <MPDataRow label="Source docs" value={`${selectedHomeRequest?.docs?.length || 0} submitted files`} />
          <MPDataRow label="Permissions" value="Identity locked until approval" />
          <MPDataRow label="Comments" value="4 unresolved" />
          <MPDataRow label="Last viewed" value="12 minutes ago" />
          <MPDataRow label="Unread" value="3 packet changes" />
          <MPDataRow label="Assigned analyst" value="Miles Ortega" />
          <MPDataRow label="Packet version" value="DDQ v2.4" />
          <MPDataRow label="State change" value="Queued -> pending review" />
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${MP.line}` }}>
            <div style={{ ...MP_TYPE.label, marginBottom: 7 }}>Decision room</div>
            {selectedHomeRoom ? (
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ color: MP.text, fontSize: 12.3, fontWeight: 560, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedHomeRoom.gpName}</div>
                <div style={{ color: MP.soft, fontSize: 11.6, lineHeight: 1.35 }}>
                  {selectedHomeRoom.pipelineStage} · {(selectedHomeRoom.docRequests || []).filter((doc) => !doc.done).length} open ask · room-only
                </div>
              </div>
            ) : (
              <div style={{ color: MP.soft, fontSize: 12.2, lineHeight: 1.45 }}>No approved room for this selected packet yet.</div>
            )}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, display: "grid", gap: 8 }}>
            <MPButton size="sm" onClick={() => setPage("inbound")} style={{ width: "100%" }}>Open Packet</MPButton>
            <MPButton size="sm" variant="secondary" onClick={() => setPage("room")} style={{ width: "100%" }}>Decision Room</MPButton>
          </div>
        </MPDeskPanel>
      </div>
      <div className="marketplace-overview-span-12">
        <MPDeskPanel title="Allocator Audit Trail" kicker="Recent state changes across review desk">
          <MPTableHeader columns={["Time", "Object", "Change", "Actor", "Source", "Permission"]} template="110px minmax(0,1fr) minmax(0,1.1fr) 120px 150px 130px" />
          {[
            ["12m ago", selectedHomeRequest?.gpName || "Northstar Venture Fund I", "Packet opened and fit score refreshed", "Miles Ortega", "DDQ v2.4", "Internal"],
            ["41m ago", "Ridgeway AI Partners I", "Reveal approved; room opened", "Avery Sloan", "IC note", "Room-only"],
            ["2h ago", "Aurora Bio Systems Fund II", "Declined for pacing cycle", "Priya Raman", "Mandate rule", "Internal"],
            ["Yesterday", "Northline Climate Seed I", "More info requested", "Miles Ortega", "Attribution memo", "GP-visible"],
          ].map(([time, object, change, actor, source, permission]) => (
            <div key={`${time}-${object}`} style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1fr) minmax(0,1.1fr) 120px 150px 130px", ...MP_ROW_BASE, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
              <span className="marketplace-mono" style={MP_TYPE.rowMeta}>{time}</span>
              <span style={MP_TYPE.rowTitle}>{object}</span>
              <span style={{ ...MP_TYPE.rowMeta, color: MP.text }}>{change}</span>
              <span style={MP_TYPE.rowMeta}>{actor}</span>
              <span style={MP_TYPE.rowMeta}>{source}</span>
              <span style={MP_TYPE.rowMeta}>{permission}</span>
            </div>
          ))}
        </MPDeskPanel>
      </div>
    </div>
  );
}

const GP_FUND_I_LP_UNIVERSE = [
  {
    id: "fund1-lp-1",
    name: "Cedar Grove Family Office",
    type: "Family Office",
    aum: "$1.2B",
    checkMin: 0.25,
    checkMax: 2,
    sectors: ["Technology", "Healthcare", "Climate"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-2",
    name: "Blue Lake Foundation",
    type: "Foundation",
    aum: "$740M",
    checkMin: 0.5,
    checkMax: 1.5,
    sectors: ["Healthcare", "Climate", "Technology"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-3",
    name: "Launchpad Fund of Funds",
    type: "Fund of Funds",
    aum: "$420M",
    checkMin: 1,
    checkMax: 3,
    sectors: ["Technology", "Healthcare"],
    geographies: ["North America", "Global"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-4",
    name: "Mosaic Emerging Manager Trust",
    type: "Endowment",
    aum: "$2.1B",
    checkMin: 1,
    checkMax: 4,
    sectors: ["Technology", "Climate"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-5",
    name: "Brightline Ventures Access",
    type: "Family Office",
    aum: "$510M",
    checkMin: 0.25,
    checkMax: 1,
    sectors: ["Technology", "Healthcare"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-6",
    name: "Sequoia Ridge Foundation",
    type: "Foundation",
    aum: "$930M",
    checkMin: 0.5,
    checkMax: 2,
    sectors: ["Climate", "Healthcare"],
    geographies: ["North America"],
    strategies: ["Venture Capital", "Growth Equity"],
    deploying: true,
  },
  {
    id: "fund1-lp-7",
    name: "North Pier Allocators",
    type: "Fund of Funds",
    aum: "$680M",
    checkMin: 1,
    checkMax: 5,
    sectors: ["Technology"],
    geographies: ["North America", "Global"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-8",
    name: "Lumen Family Capital",
    type: "Family Office",
    aum: "$390M",
    checkMin: 0.25,
    checkMax: 0.75,
    sectors: ["Technology", "Consumer"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-9",
    name: "Fieldstone Impact Partners",
    type: "Foundation",
    aum: "$1.4B",
    checkMin: 0.5,
    checkMax: 2.5,
    sectors: ["Climate", "Education", "Healthcare"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-10",
    name: "Atelier Single Family Office",
    type: "Family Office",
    aum: "$260M",
    checkMin: 0.1,
    checkMax: 0.5,
    sectors: ["Technology", "Fintech"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-11",
    name: "Keystone University Seed Pool",
    type: "Endowment",
    aum: "$3.8B",
    checkMin: 1,
    checkMax: 3,
    sectors: ["Technology", "Healthcare", "Education"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-12",
    name: "Pioneer GP Seeding Program",
    type: "Fund of Funds",
    aum: "$850M",
    checkMin: 2,
    checkMax: 5,
    sectors: ["Technology", "Healthcare", "Climate"],
    geographies: ["Global"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-13",
    name: "Harborline Pension Innovation Sleeve",
    type: "Pension",
    aum: "$18.6B",
    checkMin: 10,
    checkMax: 25,
    sectors: ["Technology"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
  {
    id: "fund1-lp-14",
    name: "Willow Creek Foundation",
    type: "Foundation",
    aum: "$610M",
    checkMin: 0.5,
    checkMax: 1.5,
    sectors: ["Healthcare", "Education"],
    geographies: ["North America"],
    strategies: ["Venture Capital"],
    deploying: false,
  },
  {
    id: "fund1-lp-15",
    name: "Ridgeway Family Holdings",
    type: "Family Office",
    aum: "$780M",
    checkMin: 0.25,
    checkMax: 1.25,
    sectors: ["Technology", "Climate"],
    geographies: ["Europe", "North America"],
    strategies: ["Venture Capital"],
    deploying: true,
  },
];

const GP_DEMO_LP_UNIVERSE_SIZE = 326;
const GP_DEMO_LP_SUFFIXES = [
  "Emerging Manager Sleeve",
  "Venture Access Pool",
  "Innovation Allocation",
  "Private Markets Program",
  "Strategic Opportunities",
  "First Close Account",
  "Endowment Growth Sleeve",
  "Catalyst Allocation",
  "Operator Network Pool",
  "Seed Access Program",
  "Mission Investment Sleeve",
  "Next Gen Capital",
];

function buildGpDemoLpUniverse(base = GP_FUND_I_LP_UNIVERSE) {
  return Array.from({ length: GP_DEMO_LP_UNIVERSE_SIZE }, (_, i) => {
    const source = base[i % base.length];
    const cycle = Math.floor(i / base.length);
    const suffix = GP_DEMO_LP_SUFFIXES[cycle % GP_DEMO_LP_SUFFIXES.length];
    const checkShift = ((i * 3) % 5) * 0.25;
    const isLargeInstitution = ["Pension", "Endowment", "Fund of Funds"].includes(
      source.type
    );
    const minBump = isLargeInstitution ? (cycle % 4) * 0.5 : checkShift;
    const maxBump = isLargeInstitution ? (cycle % 6) * 1.25 : (cycle % 5) * 0.5;
    const syntheticAum =
      source.type === "Pension"
        ? `$${(12 + (i % 18) * 1.4).toFixed(1)}B`
        : source.type === "Endowment"
        ? `$${(1.4 + (i % 11) * 0.6).toFixed(1)}B`
        : source.type === "Fund of Funds"
        ? `$${(0.5 + (i % 9) * 0.22).toFixed(1)}B`
        : `$${Math.round(240 + ((i * 67) % 1400))}M`;

    return {
      ...source,
      id: cycle === 0 ? source.id : `${source.id}-demo-${cycle}`,
      name: cycle === 0 ? source.name : `${source.name} ${suffix} ${cycle}`,
      aum: cycle === 0 ? source.aum : syntheticAum,
      checkMin: Number((source.checkMin + minBump).toFixed(2)),
      checkMax: Number(
        Math.max(source.checkMax + maxBump, source.checkMin + minBump + 0.5).toFixed(2)
      ),
      deploying: cycle === 0 ? source.deploying : i % 9 !== 0,
      sectors:
        cycle % 5 === 0
          ? Array.from(new Set([...(source.sectors || []), "Fintech"]))
          : cycle % 7 === 0
          ? Array.from(new Set([...(source.sectors || []), "Education"]))
          : source.sectors,
      geographies:
        cycle % 6 === 0
          ? Array.from(new Set([...(source.geographies || []), "Global"]))
          : source.geographies,
    };
  });
}

const GP_DEMO_LP_UNIVERSE = buildGpDemoLpUniverse();

/* ════════════════════════════════════════════════════════════════════════════
   GP WORKSPACE — REAL WORKFLOW
   ════════════════════════════════════════════════════════════════════════════ */
