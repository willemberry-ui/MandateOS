import { useState } from "react";
import { LogoMark } from "../ui";

/* ── Palette (same as Marketplace GP demo) ── */
const MP = {
  shell: "#121720",
  sidebar: "#111620",
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
  accent: "#7b6fe8",
  accentSoft: "rgba(123,111,232,.10)",
  accentBorder: "rgba(123,111,232,.22)",
  green: "#62c992",
  greenSoft: "rgba(98,201,146,.10)",
  amber: "#c7a96b",
  amberSoft: "rgba(199,169,107,.10)",
  red: "#e07575",
  redSoft: "rgba(224,117,117,.10)",
  type: {
    body: "'Inter', system-ui, sans-serif",
    mono: "'IBM Plex Mono','Source Code Pro',monospace",
    display: "'Manrope','Inter',system-ui,sans-serif",
  },
};

const MONO = { fontFamily: MP.type.mono };

/* ── Data ── */
const GP_ROWS = [
  { fund: "Northline Capital III", strategy: "Emerging VC", target: "$150M", raised: "$62M", readiness: 74, matches: 4, status: "Packet Incomplete", tone: "amber" },
  { fund: "Meridian Growth I", strategy: "Growth Equity", target: "$300M", raised: "$185M", readiness: 92, matches: 8, status: "In Diligence", tone: "green" },
  { fund: "Firstlight Ventures II", strategy: "Seed VC", target: "$120M", raised: "$88M", readiness: 88, matches: 6, status: "Reveal Requested", tone: "accent" },
  { fund: "Astera Capital Partners", strategy: "Enterprise SW", target: "$200M", raised: "$95M", readiness: 81, matches: 5, status: "Under Review", tone: "soft" },
  { fund: "Harbor Point Ventures", strategy: "B2B SaaS", target: "$100M", raised: "$41M", readiness: 69, matches: 3, status: "Missing Materials", tone: "red" },
  { fund: "Ironwood Seed Fund", strategy: "Pre-Seed VC", target: "$80M", raised: "$22M", readiness: 58, matches: 2, status: "Packet Incomplete", tone: "amber" },
];

const LP_ROWS = [
  { name: "Ridgeview Family Office", type: "Family Office", strategy: "Seed / Emerging Mgrs", check: "$500K–$1.5M", candidates: 9, reviewing: 3, status: "Active", tone: "green" },
  { name: "Calder Endowment", type: "Endowment", strategy: "Venture / Growth", check: "$2M–$5M", candidates: 6, reviewing: 2, status: "In Diligence", tone: "green" },
  { name: "Northgate Capital Partners", type: "Institutional LP", strategy: "Emerging Managers", check: "$1M–$3M", candidates: 11, reviewing: 4, status: "High Activity", tone: "accent" },
  { name: "Marlowe Foundation", type: "Foundation", strategy: "Tech / Healthcare", check: "$750K–$2M", candidates: 5, reviewing: 1, status: "Awaiting Follow-Up", tone: "amber" },
  { name: "Westbrook Advisory", type: "Multi-Family Office", strategy: "Seed / Fintech", check: "$1M–$2M", candidates: 7, reviewing: 2, status: "Reviewing", tone: "soft" },
  { name: "Harmon University Fund", type: "Endowment", strategy: "Venture / Impact", check: "$1M–$4M", candidates: 4, reviewing: 1, status: "New", tone: "soft" },
];

