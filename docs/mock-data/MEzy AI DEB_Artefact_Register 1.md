### 3. Artefact Register
23 artefacts across six categories. Scoped to what is needed for an 8-week integration project, not a greenfield AI build.

## 3.1 Governance

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A01 | Project Charter | One-page scope confirmation: DEB auto-population from existing MEzy AI JSON output for Josh's priority document types. Signed off by Josh and Ben. | Rupert | Week 1 | Not Started |
| A02 | RACI Matrix | Roles and responsibilities across Rupert (PM), Pat/Khanh (dev), Ben (governance), Josh (business sign-off), credit team (UAT). | Rupert | Week 1 | Not Started |
| A03 | Project Schedule | 8-week delivery plan with weekly milestones. Earlier delivery encouraged per Peter and Josh. | Rupert | Week 1 | Not Started |
| A04 | Weekly Status Report | Weekly progress update to Josh and Ben: completed, in progress, blockers, risks. | Rupert | Ongoing | Not Started |

## 3.2 Baseline Documentation (Critical Path)

These artefacts document what exists today and create the mapping that drives development. A05, A06, and A07 are critical path: development cannot start until the JSON schemas are documented and mapped to DEB fields.

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A05 | MEzy AI JSON Schema Spec | Word document containing the current production JSON output schemas for each priority document type. Sourced from the approved MEzy AI Document Spec XLS on the T: drive. Documents what MEzy AI outputs today, field by field. | Rupert / AI Team | Week 1 | Not Started |
| A06 | DEB Journey Field Inventory | Register of all fields on the existing DEB journey webpages, organised by UI section (Solution, Security, Who's on the Loan, Income, Financial Position, Credit History). Field name, field type, and UI location for each. | Pat / Khanh | Week 1 | Not Started |
| A07 | JSON-to-DEB Field Mapping | The core mapping document: each MEzy AI JSON output field mapped to its corresponding DEB journey webpage field. Developers to use Claude to assist. Cross-referenced against the technical document specs. | Pat / Khanh | Week 1-2 | In Progress |
| A08 | Gap Analysis | Any DEB fields not covered by existing MEzy AI JSON output, and any JSON fields with no corresponding DEB field. Identifies what works out of the box and what needs additional handling. | Pat / Khanh | Week 2 | Not Started |

## 3.3 Solution Design

Lightweight design artefacts for the integration layer. No architecture for an AI engine is required; MEzy AI is already built.

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A09 | Integration Design | Technical design for how DEB will consume MEzy AI JSON output and auto-populate webpage fields. Covers the trigger point (document upload), data flow, multi-applicant handling, and field-type conversions (dates, currencies). | Pat / Khanh | Week 2 | Not Started |
| A10 | Confidence and Review UX | Design for how auto-populated fields are presented to users: confidence indicators (green/amber/red), inline correction, accept/reject workflow. | Pat / Khanh | Week 2-3 | Not Started |
| A11 | Audit Trail Design | How AI-populated fields are logged: source document, field values, confidence scores, and any manual overrides. Required for lending compliance. | Pat / Khanh | Week 2-3 | Not Started |

## 3.4 Development Deliverables

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A12 | Auto-Population Engine | The integration code that reads MEzy AI JSON output and populates the corresponding DEB journey fields for each priority document type. | Pat / Khanh | Week 3-5 | Not Started |
| A13 | Confidence Scoring UI | Front-end implementation of per-field confidence indicators and the review/correction interface for credit officers. | Pat / Khanh | Week 4-5 | Not Started |
| A14 | Audit Trail Module | Back-end logging of all AI-populated fields, source documents, confidence scores, and user corrections. | Pat / Khanh | Week 4-5 | Not Started |
| A15 | Word Search / Risk Flagging | Keyword detection in valuations, bank statements, and home loan statements (existing MEzy AI risk terms) surfaced in the DEB UI. | Pat / Khanh | Week 5-6 | Not Started |

## 3.5 Testing and UAT

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A16 | Test Plan | Test approach for the integration: unit tests for field mapping, integration tests for end-to-end population, and UAT scenarios. | Rupert | Week 4 | Not Started |
| A17 | Test Document Set | Anonymised sample documents per priority type for testing extraction-to-population accuracy end to end. | Rupert / Credit | Week 2-4 | Not Started |
| A18 | UAT Scripts | Step-by-step test scenarios for the credit team: upload document, verify auto-populated fields, test correction workflow, confirm audit trail. | Rupert | Week 5-6 | Not Started |
| A19 | UAT Sign-off | Formal sign-off from credit team confirming auto-population meets accuracy and usability requirements for each priority document type. | Josh / Credit | Week 7 | Not Started |

## 3.6 Deployment & Post-Launch

| ID | Artefact | Description | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- |
| A20 | Deployment Runbook | Step-by-step deployment instructions for releasing the integration to production, including rollback procedures and go/no-go criteria. | Pat / Khanh | Week 6-7 | Not Started |
| A21 | Broker User Guide | End-user documentation covering document upload, auto-population review, confidence indicator interpretation, and correction workflow. | Rupert | Week 5-6 | Not Started |
| A22 | Go-Live Checklist | Pre-launch verification checklist confirming all systems, integrations, and support processes are ready for production rollout. | Rupert | Week 7 | Not Started |
| A23 | Post-Go-Live Review Report | Summary of hypercare period: accuracy metrics, incident log, user feedback, outstanding issues, and recommended roadmap refinements. | Rupert / Josh | Week 8 | Not Started |

---

## Task Breakdown (Mock Data)

> Project start: **2026-05-01** | Total duration: **8 weeks**
> Week 1: 01/05 – 07/05 | Week 2: 08/05 – 14/05 | Week 3: 15/05 – 21/05 | Week 4: 22/05 – 28/05
> Week 5: 29/05 – 04/06 | Week 6: 05/06 – 11/06 | Week 7: 12/06 – 18/06 | Week 8: 19/06 – 25/06
> estimateHours: 1 week = 40 h (8 h/day × 5 days)

```js
// projectId: "p10"
const mezyDEBArtefactTasks = [
  // ── 3.1 Governance ──────────────────────────────────────────────────────────
  {id: "t2001", projectId: "p10", title: "Project Charter",
    description: "One-page scope confirmation: DEB auto-population from existing MEzy AI JSON output for Josh's priority document types. Signed off by Josh and Ben.",
    status: "To Do", priority: "High", assigneeId: "u5",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t2002", projectId: "p10", title: "RACI Matrix",
    description: "Roles and responsibilities across Rupert (PM), Pat/Khanh (dev), Ben (governance), Josh (business sign-off), credit team (UAT).",
    status: "To Do", priority: "Medium", assigneeId: "u10",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t2003", projectId: "p10", title: "Project Schedule",
    description: "8-week delivery plan with weekly milestones. Earlier delivery encouraged per Peter and Josh.",
    status: "To Do", priority: "High", assigneeId: "sh2",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t2004", projectId: "p10", title: "Weekly Status Report",
    description: "Weekly progress update to Josh and Ben: completed, in progress, blockers, risks.",
    status: "To Do", priority: "Medium", assigneeId: "u17",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-06-25", oneDeskId: ""},

  // ── 3.2 Baseline Documentation (Critical Path) ──────────────────────────────
  {id: "t2005", projectId: "p10", title: "MEzy AI JSON Schema Spec",
    description: "Word document containing the current production JSON output schemas for each priority document type. Sourced from the approved MEzy AI Document Spec XLS on the T: drive.",
    status: "To Do", priority: "High", assigneeId: "u2",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t2006", projectId: "p10", title: "DEB Journey Field Inventory",
    description: "Register of all fields on the existing DEB journey webpages, organised by UI section. Field name, field type, and UI location for each.",
    status: "To Do", priority: "High", assigneeId: "sh1",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t2007", projectId: "p10", title: "JSON-to-DEB Field Mapping",
    description: "The core mapping document: each MEzy AI JSON output field mapped to its corresponding DEB journey webpage field. Developers to use Claude to assist.",
    status: "To Do", priority: "High", assigneeId: "u14",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-14", oneDeskId: ""},

  {id: "t2008", projectId: "p10", title: "Gap Analysis",
    description: "Any DEB fields not covered by existing MEzy AI JSON output, and any JSON fields with no corresponding DEB field. Identifies what works out of the box and what needs additional handling.",
    status: "To Do", priority: "High", assigneeId: "u9",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: ""},

  // ── 3.3 Solution Design ──────────────────────────────────────────────────────
  {id: "t2009", projectId: "p10", title: "Integration Design",
    description: "Technical design for how DEB will consume MEzy AI JSON output and auto-populate webpage fields. Covers trigger point, data flow, multi-applicant handling, and field-type conversions.",
    status: "To Do", priority: "High", assigneeId: "sh3",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: ""},

  {id: "t2010", projectId: "p10", title: "Confidence and Review UX",
    description: "Design for how auto-populated fields are presented to users: confidence indicators (green/amber/red), inline correction, accept/reject workflow.",
    status: "To Do", priority: "High", assigneeId: "u6",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-21", oneDeskId: ""},

  {id: "t2011", projectId: "p10", title: "Audit Trail Design",
    description: "How AI-populated fields are logged: source document, field values, confidence scores, and any manual overrides. Required for lending compliance.",
    status: "To Do", priority: "High", assigneeId: "u20",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-21", oneDeskId: ""},

  // ── 3.4 Development Deliverables ─────────────────────────────────────────────
  {id: "t2012", projectId: "p10", title: "Auto-Population Engine",
    description: "The integration code that reads MEzy AI JSON output and populates the corresponding DEB journey fields for each priority document type.",
    status: "To Do", priority: "High", assigneeId: "u3",
    estimateHours: 120, actualHours: null,
    startDate: "2026-05-15", dueDate: "2026-06-04", oneDeskId: ""},

  {id: "t2013", projectId: "p10", title: "Confidence Scoring UI",
    description: "Front-end implementation of per-field confidence indicators and the review/correction interface for credit officers.",
    status: "To Do", priority: "High", assigneeId: "u22",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-22", dueDate: "2026-06-04", oneDeskId: ""},

  {id: "t2014", projectId: "p10", title: "Audit Trail Module",
    description: "Back-end logging of all AI-populated fields, source documents, confidence scores, and user corrections.",
    status: "To Do", priority: "High", assigneeId: "sh4",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-22", dueDate: "2026-06-04", oneDeskId: ""},

  {id: "t2015", projectId: "p10", title: "Word Search / Risk Flagging",
    description: "Keyword detection in valuations, bank statements, and home loan statements (existing MEzy AI risk terms) surfaced in the DEB UI.",
    status: "To Do", priority: "High", assigneeId: "u8",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: ""},

  // ── 3.5 Testing and UAT ──────────────────────────────────────────────────────
  {id: "t2016", projectId: "p10", title: "Test Plan",
    description: "Test approach for the integration: unit tests for field mapping, integration tests for end-to-end population, and UAT scenarios.",
    status: "To Do", priority: "Medium", assigneeId: "u11",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-22", dueDate: "2026-05-28", oneDeskId: ""},

  {id: "t2017", projectId: "p10", title: "Test Document Set",
    description: "Anonymised sample documents per priority type for testing extraction-to-population accuracy end to end.",
    status: "To Do", priority: "Medium", assigneeId: "u15",
    estimateHours: 120, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-28", oneDeskId: ""},

  {id: "t2018", projectId: "p10", title: "UAT Scripts",
    description: "Step-by-step test scenarios for the credit team: upload document, verify auto-populated fields, test correction workflow, confirm audit trail.",
    status: "To Do", priority: "High", assigneeId: "u4",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: ""},

  {id: "t2019", projectId: "p10", title: "UAT Sign-off",
    description: "Formal sign-off from credit team confirming auto-population meets accuracy and usability requirements for each priority document type.",
    status: "To Do", priority: "High", assigneeId: "u1",
    estimateHours: 40, actualHours: null,
    startDate: "2026-06-12", dueDate: "2026-06-18", oneDeskId: ""},

  // ── 3.6 Deployment & Post-Launch ─────────────────────────────────────────────
  {id: "t2020", projectId: "p10", title: "Deployment Runbook",
    description: "Step-by-step deployment instructions for releasing the integration to production, including rollback procedures and go/no-go criteria.",
    status: "To Do", priority: "High", assigneeId: "u16",
    estimateHours: 80, actualHours: null,
    startDate: "2026-06-05", dueDate: "2026-06-18", oneDeskId: ""},

  {id: "t2021", projectId: "p10", title: "Broker User Guide",
    description: "End-user documentation covering document upload, auto-population review, confidence indicator interpretation, and correction workflow.",
    status: "To Do", priority: "Medium", assigneeId: "u23",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: ""},

  {id: "t2022", projectId: "p10", title: "Go-Live Checklist",
    description: "Pre-launch verification checklist confirming all systems, integrations, and support processes are ready for production rollout.",
    status: "To Do", priority: "High", assigneeId: "sh2",
    estimateHours: 40, actualHours: null,
    startDate: "2026-06-12", dueDate: "2026-06-18", oneDeskId: ""},

  {id: "t2023", projectId: "p10", title: "Post-Go-Live Review Report",
    description: "Summary of hypercare period: accuracy metrics, incident log, user feedback, outstanding issues, and recommended roadmap refinements.",
    status: "To Do", priority: "Medium", assigneeId: "u7",
    estimateHours: 40, actualHours: null,
    startDate: "2026-06-19", dueDate: "2026-06-25", oneDeskId: ""},
];
```
