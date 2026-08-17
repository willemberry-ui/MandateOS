import { useState, useEffect, useRef } from "react";
import { C } from "../../tokens";
import { getScoreColor, getInitials, lsGet, lsSet, formatMoneyRange } from "../../lib/helpers";
import { showToast, Btn, Pill, Card, Mono, Dot, FInput, FSelect, FTags, Separator, SectionLabel, SectionTitle, StatBox, THead, TRow, LPProfileModal, GPProfileModal, SkeletonCard } from "../ui";
import { WorkspaceShell, NavItem, WorkspaceHeaderTitle } from "../WorkspaceShell";
import { DemoLaunchBanner, MarketplaceLPDemoWorkspace } from "./Marketplace";
import { ActivityFeed, EmptyState, NextBestActionCard, OnboardingChecklist, WorkflowBanner, GPWorkspace } from "./GP";
import { DemoFit } from "../Landing";

function LegacyLPWorkspace({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const isDemoUser = String(user?.id || "").startsWith("demo-");

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
      nextStep: "Approve reveal and move into diligence",
      sectorFocus: "Business Services / Industrials",
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
      nextStep: "Request attribution detail before advancing",
      sectorFocus: "Healthcare / Vertical SaaS",
    },
    {
      id: 203,
      name: "Summit Industrial Partners I",
      type: "Buyout",
      geo: "North America",
      size: "$180M",
      score: 91,
      stage: "First Close",
      minTicket: "$3M",
      minTicketValue: 3,
      status: "Review",
      fitReason: "Excellent mandate fit and clean first-close process",
      dataCompleteness: 88,
      diligenceReadiness: 81,
      emergingManagerFriendly: true,
      nextStep: "Complete final IC memo and confirm references",
      sectorFocus: "Industrials / Services",
    },
    {
      id: 204,
      name: "Northline Healthcare Opportunities",
      type: "Growth Equity",
      geo: "North America",
      size: "$240M",
      score: 79,
      stage: "Active",
      minTicket: "$3M",
      minTicketValue: 3,
      status: "Diligence",
      fitReason: "Matches sector bias and current pacing window",
      dataCompleteness: 86,
      diligenceReadiness: 74,
      emergingManagerFriendly: true,
      nextStep: "Close missing references and track team attribution",
      sectorFocus: "Healthcare / Growth",
    },
    {
      id: 205,
      name: "Atlas Services Fund II",
      type: "Buyout",
      geo: "North America",
      size: "$210M",
      score: 68,
      stage: "Active",
      minTicket: "$2M",
      minTicketValue: 2,
      status: "Requested Info",
      fitReason: "Potential fit, but memo quality is not yet decision-ready",
      dataCompleteness: 61,
      diligenceReadiness: 52,
      emergingManagerFriendly: true,
      nextStep: "Get updated DDQ and ownership concentration detail",
      sectorFocus: "Business Services",
    },
    {
      id: 206,
      name: "Ridgeview Capital Partners II",
      type: "Buyout",
      geo: "North America",
      size: "$275M",
      score: 88,
      stage: "Final Close",
      minTicket: "$4M",
      minTicketValue: 4,
      status: "Approved",
      fitReason: "High-quality manager already through IC with strong alignment",
      dataCompleteness: 93,
      diligenceReadiness: 92,
      emergingManagerFriendly: false,
      nextStep: "Track allocation sizing and commitment timing",
      sectorFocus: "Lower Middle Market Buyout",
    },
    {
      id: 207,
      name: "Granite Lower Middle Market II",
      type: "Buyout",
      geo: "North America",
      size: "$160M",
      score: 82,
      stage: "Final Close",
      minTicket: "$2M",
      minTicketValue: 2,
      status: "Committed",
      fitReason: "Approved and committed inside the current pacing plan",
      dataCompleteness: 95,
      diligenceReadiness: 100,
      emergingManagerFriendly: true,
      nextStep: "Monitor close timing and reporting cadence",
      sectorFocus: "Industrial Services",
    },
    {
      id: 208,
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
      nextStep: "No next step; outside strategy",
      sectorFocus: "Generalist Venture",
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
    {
      id: 2,
      gpName: "Summit Industrial Partners I",
      fitScore: 91,
      status: "Approved",
      submittedAt: "Yesterday",
    },
    {
      id: 3,
      gpName: "Atlas Services Fund II",
      fitScore: 68,
      status: "Pending",
      submittedAt: "2 days ago",
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
      notes:
        "Strong fit for mandate. Need tighter attribution framing before moving to IC.",
      missingItems: "Team attribution by deal, reference call list",
    },
    204: {
      status: "Waiting",
      checklist: {
        "Track record reviewed": true,
        "Team background verified": true,
        "Fund terms reviewed": false,
        "References requested": true,
        "Data room accessed": true,
        "IC memo drafted": false,
      },
      notes:
        "Healthcare angle is compelling. Waiting on one reference and updated legal terms summary.",
      missingItems: "One operating partner reference, updated legal terms summary",
    },
    206: {
      status: "Complete",
      checklist: {
        "Track record reviewed": true,
        "Team background verified": true,
        "Fund terms reviewed": true,
        "References requested": true,
        "Data room accessed": true,
        "IC memo drafted": true,
      },
      notes:
        "IC approved. Allocation size and commitment timing are the only open operational items.",
      missingItems: "None",
    },
  });

  const filteredOpportunities = opportunities.filter((opp) => opp.score >= 0);
  const visibleOpportunities = filteredOpportunities.filter(
    (opp) => opp.status !== "Passed"
  );
  const priorityOpportunities = [...visibleOpportunities]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const pendingReveals = revealQueue.filter((r) => r.status === "Pending");
  const approvedOrCommitted = opportunities.filter((o) =>
    ["Approved", "Committed"].includes(o.status)
  ).length;
  const activeDiligenceItems = Object.entries(diligenceWork)
    .map(([oppId, work]) => {
      const opp = opportunities.find((x) => String(x.id) === String(oppId));
      if (!opp) return null;
      const done = Object.values(work.checklist).filter(Boolean).length;
      const total = Object.keys(work.checklist).length;
      return {
        opp,
        work,
        done,
        total,
        progress: total ? Math.round((done / total) * 100) : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.opp.score - a.opp.score);
  const strongFitCount = visibleOpportunities.filter((o) => o.score >= 75).length;

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
        icon="⊙"
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
        icon="◫"
        active={page === "diligence"}
        onClick={() => setPage("diligence")}
        badge={Object.keys(diligenceWork).length}
      />
      <NavItem
        label="Exposure Tracker"
        icon="↗"
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isDemoUser && <Pill color={C.teal}>LP Demo</Pill>}
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
            LP Workspace
          </span>
        </div>
      }
    >
      {page === "dashboard" && (
        <div>
          <WorkspaceHeaderTitle
            title="LP Dashboard"
            subtitle="Define mandate, stay private, filter noise, and only diligence what actually fits."
          />

          {isDemoUser && (
            <DemoLaunchBanner
              title="Start from a real allocator workday, not an empty dashboard"
              subtitle="This LP demo opens with qualified inbound managers, pending reveal decisions, live diligence work, and a commitment already progressing through the cycle. The goal is to show how MandateOS helps an allocator screen noise, protect identity, and move the right managers forward."
              color={C.teal}
              stats={[
                {
                  label: "Qualified opportunities",
                  value: `${strongFitCount} above threshold`,
                  color: C.green,
                },
                {
                  label: "Pending reveal decisions",
                  value: String(pendingReveals.length),
                  color: C.amber,
                },
                {
                  label: "Live diligence files",
                  value: String(activeDiligenceItems.length),
                  color: C.teal,
                },
                {
                  label: "Approved / committed",
                  value: String(approvedOrCommitted),
                  color: "#8b6cf0",
                },
              ]}
              actions={[
                {
                  label: "Open Inbound Queue",
                  onClick: () => setPage("inbound"),
                  variant: "primary",
                },
                {
                  label: "Review Reveal Controls",
                  onClick: () => setPage("privacy"),
                  variant: "secondary",
                },
                {
                  label: "Edit Mandate",
                  onClick: () => setPage("mandate"),
                  variant: "secondary",
                },
              ]}
            />
          )}

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
              gridTemplateColumns: "1.25fr .95fr",
              gap: 16,
            }}
          >
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 720, fontSize: 15 }}>
                  Priority Screening Queue
                </div>
                <Pill color={C.green} size="xs">
                  {strongFitCount} qualified
                </Pill>
              </div>
              {priorityOpportunities.map((opp, i) => {
                const sc = getScoreColor(opp.score);
                const reasons = buildLpFitReason(opp, mandate);
                return (
                  <div
                    key={opp.id}
                    style={{
                      padding: "12px 0",
                      borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, flex: 1 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            border: `2px solid ${sc}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `${sc}10`,
                            flexShrink: 0,
                          }}
                        >
                          <Mono size={12} weight={800} color={sc}>
                            {opp.score}
                          </Mono>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: 4,
                            }}
                          >
                            <div style={{ fontWeight: 680, fontSize: 13.5 }}>
                              {opp.name}
                            </div>
                            <Pill
                              color={STAGE_COLORS[opp.status] || C.textMuted}
                              size="xs"
                            >
                              {opp.status}
                            </Pill>
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: C.textMuted,
                              marginBottom: 6,
                            }}
                          >
                            {opp.type} · {opp.geo} · {opp.size} · {opp.sectorFocus}
                          </div>
                          <div
                            style={{
                              fontSize: 12.5,
                              color: C.textSoft,
                              lineHeight: 1.6,
                              marginBottom: 6,
                            }}
                          >
                            <strong style={{ color: C.text }}>Why it fits:</strong>{" "}
                            {reasons.join(" · ")}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.textSoft,
                              lineHeight: 1.55,
                            }}
                          >
                            <strong style={{ color: C.text }}>Next move:</strong>{" "}
                            {opp.nextStep}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 120 }}>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            marginBottom: 4,
                          }}
                        >
                          Diligence readiness
                        </div>
                        <Mono size={16} weight={800} color={sc}>
                          {opp.diligenceReadiness}%
                        </Mono>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => setPage("inbound")}
                >
                  Review Full Queue
                </Btn>
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage("diligence")}
                >
                  Open Diligence
                </Btn>
              </div>
            </Card>

            <div style={{ display: "grid", gap: 16 }}>
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
                      gap: 12,
                      padding: "8px 0",
                      borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.textMuted }}>{k}</span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 650,
                        textAlign: "right",
                        maxWidth: 180,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </Card>

              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 720, fontSize: 15 }}>
                    Reveal Queue
                  </div>
                  <Pill color={C.amber} size="xs">
                    {pendingReveals.length} waiting
                  </Pill>
                </div>
                {revealQueue.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      padding: "10px 0",
                      borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontWeight: 650, fontSize: 13 }}>
                        {r.gpName}
                      </div>
                      <Mono
                        size={12}
                        weight={800}
                        color={getScoreColor(r.fitScore)}
                      >
                        {r.fitScore}
                      </Mono>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: 11.5, color: C.textMuted }}>
                        Submitted {r.submittedAt}
                      </div>
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
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage("privacy")}
                  >
                    Open Reveal Controls
                  </Btn>
                </div>
              </Card>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 16,
              marginTop: 16,
              alignItems: "start",
            }}
          >
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 720, fontSize: 15 }}>
                  Active Diligence Work
                </div>
                <Pill color={C.teal} size="xs">
                  {activeDiligenceItems.length} files
                </Pill>
              </div>
              {activeDiligenceItems.map((item, i) => (
                <div
                  key={item.opp.id}
                  style={{
                    padding: "12px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 660, fontSize: 13.5 }}>
                        {item.opp.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.textMuted }}>
                        {item.work.status} · {item.done}/{item.total} checklist items complete
                      </div>
                    </div>
                    <Mono
                      size={14}
                      weight={800}
                      color={item.progress >= 80 ? C.green : C.amber}
                    >
                      {item.progress}%
                    </Mono>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 999,
                      background: C.borderSubtle,
                      overflow: "hidden",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${item.progress}%`,
                        height: "100%",
                        background: item.progress >= 80 ? C.green : C.amber,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: C.textSoft,
                      lineHeight: 1.55,
                    }}
                  >
                    <strong style={{ color: C.text }}>Missing info:</strong>{" "}
                    {item.work.missingItems}
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ fontWeight: 720, fontSize: 15, marginBottom: 12 }}>
                What This LP Demo Shows
              </div>
              {[
                "Set the mandate before taking a single GP call.",
                "Keep identity private until fit and diligence justify a reveal.",
                "Review every manager in a structured queue instead of PDFs in email.",
                "Push the best opportunities from screening into diligence and commitment tracking.",
              ].map((item, i) => (
                <div
                  key={item}
                  style={{
                    padding: "10px 0",
                    borderTop: i ? `1px solid ${C.borderSubtle}` : "none",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: C.tealWash,
                      border: `1px solid ${C.teal}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.teal,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: C.textSoft,
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: C.bg,
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
                    marginBottom: 6,
                  }}
                >
                  Current demo readout
                </div>
                <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>
                  You have {visibleOpportunities.length} live opportunities,{" "}
                  {pendingReveals.length} managers waiting on reveal approval, and{" "}
                  {approvedOrCommitted} opportunities already past the screening stage.
                </div>
              </div>
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

const LP_DEMO_PIPELINE_STAGES = [
  "New",
  "Reviewing",
  "More Info Requested",
  "In Diligence",
  "IC Pending",
  "Soft Circled",
  "Committed",
  "Passed",
];

const LP_DEMO_QUEUE_ORDER = [
  "new",
  "reviewing",
  "moreInfo",
  "diligence",
  "ic",
  "archive",
];

const LP_DEMO_INBOX_BUCKETS = [
  { id: "new", label: "New", desc: "Primary inbox" },
  { id: "reviewing", label: "Reviewing", desc: "Active review" },
  { id: "moreInfo", label: "More Info Requested", desc: "Awaiting response" },
  { id: "diligence", label: "In Diligence", desc: "Live workspaces" },
  { id: "ic", label: "IC Pending", desc: "Decision queue" },
  { id: "archive", label: "Passed / Archive", desc: "Reviewed out" },
];

const LP_DEMO_STAGE_DESCRIPTIONS = {
  New: "High-fit opportunities that cleared the inbox threshold.",
  Reviewing: "Requests under active allocator review before diligence.",
  "More Info Requested":
    "Structured follow-up questions sent while identity stays protected.",
  "In Diligence":
    "Shared workspaces with documents, Q&A, and internal notes.",
  "IC Pending":
    "Decision-ready opportunities heading into committee.",
  "Soft Circled": "Sizing and timing work ahead of commitment confirmation.",
  Committed: "Approved allocations retained as institutional memory.",
  Passed: "Archived opportunities that were screened out quickly.",
};

function getLpDemoStageColor(stage) {
  return (
    {
      Reviewing: C.amber,
      "More Info Requested": "#8b6cf0",
      "In Diligence": C.teal,
      "IC Pending": "#8b6cf0",
      "Soft Circled": C.green,
      Committed: C.green,
      Passed: C.red,
      New: C.accent,
    }[stage] ||
    STAGE_COLORS[stage] ||
    C.textMuted
  );
}

function getLpDemoBucket(item) {
  if (item.stage === "Passed") return "archive";
  if (item.stage === "More Info Requested") return "moreInfo";
  if (item.stage === "In Diligence") return "diligence";
  if (item.stage === "IC Pending") return "ic";
  if (item.stage === "Reviewing") return "reviewing";
  if (item.stage === "New" && item.fitScore >= 70) return "new";
  if (item.stage === "New" && item.fitScore >= 60) return "hidden";
  return "active";
}

function getLpDemoStageDescription(stage) {
  return LP_DEMO_STAGE_DESCRIPTIONS[stage] || "Allocator workflow stage";
}

function getLpDemoItemMeta(item) {
  const meta = {
    301: {
      updatedAt: "Updated 12m ago",
      urgency: "Review window active",
      timeline: "First close in 35 days",
      nextAction: "Decide whether to request attribution or open diligence.",
      stageContext: "New high-fit opportunity",
      activity: [
        {
          title: "New high-fit opportunity",
          detail: "Scored above the 70% threshold and entered the main inbox.",
          time: "12m ago",
          color: C.green,
        },
        {
          title: "Deck refreshed",
          detail: "Updated fund deck and track record schedule indexed.",
          time: "23m ago",
          color: C.teal,
        },
      ],
    },
    302: {
      updatedAt: "Updated 27m ago",
      urgency: "Allocator review live",
      timeline: "Manager raising through Q4",
      nextAction: "Pressure-test sourcing repeatability before reveal.",
      stageContext: "Under active review",
      activity: [
        {
          title: "Review resumed",
          detail: "Re-entered the queue after terms fit confirmed.",
          time: "27m ago",
          color: C.amber,
        },
      ],
    },
    303: {
      updatedAt: "Updated 8m ago",
      urgency: "Awaiting LP decision",
      timeline: "Response received today",
      nextAction: "Assess whether the new attribution detail is enough to open diligence.",
      stageContext: "Structured follow-up in progress",
      activity: [
        {
          title: "GP responded to info request",
          detail: "Attribution appendix uploaded and pipeline clarified.",
          time: "8m ago",
          color: C.teal,
        },
        {
          title: "Awaiting LP decision",
          detail: "The next move is either reveal or another diligence request.",
          time: "Just now",
          color: "#8b6cf0",
        },
      ],
    },
    304: {
      updatedAt: "Updated 19m ago",
      urgency: "Diligence room updated",
      timeline: "Reference work pending",
      nextAction: "Finish references and tighten the churn discussion.",
      stageContext: "Live diligence room",
      activity: [
        {
          title: "Diligence room updated",
          detail: "Reference tracker and reserve pacing notes were refreshed.",
          time: "19m ago",
          color: C.teal,
        },
      ],
    },
    305: {
      updatedAt: "Updated 44m ago",
      urgency: "IC memo ready",
      timeline: "Committee slot tomorrow",
      nextAction: "Finalize conviction and allocation sizing.",
      stageContext: "Decision-ready",
      activity: [
        {
          title: "IC memo ready for review",
          detail: "The file is ready to move from diligence into committee.",
          time: "44m ago",
          color: "#8b6cf0",
        },
      ],
    },
    306: {
      updatedAt: "Updated 1h ago",
      urgency: "Fund closes in 18 days",
      timeline: "Sizing window open",
      nextAction: "Track final close timing and confirm allocation.",
      stageContext: "Capital deployment workflow",
      activity: [
        {
          title: "Awaiting LP sizing",
          detail: "Only commitment timing and final sizing remain open.",
          time: "1h ago",
          color: C.amber,
        },
      ],
    },
    307: {
      updatedAt: "Updated yesterday",
      urgency: "Commitment confirmed",
      timeline: "Closed and stored",
      nextAction: "Retain the full diligence history as the system of record.",
      stageContext: "Historical commitment record",
      activity: [
        {
          title: "Commitment recorded",
          detail: "Close summary and signed docs preserved in the record.",
          time: "Yesterday",
          color: C.green,
        },
      ],
    },
    308: {
      updatedAt: "Updated 2h ago",
      urgency: "Held below threshold",
      timeline: "Not in main inbox",
      nextAction: "Leave in filtered review until mandate changes.",
      stageContext: "Hidden from the primary feed",
      activity: [
        {
          title: "Threshold filter held",
          detail: "Opportunity stayed out of the main inbox by design.",
          time: "2h ago",
          color: C.textMuted,
        },
      ],
    },
    309: {
      updatedAt: "Reviewed yesterday",
      urgency: "Archived",
      timeline: "No next action",
      nextAction: "Archive retained for reference only.",
      stageContext: "Reviewed out quickly",
      activity: [
        {
          title: "Opportunity passed",
          detail: "Outside the mandate after review.",
          time: "Yesterday",
          color: C.red,
        },
      ],
    },
  };

  return (
    meta[item.id] || {
      updatedAt: "Updated recently",
      urgency: "Allocator review active",
      timeline: "Workflow active",
      nextAction: "Continue allocator review.",
      stageContext: "Active workflow item",
      activity: [],
    }
  );
}

function buildLpDemoItems() {
  return [
    {
      id: 301,
      alias: "Anonymous GP 01",
      name: "North Peak Growth Fund I",
      strategy: "Growth Equity",
      geography: "US",
      vintage: "2026",
      fitScore: 92,
      stage: "New",
      revealed: false,
      checkSize: "$5M-$10M",
      targetFund: "$180M",
      raisedPct: "43%",
      trackRecord: "2.6x / 19% net",
      team: "4 investment professionals",
      allocationM: 8,
      why:
        "Strong overlap with your software-heavy growth sleeve and current $5M-$10M pacing window.",
      aiSummary:
        "Rare combination of clean attribution, disciplined sector focus, and a fund size that fits the current deployment plan.",
      portfolioFit:
        "Matches the current growth allocation gap without crowding existing healthcare exposure.",
      strengths: [
        "Clear partner-level attribution across three realized winners",
        "Fund size fits current pacing plan",
        "Reference package is already prepared",
      ],
      risks: [
        "Need deeper customer concentration detail",
        "One platform investment still early in hold period",
      ],
      signals: [
        { label: "Actively deploying", color: C.green },
        { label: "First close in 5 weeks", color: C.amber },
        { label: "References ready", color: C.teal },
      ],
      breakdown: [
        { label: "Strategy", score: 30, max: 30, detail: "Exact match" },
        {
          label: "Check size",
          score: 24,
          max: 25,
          detail: "Within preferred ticket band",
        },
        { label: "Geography", score: 15, max: 15, detail: "North America" },
        {
          label: "Portfolio fit",
          score: 23,
          max: 30,
          detail: "Complements current growth exposure",
        },
      ],
      docPreview: ["Deck v4", "Track record schedule", "Data room index"],
      requestPrompts: [
        "Provide partner-level deal attribution",
        "Clarify current pipeline concentration",
        "Expand on top two realized exits",
      ],
    },
    {
      id: 302,
      alias: "Anonymous GP 02",
      name: "Stillwater Buyout Partners I",
      strategy: "Buyout",
      geography: "US",
      vintage: "2026",
      fitScore: 87,
      stage: "Reviewing",
      revealed: false,
      checkSize: "$4M-$8M",
      targetFund: "$240M",
      raisedPct: "58%",
      trackRecord: "2.2x / 17% net",
      team: "5 investment professionals",
      allocationM: 6,
      why:
        "Compelling lower-middle-market fit with clean industrial services exposure and a disciplined fund size.",
      aiSummary:
        "This looks like a high-conviction allocator candidate if references and sourcing repeatability hold up under review.",
      portfolioFit:
        "Fits the emerging-manager buyout lane without stretching the current pacing plan.",
      strengths: [
        "Consistent industrial services pattern recognition",
        "Fund terms inside current mandate preferences",
      ],
      risks: [
        "Need reference depth beyond current LP base",
        "Operating partner bench still thin",
      ],
      signals: [
        { label: "High fit", color: C.green },
        { label: "Track record audited", color: C.teal },
        { label: "Closing Q4", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 28, max: 30, detail: "Buyout lane fit" },
        {
          label: "Check size",
          score: 22,
          max: 25,
          detail: "Comfortably inside pacing",
        },
        { label: "Geography", score: 15, max: 15, detail: "US-focused" },
        {
          label: "Portfolio fit",
          score: 22,
          max: 30,
          detail: "Adds industrials balance",
        },
      ],
      docPreview: ["One-page summary", "Terms sheet", "Reference list"],
      requestPrompts: [
        "Detail sourcing repeatability by partner",
        "Expand on operating partner contribution",
        "Clarify reserve strategy",
      ],
    },
    {
      id: 303,
      alias: "Anonymous GP 03",
      name: "Meridian Healthcare Opportunities II",
      strategy: "Growth Equity",
      geography: "US",
      vintage: "2026",
      fitScore: 81,
      stage: "More Info Requested",
      revealed: false,
      checkSize: "$5M-$7M",
      targetFund: "$210M",
      raisedPct: "51%",
      trackRecord: "2.1x / 15% net",
      team: "4 investment professionals",
      allocationM: 5,
      why:
        "Healthcare software focus fits mandate, but attribution detail is still too thin for diligence.",
      aiSummary:
        "The opportunity is credible, but conviction depends on how cleanly the team can explain who drove the top outcomes.",
      portfolioFit:
        "Would deepen healthcare growth exposure, so underwriting discipline matters more here.",
      strengths: [
        "Good fund size fit",
        "Pipeline appears active ahead of close",
      ],
      risks: [
        "Attribution still blurred between partners",
        "Pipeline quality needs more detail",
      ],
      signals: [
        { label: "Response received", color: C.teal },
        { label: "Still anonymous", color: C.accent },
        { label: "Needs attribution detail", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 28, max: 30, detail: "Healthcare growth" },
        { label: "Check size", score: 23, max: 25, detail: "Right ticket size" },
        { label: "Geography", score: 15, max: 15, detail: "US-focused" },
        {
          label: "Portfolio fit",
          score: 15,
          max: 30,
          detail: "Needs more underwriting confidence",
        },
      ],
      docPreview: ["Updated DDQ", "Attribution appendix", "Pipeline note"],
      latestResponse:
        "GP uploaded an attribution appendix and clarified that two top pipeline deals are already under exclusivity.",
      requestPrompts: [
        "Provide partner-level deal attribution",
        "Clarify current pipeline quality and timing",
        "Expand on realized exit ownership",
      ],
    },
    {
      id: 304,
      alias: "Anonymous GP 04",
      name: "Harbor Vertical Software Fund I",
      strategy: "Growth Equity",
      geography: "US",
      vintage: "2026",
      fitScore: 78,
      stage: "In Diligence",
      revealed: true,
      checkSize: "$4M-$6M",
      targetFund: "$165M",
      raisedPct: "64%",
      trackRecord: "2.4x / 18% net",
      team: "4 investment professionals",
      allocationM: 5,
      why:
        "High-quality vertical software angle with good pacing fit and a live document set already in diligence.",
      aiSummary:
        "This is far enough along that the main question is reference quality and whether the IC memo lands cleanly.",
      portfolioFit:
        "Adds software concentration but does so in a sub-sector the portfolio currently lacks.",
      strengths: [
        "Clean data room",
        "Strong partner references already in motion",
      ],
      risks: ["Need clearer churn story in one legacy asset"],
      signals: [
        { label: "Diligence open", color: C.teal },
        { label: "Docs complete", color: C.green },
        { label: "Reference pending", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 29, max: 30, detail: "Strong growth fit" },
        { label: "Check size", score: 21, max: 25, detail: "Inside mandate" },
        { label: "Geography", score: 15, max: 15, detail: "North America" },
        {
          label: "Portfolio fit",
          score: 13,
          max: 30,
          detail: "Concentration risk manageable",
        },
      ],
      docPreview: ["Deck", "Q2 portfolio update", "Data room"],
      requestPrompts: [
        "Clarify customer churn exposure",
        "Expand on reserve pacing assumptions",
      ],
    },
    {
      id: 305,
      alias: "Anonymous GP 05",
      name: "Summit Industrial Partners I",
      strategy: "Buyout",
      geography: "US",
      vintage: "2025",
      fitScore: 84,
      stage: "IC Pending",
      revealed: true,
      checkSize: "$6M-$8M",
      targetFund: "$230M",
      raisedPct: "82%",
      trackRecord: "2.3x / 17% net",
      team: "5 investment professionals",
      allocationM: 7,
      why:
        "Fits the industrial services lane well enough that the decision is now an IC-quality judgment, not a sourcing question.",
      aiSummary:
        "The memo is close to decision-ready. Remaining work is mostly internal conviction and allocation sizing.",
      portfolioFit:
        "Good portfolio counterweight to software-heavy exposure with limited overlap.",
      strengths: [
        "Very clean strategy definition",
        "Attribution and reference package already in hand",
      ],
      risks: ["Need final comfort on concentration in two platform sectors"],
      signals: [
        { label: "IC next", color: "#8b6cf0" },
        { label: "Reference calls complete", color: C.green },
        { label: "Sizing decision needed", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 30, max: 30, detail: "Exact buyout fit" },
        { label: "Check size", score: 23, max: 25, detail: "Slightly above base" },
        { label: "Geography", score: 15, max: 15, detail: "US-focused" },
        {
          label: "Portfolio fit",
          score: 16,
          max: 30,
          detail: "Good diversification angle",
        },
      ],
      docPreview: ["IC packet", "Reference summary", "Terms mark-up"],
      requestPrompts: [
        "Confirm concentration limits by platform",
        "Share final reserve pacing model",
      ],
    },
    {
      id: 306,
      alias: "Anonymous GP 06",
      name: "Ridgeview Capital Partners II",
      strategy: "Buyout",
      geography: "US",
      vintage: "2025",
      fitScore: 76,
      stage: "Soft Circled",
      revealed: true,
      checkSize: "$5M-$6M",
      targetFund: "$250M",
      raisedPct: "90%",
      trackRecord: "2.0x / 16% net",
      team: "6 investment professionals",
      allocationM: 5,
      why:
        "Already past underwriting. The remaining workflow is sizing, timing, and closing discipline.",
      aiSummary:
        "This is now a capital deployment workflow more than a sourcing workflow.",
      portfolioFit:
        "Well within pacing, with modest overlap against existing industrial exposure.",
      strengths: ["Process already through most diligence gates"],
      risks: ["Need closing calendar clarity"],
      signals: [
        { label: "Soft circled", color: C.green },
        { label: "Closing soon", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 27, max: 30, detail: "Strong fit" },
        { label: "Check size", score: 24, max: 25, detail: "Ideal sizing" },
        { label: "Geography", score: 15, max: 15, detail: "US" },
        {
          label: "Portfolio fit",
          score: 10,
          max: 30,
          detail: "Known portfolio overlap",
        },
      ],
      docPreview: ["Closing checklist", "Allocation model", "Reference packet"],
      requestPrompts: ["Confirm final close timing", "Share updated allocation grid"],
    },
    {
      id: 307,
      alias: "Anonymous GP 07",
      name: "Granite Lower Middle Market II",
      strategy: "Buyout",
      geography: "US",
      vintage: "2025",
      fitScore: 82,
      stage: "Committed",
      revealed: true,
      checkSize: "$4M-$5M",
      targetFund: "$160M",
      raisedPct: "100%",
      trackRecord: "2.5x / 18% net",
      team: "4 investment professionals",
      allocationM: 4,
      why:
        "A good example of what the workflow looks like after MandateOS carries a manager all the way to commitment.",
      aiSummary:
        "This record demonstrates why the system becomes sticky once diligence, memo history, and commitment flow live in one place.",
      portfolioFit: "Already allocated; now living inside the system of record.",
      strengths: ["Committed and closed", "Full diligence history preserved"],
      risks: ["None material at this stage"],
      signals: [
        { label: "Committed", color: C.green },
        { label: "History preserved", color: C.teal },
      ],
      breakdown: [
        { label: "Strategy", score: 28, max: 30, detail: "Strong fit" },
        { label: "Check size", score: 24, max: 25, detail: "Ideal" },
        { label: "Geography", score: 15, max: 15, detail: "US" },
        {
          label: "Portfolio fit",
          score: 15,
          max: 30,
          detail: "Already approved",
        },
      ],
      docPreview: ["Final IC memo", "Signed docs", "Close summary"],
      requestPrompts: [],
    },
    {
      id: 308,
      alias: "Anonymous GP 08",
      name: "Blue Coast Venture III",
      strategy: "Venture Capital",
      geography: "US",
      vintage: "2026",
      fitScore: 66,
      stage: "New",
      revealed: false,
      checkSize: "$3M-$5M",
      targetFund: "$225M",
      raisedPct: "34%",
      trackRecord: "1.9x / 12% net",
      team: "4 investment professionals",
      allocationM: 4,
      why:
        "Interesting manager but below the main inbox threshold, so it sits in Other Requests until someone wants to dig.",
      aiSummary:
        "This is deliberately not primary inbox material. It shows how the filter protects the LP from noise.",
      portfolioFit:
        "Outside the core mandate, though not an automatic rejection.",
      strengths: ["Some referenceable exits"],
      risks: ["Outside primary strategy", "Lower conviction"],
      signals: [
        { label: "Other requests", color: C.textMuted },
        { label: "Below threshold", color: C.amber },
      ],
      breakdown: [
        { label: "Strategy", score: 12, max: 30, detail: "Outside primary lane" },
        { label: "Check size", score: 22, max: 25, detail: "Ticket works" },
        { label: "Geography", score: 15, max: 15, detail: "US" },
        {
          label: "Portfolio fit",
          score: 17,
          max: 30,
          detail: "Interesting but lower priority",
        },
      ],
      docPreview: ["Deck", "Brief note"],
      requestPrompts: ["Clarify mandate fit against current LP preferences"],
    },
    {
      id: 309,
      alias: "Anonymous GP 09",
      name: "Atlas Generalist Opportunities I",
      strategy: "Generalist",
      geography: "Global",
      vintage: "2026",
      fitScore: 71,
      stage: "Passed",
      revealed: false,
      checkSize: "$4M-$6M",
      targetFund: "$300M",
      raisedPct: "29%",
      trackRecord: "1.7x / 10% net",
      team: "3 investment professionals",
      allocationM: 0,
      why: "Reviewed and declined because the strategy is too broad for the current mandate.",
      aiSummary: "Good example of how low-conviction items exit the workflow quickly.",
      portfolioFit: "Outside current focus.",
      strengths: ["Some global exposure"],
      risks: ["Strategy drift", "Weak mandate fit"],
      signals: [{ label: "Passed", color: C.red }],
      breakdown: [
        { label: "Strategy", score: 10, max: 30, detail: "Too broad" },
        { label: "Check size", score: 20, max: 25, detail: "Ticket fits" },
        { label: "Geography", score: 8, max: 15, detail: "Global vs US bias" },
        {
          label: "Portfolio fit",
          score: 33,
          max: 30,
          detail: "Low conviction after review",
        },
      ],
      docPreview: ["Archive note"],
      requestPrompts: [],
    },
  ];
}

function buildLpDemoActivity() {
  return [
    {
      id: 1,
      title: "GP responded to diligence request",
      detail: "Meridian Healthcare uploaded attribution detail and clarified its current pipeline.",
      time: "8m ago",
      color: C.teal,
    },
    {
      id: 2,
      title: "New 92% match submitted",
      detail: "North Peak Growth Fund I entered the inbox above the acceptance threshold.",
      time: "24m ago",
      color: C.green,
    },
    {
      id: 3,
      title: "Fund closing soon",
      detail: "Ridgeview Capital Partners II is targeting final sizing within 3 weeks.",
      time: "1h ago",
      color: C.amber,
    },
    {
      id: 4,
      title: "IC decision pending",
      detail: "Summit Industrial Partners I is queued for the next committee discussion.",
      time: "Today",
      color: "#8b6cf0",
    },
  ];
}

function buildLpDemoNotifications() {
  return [
    {
      id: 1,
      label: "New high-fit opportunity",
      detail: "North Peak Growth Fund I scored 92 and entered the primary inbox.",
      color: C.green,
    },
    {
      id: 2,
      label: "GP responded",
      detail: "Meridian Healthcare answered the latest pre-diligence request.",
      color: C.teal,
    },
    {
      id: 3,
      label: "IC decision pending",
      detail: "Summit Industrial is ready for committee review.",
      color: "#8b6cf0",
    },
  ];
}

function buildLpDemoRoom(item, overrides = {}) {
  const meta = getLpDemoItemMeta(item);
  return {
    documents: [
      {
        name: "Core fund materials",
        meta: "Deck · DDQ · team overview",
        status: "3 live files",
        updatedAt: meta.updatedAt,
        group: "Primary documents",
      },
      {
        name: "Performance + attribution",
        meta: "Track record schedule · attribution appendix",
        status: "2 structured files",
        updatedAt: "Updated today",
        group: "Underwriting support",
      },
      {
        name: "Terms + execution",
        meta: "Fund terms · closing schedule",
        status: item.stage === "Committed" ? "Closed" : "Open",
        updatedAt: "Updated yesterday",
        group: "Execution",
      },
    ],
    checklist: {
      "Track record reviewed": item.stage !== "In Diligence",
      "Team references queued": item.stage === "IC Pending" || item.stage === "Soft Circled" || item.stage === "Committed",
      "Data room indexed": true,
      "Terms reviewed": item.stage === "IC Pending" || item.stage === "Soft Circled" || item.stage === "Committed",
      "IC memo drafted": item.stage === "IC Pending" || item.stage === "Soft Circled" || item.stage === "Committed",
    },
    qna: [
      {
        from: "LP",
        text: "Please clarify partner-level attribution and current reserve pacing.",
        time: "Today 9:12",
      },
      {
        from: "GP",
        text: "Updated attribution appendix is now in the data room. Reserve pacing model added to the DDQ.",
        time: "Today 11:04",
      },
    ],
    activity: [
      {
        title: meta.stageContext,
        detail: meta.nextAction,
        time: meta.updatedAt,
        color: getLpDemoStageColor(item.stage),
      },
      {
        title: "Shared workspace active",
        detail: "Documents, Q&A, and internal diligence notes are now attached to the same record.",
        time: "Today",
        color: C.teal,
      },
    ],
    internalNote:
      item.stage === "Committed"
        ? "Commitment completed. Keep the full diligence record here so the system retains history."
        : "This is a live LP-only note area. Capture concerns, strengths, and owner commentary without leaving the workflow.",
    memo:
      `${item.name} is a ${item.strategy.toLowerCase()} opportunity with a ${item.fitScore}% fit score.\n\n` +
      `Why now: ${item.why}\n\n` +
      `Key positives:\n- ${item.strengths[0] || "Strong mandate fit"}\n- ${item.strengths[1] || "Data room is organized"}\n\n` +
      `Open questions:\n- ${item.risks[0] || "Need deeper diligence"}\n` +
      `- ${item.risks[1] || "Need final committee conviction"}\n\n` +
      `Recommendation: ${item.stage === "Committed" ? "Track post-close reporting." : "Continue underwriting toward an IC-ready decision."}`,
    compare: [
      "Compared with similar funds: above-median attribution clarity",
      "Portfolio overlap: moderate",
      "Pacing fit: aligned with current deployment window",
    ],
    nextStep:
      item.stage === "IC Pending"
        ? "Finalize committee memo and confirm allocation sizing."
        : item.stage === "Soft Circled"
        ? "Track closing timeline and final allocation."
        : item.stage === "Committed"
        ? "Monitor closing and reporting cadence."
        : "Close remaining diligence questions and prepare for IC.",
    ...overrides,
  };
}

function buildLpDemoRooms(items) {
  const itemById = Object.fromEntries(items.map((item) => [item.id, item]));
  return {
    303: buildLpDemoRoom(itemById[303], {
      qna: [
        {
          from: "LP",
          text: "Provide deal attribution and expand on current pipeline quality.",
          time: "Today 8:42",
        },
        {
          from: "GP",
          text: "Attribution appendix uploaded. Two top deals are already under exclusivity with clear partner ownership.",
          time: "Today 9:58",
        },
      ],
      nextStep: "Decide whether the new attribution detail is strong enough to unlock diligence.",
    }),
    304: buildLpDemoRoom(itemById[304], {
      documents: [
        {
          name: "Core fund materials",
          meta: "Deck · DDQ · team memo",
          status: "3 live files",
          updatedAt: "Updated 19m ago",
          group: "Primary documents",
        },
        {
          name: "Data room",
          meta: "17 files indexed",
          status: "Live",
          updatedAt: "Updated today",
          group: "Underwriting support",
        },
        {
          name: "Reference tracker",
          meta: "1 outstanding reference",
          status: "Pending",
          updatedAt: "Updated 34m ago",
          group: "Execution",
        },
      ],
      activity: [
        {
          title: "Diligence room updated",
          detail: "Reference tracker refreshed and data room fully indexed.",
          time: "19m ago",
          color: C.teal,
        },
        {
          title: "Awaiting LP review",
          detail: "One open reference and a churn discussion remain before IC.",
          time: "Today",
          color: C.amber,
        },
      ],
      nextStep: "Finish reference work and tighten the churn discussion before IC.",
    }),
    305: buildLpDemoRoom(itemById[305], {
      checklist: {
        "Track record reviewed": true,
        "Team references queued": true,
        "Data room indexed": true,
        "Terms reviewed": true,
        "IC memo drafted": true,
      },
      activity: [
        {
          title: "IC memo ready",
          detail: "The diligence file is ready for formal committee review.",
          time: "44m ago",
          color: "#8b6cf0",
        },
      ],
      nextStep: "Bring to committee and finalize allocation sizing.",
    }),
    306: buildLpDemoRoom(itemById[306], {
      checklist: {
        "Track record reviewed": true,
        "Team references queued": true,
        "Data room indexed": true,
        "Terms reviewed": true,
        "IC memo drafted": true,
      },
      activity: [
        {
          title: "Soft circle recorded",
          detail: "Sizing and timing are the final open items.",
          time: "1h ago",
          color: C.green,
        },
      ],
      nextStep: "Track soft-circle status and close timing.",
    }),
    307: buildLpDemoRoom(itemById[307], {
      documents: [
        {
          name: "Final IC memo",
          meta: "Signed off and stored",
          status: "Closed",
          updatedAt: "Yesterday",
          group: "Primary documents",
        },
        {
          name: "Commitment letter",
          meta: "Executed commitment documents",
          status: "Closed",
          updatedAt: "Yesterday",
          group: "Execution",
        },
        {
          name: "Close summary",
          meta: "Stored with final allocation record",
          status: "Closed",
          updatedAt: "Yesterday",
          group: "History",
        },
      ],
      qna: [
        {
          from: "LP",
          text: "Commitment confirmed. Keep reporting and close docs here for continuity.",
          time: "Yesterday",
        },
      ],
      activity: [
        {
          title: "Commitment confirmed",
          detail: "Executed docs and close summary preserved in the record.",
          time: "Yesterday",
          color: C.green,
        },
      ],
      nextStep: "No open work. This is retained history and close tracking.",
    }),
  };
}

function buildLpDemoRequestDrafts(items) {
  return items.reduce((acc, item) => {
    acc[item.id] = {
      prompts: item.requestPrompts || [],
      note:
        item.id === 303
          ? "Need cleaner attribution before deciding whether to reveal identity."
          : "",
    };
    return acc;
  }, {});
}

function LPDemoMetricCard({ label, value, sub, color = C.accent }) {
  return (
    <div
      style={{
        padding: "14px 15px 15px",
        borderRadius: 14,
        background: `linear-gradient(180deg, ${C.raised}, ${C.card})`,
        border: `1px solid ${C.border}`,
        boxShadow: `0 16px 32px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.04)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 auto auto 0",
          width: 52,
          height: 2,
          background: color,
          boxShadow: `0 0 18px ${color}60`,
        }}
      />
      <div
        style={{
          fontSize: 10.5,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.7,
          fontWeight: 760,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <Mono size={22} weight={800} color={color}>
        {value}
      </Mono>
      {sub && (
        <div style={{ fontSize: 11.5, color: C.textSoft, marginTop: 7, lineHeight: 1.45 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function LPDemoSignal({ signal }) {
  return (
    <div
      style={{
        padding: "5px 8px",
        borderRadius: 999,
        border: `1px solid ${signal.color}35`,
        background: `${signal.color}14`,
        color: signal.color,
        fontSize: 10.5,
        fontWeight: 720,
        letterSpacing: 0.3,
        lineHeight: 1.1,
      }}
    >
      {signal.label}
    </div>
  );
}

function LPDemoQueueButton({ label, count, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 11px",
        borderRadius: 12,
        border: `1px solid ${active ? C.accent + "55" : C.borderSubtle}`,
        background: active ? `linear-gradient(135deg, ${C.accentGhost}, ${C.accentWash}66)` : C.bg,
        color: active ? C.text : C.textSoft,
        fontSize: 12.5,
        fontWeight: active ? 700 : 620,
        cursor: "pointer",
        display: "grid",
        gap: 4,
        boxShadow: active ? `0 12px 26px rgba(0,0,0,.18)` : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <span>{label}</span>
        <Mono size={11} weight={800} color={active ? C.accentBright : C.textMuted}>
          {count}
        </Mono>
      </div>
      {desc && (
        <span style={{ fontSize: 10.5, color: active ? C.textSoft : C.textMuted }}>
          {desc}
        </span>
      )}
    </button>
  );
}

function LPDemoInboxCard({
  item,
  selected,
  onSelect,
  onPass,
  onRequestInfo,
  onOpenDiligence,
}) {
  const name = item.revealed ? item.name : item.alias;
  const stageColor = getLpDemoStageColor(item.stage);
  const meta = getLpDemoItemMeta(item);
  const fitBreakdown = item.breakdown
    .slice(0, 3)
    .map((row) => `${row.label} ${row.score}/${row.max}`)
    .join(" · ");
  return (
    <div
      onClick={onSelect}
      style={{
        padding: 16,
        borderRadius: 18,
        background: selected
          ? `linear-gradient(180deg, ${C.surface}, ${C.card})`
          : `linear-gradient(180deg, ${C.card}, ${C.cardHover})`,
        border: `1px solid ${selected ? C.accent + "55" : C.border}`,
        boxShadow: selected
          ? `0 24px 46px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04), inset 0 0 0 1px ${C.accent}08`
          : `0 12px 24px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.025)`,
        cursor: "pointer",
        transition: "transform .18s ease, border-color .18s ease, box-shadow .18s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "82px 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div
          style={{
            padding: "14px 8px 12px",
            borderRadius: 16,
            border: `1px solid ${stageColor}44`,
            background: `linear-gradient(180deg, ${stageColor}16, ${stageColor}08)`,
            textAlign: "center",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.05)`,
          }}
        >
          <Mono size={26} weight={800} color={stageColor}>
            {item.fitScore}%
          </Mono>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              color: C.textMuted,
              marginTop: 4,
            }}
          >
            fit
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 3,
                }}
              >
                <div style={{ fontWeight: 760, fontSize: 14.5 }}>{name}</div>
                <span style={{ fontSize: 10.5, color: C.textMuted }}>{meta.updatedAt}</span>
              </div>
              <div style={{ fontSize: 11.5, color: C.textMuted }}>
                {item.strategy} · {item.geography} · Vintage {item.vintage} · {item.checkSize}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: stageColor,
                  marginTop: 6,
                  fontWeight: 680,
                }}
              >
                {meta.stageContext}
              </div>
            </div>
            <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
              <Pill color={stageColor} size="xs">
                {item.stage}
              </Pill>
              <div
                style={{
                  fontSize: 10.5,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.7,
                }}
              >
                {meta.timeline}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                padding: "6px 8px",
                borderRadius: 999,
                background: `${stageColor}12`,
                border: `1px solid ${stageColor}2e`,
                color: stageColor,
                fontSize: 10.5,
                fontWeight: 760,
              }}
            >
              {meta.urgency}
            </div>
            <div
              style={{
                padding: "6px 8px",
                borderRadius: 999,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
                color: C.textMuted,
                fontSize: 10.5,
                fontWeight: 720,
              }}
            >
              {fitBreakdown}
            </div>
          </div>

          <div
            style={{
              padding: "11px 12px",
              borderRadius: 14,
              background: `${C.black}66`,
              border: `1px solid ${selected ? C.accent + "22" : C.borderSubtle}`,
              marginBottom: 10,
              boxShadow: selected ? `inset 0 1px 0 rgba(255,255,255,.03)` : "none",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 760,
                color: C.textMuted,
                letterSpacing: 0.7,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Why This Matters
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>
              {item.why}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {[
              ["Check", item.checkSize],
              ["Target", item.targetFund],
              ["Raised", item.raisedPct],
              ["Track", item.trackRecord],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "8px 9px",
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
                    letterSpacing: 0.6,
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {item.signals.map((signal) => (
              <LPDemoSignal key={signal.label} signal={signal} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.55 }}>
              <strong style={{ color: C.text }}>Next action:</strong> {meta.nextAction}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn
                variant="ghost"
                size="sm"
                style={{ color: C.red }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPass();
                }}
              >
                Pass [P]
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestInfo();
                }}
              >
                More Info [R]
              </Btn>
              <Btn
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDiligence();
                }}
              >
                Open Diligence [Enter]
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LPDemoContextPanel({
  item,
  draft,
  composerOpen,
  setDraft,
  onSendRequest,
  onOpenDiligence,
}) {
  if (!item) {
    return (
      <EmptyState
        icon="[]"
        title="No active selection"
        body="Choose an opportunity from the inbox to see score detail, docs preview, and the next best action."
      />
    );
  }

  const roomPreview = draft || { prompts: [], note: "" };
  const stageColor = getLpDemoStageColor(item.stage);
  const meta = getLpDemoItemMeta(item);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card
        style={{
          background: `linear-gradient(180deg, ${C.surface}, ${C.card})`,
          border: `1px solid ${stageColor}26`,
          boxShadow: `0 18px 34px rgba(0,0,0,.22)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 760, fontSize: 15.5 }}>
              {item.revealed ? item.name : item.alias}
            </div>
            <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>
              {item.strategy} · {item.geography} · {item.targetFund}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color={stageColor} size="xs">
              {item.stage}
            </Pill>
            <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 5 }}>
              {meta.updatedAt}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "9px 10px",
            borderRadius: 11,
            background: `${stageColor}10`,
            border: `1px solid ${stageColor}24`,
            marginBottom: 10,
            fontSize: 12.5,
            color: C.textSoft,
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: stageColor }}>{meta.urgency}:</strong> {meta.nextAction}
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {item.breakdown.map((row) => (
            <div
              key={row.label}
              style={{
                padding: "9px 10px",
                borderRadius: 11,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 650 }}>{row.label}</span>
                <Mono size={11} weight={800} color={stageColor}>
                  {row.score}/{row.max}
                </Mono>
              </div>
              <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 4 }}>
                {row.detail}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 720, fontSize: 13.5 }}>Document Preview</div>
          <div style={{ fontSize: 10.5, color: C.textMuted }}>{meta.timeline}</div>
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          {item.docPreview.map((doc) => (
            <div
              key={doc}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: C.bg,
                border: `1px solid ${C.borderSubtle}`,
                fontSize: 12.5,
                color: C.textSoft,
              }}
            >
              {doc}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
          <strong style={{ color: C.text }}>AI summary:</strong> {item.aiSummary}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
          Key Positives + Risks
        </div>
        <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6, marginBottom: 10 }}>
          <strong style={{ color: C.text }}>Portfolio fit:</strong> {item.portfolioFit}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <div
              style={{
                fontSize: 10.5,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                marginBottom: 4,
              }}
            >
              Positives
            </div>
            <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
              {item.strengths.join(" · ")}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10.5,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                marginBottom: 4,
              }}
            >
              Risks
            </div>
            <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
              {item.risks.join(" · ")}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
          Activity History
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {meta.activity.map((entry, index) => (
            <div
              key={`${entry.title}-${index}`}
              style={{
                padding: "9px 10px",
                borderRadius: 10,
                background: `${entry.color}10`,
                border: `1px solid ${entry.color}22`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 4,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 680 }}>{entry.title}</span>
                <span style={{ fontSize: 10.5, color: C.textMuted }}>{entry.time}</span>
              </div>
              <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                {entry.detail}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
          Request More Info
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          {roomPreview.prompts.map((prompt, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: `${C.black}60`,
                border: `1px solid ${C.borderSubtle}`,
                fontSize: 12.5,
                color: C.textSoft,
              }}
            >
              {prompt}
            </div>
          ))}
        </div>
        <textarea
          value={roomPreview.note}
          onChange={(e) => setDraft({ ...roomPreview, note: e.target.value })}
          placeholder="Add LP-only note before sending a structured request..."
          style={{
            width: "100%",
            minHeight: 78,
            resize: "none",
            padding: "10px 12px",
            borderRadius: 10,
            border: `1px solid ${composerOpen ? C.accent + "55" : C.border}`,
            background: C.bg,
            color: C.text,
            fontSize: 13,
            fontFamily: "inherit",
            marginBottom: 10,
          }}
        />
        {item.latestResponse && (
          <div
            style={{
              padding: "10px 11px",
              borderRadius: 10,
              background: C.tealWash,
              border: `1px solid ${C.teal}30`,
              color: C.textSoft,
              fontSize: 12.5,
              lineHeight: 1.55,
              marginBottom: 10,
            }}
          >
            <strong style={{ color: C.teal }}>Latest GP response:</strong>{" "}
            {item.latestResponse}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="secondary" size="sm" onClick={onSendRequest}>
            Send Structured Request
          </Btn>
          <Btn variant="primary" size="sm" onClick={onOpenDiligence}>
            Reveal + Open Diligence
          </Btn>
        </div>
      </Card>
    </div>
  );
}

function LPDemoDiligenceRoom({
  item,
  room,
  onUpdateRoom,
  onMoveStage,
  onOpenIC,
}) {
  if (!item || !room) {
    return (
      <EmptyState
        icon="[]"
        title="No diligence room selected"
        body="Open diligence from the inbox to reveal a GP and create a shared workspace."
      />
    );
  }

  const checklistEntries = Object.entries(room.checklist);
  const done = checklistEntries.filter(([, value]) => value).length;
  const total = checklistEntries.length;
  const stageColor = getLpDemoStageColor(item.stage);
  const meta = getLpDemoItemMeta(item);

  return (
    <div>
      <WorkspaceHeaderTitle
        title={`${item.name} Diligence Workspace`}
        subtitle="Identity is now revealed. Documents, Q&A, notes, and decision work stay in one operating surface."
      />

      <div
        className="lp-demo-diligence-layout"
      >
        <div className="lp-demo-column-stack">
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 720, fontSize: 13.5 }}>Live Data Room</div>
              <div style={{ fontSize: 10.5, color: C.textMuted }}>
                {room.documents.length} repositories
              </div>
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              {room.documents.map((doc) => (
                <div
                  key={doc.name}
                  style={{
                    padding: "10px 11px",
                    borderRadius: 12,
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 680 }}>{doc.name}</div>
                    <Pill
                      color={
                        doc.status === "Closed"
                          ? C.green
                          : doc.status === "Pending"
                          ? C.amber
                          : C.teal
                      }
                      size="xs"
                    >
                      {doc.status}
                    </Pill>
                  </div>
                  <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 4 }}>
                    {doc.group} · {doc.updatedAt}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                    {doc.meta}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: C.textSoft,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: C.text }}>Next step:</strong> {room.nextStep}
            </div>
          </Card>

          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 720, fontSize: 13.5 }}>Diligence Checklist</div>
              <Mono size={12} weight={800} color={done === total ? C.green : C.amber}>
                {done}/{total}
              </Mono>
            </div>
            <div
              style={{
                height: 5,
                borderRadius: 999,
                background: C.borderSubtle,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: `${total ? (done / total) * 100 : 0}%`,
                  height: "100%",
                  background: done === total ? C.green : C.amber,
                }}
              />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {checklistEntries.map(([label, checked]) => (
                <button
                  key={label}
                  onClick={() =>
                    onUpdateRoom({
                      ...room,
                      checklist: {
                        ...room.checklist,
                        [label]: !checked,
                      },
                    })
                  }
                  style={{
                    textAlign: "left",
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: `1px solid ${checked ? C.green + "55" : C.borderSubtle}`,
                    background: checked ? C.greenWash : C.bg,
                    color: checked ? C.text : C.textSoft,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lp-demo-column-stack">
          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
              Fund Overview
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: `linear-gradient(180deg, ${C.surface}, ${C.card})`,
                border: `1px solid ${stageColor}30`,
                boxShadow: `0 18px 32px rgba(0,0,0,.18)`,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 780, fontSize: 19, marginBottom: 4 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>
                    {item.strategy} · {item.geography} · {item.targetFund} · {item.team}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
                  <Pill color={stageColor} size="xs">
                    {item.stage}
                  </Pill>
                  <Mono size={18} weight={800} color={stageColor}>
                    {item.fitScore}% fit
                  </Mono>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {[
                  ["Check Size", item.checkSize],
                  ["Raise Progress", item.raisedPct],
                  ["Track Record", item.trackRecord],
                  ["Timeline", meta.timeline],
                  ["Updated", meta.updatedAt],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: "9px 10px",
                      borderRadius: 10,
                      background: `${C.black}66`,
                      border: `1px solid ${C.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9.5,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
                <strong style={{ color: C.text }}>Decision context:</strong> {item.aiSummary}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
                AI IC Memo Draft
              </div>
              <textarea
                value={room.memo}
                onChange={(e) => onUpdateRoom({ ...room, memo: e.target.value })}
                style={{
                  width: "100%",
                  minHeight: 260,
                  resize: "vertical",
                  padding: "14px 15px",
                  borderRadius: 14,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontSize: 13,
                  lineHeight: 1.72,
                  fontFamily: "inherit",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,.03)`,
                }}
              />
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
              Comparison Context
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              {room.compare.map((entry) => (
                <div
                  key={entry}
                  style={{
                    padding: "10px 11px",
                    borderRadius: 11,
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    fontSize: 12.5,
                    color: C.textSoft,
                  }}
                >
                  {entry}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="primary" size="sm" onClick={() => onMoveStage("IC Pending")}>
                Move to IC Pending
              </Btn>
              <Btn variant="secondary" size="sm" onClick={onOpenIC}>
                Open IC Layer
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => onMoveStage("Soft Circled")}>
                Soft Circle
              </Btn>
            </div>
          </Card>
        </div>

        <div className="lp-demo-column-stack">
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 720, fontSize: 13.5 }}>Status Tracker</div>
              <Pill color={stageColor} size="xs">
                {item.stage}
              </Pill>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                ["Workflow status", item.stage],
                ["Readiness", `${done}/${total} checklist items complete`],
                ["Urgency", meta.urgency],
                ["Timeline", meta.timeline],
                ["Next action", room.nextStep],
              ].map(([label, value]) => (
                <button
                  key={label}
                  style={{
                    textAlign: "left",
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: `1px solid ${C.borderSubtle}`,
                    background: C.bg,
                    color: C.textSoft,
                    fontSize: 12.5,
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      color: C.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <div>{value}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
              Shared Q&A
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
              {room.qna.map((entry, index) => (
                <div
                  key={`${entry.time}-${index}`}
                  style={{
                    padding: "10px 11px",
                    borderRadius: 12,
                    background: entry.from === "LP" ? C.bg : C.tealWash,
                    border: `1px solid ${
                      entry.from === "LP" ? C.borderSubtle : C.teal + "30"
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      marginBottom: 4,
                    }}
                  >
                    {entry.from} · {entry.time}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                    {entry.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
              Internal Activity
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              {(room.activity || []).map((entry, index) => (
                <div
                  key={`${entry.title}-${index}`}
                  style={{
                    padding: "9px 10px",
                    borderRadius: 10,
                    background: `${entry.color}10`,
                    border: `1px solid ${entry.color}24`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 4,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 680 }}>{entry.title}</span>
                    <span style={{ fontSize: 10.5, color: C.textMuted }}>{entry.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                    {entry.detail}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
              LP-Only Commentary
            </div>
            <textarea
              value={room.internalNote}
              onChange={(e) => onUpdateRoom({ ...room, internalNote: e.target.value })}
              style={{
                width: "100%",
                minHeight: 180,
                resize: "vertical",
                padding: "12px 13px",
                borderRadius: 12,
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function LPDemoPipelineBoard({ items, onOpenItem, onAdvanceStage }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 6 }}>
      <div style={{ display: "flex", gap: 12, minWidth: 1240 }}>
        {LP_DEMO_PIPELINE_STAGES.map((stage) => {
          const stageItems = items.filter((item) => item.stage === stage);
          const stageColor = getLpDemoStageColor(stage);
          return (
            <div
              key={stage}
              style={{
                width: 240,
                flexShrink: 0,
                borderRadius: 16,
                background:
                  stage === "IC Pending" || stage === "Soft Circled"
                    ? `linear-gradient(180deg, ${stageColor}10, ${C.card})`
                    : C.card,
                border: `1px solid ${
                  stage === "IC Pending" || stage === "Soft Circled"
                    ? stageColor + "30"
                    : C.border
                }`,
                padding: 12,
                boxShadow:
                  stage === "IC Pending" || stage === "Soft Circled"
                    ? `0 18px 28px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.03)`
                    : `0 12px 22px rgba(0,0,0,.10)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 720, fontSize: 13.5 }}>{stage}</span>
                <Pill color={stageColor} size="xs">
                  {stageItems.length}
                </Pill>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: C.textMuted,
                  lineHeight: 1.5,
                  marginBottom: 10,
                  minHeight: 50,
                }}
              >
                {getLpDemoStageDescription(stage)}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {stageItems.length === 0 && (
                  <div
                    style={{
                      padding: "14px 10px",
                      borderRadius: 10,
                      border: `1px dashed ${C.borderSubtle}`,
                      color: C.textMuted,
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    No items
                  </div>
                )}
                {stageItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px 11px",
                      borderRadius: 12,
                      background: C.bg,
                      border: `1px solid ${C.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontWeight: 680, fontSize: 12.5 }}>
                        {item.revealed ? item.name : item.alias}
                      </div>
                      <Mono size={11} weight={800} color={stageColor}>
                        {item.fitScore}%
                      </Mono>
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 6 }}>
                      {item.strategy} · {getLpDemoItemMeta(item).timeline}
                    </div>
                    <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.55, marginBottom: 8 }}>
                      {getLpDemoItemMeta(item).nextAction}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Btn variant="secondary" size="sm" onClick={() => onOpenItem(item)}>
                        Open
                      </Btn>
                      {stage !== "Committed" && stage !== "Passed" && (
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => onAdvanceStage(item)}
                        >
                          Advance
                        </Btn>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LPDemoICLayer({
  items,
  rooms,
  activeId,
  onSelect,
  onUpdateRoom,
  onMoveStage,
}) {
  const icItems = items.filter((item) =>
    ["IC Pending", "Soft Circled", "Committed"].includes(item.stage)
  );
  const activeItem = icItems.find((item) => item.id === activeId) || icItems[0] || null;
  const activeRoom = activeItem ? rooms[activeItem.id] : null;
  const stageColor = activeItem ? getLpDemoStageColor(activeItem.stage) : C.accent;
  const meta = activeItem ? getLpDemoItemMeta(activeItem) : null;

  if (!activeItem || !activeRoom) {
    return (
      <EmptyState
        icon="[]"
        title="No IC-ready items"
        body="Advance a diligence file into IC Pending to populate the decision layer."
      />
    );
  }

  return (
    <div>
      <WorkspaceHeaderTitle
        title="IC Layer"
        subtitle="This is the decision infrastructure: editable memo, comparison context, and the path from underwriting to commitment."
      />

      <div className="lp-demo-diligence-layout">
        <Card>
          <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
            IC Queue
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {icItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                style={{
                  textAlign: "left",
                  padding: "10px 11px",
                  borderRadius: 12,
                  border: `1px solid ${
                    activeItem.id === item.id ? C.accent + "55" : C.borderSubtle
                  }`,
                  background:
                    activeItem.id === item.id
                      ? `linear-gradient(135deg, ${C.accentGhost}, ${C.accentWash}70)`
                      : C.bg,
                  color: C.text,
                  cursor: "pointer",
                  boxShadow: activeItem.id === item.id ? `0 14px 24px rgba(0,0,0,.16)` : "none",
                }}
              >
                <div style={{ fontWeight: 680, fontSize: 12.5, marginBottom: 4 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 6 }}>
                  {item.stage} · {item.fitScore}% fit
                </div>
                <div style={{ fontSize: 12, color: C.textSoft }}>{item.why}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 760, fontSize: 16 }}>{activeItem.name}</div>
              <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>
                {activeItem.strategy} · {activeItem.targetFund} · allocation target ${activeItem.allocationM}M
              </div>
            </div>
            <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
              <Pill color={stageColor} size="xs">
                {activeItem.stage}
              </Pill>
              <Mono size={14} weight={800} color={stageColor}>
                {activeItem.fitScore}% fit
              </Mono>
            </div>
          </div>

          <div
            style={{
              padding: "10px 11px",
              borderRadius: 11,
              background: `${stageColor}10`,
              border: `1px solid ${stageColor}24`,
              fontSize: 12.5,
              color: C.textSoft,
              lineHeight: 1.55,
              marginBottom: 10,
            }}
          >
            <strong style={{ color: stageColor }}>{meta?.urgency}:</strong> {meta?.nextAction}
          </div>

          <textarea
            value={activeRoom.memo}
            onChange={(e) => onUpdateRoom(activeItem.id, { ...activeRoom, memo: e.target.value })}
            style={{
              width: "100%",
              minHeight: 320,
              resize: "vertical",
              padding: "14px 15px",
              borderRadius: 14,
              background: C.bg,
              border: `1px solid ${C.border}`,
              color: C.text,
              fontSize: 13,
              lineHeight: 1.72,
              fontFamily: "inherit",
              marginBottom: 10,
            }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="primary" size="sm" onClick={() => onMoveStage(activeItem.id, "Soft Circled")}>
              Mark Soft Circled
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => showToast("IC memo export prepared", "info")}>
              Export Memo
            </Btn>
            <Btn variant="ghost" size="sm" style={{ color: C.green }} onClick={() => onMoveStage(activeItem.id, "Committed")}>
              Confirm Commitment
            </Btn>
          </div>
        </Card>

        <div style={{ display: "grid", gap: 14 }}>
          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
              Committee Context
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {activeRoom.compare.map((entry) => (
                <div
                  key={entry}
                  style={{
                    padding: "9px 10px",
                    borderRadius: 10,
                    background: C.bg,
                    border: `1px solid ${C.borderSubtle}`,
                    fontSize: 12.5,
                    color: C.textSoft,
                  }}
                >
                  {entry}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
              Decision Readout
            </div>
            <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>Why it matters:</strong> {activeItem.why}
            </div>
            <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6, marginTop: 10 }}>
              <strong style={{ color: C.text }}>Next step:</strong> {activeRoom.nextStep}
            </div>
            <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 10 }}>
              {meta?.updatedAt}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function LPDemoWorkspace({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [queueBucket, setQueueBucket] = useState("new");
  const [items, setItems] = useState(() => buildLpDemoItems());
  const [requestDrafts, setRequestDrafts] = useState(() =>
    buildLpDemoRequestDrafts(buildLpDemoItems())
  );
  const [activityFeed, setActivityFeed] = useState(() => buildLpDemoActivity());
  const [notifications, setNotifications] = useState(() => buildLpDemoNotifications());
  const [diligenceRooms, setDiligenceRooms] = useState(() =>
    buildLpDemoRooms(buildLpDemoItems())
  );
  const [selectedId, setSelectedId] = useState(301);
  const [composerId, setComposerId] = useState(null);
  const [activeDiligenceId, setActiveDiligenceId] = useState(304);
  const [activeIcId, setActiveIcId] = useState(305);
  const [reviewedToday, setReviewedToday] = useState(7);

  const addActivity = (title, detail, color = C.accent) => {
    setActivityFeed((prev) => [
      {
        id: Date.now() + Math.random(),
        title,
        detail,
        time: "Just now",
        color,
      },
      ...prev,
    ].slice(0, 6));
  };

  const addNotification = (label, detail, color = C.accent) => {
    setNotifications((prev) => [
      { id: Date.now() + Math.random(), label, detail, color },
      ...prev,
    ].slice(0, 4));
  };

  const updateRoom = (id, nextRoom) => {
    setDiligenceRooms((prev) => ({ ...prev, [id]: nextRoom }));
  };

  const withEnsuredRoom = (item, nextStage) => {
    setDiligenceRooms((prev) => {
      if (prev[item.id]) return prev;
      return {
        ...prev,
        [item.id]: buildLpDemoRoom({ ...item, stage: nextStage, revealed: true }),
      };
    });
  };

  const visibleQueue = items.filter((item) => {
    return getLpDemoBucket(item) === queueBucket;
  });

  useEffect(() => {
    if (page !== "inbox") return;
    if (!visibleQueue.some((item) => item.id === selectedId)) {
      setSelectedId(visibleQueue[0]?.id || null);
    }
  }, [page, queueBucket, visibleQueue, selectedId]);

  const selectedItem =
    visibleQueue.find((item) => item.id === selectedId) || visibleQueue[0] || null;
  const activeDiligenceItem =
    items.find((item) => item.id === activeDiligenceId) ||
    items.find((item) => item.stage === "In Diligence") ||
    null;

  useEffect(() => {
    if (!activeDiligenceItem) return;
    if (!diligenceRooms[activeDiligenceItem.id]) {
      setDiligenceRooms((prev) => ({
        ...prev,
        [activeDiligenceItem.id]: buildLpDemoRoom(activeDiligenceItem),
      }));
    }
  }, [activeDiligenceItem, diligenceRooms]);

  const queueCounts = {
    new: items.filter((item) => getLpDemoBucket(item) === "new").length,
    reviewing: items.filter((item) => getLpDemoBucket(item) === "reviewing").length,
    moreInfo: items.filter((item) => getLpDemoBucket(item) === "moreInfo").length,
    diligence: items.filter((item) => getLpDemoBucket(item) === "diligence").length,
    ic: items.filter((item) => getLpDemoBucket(item) === "ic").length,
    archive: items.filter((item) => getLpDemoBucket(item) === "archive").length,
    hidden: items.filter((item) => getLpDemoBucket(item) === "hidden").length,
  };

  const pipelineCounts = {
    newRequests: items.filter((item) =>
      ["new", "reviewing"].includes(getLpDemoBucket(item))
    ).length,
    diligence: items.filter((item) => item.stage === "In Diligence").length,
    icPending: items.filter((item) => item.stage === "IC Pending").length,
    softCircled: items.filter((item) => item.stage === "Soft Circled").length,
    committed: items.filter((item) => item.stage === "Committed").length,
  };

  const committedCapital = items
    .filter((item) => item.stage === "Committed")
    .reduce((sum, item) => sum + item.allocationM, 0);
  const deploymentTarget = 18;
  const activePipelineCount = items.filter((item) =>
    ["New", "Reviewing", "More Info Requested", "In Diligence", "IC Pending", "Soft Circled"].includes(
      item.stage
    )
  ).length;
  const priorityItems = [...items]
    .filter((item) => ["new", "reviewing"].includes(getLpDemoBucket(item)))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);
  const commandCenterNew = queueCounts.new + queueCounts.reviewing;

  const advanceSelection = (currentId) => {
    const list = visibleQueue;
    const index = list.findIndex((item) => item.id === currentId);
    const next = list[index + 1] || list[index - 1] || null;
    setSelectedId(next ? next.id : null);
  };

  const moveStage = (id, nextStage) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const shouldReveal = ["In Diligence", "IC Pending", "Soft Circled", "Committed"].includes(
      nextStage
    );

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage: nextStage, revealed: item.revealed || shouldReveal } : item
      )
    );

    if (shouldReveal) {
      withEnsuredRoom(current, nextStage);
    }

    if (nextStage === "In Diligence") {
      setActiveDiligenceId(id);
      setPage("diligence");
    }
    if (nextStage === "IC Pending" || nextStage === "Soft Circled" || nextStage === "Committed") {
      setActiveIcId(id);
    }

    addActivity(
      `${current.name} moved to ${nextStage}`,
      nextStage === "In Diligence"
        ? "Identity unlocked and the shared diligence workspace is now open."
        : `Pipeline updated inside the LP operating system.`,
      getLpDemoStageColor(nextStage)
    );
    addNotification(
      `${current.name} -> ${nextStage}`,
      nextStage === "Committed"
        ? "Commitment status confirmed and recorded."
        : "Pipeline status updated.",
      getLpDemoStageColor(nextStage)
    );
  };

  const handlePass = (id) => {
    advanceSelection(id);
    moveStage(id, "Passed");
    setComposerId(null);
    setReviewedToday((value) => value + 1);
    showToast("Opportunity passed", "info");
  };

  const handleSendRequest = (id) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    moveStage(id, "More Info Requested");
    setComposerId(null);
    setReviewedToday((value) => value + 1);
    addActivity(
      `Structured request sent to ${item.alias}`,
      "The GP stays anonymous while the LP requests attribution, pipeline detail, and supporting material.",
      "#8b6cf0"
    );
    addNotification(
      "Awaiting GP response",
      `${item.alias} has a structured pre-diligence request waiting.`,
      "#8b6cf0"
    );
    showToast("Structured request sent", "success");
  };

  const handleOpenDiligence = (id) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    moveStage(id, "In Diligence");
    setComposerId(null);
    setReviewedToday((value) => value + 1);
    addActivity(
      `Identity revealed for ${item.name}`,
      "The LP opened diligence and created a shared workspace.",
      C.teal
    );
    addNotification(
      "Diligence workspace opened",
      `${item.name} is now in a live diligence room.`,
      C.teal
    );
    showToast("Identity revealed. Diligence workspace opened.", "success");
  };

  useEffect(() => {
    if (page !== "inbox") return;

    const onKey = (event) => {
      const target = event.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      if (!visibleQueue.length) return;

      const currentIndex = visibleQueue.findIndex((item) => item.id === selectedId);
      const current = visibleQueue[currentIndex] || visibleQueue[0];

      if (event.key === "ArrowDown" || event.key.toLowerCase() === "j") {
        event.preventDefault();
        const next = visibleQueue[currentIndex + 1] || visibleQueue[0];
        setSelectedId(next.id);
      }

      if (event.key === "ArrowUp" || event.key.toLowerCase() === "k") {
        event.preventDefault();
        const next =
          visibleQueue[currentIndex - 1] || visibleQueue[visibleQueue.length - 1];
        setSelectedId(next.id);
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        handlePass(current.id);
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        setComposerId(current.id);
        setSelectedId(current.id);
      }

      if (event.key === "Enter" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        handleOpenDiligence(current.id);
      }

      if (event.key === "[") {
        event.preventDefault();
        const idx = LP_DEMO_QUEUE_ORDER.indexOf(queueBucket);
        const nextBucket =
          LP_DEMO_QUEUE_ORDER[(idx - 1 + LP_DEMO_QUEUE_ORDER.length) % LP_DEMO_QUEUE_ORDER.length];
        setQueueBucket(nextBucket);
      }

      if (event.key === "]") {
        event.preventDefault();
        const idx = LP_DEMO_QUEUE_ORDER.indexOf(queueBucket);
        const nextBucket = LP_DEMO_QUEUE_ORDER[(idx + 1) % LP_DEMO_QUEUE_ORDER.length];
        setQueueBucket(nextBucket);
      }

      if (event.key === "Escape") {
        setComposerId(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, queueBucket, selectedId, visibleQueue, items]);

  const nav = (
    <>
      <NavItem
        label="Dashboard"
        icon="DB"
        active={page === "dashboard"}
        onClick={() => setPage("dashboard")}
      />
      <NavItem
        label="Inbox"
        icon="IN"
        active={page === "inbox"}
        onClick={() => setPage("inbox")}
        badge={commandCenterNew}
      />
      <NavItem
        label="Diligence"
        icon="DD"
        active={page === "diligence"}
        onClick={() => setPage("diligence")}
        badge={pipelineCounts.diligence}
      />
      <NavItem
        label="Pipeline"
        icon="PL"
        active={page === "pipeline"}
        onClick={() => setPage("pipeline")}
      />
      <NavItem
        label="IC Layer"
        icon="IC"
        active={page === "ic"}
        onClick={() => setPage("ic")}
        badge={pipelineCounts.icPending}
      />
    </>
  );

  return (
    <WorkspaceShell
      user={user}
      onLogout={onLogout}
      nav={nav}
      topRight={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pill color={C.teal}>LP Demo</Pill>
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
            allocator operating system
          </span>
          <Pill color={C.accent} size="xs">
            {notifications.length} alerts
          </Pill>
        </div>
      }
    >
      {page === "dashboard" && (
        <div>
          <WorkspaceHeaderTitle
            title="LP Command Center"
            subtitle="A curated, high-signal operating surface for screening inbound managers, running diligence, and tracking capital decisions."
          />

          <Card
            style={{
              marginBottom: 16,
              padding: 0,
              overflow: "hidden",
              borderRadius: 20,
              background:
                "linear-gradient(135deg, rgba(13,12,34,.98), rgba(9,10,23,.98) 48%, rgba(7,18,28,.95))",
              border: `1px solid ${C.border}`,
              boxShadow: "0 30px 72px rgba(0,0,0,.28)",
            }}
          >
            <div
              className="lp-demo-command-grid"
              style={{
                padding: 20,
                borderBottom: `1px solid ${C.borderSubtle}`,
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
                    background: C.accentGhost,
                    border: `1px solid ${C.accent}22`,
                    color: C.accentBright,
                    fontSize: 10.5,
                    fontWeight: 760,
                    letterSpacing: 0.7,
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  <Dot color={C.accent} size={6} pulse />
                  Capital Deployment OS
                </div>
                <div
                  style={{
                    fontSize: 31,
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: -0.8,
                    marginBottom: 10,
                  }}
                >
                  {commandCenterNew} high-signal managers need attention now.
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: C.textSoft,
                    lineHeight: 1.7,
                    maxWidth: 720,
                    marginBottom: 16,
                  }}
                >
                  MandateOS is operating like a live allocator desk: the main inbox only shows managers above threshold, structured follow-up protects identity, and diligence plus IC work stay attached to the same record.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn variant="primary" onClick={() => {
                    setPage("inbox");
                    setQueueBucket("new");
                  }}>
                    Open New Requests
                  </Btn>
                  <Btn variant="secondary" onClick={() => setPage("diligence")}>
                    Resume Diligence
                  </Btn>
                  <Btn variant="secondary" onClick={() => setPage("ic")}>
                    Review IC Queue
                  </Btn>
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: `${C.black}60`,
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
                    marginBottom: 10,
                  }}
                >
                  Command Status
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    ["New high-fit opportunities", String(queueCounts.new), C.green],
                    ["Reviewed today", `${reviewedToday}/15`, C.accent],
                    ["Live diligence workspaces", String(pipelineCounts.diligence), C.teal],
                    ["IC / decision queue", String(pipelineCounts.icPending), "#8b6cf0"],
                    ["Held below threshold", String(queueCounts.hidden), C.textMuted],
                  ].map(([label, value, color]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        padding: "9px 10px",
                        borderRadius: 10,
                        background: C.bg,
                        border: `1px solid ${C.borderSubtle}`,
                      }}
                    >
                      <span style={{ fontSize: 12.5, color: C.textSoft }}>{label}</span>
                      <Mono size={13} weight={800} color={color}>
                        {value}
                      </Mono>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lp-demo-command-metrics" style={{ padding: 20 }}>
              <LPDemoMetricCard
                label="New Requests"
                value={String(commandCenterNew)}
                sub="priority inbox + active review"
                color={C.green}
              />
              <LPDemoMetricCard
                label="Reviewed Today"
                value={`${reviewedToday}/15`}
                sub="speed against target"
                color={C.accent}
              />
              <LPDemoMetricCard
                label="Active Diligence"
                value={String(pipelineCounts.diligence)}
                sub="live workspaces"
                color={C.teal}
              />
              <LPDemoMetricCard
                label="IC / Decision Queue"
                value={`${pipelineCounts.icPending + pipelineCounts.softCircled}`}
                sub="committee + sizing"
                color="#8b6cf0"
              />
              <LPDemoMetricCard
                label="Capital Deployed"
                value={`$${committedCapital}M`}
                sub={`target $${deploymentTarget}M`}
                color={C.green}
              />
            </div>
          </Card>

          <div className="lp-demo-command-support" style={{ marginBottom: 16 }}>
            <Card
              style={{
                background: `linear-gradient(180deg, ${C.surface}, ${C.card})`,
                boxShadow: "0 20px 38px rgba(0,0,0,.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 760, fontSize: 16 }}>Priority Queue</div>
                  <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 4 }}>
                    New requests stay central. Everything else supports the decision loop.
                  </div>
                </div>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setPage("inbox");
                    setQueueBucket("new");
                  }}
                >
                  Open Inbox
                </Btn>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {priorityItems.map((item) => {
                  const meta = getLpDemoItemMeta(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPage("inbox");
                        setQueueBucket(getLpDemoBucket(item));
                        setSelectedId(item.id);
                      }}
                      style={{
                        textAlign: "left",
                        padding: "13px 14px",
                        borderRadius: 14,
                        border: `1px solid ${C.borderSubtle}`,
                        background: C.bg,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{item.alias}</div>
                        <Mono size={14} weight={800} color={getLpDemoStageColor(item.stage)}>
                          {item.fitScore}%
                        </Mono>
                      </div>
                      <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 6 }}>
                        {item.strategy} · {item.checkSize} · {meta.timeline}
                      </div>
                      <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                        {item.why}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 760, fontSize: 15 }}>Live Feed</div>
                <span style={{ fontSize: 10.5, color: C.textMuted }}>
                  Updated continuously
                </span>
              </div>
              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                {notifications.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: "10px 11px",
                      borderRadius: 12,
                      background: `${note.color}12`,
                      border: `1px solid ${note.color}25`,
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 680, marginBottom: 4 }}>
                      {note.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.55 }}>
                      {note.detail}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 8 }}>
                Activity stream
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {activityFeed.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "9px 10px",
                      borderRadius: 10,
                      background: C.bg,
                      border: `1px solid ${C.borderSubtle}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 3,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 660 }}>{item.title}</div>
                      <span style={{ fontSize: 10.5, color: C.textMuted }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.55 }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lp-demo-triad-grid">
            <LPDemoMetricCard
              label="Signal"
              value={`${commandCenterNew} live`}
              sub="Only high-fit managers hit the main queue."
              color={C.green}
            />
            <LPDemoMetricCard
              label="Pacing"
              value={`${activePipelineCount} active`}
              sub="Live items across screening, diligence, and IC."
              color={C.accent}
            />
            <LPDemoMetricCard
              label="Stickiness"
              value="1 system"
              sub="Memo, Q&A, notes, and commitment history stay attached to the same record."
              color={C.teal}
            />
          </div>
        </div>
      )}

      {page === "inbox" && (
        <div>
          <WorkspaceHeaderTitle
            title="Curated Inbox"
            subtitle="Only the highest-signal opportunities hit the primary feed. Process them with fast actions and a persistent context panel."
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12.5, color: C.textSoft }}>
              <strong style={{ color: C.text }}>Reviewed today:</strong> {reviewedToday}/15
              {" · "}
              <strong style={{ color: C.text }}>New responses:</strong> {queueCounts.moreInfo}
              {" · "}
              <strong style={{ color: C.text }}>Held below threshold:</strong> {queueCounts.hidden}
            </div>
            <div style={{ fontSize: 10.5, color: C.textMuted }}>
              J / K move · P pass · R request info · Enter open diligence
            </div>
          </div>

          <div className="lp-demo-inbox-layout">
            <Card>
              <div style={{ fontWeight: 720, fontSize: 13.5, marginBottom: 10 }}>
                Review States
              </div>
              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                {LP_DEMO_INBOX_BUCKETS.map((bucket) => (
                  <LPDemoQueueButton
                    key={bucket.id}
                    label={bucket.label}
                    desc={bucket.desc}
                    count={queueCounts[bucket.id]}
                    active={queueBucket === bucket.id}
                    onClick={() => setQueueBucket(bucket.id)}
                  />
                ))}
              </div>

              <div
                style={{
                  padding: "10px 11px",
                  borderRadius: 12,
                  background: C.bg,
                  border: `1px solid ${C.borderSubtle}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.7,
                    marginBottom: 4,
                  }}
                >
                  Speed mode
                </div>
                <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.6 }}>
                  The main feed is intentionally narrow. Everything below threshold stays out of the primary loop unless you choose to widen review.
                </div>
              </div>
            </Card>

            <div style={{ display: "grid", gap: 12 }}>
              {visibleQueue.length === 0 ? (
                <EmptyState
                  icon="[]"
                  title="No opportunities in this queue"
                  body="Everything in this bucket has already been processed. Switch queues or review the pipeline."
                  cta="Open Pipeline"
                  onClick={() => setPage("pipeline")}
                />
              ) : (
                visibleQueue.map((item) => (
                  <LPDemoInboxCard
                    key={item.id}
                    item={item}
                    selected={selectedItem?.id === item.id}
                    onSelect={() => {
                      setSelectedId(item.id);
                      setComposerId(null);
                    }}
                    onPass={() => handlePass(item.id)}
                    onRequestInfo={() => {
                      setSelectedId(item.id);
                      setComposerId(item.id);
                    }}
                    onOpenDiligence={() => handleOpenDiligence(item.id)}
                  />
                ))
              )}
            </div>

            <LPDemoContextPanel
              item={selectedItem}
              draft={selectedItem ? requestDrafts[selectedItem.id] : null}
              composerOpen={composerId === selectedItem?.id}
              setDraft={(nextDraft) =>
                selectedItem &&
                setRequestDrafts((prev) => ({
                  ...prev,
                  [selectedItem.id]: nextDraft,
                }))
              }
              onSendRequest={() => selectedItem && handleSendRequest(selectedItem.id)}
              onOpenDiligence={() => selectedItem && handleOpenDiligence(selectedItem.id)}
            />
          </div>
        </div>
      )}

      {page === "diligence" && (
        <LPDemoDiligenceRoom
          item={activeDiligenceItem}
          room={activeDiligenceItem ? diligenceRooms[activeDiligenceItem.id] : null}
          onUpdateRoom={(nextRoom) =>
            activeDiligenceItem && updateRoom(activeDiligenceItem.id, nextRoom)
          }
          onMoveStage={(nextStage) =>
            activeDiligenceItem && moveStage(activeDiligenceItem.id, nextStage)
          }
          onOpenIC={() => {
            if (!activeDiligenceItem) return;
            setActiveIcId(activeDiligenceItem.id);
            setPage("ic");
          }}
        />
      )}

      {page === "pipeline" && (
        <div>
          <WorkspaceHeaderTitle
            title="Allocation Pipeline"
            subtitle="Every opportunity moves visibly from new inbound through diligence, committee, soft circle, and commitment."
          />

          <div className="lp-demo-pipeline-stats" style={{ marginBottom: 14 }}>
            <LPDemoMetricCard
              label="Active Pipeline"
              value={String(activePipelineCount)}
              sub="screening through soft circle"
              color={C.accent}
            />
            <LPDemoMetricCard
              label="Capital Deployed"
              value={`$${committedCapital}M`}
              sub={`target $${deploymentTarget}M`}
              color={C.green}
            />
            <LPDemoMetricCard
              label="Soft Circle / IC"
              value={String(pipelineCounts.softCircled + pipelineCounts.icPending)}
              sub="decision-stage items"
              color="#8b6cf0"
            />
            <LPDemoMetricCard
              label="Passed"
              value={String(queueCounts.archive)}
              sub="filtered out quickly"
              color={C.red}
            />
          </div>

          <LPDemoPipelineBoard
            items={items}
            onOpenItem={(item) => {
              if (["In Diligence", "IC Pending", "Soft Circled", "Committed"].includes(item.stage)) {
                setActiveDiligenceId(item.id);
                setActiveIcId(item.id);
                setPage(item.stage === "IC Pending" || item.stage === "Soft Circled" || item.stage === "Committed" ? "ic" : "diligence");
                return;
              }

              const bucket = getLpDemoBucket(item);
              if (bucket === "hidden") {
                showToast("This manager is held below threshold and stays out of the primary inbox", "info");
                return;
              }

              setPage("inbox");
              setQueueBucket(bucket);
              setSelectedId(item.id);
            }}
            onAdvanceStage={(item) => {
              const nextStage =
                item.stage === "New"
                  ? "Reviewing"
                  : item.stage === "Reviewing"
                  ? "More Info Requested"
                  : item.stage === "More Info Requested"
                  ? "In Diligence"
                  : item.stage === "In Diligence"
                  ? "IC Pending"
                  : item.stage === "IC Pending"
                  ? "Soft Circled"
                  : item.stage === "Soft Circled"
                  ? "Committed"
                  : item.stage;
              moveStage(item.id, nextStage);
              showToast(`Moved to ${nextStage}`, "success");
            }}
          />
        </div>
      )}

      {page === "ic" && (
        <LPDemoICLayer
          items={items}
          rooms={diligenceRooms}
          activeId={activeIcId}
          onSelect={setActiveIcId}
          onUpdateRoom={updateRoom}
          onMoveStage={(id, nextStage) => {
            moveStage(id, nextStage);
            showToast(`Moved to ${nextStage}`, "success");
          }}
        />
      )}
    </WorkspaceShell>
  );
}

export function LPWorkspace({ user, onLogout }) {
  const isDemoUser = String(user?.id || "").startsWith("demo-");
  if (isDemoUser && USE_MARKETPLACE_DEMO) {
    return <MarketplaceLPDemoWorkspace user={user} onLogout={onLogout} />;
  }
  if (isDemoUser) {
    return <LPDemoWorkspace user={user} onLogout={onLogout} />;
  }
  return <LegacyLPWorkspace user={user} onLogout={onLogout} />;
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN WORKSPACE — FIXED
   ════════════════════════════════════════════════════════════════════════════ */

export function AdminWorkspace({ user, onLogout }) {
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
  const pipeline = [
    { stage: "Requested" },
    { stage: "In Diligence" },
    { stage: "Soft Circled" },
    { stage: "Soft Circled" },
    { stage: "Passed" },
  ];

  const workflowStats = {
    gpProfiles: 12,
    submittedFunds: 9,
    revealRequests: 21,
    revealApproved: 8,
    diligenceOpen: 5,
    softCircled: 3,
    committed: 1,
  };
  const approvedRevealCount = workflowStats.revealApproved;

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
            title="MandateOS Admin"
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
              cta="Open Workflow Monitor"
              onClick={() => setPage("workflow")}
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
              title="System Health"
              items={[
                { label: "LP database connected", done: lpDb.length > 0 },
                {
                  label: "Fit engine returning ranked results",
                  done: fitResults.length > 0,
                },
                {
                  label: "Strong matches available",
                  done: strongCount > 0,
                },
                {
                  label: "Reveal approvals tracked",
                  done: approvedRevealCount > 0,
                },
                {
                  label: "Diligence pipeline active",
                  done: pipeline.some((p) => p.stage === "In Diligence"),
                },
                { label: "Admin monitoring enabled", done: true },
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

export function LPDatabaseTable({ lpDb }) {
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