const MATCH_ROWS = [
  { gp: "Meridian Growth I", lp: "Northgate Capital Partners", fit: 88, status: "Reveal Approved", tone: "green", activity: "Access opened 2h ago", next: "Start diligence", check: "$2.5M" },
  { gp: "Firstlight Ventures II", lp: "Ridgeview Family Office", fit: 91, status: "Reveal Requested", tone: "accent", activity: "Packet viewed 1d ago", next: "Await LP approval", check: "$1.0M" },
  { gp: "Meridian Growth I", lp: "Calder Endowment", fit: 84, status: "In Diligence", tone: "green", activity: "DDQ requested 3h ago", next: "Upload materials", check: "$3.0M" },
  { gp: "Astera Capital Partners", lp: "Northgate Capital Partners", fit: 79, status: "Under Review", tone: "soft", activity: "Intro memo sent 2d ago", next: "Schedule follow-up", check: "$2.0M" },
  { gp: "Northline Capital III", lp: "Westbrook Advisory", fit: 76, status: "Packet Shared", tone: "soft", activity: "Viewed 2d ago", next: "Complete track record", check: "$1.5M" },
  { gp: "Harbor Point Ventures", lp: "Marlowe Foundation", fit: 72, status: "Stalled", tone: "amber", activity: "No action 6d", next: "Re-engage LP", check: "$750K" },
  { gp: "Ironwood Seed Fund", lp: "Ridgeview Family Office", fit: 68, status: "Packet Shared", tone: "soft", activity: "Deck opened 4d ago", next: "Follow up", check: "$500K" },
  { gp: "Astera Capital Partners", lp: "Harmon University Fund", fit: 82, status: "Reveal Requested", tone: "accent", activity: "Request sent 1d ago", next: "Await LP review", check: "$1.8M" },
];

const BLOCKERS = [
  { tone: "red", label: "3 GP profiles below 70% readiness", detail: "Northline, Harbor Point, Ironwood — missing attribution or DDQ" },
  { tone: "amber", label: "2 reveal requests aging >5 days", detail: "Marlowe Foundation and Westbrook Advisory have not responded" },
  { tone: "amber", label: "4 high-fit matches with no follow-up", detail: "Fit ≥80% but no activity scheduled in the past 72h" },
  { tone: "red", label: "1 GP missing audited track record", detail: "Harbor Point Ventures — blocks institutional LP approval" },
  { tone: "soft", label: "2 LPs viewed packet, no response", detail: "Westbrook Advisory and Marlowe Foundation — re-engagement needed" },
];

const ACTIVITY = [
  { time: "2h ago", text: "Reveal approved — Meridian Growth I → Northgate Capital Partners", tone: "green" },
  { time: "3h ago", text: "DDQ requested by Calder Endowment from Meridian Growth I", tone: "accent" },
  { time: "5h ago", text: "Ridgeview Family Office viewed Firstlight Ventures II packet", tone: "soft" },
  { time: "1d ago", text: "New LP onboarding completed: Westbrook Advisory", tone: "soft" },
  { time: "1d ago", text: "Reveal request submitted — Astera Capital Partners → Harmon University Fund", tone: "accent" },
  { time: "2d ago", text: "Marlowe Foundation requested updated materials from Harbor Point Ventures", tone: "amber" },
  { time: "2d ago", text: "DDQ uploaded by Northline Capital III", tone: "soft" },
  { time: "3d ago", text: "Calder Endowment moved Meridian Growth I into diligence", tone: "green" },
];

const REVEAL_ROWS = [
  { gp: "Firstlight Ventures II", lp: "Ridgeview Family Office", fit: 91, submitted: "1d ago", status: "Pending", age: "1d", tone: "accent" },
  { gp: "Astera Capital Partners", lp: "Harmon University Fund", fit: 82, submitted: "1d ago", status: "Pending", age: "1d", tone: "accent" },
  { gp: "Northline Capital III", lp: "Marlowe Foundation", fit: 76, submitted: "6d ago", status: "Aging", age: "6d", tone: "amber" },
  { gp: "Harbor Point Ventures", lp: "Westbrook Advisory", fit: 72, submitted: "5d ago", status: "Aging", age: "5d", tone: "amber" },
  { gp: "Meridian Growth I", lp: "Calder Endowment", fit: 84, submitted: "4d ago", status: "Approved", age: "4d", tone: "green" },
  { gp: "Ironwood Seed Fund", lp: "Ridgeview Family Office", fit: 68, submitted: "3d ago", status: "Declined", age: "3d", tone: "red" },
  { gp: "Meridian Growth I", lp: "Northgate Capital Partners", fit: 88, submitted: "2d ago", status: "Approved", age: "2d", tone: "green" },
];

