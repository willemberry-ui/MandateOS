import { useState } from "react";
import { C } from "../tokens";
import { getInitials } from "../lib/helpers";
import { LogoFull, Pill, Btn } from "./ui";

export function WorkspaceShell({ user, onLogout, nav, children, topRight }) {
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

export function NavItem({ label, icon, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "9px 12px",
        borderRadius: 8,
        border: "none",
        borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
        background: active
          ? `linear-gradient(90deg, ${C.accentGhost}, ${C.accentWash}50)`
          : "transparent",
        color: active ? C.accentBright : C.textSoft,
        fontWeight: active ? 680 : 580,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all .15s",
        width: "100%",
        boxShadow: active ? `inset 0 0 20px ${C.accent}06` : "none",
      }}
    >
      <span
        style={{
          width: 24,
          height: 20,
          borderRadius: 6,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: active ? C.accentWash : C.bg,
          border: `1px solid ${active ? C.accent + "55" : C.borderSubtle}`,
          color: active ? C.accentBright : C.textMuted,
          fontFamily: "'Source Code Pro',monospace",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 0,
        }}
      >
        {icon}
      </span>
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
  "Reveal Pending",
  "Revealed",
  "In Diligence",
  "IC Pending",
  "Soft Circled",
  "Committed",
  "Passed",
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
  "Reveal Pending": C.amber,
  Revealed: C.teal,
  "In Diligence": C.amber,
  "IC Pending": "#8b6cf0",
  "Soft Circled": C.green,
  Committed: C.green,
  Passed: C.red,
  New: C.accent,
  Saved: C.teal,
  "Requested Info": "#8b6cf0",
  Review: C.amber,
  Diligence: C.amber,
  "Future Cycle": C.textMuted,
  Approved: C.green,
};

// formatMoneyRange, scoreBucket, normalizeUserRole imported from ./lib/helpers
// standardizeFundSubmission, buildGpMarketFeedback, computeReadinessScore imported from ./lib/fitEngine

export function WorkspaceHeaderTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 780, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13.5, color: C.textSoft }}>{subtitle}</div>
    </div>
  );
}

