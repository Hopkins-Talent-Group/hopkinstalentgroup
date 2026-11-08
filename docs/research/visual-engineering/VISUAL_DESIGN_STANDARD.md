# Visual Engineering Design Standard

**Document ID:** VEDS-001  
**Project:** Hopkins Talent Group (HTG) — Brand Identity & Website Design Handoff  
**Revision:** 4  
**Status:** Working standard; quality baseline subject to HTG-specific approval  
**Governance:** [Issue #10 — HTG Brand Identity & Website Design Handoff](https://github.com/vitrixLab/hopkinstalentgroup/issues/10)  
**Companion research:** [HTG Brand Research & Strategy](../branding/README.md)

> This standard records the visual methods established in the project. It is a construction and quality-control method, not a claim that any particular asset has been approved. HTG ownership and identity remain distinct from the designer's personal or studio identity.

---

## 1. Design thesis

**Engineer the visual structure first; let beauty emerge from precision, proportion, hierarchy, and restraint.**

A successful artifact is not merely attractive. It must communicate its subject, organize information, establish relationships, remain legible at its actual display size, and behave consistently across contexts.

The standard favors deliberate construction over decoration and demonstrable improvement over subjective claims.

## 2. Foundational principles

### 2.1 Geometry and proportion
- Construct marks, diagrams, cards, and layouts from intentional geometric relationships.
- Use consistent stroke weights, corner logic, spacing, and proportional rules.
- Align elements to shared axes and a documented grid.
- Use symmetry when it strengthens the concept; do not force symmetry where the information or form requires asymmetry.
- Avoid uncontrolled hand-drawn strokes when the brief calls for precise geometry.
- Check optical balance after mathematical construction; optical correction must be intentional and documented, not arbitrary.

### 2.2 Grid-first composition
- Establish page or viewport structure before placing content.
- Define margins, columns, gutters, alignment anchors, and spacing scales.
- Keep repeated components aligned to the same structural rules.
- Allow intentional exceptions only when they improve hierarchy or meaning.
- Do not use arbitrary offsets to imitate visual complexity.
- Treat a grid as a constraint system, not a visible decoration.

### 2.3 Typographic hierarchy
- Establish a clear order for titles, section headings, labels, body copy, metadata, and annotations.
- Use a controlled type scale, consistent weights, and purposeful line lengths.
- Preserve legibility at the actual output size, not only when zoomed in.
- Treat typography as structural information, not decoration.
- Avoid excessive typeface mixing, arbitrary letter spacing, and hierarchy created only through effects.
- Document font family, weights, licensing/source, fallback stack, roles, and responsive behavior before implementation.

### 2.4 Negative space and restraint
- Treat whitespace as an active compositional element.
- Remove elements that do not contribute to meaning, navigation, recognition, or hierarchy.
- Avoid unnecessary gradients, glows, metallic effects, ornamental borders, shadows, and visual noise.
- Do not confuse minimalism with under-communication: essential labels, context, and relationships must remain clear.

### 2.5 Consistency and systems
- Define reusable tokens and rules for color roles, typography, spacing, radii, strokes, grids, and component states.
- Reuse rules rather than copy/paste visual approximations.
- Define component variants and states explicitly.
- A repeated pattern must preserve the same alignment, spacing, type hierarchy, and interaction logic unless a documented exception is required.

### 2.6 Information engineering
- Treat diagrams and information graphics as structured information systems.
- Make nodes, relationships, direction, hierarchy, labels, and boundaries understandable without relying on decoration.
- Distinguish actual data, derived values, estimates, placeholders, and unknowns.
- Never fabricate data, labels, relationships, metrics, or system behavior to make a composition appear complete.

## 3. Logo and symbol construction

- Begin with the concept and intended recognition behavior, not a decorative shape.
- Define a construction grid, axes, proportions, negative-space relationships, and stroke logic.
- Test silhouette recognition before adding detail.
- Test monochrome, reversed, small-size, and reproduction contexts.
- Use symmetry where it supports the concept; verify optical balance independently.
- Maintain clear space, minimum size, alignment, and lockup rules.
- For A/B exploration, concepts must differ in strategy and visual logic—not merely color, stroke weight, spacing, or minor proportion.
- Do not use unlicensed or unverified third-party marks as if endorsed or owned.
- Final identity adoption requires explicit approval and documented name/mark screening; screening is not a legal guarantee.

## 4. Layout, cards, dashboards, and editorial sheets

### 4.1 Composition
- Establish the information hierarchy before choosing visual effects.
- Use consistent margins, gutters, alignment anchors, and spacing units.
- Keep title, body, metadata, labels, and annotation roles distinct.
- Ensure the primary content is understandable at the intended viewing distance and scale.
- Use whitespace to separate concepts and group related information.

### 4.2 Cards and interface components
- Define purpose, content schema, hierarchy, and state coverage before styling.
- Specify default, hover, focus, active, disabled, loading, empty, error, and responsive states where applicable.
- Do not add controls that do not perform their advertised action.
- Avoid repeating the same information in multiple visual treatments.
- Do not invent ratings, statuses, values, chart data, or product facts.

### 4.3 Editorial handout layout
For the HTG six-sheet handoff:
- Page format is **A3 landscape (420 × 297 mm)**.
- Use a main design frame on the left two-thirds, annotation margin on the right one-third, and footer strip for variants/notes.
- Every sheet includes title, version, date, and sheet ID.
- Canonical review artifact is one consolidated PDF.
- Export individual sheet PNGs at **300 dpi at the defined A3 dimensions**.
- Include 100% detail crops for fine construction and small-size legibility.
- Do not switch to tabloid without explicit approval.
- Distinguish exploratory mockups from approved assets.

## 5. Color and visual semantics

- Assign color by semantic role: background, surface, primary text, secondary text, border, accent, status, and focus.
- Document color values and intended use in machine-readable tokens.
- Test contrast against the actual background and component states.
- Never use color alone to communicate status or relationship.
- A dark visual foundation is a proposed HTG direction, not a fixed requirement until approved and tested.
- Avoid decorative color effects that do not improve recognition, hierarchy, or meaning.

### 5.1 Grayscale-first structural validation

Before approving color treatment, inspect a grayscale rendering at the intended output size. Verify that:
- primary and secondary hierarchy remains clear;
- text, icons, borders, and grouped regions remain distinguishable;
- relationship and status information is not communicated by hue alone;
- emphasis, grouping, and reading order remain understandable without color.

Grayscale review is a structural diagnostic. It does not replace measured contrast checks, accessible labels, keyboard/focus testing, semantic structure, or WCAG 2.2 AA verification for applicable interfaces. Pair necessary color distinctions with labels, shape, pattern, position, or other redundant cues.

### 5.2 Color proportion heuristics

A 70% neutral / 20% supporting / 10% accent split may be tested as a composition hypothesis, but it is not a universal design law, an accessibility standard, or an approved HTG token rule. Adjust proportions according to content density, audience, medium, semantic roles, and contrast. Record why the distribution improves hierarchy and validate it in the rendered output.

Do not import another studio's palette into HTG. The sample colors #101722, #F5F5F2, #AEB7C2, and #B51F32 supplied in a separate synthesis are not approved HTG identity tokens. HTG color values remain pending its own logo/identity approval sequence. Keep client and designer/studio identities separate.

## 6. Relationship and brand integrity

For HTG, visual presentation must preserve the truth of business relationships. Use only verified relationship classifications:
- HTG-owned business
- HTG operating brand
- Strategic partner
- Client relationship
- Referral opportunity
- Project under development
- Other — explain and verify

Define a consistent visual treatment and qualifier/disclosure slot for each class. If relationship status or mark permission is unknown, use a neutral text-only label or placeholder. Do not imply ownership, endorsement, or affiliation through shared lockups, containers, proximity, or hierarchy. Treat HTG identity as distinct from the designer/developer's personal or studio identity.

## 7. Accessibility and responsive behavior

For applicable HTG website/interface deliverables, target **WCAG 2.2 AA**.

Evidence must include, as applicable:
- Text and non-text contrast measurements.
- Keyboard operation and logical focus order.
- Visible focus indication.
- Semantic structure and meaningful labels.
- Text resizing and reflow.
- Accessible names and states for controls.
- Relevant assistive-technology checks.
- Responsive checks at required viewports, including content expansion, long headings, missing content, and overflow.

Accessibility is a critical pass/fail gate, not a final cosmetic check. Document exceptions with rationale and an owner. Unresolved critical failures block acceptance.

## 8. Visual references and validation

Every major design direction must include at least three relevant visual references and two anti-references. Record the source/link, lesson being studied or rejected, HTG relevance, and what must not be copied. References are for analysis, not imitation.

For HTG homepage hero work, conduct five-second comprehension checks with representative reviewers for each audience before identity-token approval. Record prompt, participant role, observations, and revisions. Do not fabricate participants, findings, or test outcomes.

## 9. Quality-control protocol

Use this sequence for every substantive visual revision:

1. **Inspect** — review the current source and rendered output at intended sizes, including grayscale where color hierarchy is involved.
2. **Diagnose** — identify specific defects in hierarchy, geometry, spacing, type, semantics, responsiveness, or fidelity.
3. **Specify** — state exact changes and acceptance evidence before editing.
4. **Construct** — implement the specified changes; avoid unrelated cosmetic churn.
5. **Render** — produce the actual output at required viewports/scales.
6. **Compare** — compare before/after against the same criteria and evidence.
7. **Record** — document changed files, revision rationale, results, unresolved defects, and issue linkage.

A source-code diff alone is not proof of visual improvement. Inspect the rendered result.

### 9.1 Evidence-based scoring

Score each applicable quality dimension from 0–4:
- **0 — Missing/failed:** absent, incorrect, or unusable.
- **1 — Weak:** major defects; requirement not met.
- **2 — Partial:** material revisions or unresolved gaps remain.
- **3 — Pass:** documented requirement is satisfied with evidence.
- **4 — Strong:** requirement is satisfied with repeatable quality.

Each sheet passes only when every critical gate is at least 3/4, no critical defect remains, and evidence is attached. Average scores cannot compensate for a failed critical gate. Record N/A with a reason.

### 9.2 Critical gates

- Brand fidelity to approved identity decisions.
- Content and relationship accuracy, including permission evidence.
- Responsive behavior and state coverage.
- Accessibility (WCAG 2.2 AA target for applicable interfaces).
- Implementation readiness: source, tokens, assets, behavior, states, and acceptance criteria sufficient to implement without guessing.

### 9.3 Mandatory rejection conditions

Reject a revision when:
- It is cosmetic-only and does not resolve a stated defect.
- It introduces fabricated data, content, relationships, metrics, or behavior.
- It uses unverified marks or implies an unauthorized relationship.
- It reduces legibility, accessibility, responsiveness, or information clarity.
- It repeats a prior approach without materially changing the identified failure.
- No rendered proof is supplied for a visual change.
- A critical gate fails or required approval/evidence is missing.

## 10. Change specification template

Use this structure when directing an implementation agent or designer:

```md
## Change request
- Issue: #10
- Artifact / screen:
- Current revision:
- Target revision:

## Observed defect
- Exact location:
- What is wrong:
- Why it matters:
- Evidence (screenshot / viewport / measurement):

## Required change
- Geometry / alignment:
- Grid / spacing:
- Typography:
- Color / semantics:
- Content / relationship accuracy:
- Responsive / interaction states:

## Constraints
- Must preserve:
- Must not introduce:
- Unknowns that remain TBD:

## Acceptance evidence
- Required render(s):
- Viewports / export sizes:
- Measurements / tests:
- Before-after comparison:
- Remaining defects:
```

Instructions to an implementation agent must be concrete, testable, and scoped. Do not ask for a vague “revamp” without identifying the artifact, defects, constraints, and evidence required. Do not claim work is complete until the rendered output has been inspected.

## 11. HTG application boundaries

This document owns visual construction and evaluation methods. HTG positioning, audience priorities, capability definitions, relationship classifications, and website architecture are owned by [HTG Brand Research](../branding/README.md) and [HTG Website Revamp Plan](../../website-revamp/README.md). Do not restate or redefine those strategic/content decisions here.

- Apply the HTG strategy and approved identity decisions; do not import unrelated visual identities or product-specific behavior.
- Do not confuse the designer/developer's brand with HTG's client-owned brand.
- Do not invent business facts, service availability, partner relationships, proof, legal disclosures, content, or operational flows.
- Mark all unverified values and content **TBD — do not invent**.
- Keep proposed directions visibly distinct from approved decisions.
- Do not treat a placeholder as final content.
- Use the HTG Brand Research & Strategy document for capability, audience, relationship, and messaging context; use Issue #10 for current scope, sequencing, and acceptance criteria.

### Approval authority and dependency control

- Formal approval gates cannot pass until the authorized approver(s) and any fallback are explicitly named in Issue #10 by the appropriate decision-maker.
- Never infer approval authority from repository ownership, authorship, design completion, silence, or participation in a review.
- Until authority is named, work independent of the unresolved decision may proceed with visible placeholders; dependent work remains blocked or provisional.
- Each unresolved decision must retain an owner and target date. Until assigned by the appropriate decision-maker, record **TBD — Keith to assign**; do not invent names or deadlines.
- Preserve the approval sequence: Sheet 01a structural approval; Sheet 02 A/B and name/mark screening; explicit logo-direction approval; Sheet 01b identity-token approval; then dependent application and handoff work.

### Required implementation handoff

For the HTG handoff, a review PDF alone is insufficient. The completed package must include:
- One consolidated PDF as the canonical review artifact.
- Native editable source files, with authoring software/version identified.
- Machine-readable design tokens in JSON and/or CSS custom properties, including names, values, semantic roles, and usage notes.
- Approved vector logo masters in SVG and PDF, with raster exports where required.
- Per-sheet A3 landscape PNGs at 300 dpi and 100% detail crops for fine construction/legibility evidence.
- Per-sheet acceptance evidence, including relevant rendered views, measurements, accessibility checks, responsive states, and unresolved exceptions.

Do not mark the package complete when any required source, token, vector, or evidence artifact is absent. Unknown token values and unapproved logo exports remain explicitly provisional.

## 12. GitHub traceability and governance

Audit sources:
- [Issue #10 — governing plan](https://github.com/vitrixLab/hopkinstalentgroup/issues/10).
- [DeepSeek/Claude findings F01–F12](https://github.com/vitrixLab/hopkinstalentgroup/issues/10#issuecomment-6724688326).
- [Issue #10 remediation record](https://github.com/vitrixLab/hopkinstalentgroup/issues/10#issuecomment-6724748189).

Every commit that changes work under this plan must reference its governing issue in the commit message. For HTG branding and website handoff work, use `(#10)`.

Recommended format:

`<type>(<scope>): <specific change> (#10)`

Examples:
- `docs(branding): revise strategy research from review findings (#10)`
- `docs(visual-engineering): strengthen visual QA and accessibility standard (#10)`
- `feat(homepage): implement approved audience pathway (#10)`

Rules:
- Unrelated work must reference its own governing issue, not automatically #10.
- If no suitable issue exists, identify/create the issue before committing.
- Pull requests must reference the governing issue.
- After pushing, record the commit SHA, direct commit URL, changed paths, and concise summary in the issue thread.
- Do not claim a commit is indexed/associated until the GitHub issue thread or GitHub's linked issue view demonstrates that association.
- This is a documented workflow requirement; automated enforcement is not claimed unless separately configured and verified.
- Do not rewrite existing history solely to retrofit issue references.

## 13. Revision history

| Revision | Status | Description |
|---|---|---|
| 1 | Working standard | Recorded project visual methods: geometry, symmetry, grid discipline, hierarchy, restraint, information engineering, rendered inspection, and issue traceability. |
| 2 | Working standard | Aligned the standard with Issue #10 review remediation: explicit relationship visual grammar, A3/300 dpi export rules, WCAG 2.2 AA evidence gate, references and comprehension testing, evidence-based scoring, clearer rejection criteria, and stronger HTG ownership/approval boundaries. |
| 3 | Working standard | Added explicit approval-authority/dependency controls and a complete implementation-handoff checklist for editable source, machine-readable tokens, vector logo masters, canonical PDF, A3 exports, and evidence. Linked the governing audit provenance; no approval is inferred. |
| 4 | Working standard | Added grayscale-first structural validation, color-proportion heuristic boundaries, and an explicit prohibition on importing the designer/studio palette into HTG. Linked the portfolio/social research framework and added grayscale inspection to visual QA. |

---

**Core rule:** no visual change is accepted because it merely looks different. It must solve a defined problem, preserve factual integrity, and demonstrate improvement in the rendered result.
