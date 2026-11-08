# HTG Website Revamp Plan

> **Project:** Hopkins Talent Group (HTG) website revamp  
> **Status:** Proposed execution plan — approval and verification dependencies remain open  
> **Governing tracker:** [Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10)  
> **Strategy source:** [HTG Brand Research](../research/branding/README.md)  
> **Visual method:** [Visual Engineering Design Standard](../research/visual-engineering/VISUAL_DESIGN_STANDARD.md)

## 1. Purpose and authority

This document owns the website-specific execution plan: information architecture, page responsibilities, visitor journeys, content requirements, implementation workstreams, and website acceptance.

It does not redefine HTG's business strategy, positioning, capability taxonomy, audience hierarchy, or relationship classifications. Those are maintained in [HTG Brand Research](../research/branding/README.md). If a conflict appears, pause affected work and record the decision in Issue #10; do not silently create a second definition.

This is a plan, not evidence that designs, content, approvals, implementation, legal review, or release are complete.

## 2. Website objectives

The website should:
1. Explain HTG's role in clear, factual language.
2. Help visitors identify a relevant pathway.
3. Distinguish HTG-delivered services from operating businesses, partners, clients, referrals, and unverified relationships.
4. Route each inquiry to a confirmed destination and accountable owner.
5. Work accessibly and reliably across supported screen sizes.

The experience model is Hub & Spoke as defined in the brand strategy. The website must not imply that HTG owns or directly delivers every service or organization displayed.

## 3. Visitor tasks and journeys

Design journeys only after confirming audience priorities and capability definitions in the brand strategy.

| Visitor task | Website responsibility | Required evidence before publication |
|---|---|---|
| Understand HTG | Explain the organization and coordinating role | Approved business description and positioning |
| Explore a capability | Present relevant service information and limitations | Verified service, delivery entity, geography, availability |
| Identify a route | Offer clear audience-appropriate navigation | Approved audience mapping and CTA |
| Evaluate a network participant | Explain the actual relationship | Verified classification and permission |
| Make an inquiry | Collect necessary information and route it correctly | Confirmed form purpose, recipient, notices, owner, handling |

Do not invent response times, lead ownership, eligibility, service guarantees, commission terms, or investor access.

## 4. Proposed information architecture

This sitemap is a working proposal. Validate it against approved services, audience priorities, content availability, and operational ownership.

| Page / route | Purpose | Required content |
|---|---|---|
| Home | Explain HTG and route visitors | Approved positioning, verified capability entry points, pathways, approved proof, primary CTA |
| About HTG | Explain the organization and operating model | Approved business description, role of the hub, verified background |
| Capabilities | Help visitors compare pathways | Approved capability summaries and links to confirmed services |
| Capability detail | Explain a specific service | Audience, scope, provider/delivery status, geography, process, limitations, CTA |
| Network / Partners | Explain verified ecosystem relationships | Approved descriptions, relationship labels, permissions, disclosures |
| Artists & Events | Route relevant talent and event inquiries | Verified offerings, responsibilities, eligibility, inquiry process |
| Referral Partners | Explain approved collaboration pathways | Qualification, process, written terms where applicable |
| Contact / Inquiry | Route requests responsibly | Inquiry categories, required fields, privacy notices, confirmation and error states |

Do not create a route merely to fill the sitemap. If a service or relationship is unverified, omit the public claim until resolved.

## 5. Homepage content architecture

This is a structural sequence, not approved copy or final visual design.

1. **Header:** approved HTG identity, concise navigation, primary CTA only when destination and owner are confirmed.
2. **Hero:** clear statement of what HTG is and whom it connects; avoid unsupported superlatives and vague promises.
3. **Capability entry points:** use capability definitions and service availability approved in the brand strategy.
4. **How the network works:** explain movement from visitor need to provider, operating business, or introduction; identify responsibility accurately.
5. **Audience routes:** present only approved pathways with useful next steps.
6. **Verified proof:** permissioned testimonials, case studies, credentials, metrics, or third-party marks only when substantiated.
7. **Closing CTA:** one clear action tied to a functioning route and accountable owner.
8. **Footer:** accurate business/contact information and applicable privacy, terms, registration, licensing, and service disclosures.

All headlines, descriptions, and CTA language remain proposed until approved.

