# EzyPM - Contradictions & Technical Gaps Analysis

**Last Updated**: April 1, 2026  
**Scope**: Frontend UI Prototype vs Documentation

---

## 🚨 Critical Contradictions

### 1. **Hardcoded Single-User in Multi-User UI** ⚠️
- **Issue**: All time logs are created with hardcoded `userId: "u1"` in mock data
- **Location**: `lib/mockData.ts`
- **Expected**: Time logs should use `currentUser.id` when logging hours
- **Impact**: Only user "u1" can see their own time logs; breaks multi-user assumption
- **Phase 2 Fix**: Requires real authentication + server-side time log persistence

### 2. **EstimateSource Switching Logic Incomplete**
- **Documentation Says** (project-overview-pdr.md):
  - Projects can switch between TASK estimation (sum of task estimates) and RESOURCE estimation (sum of resource hours)
  - Switching requires validation & warning dialog
- **Code Reality** (store/useStore.ts):
  - `estimateSource` field exists in Project type, but NO action to switch it
  - NO validation logic implemented
  - Progress calculation may not handle both modes correctly
- **Fix Needed**: Implement `updateProjectEstimateSource()` action with validation

### 3. **Task Subtasks Depth & Aggregation Mismatch**
- **Documentation Says** (project-overview-pdr.md):
  - Tasks can be nested 3 levels deep (parent → child → grandchild)
  - Child task hours should roll up to parent automatically
  - Progress should cascade upward
- **Code Reality**:
  - `parentId` exists in Task type (supports nesting)
  - NO recursive hour aggregation logic found
  - Progress is only calculated on individual tasks
- **Fix Needed**: Implement recursive function `calculateParentTaskHours()` and bind to task updates

### 4. **Account Registration vs Hardcoded Password**
- **Documentation Says** (project-overview-pdr.md):
  - System supports user registration (Part of Phase 1 expectation)
- **Code Reality** (app/login/page.tsx):
  - Login page uses **fuzzy email matching** with hardcoded password "123456"
  - NO registration flow exists
  - Only works for emails in mock data
- **Decision**: Document this as "Auth Stub for Demo" and mark for Phase 2

### 5. **Auto-Generated Time Logs on App Startup**
- **Issue**: Mock data generator creates time logs automatically (lines in mockData.ts)
- **Expectation**: Users should manually log time via task detail page
- **Current**: Illusory time tracking for demo purposes only
- **Decision**: Keep for demo, but flag as data generation artifact

---

## ⚠️ Design vs Implementation Gaps

### 6. **CustomSelect Mandate Not Fully Implemented**
- **Code Standard** (code-standards.md):
  - ZERO native `<select>` elements allowed in codebase
- **Code Review Result**: ✅ COMPLIANT - All selects use `CustomSelect` component
- **No Gap**: Implementation follows standard

### 7. **Borderless Design Standard Compliance**
- **Code Standard**: No hard borders; use `bg-surface/50 shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]`
- **Code Review**: ✅ COMPLIANT - All components follow borderless aesthetic
- **No Gap**: Consistent throughout UI

### 8. **isMounted Hydration Pattern**
- **Standard** (code-standards.md): Required for dynamic content to prevent SSR mismatch
- **Code Review**: ✅ COMPLIANT - Context-based `activityContext.tsx` implements hydration
- **No Gap**: Proper pattern in place

---

## 📋 Minor Inconsistencies & UX Issues

### 9. **Toast Auto-Dismiss Timing**
- **Current**: All toasts auto-dismiss after 3 seconds
- **Issue**: Success messages may disappear before user reads them
- **Suggested Fix**: Make dismissal time context-aware:
  - Errors: 5-7 seconds
  - Warnings: 4 seconds
  - Success: 3 seconds (current)

### 10. **Estimate vs Actual Reporting Calculations**
- **Docs** (project-overview-pdr.md): Includes "Estimate vs Actual Analysis" tab in Reports
- **Implementation** (app/reports/page.tsx): Tab exists with Recharts visualization
- **Gap**: No verification that calculations match across different estimate modes (TASK vs RESOURCE)
- **Action**: Add unit test for estimate calculations before Phase 2

### 11. **Missing Input Validation**
- **Standard** (code-standards.md): Every field should validate on submit
- **Reality**: Form submissions don't show validation errors
  - Create Project modal has no length/required checks
  - Task creation allows empty titles
  - Team member assignment doesn't validate capacity
- **Fix Needed**: Add form validation before Phase 2