const DILIGENCE_ROWS = [
  { gp: "Meridian Growth I", lp: "Calder Endowment", stage: "DDQ Review", check: "$3.0M", started: "4d ago", outstanding: "Track record memo, 2 references", status: "Active", tone: "green" },
  { gp: "Meridian Growth I", lp: "Northgate Capital Partners", stage: "Data Room Open", check: "$2.5M", started: "2d ago", outstanding: "Portfolio construction model", status: "Active", tone: "green" },
  { gp: "Astera Capital Partners", lp: "Northgate Capital Partners", stage: "Intro Review", check: "$2.0M", started: "6d ago", outstanding: "Downside scenario memo", status: "Stalled", tone: "amber" },
  { gp: "Firstlight Ventures II", lp: "Ridgeview Family Office", stage: "Packet Review", check: "$1.0M", started: "1d ago", outstanding: "Pending LP approval", status: "Pending", tone: "soft" },
  { gp: "Northline Capital III", lp: "Westbrook Advisory", stage: "Track Record", check: "$1.5M", started: "8d ago", outstanding: "Attribution appendix incomplete", status: "Blocked", tone: "red" },
];

/* ── Primitives ── */
function Chip({ tone, children }) {
  const map = {
    green: { bg: MP.greenSoft, color: MP.green, border: "rgba(98,201,146,.18)" },
    accent: { bg: MP.accentSoft, color: MP.accent, border: MP.accentBorder },
    amber: { bg: MP.amberSoft, color: MP.amber, border: "rgba(199,169,107,.18)" },
    red:   { bg: MP.redSoft,   color: MP.red,   border: "rgba(224,117,117,.18)" },
    soft:  { bg: "rgba(152,162,179,.07)", color: MP.soft, border: "rgba(152,162,179,.14)" },
  };
  const s = map[tone] || map.soft;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: 0.2, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Dot({ tone }) {
  const color = { green: MP.green, accent: MP.accent, amber: MP.amber, red: MP.red, soft: MP.soft }[tone] || MP.soft;
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />;
}

function ReadBar({ value }) {
  const color = value >= 85 ? MP.green : value >= 70 ? MP.accent : MP.amber;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ flex: 1, height: 3, background: MP.line, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ ...MONO, fontSize: 10.5, color, minWidth: 26, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function FitNum({ v }) {
  const color = v >= 85 ? MP.green : v >= 75 ? MP.accent : MP.soft;
  return <span style={{ ...MONO, fontSize: 13, fontWeight: 700, color }}>{v}%</span>;
}

function TH({ children, right }) {
  return (
    <th style={{ padding: "8px 12px", textAlign: right ? "right" : "left", fontSize: 10, fontWeight: 700, color: MP.muted, textTransform: "uppercase", letterSpacing: 0.7, borderBottom: `1px solid ${MP.line}`, whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

function TD({ children, right, mono, muted, style }) {
  return (
    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${MP.line}`, fontSize: 12.5, color: muted ? MP.muted : MP.text, textAlign: right ? "right" : "left", verticalAlign: "middle", fontFamily: mono ? MP.type.mono : MP.type.body, ...style }}>
      {children}
    </td>
  );
}

function TRow({ children }) {
  const [h, sh] = useState(false);
  return (
    <tr onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)} style={{ background: h ? MP.panel2 : "transparent", cursor: "pointer", transition: "background .1s" }}>
      {children}
    </tr>
  );
}

function Panel({ children, style }) {
  return <div style={{ background: MP.panel, border: `1px solid ${MP.line}`, borderRadius: 8, overflow: "hidden", ...style }}>{children}</div>;
}

function PH({ title, sub, right }) {
  return (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${MP.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: MP.text }}>{title}</div>
        {sub && <div style={{ fontSize: 10.5, color: MP.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Kpi({ label, value, sub, subTone }) {
  const sc = { green: MP.green, amber: MP.amber, red: MP.red }[subTone] || MP.muted;
  return (
    <div style={{ background: MP.panel, border: `1px solid ${MP.line}`, borderRadius: 8, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: MP.muted, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 7 }}>{label}</div>
      <div style={{ ...MONO, fontSize: 24, fontWeight: 700, color: MP.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: sc, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function NavBtn({ label, active, onClick, badge }) {
  const [h, sh] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => sh(true)}
      onMouseLeave={() => sh(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, border: "none",
        background: active ? MP.accentSoft : h ? "rgba(255,255,255,.04)" : "transparent",
        color: active ? MP.accent : h ? MP.text : MP.soft,
        fontSize: 12.5, fontWeight: active ? 600 : 400, cursor: "pointer", textAlign: "left",
        transition: "all .1s", marginBottom: 1,
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span style={{ ...MONO, fontSize: 10, fontWeight: 700, color: MP.amber, background: MP.amberSoft, padding: "1px 5px", borderRadius: 3 }}>{badge}</span>
      )}
    </button>
  );
}

/* ── Page content components ── */
function PageOverview() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Status strip */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          ["18 Active GPs", "soft"], ["12 Active LPs", "soft"], ["46 Live Matches", "soft"],
          ["7 Reveal Requests Pending", "amber"], ["5 In Diligence", "green"], ["$13.5M Capital in Motion", "accent"],
        ].map(([label, tone]) => <Chip key={label} tone={tone}>{label}</Chip>)}
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 10 }}>
        <Kpi label="Active GPs" value="18" sub="+3 this month" />
        <Kpi label="Active LPs" value="12" sub="+2 this month" />
        <Kpi label="Live Matches" value="46" sub="11 above 80% fit" />
        <Kpi label="Pending Reveals" value="7" sub="2 aging >5 days" subTone="amber" />
        <Kpi label="In Diligence" value="5" sub="3 DDQs outstanding" subTone="amber" />
        <Kpi label="Capital in Motion" value="$13.5M" sub="across 5 workflows" subTone="green" />
      </div>

      {/* Two-sided panes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Panel>
          <PH title="GP Pipeline" sub="Manager readiness, match coverage, and workflow progression." right={<span style={{ fontSize: 11, color: MP.muted }}>6 active</span>} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><TH>Fund</TH><TH>Strategy</TH><TH>Raised</TH><TH>Readiness</TH><TH right>Matches</TH><TH>Status</TH></tr></thead>
            <tbody>
              {GP_ROWS.map(r => (
                <TRow key={r.fund}>
                  <TD><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.fund}</div><div style={{ fontSize: 10.5, color: MP.muted }}>{r.target} target</div></TD>
                  <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.strategy}</TD>
                  <TD mono>{r.raised}</TD>
                  <TD style={{ minWidth: 110 }}><ReadBar value={r.readiness} /></TD>
                  <TD right mono><span style={{ color: MP.accent, fontWeight: 700 }}>{r.matches}</span></TD>
                  <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel>
          <PH title="LP Pipeline" sub="Allocator activity, preferences, and review progression." right={<span style={{ fontSize: 11, color: MP.muted }}>6 active</span>} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><TH>Allocator</TH><TH>Strategy</TH><TH>Check</TH><TH right>Cands.</TH><TH right>Reviewing</TH><TH>Status</TH></tr></thead>
            <tbody>
              {LP_ROWS.map(r => (
                <TRow key={r.name}>
                  <TD><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.name}</div><div style={{ fontSize: 10.5, color: MP.muted }}>{r.type}</div></TD>
                  <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.strategy}</TD>
                  <TD mono style={{ fontSize: 11.5, color: MP.soft }}>{r.check}</TD>
                  <TD right mono>{r.candidates}</TD>
                  <TD right mono><span style={{ color: MP.accent, fontWeight: 700 }}>{r.reviewing}</span></TD>
                  <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
                </TRow>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Live Match Queue */}
      <Panel>
        <PH title="Live Match Queue" sub="Active GP–LP relationships progressing through reveal, review, and diligence."
          right={<div style={{ display: "flex", gap: 6 }}><Chip tone="green">5 In Motion</Chip><Chip tone="amber">1 Stalled</Chip></div>}
        />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>GP</TH><TH>LP</TH><TH right>Fit</TH><TH>Status</TH><TH>Last Activity</TH><TH>Next Action</TH><TH right>Est. Check</TH></tr></thead>
          <tbody>
            {MATCH_ROWS.map((r, i) => (
              <TRow key={i}>
                <TD style={{ fontWeight: 600 }}>{r.gp}</TD>
                <TD style={{ color: MP.soft }}>{r.lp}</TD>
                <TD right><FitNum v={r.fit} /></TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
                <TD muted style={{ fontSize: 11.5 }}>{r.activity}</TD>
                <TD style={{ fontSize: 12, color: MP.text }}>{r.next}</TD>
                <TD right mono style={{ fontWeight: 600 }}>{r.check}</TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Blockers + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Panel>
          <PH title="Needs Attention" sub="Platform exceptions and workflow blockers." />
          {BLOCKERS.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr)", gap: 10, alignItems: "start", padding: "11px 16px", borderBottom: i < BLOCKERS.length - 1 ? `1px solid ${MP.line}` : "none" }}>
              <Dot tone={b.tone} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: MP.text }}>{b.label}</div>
                <div style={{ fontSize: 11, color: MP.muted, marginTop: 2 }}>{b.detail}</div>
              </div>
            </div>
          ))}
        </Panel>
        <Panel>
          <PH title="Recent Activity" sub="Platform event log across both sides of the market." />
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) 50px", gap: 10, alignItems: "start", padding: "10px 16px", borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${MP.line}` : "none" }}>
              <Dot tone={a.tone} />
              <span style={{ fontSize: 11.5, color: MP.soft, lineHeight: 1.4 }}>{a.text}</span>
              <span style={{ ...MONO, fontSize: 10, color: MP.muted, textAlign: "right", paddingTop: 1 }}>{a.time}</span>
            </div>
          ))}
        </Panel>
      </div>

      {/* Insight strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
        {[
          ["Avg GP Readiness", "81%", "across 18 active manager profiles"],
          ["Reveal Approval Rate", "68%", "LP acceptance rate on submitted requests"],
          ["Avg Time to Diligence", "9 days", "from first reveal request to DDQ start"],
        ].map(([label, value, note]) => (
          <div key={label} style={{ background: MP.panel, border: `1px solid ${MP.line}`, borderRadius: 8, padding: "13px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: MP.muted, textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</div>
              <div style={{ fontSize: 10.5, color: MP.muted, marginTop: 3 }}>{note}</div>
            </div>
            <div style={{ ...MONO, fontSize: 20, fontWeight: 700, color: MP.text }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageGPs() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>GPs</div>
          <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Fund manager profiles, readiness, and workflow state.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Kpi label="Total GPs" value="18" />
          <Kpi label="Avg Readiness" value="77%" />
          <Kpi label="Below Gate" value="3" subTone="amber" sub="<70% readiness" />
        </div>
      </div>
      <Panel>
        <PH title="All GP Profiles" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>#</TH><TH>Fund</TH><TH>Strategy</TH><TH>Target</TH><TH>Raised</TH><TH>Readiness</TH><TH right>Matches</TH><TH>Status</TH></tr></thead>
          <tbody>
            {GP_ROWS.map((r, i) => (
              <TRow key={r.fund}>
                <TD mono muted>{i + 1}</TD>
                <TD><div style={{ fontWeight: 600 }}>{r.fund}</div></TD>
                <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.strategy}</TD>
                <TD mono style={{ color: MP.soft }}>{r.target}</TD>
                <TD mono>{r.raised}</TD>
                <TD style={{ minWidth: 120 }}><ReadBar value={r.readiness} /></TD>
                <TD right mono><span style={{ color: MP.accent, fontWeight: 700 }}>{r.matches}</span></TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function PageLPs() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>LPs</div>
          <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Allocator profiles, mandate activity, and review status.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Kpi label="Total LPs" value="12" />
          <Kpi label="Active Reviews" value="13" />
          <Kpi label="High Activity" value="3" subTone="green" sub="rising engagement" />
        </div>
      </div>
      <Panel>
        <PH title="All LP Profiles" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>#</TH><TH>Allocator</TH><TH>Type</TH><TH>Strategy</TH><TH>Check Range</TH><TH right>Candidates</TH><TH right>Reviewing</TH><TH>Status</TH></tr></thead>
          <tbody>
            {LP_ROWS.map((r, i) => (
              <TRow key={r.name}>
                <TD mono muted>{i + 1}</TD>
                <TD style={{ fontWeight: 600 }}>{r.name}</TD>
                <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.type}</TD>
                <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.strategy}</TD>
                <TD mono style={{ fontSize: 11.5, color: MP.soft }}>{r.check}</TD>
                <TD right mono>{r.candidates}</TD>
                <TD right mono><span style={{ color: MP.accent, fontWeight: 700 }}>{r.reviewing}</span></TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function PageMatches() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Matches</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>All active GP–LP matches ranked by fit score.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
        <Kpi label="Total Matches" value="46" />
        <Kpi label="Above 80% Fit" value="11" subTone="green" sub="high-conviction" />
        <Kpi label="Reveal Eligible" value="18" />
        <Kpi label="Stalled" value="4" subTone="amber" sub="no action >5d" />
      </div>
      <Panel>
        <PH title="Live Match Queue" sub="All active GP–LP pairings across the platform." />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>#</TH><TH>GP</TH><TH>LP</TH><TH right>Fit</TH><TH>Status</TH><TH>Last Activity</TH><TH>Next Action</TH><TH right>Est. Check</TH></tr></thead>
          <tbody>
            {MATCH_ROWS.map((r, i) => (
              <TRow key={i}>
                <TD mono muted>{i + 1}</TD>
                <TD style={{ fontWeight: 600 }}>{r.gp}</TD>
                <TD style={{ color: MP.soft }}>{r.lp}</TD>
                <TD right><FitNum v={r.fit} /></TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
                <TD muted style={{ fontSize: 11.5 }}>{r.activity}</TD>
                <TD style={{ fontSize: 12 }}>{r.next}</TD>
                <TD right mono style={{ fontWeight: 600 }}>{r.check}</TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function PageReveal() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Reveal Requests</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>GP-initiated identity reveal requests awaiting LP approval.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
        <Kpi label="Pending" value="4" subTone="amber" sub="awaiting LP response" />
        <Kpi label="Aging >5 Days" value="2" subTone="red" sub="intervention needed" />
        <Kpi label="Approved" value="2" subTone="green" />
        <Kpi label="Declined" value="1" />
      </div>
      <Panel>
        <PH title="All Reveal Requests" sub="Submitted by GPs — awaiting or completed LP decision." />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>#</TH><TH>GP</TH><TH>LP</TH><TH right>Fit</TH><TH>Submitted</TH><TH>Age</TH><TH>Status</TH></tr></thead>
          <tbody>
            {REVEAL_ROWS.map((r, i) => (
              <TRow key={i}>
                <TD mono muted>{i + 1}</TD>
                <TD style={{ fontWeight: 600 }}>{r.gp}</TD>
                <TD style={{ color: MP.soft }}>{r.lp}</TD>
                <TD right><FitNum v={r.fit} /></TD>
                <TD muted style={{ fontSize: 11.5 }}>{r.submitted}</TD>
                <TD mono style={{ color: r.tone === "amber" || r.tone === "red" ? MP.amber : MP.muted, fontSize: 11.5 }}>{r.age}</TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function PageDiligence() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Diligence</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Active diligence workflows and outstanding document requests.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
        <Kpi label="In Diligence" value="5" />
        <Kpi label="DDQs Outstanding" value="3" subTone="amber" />
        <Kpi label="Capital at Stage" value="$10.0M" subTone="green" />
        <Kpi label="Blocked" value="1" subTone="red" sub="attribution incomplete" />
      </div>
      <Panel>
        <PH title="Active Diligence Cases" sub="GP–LP pairs with open diligence workflows." />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>#</TH><TH>GP</TH><TH>LP</TH><TH>Stage</TH><TH right>Check</TH><TH>Started</TH><TH>Outstanding</TH><TH>Status</TH></tr></thead>
          <tbody>
            {DILIGENCE_ROWS.map((r, i) => (
              <TRow key={i}>
                <TD mono muted>{i + 1}</TD>
                <TD style={{ fontWeight: 600 }}>{r.gp}</TD>
                <TD style={{ color: MP.soft }}>{r.lp}</TD>
                <TD style={{ color: MP.soft, fontSize: 11.5 }}>{r.stage}</TD>
                <TD right mono style={{ fontWeight: 600 }}>{r.check}</TD>
                <TD muted style={{ fontSize: 11.5 }}>{r.started}</TD>
                <TD style={{ fontSize: 11.5, color: MP.soft, maxWidth: 200 }}>{r.outstanding}</TD>
                <TD><Chip tone={r.tone}>{r.status}</Chip></TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function PageAnalytics() {
  const metrics = [
    ["GP Readiness", [74, 92, 88, 81, 69, 58], "% readiness score"],
    ["Match Fit Scores", [91, 88, 84, 82, 79, 76, 72, 68], "% fit score per active match"],
  ];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Analytics</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Platform-level metrics and performance indicators.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
        <Kpi label="Avg GP Readiness" value="77%" />
        <Kpi label="Reveal Approval Rate" value="68%" />
        <Kpi label="Avg Time to Diligence" value="9 days" />
        <Kpi label="Avg Fit Score" value="79%" />
        <Kpi label="Capital per Match" value="$1.7M" />
        <Kpi label="Diligence Conversion" value="34%" subTone="green" sub="reveals → diligence" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {metrics.map(([title, values, label]) => (
          <Panel key={title}>
            <PH title={title} sub={label} />
            <div style={{ padding: "14px 16px", display: "grid", gap: 10 }}>
              {values.map((v, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 40px", gap: 10, alignItems: "center" }}>
                  <div style={{ height: 4, background: MP.line, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${v}%`, height: "100%", background: v >= 85 ? MP.green : v >= 70 ? MP.accent : MP.amber, borderRadius: 2 }} />
                  </div>
                  <span style={{ ...MONO, fontSize: 11, color: MP.soft, textAlign: "right" }}>{v}%</span>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function PageActivity() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Activity Log</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Full platform event history across both sides of the market.</div>
      </div>
      <Panel>
        <PH title="Platform Events" sub="Real-time activity across GPs, LPs, matches, and diligence workflows." />
        {[...ACTIVITY, ...ACTIVITY.map(a => ({ ...a, time: a.time.replace("h", "h+").replace("d", "d+") }))].map((a, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) 60px", gap: 12, alignItems: "start", padding: "11px 16px", borderBottom: `1px solid ${MP.line}` }}>
            <Dot tone={a.tone} />
            <span style={{ fontSize: 12.5, color: MP.soft, lineHeight: 1.4 }}>{a.text}</span>
            <span style={{ ...MONO, fontSize: 10, color: MP.muted, textAlign: "right", paddingTop: 1 }}>{a.time}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function PageUsers() {
  const users = [
    { name: "Garry Tan", email: "garry@ycombinator.com", role: "GP Admin", org: "Y Combinator", status: "Active", last: "2h ago" },
    { name: "Avery Sloan", email: "avery@pacificendo.org", role: "LP Admin", org: "Calder Endowment", status: "Active", last: "5h ago" },
    { name: "Platform Admin", email: "admin@mandateos.io", role: "Platform Admin", org: "MandateOS", status: "Active", last: "Now" },
    { name: "Eliot Ramos", email: "eliot@firstlightvc.com", role: "GP", org: "Firstlight Ventures II", status: "Active", last: "1d ago" },
    { name: "Miles Ortega", email: "miles@northgate.com", role: "LP Analyst", org: "Northgate Capital Partners", status: "Active", last: "3h ago" },
    { name: "Priya Raman", email: "priya@calder.edu", role: "LP", org: "Calder Endowment", status: "Invited", last: "—" },
  ];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: MP.text, letterSpacing: -0.3 }}>Users / Access</div>
        <div style={{ fontSize: 12, color: MP.muted, marginTop: 3 }}>Platform user accounts, roles, and access control.</div>
      </div>
      <Panel>
        <PH title="All Users" sub="Active accounts across GP and LP organizations." right={<Chip tone="accent">Pilot Cohort I</Chip>} />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Organization</TH><TH>Status</TH><TH>Last Active</TH></tr></thead>
          <tbody>
            {users.map(u => (
              <TRow key={u.email}>
                <TD style={{ fontWeight: 600 }}>{u.name}</TD>
                <TD muted style={{ fontSize: 11.5 }}>{u.email}</TD>
                <TD style={{ fontSize: 11.5 }}><Chip tone={u.role.includes("Admin") ? "accent" : "soft"}>{u.role}</Chip></TD>
                <TD style={{ color: MP.soft, fontSize: 12 }}>{u.org}</TD>
                <TD><Chip tone={u.status === "Active" ? "green" : "amber"}>{u.status}</Chip></TD>
                <TD mono muted style={{ fontSize: 11 }}>{u.last}</TD>
              </TRow>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "gps", label: "GPs" },
  { id: "lps", label: "LPs" },
  { id: "matches", label: "Matches" },
  { id: "reveal", label: "Reveal Requests", badge: 7 },
  { id: "diligence", label: "Diligence" },
  { id: "analytics", label: "Analytics" },
  { id: "activity", label: "Activity Log" },
  { id: "users", label: "Users / Access" },
];

const PAGE_CONTENT = {
  overview: <PageOverview />,
  gps: <PageGPs />,
  lps: <PageLPs />,
  matches: <PageMatches />,
  reveal: <PageReveal />,
  diligence: <PageDiligence />,
  analytics: <PageAnalytics />,
  activity: <PageActivity />,
  users: <PageUsers />,
};

export function AdminDashboard({ onLogout }) {
  const [page, setPage] = useState("overview");

  return (
    <div className="marketplace-demo-shell" style={{ color: MP.text, fontFamily: MP.type.body }}>

      {/* ── Sidebar ── */}
      <aside className="marketplace-demo-sidebar" style={{ background: MP.sidebar, borderRight: `1px solid ${MP.line}`, padding: "18px 10px 18px", display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ padding: "0 2px 16px", borderBottom: `1px solid ${MP.line}`, marginBottom: 12 }}>
          <button type="button" onClick={onLogout} style={{ border: "none", background: "transparent", color: MP.text, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 5px", borderRadius: 8, marginBottom: 12, width: "100%", textAlign: "left" }}>
            <LogoMark size={20} />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: -0.1 }}>MandateOS</span>
          </button>
          <div style={{ padding: "8px 7px", borderRadius: 8, background: "rgba(255,255,255,.025)", border: `1px solid ${MP.line}` }}>
            <div style={{ fontSize: 10, color: MP.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 3 }}>Platform Admin</div>
            <div style={{ fontSize: 12, color: MP.text, fontWeight: 600 }}>Control Tower</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map(item => (
            <NavBtn key={item.id} label={item.label} active={page === item.id} onClick={() => setPage(item.id)} badge={item.badge} />
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${MP.line}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "6px 10px", fontSize: 11, color: MP.muted, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: MP.green, flexShrink: 0 }} />
            Pilot Cohort I · Demo Env
          </div>
          <NavBtn label="← Back to site" active={false} onClick={onLogout} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="marketplace-center-shell">
        {/* Topbar */}
        <div style={{ borderBottom: `1px solid ${MP.line}`, background: MP.workspace2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0 24px", height: 52, minWidth: 0, flexShrink: 0 }}>
          <div style={{ fontWeight: 560, fontSize: 13, color: MP.soft }}>Platform Control Tower</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", fontSize: 11.5, color: MP.accent, background: MP.accentSoft, border: `1px solid ${MP.accentBorder}`, borderRadius: 6, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: MP.accent }} />
              Live · Synced 2m ago
            </div>
          </div>
        </div>

        {/* Page header */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: MP.text, letterSpacing: -0.4, marginBottom: 2 }}>
            {NAV.find(n => n.id === page)?.label || "Overview"}
          </div>
          <div style={{ fontSize: 12, color: MP.muted, marginBottom: 18 }}>
            Unified oversight across GPs, LPs, matches, reveal workflows, and diligence activity.
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 32px" }}>
          {PAGE_CONTENT[page]}
        </div>
      </main>
    </div>
  );
}
