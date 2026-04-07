# Grant Tracker Roadmap — 2026

Overview

This roadmap outlines quarterly milestones to mature the grant tracker and LOM governance over a 12-month period. Each quarter has measurable targets and deliverables captured in append-only provenance.

Q0 — Preparation (month 0)
- Capture baseline artifacts: `client/scorecard.json`, Pages site, initial a11y results.
- Fix immediate accessibility issues (lang, heading levels, landmarks).
- Publish initial roadmap and provenance entry.

Q1 — Stabilize & Automate Evidence Collection
- Automate CI scans that emit `ci-scan-results/scorecard.json` artifacts.
- Ensure artifact download step saves artifacts to `lom/runtime/provenance/` with markdown notes.
- UI: surface evidence links and a "View evidence" modal.
- Gate: require CI artifact presence for staging promotion.

Q2 — Accessibility & QA
- Schedule weekly a11y scans (Playwright+axe) and store results in provenance.
- Fix top accessibility violations; re-measure until serious issues reduced by 50%.
- Gate: a11y run with no critical violations for public releases.

Q3 — Security & Tests
- Add automated security scans and require severity thresholds.
- Improve unit/integration coverage and e2e reliability.
- Gate: pass security and e2e for production release.

Q4 — Scale & Review
- Measure deployment frequency, MTTR, artifact coverage.
- Executive review and publish updated `executive-summary.md` with evidence links.
- Decide promotion to enterprise pilot or production.

Metrics & Gates
- appScore, lomScore improvements targets: +5–10 pts/quarter.
- CI Artifact Coverage: target 100% runs with artifacts.
- A11y: 0 critical, reduce serious by 50%/quarter.
- Security: no critical severities on scans for release.

Deliverables
- Append-only provenance entries for all runs under `lom/runtime/provenance/`.
- Quarterly `executive-summary.md` and roadmap updates.
- Automated workflows producing artifacts and upload steps.
