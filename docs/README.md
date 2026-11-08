# Documentation Index

This directory contains the maintained project documentation. Each subject has one canonical owner; other documents should link to that owner instead of copying its definitions or checklists.

## Canonical documents

| Document | Owns | Does not own |
|---|---|---|
| [HTG Brand Research](research/branding/README.md) | HTG strategic context, positioning hypothesis, capability architecture, audience hypotheses, relationship taxonomy, brand identity strategy, brand-level open decisions | Detailed website sitemap/implementation; visual construction methodology; statistical research procedures |
| [HTG Website Revamp Plan](website-revamp/README.md) | Website sitemap, page responsibilities, visitor journeys, content model, implementation workstreams, website-specific dependencies and acceptance | HTG business strategy/taxonomy; master brand approval register; visual construction methodology; SMTP implementation details |
| [Visual Engineering Design Standard](research/visual-engineering/VISUAL_DESIGN_STANDARD.md) | Geometry, grids, typography, composition, color application, visual QA, evidence-based visual review | HTG business claims, service taxonomy, website information architecture |
| [Brand Portfolio & Social Research Framework](research/brand-portfolio-social-research/PORTFOLIO_AND_SOCIAL_RESEARCH_FRAMEWORK.md) | Portfolio/co-branding research, social communication methods, statistical-method boundaries, evidence requirements | HTG ownership/relationship facts; final brand decisions; website implementation |
| [Inquiry Email — Website to VPS](inquiry-email.md) | Inquiry endpoint architecture, SMTP configuration, security controls, deployment assumptions, operational verification and troubleshooting | Website strategy, page design, brand decisions, general website QA |

## Governance and authority

1. Approved business facts and decisions recorded by the authorized approver take precedence.
2. [Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10) is the governing project decision, approval, and change-tracking thread.
3. Each canonical document owns only the subject listed above.
4. A secondary document may summarize a dependency briefly, but must link to the canonical source and must not maintain a competing taxonomy, decision register, or acceptance checklist.
5. Unapproved hypotheses remain labeled proposed. Unknown facts, owners, dates, and permissions remain TBD; silence is not approval.
6. Every related commit references (#10) per repository convention. Record meaningful decisions and evidence in Issue #10.

## Cross-document change rules

- Change HTG positioning, capability definitions, audience hypotheses, or relationship classifications in **Brand Research** first.
- Change sitemap, page structure, visitor journey, content model, website implementation, or website QA in **Website Revamp Plan**.
- Change visual construction methods or visual QA in **Visual Engineering Design Standard**.
- Change research methodology, statistical interpretation, portfolio-analysis framework, or social-comment coding in **Brand Portfolio & Social Research Framework**.
- Change inquiry endpoint, SMTP, mail security, or VPS email operations in **Inquiry Email**.
- When a change affects more than one domain, update the canonical owner first, then update only the necessary cross-reference or dependent specification.

## Current documentation status

These documents are planning/research and technical records, not blanket evidence of approval or production completion. Each file's status statement and linked evidence govern its claims.
