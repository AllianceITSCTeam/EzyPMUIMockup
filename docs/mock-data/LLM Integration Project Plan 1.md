Work Breakdown Structure (WBS)

| WBS # | Work Package | Description | Duration |
| --- | --- | --- | --- |
| 1.0 | Project Initiation | | 2 weeks |
| 1.1 | Stakeholder alignment workshops | Align on scope, priorities, and success criteria with Mick, Mel, Pat, and credit team | 1 week |
| 1.2 | Infrastructure & environment setup | Provision cloud environments, CI/CD pipelines, dev/staging/prod | 1 week |
| 2.0 | Phase 1 – Discovery & PoC | | 4 weeks |
| 2.1 | Document corpus collection | Gather 50+ sample documents per type from production (anonymised) | 2 weeks |
| 2.2 | LLM model benchmarking | Evaluate 2–3 LLM candidates against gold-standard extraction targets | 2 weeks |
| 2.3 | PoC demo to stakeholders | Demonstrate extraction accuracy on 5 core document types | 1 week |
| 3.0 | Phase 2 – Core Engine Development | | 8 weeks |
| 3.1 | Document Ingestion Service | Build upload normalisation, format handling, routing pipeline | 2 weeks |
| 3.2 | Document Classification Engine | Train/configure LLM-based document type classifier for 24 types | 2 weeks |
| 3.3 | LLM Extraction Engine (Tier 1) | Build extraction for core docs: Contract of Sale, Trust Deeds, Payslips, Tax Returns, ID Documents | 4 weeks |
| 3.4 | LLM Extraction Engine (Tier 2) | Extend extraction to remaining docs: Bank Statements, Valuations, Credit Reports, CMA, Rental, BAS | 4 weeks |
| 3.5 | Word Search / Risk Flagging | Implement keyword detection for Valuations (28 risk terms), Bank Statements (12 terms), Home Loan Statements (21 terms) | 2 weeks |
| 3.6 | Field Mapping Service | Build JSON-to-UI field mapping with multi-applicant logic | 3 weeks |
| 4.0 | Phase 3 – UI Integration | | 4 weeks |
| 4.1 | Enhanced Doc Upload UI | Drag-and-drop, batch upload, progress indicators, auto-classification preview | 2 weeks |
| 4.2 | Confidence & Review overlay | Per-field confidence indicators, inline correction, accept/reject controls | 2 weeks |
| 4.3 | Field pre-population integration | Wire Field Mapping Service outputs to all 12 DEB SMSF UI sections | 2 weeks |
| 4.4 | Audit trail UI | Admin-facing audit log view showing AI extraction history per application | 1 week |
| 5.0 | Phase 4 – Testing & Validation | | 4 weeks |
| 5.1 | Unit & integration testing | Automated test suites for each extraction pipeline | 2 weeks |
| 5.2 | UAT with credit team | Guided testing with Mel's credit team using real-world scenarios | 2 weeks |
| 5.3 | Performance & load testing | Validate <30s processing SLA under peak concurrent users | 1 week |
| 5.4 | Security & compliance audit | Penetration testing, data sovereignty verification, privacy impact assessment | 1 week |
| 6.0 | Phase 5 – Deployment & Hypercare | | 4 weeks |
| 6.1 | Staged rollout | Pilot with 10% of brokers, then 50%, then 100% over 3 weeks | 3 weeks |
| 6.2 | Training delivery | Broker training sessions, credit team power-user training, admin training | 2 weeks |
| 6.3 | Hypercare support | Dedicated support team for first 4 weeks post-launch, daily accuracy monitoring | 4 weeks |
| 6.4 | Post-implementation review | Lessons learned, accuracy metrics, user satisfaction survey, roadmap refinement | 1 week |

---

## Task Breakdown (Mock Data)

> Project start: **2026-05-01** | Total duration: **26 weeks**
> Timeline: Phase 0 (wk 1–2) → Phase 1 (wk 3–6) → Phase 2 (wk 7–14) → Phase 3 (wk 15–18) → Phase 4 (wk 19–22) → Phase 5 (wk 23–26)
> estimateHours: 1 week = 40 h (8 h/day × 5 days)

