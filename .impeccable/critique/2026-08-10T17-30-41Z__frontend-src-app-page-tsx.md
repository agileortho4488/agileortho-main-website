---
target: the homepage
total_score: 19
max_score: 28
na_heuristics: 5,7,9
p0_count: 0
p1_count: 2
timestamp: 2026-08-10T17-30-41Z
slug: frontend-src-app-page-tsx
---
⚠️ DEGRADED: single-context (sub-agent tool barred by session operating rules; user did not request agents)

## Design Health Score

Persuade surface. Heuristics that cannot apply to a marketing page with no form and no error
states on the critical path are marked n/a and the total renormalised.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Four dynamic imports render with no loading fallback, so the wizard, showcase, blueprint and map pop in after paint |
| 2 | Match System / Real World | 3 | Clinical vocabulary is correct now, but "Anatomical Blueprint Extraction" and "Telemetry" are invented words a surgeon does not use |
| 3 | User Control and Freedom | 3 | Nav and links behave; nothing traps the visitor |
| 4 | Consistency and Standards | 3 | One accent and one heading font now, but eight distinct corner radii are in use |
| 5 | Error Prevention | n/a | No form on this surface; the WhatsApp CTA carries no destructive risk |
| 6 | Recognition Rather Than Recall | 3 | Divisions carry label, icon and real SKU count |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; accelerators do not apply |
| 8 | Aesthetic and Minimalist Design | 2 | 94 uppercase elements. When everything is set in black italic caps, nothing reads as more important than anything else |
| 9 | Error Recovery | n/a | No error state reachable from this page |
| 10 | Help and Documentation | 3 | /faq, the chat widget and a WhatsApp route are all reachable |
| **Total** | | **19/28** | **68% — Acceptable** |

## Design Specificity Verdict

**LLM assessment.** The *content* is now strongly specific to this business: real per-division SKU
counts, clinically correct iconography, a Telangana district map, a stated dispatch time. Nothing
here reads as filler.

The *composition* is not. Full-viewport hero with a glow blob, a counter row, a card grid, a map,
a footer — replace the words and this is a crypto-infrastructure page. The one genuinely
category-defining device on the site is the **Sizing Wizard**: a surgeon types a femoral A-P
measurement in millimetres and gets the implant size. No competitor page in this category does
that. It currently sits mid-page as an unheralded widget with no framing.

**Deterministic scan.** `detect.mjs` on `frontend/src/app/page.tsx`: **0 findings, exit 0.** The
same detector returned 10 findings at the start of this session; the redesign, taste and
interaction passes cleared all of them.

Worth stating plainly: the detector is clean and the page still scores 68%. Every issue below is
invisible to it. A mechanical scanner cannot see that a page never asks for the order.

**Visual overlays.** Not available. The browser pane is not compositing frames in this session, so
no user-visible overlay was injected. Evidence below is DOM measurement instead, which is why each
finding carries a number.

## Overall Impression

The page is now honest, coherent and correctly branded — that was the work of the last three
passes. What it is not is persuasive. It states what the company has and never asks the hospital
to do anything after the first screen. The single biggest opportunity is not visual: it is that a
7,257px page carries its only real call to action at 12% and then goes quiet.

## What's Working

1. **The numbers are defensible.** Every figure on the page can be traced to the item catalogue.
   For a medical distributor selling to procurement committees, that is worth more than styling.
2. **The division cards do a real job.** Icon, clinical name, plain description, true SKU count,
   whole card clickable, focus ring. That block would survive a design review anywhere.
3. **The map earns its space.** Statewide coverage is the actual differentiator against a
   Hyderabad-only competitor, and it is shown rather than claimed.

## Priority Issues

**[P1] The page never asks for the order.**
Measured: page height 7,257px. "Request OT Support" sits at **12%** down. The next things
resembling an action are footer "Contact" links at 88% and 96%. **Roughly three-quarters of the
page has no way to act.** A surgeon who reads to the end has to scroll back to the top.
*Fix:* a closing section before the footer that asks for one specific thing.
*Suggested command:* `/impeccable shape`

**[P1] The best asset on the site is buried.**
The Sizing Wizard is the only thing here a competitor cannot copy from a brochure. It has no
heading of its own, no explanation of why it exists, and sits below two paragraphs of prose.
*Fix:* give it its own section and lead with the question it answers.
*Suggested command:* `/impeccable layout`

**[P2] 94 uppercase elements.**
Headline, subheads, eyebrows, buttons, stat labels, card titles, trust markers — all black italic
caps. Emphasis applied everywhere is emphasis nowhere, and long uppercase strings are measurably
slower to read.
*Suggested command:* `/impeccable typeset`

**[P2] Content pops in after paint.**
Four `dynamic()` imports with no `loading` fallback. On a hospital's connection the reader sees
gaps fill in beneath them.
*Suggested command:* `/impeccable harden`

**[P3] Eight corner radii.**
9999px (41 uses), 16px (12), 24px (7), 40px (5), 12px (4), 6px (2), 48px (2), 32px (1). That is
not a system, it is accumulation.
*Suggested command:* `/impeccable polish`

## Persona Red Flags

**Jordan (first-timer / non-specialist procurement officer).** Reaches the bottom of a 7,257px
page and finds a map, not a next step. "Anatomical Blueprint Extraction" and "Telemetry" mean
nothing to them. The Sizing Wizard asks for "Femoral A-P (mm)" with no explanation of where that
measurement comes from.

**Casey (distracted mobile user).** Both hero CTAs are full-width stacked at the top; everything
below is reading. On a phone, after four screens of scrolling there is no thumb-reachable action
until the footer. No sticky contact affordance.

**Riley (stress tester).** Four dynamically imported components have no loading or error state —
if one fails to load, the section is simply absent with no message. The Sizing Wizard gives a size
for any input with no stated bounds or disclaimer, on a medical site.

## Minor Observations

- "Districts Served" (stats) vs "all 33 districts" (hero prose) — same fact, two phrasings.
- The trust strip sits at 40% opacity by default; certifications a buyer cares about are the
  faintest thing on the page.
- `headlineRef` and `telemetryRef` are declared and never used.

## Questions to Consider

- If a surgeon could do exactly one thing on this page, what is it — and does the page make that
  thing unmissable?
- The Sizing Wizard answers a question surgeons actually have. What would the page look like if it
  opened with that instead of a slogan?
- Who is this page for: the surgeon who chooses the implant, or the procurement officer who signs?
  Right now it half-addresses both.
