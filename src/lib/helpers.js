import { C } from "../tokens";

export function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getScoreColor(score) {
  if (score >= 75) return C.green;
  if (score >= 45) return C.amber;
  return C.red;
}

export function getScoreLabel(score) {
  if (score >= 75) return "Strong Fit";
  if (score >= 45) return "Partial Fit";
  return "Low Fit";
}

export function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem("cos_" + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key, val) {
  try {
    localStorage.setItem("cos_" + key, JSON.stringify(val));
  } catch {}
}

export function formatMoneyRange(min, max) {
  return `$${min}M–$${max}M`;
}

export function scoreBucket(score) {
  if (score >= 85) return "High";
  if (score >= 70) return "Qualified";
  if (score >= 55) return "Moderate";
  return "Low";
}

export function normalizeUserRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (value === "admin" || value === "lp" || value === "gp") return value;
  return "gp";
}
