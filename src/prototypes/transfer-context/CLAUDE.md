# Transfer Context

An AI agent hands a support call to a human agent. The incoming call card shows what the AI already learned. Once the call is answered, a sidebar shows the full context. When the call ends, a Wrap-up modal opens with an AI-drafted disposition and notes.

Route: `/sizzle-reel/prototypes/transfer-context`

## States (`callState` in `index.vue`)

1. `idle`: Dialpad shell with the Alicia Kurniawan conversation open.
2. `ringing`: the incoming call card appears after `TIMING.ringDelayMs`. Decline counts down over `TIMING.ringTimeoutMs`. When the countdown ends the card stays up and the fill goes away.
3. `active`: Answer opens the callbar and the Transfer sidebar (resizable from its left edge). The conversation switches to the caller (Ben Parker), and the call timer starts.
4. `wrapup`: End call freezes the timer and opens the Wrap-up modal. The shimmer runs, the disposition lands at `TIMING.wrapUpDispositionAtMs`, and the notes stream in over `TIMING.wrapUpNotesDurationMs`. Done returns to `idle`.

Decline from `ringing` goes straight to `idle`.

## Timing

All in `TIMING` in `data.js`: `ringDelayMs`, `ringTimeoutMs`, `wrapUpDispositionAtMs`, `wrapUpNotesDurationMs`. The 1s call-timer tick in `index.vue` is a clock, not a tunable.

## Files

```
transfer-context/
├── index.vue                  # Shell, callState machine, timers, sidebar resize
├── data.js                    # All fake people, records, dispositions, wrap-up draft, TIMING
└── components/
    ├── LeftSidebar.vue        # Dialpad left sidebar (forked from launchpad)
    ├── SidebarSection.vue     # Collapsible sidebar section (forked from launchpad)
    ├── ConversationView.vue   # Main conversation pane
    ├── IncomingCall.vue       # Ringing card with AI transfer summary + Decline countdown
    ├── Callbar.vue            # Active-call bar (dark surface)
    ├── CallbarControlButton.vue
    ├── TransferSidebar.vue    # Contact info, transfer context fields, Salesforce
    └── WrapUpModal.vue        # Disposition combobox + AI-drafted notes
```

## Data

`data.js` exports `selectedContact`, `caller`, `transferContext` (`cardFields` for the card and `fields` for the sidebar), `salesforce`, `dispositions`, `wrapUpDraft`, `sidebarSections`, and `TIMING`. Never retype these in a component.
