# Phase 8 + 9 verification — Tasks/downloads + Account/billing/credits
- Captures console-clean: account, billing, credits, tasks @1440.
- Phase 8: studio ExportDialog (5 scopes → pdf-lib blob download) verified in Phase 6 capture; task tray + /account/tasks list with progress; quick-export list; ledger as download history proxy (mock, documented).
- Phase 9: profile save (updates store), preferences incl. theme switch, security disabled → Phase 12; billing: plan cards w/ mock switch, cancel-subscription dialog (observed flow S5), Stripe noted as mock; credits: packs purchase (mock grant), activity ledger.
- Fixed: zustand derived-selector infinite loop (filter in useMemo).
