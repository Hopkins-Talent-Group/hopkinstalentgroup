# Brand Portfolio, Co-Branding & Social Communication Research Framework

**Document ID:** BPSR-001  
**Project context:** HTG Brand Identity & Website Design Handoff — Strategy Iteration 01  
**Revision:** 1  
**Status:** Research framework — proposed; not an approved operating or measurement model  
**Governance:** [GitHub Issue #10](https://github.com/vitrixLab/hopkinstalentgroup/issues/10)  
**Companion research:** [HTG Brand Research & Strategy](../branding/README.md)  
**Visual standard:** [Visual Engineering Design Standard](../visual-engineering/VISUAL_DESIGN_STANDARD.md)

> This document translates the portfolio, co-branding, social communication, and research-method ideas supplied for synthesis into a cautious framework for future HTG decisions. It does not assert that the referenced analyses have been run on HTG data. No notebook datasets, outputs, or analysis scripts were present in the repository review used for this revision.

---

## 1. Purpose and boundary

**Document ownership:** this file owns research methods and evidence frameworks for portfolio/co-branding and social communication. HTG business facts, capability taxonomy, audience hypotheses, and relationship classifications are maintained in [HTG Brand Research](../branding/README.md). Visual construction rules are maintained in the [Visual Engineering Design Standard](../visual-engineering/VISUAL_DESIGN_STANDARD.md). Website execution is maintained in the [Website Revamp Plan](../../website-revamp/README.md). This document may analyze these topics but must not create competing definitions.

The framework connects four disciplines:

1. **Brand architecture and relationship governance** — accurately represent how the central HTG identity relates to operating businesses, brands, partners, clients, referrals, and projects.
2. **Portfolio-level resource allocation** — assess the collective value, fit, cost, risk, and readiness of initiatives rather than rewarding one visible sub-brand or channel by default.
3. **Social communication research** — classify audience comments and interactions with a reproducible codebook, combining qualitative interpretation and quantitative summaries.
4. **Visual and editorial governance** — reduce competing signals through hierarchy, controlled color, grayscale validation, and evidence-based review.

This is an analytical framework, not permission to describe every ecosystem participant as an HTG-owned sub-brand. Issue #10's six relationship classes remain authoritative. The portfolio concept must not collapse legally or operationally distinct businesses into a fictitious corporate group.

## 2. Portfolio strategy: optimize the system, not isolated activity

### 2.1 Portfolio-level question

When several capabilities, brands, channels, or collaborations compete for limited attention and resources, evaluate the contribution of each option to the overall ecosystem. The objective is not simply to maximize the reach of the loudest service or the performance of a single campaign.

Evaluate each candidate against:
- verified strategic fit with HTG's role and audiences;
- relationship status and permission to represent the entity;
- audience need and evidence of demand;
- expected contribution to shared ecosystem outcomes;
- delivery capacity and operational readiness;
- cost, risk, dependency, and opportunity cost;
- measurement quality and confidence in the evidence.

Do not allocate budget, staff, prominence, or design emphasis using invented performance numbers. Where evidence is absent, mark the input **unknown** and use a documented qualitative assessment rather than a fabricated score.

### 2.2 Relationship graph before portfolio optimization

Represent the ecosystem as a relationship graph only after each edge is verified. A record should include:
- entity name and stable identifier;
- relationship class (owned business, operating brand, strategic partner, client relationship, referral opportunity, project under development, or other verified class);
- evidence source and verification date;
- permission/mark-use status;
- delivery responsibility and geography, where applicable;
- audience/service fit;
- financial or operational dependency, if confirmed;
- confidence and unresolved questions.

A visual connection is not proof of ownership, endorsement, or control. Unknown edges remain unconnected or explicitly provisional. Use neutral text labels when a mark or relationship has not been cleared.

### 2.3 Resource-allocation model — future research, not current decision

A future allocation model may compare initiatives using a constrained objective such as:
- maximize verified collective audience value or strategic contribution;
- subject to total budget, capacity, compliance, partner willingness, and risk constraints;
- preserve minimum investment or visibility for strategically important but less mature capabilities where justified;
- avoid repeated spending where initiatives duplicate one another or compete for the same audience attention.

Potential approaches include multi-criteria decision analysis, constrained optimization, and online learning when repeated campaign feedback is available. These methods require defined outcomes, reliable cost data, constraints, and sufficient observations. Do not claim an algorithmic optimum from a qualitative strategy document.

**Exploration vs. exploitation:** reserve a controlled share of experimentation for genuinely uncertain opportunities while maintaining evidence-backed activity. Set the balance only after baseline data, risk tolerance, budget, and decision horizon are known. Do not present a generic exploration/exploitation ratio as a research finding.

### 2.4 Practical HTG application

For the current HTG plan, use portfolio thinking to:
- prevent one capability pillar from visually overwhelming the whole ecosystem without a verified audience reason;
- distinguish active delivery from referrals and projects under development;
- assess whether audience pathways reinforce one another or create confusing competition;
- prioritize content and design work based on approved audience needs, readiness, and evidence;
- keep each entity's identity and relationship status accurate.

No budget allocation, partner priority, ownership structure, or sub-brand endorsement is decided by this document.

## 3. Social communication and comment research

### 3.1 Research foundation and correct attribution

[Godey et al. (2016)](https://doi.org/10.1016/j.jbusres.2016.04.181) studied social-media marketing efforts and brand equity/consumer responses for five luxury brands using a survey of 845 consumers across China, France, India, and Italy. Their model examines entertainment, interaction, trendiness, customization, and word of mouth. It is useful as a conceptual reference for social-media marketing and brand equity, but its luxury-brand sample and survey design do not establish HTG audience behavior or a universal causal rule.

[Chu and Kim (2011)](https://doi.org/10.2501/IJA-30-1-047-075) examine consumer engagement in electronic word of mouth on social networking sites. Related eWOM literature distinguishes **opinion seeking**, **opinion giving**, and **opinion passing**. These are useful conceptual dimensions, but comment-level labels must be operationalized for the actual platform, language, and research question. A single comment may express more than one behavior or none of them.

Do not attribute the opinion-seeking/giving/passing taxonomy to Godey et al.; it is a separate research strand.

### 3.2 Proposed comment-level codebook

Use multi-label coding where a comment can carry more than one valid label. At minimum, consider:

| Dimension | Example labels | Coding caution |
|---|---|---|
| Communicative intent | Opinion seeking; opinion giving; opinion passing; question/inquiry; response; complaint; praise; neutral statement | Code what the text does, not the author's presumed personality |
| Sentiment | Positive; negative; mixed; neutral; unclear/ironic | Separate sentiment toward the brand, a service, a post, and another commenter |
| Topic | Insurance/credit/energy; marketing/sales; websites/AI/business; artists/events/connections; general HTG; unrelated | Allow multiple topics and an out-of-scope label |
| Audience signal | Customer/homeowner; referral partner; artist/manager; investor; unknown | Infer only when explicit in the text; do not identify a person |
| Journey stage | Discovery; consideration; request for information; service issue; advocacy; unknown | Do not infer conversion or intent from a like or generic emoji |
| Actionability | Needs reply; needs escalation; informational; spam/abuse; no action | Define response ownership and service-level expectations separately |
| Evidence confidence | High; medium; low; unresolved | Preserve ambiguous and sarcastic cases for human review |

Record the original text reference, platform, post/context, timestamp, language, coding version, and any redaction needed. Minimize retained personal data. Do not infer sensitive traits.

### 3.3 Qualitative and quantitative workflow

1. Define the research question, population, platform, period, unit of analysis, and sampling method.
2. Build a codebook with inclusion/exclusion rules and positive/negative examples.
3. Pilot the codebook on a small, diverse sample; refine ambiguous categories.
4. Have at least two trained coders independently code a subset when feasible.
5. Assess inter-coder agreement with an appropriate statistic (for example, Cohen's kappa for two coders and suitable categorical labels, or Krippendorff's alpha for broader designs). Report prevalence and class imbalance; raw agreement alone can mislead.
6. Resolve disagreements using a documented adjudication process. Keep the original independent codes for reliability reporting.
7. Code the remaining sample, preserving an explicit unknown/uncodable state.
8. Report counts and rates with denominators, sampling limitations, platform/time boundaries, and uncertainty.
9. Use qualitative excerpts only when permission and privacy rules allow; anonymize and avoid unnecessary personal details.
10. Convert findings into recommendations only after checking evidence quality, practical relevance, and possible alternative explanations.

A comment corpus is not automatically representative of all customers or the wider market. Platform algorithms, moderation, self-selection, campaign timing, language, and audience composition can bias what is observed.

### 3.4 Statistical methods: use only when assumptions fit

- **Descriptive analysis:** counts, proportions, distributions, cross-tabs, and time trends are appropriate starting points. Always show denominators and missing/unknown counts.
- **Cronbach's alpha:** assess internal consistency of a multi-item scale when a reflective construct and scale assumptions justify it. It is not a sentiment classifier and is not inter-coder reliability.
- **KMO and Bartlett's test:** diagnostics used when considering factor analysis of suitable item-level data. They do not validate a comment codebook or prove that factors are meaningful.
- **Exploratory/confirmatory factor analysis:** use only with an appropriate sample, item structure, and theory; report extraction, rotation, loadings, fit, and validation decisions.
- **Regression:** estimate associations conditional on model assumptions and measured covariates. Observational regression alone does not establish causality.
- **Structural equation modeling:** potentially useful for theory-driven relationships among measured constructs, with sample-size, measurement, fit, and identification requirements. Do not treat a published model as automatically transferable to HTG.
- **Sentiment or intent automation:** compare model labels against a human-coded validation set; report per-class precision/recall and confusion patterns. Human review remains important for irony, mixed sentiment, local language, slang, and context.

Do not run factor analysis on arbitrary comment labels simply because KMO/Bartlett are familiar research tests. Choose the method based on the data type and research question.

## 4. From audience evidence to brand and content decisions

Translate research into decisions through a traceable chain:

**Observed data → coding/measurement → quality assessment → finding → interpretation → proposed action → approval → post-change measurement.**

For every proposed change, record:
- the source dataset and collection window;
- the method and codebook/model version;
- sample size, exclusions, missing data, and limitations;
- the actual finding, including uncertainty;
- the interpretation and plausible alternative explanations;
- the affected audience, capability, relationship, or content;
- the proposed change and its owner;
- the success measure and review date;
- the approval status.

Do not convert a correlation, comment count, sentiment percentage, or isolated testimonial into an unsupported promise or proof claim.

## 5. Visual and editorial implications

### 5.1 Attention competition and hierarchy

Treat over-saturation as one possible form of attention competition, not the only cause. Competing headlines, dense labels, too many accents, weak grouping, unclear ownership, and inconsistent scale can all fragment attention.

The design response is to:
- establish one primary message and a deliberate reading order;
- group related content by meaning;
- reduce decorative and repeated elements;
- use neutral surfaces to support rather than compete with content;
- reserve accent color for a small number of semantically meaningful actions or states;
- keep relationship labels explicit rather than relying on color alone.

### 5.2 70–20–10 is a heuristic, not a standard

The 70% neutral / 20% supporting / 10% accent distribution may be used as a starting hypothesis for a particular composition. It is not a universal law, an accessibility criterion, or an approved HTG token specification. Adjust the proportions according to information density, audience, medium, contrast, and semantic role. Record the rationale and test the actual rendered result.

The sample colors supplied in the synthesis (#101722, #F5F5F2, #AEB7C2, #B51F32) are not approved HTG colors. They must not be copied into HTG identity tokens. Any external/studio palette is a separate identity and remains outside HTG brand ownership.

### 5.3 Grayscale and accessibility gates

Every substantive composition should be inspected in grayscale before color treatment is accepted. Check whether:
- primary/secondary hierarchy remains clear;
- text, icons, borders, and grouped regions remain distinguishable;
- status and relationship information is not conveyed by hue alone;
- contrast and legibility remain sufficient at actual output size.

Grayscale inspection is a structural diagnostic, not a substitute for color-contrast measurement, keyboard/focus checks, semantic structure, or WCAG 2.2 AA verification for applicable interfaces. Some color distinctions may be intentionally semantic; pair them with labels, shape, pattern, or other redundant cues.

## 6. Evidence required before claiming project findings

No HTG-specific empirical conclusion should be published until the following are available and reviewed:
- original notebook(s), dataset provenance, and data dictionary;
- lawful collection basis and privacy/permission review;
- reproducible cleaning and preprocessing steps;
- codebook and coding instructions;
- sample selection, size, dates, platforms, languages, and exclusions;
- reliability/validity evidence appropriate to the method;
- complete analysis outputs, assumptions, diagnostics, and limitations;
- interpretation linked to the actual output rather than a summary paraphrase;
- named reviewer/approver and decision record.

**Current evidence status:** the Gemini synthesis is a secondary summary supplied for discussion. The referenced notebook sources were not attached or independently inspected for this revision. Therefore, all HTG empirical findings, coefficients, reliability values, audience proportions, and optimization results remain **unverified / not asserted**.

## 7. References

1. Godey, B., Manthiou, A., Pederzoli, D., Rokka, J., Aiello, G., Donvito, R., & Singh, R. (2016). *Social media marketing efforts of luxury brands: Influence on brand equity and consumer behavior.* Journal of Business Research, 69(12), 5833–5841. [https://doi.org/10.1016/j.jbusres.2016.04.181](https://doi.org/10.1016/j.jbusres.2016.04.181)
2. Chu, S.-C., & Kim, Y. (2011). *Determinants of consumer engagement in electronic word-of-mouth (eWOM) in social networking sites.* International Journal of Advertising, 30(1), 47–75. [https://doi.org/10.2501/IJA-30-1-047-075](https://doi.org/10.2501/IJA-30-1-047-075)
3. Dai, X., Sun, X., Zuo, J., Liu, X., & Lui, J. C. S. (2025). *A Unified Online-Offline Framework for Co-Branding Campaign Recommendations.* Proceedings of the 31st ACM SIGKDD Conference on Knowledge Discovery and Data Mining, 427–438. [https://doi.org/10.1145/3711896.3736824](https://doi.org/10.1145/3711896.3736824)
4. Kral, P., Janoskova, K., & Durana, P. (2019). *Linear Model for Brand Portfolio Optimization.* Economics and Culture, 16(1), 32–39. [https://doi.org/10.2478/jec-2019-0004](https://doi.org/10.2478/jec-2019-0004)
5. Morgan, N. A., & Rego, L. L. (2009). *Brand Portfolio Strategy and Firm Performance.* Journal of Marketing, 73(1), 59–74. [https://doi.org/10.1509/jmkg.73.1.059](https://doi.org/10.1509/jmkg.73.1.059)

## 8. Revision history

| Revision | Status | Description |
|---|---|---|
| 1 | Proposed framework | Synthesized portfolio-level strategy, co-branding/resource allocation, eWOM comment classification, statistical-method boundaries, and grayscale/color governance. Added source references and explicit evidence limitations. |

---

**Working rule:** optimize collective value only across verified relationships, interpret social signals only through reproducible methods, and let evidence—not decoration or assumed metrics—determine the next decision.