## 6. Content model and publication controls

For each page section or service record, maintain:
- Stable content identifier and page/route.
- Approved title and description.
- Intended audience and visitor task.
- Capability/service reference from the brand strategy.
- Delivery entity and relationship classification.
- Geographic scope, eligibility, and current availability.
- Evidence/source and last-verified date.
- Permission status for names, logos, images, testimonials, and case-study material.
- Required qualifier/disclosure.
- CTA destination and operational owner.
- Content approver and approval date.

The relationship taxonomy and rules are owned by [HTG Brand Research §2.3](../research/branding/README.md). This plan consumes those classifications; it must not introduce a competing taxonomy.

**Publication rule:** no unverified claim, logo, endorsement, testimonial, credential, metric, service promise, or relationship is published. Unknown items remain omitted or clearly marked as internal placeholders.

## 7. Design handoff dependency

The six-sheet design handoff, approval sequence, and export/source-file requirements are governed by [Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10) and the brand strategy. This plan does not reproduce sheet specifications.

Website-specific design inputs:
- Approved sitemap and page purpose.
- Desktop, tablet, and mobile behavior.
- Content-length and missing-content states.
- Navigation, form, CTA, focus, and error states.
- Legal/disclosure layout slots.
- Verified content and permissioned assets.

Use the [Visual Engineering Design Standard](../research/visual-engineering/VISUAL_DESIGN_STANDARD.md) for geometry, grid, typography, color application, composition, and visual QA.

## 8. Implementation workstreams

### A — Existing-site and technical discovery
- Inventory current routes, pages, components, assets, forms, and integrations.
- Record existing behavior before changing it.
- Verify framework, deployment platform, domain/DNS, hosting constraints, and environment configuration from repository and operator evidence.
- Identify technical risks and dependencies.

**Exit evidence:** route inventory, component/asset inventory, deployment facts with sources, baseline screenshots, issue list.

### B — UX and content architecture
- Validate sitemap and navigation against approved strategy.
- Define page templates and reusable content structures.
- Map each route to a visitor task and approved CTA.
- Confirm form purpose, data minimization, notices, recipient, and inquiry owner.
- Reserve applicable legal/disclosure content slots.

**Exit evidence:** approved sitemap, page outlines, journey map, content model, CTA/recipient register.

### C — Visual design
- Apply approved identity direction and design-system tokens.
- Produce page-level layouts and responsive states.
- Validate real content, including long, missing, and empty states.
- Record review feedback and measurable revisions.

**Exit evidence:** approved design artifacts, source files, tokens/assets, responsive comparisons, decision record.

### D — Frontend implementation
- Implement approved routes and responsive layouts.
- Reuse components where behavior and semantics are genuinely shared.
- Integrate only verified content and approved data sources.
- Implement forms and CTAs only against confirmed endpoints.
- Preserve semantic structure, keyboard operation, visible focus, and reduced-motion preferences.
- Do not add analytics or third-party integrations without an approved purpose, privacy/consent treatment, and configuration.

**Exit evidence:** implemented routes, component/state inventory, functional tests, responsive screenshots, integration record.

### E — Content integration and QA
- Load approved copy and permissioned assets.
- Check service descriptions, relationship labels, disclosures, and destinations.
- Test form validation, success, error, and abuse-protection behavior.
- Test supported browsers and viewport sizes.
- Run accessibility, performance, metadata, link, and regression checks.

**Exit evidence:** content sign-off, QA report, accessibility findings, performance results, defect log, release candidate.

### F — Release and post-launch
- Confirm deployment target, domain/DNS, environment variables, backups, and rollback procedure.
- Obtain required business, content, technical, and legal approvals.
- Deploy only after blocking acceptance criteria pass.
- Run production smoke tests and verify inquiry routing.
- Monitor agreed operational indicators and record post-launch defects.

**Exit evidence:** release approval, deployment record, rollback plan, smoke-test report, post-launch review.

## 9. Website acceptance criteria

A page is not accepted because a screenshot looks complete. Each applicable criterion needs a test result and evidence.