```js
// projectId: "p9"
const llmProjectTasks = [
  // ── Phase 0: Initiation (2026-05-01 → 2026-05-14) ──────────────────────────
  {id: "t1001", projectId: "p9", title: "Stakeholder alignment workshops",
    description: "Align on scope, priorities, and success criteria with Mick, Mel, Pat, and credit team",
    status: "To Do", priority: "Medium", assigneeId: "u5",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: ""},

  {id: "t1002", projectId: "p9", title: "Infrastructure & environment setup",
    description: "Provision cloud environments, CI/CD pipelines, dev/staging/prod",
    status: "To Do", priority: "High", assigneeId: "u12",
    estimateHours: 40, actualHours: null,
    startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: ""},

  // ── Phase 1: Discovery & PoC (2026-05-15 → 2026-06-11) ────────────────────
  {id: "t1003", projectId: "p9", title: "Document corpus collection",
    description: "Gather 50+ sample documents per type from production (anonymised)",
    status: "To Do", priority: "Medium", assigneeId: "u3",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-15", dueDate: "2026-05-28", oneDeskId: ""},

  {id: "t1004", projectId: "p9", title: "LLM model benchmarking",
    description: "Evaluate 2–3 LLM candidates against gold-standard extraction targets",
    status: "To Do", priority: "High", assigneeId: "u18",
    estimateHours: 80, actualHours: null,
    startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: ""},

  {id: "t1005", projectId: "p9", title: "PoC demo to stakeholders",
    description: "Demonstrate extraction accuracy on 5 core document types",
    status: "To Do", priority: "Medium", assigneeId: "u7",
    estimateHours: 40, actualHours: null,
    startDate: "2026-06-05", dueDate: "2026-06-11", oneDeskId: ""},

  // ── Phase 2: Core Engine Development (2026-06-12 → 2026-08-06) ────────────
  {id: "t1006", projectId: "p9", title: "Document Ingestion Service",
    description: "Build upload normalisation, format handling, routing pipeline",
    status: "To Do", priority: "High", assigneeId: "u2",
    estimateHours: 80, actualHours: null,
    startDate: "2026-06-12", dueDate: "2026-06-25", oneDeskId: ""},

  {id: "t1007", projectId: "p9", title: "Document Classification Engine",
    description: "Train/configure LLM-based document type classifier for 24 types",
    status: "To Do", priority: "High", assigneeId: "u14",
    estimateHours: 80, actualHours: null,
    startDate: "2026-06-26", dueDate: "2026-07-09", oneDeskId: ""},

  {id: "t1008", projectId: "p9", title: "LLM Extraction Engine (Tier 1)",
    description: "Build extraction for core docs: Contract of Sale, Trust Deeds, Payslips, Tax Returns, ID Documents",
    status: "To Do", priority: "High", assigneeId: "u9",
    estimateHours: 160, actualHours: null,
    startDate: "2026-06-26", dueDate: "2026-07-23", oneDeskId: ""},

  {id: "t1009", projectId: "p9", title: "LLM Extraction Engine (Tier 2)",
    description: "Extend extraction to remaining docs: Bank Statements, Valuations, Credit Reports, CMA, Rental, BAS",
    status: "To Do", priority: "High", assigneeId: "u21",
    estimateHours: 160, actualHours: null,
    startDate: "2026-07-10", dueDate: "2026-08-06", oneDeskId: ""},

  {id: "t1010", projectId: "p9", title: "Word Search / Risk Flagging",
    description: "Implement keyword detection for Valuations (28 risk terms), Bank Statements (12 terms), Home Loan Statements (21 terms)",
    status: "To Do", priority: "High", assigneeId: "u6",
    estimateHours: 80, actualHours: null,
    startDate: "2026-07-10", dueDate: "2026-07-23", oneDeskId: ""},

  {id: "t1011", projectId: "p9", title: "Field Mapping Service",
    description: "Build JSON-to-UI field mapping with multi-applicant logic",
    status: "To Do", priority: "High", assigneeId: "u16",
    estimateHours: 120, actualHours: null,
    startDate: "2026-07-17", dueDate: "2026-08-06", oneDeskId: ""},

  // ── Phase 3: UI Integration (2026-08-07 → 2026-09-03) ─────────────────────
  {id: "t1012", projectId: "p9", title: "Enhanced Doc Upload UI",
    description: "Drag-and-drop, batch upload, progress indicators, auto-classification preview",
    status: "To Do", priority: "High", assigneeId: "u11",
    estimateHours: 80, actualHours: null,
    startDate: "2026-08-07", dueDate: "2026-08-20", oneDeskId: ""},

  {id: "t1013", projectId: "p9", title: "Confidence & Review overlay",
    description: "Per-field confidence indicators, inline correction, accept/reject controls",
    status: "To Do", priority: "High", assigneeId: "sh2",
    estimateHours: 80, actualHours: null,
    startDate: "2026-08-07", dueDate: "2026-08-20", oneDeskId: ""},

  {id: "t1014", projectId: "p9", title: "Field pre-population integration",
    description: "Wire Field Mapping Service outputs to all 12 DEB SMSF UI sections",
    status: "To Do", priority: "High", assigneeId: "u19",
    estimateHours: 80, actualHours: null,
    startDate: "2026-08-21", dueDate: "2026-09-03", oneDeskId: ""},

  {id: "t1015", projectId: "p9", title: "Audit trail UI",
    description: "Admin-facing audit log view showing AI extraction history per application",
    status: "To Do", priority: "Medium", assigneeId: "sh3",
    estimateHours: 40, actualHours: null,
    startDate: "2026-08-28", dueDate: "2026-09-03", oneDeskId: ""},

  // ── Phase 4: Testing & Validation (2026-09-04 → 2026-10-01) ───────────────
  {id: "t1016", projectId: "p9", title: "Unit & integration testing",
    description: "Automated test suites for each extraction pipeline",
    status: "To Do", priority: "High", assigneeId: "u4",
    estimateHours: 80, actualHours: null,
    startDate: "2026-09-04", dueDate: "2026-09-17", oneDeskId: ""},

  {id: "t1017", projectId: "p9", title: "UAT with credit team",
    description: "Guided testing with Mel's credit team using real-world scenarios",
    status: "To Do", priority: "High", assigneeId: "u23",
    estimateHours: 80, actualHours: null,
    startDate: "2026-09-18", dueDate: "2026-10-01", oneDeskId: ""},

  {id: "t1018", projectId: "p9", title: "Performance & load testing",
    description: "Validate <30s processing SLA under peak concurrent users",
    status: "To Do", priority: "High", assigneeId: "u8",
    estimateHours: 40, actualHours: null,
    startDate: "2026-09-04", dueDate: "2026-09-10", oneDeskId: ""},

  {id: "t1019", projectId: "p9", title: "Security & compliance audit",
    description: "Penetration testing, data sovereignty verification, privacy impact assessment",
    status: "To Do", priority: "High", assigneeId: "sh1",
    estimateHours: 40, actualHours: null,
    startDate: "2026-09-11", dueDate: "2026-09-17", oneDeskId: ""},

  // ── Phase 5: Deployment & Hypercare (2026-10-02 → 2026-10-29) ─────────────
  {id: "t1020", projectId: "p9", title: "Staged rollout",
    description: "Pilot with 10% of brokers, then 50%, then 100% over 3 weeks",
    status: "To Do", priority: "High", assigneeId: "u13",
    estimateHours: 120, actualHours: null,
    startDate: "2026-10-02", dueDate: "2026-10-22", oneDeskId: ""},

  {id: "t1021", projectId: "p9", title: "Training delivery",
    description: "Broker training sessions, credit team power-user training, admin training",
    status: "To Do", priority: "Medium", assigneeId: "u20",
    estimateHours: 80, actualHours: null,
    startDate: "2026-10-02", dueDate: "2026-10-15", oneDeskId: ""},

  {id: "t1022", projectId: "p9", title: "Hypercare support",
    description: "Dedicated support team for first 4 weeks post-launch, daily accuracy monitoring",
    status: "To Do", priority: "Medium", assigneeId: "u1",
    estimateHours: 160, actualHours: null,
    startDate: "2026-10-02", dueDate: "2026-10-29", oneDeskId: ""},

  {id: "t1023", projectId: "p9", title: "Post-implementation review",
    description: "Lessons learned, accuracy metrics, user satisfaction survey, roadmap refinement",
    status: "To Do", priority: "Low", assigneeId: "u15",
    estimateHours: 40, actualHours: null,
    startDate: "2026-10-23", dueDate: "2026-10-29", oneDeskId: ""},
];
```
