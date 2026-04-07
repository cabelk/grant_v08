# Q1 Implementation Checklist — Stabilize & Automate Evidence Collection

Goals
- Ensure CI artifacts are produced and preserved in provenance.
- Surface evidence in the UI and ensure static Pages fallback works.

Checklist
- [ ] Confirm CI job emits `ci-scan-results/scorecard.json` artifact.
- [ ] Add artifact-download step in CI that saves artifacts to `lom/runtime/provenance/`.
- [ ] Add UI evidence links to scorecard (done: axe/page evidence link).
- [ ] Harden a11y workflow to use CDN axe and produce artifact (done).
- [ ] Gate policy: require presence of `ci-scan-results/scorecard.json` for promotion.
- [ ] Run one full pipeline and verify all artifacts are stored.
- [ ] Publish Q1 executive-summary and append provenance note.

Notes
- Target measurable outcomes: CI artifact coverage 100%, e2e pass rate ≥95%.
