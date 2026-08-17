export const FIT_WEIGHTS = {
  sector: 30,
  checkSize: 25,
  geography: 15,
  strategy: 30,
};

export function computeFitScore(gpProfile, lp) {
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
    reasons.push({ ok: true, label: "Strategy", text: `Matches strategy: ${gpProfile.strategy}` });
  } else {
    reasons.push({ ok: false, label: "Strategy", text: `LP targets ${lp.strategies.join(", ")} — no ${gpProfile.strategy} mandate` });
  }

  // Sector match (+30)
  const gpSectors = gpProfile.sectors || [];
  const overlapSectors = gpSectors.filter((s) => lp.sectors.includes(s));
  if (overlapSectors.length > 0) {
    const ratio = overlapSectors.length / Math.max(gpSectors.length, 1);
    raw += FIT_WEIGHTS.sector * ratio;
    reasons.push({ ok: true, label: "Sector", text: `Matches sector${overlapSectors.length > 1 ? "s" : ""}: ${overlapSectors.join(", ")}` });
  } else {
    reasons.push({ ok: false, label: "Sector", text: `No sector overlap — LP targets ${lp.sectors.slice(0, 3).join(", ")}` });
  }

  // Check size overlap (+25)
  const gpMin = gpProfile.checkMin || 0;
  const gpMax = gpProfile.checkMax || 999;
  const overlap = Math.min(gpMax, lp.checkMax) - Math.max(gpMin, lp.checkMin);
  const range = Math.max(lp.checkMax - lp.checkMin, 1);
  if (overlap > 0) {
    const ratio = Math.min(overlap / range, 1);
    raw += FIT_WEIGHTS.checkSize * ratio;
    reasons.push({ ok: true, label: "Check Size", text: `Check size aligned: $${lp.checkMin}-${lp.checkMax}M overlaps GP range` });
  } else {
    reasons.push({ ok: false, label: "Check Size", text: `Check size mismatch — LP range $${lp.checkMin}-${lp.checkMax}M` });
  }

  // Geography match (+15)
  const geoMatch = lp.geographies.some(
    (g) => g.toLowerCase() === gpProfile.geography.toLowerCase() || g.toLowerCase() === "global"
  );
  if (geoMatch) {
    raw += FIT_WEIGHTS.geography;
    reasons.push({ ok: true, label: "Geography", text: `Geography match: ${gpProfile.geography}` });
  } else {
    reasons.push({ ok: false, label: "Geography", text: `Geography mismatch — LP targets ${lp.geographies.join(", ")}` });
  }

  const score = Math.round((raw / maxRaw) * 100);
  return { score, reasons, lp };
}

export function runFitEngine(gpProfile, lpDb) {
  const results = lpDb.map((lp) => computeFitScore(gpProfile, lp));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 15);
}

export function standardizeFundSubmission(profile, submission) {
  const strategy =
    submission.fundType === "Buyout"
      ? "Lower Middle Market Buyout"
      : submission.fundType === "Growth Equity"
      ? "Growth Equity"
      : submission.fundType || profile.strategy || "Private Markets";

  const geography = profile.geography || "North America";
  const targetLP = profile.targetLPTypes?.length > 0
    ? profile.targetLPTypes.join(" + ")
    : "Family offices + small institutions";
  const minCommitment = profile.minTicket || "$1M";

  let status = "Active";
  if (submission.currentStatus === "Pre-Launch") status = "Pre-launch";
  if (submission.currentStatus === "First Close") status = "First close targeted";
  if (submission.currentStatus === "Final Close") status = "Final close underway";

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
      submission.deckUploaded ? 20 : 0,
      submission.teamBiosUploaded ? 15 : 0,
      submission.performanceUploaded ? 25 : 0,
      submission.termsSheetUploaded ? 15 : 0,
      submission.lpReferencesUploaded ? 10 : 0,
      submission.dataRoomReadiness === "Ready" ? 15 : submission.dataRoomReadiness === "Partial" ? 8 : 0,
    ].reduce((a, b) => a + b, 0),
  };
}

export function computeReadinessScore(profile, submission) {
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

export function buildGpMarketFeedback(pipeline, fitResults, standardized) {
  const familyOfficeHits = fitResults.filter((x) => x.lp.type === "Family Office" && x.score >= 75).length;
  const endowmentHits = fitResults.filter((x) => x.lp.type === "Endowment" && x.score >= 75).length;
  const passed = pipeline.filter((p) => p.stage === "Passed").length;
  const dd = pipeline.filter((p) => p.stage === "In Diligence").length;
  const softCircled = pipeline.filter((p) => p.stage === "Soft Circled").length;

  return [
    familyOfficeHits >= endowmentHits
      ? "Family offices are the cleanest first-close path for this Fund I raise."
      : "Institutional emerging-manager programs are showing stronger fit than family offices.",
    standardized.materialsCompleteness < 70
      ? "LPs need more evidence before backing a first-time fund. Complete references, terms, and the data room before broad outreach."
      : "Materials are strong enough for targeted outreach. The remaining risk is attribution clarity, not basic completeness.",
    passed >= 2
      ? "Pass risk is tied to Fund I scale and attribution proof. Keep larger pensions out of the first-close sequence."
      : "No broad negative pattern yet. Keep sequencing smaller LPs and emerging-manager programs first.",
    dd > 0 || softCircled > 0
      ? "Momentum improves once LPs see the founder references and pre-fund portfolio detail."
      : "There is match potential, but the raise needs more reveal approvals before it becomes a real pipeline.",
  ];
}