### Content and accuracy
- [ ] Page purpose and audience are clear.
- [ ] All public claims trace to approved content.
- [ ] Service availability, provider, scope, and geography are verified.
- [ ] Relationship labels and third-party permissions are correct.
- [ ] No unsupported testimonials, metrics, credentials, guarantees, or endorsements.
- [ ] CTAs have confirmed destinations and operational owners.
- [ ] Applicable legal/disclosure content has been reviewed by the responsible qualified party.

### UX and responsive behavior
- [ ] Navigation and core tasks work on supported desktop, tablet, and mobile sizes.
- [ ] No critical content is clipped or horizontally overflows.
- [ ] Long, missing, empty, and error states are handled.
- [ ] Forms explain purpose, required fields, notices, errors, and next steps.
- [ ] Keyboard users can reach and operate all interactive controls.

### Accessibility and technical quality
- [ ] WCAG 2.2 AA is the target for applicable content and interactions.
- [ ] Text and UI contrast are tested; grayscale review is supplemental only.
- [ ] Semantic structure, accessible names, focus visibility, and keyboard behavior are verified.
- [ ] Images have meaningful alternative text or are decorative.
- [ ] Reduced-motion preferences are respected.
- [ ] Performance, metadata, links, and cross-browser behavior are tested.
- [ ] No secrets, private data, or unapproved tracking are exposed.

### Evidence record
For every gate, retain the requirement, test method/environment, expected and actual result, evidence link, reviewer/date, and defect reference/resolution. Do not mark a gate passed without evidence.

## 10. Website-specific dependencies

Business strategy, audience priority, relationship classification, brand approval, and the master approval blocker are maintained in [HTG Brand Research](../research/branding/README.md) and [Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10). Do not maintain duplicate copies here.

| ID | Website-specific dependency | Owner | Target date | Until resolved |
|---|---|---|---|---|
| W-01 | Current website route/content/asset inventory | TBD | TBD | Discovery incomplete |
| W-02 | Verified framework, hosting, deployment, domain, and DNS facts | TBD | TBD | No platform-specific assumptions |
| W-03 | Form purpose, required fields, recipient, privacy notice, and inquiry owner per route | TBD | TBD | Do not activate unowned CTA/form |
| W-04 | Approved content model/CMS or source-of-truth decision | TBD | TBD | Use controlled placeholders |
| W-05 | Analytics, cookies, integrations, and consent requirements | TBD | TBD | Do not add tracking/integrations |
| W-06 | Backup, rollback, monitoring, and release operator | TBD | TBD | Release blocked |

Owners and dates remain TBD until assigned by the authorized project decision-maker. Silence is not approval.

## 11. Risks and controls

| Risk | Control |
|---|---|
| Website repeats or contradicts strategy | Keep strategic definitions in the brand research source; link rather than duplicate |
| Website implies unverified ownership or service delivery | Use approved relationship and delivery classifications |
| Visitors cannot identify a useful next step | Map each page to a visitor task and verified CTA |
| Inquiry has no accountable recipient | Confirm recipient and operational owner before activation |
| Visual polish hides navigation/content problems | Test page tasks and comprehension before decorative refinement |
| Legal or privacy obligations are missed | Reserve content slots and obtain qualified review |
| Repeated cosmetic revisions produce no progress | Require a defect statement, measurable change, rendered comparison, and evidence |

## 12. Change control

- Issue #10 is the governing decision and approval thread.
- Related commit messages must reference (#10) using the repository convention.
- Record material scope, architecture, content, and release decisions in Issue #10.
- Update this README only for website-specific changes; update brand research only for strategic changes.
- Link PRs and commits to affected routes, tests, evidence, and unresolved risks.
- Never silently change approved facts or decisions.

## 13. Related documents

- [Documentation index](../README.md)
- [Governing Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10)
- [HTG Brand Research](../research/branding/README.md)
- [Visual Engineering Design Standard](../research/visual-engineering/VISUAL_DESIGN_STANDARD.md)
- [Brand Portfolio & Social Research Framework](../research/brand-portfolio-social-research/PORTFOLIO_AND_SOCIAL_RESEARCH_FRAMEWORK.md)
- [Inquiry Email — Website to VPS](../inquiry-email.md)

## 14. Status

**Planning baseline only.** This file does not certify business verification, approved copy, final sitemap, completed design, implementation, legal review, accessibility conformance, or release approval. Update status only when linked evidence supports the change.
