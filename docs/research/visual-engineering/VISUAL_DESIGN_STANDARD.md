# Visual Engineering Design Standard

**Document ID:** VEDS-001  
**Project:** Hopkins Talent Group (HTG) — Brand Identity & Website Design Handoff  
**Status:** Working standard; apply as a quality baseline, subject to HTG-specific approval  
**Related tracker:** [Issue #10 — HTG Brand Identity & Website Design Handoff](https://github.com/vitrixLab/hopkinstalentgroup/issues/10)

> This standard records the visual methods established in the project. It is a design and quality-control method, not a claim that any particular asset has been approved. HTG ownership and identity remain distinct from the designer's personal or studio identity.

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

### 2.2 Grid-first composition
- Establish page or viewport structure before placing content.
- Define margins, columns, gutters, alignment anchors, and spacing scales.
- Keep repeated components aligned to the same structural rules.
- Allow intentional exceptions only when they improve hierarchy or meaning.
- Do not use arbitrary offsets to imitate visual complexity.

### 2.3 Typographic hierarchy
- Establish a clear order for titles, section headings, labels, body copy, metadata, and annotations.
- Use a controlled type scale, consistent weights, and purposeful line lengths.
- Preserve legibility at the actual output size, not only when zoomed in.
- Treat typography as structural information, not decoration.
- Avoid excessive typeface mixing, arbitrary letter spacing, and hierarchy created only through effects.

### 2.4 Negative space and restraint
- Treat whitespace as an active compositional element.
- Remove elements that do not contribute to meaning, navigation, recognition, or hierarchy.
- Avoid unnecessary gradients, glows, metallic effects, ornamental borders, shadows, and visual noise.
- Do not confuse minimalism with under-communication: essential labels, context, and relationships must remain clear.

### 2.5 Consistency and systems
- Define reusable tokens and rules for color roles, typography, spacing, radii, strokes, grids, and component states.
- Reuse rules rather than copying isolated visual treatments.
- Document exceptions and their rationale.
- Keep a shared visual language coherent without forcing every brand or artifact to look identical.

## 3. Construction methods

### 3.1 Symbol and logo construction
1. Define the concept and recognition requirement before drawing.
2. Explore distinct silhouettes rather than producing superficial variants.
3. Construct the mark using controlled geometry and intentional negative space.
4. Check optical balance after mathematical alignment; optical corrections must be deliberate and documented.
5. Test monochrome, reversed, small-size, and single-color reproduction.
6. Document clear space, minimum size, lockups, and misuse cases.
7. Do not declare a direction final without an explicit review and approval record.

### 3.2 Information graphics and diagrams
1. Identify the information, entities, and relationships that must be communicated.
2. Choose a visual structure that matches those relationships (sequence, hierarchy, network, comparison, topology, or state).
3. Establish a reading path and consistent visual encoding.
4. Keep labels close to the objects or relationships they describe.
5. Distinguish factual data, interpretation, and unknown values.
6. Never invent data, metrics, nodes, relationships, status, or behavior to make a diagram appear complete.

### 3.3 Cards, dashboards, and interface graphics
1. Define the card's purpose and primary user question.
2. Establish a predictable hierarchy: identity/context, primary information, supporting detail, and actions.
3. Use consistent internal padding, alignment, and component spacing.
4. Make state differences explicit (loading, empty, error, unavailable, selected, active, disabled).
5. Use real content or clearly marked representative placeholders.
6. Verify the rendered result at target dimensions and responsive breakpoints.

### 3.4 Editorial and handout layouts
- Use a disciplined page grid and a clear reading sequence.
- Separate the primary visual, supporting explanation, annotations, and metadata.
- Keep sheet titles, IDs, revision information, and footers consistent.
- Use image and mockup placement to explain the design, not merely to fill space.
- Maintain sufficient contrast and legibility in both screen and print contexts.

## 4. Visual hierarchy and color

- Assign colors semantic roles; do not choose colors only because they look fashionable.
- Maintain contrast appropriate to the content and output context.
- Reserve accent colors for meaningful emphasis or state.
- Do not encode meaning through color alone; pair it with labels, shape, position, or other cues.
- Use dark visual themes only when they improve the intended identity and readability; dark backgrounds are not a substitute for a coherent system.
- Do not add effects to compensate for weak composition or unclear hierarchy.

## 5. Quality-control protocol

Every meaningful revision must follow this sequence:

1. **Inspect:** review the current source and rendered output.
2. **Diagnose:** identify specific defects, omissions, or unmet requirements.
3. **Specify:** state the exact intended changes and what must remain unchanged.
4. **Construct:** make the smallest complete set of changes that resolves the defects.
5. **Render:** inspect the actual output at its target dimensions and relevant responsive states.
6. **Compare:** evaluate old versus new against the same criteria.
7. **Record:** document changed files, evidence, unresolved items, and acceptance status.

### 5.1 Mandatory rejection conditions
Reject a revision when it:
- Repeats the previous composition with only superficial color, spacing, or decoration changes.
- Claims improvement without showing what changed and why.
- Introduces invented data, fake UI, fabricated relationships, or unsupported content.
- Breaks alignment, proportions, hierarchy, legibility, or responsive behavior.
- Uses decorative effects to conceal structural problems.
- Cannot be verified in the rendered artifact.

### 5.2 Acceptance checklist
- [ ] The visual purpose and reading path are immediately understandable.
- [ ] Geometry, spacing, alignment, and proportions are deliberate and consistent.
- [ ] Typography has a clear hierarchy and remains legible at target size.
- [ ] Color and effects serve meaning rather than decoration.
- [ ] No unsupported facts, data, relationships, or behavior were introduced.
- [ ] Relevant sizes, states, and responsive layouts were inspected.
- [ ] The revision demonstrates a specific improvement over the prior version.
- [ ] Source changes and rendered evidence are available for review.
- [ ] Approval status is explicit; unapproved work is not represented as final.

## 6. Change specification template

Use this structure when delegating a visual revision:

- **Target:** exact file, component, sheet, or asset.
- **Observed defect:** what is wrong in the current rendered result.
- **Required change:** concrete visual or behavioral modification.
- **Preserve:** elements and behavior that must not change.
- **Constraints:** dimensions, grid, tokens, content, states, and technical limitations.
- **Evidence required:** rendered screenshots or artifacts at named dimensions/states.
- **Acceptance test:** observable pass/fail conditions.
- **Issue reference:** the GitHub issue tracking the work.

Do not issue vague instructions such as “make it better,” “make it premium,” or “revamp it” without defining the defect and acceptance criteria.

## 7. HTG-specific application boundary

This standard supplies shared construction and quality methods. It does not override the HTG brand strategy or authorize new brand decisions.

For HTG:
- Preserve the proposed editorial, structured, restrained direction and precise geometric discipline.
- Keep logo A/B exploration meaningfully distinct until an approved direction exists.
- Keep HTG's identity and business ownership separate from the designer's identity.
- Do not imply ownership, partnership, endorsement, client status, or service availability without verified evidence.
- Keep unknown facts and unapproved content visibly marked as TBD.
- Apply the six-sheet sequence and approval gates defined in [Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10).

## 8. GitHub issue and commit traceability policy

**Every commit that changes project work must reference its governing GitHub issue in the commit message.** For the current HTG brand and website plan, use **#10**.

Recommended commit format:

```text
<type>(<scope>): <specific change> (#10)
```

Examples:

```text
docs(branding): add visual engineering standard (#10)
design(htg): define shared grid and typography tokens (#10)
fix(homepage): correct mobile hero alignment (#10)
```

Rules:
- Include the issue reference in every project commit, not only the final commit in a sequence.
- Use the most relevant existing issue when work belongs to another tracked task; do not attach unrelated work to #10.
- If no suitable issue exists, create or identify the correct issue before committing.
- Keep commit messages specific enough to identify the change.
- In the issue thread, record the commit SHA, commit link, changed paths, and a concise summary when the commit is pushed.
- Reference the issue in pull-request descriptions as well.
- Do not claim that a commit is indexed until GitHub shows the issue/commit association or the issue thread has a direct commit record.

This is a workflow policy for future work. It does not retroactively rewrite existing commit history.

## 9. Governance

- This document is a living standard; changes should be reviewed and committed with an issue reference.
- Project-specific approved specifications take precedence over generic guidance where they conflict.
- Record decisions and exceptions in the relevant issue.
- Keep historical revisions available; do not silently erase rejected directions or unresolved decisions.
- A written standard does not itself constitute approval of any visual asset.

## Revision history

| Revision | Status | Change |
|---|---|---|
| 1.0 | Working baseline | Consolidated project visual methods, construction practices, QA protocol, and issue/commit traceability policy. |