### 12. **Stakeholder Role Mapping**
- **Docs** (project-overview-pdr.md): Stakeholders can have different roles per project
- **Code** (types/index.ts): `Stakeholder` type has `roles[]` BUT structure unclear
- **Gap**: No UI to manage stakeholder roles per project in `/projects/[id]` page
- **Priority**: Medium - update Project Detail page

### 13. **Task Status Customization Path Unclear**
- **Docs**: "7-status workflow" can be extended via Settings
- **Code**: Task statuses stored in store as customizable strings ✅
- **Gap**: Settings page (`app/settings/page.tsx`) exists but implementation unclear
- **Verify**: Check if Settings actually updates store task statuses

### 14. **User Skills Type Inconsistency**
- **Issue**: Users have `skills[]` (array of strings) but Dashboard/Reports may expect structured skill objects
- **Location**: `types/index.ts` line ~30
- **Decision**: Keep as strings for MVP; Phase 2 can add skill mastery levels

---

## 🔍 Documentation Completeness Gaps

### 15. **Missing: Page-by-Page Data Flow Diagram**
- **Exists**: System architecture diagram (high-level)
- **Missing**: How data flows between `/projects/[id]` and its tabs (Resources, Tasks, Stakeholders)
- **Action**: Create detailed component flow diagram in `docs/technical/data-flow.md`

### 16. **Missing: Error Handling Strategy**
- **Current**: No mention of error boundaries, fallback UI, or error logging
- **Docs**: Silent on how errors bubble up or are displayed to users
- **Action**: Add error handling guidelines before Phase 2

### 17. **Missing: Accessibility (A11y) Guidelines**
- **Docs**: No mention of ARIA labels, keyboard navigation, screen reader testing
- **Current**: Good semantic HTML, but no explicit a11y checks
- **Action**: Create `docs/accessibility-roadmap.md` for Phase 2

---

## ✅ Verification Checklist

### All 12 Pages Implemented?
- ✅ `/` (Dashboard)
- ✅ `/login` (Login)
- ✅ `/projects` (Project List)
- ✅ `/projects/[id]` (Project Detail)
- ✅ `/tasks` (Task List with Kanban)
- ✅ `/tasks/[id]` (Task Detail)
- ✅ `/team` (Team List)
- ✅ `/team/[id]` (Team Member Profile)
- ✅ `/reports` (Analytics)
- ✅ `/profile` (User Profile)
- ✅ `/activities` (Activity Audit Log)
- ✅ `/settings` (System Config)

### All Core Features Present?
- ✅ Project CRUD
- ✅ Task Management (Kanban + Table)
- ✅ Time Logging
- ✅ Comments/Collaboration
- ✅ Team Capacity Tracking
- ✅ Activity Audit Log
- ✅ Analytics/Reports
- ✅ Dark Mode
- ✅ Responsive Design
- ⚠️ Stakeholder Management (UI exists, role mapping needs clarity)
- ⚠️ Advanced Reporting (Charts exist, need to verify calculations)

---

## 🎯 Recommended Actions (Prioritized)

### HIGH PRIORITY (Before Phase 2)
1. [ ] Document and fix the `estimateSource` switching logic
2. [ ] Implement recursive task hour aggregation for subtasks
3. [ ] Add comprehensive form validation to all modals
4. [ ] Create unit tests for estimate calculations
5. [ ] Clarify stakeholder role mapping and update UI

### MEDIUM PRIORITY
1. [ ] Improve toast auto-dismiss timing based on message type
2. [ ] Create detailed data flow diagrams for complex pages
3. [ ] Document error handling strategy
4. [ ] Verify Settings page actually updates task statuses

### LOW PRIORITY (Phase 2+)
1. [ ] Add comprehensive accessibility (a11y) guidelines
2. [ ] Implement proper error boundaries
3. [ ] Create system-level error logging/monitoring strategy
4. [ ] Enhance user skills to include proficiency levels

---

## 📚 Reference Documentation Created

- **This File**: contradictions-and-gaps.md
- **Related**: See `code-standards.md`, `project-overview-pdr.md`, `system-architecture.md` for full context

---

## 💡 Key Takeaways

1. **This is a solid MVP** - All 12 pages built, UI is polished, Zustand store is clean
2. **Demo-first approach** - Some features stubbed (auth, time logs) intentionally for demo
3. **AI-friendly codebase** - Well-documented conventions make it easy for AI tools to extend
4. **Phase 2 blockers identified** - EstimateSource, task aggregation, input validation are critical path items
5. **No show-stoppers** - All contradictions are fixable and don't block demo/showcase

