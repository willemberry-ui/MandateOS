import { useState, useEffect, useRef } from "react";
import { C } from "../../tokens";
import { getScoreColor, getInitials, lsGet, lsSet, formatMoneyRange, scoreBucket } from "../../lib/helpers";
import { standardizeFundSubmission, computeReadinessScore, buildGpMarketFeedback } from "../../lib/fitEngine";
import { showToast, Btn, Pill, Card, Mono, Dot, FInput, FSelect, FTags, Separator, SectionLabel, SectionTitle, StatBox, THead, TRow, LPProfileModal, SkeletonCard } from "../ui";
import { WorkspaceShell, NavItem, WorkspaceHeaderTitle } from "../WorkspaceShell";

export function NextBestActionCard({ title, body, cta, onClick, color = C.accent }) {
  return (
    <div
      className="glow-card"
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        background: `linear-gradient(135deg, ${color}10, ${C.card})`,
        border: `1px solid ${color}30`,
        boxShadow: `0 4px 20px ${color}08`,
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
export function OnboardingChecklist({ title, items }) {
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
export function ActivityFeed({ items }) {
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
export function EmptyState({ icon, title, body, cta, onClick }) {
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

export function WorkflowBanner({ title, subtitle, stats = [] }) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: 18,
        borderRadius: 16,
        background:
          "linear-gradient(135deg, rgba(79,106,240,0.12), rgba(20,184,166,0.07))",
        border: `1px solid ${C.border}`,
        boxShadow: "0 18px 44px rgba(0,0,0,.18)",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 760, marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
          gap: 10,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(5,8,16,0.28)",
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
                marginBottom: 6,
              }}
            >
              {stat.label}
            </div>
            <Mono size={22} weight={800} color={stat.color || C.accent}>
              {stat.value}
            </Mono>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnterpriseGradePanel({ metrics = [], onNavigate }) {
  const workflowPillars = [
    {
      label: "Source",
      title: "Mandate intelligence",
      body: "Replace static LP lists with live mandate scoring across strategy, sector, check size, geography, and deployment signal.",
      color: C.accent,
      action: "matches",
    },
    {
      label: "Qualify",
      title: "Explainable fit",
      body: "Every allocator recommendation carries rationale the GP can defend before requesting disclosure.",
      color: C.teal,
      action: "matches",
    },
    {
      label: "Permission",
      title: "Consent-based reveal",
      body: "No cold list export. LP identity unlocks only when the allocator approves the GP and attached materials.",
      color: C.green,
      action: "reveal",
    },
    {
      label: "Convert",
      title: "Intro room to pipeline",
      body: "Approved introductions keep diligence, owner, next step, probability, and capital outcome attached.",
      color: C.amber,
      action: "intro",
    },
  ];

  const replacementRows = [
    ["LP list buying", "Scored mandate graph"],
    ["Blind outreach", "Permissioned reveal queue"],
    ["Manual diligence chasing", "Request-aware diligence room"],
    ["Spreadsheet pipeline", "Capital workflow system"],
  ];

  const investorProof = [
    {
      label: "Why GPs pay",
      text: "Fewer low-quality meetings, faster first-close prioritization, and a single workspace for LP targeting through diligence.",
      color: C.green,
    },
    {
      label: "Why LPs trust it",
      text: "Allocator identity stays protected until fit, materials, and disclosure approval are aligned.",
      color: C.teal,
    },
    {
      label: "Why VCs care",
      text: "Mandates, reveals, intro rooms, and pipeline events become a data layer around private-markets capital formation.",
      color: C.purple,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        border: `1px solid ${C.accent}2e`,
        background:
          "linear-gradient(145deg, rgba(16,13,42,.99), rgba(6,5,18,.99) 54%, rgba(8,18,31,.96))",
        boxShadow:
          "0 28px 86px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 55% 60% at 86% 0%, ${C.accent}18, transparent 62%),
            radial-gradient(ellipse 48% 60% at 0% 100%, ${C.teal}10, transparent 62%),
            linear-gradient(90deg, rgba(255,255,255,.045), transparent 34%, rgba(255,255,255,.025))
          `,
        }}
      />
      <div style={{ position: "relative", padding: 22 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(340px, .9fr)",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              background: "rgba(4,3,14,.38)",
              border: `1px solid ${C.borderSubtle}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <Pill color={C.accent} size="xs">
                Enterprise OS
              </Pill>
              <Pill color={C.green} size="xs">
                GP Pilot Ready
              </Pill>
              <span
                style={{
                  fontSize: 10.5,
                  color: C.textMuted,
                  fontWeight: 850,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                }}
              >
                Capital formation infrastructure
              </span>
            </div>
            <div
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 880,
                letterSpacing: -1,
                lineHeight: 1.02,
                marginBottom: 12,
                maxWidth: 720,
              }}
            >
              Placement-agent workflow, rebuilt as software.
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.textSoft,
                lineHeight: 1.65,
                maxWidth: 760,
                marginBottom: 18,
              }}
            >
              Target the right LPs, prove fit, control disclosure, ship
              diligence, open introductions, and move capital through a governed
              pipeline without losing context.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 9,
              }}
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    padding: "12px 13px",
                    borderRadius: 12,
                    background: `linear-gradient(145deg, ${metric.color}12, rgba(4,3,14,.56))`,
                    border: `1px solid ${metric.color}28`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9.5,
                      color: metric.color,
                      fontWeight: 850,
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {metric.label}
                  </div>
                  <Mono size={22} weight={850} color={metric.color}>
                    {metric.value}
                  </Mono>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "rgba(4,3,14,.52)",
              border: `1px solid ${C.borderSubtle}`,
              display: "grid",
              gap: 10,
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
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    fontWeight: 850,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Replaces
                </div>
                <div style={{ fontSize: 15, fontWeight: 820 }}>
                  Manual capital-formation stack
                </div>
              </div>
              <Dot color={C.green} pulse />
            </div>

            {replacementRows.map(([oldFlow, newFlow]) => (
              <div
                key={oldFlow}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 24px 1fr",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px 11px",
                  borderRadius: 11,
                  background: "rgba(255,255,255,.032)",
                  border: `1px solid ${C.borderSubtle}`,
                }}
              >
                <span
                  style={{
                    fontSize: 11.5,
                    color: C.textMuted,
                    textDecoration: "line-through",
                  }}
                >
                  {oldFlow}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.accentBright,
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  →
                </span>
                <span
                  style={{ fontSize: 11.8, color: C.text, fontWeight: 760 }}
                >
                  {newFlow}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
            marginTop: 12,
          }}
        >
          {workflowPillars.map((pillar, i) => (
            <button
              key={pillar.label}
              type="button"
              onClick={() => onNavigate?.(pillar.action)}
              style={{
                textAlign: "left",
                padding: 15,
                minHeight: 154,
                borderRadius: 14,
                background:
                  i === 0
                    ? `linear-gradient(150deg, ${pillar.color}16, rgba(4,3,14,.54))`
                    : "rgba(4,3,14,.48)",
                border: `1px solid ${pillar.color}28`,
                color: C.text,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: i === 0 ? `0 18px 42px ${pillar.color}0d` : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = pillar.color + "55";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = pillar.color + "28";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <Mono size={11} weight={850} color={pillar.color}>
                  {String(i + 1).padStart(2, "0")}
                </Mono>
                <Pill color={pillar.color} size="xs">
                  {pillar.label}
                </Pill>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 830, marginBottom: 7 }}>
                {pillar.title}
              </div>
              <div
                style={{
                  fontSize: 11.8,
                  color: C.textSoft,
                  lineHeight: 1.55,
                }}
              >
                {pillar.body}
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            marginTop: 12,
          }}
        >
          {investorProof.map((proof) => (
            <div
              key={proof.label}
              style={{
                padding: "13px 15px",
                borderRadius: 13,
                background: `${proof.color}0d`,
                border: `1px solid ${proof.color}24`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: proof.color,
                  fontWeight: 850,
                  letterSpacing: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                {proof.label}
              </div>
              <div
                style={{
                  fontSize: 12.3,
                  color: C.textSoft,
                  lineHeight: 1.55,
                }}
              >
                {proof.text}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${C.borderSubtle}`,
          }}
        >
          <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>
            Built for a GP raising a first institutional close: mandate scoring,
            permissioning, diligence, intros, and pipeline evidence in one
            auditable flow.
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Btn variant="primary" size="sm" onClick={() => onNavigate?.("matches")}>
              Open Match Engine
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => onNavigate?.("intro")}>
              View Intro Rooms
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GPWorkspace({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [matchSearch, setMatchSearch] = useState("");
  const [matchThreshold, setMatchThreshold] = useState(50);
  const [matchTypeFilter, setMatchTypeFilter] = useState("All");
  const [matchSectorFilter, setMatchSectorFilter] = useState("All");
  const [matchGeoFilter, setMatchGeoFilter] = useState("All");
  const [matchDeployingOnly, setMatchDeployingOnly] = useState(true);
  const [matchCheckMin, setMatchCheckMin] = useState(0);
  const [matchCheckMax, setMatchCheckMax] = useState(5);
  const [matchSortMode, setMatchSortMode] = useState("score");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchWeights, setMatchWeights] = useState({
    strategy: 30,
    sector: 30,
    checkSize: 25,
    geography: 15,
  });
  const [gpProfile, setGpProfile] = useState({
    firmName: user.org || "Y Combinator",
    strategy: "Early-Stage Venture Capital",
    geography: "Global / U.S.-led",
    sectorFocus: "AI Infrastructure, Developer Tools, B2B SaaS, Fintech, Healthcare AI, Vertical AI, Enterprise Software",
    checkSizeSought: "$1M–$10M LP commitments",
    targetLPTypes: [
      "Family Office",
      "Foundation",
      "Fund of Funds",
      "Endowment",
    ],
    trackRecord:
      "5,000+ companies backed. 3.1x TVPI, 39% Gross IRR. Follow-on rate 64%. Power-law driven high-dispersion seed portfolio.",
    structure: "Core Fund",
    raiseStage: "Continuity raise",
    minTicket: "$1M",
    differentiators:
      "World's leading startup accelerator. Batch selection, founder sourcing, product strategy, investor access, and follow-on fundraising across 40+ countries.",
    aum: "$410M",
    founded: "2005",
    teamSize: "6",
    website: "ycombinator.com",
    annualizedIrr: "39%",
    moic: "3.1x",
    dpi: "0.9x",
    portfolioCompanies: "5000+",
    realizationsCount: "400+",
  });

  const [fundSubmission, setFundSubmission] = useState({
    fundName: "Y Combinator Core Fund",
    targetFundSize: "$700M",
    fundType: "Early-Stage Venture Capital",
    priorPerformance:
      "5,000+ companies backed, 3.1x TVPI, 39% Gross IRR, 64% follow-on rate",
    teamBios: "Bios completed for 6 Group Partners",
    currentStatus: "Continuity raise",
    dataRoomReadiness: "Ready",
    timeline: "60 days",
    deckUploaded: true,
    teamBiosUploaded: true,
    performanceUploaded: true,
    termsSheetUploaded: true,
    lpReferencesUploaded: true,
    dataRoomLink: "dataroom.ycombinator.com",
    raisedToDate: "$410M",
    targetFirstClose: "$225M",
  });

  const standardized = standardizeFundSubmission(gpProfile, fundSubmission);
  const readinessScore = computeReadinessScore(
    gpProfile,
    fundSubmission,
    standardized
  );

  // Dynamic fit engine using custom weights
  const gpMatchProfile = {
    strategy: gpProfile.strategy,
    geography: gpProfile.geography,
    sectors: gpProfile.sectorFocus.split(",").map((x) => x.trim()),
    checkMin: 1,
    checkMax: 5,
  };
  const effectiveLpDb = GP_DEMO_LP_UNIVERSE;
  const fitResults = effectiveLpDb
    .map((lp) => {
      let raw = 0;
      const maxRaw =
        matchWeights.strategy +
        matchWeights.sector +
        matchWeights.checkSize +
        matchWeights.geography;
      const dims = {};
      // Strategy
      const stratMatch = lp.strategies.some(
        (s) => s.toLowerCase() === gpMatchProfile.strategy.toLowerCase()
      );
      const stratScore = stratMatch ? matchWeights.strategy : 0;
      raw += stratScore;
      dims.strategy = {
        earned: stratScore,
        max: matchWeights.strategy,
        match: stratMatch,
        detail: stratMatch
          ? `Matches ${gpMatchProfile.strategy}`
          : `LP targets ${lp.strategies.join(", ")}`,
      };
      // Sector
      const overlapSectors = gpMatchProfile.sectors.filter((s) =>
        lp.sectors.includes(s)
      );
      const sectRatio =
        overlapSectors.length > 0
          ? overlapSectors.length / Math.max(gpMatchProfile.sectors.length, 1)
          : 0;
      const sectScore = Math.round(matchWeights.sector * sectRatio);
      raw += sectScore;
      dims.sector = {
        earned: sectScore,
        max: matchWeights.sector,
        match: overlapSectors.length > 0,
        detail:
          overlapSectors.length > 0
            ? `Overlaps: ${overlapSectors.join(", ")}`
            : `No overlap — LP targets ${lp.sectors.slice(0, 2).join(", ")}`,
      };
      // Check size
      const overlap =
        Math.min(gpMatchProfile.checkMax, lp.checkMax) -
        Math.max(gpMatchProfile.checkMin, lp.checkMin);
      const range = Math.max(lp.checkMax - lp.checkMin, 1);
      const csRatio = overlap > 0 ? Math.min(overlap / range, 1) : 0;
      const csScore = Math.round(matchWeights.checkSize * csRatio);
      raw += csScore;
      dims.checkSize = {
        earned: csScore,
        max: matchWeights.checkSize,
        match: overlap > 0,
        detail:
          overlap > 0
            ? `Overlapping check range $${lp.checkMin}–${lp.checkMax}M`
            : `Mismatch — LP range $${lp.checkMin}–${lp.checkMax}M`,
      };
      // Geography
      const geoMatch = lp.geographies.some(
        (g) =>
          g.toLowerCase() === gpMatchProfile.geography.toLowerCase() ||
          g.toLowerCase() === "global"
      );
      const geoScore = geoMatch ? matchWeights.geography : 0;
      raw += geoScore;
      dims.geography = {
        earned: geoScore,
        max: matchWeights.geography,
        match: geoMatch,
        detail: geoMatch
          ? `Covers ${gpMatchProfile.geography}`
          : `LP targets ${lp.geographies.join(", ")}`,
      };
      const score = maxRaw > 0 ? Math.round((raw / maxRaw) * 100) : 0;
      const reasons = Object.entries(dims).map(([k, v]) => ({
        label: k,
        ...v,
      }));
      return { score, dims, reasons, lp };
    })
    .sort((a, b) => b.score - a.score);

  const strongMatches = fitResults.filter((x) => x.score >= 75);
  const filteredMatches = fitResults.filter((r) => {
    const q = matchSearch.toLowerCase();
    const typeOk = matchTypeFilter === "All" || r.lp.type === matchTypeFilter;
    const sectorOk =
      matchSectorFilter === "All" || r.lp.sectors.includes(matchSectorFilter);
    const geoOk =
      matchGeoFilter === "All" || r.lp.geographies.includes(matchGeoFilter);
    const deployingOk = !matchDeployingOnly || r.lp.deploying;
    const checkOk =
      r.lp.checkMax >= Number(matchCheckMin) &&
      r.lp.checkMin <= Number(matchCheckMax);
    return (
      r.score >= matchThreshold &&
      typeOk &&
      sectorOk &&
      geoOk &&
      deployingOk &&
      checkOk &&
      (r.lp.name.toLowerCase().includes(q) ||
        r.lp.type.toLowerCase().includes(q))
    );
  });
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (matchSortMode === "checkMax") return b.lp.checkMax - a.lp.checkMax;
    if (matchSortMode === "checkMin") return a.lp.checkMin - b.lp.checkMin;
    if (matchSortMode === "type")
      return a.lp.type.localeCompare(b.lp.type) || b.score - a.score;
    return b.score - a.score;
  });
  const matchSectorOptions = [
    "All",
    ...Array.from(new Set(effectiveLpDb.flatMap((lp) => lp.sectors || []))).sort(),
  ];
  const matchGeoOptions = [
    "All",
    ...Array.from(new Set(effectiveLpDb.flatMap((lp) => lp.geographies || []))).sort(),
  ];

  const [revealRequests, setRevealRequests] = useState([
    {
      id: 1,
      lpName: "Cedar Grove Family Office",
      lpType: "Family Office",
      fitScore: 94,
      status: "Approved",
      note: "Emerging-manager sleeve confirmed. Principal likes AI infra and healthcare overlap.",
      createdAt: "2 days ago",
    },
    {
      id: 2,
      lpName: "Blue Lake Foundation",
      lpType: "Foundation",
      fitScore: 89,
      status: "Approved",
      note: "Mission-aligned healthcare and climate software mandate. $1.5M capacity flagged.",
      createdAt: "3 days ago",
    },
    {
      id: 3,
      lpName: "Launchpad Fund of Funds",
      lpType: "Fund of Funds",
      fitScore: 87,
      status: "Approved",
      note: "Fund I specialist. Requested reference calls and attribution memo before IC.",
      createdAt: "4 days ago",
    },
    {
      id: 4,
      lpName: "Mosaic Emerging Manager Trust",
      lpType: "Endowment",
      fitScore: 84,
      status: "Approved",
      note: "Endowment seeding program is reviewing first-time venture funds under $75M.",
      createdAt: "5 days ago",
    },
    {
      id: 5,
      lpName: "Brightline Ventures Access",
      lpType: "Family Office",
      fitScore: 81,
      status: "Approved",
      note: "Interested in a $750K anchor if first close hits $20M.",
      createdAt: "6 days ago",
    },
    {
      id: 6,
      lpName: "Sequoia Ridge Foundation",
      lpType: "Foundation",
      fitScore: 78,
      status: "Pending",
      note: "Fit confirmed on healthcare and climate. Awaiting program-related investment review.",
      createdAt: "1 day ago",
    },
    {
      id: 7,
      lpName: "North Pier Allocators",
      lpType: "Fund of Funds",
      fitScore: 74,
      status: "Pending",
      note: "Wants more proof on sourcing repeatability before identity reveal.",
      createdAt: "Today",
    },
    {
      id: 8,
      lpName: "Harborline Pension Innovation Sleeve",
      lpType: "Pension",
      fitScore: 57,
      status: "Declined",
      note: "Minimum fund size too small for current pension mandate. Revisit at Fund II.",
      createdAt: "2 weeks ago",
    },
  ]);

  const [pipeline, setPipeline] = useState([
    {
      id: 101,
      lpName: "Cedar Grove Family Office",
      lpType: "Family Office",
      fitScore: 94,
      stage: "IC Pending",
      note: "IC scheduled April 10 — wants final reference pack and attribution memo",
      probability: 82,
      commitmentSize: "$2M",
      lastUpdate: "Today",
    },
    {
      id: 102,
      lpName: "Blue Lake Foundation",
      lpType: "Foundation",
      fitScore: 89,
      stage: "In Diligence",
      note: "Reviewing healthcare thesis and impact reporting template",
      probability: 68,
      commitmentSize: "$1.5M",
      lastUpdate: "Yesterday",
    },
    {
      id: 103,
      lpName: "Launchpad Fund of Funds",
      lpType: "Fund of Funds",
      fitScore: 87,
      stage: "Soft Circled",
      note: "Verbal soft circle at $2M pending two founder references",
      probability: 86,
      commitmentSize: "$2M",
      lastUpdate: "2 days ago",
    },
    {
      id: 104,
      lpName: "Mosaic Emerging Manager Trust",
      lpType: "Endowment",
      fitScore: 84,
      stage: "In Diligence",
      note: "Emerging-manager program reviewing first-time-fund economics",
      probability: 58,
      commitmentSize: "$3M",
      lastUpdate: "Today",
    },
    {
      id: 105,
      lpName: "Brightline Ventures Access",
      lpType: "Family Office",
      fitScore: 81,
      stage: "Soft Circled",
      note: "Anchor interest at $750K after first close reaches $20M",
      probability: 74,
      commitmentSize: "$0.75M",
      lastUpdate: "3 days ago",
    },
    {
      id: 106,
      lpName: "Sequoia Ridge Foundation",
      lpType: "Foundation",
      fitScore: 78,
      stage: "Reveal Pending",
      note: "Program-related investment committee reviewing climate software fit",
      probability: 42,
      commitmentSize: "$1M",
      lastUpdate: "1 day ago",
    },
    {
      id: 107,
      lpName: "North Pier Allocators",
      lpType: "Fund of Funds",
      fitScore: 74,
      stage: "Requested",
      note: "Requested a sourcing memo before approving reveal",
      probability: 29,
      commitmentSize: "$1.25M",
      lastUpdate: "Today",
    },
    {
      id: 108,
      lpName: "Lumen Family Capital",
      lpType: "Family Office",
      fitScore: 69,
      stage: "Requested",
      note: "Deck opened twice. Waiting on warm intro from operator network.",
      probability: 24,
      commitmentSize: "$0.5M",
      lastUpdate: "2 days ago",
    },
    {
      id: 109,
      lpName: "Harborline Pension Innovation Sleeve",
      lpType: "Pension",
      fitScore: 57,
      stage: "Passed",
      note: "Fund size below current pension minimum. Revisit at Fund II.",
      probability: 0,
      commitmentSize: "$0",
      lastUpdate: "2 weeks ago",
    },
  ]);

  const [diligenceItems, setDiligenceItems] = useState({
    101: {
      lpName: "Cedar Grove Family Office",
      stage: "IC Pending",
      checklist: {
        "Pre-fund track record reviewed": true,
        "Founder references requested": true,
        "Fund terms reviewed": true,
        "Emerging GP memo drafted": true,
        "Data room accessed": true,
        "Attribution memo finalized": false,
        "Reference pack sent": false,
      },
      notes:
        "Principal has backed two first-time venture managers before and wants to anchor before the first institutional close. Main diligence question is whether pre-fund markups are attributable to the GP or shared angel access.",
      nextStep:
        "Send attribution memo and final reference pack before April 9 IC prep",
      priority: "Urgent",
      contact: "Maya Chen, Principal",
      documents: [
        {
          name: "Fund I Deck v7",
          type: "Presentation",
          submittedAt: "Apr 2, 2026",
          status: "Approved",
          reviewer: "Maya Chen",
          comments: "Clear first-close narrative",
        },
        {
          name: "Pre-Fund Track Record",
          type: "Financial",
          submittedAt: "Mar 27, 2026",
          status: "Reviewed",
          reviewer: "Investment Team",
          comments: "Need attribution notes by deal",
        },
        {
          name: "Attribution Memo",
          type: "Financial",
          submittedAt: null,
          status: "Pending",
          reviewer: null,
          comments: "Due before IC prep",
        },
        {
          name: "Team Bios",
          type: "Personnel",
          submittedAt: "Mar 24, 2026",
          status: "Approved",
          reviewer: "Maya Chen",
          comments: "Founder-market fit is strong",
        },
        {
          name: "LPA Draft",
          type: "Legal",
          submittedAt: "Apr 1, 2026",
          status: "Under Review",
          reviewer: "Outside Counsel",
          comments: "Reviewing first-time-fund fee stepdown",
        },
        {
          name: "Reference Pack",
          type: "Personnel",
          submittedAt: null,
          status: "Pending",
          reviewer: null,
          comments: "3 founder calls requested",
        },
      ],
    },
    102: {
      lpName: "Blue Lake Foundation",
      stage: "In Diligence",
      checklist: {
        "Mission fit reviewed": true,
        "Healthcare thesis reviewed": true,
        "Impact reporting template sent": false,
        "Data room accessed": true,
        "References requested": true,
        "LPA redline received": false,
        "Side letter terms reviewed": false,
      },
      notes:
        "Foundation team is interested because the fund can source care delivery and climate software before traditional seed funds. They need a simple impact reporting template before moving to approval.",
      nextStep:
        "Send impact reporting template and healthcare case studies by Friday",
      priority: "High",
      contact: "Ari Patel, Director of Mission Investments",
      documents: [
        {
          name: "Fund I Deck v7",
          type: "Presentation",
          submittedAt: "Apr 1, 2026",
          status: "Reviewed",
          reviewer: "Ari Patel",
          comments: "Asked for healthcare case studies",
        },
        {
          name: "Healthcare Case Studies",
          type: "Investment Memo",
          submittedAt: null,
          status: "Pending",
          reviewer: null,
          comments: "Two examples requested",
        },
        {
          name: "Impact Reporting Template",
          type: "Reporting",
          submittedAt: null,
          status: "Pending",
          reviewer: null,
          comments: "Required before approval committee",
        },
        {
          name: "Team Bios",
          type: "Personnel",
          submittedAt: "Mar 29, 2026",
          status: "Approved",
          reviewer: "Ari Patel",
          comments: "",
        },
        {
          name: "LPA Draft",
          type: "Legal",
          submittedAt: "Apr 2, 2026",
          status: "Under Review",
          reviewer: "Foundation Counsel",
          comments: "Side letter terms under review",
        },
      ],
    },
    105: {
      lpName: "Launchpad Fund of Funds",
      stage: "Soft Circled",
      checklist: {
        "Emerging manager screen passed": true,
        "Portfolio construction reviewed": true,
        "Fund terms reviewed": false,
        "Data room accessed": true,
        "References requested": true,
        "Founder references completed": false,
        "Warehoused deal memo reviewed": false,
      },
      notes:
        "Fund of funds specializes in Fund I and II venture managers. They are soft-circled at $2M but want to complete two founder references and review one warehoused investment memo.",
      nextStep:
        "Schedule founder reference calls and upload warehoused deal memo",
      priority: "Normal",
      contact: "Nadia Flores, Partner",
      documents: [
        {
          name: "Fund I Deck v7",
          type: "Presentation",
          submittedAt: "Mar 28, 2026",
          status: "Approved",
          reviewer: "Nadia Flores",
          comments: "",
        },
        {
          name: "Portfolio Construction Model",
          type: "Financial",
          submittedAt: "Mar 30, 2026",
          status: "Approved",
          reviewer: "Investment Team",
          comments: "Fund size and reserves strategy accepted",
        },
        {
          name: "Warehoused Deal Memo",
          type: "Investment Memo",
          submittedAt: null,
          status: "Requested",
          reviewer: null,
          comments: "Needed before allocation committee",
        },
        {
          name: "Founder Reference Calls",
          type: "Personnel",
          submittedAt: null,
          status: "Pending",
          reviewer: "Nadia Flores",
          comments: "Two calls requested",
        },
      ],
    },
  });

  const marketFeedback = buildGpMarketFeedback(
    pipeline,
    fitResults,
    standardized
  );
  const approvedRevealCount = revealRequests.filter(
    (x) => x.status === "Approved"
  ).length;
  const activePipelineCount = pipeline.filter(
    (p) => !["Passed"].includes(p.stage)
  ).length;
  const introRooms = pipeline
    .filter((p) =>
      ["In Diligence", "IC Pending", "Soft Circled", "Committed"].includes(
        p.stage
      )
    )
    .map((p) => {
      const diligence = Object.values(diligenceItems).find(
        (d) => d.lpName === p.lpName
      );
      return {
        ...p,
        diligence,
        sharedDocs: diligence?.documents?.filter((doc) => doc.submittedAt) || [],
        openItems:
          diligence?.documents?.filter((doc) => !doc.submittedAt).length || 0,
      };
    });
  const weightedCapital = pipeline
    .filter((p) => p.stage !== "Passed")
    .reduce((sum, p) => {
      const amt =
        parseFloat((p.commitmentSize || "$0").replace(/[$M]/g, "")) || 0;
      return sum + amt * (p.probability / 100);
    }, 0);

  const requestReveal = (match) => {
    const already = revealRequests.some((r) => r.lpName === match.lp.name);
    if (already) {
      showToast("Reveal request already submitted", "info");
      return;
    }

    const newReveal = {
      id: Date.now(),
      lpName: match.lp.name,
      lpType: match.lp.type,
      fitScore: match.score,
      status: "Pending",
      note: match.dims?.strategy?.match
        ? `Strategy fit: ${match.lp.strategies?.[0] || "confirmed"}`
        : match.dims?.sector?.match
        ? `Sector overlap: ${match.dims.sector.detail}`
        : "Qualified fit request submitted",
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
        commitmentSize: "$2M",
        lastUpdate: "Just now",
      },
      ...prev,
    ]);
    showToast(`Reveal request sent for ${match.lp.name}`, "success");
  };

  const nav = (
    <>
	      <NavItem
	        label="Overview"
	        icon="OV"
	        active={page === "overview"}
	        onClick={() => setPage("overview")}
	      />
	      <NavItem
	        label="Fund Profile"
	        icon="FP"
	        active={page === "profile"}
	        onClick={() => setPage("profile")}
	      />
	      <NavItem
	        label="Materials"
	        icon="MT"
	        active={page === "materials"}
	        onClick={() => setPage("materials")}
	      />
	      <NavItem
	        label="Standardization"
	        icon="ST"
	        active={page === "standardization"}
	        onClick={() => setPage("standardization")}
	      />
	      <NavItem
	        label="Match Engine"
	        icon="ME"
	        active={page === "matches"}
	        onClick={() => setPage("matches")}
	        badge={strongMatches.length}
	      />
	      <NavItem
	        label="Reveal Queue"
	        icon="RQ"
	        active={page === "reveal"}
	        onClick={() => setPage("reveal")}
	        badge={revealRequests.filter((r) => r.status === "Pending").length}
	      />
	      <NavItem
	        label="Intro Rooms"
	        icon="IR"
	        active={page === "intro"}
	        onClick={() => setPage("intro")}
	        badge={introRooms.length}
	      />
	      <NavItem
	        label="Diligence"
	        icon="DD"
	        active={page === "diligence"}
	        onClick={() => setPage("diligence")}
	        badge={Object.keys(diligenceItems).length}
	      />
	      <NavItem
	        label="Pipeline"
	        icon="PL"
	        active={page === "pipeline"}
	        onClick={() => setPage("pipeline")}
	        badge={activePipelineCount}
	      />
	      <NavItem
	        label="Analytics"
	        icon="AN"
	        active={page === "analytics"}
	        onClick={() => setPage("analytics")}
	      />
	      <NavItem
	        label="Market Feedback"
	        icon="MF"
	        active={page === "feedback"}
	        onClick={() => setPage("feedback")}
	      />
	      <NavItem
	        label="Settings"
	        icon="CF"
	        active={page === "settings"}
	        onClick={() => setPage("settings")}
	      />
    </>
  );

  return (
    <WorkspaceShell
      user={user}
      onLogout={onLogout}
      nav={nav}
      topRight={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.green,
              boxShadow: `0 0 6px ${C.green}80`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: C.textMuted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            GP Workspace
          </span>
          <div
            style={{
              width: 1,
              height: 14,
              background: C.border,
              margin: "0 2px",
            }}
          />
          <span style={{ fontSize: 11, color: C.textMuted }}>
            {gpProfile.firmName}
          </span>
        </div>
      }
    >
      {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
      {page === "overview" &&
        (() => {
          const topMatch = fitResults[0];
          const nextMatches = fitResults.slice(1, 4);
          const topMatchInPipeline = topMatch
            ? pipeline.find((p) => p.lpName === topMatch.lp.name)
            : null;
          const topMatchReveal = topMatch
            ? revealRequests.find((r) => r.lpName === topMatch.lp.name)
            : null;
          const hitReasons = topMatch
            ? topMatch.reasons.filter((r) => r.match)
            : [];
          const missReasons = topMatch
            ? topMatch.reasons.filter((r) => !r.match)
            : [];
          const dataRoomIncomplete =
            fundSubmission.dataRoomReadiness !== "Complete";
          const blockers = [
            ...missReasons.map((r) => ({ text: r.detail, action: "matches" })),
            ...(dataRoomIncomplete
              ? [
                  {
                    text: "Data room incomplete — limits match scores",
                    action: "materials",
                  },
                ]
              : []),
            ...(!topMatchReveal && topMatch
              ? [
                  {
                    text: `No reveal sent to ${topMatch.lp.name} yet`,
                    action: "reveal",
                  },
                ]
              : []),
            ...(topMatchReveal && topMatchReveal.status === "Pending"
              ? [
                  {
                    text: "Reveal pending LP approval — follow up if >48h",
                    action: "reveal",
                  },
                ]
              : []),
          ].slice(0, 3);
          const urgentActions = [
            pipeline.find((p) => p.stage === "IC Pending") && {
              label: `IC prep — ${
                pipeline.find((p) => p.stage === "IC Pending").lpName
              }`,
              detail: pipeline.find((p) => p.stage === "IC Pending").note,
              color: C.red,
              urgency: "Today",
              action: "diligence",
            },
            pipeline.find((p) => p.stage === "In Diligence") && {
              label: `Advance diligence — ${
                pipeline.find((p) => p.stage === "In Diligence").lpName
              }`,
              detail: pipeline.find((p) => p.stage === "In Diligence").note,
              color: C.amber,
              urgency: "This week",
              action: "diligence",
            },
            topMatch &&
              !topMatchReveal && {
                label: `Request reveal — ${topMatch.lp.name}`,
                detail: `Score ${topMatch.score} · No reveal sent yet`,
                color: C.accent,
                urgency: "Next",
                action: "reveal",
              },
            dataRoomIncomplete && {
              label: "Complete data room",
              detail: "Unlock higher match scores across all LPs",
              color: C.purple,
              urgency: "Next",
              action: "materials",
            },
	          ]
	            .filter(Boolean)
	            .slice(0, 4);
	          const topSc = topMatch ? getScoreColor(topMatch.score) : C.accent;
	          const raisedAmount =
	            parseFloat((fundSubmission.raisedToDate || "0").replace(/[$M]/g, "")) ||
	            0;
	          const targetAmount =
	            parseFloat((fundSubmission.targetFundSize || "1").replace(/[$M]/g, "")) ||
	            1;
	          const firstCloseAmount =
	            parseFloat(
	              (fundSubmission.targetFirstClose || "1").replace(/[$M]/g, "")
	            ) || 1;
	          const raisePct = Math.min(
	            100,
	            Math.round((raisedAmount / targetAmount) * 100)
	          );
	          const firstClosePct = Math.min(
	            100,
	            Math.round((raisedAmount / firstCloseAmount) * 100)
	          );
	          const launchMetrics = [
	            { label: "Raised", value: fundSubmission.raisedToDate, color: C.green },
	            {
	              label: "First Close",
	              value: `${firstClosePct}%`,
	              color: firstClosePct >= 75 ? C.green : C.amber,
	            },
	            {
	              label: "Weighted Capital",
	              value: `$${weightedCapital.toFixed(1)}M`,
	              color: C.teal,
	            },
	            {
	              label: "Readiness",
	              value: `${readinessScore}%`,
	              color: readinessScore >= 75 ? C.green : C.amber,
	            },
	          ];
	          const launchPath = [
	            ["Profile", readinessScore >= 70],
	            ["Materials", standardized.materialsCompleteness >= 70],
	            ["Matches", strongMatches.length >= 5],
	            ["Reveal", approvedRevealCount >= 3],
	            ["Diligence", pipeline.some((p) => p.stage === "In Diligence")],
	            ["First Close", raisedAmount >= firstCloseAmount],
	          ];
	          return (
	            <div style={{ display: "grid", gap: 16 }}>
	              {/* Slim context bar */}
	              <div
	                style={{
	                  position: "relative",
	                  overflow: "hidden",
	                  padding: "26px 28px",
	                  borderRadius: 18,
	                  background:
	                    "linear-gradient(135deg, rgba(19,16,48,.98), rgba(8,7,23,.99) 58%, rgba(10,18,32,.96))",
	                  border: `1px solid ${C.accent}28`,
	                  boxShadow:
	                    "0 26px 80px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.06)",
	                }}
	              >
	                <div
	                  style={{
	                    position: "absolute",
	                    inset: 0,
	                    background: `radial-gradient(ellipse 55% 80% at 82% 0%, ${C.accent}18, transparent 64%), radial-gradient(ellipse 45% 70% at 0% 100%, ${C.teal}10, transparent 62%)`,
	                    pointerEvents: "none",
	                  }}
	                />
	                <div
	                  style={{
	                    position: "relative",
	                    display: "grid",
	                    gridTemplateColumns: "minmax(0, 1.25fr) minmax(360px, .75fr)",
	                    gap: 28,
	                    alignItems: "end",
	                  }}
	                >
	                  <div>
	                    <div
	                      style={{
	                        display: "flex",
	                        alignItems: "center",
	                        gap: 10,
	                        marginBottom: 12,
	                      }}
	                    >
	                      <Pill color={C.accent} size="xs">
	                        {fundSubmission.currentStatus}
	                      </Pill>
	                      <span
	                        style={{
	                          fontSize: 11,
	                          color: C.textMuted,
	                          fontWeight: 800,
	                          letterSpacing: 1.2,
	                          textTransform: "uppercase",
	                        }}
	                      >
	                        GP launch command center
	                      </span>
	                    </div>
	                    <div
	                      style={{
	                        fontSize: "clamp(30px, 4vw, 52px)",
	                        lineHeight: 1,
	                        letterSpacing: -1.6,
	                        fontWeight: 850,
	                        maxWidth: 760,
	                      }}
	                    >
	                      {gpProfile.firmName}
	                    </div>
	                    <div
	                      style={{
	                        marginTop: 12,
	                        fontSize: 14,
	                        color: C.textSoft,
	                        maxWidth: 720,
	                        lineHeight: 1.6,
	                      }}
	                    >
	                      {fundSubmission.fundName} is sequencing first-close
	                      capital against high-fit LP mandates, reveal approvals,
	                      and diligence blockers.
	                    </div>
	                  </div>
	                  <div
	                    style={{
	                      padding: 16,
	                      borderRadius: 14,
	                      background: "rgba(4,3,14,.58)",
	                      border: `1px solid ${C.border}`,
	                      boxShadow: `0 0 28px ${C.accent}10 inset`,
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
	                          fontSize: 12,
	                          color: C.textSoft,
	                          fontWeight: 700,
	                        }}
	                      >
	                        Raise progress
	                      </span>
	                      <Mono size={18} weight={850} color={C.green}>
	                        {raisePct}%
	                      </Mono>
	                    </div>
	                    <div
	                      style={{
	                        height: 8,
	                        background: C.borderSubtle,
	                        borderRadius: 99,
	                        overflow: "hidden",
	                        marginBottom: 10,
	                      }}
	                    >
	                      <div
	                        style={{
	                          width: `${raisePct}%`,
	                          height: "100%",
	                          background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
	                          borderRadius: 99,
	                          boxShadow: `0 0 18px ${C.green}50`,
	                        }}
	                      />
	                    </div>
	                    <div
	                      style={{
	                        display: "flex",
	                        justifyContent: "space-between",
	                        color: C.textMuted,
	                        fontSize: 11,
	                      }}
	                    >
	                      <span>{fundSubmission.raisedToDate} raised</span>
	                      <span>{fundSubmission.targetFundSize} target</span>
	                    </div>
	                  </div>
	                </div>
	              </div>

	              <div
	                style={{
	                  display: "grid",
	                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
	                  gap: 12,
	                }}
	              >
	                {launchMetrics.map((metric) => (
	                  <div
	                    key={metric.label}
	                    style={{
	                      padding: "16px 18px",
	                      borderRadius: 14,
	                      background: `linear-gradient(135deg, ${metric.color}12, ${C.card})`,
	                      border: `1px solid ${metric.color}28`,
	                      boxShadow: `0 16px 44px rgba(0,0,0,.22), 0 0 24px ${metric.color}08 inset`,
	                    }}
	                  >
	                    <div
	                      style={{
	                        color: metric.color,
	                        fontSize: 10,
	                        fontWeight: 850,
	                        letterSpacing: 1,
	                        textTransform: "uppercase",
	                        marginBottom: 8,
	                      }}
	                    >
	                      {metric.label}
	                    </div>
	                    <Mono size={26} weight={850} color={metric.color}>
	                      {metric.value}
	                    </Mono>
	                  </div>
	                ))}
	              </div>

	              <div
	                style={{
	                  display: "grid",
	                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
	                  gap: 8,
	                  padding: 10,
	                  borderRadius: 14,
	                  background: C.card,
	                  border: `1px solid ${C.border}`,
	                }}
	              >
	                {launchPath.map(([label, done], i) => (
	                  <button
	                    key={label}
	                    type="button"
	                    onClick={() =>
	                      setPage(
	                        label === "Profile"
	                          ? "profile"
	                          : label === "Materials"
	                          ? "materials"
	                          : label === "Matches"
	                          ? "matches"
	                          : label === "Reveal"
	                          ? "reveal"
	                          : label === "Diligence"
	                          ? "diligence"
	                          : "pipeline"
	                      )
	                    }
	                    style={{
	                      padding: "11px 10px",
	                      borderRadius: 10,
	                      border: `1px solid ${done ? C.green + "35" : C.borderSubtle}`,
	                      background: done ? C.greenWash : "rgba(255,255,255,.025)",
	                      color: done ? C.green : C.textSoft,
	                      cursor: "pointer",
	                      fontFamily: "inherit",
	                      textAlign: "left",
	                    }}
	                  >
	                    <div
	                      style={{
	                        fontFamily: "'Source Code Pro',monospace",
	                        fontSize: 10,
	                        color: done ? C.green : C.textMuted,
	                        fontWeight: 800,
	                        marginBottom: 5,
	                      }}
	                    >
	                      {String(i + 1).padStart(2, "0")}
	                    </div>
	                    <div style={{ fontSize: 12, fontWeight: 760 }}>
	                      {label}
	                    </div>
	                  </button>
	                ))}
	              </div>

	              <EnterpriseGradePanel
	                onNavigate={setPage}
	                metrics={[
	                  {
	                    label: "Mandates Scored",
	                    value: fitResults.length,
	                    color: C.accent,
	                  },
	                  {
	                    label: "Qualified Fits",
	                    value: strongMatches.length,
	                    color: C.green,
	                  },
	                  {
	                    label: "Approved Reveals",
	                    value: approvedRevealCount,
	                    color: C.teal,
	                  },
	                  {
	                    label: "Intro Rooms",
	                    value: introRooms.length,
	                    color: C.purple,
	                  },
	                ]}
	              />

	              {/* HERO ROW: Priority target + What to do now */}
	              <div
	                style={{
	                  display: "grid",
	                  gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 360px)",
	                  gap: 16,
	                  alignItems: "start",
	                }}
	              >
                {/* Priority Target featured card */}
                {topMatch && (
	                  <div
	                    style={{
	                      background:
	                        "linear-gradient(145deg, rgba(19,16,48,.98), rgba(8,7,23,.98))",
	                      border: `1px solid ${topSc}30`,
	                      borderRadius: 16,
	                      overflow: "hidden",
	                      boxShadow: `0 22px 70px rgba(0,0,0,.38), 0 0 34px ${topSc}0d`,
	                    }}
	                  >
                    {/* Card eyebrow */}
                    <div
                      style={{
                        padding: "12px 20px",
                        borderBottom: `1px solid ${C.borderSubtle}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Mono
                        size={10}
                        color={C.textMuted}
                        style={{
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                        }}
                      >
                        Priority Target
                      </Mono>
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background: C.borderSubtle,
                        }}
                      />
                      <Pill color={topSc} size="xs">
                        #{fitResults.indexOf(topMatch) + 1} Match
                      </Pill>
                    </div>

                    {/* LP identity + score */}
                    <div
                      style={{
                        padding: "18px 20px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 16,
                        borderBottom: `1px solid ${C.borderSubtle}`,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          border: `2px solid ${topSc}50`,
                          background: `${topSc}12`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Mono size={17} weight={900} color={topSc}>
                          {topMatch.score}
                        </Mono>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: C.text,
                            marginBottom: 3,
                          }}
                        >
                          {topMatch.lp.name}
                        </div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>
                          {topMatch.lp.type} ·{" "}
                          {formatMoneyRange(
                            topMatch.lp.checkMin,
                            topMatch.lp.checkMax
                          )}{" "}
                          check ·{" "}
                          {topMatch.lp.geographies.slice(0, 2).join(", ")}
                        </div>
                        {topMatchInPipeline && (
                          <div style={{ marginTop: 6 }}>
                            <Pill
                              color={
                                STAGE_COLORS[topMatchInPipeline.stage] ||
                                C.accent
                              }
                              size="xs"
                            >
                              {topMatchInPipeline.stage}
                            </Pill>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Why this fits / What's blocking */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 0,
                      }}
                    >
                      <div
                        style={{
                          padding: "16px 20px",
                          borderRight: `1px solid ${C.borderSubtle}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: C.green,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}
                        >
                          Why this LP fits
                        </div>
                        {hitReasons.length > 0 ? (
                          hitReasons.map((r, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: `${C.green}20`,
                                  border: `1px solid ${C.green}50`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 9,
                                    color: C.green,
                                    fontWeight: 800,
                                  }}
                                >
                                  ✓
                                </span>
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 660,
                                    color: C.text,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {r.label}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: C.textMuted,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {r.detail}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 12, color: C.textMuted }}>
                            No strong fit signals yet
                          </div>
                        )}
                      </div>

                      <div style={{ padding: "16px 20px" }}>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: C.amber,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}
                        >
                          What's blocking
                        </div>
                        {blockers.length > 0 ? (
                          blockers.map((b, i) => (
                            <div
                              key={i}
                              onClick={() => setPage(b.action)}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                marginBottom: 8,
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "0.75")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "1")
                              }
                            >
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: `${C.amber}18`,
                                  border: `1px solid ${C.amber}50`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 9,
                                    color: C.amber,
                                    fontWeight: 800,
                                  }}
                                >
                                  !
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: 11.5,
                                  color: C.textSoft,
                                  lineHeight: 1.45,
                                }}
                              >
                                {b.text}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: 12, color: C.textMuted }}>
                            No major blockers detected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA footer */}
                    <div
                      style={{
                        padding: "12px 20px",
                        borderTop: `1px solid ${C.borderSubtle}`,
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      {!topMatchReveal ? (
                        <Btn
                          variant="primary"
                          size="sm"
                          onClick={() => requestReveal(topMatch)}
                        >
                          Request Reveal
                        </Btn>
                      ) : (
                        <Pill
                          color={
                            topMatchReveal.status === "Approved"
                              ? C.green
                              : topMatchReveal.status === "Declined"
                              ? C.red
                              : C.amber
                          }
                          size="xs"
                        >
                          Reveal {topMatchReveal.status}
                        </Pill>
                      )}
                      {topMatchInPipeline ? (
                        <Btn
                          variant="secondary"
                          size="sm"
                          onClick={() => setPage("diligence")}
                        >
                          View Diligence →
                        </Btn>
                      ) : (
                        <Btn
                          variant="secondary"
                          size="sm"
                          onClick={() => setPage("pipeline")}
                        >
                          Add to Pipeline →
                        </Btn>
                      )}
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage("matches")}
                      >
                        All Matches →
                      </Btn>
                    </div>
                  </div>
                )}

                {/* What to do now */}
	                <Card
	                  style={{
	                    borderRadius: 16,
	                    background:
	                      "linear-gradient(160deg, rgba(16,14,38,.98), rgba(8,7,22,.98))",
	                    border: `1px solid ${C.accent}24`,
	                    boxShadow: `0 18px 56px rgba(0,0,0,.32), 0 0 30px ${C.accent}08`,
	                  }}
	                >
	                  <div
	                    style={{
	                      fontWeight: 720,
	                      fontSize: 15,
	                      marginBottom: 14,
	                      color: C.text,
	                    }}
                  >
                    What to do now
                  </div>
                  {urgentActions.map((a, i) => (
                    <div
                      key={i}
                      onClick={() => setPage(a.action)}
                      style={{
                        padding: "10px 0",
                        borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.75")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 3,
                            minHeight: 40,
                            borderRadius: 99,
                            background: a.color,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 3,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12.5,
                                fontWeight: 680,
                                color: C.text,
                                lineHeight: 1.4,
                              }}
                            >
                              {a.label}
                            </div>
                            <Mono
                              size={10}
                              color={a.color}
                              style={{ flexShrink: 0, marginLeft: 8 }}
                            >
                              {a.urgency}
                            </Mono>
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: C.textMuted,
                              lineHeight: 1.45,
                            }}
                          >
                            {a.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>

              {/* OPPORTUNITY QUEUE — next 3 targets */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Next opportunities
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${nextMatches.length}, 1fr)`,
                    gap: 10,
                  }}
                >
                  {nextMatches.map((r) => {
                    const sc = getScoreColor(r.score);
                    const inPipeline = pipeline.find(
                      (p) => p.lpName === r.lp.name
                    );
                    const reveal = revealRequests.find(
                      (req) => req.lpName === r.lp.name
                    );
                    const topHit = r.reasons.find((reason) => reason.match);
                    const topMiss = r.reasons.find((reason) => !reason.match);
                    return (
                      <div
                        key={r.lp.id}
                        style={{
                          background: C.card,
                          border: `1px solid ${C.border}`,
                          borderRadius: 12,
                          padding: "14px 16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
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
                              width: 36,
                              height: 36,
                              borderRadius: 9,
                              border: `2px solid ${sc}40`,
                              background: `${sc}12`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Mono size={12} weight={900} color={sc}>
                              {r.score}
                            </Mono>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.text,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {r.lp.name}
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>
                              {r.lp.type} ·{" "}
                              {formatMoneyRange(r.lp.checkMin, r.lp.checkMax)}
                            </div>
                          </div>
                          {inPipeline && (
                            <Pill
                              color={STAGE_COLORS[inPipeline.stage] || C.accent}
                              size="xs"
                            >
                              {inPipeline.stage}
                            </Pill>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                          }}
                        >
                          {topHit && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  color: C.green,
                                  fontWeight: 800,
                                  marginTop: 1,
                                }}
                              >
                                ✓
                              </span>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  color: C.textSoft,
                                  lineHeight: 1.4,
                                }}
                              >
                                {topHit.detail}
                              </span>
                            </div>
                          )}
                          {topMiss && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  color: C.amber,
                                  fontWeight: 800,
                                  marginTop: 1,
                                }}
                              >
                                !
                              </span>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  color: C.textMuted,
                                  lineHeight: 1.4,
                                }}
                              >
                                {topMiss.detail}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          {!reveal ? (
                            <Btn
                              variant="primary"
                              size="sm"
                              onClick={() => requestReveal(r)}
                            >
                              Request Reveal
                            </Btn>
                          ) : (
                            <Pill
                              color={
                                reveal.status === "Approved"
                                  ? C.green
                                  : reveal.status === "Declined"
                                  ? C.red
                                  : C.amber
                              }
                              size="xs"
                            >
                              Reveal {reveal.status}
                            </Pill>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONTEXT STRIP — raise progress (demoted) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 18px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 680,
                        color: C.textSoft,
                      }}
                    >
                      {fundSubmission.fundName}
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: C.green }}
                    >
                      {fundSubmission.raisedToDate} raised ·{" "}
                      {Math.round(
                        (parseFloat(
                          (fundSubmission.raisedToDate || "0").replace(
                            /[$M]/g,
                            ""
                          )
                        ) /
                          parseFloat(
                            (fundSubmission.targetFundSize || "1").replace(
                              /[$M]/g,
                              ""
                            )
                          )) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: C.borderSubtle,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round(
                          (parseFloat(
                            (fundSubmission.raisedToDate || "0").replace(
                              /[$M]/g,
                              ""
                            )
                          ) /
                            parseFloat(
                              (fundSubmission.targetFundSize || "1").replace(
                                /[$M]/g,
                                ""
                              )
                            )) *
                            100
                        )}%`,
                        background: `linear-gradient(90deg, ${C.green}, ${C.teal})`,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      Target: {fundSubmission.targetFundSize}
                    </span>
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      First close: {fundSubmission.targetFirstClose}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    paddingLeft: 20,
                    borderLeft: `1px solid ${C.borderSubtle}`,
                  }}
                >
                  {[
                    {
                      label: "Active",
                      value: activePipelineCount,
                      color: C.teal,
                    },
                    {
                      label: "Reveals",
                      value: approvedRevealCount,
                      color: C.purple,
                    },
                    {
                      label: "Wtd. Cap",
                      value: `$${weightedCapital.toFixed(1)}M`,
                      color: C.green,
                    },
                    {
                      label: "Readiness",
                      value: `${readinessScore}%`,
                      color: readinessScore >= 75 ? C.green : C.amber,
                    },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: s.color,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

      {page === "profile" && (
        <div style={{ width: "100%" }}>
	          <WorkspaceHeaderTitle
	            title="Fund Profile"
	            subtitle="GP identity layer — who you are, what you raise, and what kind of capital is aligned. This feeds standardization and matching."
	          />
	          <div
	            style={{
	              marginBottom: 16,
	              padding: "24px 26px",
	              borderRadius: 18,
	              background:
	                "linear-gradient(135deg, rgba(19,16,48,.98), rgba(8,7,23,.99) 62%, rgba(6,18,28,.94))",
	              border: `1px solid ${C.accent}28`,
	              boxShadow:
	                "0 26px 80px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.06)",
	              display: "grid",
	              gridTemplateColumns: "minmax(0, 1fr) 360px",
	              gap: 24,
	              alignItems: "center",
	            }}
	          >
	            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
	              <div
	                style={{
	                  width: 78,
	                  height: 78,
	                  borderRadius: 18,
	                  background: `linear-gradient(135deg, ${C.accent}32, ${C.teal}18)`,
	                  border: `1px solid ${C.accent}42`,
	                  display: "flex",
	                  alignItems: "center",
	                  justifyContent: "center",
	                  boxShadow: `0 0 34px ${C.accent}16`,
	                  flexShrink: 0,
	                }}
	              >
	                <span
	                  style={{
	                    fontSize: 24,
	                    fontWeight: 850,
	                    color: C.accentBright,
	                  }}
	                >
	                  {getInitials(gpProfile.firmName)}
	                </span>
	              </div>
	              <div>
	                <div
	                  style={{
	                    fontSize: 32,
	                    fontWeight: 850,
	                    letterSpacing: -0.8,
	                    lineHeight: 1.05,
	                    marginBottom: 8,
	                  }}
	                >
	                  {gpProfile.firmName}
	                </div>
	                <div
	                  style={{
	                    color: C.textSoft,
	                    fontSize: 13.5,
	                    lineHeight: 1.6,
	                    maxWidth: 760,
	                  }}
	                >
	                  {gpProfile.structure} targeting {fundSubmission.targetFundSize}
	                  , built around {gpProfile.sectorFocus}.
	                </div>
	                <div
	                  style={{
	                    display: "flex",
	                    gap: 8,
	                    flexWrap: "wrap",
	                    marginTop: 14,
	                  }}
	                >
	                  {[gpProfile.strategy, gpProfile.geography, gpProfile.raiseStage].map(
	                    (item, i) => (
	                      <Pill
	                        key={item}
	                        color={[C.accent, C.teal, C.amber][i]}
	                        size="xs"
	                      >
	                        {item}
	                      </Pill>
	                    )
	                  )}
	                </div>
	              </div>
	            </div>
	            <div
	              style={{
	                display: "grid",
	                gridTemplateColumns: "1fr 1fr",
	                gap: 10,
	              }}
	            >
	              {[
	                ["MOIC", gpProfile.moic, C.green],
	                ["Portfolio", gpProfile.portfolioCompanies, C.teal],
	                ["Team", gpProfile.teamSize, C.accent],
	                ["DPI", gpProfile.dpi, C.amber],
	              ].map(([label, value, color]) => (
	                <div
	                  key={label}
	                  style={{
	                    padding: "13px 14px",
	                    borderRadius: 12,
	                    background: `${color}10`,
	                    border: `1px solid ${color}26`,
	                  }}
	                >
	                  <div
	                    style={{
	                      fontSize: 10,
	                      color,
	                      fontWeight: 850,
	                      letterSpacing: 1,
	                      textTransform: "uppercase",
	                      marginBottom: 6,
	                    }}
	                  >
	                    {label}
	                  </div>
	                  <Mono size={21} weight={850} color={color}>
	                    {value}
	                  </Mono>
	                </div>
	              ))}
	            </div>
	          </div>

	          <Card
	            style={{
	              marginBottom: 14,
	              borderRadius: 16,
	              background:
	                "linear-gradient(160deg, rgba(16,14,38,.98), rgba(8,7,22,.98))",
	              border: `1px solid ${C.border}`,
	              boxShadow: "0 18px 54px rgba(0,0,0,.28)",
	            }}
	          >
	            <div
	              style={{
	                display: "flex",
	                alignItems: "center",
	                justifyContent: "space-between",
	                gap: 16,
	                marginBottom: 18,
	              }}
	            >
	              <div>
	                <div style={{ fontSize: 16, fontWeight: 780 }}>
	                  Core fund record
	                </div>
	                <div style={{ fontSize: 12.5, color: C.textMuted }}>
	                  These fields power standardization, fit, and reveal routing.
	                </div>
	              </div>
	              <Pill color={readinessScore >= 75 ? C.green : C.amber} size="xs">
	                {readinessScore}% ready
	              </Pill>
	            </div>
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
              <FInput
                label="AUM (Current)"
                value={gpProfile.aum}
                onChange={(v) => setGpProfile((p) => ({ ...p, aum: v }))}
              />
              <FInput
                label="Year Founded"
                value={gpProfile.founded}
                onChange={(v) => setGpProfile((p) => ({ ...p, founded: v }))}
              />
              <FInput
                label="Team Size"
                value={gpProfile.teamSize}
                onChange={(v) => setGpProfile((p) => ({ ...p, teamSize: v }))}
              />
              <FInput
                label="Website"
                value={gpProfile.website}
                onChange={(v) => setGpProfile((p) => ({ ...p, website: v }))}
                placeholder="yourfirm.com"
              />
            </div>
          </Card>

	          <Card
	            style={{
	              marginBottom: 14,
	              borderRadius: 16,
	              background:
	                "linear-gradient(160deg, rgba(13,18,38,.96), rgba(8,7,22,.98))",
	              border: `1px solid ${C.teal}22`,
	              boxShadow: `0 18px 54px rgba(0,0,0,.28), 0 0 26px ${C.teal}08`,
	            }}
	          >
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
	              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
	                        padding: "8px 12px",
	                        borderRadius: 8,
	                        border: `1px solid ${active ? C.accent : C.border}`,
	                        background: active ? C.accentWash : C.bg,
	                        color: active ? C.accentBright : C.textSoft,
	                        fontSize: 12,
	                        fontWeight: 720,
	                        cursor: "pointer",
	                        boxShadow: active ? `0 0 18px ${C.accent}10` : "none",
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
	                  minHeight: 112,
	                  resize: "none",
	                  padding: "13px 14px",
	                  background: "rgba(4,3,14,.62)",
	                  border: `1px solid ${C.borderSubtle}`,
	                  borderRadius: 10,
	                  color: C.text,
	                  fontSize: 13,
	                  lineHeight: 1.65,
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
	                  minHeight: 112,
	                  resize: "none",
	                  padding: "13px 14px",
	                  background: "rgba(4,3,14,.62)",
	                  border: `1px solid ${C.borderSubtle}`,
	                  borderRadius: 10,
	                  color: C.text,
	                  fontSize: 13,
	                  lineHeight: 1.65,
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

      {/* ── MATERIALS ─────────────────────────────────────────────────────── */}
      {page === "materials" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Materials"
            subtitle="Your fundraising materials converted into LP-readable intelligence. Completeness drives match quality."
          />

          {/* Completeness banner */}
          <div
            style={{
              padding: "14px 18px",
              background: `linear-gradient(135deg, ${C.accent}10, ${C.card})`,
              border: `1px solid ${C.accent}25`,
              borderRadius: 12,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                Materials Completeness
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>
                4 of 5 materials uploaded · References and data room still need
                cleanup
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.amber }}>
                {standardized.materialsCompleteness}%
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Complete
              </div>
            </div>
          </div>

          {/* Materials list */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
              Fund Materials
            </div>
            {[
              {
                label: "Fund Deck / One-Pager",
                key: "deckUploaded",
                desc: "Primary marketing material — the LP's first impression",
                quality: 88,
                lastUpdated: "2 days ago",
                required: true,
              },
              {
                label: "Team Bios",
                key: "teamBiosUploaded",
                desc: "Background and attribution for each investment professional",
                quality: 72,
                lastUpdated: "3 days ago",
                required: true,
              },
              {
                label: "Prior Performance Schedule",
                key: "performanceUploaded",
                desc: "Realized and unrealized returns by investment — must be deal-level",
                quality: 65,
                lastUpdated: "5 days ago",
                required: true,
              },
              {
                label: "Term Sheet / LPA Summary",
                key: "termsSheetUploaded",
                desc: "Fee structure, carry, governance, LP rights",
                quality: 74,
                lastUpdated: "Yesterday",
                required: true,
              },
              {
                label: "LP Reference List",
                key: "lpReferencesUploaded",
                desc: "Prior LP contacts available for reference calls",
                quality: 0,
                lastUpdated: "Not uploaded",
                required: false,
              },
            ].map((mat, i) => {
              const uploaded = fundSubmission[mat.key];
              const statusColor = uploaded
                ? mat.quality >= 75
                  ? C.green
                  : C.amber
                : C.red;
              return (
                <div
                  key={mat.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: uploaded ? `${statusColor}15` : `${C.red}10`,
                      border: `1px solid ${statusColor}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{uploaded ? "✓" : "—"}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 13.5, fontWeight: 660 }}>
                        {mat.label}
                      </span>
                      {mat.required && (
                        <span
                          style={{
                            fontSize: 10,
                            color: C.textMuted,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          Required
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: C.textMuted,
                        marginBottom: 4,
                      }}
                    >
                      {mat.desc}
                    </div>
                    {uploaded && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            height: 4,
                            width: 80,
                            background: C.borderSubtle,
                            borderRadius: 99,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${mat.quality}%`,
                              background: mat.quality >= 75 ? C.green : C.amber,
                              borderRadius: 99,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: C.textMuted }}>
                          Quality: {mat.quality}%
                        </span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>
                          · {mat.lastUpdated}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <Pill color={statusColor} size="xs">
                      {uploaded
                        ? mat.quality >= 75
                          ? "Strong"
                          : "Needs Review"
                        : "Missing"}
                    </Pill>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setFundSubmission((s) => ({
                          ...s,
                          [mat.key]: !s[mat.key],
                        }));
                        showToast(
                          uploaded
                            ? `${mat.label} removed`
                            : `${mat.label} uploaded`,
                          uploaded ? "info" : "success"
                        );
                      }}
                    >
                      {uploaded ? "Remove" : "Upload"}
                    </Btn>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Data room */}
          <Card style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 4 }}>
                  Data Room
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  Shared with LPs who have an approved reveal. Keep it current.
                </div>
              </div>
              <Pill
                color={
                  fundSubmission.dataRoomReadiness === "Ready"
                    ? C.green
                    : C.amber
                }
                size="xs"
              >
                {fundSubmission.dataRoomReadiness}
              </Pill>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <FInput
                label="Data Room Link"
                value={fundSubmission.dataRoomLink}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, dataRoomLink: v }))
                }
                placeholder="https://datasite.com/..."
              />
              <FSelect
                label="Readiness Status"
                value={fundSubmission.dataRoomReadiness}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, dataRoomReadiness: v }))
                }
                options={["Not Ready", "Partial", "Ready"]}
              />
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: C.bg,
                borderRadius: 8,
                border: `1px solid ${C.borderSubtle}`,
                fontSize: 12.5,
                color: C.textSoft,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: C.text }}>
                What belongs in the data room:
              </strong>{" "}
              Fund deck, PPM/LPA, performance by deal (realized + unrealized),
              team bios with attribution, quarterly letters, references, and org
              chart.
            </div>
          </Card>

          <Btn
            variant="primary"
            onClick={() => {
              showToast("Materials saved", "success");
              setPage("standardization");
            }}
          >
            Save & Continue to Standardization →
          </Btn>
        </div>
      )}

      {/* ── STANDARDIZATION ───────────────────────────────────────────────── */}
      {page === "standardization" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Standardization Record"
            subtitle="Auto-extracted structured fields. This is what the match engine, LP filters, and diligence router operate on."
          />

          {/* Status bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <StatBox label="Fields Extracted" value="9 / 9" color={C.green} />
            <StatBox
              label="Materials Completeness"
              value={`${standardized.materialsCompleteness}%`}
              color={
                standardized.materialsCompleteness >= 70 ? C.teal : C.amber
              }
            />
            <StatBox
              label="Match Readiness"
              value={
                standardized.materialsCompleteness >= 70 ? "Ready" : "Partial"
              }
              color={
                standardized.materialsCompleteness >= 70 ? C.green : C.amber
              }
            />
          </div>

          {/* Main standardized fields */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
              Standardized Fund Record
            </div>
            {[
              {
                key: "Strategy",
                value: standardized.strategy,
                conf: 97,
                source: "Fund type field",
              },
              {
                key: "Geography",
                value: standardized.geography,
                conf: 95,
                source: "Firm profile",
              },
              {
                key: "Target LP Types",
                value: standardized.targetLP,
                conf: 91,
                source: "LP type selection",
              },
              {
                key: "Min Commitment",
                value: standardized.minCommitment,
                conf: 94,
                source: "Min ticket field",
              },
              {
                key: "Target Fund Size",
                value: standardized.targetFundSize,
                conf: 98,
                source: "Fund size field",
              },
              {
                key: "Raise Status",
                value: standardized.status,
                conf: 96,
                source: "Current status",
              },
              {
                key: "Timeline to Close",
                value: standardized.timeline,
                conf: 89,
                source: "Timeline field",
              },
              {
                key: "Data Room Status",
                value: standardized.dataRoomReady,
                conf: 100,
                source: "Readiness toggle",
              },
              {
                key: "Materials Score",
                value: `${standardized.materialsCompleteness}%`,
                conf: 100,
                source: "Upload completeness",
              },
            ].map((row, i) => {
              const confColor =
                row.conf >= 90 ? C.green : row.conf >= 75 ? C.amber : C.red;
              return (
                <div
                  key={row.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 2fr 80px 1.2fr",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                      fontWeight: 600,
                    }}
                  >
                    {row.key}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 650 }}>
                    {row.value}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        height: 5,
                        flex: 1,
                        background: C.borderSubtle,
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${row.conf}%`,
                          background: confColor,
                          borderRadius: 99,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: confColor,
                        fontWeight: 700,
                        minWidth: 28,
                      }}
                    >
                      {row.conf}%
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted }}>
                    {row.source}
                  </span>
                </div>
              );
            })}
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 13, marginBottom: 8 }}>
              Why standardization exists
            </div>
            <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.65 }}>
              Raw PDFs and pitch decks cannot be matched against LP mandates.
              MandateOS converts your inputs into machine-readable fields —
              strategy, geography, size, target LP type — that the fit engine,
              reveal router, and diligence system operate on. Higher
              completeness → better match scores → more LP engagement.
            </div>
          </Card>

          <Btn variant="primary" onClick={() => setPage("matches")}>
            Run Match Engine →
          </Btn>
        </div>
      )}

      {/* ── MATCH ENGINE ──────────────────────────────────────────────────── */}
      {page === "matches" && (
        <div>
          <WorkspaceHeaderTitle
            title="Match Engine"
            subtitle="326 LP mandates scored against your fund profile. Tune the lens, inspect rationale, and move qualified LPs into permissioned reveal."
          />

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <StatBox
              label="Total LPs Scored"
              value={String(fitResults.length)}
              color={C.accent}
            />
            <StatBox
              label="85+ High Fit"
              value={String(fitResults.filter((r) => r.score >= 85).length)}
              color={C.green}
            />
            <StatBox
              label="75+ Qualified"
              value={String(strongMatches.length)}
              color={C.teal}
            />
            <StatBox
              label="Revealed"
              value={String(
                revealRequests.filter((r) => r.status === "Approved").length
              )}
              color={C.purple}
            />
	            <StatBox
	              label="Below Threshold"
	              value={String(
	                fitResults.filter((r) => r.score < matchThreshold).length
	              )}
	              color={C.textMuted}
	            />
	          </div>

	          <div
	            style={{
	              display: "grid",
	              gridTemplateColumns: "1.1fr repeat(3, minmax(0, 1fr))",
	              gap: 10,
	              marginBottom: 16,
	            }}
	          >
	            <div
	              style={{
	                padding: "17px 18px",
	                borderRadius: 15,
	                background:
	                  "linear-gradient(145deg, rgba(19,16,48,.98), rgba(8,7,23,.99))",
	                border: `1px solid ${C.accent}28`,
	                boxShadow: `0 18px 56px rgba(0,0,0,.28), 0 0 28px ${C.accent}08 inset`,
	              }}
	            >
	              <Pill color={C.accent} size="xs">
	                Institutional Scoring Stack
	              </Pill>
	              <div
	                style={{
	                  fontSize: 18,
	                  fontWeight: 850,
	                  lineHeight: 1.15,
	                  marginTop: 10,
	                  marginBottom: 8,
	                }}
	              >
	                LP targeting without the list-export problem.
	              </div>
	              <div
	                style={{
	                  fontSize: 12.3,
	                  color: C.textSoft,
	                  lineHeight: 1.6,
	                }}
	              >
	                The GP sees ranked mandate evidence first. Identity,
	                outreach, and diligence access move only through controlled
	                reveal and intro workflows.
	              </div>
	            </div>
	            {[
	              {
	                label: "Coverage",
	                value: `${fitResults.length} mandates`,
	                text: "Allocator universe normalized against this fund profile.",
	                color: C.accent,
	              },
	              {
	                label: "Decision Evidence",
	                value: `${strongMatches.length} qualified`,
	                text: "Strategy, sector, check size, and geography attached.",
	                color: C.green,
	              },
	              {
	                label: "Workflow Control",
	                value: `${revealRequests.length} reveals`,
	                text: "No cold outreach without allocator approval state.",
	                color: C.teal,
	              },
	            ].map((proof) => (
	              <div
	                key={proof.label}
	                style={{
	                  padding: "17px 18px",
	                  borderRadius: 15,
	                  background: `${proof.color}0d`,
	                  border: `1px solid ${proof.color}24`,
	                  display: "flex",
	                  flexDirection: "column",
	                  justifyContent: "space-between",
	                  minHeight: 148,
	                }}
	              >
	                <div
	                  style={{
	                    fontSize: 10,
	                    color: proof.color,
	                    fontWeight: 850,
	                    letterSpacing: 1,
	                    textTransform: "uppercase",
	                    marginBottom: 8,
	                  }}
	                >
	                  {proof.label}
	                </div>
	                <Mono size={24} weight={850} color={proof.color}>
	                  {proof.value}
	                </Mono>
	                <div
	                  style={{
	                    fontSize: 11.7,
	                    color: C.textSoft,
	                    lineHeight: 1.5,
	                    marginTop: 10,
	                  }}
	                >
	                  {proof.text}
	                </div>
	              </div>
	            ))}
	          </div>

	          <div
	            style={{
	              marginBottom: 16,
	              padding: 16,
	              borderRadius: 16,
	              background:
	                "linear-gradient(135deg, rgba(19,16,48,.98), rgba(8,7,23,.98))",
	              border: `1px solid ${C.accent}24`,
	              boxShadow: `0 18px 56px rgba(0,0,0,.28), 0 0 26px ${C.accent}08`,
	            }}
	          >
	            <div
	              style={{
	                display: "flex",
	                justifyContent: "space-between",
	                alignItems: "center",
	                gap: 16,
	                marginBottom: 14,
	              }}
	            >
	              <div>
	                <div style={{ fontSize: 15, fontWeight: 780 }}>
	                  Fit engine controls
	                </div>
	                <div style={{ fontSize: 12, color: C.textMuted }}>
	                  Narrow the LP universe by mandate, capacity, geography, and
	                  deployment signal.
	                </div>
	              </div>
	              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
	                <Pill color={C.accent} size="xs">
	                  {sortedMatches.length} visible
	                </Pill>
	                <Pill color={C.green} size="xs">
	                  {effectiveLpDb.length} scored
	                </Pill>
	              </div>
	            </div>
	            <div
	              style={{
	                display: "grid",
	                gridTemplateColumns: "1.2fr repeat(5, minmax(120px, 1fr))",
	                gap: 10,
	                alignItems: "end",
	              }}
	            >
	              <div style={{ position: "relative" }}>
	                <label className="form-label">Search</label>
	                <input
	                  value={matchSearch}
	                  onChange={(e) => setMatchSearch(e.target.value)}
	                  placeholder="LP name or type"
	                  style={{
	                    width: "100%",
	                    padding: "10px 12px",
	                    background: C.bg,
	                    border: `1px solid ${C.border}`,
	                    borderRadius: 8,
	                    color: C.text,
	                    fontSize: 13,
	                    fontFamily: "inherit",
	                    boxSizing: "border-box",
	                  }}
	                />
	              </div>
	              <FSelect
	                label="LP Type"
	                value={matchTypeFilter}
	                onChange={setMatchTypeFilter}
	                options={[
	                  "All",
	                  "Family Office",
	                  "Endowment",
	                  "Foundation",
	                  "Fund of Funds",
	                  "Pension",
	                  "RIA",
	                ]}
	              />
	              <FSelect
	                label="Sector"
	                value={matchSectorFilter}
	                onChange={setMatchSectorFilter}
	                options={matchSectorOptions}
	              />
	              <FSelect
	                label="Geography"
	                value={matchGeoFilter}
	                onChange={setMatchGeoFilter}
	                options={matchGeoOptions}
	              />
	              <FSelect
	                label="Sort"
	                value={matchSortMode}
	                onChange={setMatchSortMode}
	                options={[
	                  { value: "score", label: "Fit score" },
	                  { value: "checkMax", label: "Largest check" },
	                  { value: "checkMin", label: "Smallest check" },
	                  { value: "type", label: "LP type" },
	                ]}
	              />
	              <button
	                type="button"
	                onClick={() => setMatchDeployingOnly((v) => !v)}
	                style={{
	                  height: 40,
	                  borderRadius: 8,
	                  border: `1px solid ${
	                    matchDeployingOnly ? C.green + "55" : C.border
	                  }`,
	                  background: matchDeployingOnly ? C.greenWash : C.bg,
	                  color: matchDeployingOnly ? C.green : C.textSoft,
	                  fontSize: 12,
	                  fontWeight: 760,
	                  cursor: "pointer",
	                  fontFamily: "inherit",
	                }}
	              >
	                {matchDeployingOnly ? "Deploying only" : "All deployment"}
	              </button>
	            </div>
	            <div
	              style={{
	                display: "grid",
	                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	                gap: 12,
	                marginTop: 12,
	              }}
	            >
	              <div>
	                <div
	                  style={{
	                    display: "flex",
	                    justifyContent: "space-between",
	                    marginBottom: 6,
	                  }}
	                >
	                  <span className="form-label">Minimum Score</span>
	                  <Mono size={12} weight={800} color={C.accent}>
	                    {matchThreshold}
	                  </Mono>
	                </div>
	                <input
	                  type="range"
	                  min={0}
	                  max={100}
	                  value={matchThreshold}
	                  onChange={(e) => setMatchThreshold(Number(e.target.value))}
	                  style={{ width: "100%", accentColor: C.accent }}
	                />
	              </div>
	              <div>
	                <div
	                  style={{
	                    display: "flex",
	                    justifyContent: "space-between",
	                    marginBottom: 6,
	                  }}
	                >
	                  <span className="form-label">Min Check</span>
	                  <Mono size={12} weight={800} color={C.teal}>
	                    ${matchCheckMin}M
	                  </Mono>
	                </div>
	                <input
	                  type="range"
	                  min={0}
	                  max={5}
	                  step={0.25}
	                  value={matchCheckMin}
	                  onChange={(e) => setMatchCheckMin(Number(e.target.value))}
	                  style={{ width: "100%", accentColor: C.teal }}
	                />
	              </div>
	              <div>
	                <div
	                  style={{
	                    display: "flex",
	                    justifyContent: "space-between",
	                    marginBottom: 6,
	                  }}
	                >
	                  <span className="form-label">Max Check</span>
	                  <Mono size={12} weight={800} color={C.green}>
	                    ${matchCheckMax}M
	                  </Mono>
	                </div>
	                <input
	                  type="range"
	                  min={0.5}
	                  max={25}
	                  step={0.5}
	                  value={matchCheckMax}
	                  onChange={(e) => setMatchCheckMax(Number(e.target.value))}
	                  style={{ width: "100%", accentColor: C.green }}
	                />
	              </div>
	            </div>
	          </div>

	          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            {/* Left: Weight Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Card>
                <div
                  style={{
                    fontWeight: 720,
                    fontSize: 12.5,
                    color: C.textSoft,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 14,
                  }}
                >
                  Dimension Weights
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}
                >
                  Adjust how each factor contributes to the fit score. Scores
                  recompute in real time.
                </div>
                {[
                  {
                    key: "strategy",
                    label: "Strategy Fit",
                    color: C.accent,
                    desc: "GP strategy vs LP mandates",
                  },
                  {
                    key: "sector",
                    label: "Sector Overlap",
                    color: C.teal,
                    desc: "Industry focus alignment",
                  },
                  {
                    key: "checkSize",
                    label: "Check Size",
                    color: C.amber,
                    desc: "Investment size compatibility",
                  },
                  {
                    key: "geography",
                    label: "Geography",
                    color: C.purple,
                    desc: "Regional mandate coverage",
                  },
                ].map(({ key, label, color, desc }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 660,
                            color: C.text,
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: 10.5, color: C.textMuted }}>
                          {desc}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: color,
                          minWidth: 28,
                          textAlign: "right",
                        }}
                      >
                        {matchWeights[key]}
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={matchWeights[key]}
                      onChange={(e) =>
                        setMatchWeights((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value),
                        }))
                      }
                      style={{ width: "100%", accentColor: color, height: 4 }}
                    />
                    <div
                      style={{
                        height: 4,
                        background: C.borderSubtle,
                        borderRadius: 99,
                        marginTop: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(matchWeights[key] / 50) * 100}%`,
                          background: color,
                          borderRadius: 99,
                          transition: "width .2s",
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setMatchWeights({
                      strategy: 30,
                      sector: 30,
                      checkSize: 25,
                      geography: 15,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.textSoft,
                    fontSize: 11.5,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    marginTop: 4,
                  }}
                >
                  Reset to Defaults
                </button>
              </Card>

	              {/* Preset lenses */}
	              <Card>
	                <div
	                  style={{
	                    fontWeight: 720,
	                    fontSize: 12.5,
                    color: C.textSoft,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
	                    marginBottom: 12,
	                  }}
	                >
	                  Preset Lenses
	                </div>
	                <div
	                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
	                >
	                  {[
	                    {
	                      label: "First-close LPs",
	                      detail: "Smaller checks, active deployers",
	                      weights: { strategy: 30, sector: 25, checkSize: 35, geography: 10 },
	                      threshold: 70,
	                      checkMin: 0,
	                      checkMax: 3,
	                      deploying: true,
	                    },
	                    {
	                      label: "Strategic fit",
	                      detail: "Sector and mandate strength",
	                      weights: { strategy: 35, sector: 35, checkSize: 15, geography: 15 },
	                      threshold: 75,
	                      checkMin: 0,
	                      checkMax: 10,
	                      deploying: true,
	                    },
	                    {
	                      label: "Capacity search",
	                      detail: "Largest potential checks",
	                      weights: { strategy: 30, sector: 20, checkSize: 35, geography: 15 },
	                      threshold: 55,
	                      checkMin: 1,
	                      checkMax: 25,
	                      deploying: false,
	                    },
	                  ].map((preset) => (
	                    <div
	                      key={preset.label}
	                      onClick={() => {
	                        setMatchWeights(preset.weights);
	                        setMatchThreshold(preset.threshold);
	                        setMatchCheckMin(preset.checkMin);
	                        setMatchCheckMax(preset.checkMax);
	                        setMatchDeployingOnly(preset.deploying);
	                      }}
	                      style={{
	                        padding: "10px 11px",
	                        borderRadius: 9,
	                        border: `1px solid ${C.borderSubtle}`,
	                        background: C.bg,
	                        cursor: "pointer",
	                        transition: "background .15s, border-color .15s",
	                      }}
	                      onMouseEnter={(e) => {
	                        e.currentTarget.style.background = C.cardHover;
	                        e.currentTarget.style.borderColor = C.border;
	                      }}
	                      onMouseLeave={(e) => {
	                        e.currentTarget.style.background = C.bg;
	                        e.currentTarget.style.borderColor = C.borderSubtle;
	                      }}
	                    >
	                      <span
	                        style={{
	                          display: "block",
	                          fontSize: 12,
	                          color: C.text,
	                          fontWeight: 740,
	                          marginBottom: 3,
	                        }}
	                      >
	                        {preset.label}
	                      </span>
	                      <span style={{ fontSize: 10.5, color: C.textMuted }}>
	                        {preset.detail}
	                      </span>
	                    </div>
	                  ))}
	                </div>
	              </Card>

              {/* Score legend */}
              <Card>
                <div
                  style={{
                    fontWeight: 720,
                    fontSize: 12.5,
                    color: C.textSoft,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 10,
                  }}
                >
                  Score Legend
                </div>
                {[
                  { range: "85–100", label: "Strong Buy", color: C.green },
                  { range: "70–84", label: "Qualified", color: C.teal },
                  { range: "55–69", label: "Moderate", color: C.amber },
                  { range: "0–54", label: "Weak", color: C.red },
                ].map((b) => (
                  <div
                    key={b.range}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: b.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{ fontSize: 11.5, color: C.textSoft, flex: 1 }}
                    >
                      {b.range}
                    </span>
                    <span
                      style={{ fontSize: 11, color: b.color, fontWeight: 700 }}
                    >
                      {b.label}
                    </span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Right: Results + Breakdown */}
            <div>
	              {/* Results toolbar */}
	              <div
	                style={{
	                  display: "flex",
	                  gap: 12,
	                  marginBottom: 12,
	                  alignItems: "center",
	                  justifyContent: "space-between",
	                  padding: "14px 16px",
	                  background:
	                    "linear-gradient(135deg, rgba(19,16,48,.95), rgba(8,7,23,.98))",
	                  border: `1px solid ${C.border}`,
	                  borderRadius: 14,
	                }}
	              >
	                <div>
	                  <div style={{ fontSize: 14, fontWeight: 760 }}>
	                    Ranked LP results
	                  </div>
	                  <div style={{ fontSize: 11.5, color: C.textMuted }}>
	                    Scroll {sortedMatches.length} visible allocator mandates
	                    from {fitResults.length} scored LP profiles.
	                  </div>
	                </div>
	                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
	                  <Pill color={C.accent} size="xs">
	                    {matchTypeFilter}
	                  </Pill>
	                  <Pill color={C.teal} size="xs">
	                    {matchSectorFilter}
	                  </Pill>
	                  <Pill color={C.green} size="xs">
	                    ${matchCheckMin}M-${matchCheckMax}M
	                  </Pill>
	                  <button
	                    type="button"
	                    onClick={() => {
	                      setMatchSearch("");
	                      setMatchThreshold(50);
	                      setMatchTypeFilter("All");
	                      setMatchSectorFilter("All");
	                      setMatchGeoFilter("All");
	                      setMatchDeployingOnly(true);
	                      setMatchCheckMin(0);
	                      setMatchCheckMax(5);
	                      setMatchSortMode("score");
	                    }}
	                    style={{
	                      padding: "6px 10px",
	                      borderRadius: 8,
	                      border: `1px solid ${C.border}`,
	                      background: C.bg,
	                      color: C.textSoft,
	                      fontSize: 11,
	                      fontWeight: 700,
	                      cursor: "pointer",
	                      fontFamily: "inherit",
	                    }}
	                  >
	                    Reset filters
	                  </button>
	                </div>
	              </div>

              {/* Score breakdown panel */}
              {selectedMatch && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "16px 18px",
                    background: `linear-gradient(135deg, ${C.accentGhost}, ${C.card})`,
                    border: `1px solid ${C.accent}30`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 720,
                          marginBottom: 3,
                        }}
                      >
                        {selectedMatch.lp.name} — Score Breakdown
                      </div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>
                        {selectedMatch.lp.type} · AUM{" "}
                        {selectedMatch.lp.aum || "N/A"} · Check{" "}
                        {formatMoneyRange(
                          selectedMatch.lp.checkMin,
                          selectedMatch.lp.checkMax
                        )}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 900,
                            color: getScoreColor(selectedMatch.score),
                          }}
                        >
                          {selectedMatch.score}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                          }}
                        >
                          Fit Score
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedMatch(null)}
                        style={{
                          padding: "6px 10px",
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.textMuted,
                          cursor: "pointer",
                          fontSize: 11,
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 10,
                    }}
                  >
                    {Object.entries(selectedMatch.dims || {}).map(
                      ([key, dim]) => {
                        const pct =
                          dim.max > 0
                            ? Math.round((dim.earned / dim.max) * 100)
                            : 0;
                        const color = dim.match
                          ? pct >= 80
                            ? C.green
                            : C.teal
                          : pct > 0
                          ? C.amber
                          : C.red;
                        const label =
                          {
                            strategy: "Strategy",
                            sector: "Sector",
                            checkSize: "Check Size",
                            geography: "Geography",
                          }[key] || key;
                        return (
                          <div
                            key={key}
                            style={{
                              padding: "12px 14px",
                              background: C.bg,
                              borderRadius: 10,
                              border: `1px solid ${
                                dim.match ? color + "30" : C.borderSubtle
                              }`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  color: C.textMuted,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.7,
                                }}
                              >
                                {label}
                              </span>
                              <span
                                style={{ fontSize: 12, fontWeight: 800, color }}
                              >
                                {dim.earned}/{dim.max}
                              </span>
                            </div>
                            <div
                              style={{
                                height: 5,
                                background: C.borderSubtle,
                                borderRadius: 99,
                                overflow: "hidden",
                                marginBottom: 8,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${pct}%`,
                                  background: color,
                                  borderRadius: 99,
                                  transition: "width .3s",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                fontSize: 10.5,
                                color: dim.match ? C.textSoft : C.textMuted,
                                lineHeight: 1.45,
                              }}
                            >
                              {dim.detail}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  {selectedMatch.lp.strategies && (
                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 10.5, color: C.textMuted }}>
                        LP strategies:
                      </span>
                      {selectedMatch.lp.strategies.map((s) => (
                        <Pill key={s} color={C.accent} size="xs">
                          {s}
                        </Pill>
                      ))}
                      <span
                        style={{
                          fontSize: 10.5,
                          color: C.textMuted,
                          marginLeft: 10,
                        }}
                      >
                        LP sectors:
                      </span>
                      {(selectedMatch.lp.sectors || []).slice(0, 4).map((s) => (
                        <Pill key={s} color={C.teal} size="xs">
                          {s}
                        </Pill>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <Btn
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        requestReveal(selectedMatch);
                        setSelectedMatch(null);
                      }}
                    >
                      Request Reveal
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage("pipeline")}
                    >
                      View Pipeline
                    </Btn>
                  </div>
                </div>
              )}

              {/* Table */}
              <div
                style={{
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
                    gridTemplateColumns: "52px 2fr 1fr 0.8fr 1fr 1.5fr 120px",
                    gap: 0,
                    padding: "9px 16px",
                    background: C.raised,
                    fontSize: 10,
                    fontWeight: 750,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.7,
                  }}
                >
                  <span>Score</span>
                  <span>LP</span>
                  <span>Type</span>
                  <span>AUM</span>
                  <span>Check Range</span>
                  <span>Dimension Scores</span>
                  <span></span>
                </div>
                <div
                  style={{
                    maxHeight: 720,
                    overflowY: "auto",
                    background: C.card,
                  }}
                >
	                {sortedMatches.map((r, i) => {
                  const sc = getScoreColor(r.score);
                  const bucket = scoreBucket(r.score);
                  const isSelected = selectedMatch?.lp?.id === r.lp.id;
                  return (
                    <div
                      key={r.lp.id}
                      onClick={() => setSelectedMatch(isSelected ? null : r)}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "52px 2fr 1fr 0.8fr 1fr 1.5fr 120px",
                        gap: 0,
                        padding: "11px 16px",
                        borderTop: `1px solid ${C.borderSubtle}`,
                        alignItems: "center",
                        transition: "background .15s",
                        borderLeft: `3px solid ${
                          isSelected ? sc : "transparent"
                        }`,
                        background: isSelected ? `${sc}08` : "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = C.cardHover;
                          e.currentTarget.style.borderLeftColor = sc + "40";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderLeftColor = "transparent";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            border: `2px solid ${sc}50`,
                            background: `${sc}12`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 800,
                              color: sc,
                            }}
                          >
                            {r.score}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 660,
                            marginBottom: 3,
                          }}
                        >
                          {r.lp.name}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Pill color={sc} size="xs">
                            {bucket}
                          </Pill>
                          {r.score >= 85 && (
                            <Pill color={C.green} size="xs">
                              Priority
                            </Pill>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: C.textSoft }}>
                        {r.lp.type}
                      </span>
                      <span style={{ fontSize: 12, color: C.textSoft }}>
                        {r.lp.aum || "—"}
                      </span>
                      <span style={{ fontSize: 12, color: C.textSoft }}>
                        {formatMoneyRange(r.lp.checkMin, r.lp.checkMax)}
                      </span>
                      {/* Mini dimension bars */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        {Object.entries(r.dims || {}).map(([k, dim]) => {
                          const pct =
                            dim.max > 0
                              ? Math.round((dim.earned / dim.max) * 100)
                              : 0;
                          const col = dim.match
                            ? pct >= 80
                              ? C.green
                              : C.teal
                            : C.red;
                          const lbl =
                            {
                              strategy: "Strat",
                              sector: "Sect",
                              checkSize: "Check",
                              geography: "Geo",
                            }[k] || k;
                          return (
                            <div
                              key={k}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 9,
                                  color: C.textMuted,
                                  minWidth: 28,
                                }}
                              >
                                {lbl}
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: 4,
                                  background: C.borderSubtle,
                                  borderRadius: 99,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    background: col,
                                    borderRadius: 99,
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: 9,
                                  color: col,
                                  fontWeight: 700,
                                  minWidth: 18,
                                }}
                              >
                                {dim.earned}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        <Btn
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatch(isSelected ? null : r);
                          }}
                        >
                          {isSelected ? "Hide" : "Breakdown"}
                        </Btn>
                        <Btn
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestReveal(r);
                          }}
                        >
                          Reveal
                        </Btn>
                      </div>
                    </div>
                  );
                })}
	                {sortedMatches.length === 0 && (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: C.textMuted,
                      fontSize: 13,
                    }}
                  >
                    No matches at this threshold. Lower the score filter or
                    adjust weights.
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REVEAL QUEUE ──────────────────────────────────────────────────── */}
      {page === "reveal" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Reveal Queue"
            subtitle="GPs request access. LPs approve or decline. Identity unlocks only on LP consent. This is the privacy layer."
          />

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <StatBox
              label="Pending"
              value={String(
                revealRequests.filter((r) => r.status === "Pending").length
              )}
              color={C.amber}
            />
            <StatBox
              label="Approved"
              value={String(
                revealRequests.filter((r) => r.status === "Approved").length
              )}
              color={C.green}
            />
            <StatBox
              label="Declined"
              value={String(
                revealRequests.filter((r) => r.status === "Declined").length
              )}
              color={C.red}
            />
          </div>

          {/* Reveal request table */}
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 70px 1fr 1.2fr 100px",
                padding: "9px 16px",
                background: C.raised,
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.7,
              }}
            >
              <span>LP</span>
              <span>Type</span>
              <span>Score</span>
              <span>Status</span>
              <span>Submitted</span>
              <span></span>
            </div>
            {revealRequests.map((r, i) => {
              const sc = getScoreColor(r.fitScore);
              const statusColor =
                r.status === "Approved"
                  ? C.green
                  : r.status === "Declined"
                  ? C.red
                  : C.amber;
              return (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 70px 1fr 1.2fr 100px",
                    padding: "13px 16px",
                    borderTop: `1px solid ${C.borderSubtle}`,
                    alignItems: "center",
                    transition: "background .15s",
                    borderLeft: "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.cardHover;
                    e.currentTarget.style.borderLeftColor = statusColor + "60";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderLeftColor = "transparent";
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 660,
                        marginBottom: 3,
                      }}
                    >
                      {r.lpName}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textMuted }}>
                      {r.note}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: C.textSoft }}>
                    {r.lpType}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `2px solid ${sc}40`,
                      background: `${sc}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: sc }}>
                      {r.fitScore}
                    </span>
                  </div>
                  <Pill color={statusColor} size="xs">
                    {r.status}
                  </Pill>
                  <span style={{ fontSize: 12, color: C.textMuted }}>
                    {r.createdAt}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.status === "Pending" && (
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setRevealRequests((prev) =>
                            prev.map((x) =>
                              x.id === r.id ? { ...x, status: "Approved" } : x
                            )
                          );
                          showToast("Reveal approved", "success");
                        }}
                      >
                        Approve
                      </Btn>
                    )}
                    {r.status === "Approved" && (
                      <Btn
                        variant="primary"
                        size="sm"
                        onClick={() => setPage("pipeline")}
                      >
                        View Pipeline
                      </Btn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy explainer */}
          <Card>
            <div style={{ fontWeight: 720, fontSize: 13, marginBottom: 8 }}>
              How reveal privacy works
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  step: "1",
                  label: "GP requests reveal",
                  desc: "GP sees fit score and mandate attributes only. No identity.",
                },
                {
                  step: "2",
                  label: "LP approves or declines",
                  desc: "LP receives anonymous request with GP's fund details and fit score.",
                },
                {
                  step: "3",
                  label: "Identity unlocks",
                  desc: "Only on LP consent. Contact details, firm name, and next steps shared.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    padding: "12px 14px",
                    background: C.bg,
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: C.accentGhost,
                      border: `1px solid ${C.accent}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: C.accentBright,
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 12.5, fontWeight: 660, marginBottom: 4 }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: C.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── INTRO ROOMS ───────────────────────────────────────────────────── */}
      {page === "intro" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Intro Rooms"
            subtitle="Approved reveals become shared capital-formation workspaces with fit rationale, diligence, next steps, and pipeline status attached."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <StatBox
              label="Open Rooms"
              value={String(introRooms.length)}
              color={C.accent}
            />
            <StatBox
              label="Shared Docs"
              value={String(
                introRooms.reduce((sum, room) => sum + room.sharedDocs.length, 0)
              )}
              color={C.green}
            />
            <StatBox
              label="Open Requests"
              value={String(
                introRooms.reduce((sum, room) => sum + room.openItems, 0)
              )}
              color={C.amber}
            />
            <StatBox
              label="Wtd. Capital"
              value={`$${weightedCapital.toFixed(1)}M`}
              color={C.teal}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 14,
            }}
          >
            {introRooms.map((room) => {
              const stageColor = STAGE_COLORS[room.stage] || C.accent;
              const fitColor = getScoreColor(room.fitScore);
              const nextStep =
                room.diligence?.nextStep ||
                "Schedule allocator call and attach final diligence packet";
              return (
                <Card
                  key={room.id}
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    borderColor: `${stageColor}30`,
                    background:
                      "linear-gradient(145deg, rgba(19,16,48,.98), rgba(8,7,23,.99))",
                  }}
                >
                  <div
                    style={{
                      padding: "15px 17px",
                      borderBottom: `1px solid ${C.borderSubtle}`,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 820,
                          lineHeight: 1.25,
                          marginBottom: 4,
                        }}
                      >
                        {room.lpName} x {fundSubmission.fundName}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.textMuted }}>
                        {room.lpType} · approved reveal · {room.commitmentSize}{" "}
                        potential check
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <Mono size={24} weight={900} color={fitColor}>
                        {room.fitScore}
                      </Mono>
                      <div
                        style={{
                          fontSize: 9,
                          color: C.textMuted,
                          fontWeight: 800,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                        }}
                      >
                        Fit
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 17 }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 8,
                        marginBottom: 13,
                      }}
                    >
                      {[
                        ["Status", room.stage, stageColor],
                        ["Probability", `${room.probability}%`, fitColor],
                        ["Docs Shared", room.sharedDocs.length, C.green],
                      ].map(([label, value, color]) => (
                        <div
                          key={label}
                          style={{
                            padding: "10px 11px",
                            borderRadius: 10,
                            background: C.bg,
                            border: `1px solid ${color}22`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              color: C.textMuted,
                              fontWeight: 800,
                              letterSpacing: 0.7,
                              textTransform: "uppercase",
                              marginBottom: 3,
                            }}
                          >
                            {label}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color,
                              fontWeight: 780,
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: "11px 12px",
                        borderRadius: 10,
                        background: C.bg,
                        border: `1px solid ${C.borderSubtle}`,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textMuted,
                          fontWeight: 800,
                          letterSpacing: 0.7,
                          textTransform: "uppercase",
                          marginBottom: 5,
                        }}
                      >
                        Next Step
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: C.textSoft,
                          lineHeight: 1.55,
                        }}
                      >
                        {nextStep}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 12,
                      }}
                    >
                      {room.sharedDocs.slice(0, 4).map((doc) => (
                        <Pill key={doc.name} color={C.green} size="xs">
                          {doc.name}
                        </Pill>
                      ))}
                      {room.openItems > 0 && (
                        <Pill color={C.amber} size="xs">
                          {room.openItems} requested
                        </Pill>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Btn
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          showToast(`Call scheduled with ${room.lpName}`, "success")
                        }
                      >
                        Schedule Call
                      </Btn>
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage("diligence")}
                      >
                        Diligence
                      </Btn>
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setPipeline((prev) =>
                            prev.map((p) =>
                              p.id === room.id
                                ? {
                                    ...p,
                                    stage:
                                      p.stage === "Soft Circled"
                                        ? "Committed"
                                        : "Soft Circled",
                                    probability:
                                      p.stage === "Soft Circled"
                                        ? 100
                                        : Math.max(p.probability, 78),
                                    lastUpdate: "Just now",
                                  }
                                : p
                            )
                          )
                        }
                      >
                        {room.stage === "Soft Circled"
                          ? "Mark Committed"
                          : "Soft Circle"}
                      </Btn>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {introRooms.length === 0 && (
            <EmptyState
              icon="◎"
              title="No intro rooms yet"
              body="Approved reveals will appear here with diligence access, fit rationale, next steps, and pipeline status attached."
              cta="Open Match Engine"
              onClick={() => setPage("matches")}
            />
          )}
        </div>
      )}

      {/* ── DILIGENCE ─────────────────────────────────────────────────────── */}
      {page === "diligence" && (
        <div>
          <WorkspaceHeaderTitle
            title="Diligence Tracker"
            subtitle="Active diligence threads with LP-specific checklists, document tracking, and next steps."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <StatBox
              label="Active Threads"
              value={String(Object.keys(diligenceItems).length)}
              color={C.accent}
            />
            <StatBox
              label="IC Pending"
              value={String(
                pipeline.filter((p) => p.stage === "IC Pending").length
              )}
              color={C.amber}
            />
            <StatBox
              label="Avg Checklist"
              value={`${Math.round(
                Object.values(diligenceItems).reduce(
                  (sum, d) =>
                    sum +
                    (Object.values(d.checklist).filter(Boolean).length /
                      Object.keys(d.checklist).length) *
                      100,
                  0
                ) / Math.max(1, Object.keys(diligenceItems).length)
              )}%`}
              color={C.teal}
            />
            <StatBox
              label="Docs Submitted"
              value={String(
                Object.values(diligenceItems).reduce(
                  (n, d) =>
                    n +
                    (d.documents || []).filter((doc) => doc.submittedAt).length,
                  0
                )
              )}
              color={C.green}
            />
            <StatBox
              label="Docs Pending"
              value={String(
                Object.values(diligenceItems).reduce(
                  (n, d) =>
                    n +
                    (d.documents || []).filter((doc) => !doc.submittedAt)
                      .length,
                  0
                )
              )}
              color={C.red}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(diligenceItems).map(([id, dd]) => {
              const checkCount = Object.values(dd.checklist).filter(
                Boolean
              ).length;
              const total = Object.keys(dd.checklist).length;
              const pct = Math.round((checkCount / total) * 100);
              const stageColor = STAGE_COLORS[dd.stage] || C.accent;
              const pColor =
                dd.priority === "Urgent"
                  ? C.red
                  : dd.priority === "High"
                  ? C.amber
                  : C.teal;
              const docs = dd.documents || [];
              const docsSubmitted = docs.filter((d) => d.submittedAt).length;
              return (
                <Card key={id}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 5,
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 720 }}>
                          {dd.lpName}
                        </span>
                        <Pill color={stageColor} size="xs">
                          {dd.stage}
                        </Pill>
                        <Pill color={pColor} size="xs">
                          {dd.priority}
                        </Pill>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.textMuted,
                          marginBottom: 2,
                        }}
                      >
                        {dd.nextStep}
                      </div>
                      {dd.contact && (
                        <div style={{ fontSize: 11.5, color: C.textMuted }}>
                          Contact:{" "}
                          <span style={{ color: C.textSoft }}>
                            {dd.contact}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", gap: 20, alignItems: "center" }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color:
                              pct >= 75 ? C.green : pct >= 50 ? C.amber : C.red,
                          }}
                        >
                          {pct}%
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                          }}
                        >
                          Checklist
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color:
                              docsSubmitted === docs.length ? C.green : C.amber,
                          }}
                        >
                          {docsSubmitted}/{docs.length}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                          }}
                        >
                          Docs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 5,
                      background: C.borderSubtle,
                      borderRadius: 99,
                      overflow: "hidden",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: pct >= 75 ? C.green : C.amber,
                        borderRadius: 99,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    {/* Left: Checklist */}
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 750,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}
                      >
                        Due Diligence Checklist
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {Object.entries(dd.checklist).map(([item, done]) => (
                          <div
                            key={item}
                            onClick={() =>
                              setDiligenceItems((prev) => ({
                                ...prev,
                                [id]: {
                                  ...prev[id],
                                  checklist: {
                                    ...prev[id].checklist,
                                    [item]: !done,
                                  },
                                },
                              }))
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "7px 10px",
                              borderRadius: 7,
                              background: done ? `${C.green}10` : C.bg,
                              border: `1px solid ${
                                done ? C.green + "30" : C.borderSubtle
                              }`,
                              cursor: "pointer",
                              transition: "all .15s",
                            }}
                          >
                            <div
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 4,
                                border: `2px solid ${
                                  done ? C.green : C.border
                                }`,
                                background: done
                                  ? `${C.green}20`
                                  : "transparent",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {done && (
                                <span
                                  style={{
                                    fontSize: 8,
                                    color: C.green,
                                    fontWeight: 900,
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                color: done ? C.text : C.textSoft,
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Document Tracking */}
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 750,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}
                      >
                        Document Tracking
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {docs.map((doc, di) => {
                          const statusColor =
                            doc.status === "Approved"
                              ? C.green
                              : doc.status === "Under Review"
                              ? C.teal
                              : doc.status === "Reviewed"
                              ? C.amber
                              : doc.status === "Requested"
                              ? C.purple
                              : doc.status === "Pending"
                              ? C.amber
                              : C.red;
                          const statusBg = `${statusColor}12`;
                          return (
                            <div
                              key={di}
                              style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                background: C.bg,
                                border: `1px solid ${
                                  doc.submittedAt
                                    ? statusColor + "25"
                                    : C.borderSubtle
                                }`,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                              }}
                            >
                              <div style={{ marginTop: 1 }}>
                                {doc.submittedAt ? (
                                  <div
                                    style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      background: statusColor,
                                      marginTop: 3,
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      border: `2px solid ${C.border}`,
                                      marginTop: 3,
                                    }}
                                  />
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 620,
                                      color: doc.submittedAt
                                        ? C.text
                                        : C.textMuted,
                                    }}
                                  >
                                    {doc.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: statusColor,
                                      background: statusBg,
                                      padding: "2px 6px",
                                      borderRadius: 5,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {doc.status}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: 10.5,
                                    color: C.textMuted,
                                    marginTop: 2,
                                  }}
                                >
                                  {doc.submittedAt
                                    ? `Submitted ${doc.submittedAt}${
                                        doc.reviewer ? ` · ${doc.reviewer}` : ""
                                      }`
                                    : doc.comments || "Not yet submitted"}
                                </div>
                                {doc.comments && doc.submittedAt && (
                                  <div
                                    style={{
                                      fontSize: 10.5,
                                      color: C.textMuted,
                                      fontStyle: "italic",
                                      marginTop: 1,
                                    }}
                                  >
                                    {doc.comments}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div
                    style={{
                      marginTop: 14,
                      padding: "10px 12px",
                      background: C.bg,
                      borderRadius: 8,
                      border: `1px solid ${C.borderSubtle}`,
                      fontSize: 12.5,
                      color: C.textSoft,
                      lineHeight: 1.55,
                    }}
                  >
                    {dd.notes || "No notes yet."}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <Btn
                      variant="primary"
                      size="sm"
                      onClick={() => showToast("Diligence updated", "success")}
                    >
                      Save Notes
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        showToast("IC memo template opened", "info")
                      }
                    >
                      Draft IC Memo
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        showToast("Document request sent to LP", "success")
                      }
                    >
                      Request Document
                    </Btn>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPipeline((prev) =>
                          prev.map((p) =>
                            p.id === Number(id)
                              ? {
                                  ...p,
                                  stage: "Soft Circled",
                                  probability: Math.min(95, p.probability + 15),
                                  lastUpdate: "Just now",
                                }
                              : p
                          )
                        );
                        showToast("Moved to Soft Circled", "success");
                      }}
                    >
                      Soft Circle
                    </Btn>
                  </div>
                </Card>
              );
            })}

            {Object.keys(diligenceItems).length === 0 && (
              <Card>
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 0",
                    color: C.textMuted,
                    fontSize: 13,
                  }}
                >
                  No active diligence threads. Use the Match Engine to request
                  reveals and advance LPs into diligence.
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── PIPELINE ──────────────────────────────────────────────────────── */}
      {page === "pipeline" && (
        <div>
          <WorkspaceHeaderTitle
            title="Fundraising Pipeline"
            subtitle="Capital formation workflow — not generic CRM. Stage each LP from reveal to commit. Track probability-weighted capital."
          />

          {/* Stage stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              "Requested",
              "In Diligence",
              "IC Pending",
              "Soft Circled",
              "Committed",
            ].map((stage) => (
              <StatBox
                key={stage}
                label={stage}
                value={String(pipeline.filter((p) => p.stage === stage).length)}
                color={STAGE_COLORS[stage] || C.accent}
              />
            ))}
          </div>

          {/* Weighted capital summary */}
          <div
            style={{
              padding: "13px 18px",
              background: `linear-gradient(135deg, ${C.green}08, ${C.card})`,
              border: `1px solid ${C.green}25`,
              borderRadius: 12,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}
              >
                Probability-Weighted Capital in Pipeline
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>
                ${weightedCapital.toFixed(1)}M
              </div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Soft Circled", "IC Pending", "In Diligence"].map((stage) => {
                const amt = pipeline
                  .filter((p) => p.stage === stage)
                  .reduce((s, p) => {
                    const a =
                      parseFloat(
                        (p.commitmentSize || "$0").replace(/[$M]/g, "")
                      ) || 0;
                    return s + a * (p.probability / 100);
                  }, 0);
                return (
                  <div key={stage} style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: STAGE_COLORS[stage],
                      }}
                    >
                      ${amt.toFixed(1)}M
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>
                      {stage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline table */}
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
                gridTemplateColumns: "2fr 1fr 60px 1fr 0.8fr 0.9fr 1fr",
                padding: "9px 16px",
                background: C.raised,
                fontSize: 10,
                fontWeight: 750,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.7,
              }}
            >
              <span>LP</span>
              <span>Type</span>
              <span>Fit</span>
              <span>Stage</span>
              <span>Commit</span>
              <span>Prob</span>
              <span>Updated</span>
            </div>
            {pipeline.map((p) => {
              const sc = getScoreColor(p.fitScore);
              const pc =
                p.probability >= 60
                  ? C.green
                  : p.probability >= 35
                  ? C.amber
                  : C.textMuted;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 60px 1fr 0.8fr 0.9fr 1fr",
                    padding: "12px 16px",
                    borderTop: `1px solid ${C.borderSubtle}`,
                    alignItems: "center",
                    transition: "background .15s",
                    borderLeft: "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.cardHover;
                    e.currentTarget.style.borderLeftColor =
                      (STAGE_COLORS[p.stage] || C.accent) + "60";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderLeftColor = "transparent";
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650, fontSize: 13 }}>
                      {p.lpName}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {p.note}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: C.textSoft }}>
                    {p.lpType}
                  </span>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: `2px solid ${sc}40`,
                      background: `${sc}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: sc }}>
                      {p.fitScore}
                    </span>
                  </div>
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
                      fontFamily: "inherit",
                    }}
                  >
                    {GP_PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: 12, color: C.textSoft }}>
                    {p.commitmentSize}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: pc }}>
                    {p.probability}%
                  </span>
                  <span style={{ fontSize: 11.5, color: C.textMuted }}>
                    {p.lastUpdate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ANALYTICS ─────────────────────────────────────────────────────── */}
      {page === "analytics" && (
        <div>
          <WorkspaceHeaderTitle
            title="Analytics"
            subtitle="Fundraise funnel, match distribution, capital flow, and LP engagement patterns across the raise."
          />

          {/* Top KPI row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <StatBox
              label="LPs Scored"
              value={String(fitResults.length)}
              color={C.accent}
            />
            <StatBox
              label="Match → Pipeline"
              value={`${Math.round(
                (activePipelineCount / Math.max(1, fitResults.length)) * 100
              )}%`}
              color={C.teal}
            />
            <StatBox
              label="Pipeline → Diligence"
              value={`${Math.round(
                (pipeline.filter((p) => p.stage === "In Diligence").length /
                  Math.max(1, activePipelineCount)) *
                  100
              )}%`}
              color={C.amber}
            />
            <StatBox
              label="Avg Fit Score"
              value={
                fitResults.length
                  ? String(
                      Math.round(
                        fitResults.reduce((s, r) => s + r.score, 0) /
                          fitResults.length
                      )
                    )
                  : "—"
              }
              color={C.purple}
            />
            <StatBox
              label="Wtd. Capital"
              value={`$${weightedCapital.toFixed(1)}M`}
              color={C.green}
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
            {/* Funnel chart */}
            <Card>
              <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 16 }}>
                Raise Funnel
              </div>
              {[
                {
                  label: "LPs in Universe",
                  count: fitResults.length,
                  color: C.accent,
                },
                {
                  label: "Qualified (75+)",
                  count: strongMatches.length,
                  color: C.teal,
                },
                {
                  label: "Reveal Requests Sent",
                  count: revealRequests.length,
                  color: C.purple,
                },
                {
                  label: "Reveals Approved",
                  count: approvedRevealCount,
                  color: C.amber,
                },
                {
                  label: "In Diligence / IC",
                  count: pipeline.filter((p) =>
                    ["In Diligence", "IC Pending"].includes(p.stage)
                  ).length,
                  color: C.amber,
                },
                {
                  label: "Soft Circled",
                  count: pipeline.filter((p) => p.stage === "Soft Circled")
                    .length,
                  color: C.green,
                },
                {
                  label: "Committed",
                  count: pipeline.filter((p) => p.stage === "Committed").length,
                  color: C.green,
                },
              ].map((row, i) => {
                const width = fitResults.length
                  ? Math.max(
                      4,
                      Math.round((row.count / fitResults.length) * 100)
                    )
                  : 0;
                return (
                  <div key={row.label} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 12, color: C.textSoft }}>
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: row.color,
                        }}
                      >
                        {row.count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 7,
                        background: C.borderSubtle,
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${width}%`,
                          background: `linear-gradient(90deg, ${row.color}99, ${row.color})`,
                          borderRadius: 99,
                          transition: "width .4s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Score distribution + LP type breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <div
                  style={{ fontWeight: 720, fontSize: 14, marginBottom: 16 }}
                >
                  Score Distribution
                </div>
                {[
                  { range: "85–100", label: "High Fit", color: C.green },
                  { range: "70–84", label: "Qualified", color: C.teal },
                  { range: "55–69", label: "Moderate", color: C.amber },
                  { range: "0–54", label: "Low / Weak", color: C.red },
                ].map((band) => {
                  const count = fitResults.filter((r) => {
                    if (band.range === "85–100") return r.score >= 85;
                    if (band.range === "70–84")
                      return r.score >= 70 && r.score < 85;
                    if (band.range === "55–69")
                      return r.score >= 55 && r.score < 70;
                    return r.score < 55;
                  }).length;
                  const w = fitResults.length
                    ? Math.round((count / fitResults.length) * 100)
                    : 0;
                  return (
                    <div
                      key={band.range}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: C.textMuted,
                          minWidth: 48,
                        }}
                      >
                        {band.range}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 20,
                          background: C.borderSubtle,
                          borderRadius: 6,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${w}%`,
                            background: `${band.color}40`,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: band.color,
                            }}
                          >
                            {count > 0 ? count : ""}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: band.color,
                          fontWeight: 700,
                          minWidth: 20,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </Card>

              <Card>
                <div
                  style={{ fontWeight: 720, fontSize: 14, marginBottom: 16 }}
                >
                  LP Type Breakdown
                </div>
                {[
                  "Family Office",
                  "Endowment",
                  "Foundation",
                  "Pension",
                  "RIA",
                  "Fund of Funds",
                ].map((type) => {
                  const count = fitResults.filter(
                    (r) => r.lp.type === type && r.score >= 60
                  ).length;
                  const qualified = fitResults.filter(
                    (r) => r.lp.type === type && r.score >= 75
                  ).length;
                  if (count === 0) return null;
                  const w = fitResults.length
                    ? Math.round((count / fitResults.length) * 100)
                    : 0;
                  return (
                    <div key={type} style={{ marginBottom: 9 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontSize: 12, color: C.textSoft }}>
                          {type}
                        </span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>
                          {qualified} qualified · {count} matched
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: C.borderSubtle,
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${w}%`,
                            background: C.accent,
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>

          {/* Activity table */}
          <Card>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
              Pipeline Summary by Stage
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 60px 80px 0.9fr 0.9fr",
                padding: "7px 0",
                borderBottom: `1px solid ${C.borderSubtle}`,
                marginBottom: 4,
              }}
            >
              {["Stage", "Count", "Wtd Capital", "Avg Score", "Conversion"].map(
                (h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 10,
                      fontWeight: 750,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                    }}
                  >
                    {h}
                  </span>
                )
              )}
            </div>
            {[
              "Requested",
              "Reveal Pending",
              "In Diligence",
              "IC Pending",
              "Soft Circled",
              "Committed",
            ].map((stage) => {
              const items = pipeline.filter((p) => p.stage === stage);
              if (items.length === 0) return null;
              const wtd = items.reduce((s, p) => {
                const a =
                  parseFloat((p.commitmentSize || "$0").replace(/[$M]/g, "")) ||
                  0;
                return s + a * (p.probability / 100);
              }, 0);
              const avgFit = Math.round(
                items.reduce((s, p) => s + p.fitScore, 0) / items.length
              );
              const conv = Math.round(
                items.reduce((s, p) => s + p.probability, 0) / items.length
              );
              const stageColor = STAGE_COLORS[stage] || C.accent;
              return (
                <div
                  key={stage}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 60px 80px 0.9fr 0.9fr",
                    padding: "9px 0",
                    borderBottom: `1px solid ${C.borderSubtle}`,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: stageColor,
                      }}
                    />
                    <span style={{ fontSize: 13 }}>{stage}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    {items.length}
                  </span>
                  <span
                    style={{ fontSize: 13, color: C.green, fontWeight: 700 }}
                  >
                    ${wtd.toFixed(1)}M
                  </span>
                  <span style={{ fontSize: 12, color: getScoreColor(avgFit) }}>
                    {avgFit}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color:
                        conv >= 60
                          ? C.green
                          : conv >= 35
                          ? C.amber
                          : C.textMuted,
                    }}
                  >
                    {conv}%
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── MARKET FEEDBACK ───────────────────────────────────────────────── */}
      {page === "feedback" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Market Feedback"
            subtitle="Signal from LP behavior, pipeline conversion, and match data. Not pipeline tracking — strategic intelligence."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {marketFeedback.map((insight, i) => {
              const colors = [C.accent, C.teal, C.amber, C.purple];
              const color = colors[i % colors.length];
              return (
                <div
                  key={i}
                  style={{
                    padding: "18px 20px",
                    background: `linear-gradient(135deg, ${color}08, ${C.card})`,
                    border: `1px solid ${color}25`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `${color}20`,
                      border: `1px solid ${color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: color }}>◎</span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: C.textSoft,
                      lineHeight: 1.65,
                    }}
                  >
                    {insight}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Card>
              <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
                What's Working
              </div>
              {[
                "Family office and foundation LPs are moving fastest toward first close",
                "Venture Capital positioning maps cleanly to emerging-manager mandate data",
                "Healthcare and climate software are creating credible mission-aligned conversations",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "8px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.green,
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      color: C.textSoft,
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
                Where to Improve
              </div>
              {[
                "Pre-fund attribution is the leading objection — LPs need to see which deals came from the GP",
                "Founder reference pack is missing and blocks two approved reveal conversations",
                "Data room is only partial — finalize reference list and impact reporting before broad outreach",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "8px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.amber,
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      color: C.textSoft,
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 10 }}>
              Recommended Adjustments
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  priority: "1",
                  action:
                    "Upload pre-fund attribution memo for the 18 angel and SPV investments",
                  impact: "High",
                  page: "materials",
                },
                {
                  priority: "2",
                  action:
                    "Add founder reference pack and impact reporting template to the data room",
                  impact: "High",
                  page: "materials",
                },
                {
                  priority: "3",
                  action:
                    "Prioritize IC prep for Cedar Grove Family Office before the April 10 review",
                  impact: "Urgent",
                  page: "diligence",
                },
              ].map((rec) => {
                const impactColor = rec.impact === "Urgent" ? C.red : C.amber;
                return (
                  <div
                    key={rec.priority}
                    onClick={() => setPage(rec.page)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: C.bg,
                      borderRadius: 8,
                      border: `1px solid ${C.borderSubtle}`,
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.cardHover;
                      e.currentTarget.style.borderColor = C.border;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.bg;
                      e.currentTarget.style.borderColor = C.borderSubtle;
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: `${impactColor}20`,
                        border: `1px solid ${impactColor}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: impactColor,
                        }}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <span style={{ fontSize: 12.5, flex: 1 }}>
                      {rec.action}
                    </span>
                    <Pill color={impactColor} size="xs">
                      {rec.impact}
                    </Pill>
                    <span style={{ fontSize: 11, color: C.textMuted }}>→</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ── SETTINGS ──────────────────────────────────────────────────────── */}
      {page === "settings" && (
        <div style={{ width: "100%" }}>
          <WorkspaceHeaderTitle
            title="Settings"
            subtitle="Fund configuration, team access, and workspace preferences."
          />

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 16 }}>
              Fund Configuration
            </div>
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
              <FInput
                label="Target Fund Size"
                value={fundSubmission.targetFundSize}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, targetFundSize: v }))
                }
              />
              <FInput
                label="Target First Close"
                value={fundSubmission.targetFirstClose}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, targetFirstClose: v }))
                }
              />
              <FInput
                label="Raised to Date"
                value={fundSubmission.raisedToDate}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, raisedToDate: v }))
                }
              />
              <FSelect
                label="Raise Status"
                value={fundSubmission.currentStatus}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, currentStatus: v }))
                }
                options={["Pre-Launch", "First Close", "Active", "Final Close"]}
              />
              <FInput
                label="Close Timeline"
                value={fundSubmission.timeline}
                onChange={(v) =>
                  setFundSubmission((s) => ({ ...s, timeline: v }))
                }
              />
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
              Team Members
            </div>
            {[
              {
                name: "Avery Sloan",
                role: "Founder & Managing Partner",
                access: "Admin",
                initials: "AS",
              },
              {
                name: "Priya Raman",
                role: "Partner, Platform & Healthcare",
                access: "Full Access",
                initials: "PR",
              },
              {
                name: "Miles Ortega",
                role: "Venture Partner, AI Infrastructure",
                access: "Read Only",
                initials: "MO",
              },
            ].map((member, i) => (
              <div
                key={member.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.accent}40, ${C.purple}30)`,
                    border: `1px solid ${C.accent}30`,
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
                    {member.initials}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 640 }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {member.role}
                  </div>
                </div>
                <Pill
                  color={
                    member.access === "Admin"
                      ? C.accent
                      : member.access === "Full Access"
                      ? C.teal
                      : C.textMuted
                  }
                  size="xs"
                >
                  {member.access}
                </Pill>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => showToast("Invite sent", "success")}
              >
                Invite Team Member
              </Btn>
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 720, fontSize: 14, marginBottom: 14 }}>
              Integrations
            </div>
            {[
              {
                name: "DocSend / Datasite",
                desc: "Sync materials and track LP engagement",
                status: "Not Connected",
              },
              {
                name: "Salesforce CRM",
                desc: "Push pipeline updates to your existing CRM",
                status: "Not Connected",
              },
              {
                name: "Calendly",
                desc: "Auto-book LP meetings on reveal approval",
                status: "Not Connected",
              },
              {
                name: "DocuSign",
                desc: "Send subscription documents on commitment",
                status: "Not Connected",
              },
            ].map((int, i) => (
              <div
                key={int.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 0",
                  borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13.5, fontWeight: 640, marginBottom: 2 }}
                  >
                    {int.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>
                    {int.desc}
                  </div>
                </div>
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    showToast(`${int.name} connection coming soon`, "info")
                  }
                >
                  Connect
                </Btn>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="primary"
              onClick={() => showToast("Settings saved", "success")}
            >
              Save Changes
            </Btn>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LP WORKSPACE — REAL WORKFLOW
   ════════════════════════════════════════════════════════════════════════════ */

