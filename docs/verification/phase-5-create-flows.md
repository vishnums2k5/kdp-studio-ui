# Phase 5 verification — Create flows
- Captures: create-1440w + 9 generator pages + modal open + generating state — all console-clean.
- Interaction probe (scripts/probe-create.mjs): fill modal → Generate → navigates to /studio/<new-id> with streaming pages (studio lands in Phase 6; verified navigation + page streaming via store).
- Credit banner updates with page count; insufficient credits disables CTA + shows buy-credits alert; validation errors show per-field.
- Non-fiction shows outline review step before generate.
