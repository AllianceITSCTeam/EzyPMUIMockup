import { User, Project, Task, ActivityLog, Comment, Stakeholder, StakeholderRole, TaskStatusConfig, TaskPriorityConfig, Company, ApplicationItem } from "../types";

export const THEME_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
  "#06b6d4", "#d946ef", "#eab308", "#22c55e", "#a855f7"
];

export const MOCK_APPLICATIONS: ApplicationItem[] = [
  { id: "app-1", name: "So Ezy" },
  { id: "app-2", name: "Source Ezy" },
  { id: "app-3", name: "DEB Ezy" },
  { id: "app-4", name: "DEB SMSF" },
  { id: "app-5", name: "DEB Prime" },
  { id: "app-6", name: "TraceNTrace" },
  { id: "app-7", name: "Online Calculator" },
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "EzyPM Solutions",
    address: "Level 4, 11 York St, Sydney NSW 2000",
    phone: "+61 2 9123 4567",
    email: "contact@ezypm.com",
    taxCode: "ABN 12 345 678 901",
    website: "https://ezypm.com"
  },
  {
    id: "comp-2",
    name: "Alpha Tech Solutions",
    address: "123 Innovation Drive, Melbourne VIC 3000",
    phone: "+61 3 9876 5432",
    email: "info@alphatech.com.au",
    taxCode: "ABN 98 765 432 109",
    website: "https://alphatech.com.au"
  },
  {
    id: "comp-3",
    name: "Source Funding Pty",
    address: "55 FinTech Boulevard, Brisbane QLD 4000",
    phone: "+61 7 1234 5678",
    email: "partners@sourcefunding.com.au",
    taxCode: "ABN 45 678 901 234",
    website: "https://sourcefunding.com.au"
  },
  {
    id: "comp-4",
    name: "Valuation DB Inc.",
    address: "88 Data Street, Adelaide SA 5000",
    phone: "+61 8 8765 4321",
    email: "contact@valuationdb.com",
    taxCode: "ABN 32 109 876 543",
    website: "https://valuationdb.com"
  }
];

const RAW_USERS: any[] = [
  { id: "u1", name: "Bui Minh Dung", email: "bui.minh.dung@ezypm.com", role: "PM", skills: ["Management", "Agile"], status: "Busy", avatarUrl: "/uploads/portraits/bui-minh-dung.png" },
  { id: "u2", name: "Dao Cam Thanh", email: "dao.cam.thanh@ezypm.com", role: "Normal User", skills: ["QC", "Testing"], status: "Available", avatarUrl: "/uploads/portraits/ao-cam-thanh_m1773990534888_portrait.png" },
  { id: "u3", name: "Le Nam Thai Son", email: "le.nam.thai.son@ezypm.com", role: "Normal User", skills: ["Frontend", "React"], status: "Overloaded", avatarUrl: "/uploads/portraits/le-nam-thai-son_m1773992682040_portrait.jpg" },
  { id: "u4", name: "Le Ngoc Minh", email: "le.ngoc.minh@ezypm.com", role: "Normal User", skills: ["Backend", "NodeJS"], status: "Available", avatarUrl: "/uploads/portraits/le-ngoc-minh_m1773988796627_portrait.png" },
  { id: "u5", name: "Le Vi", email: "le.vi@ezypm.com", role: "Normal User", skills: ["Design", "Figma"], status: "Available", avatarUrl: "/uploads/portraits/le-vi.jpg" },
  { id: "u6", name: "Le Xuan Khanh", email: "le.xuan.khanh@ezypm.com", role: "Normal User", skills: ["Frontend", "Vue"], status: "Busy", avatarUrl: "/uploads/portraits/le-xuan-khanh.png" },
  { id: "u7", name: "Ngo Minh Hung", email: "ngo.minh.hung@ezypm.com", role: "PM", skills: ["Management"], status: "Available" },
  { id: "u8", name: "Nguyen Thi Bich Van", email: "nguyen.thi.bich.van@ezypm.com", role: "Normal User", skills: ["QA"], status: "Available", avatarUrl: "/uploads/portraits/nguyen-thi-bich-van_m1773990331486_portrait.jpg" },
  { id: "u9", name: "Nguyen Thi Ngoc Tram", email: "nguyen.thi.ngoc.tram@ezypm.com", role: "Normal User", skills: ["Business Analyst"], status: "Available", avatarUrl: "/uploads/portraits/nguyen-thi-ngoc-tram_m1774100439830_portrait.jpeg" },
  { id: "u10", name: "Nguyen Trong Phuc", email: "nguyen.trong.phuc@ezypm.com", role: "Normal User", skills: ["Backend", "C#"], status: "Busy", avatarUrl: "/uploads/portraits/nguyen-trong-phuc_m1773988530197_portrait.jpg" },
  { id: "u11", name: "Phan Hoang Dung", email: "phan.hoang.dung@ezypm.com", role: "Normal User", skills: ["Frontend", "React Native"], status: "Available", avatarUrl: "/uploads/portraits/phan-hoang-dung_m1773996602030_portrait.jpg" },
  { id: "u12", name: "Tong Nguyen Hoang Trung", email: "tong.nguyen.hoang.trung@ezypm.com", role: "Normal User", skills: ["DevOps", "AWS"], status: "Available", avatarUrl: "/uploads/portraits/tong-nguyen-hoang-trung_m1773988594637_portrait.jpg" },
  { id: "u13", name: "Tran Huu Anh Khoa", email: "tran.huu.anh.khoa@ezypm.com", role: "Normal User", skills: ["Backend", "Python"], status: "Overloaded" },
  { id: "u14", name: "Tran Thi Hong Nhung", email: "tran.thi.hong.nhung@ezypm.com", role: "Normal User", skills: ["QC"], status: "Available", avatarUrl: "/uploads/portraits/tran-thi-hong-nhung_m1773988504870_portrait.jfif" },
  { id: "u15", name: "Tran Van Thanh", email: "tran.van.thanh@ezypm.com", role: "Normal User", skills: ["Frontend", "Angular"], status: "Available", avatarUrl: "/uploads/portraits/tran-van-thanh.png" },
  { id: "u16", name: "Trang Phan The Hao", email: "trang.phan.the.hao@ezypm.com", role: "Normal User", skills: ["Backend", "Java"], status: "Available", avatarUrl: "/uploads/portraits/trang-phan-the-hao.jpeg" },
  { id: "u17", name: "Truong Le Hung", email: "truong.le.hung@ezypm.com", role: "Normal User", skills: ["Design", "UI/UX"], status: "Busy", avatarUrl: "/uploads/portraits/truong-le-hung_m1774143655055_portrait.png" },
  { id: "u18", name: "Truong Man Ngoc", email: "truong.man.ngoc@ezypm.com", role: "Normal User", skills: ["QA", "Automation"], status: "Available", avatarUrl: "/uploads/portraits/truong-man-ngoc.png" },
  { id: "u19", name: "Vo Thanh Phong", email: "vo.thanh.phong@ezypm.com", role: "Normal User", skills: ["Backend", "Go"], status: "Available", avatarUrl: "/uploads/portraits/vo-thanh-phong.png" },
  { id: "u20", name: "Vu Thu Trang", email: "vu.thu.trang@ezypm.com", role: "Normal User", skills: ["Business Analyst"], status: "Available", avatarUrl: "/uploads/portraits/vu-thu-trang.jpg" },
  { id: "u21", name: "Au Truong Giang", email: "au.truong.giang@ezypm.com", role: "Normal User", skills: ["Developer"], status: "Available", avatarUrl: "/uploads/portraits/au-truong-giang_m1774143772111_portrait.jfif" },
  { id: "u22", name: "Cao Khac Bao", email: "cao.khac.bao@ezypm.com", role: "Normal User", skills: ["Developer"], status: "Available", avatarUrl: "/uploads/portraits/cao-khac-bao_m1774143791139_portrait.jpeg" },
  { id: "u23", name: "Truong Le Khanh", email: "truong.le.khanh@ezypm.com", role: "Normal User", skills: ["Developer"], status: "Available", avatarUrl: "/uploads/portraits/truong-le-khanh.png" },
  { id: "sh1", name: "Pat Ormond", email: "pat.ormond@ezypm.com", role: "Admin", skills: ["Stakeholder", "Director"], status: "Available", avatarUrl: "/uploads/portraits/pat-ormond.png" },
  { id: "sh2", name: "Jo Ormond", email: "jo.ormond@ezypm.com", role: "Admin", skills: ["Stakeholder", "Director"], status: "Available", avatarUrl: "/uploads/portraits/jo-ormond.png" },
  { id: "sh3", name: "Kathleen", email: "kathleen@ezypm.com", role: "Admin", skills: ["Stakeholder", "Sponsor"], status: "Available", avatarUrl: "/uploads/portraits/kathleen.png" },
  { id: "sh4", name: "Rupert", email: "rupert@ezypm.com", role: "Admin", skills: ["Stakeholder", "Sponsor"], status: "Available", avatarUrl: "/uploads/portraits/rupert.png" }
];

export const MOCK_USERS: User[] = RAW_USERS.map((u, i) => ({
  ...u,
  themeColor: THEME_COLORS[i % THEME_COLORS.length]
}));

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p4",
    name: "SoEzy",
    description: "Project managing the workflow and operations of MortgageEzy company",
    status: "Active",
    estimateSource: "TASK",
    startDate: "2026-03-01",
    endDate: "",
    estimateHours: 500,
    actualHours: 0,
    remainingHours: 500,
    progressPercentage: 0,
    resourceCount: 3,
    taskCount: 0,
    themeColor: THEME_COLORS[4],
    avatarUrl: "https://www.mezy.com.au/wp-content/uploads/2015/09/logo-white-300x150.png",
    resources: [{ userId: "u20", role: "BA" }, { userId: "u16", role: "Backend" }, { userId: "u1", role: "PM" }],
    stakeholders: [
      { id: "sh1", name: "Pat Ormond", role: "Business Owner", isCustom: false },
      { id: "sh2", name: "Jo Ormond", role: "Sponsor", isCustom: false }
    ]
  },
  {
    id: "p5",
    name: "DEB SMSF",
    description: "Project managing the workflow for processing SMSF files",
    status: "Active",
    estimateSource: "RESOURCE",
    startDate: "2026-03-15",
    endDate: "",
    estimateHours: 350,
    actualHours: 0,
    remainingHours: 350,
    progressPercentage: 0,
    resourceCount: 4,
    taskCount: 0,
    themeColor: THEME_COLORS[5],
    avatarUrl: "https://debmanagers-ad.sourcefunding.com.au/config/logo.png",
    resources: [{ userId: "u9", role: "BA" }, { userId: "u11", role: "Frontend" }, { userId: "u3", role: "Frontend" }, { userId: "u19", role: "Backend" }],
    stakeholders: [
      { id: "sh-client-1", name: "Source Funding", role: "Client", isCustom: true }
    ]
  },
  {
    id: "p6",
    name: "TrackNTrace",
    description: "Mobile app for brokers to check loan application statuses and information",
    status: "Active",
    estimateSource: "TASK",
    startDate: "2026-04-01",
    endDate: "",
    estimateHours: 800,
    actualHours: 0,
    remainingHours: 800,
    progressPercentage: 0,
    resourceCount: 4,
    taskCount: 0,
    themeColor: THEME_COLORS[6],
    avatarUrl: "https://www.mezy.com.au/favicon.ico",
    resources: [{ userId: "u23", role: "Developer" }, { userId: "u15", role: "Frontend" }, { userId: "u17", role: "Design" }, { userId: "u1", role: "PM" }],
    stakeholders: [
      { id: "sh1", name: "Pat Ormond", role: "Business Owner", isCustom: false },
      { id: "sh-partner-1", name: "Alpha Tech Solutions", role: "IT Service", isCustom: true }
    ]
  },
  {
    id: "p7",
    name: "B2B Valuation",
    description: "B2B platform for automated property valuation, collateral assessment, and financial risk modeling",
    status: "Active",
    estimateSource: "RESOURCE",
    startDate: "2026-04-15",
    endDate: "",
    estimateHours: 600,
    actualHours: 0,
    remainingHours: 600,
    progressPercentage: 0,
    resourceCount: 3,
    taskCount: 0,
    themeColor: THEME_COLORS[7],
    resources: [{ userId: "u8", role: "QC" }, { userId: "u11", role: "Frontend" }, { userId: "u1", role: "PM" }],
    stakeholders: [
      { id: "sh-vendor", name: "Valuation DB Provider", role: "Vendor", isCustom: true }
    ]
  },
  {
    id: "p8",
    name: "DEB Source",
    description: "Project managing the order entry workflow for Source company",
    status: "Active",
    estimateSource: "TASK",
    startDate: "2026-05-01",
    endDate: "",
    estimateHours: 400,
    actualHours: 0,
    remainingHours: 400,
    progressPercentage: 0,
    resourceCount: 4,
    taskCount: 0,
    themeColor: THEME_COLORS[8],
    avatarUrl: "https://debmanagers-ad.sourcefunding.com.au/favicon.ico",
    resources: [{ userId: "u9", role: "BA" }, { userId: "u19", role: "Backend" }, { userId: "u15", role: "Frontend" }, { userId: "u14", role: "QC" }],
    companyIds: ["comp-3", "comp-1"],
    specFiles: [
      { name: "deb-source-requirements.pdf", url: "#", size: 2048576 },
      { name: "architecture_diagram.png", url: "#", size: 512000 }
    ],
    stakeholders: [
      { id: "sh-client-3", name: "Internal HR Team", role: "Client", isCustom: true },
      { id: "sh-partner-3", name: "Source Recruitment", role: "Partner", isCustom: true }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: "t1", projectId: "p4", title: "Initialize MortgageEzy DB", description: "Design initial PostgreSQL schema and run migrations",
    status: "In Progress", priority: "High", assigneeId: "u1", estimateHours: 12, actualHours: 6, startDate: "2026-03-01", dueDate: "2026-03-10", oneDeskId: "OD-12345"
  },
  {
    id: "t2", projectId: "p4", title: "Configure workflows", description: "Setup the activity context mappings",
    status: "To Do", priority: "Medium", assigneeId: "u16", estimateHours: 8, actualHours: 0, startDate: "2026-02-15", dueDate: "2026-04-10", parentId: "t1"
  },
  {
    id: "t3", projectId: "p5", title: "Design SMSF intake form", description: "Create responsive form for SMSF documents",
    status: "Pending", priority: "High", assigneeId: "u9", estimateHours: 16, actualHours: 0, startDate: "2026-03-10", dueDate: "2026-05-30",
  },
  {
    id: "t4", projectId: "p6", title: "Integrate broker API", description: "Fetch loan statuses from central broker API",
    status: "To Do", priority: "Critical", assigneeId: "u23", estimateHours: 24, actualHours: 0, startDate: "2026-03-01", dueDate: "2026-03-28",
  },
  {
    id: "t5", projectId: "p7", title: "Property algorithm setup", description: "Implement collateral assessment models",
    status: "Completed", priority: "High", assigneeId: "u8", estimateHours: 40, actualHours: 40, startDate: "2026-02-01", dueDate: "2026-02-28",
  },
  {
    id: "t6", projectId: "p8", title: "Review order entry UI", description: "Gather feedback on the new data entry grids",
    status: "On Hold", priority: "Medium", assigneeId: "u14", estimateHours: 8, actualHours: 2, startDate: "2026-02-20", dueDate: "2026-04-05",
  },
  {
    id: "t7", projectId: "p6", title: "Test notification delivery", description: "Verify push notifications for status changes",
    status: "To Do", priority: "Medium", assigneeId: "u2", estimateHours: 8, actualHours: 0, startDate: "2026-03-24", dueDate: "2026-04-24",
  },
  {
    id: "t8", projectId: "p5", title: "Build SMSF mobile view UI", description: "Responsive fixes for mobile browsers",
    status: "In Progress", priority: "Medium", assigneeId: "u3", estimateHours: 16, actualHours: 8, startDate: "2026-04-15", dueDate: "2026-04-20",
  },
  {
    id: "t9", projectId: "p4", title: "API Gateway setup", description: "Configure API routing for microservices",
    status: "Pending", priority: "High", assigneeId: "u4", estimateHours: 24, actualHours: 0, startDate: "2026-05-05", dueDate: "2026-05-15",
  },
  {
    id: "t10", projectId: "p8", title: "Design order entry grid", description: "UI mockups for high-density data entry",
    status: "To Do", priority: "Low", assigneeId: "u5", estimateHours: 12, actualHours: 0, startDate: "2026-05-10", dueDate: "2026-05-20",
  },
  {
    id: "t11", projectId: "p6", title: "Implement offline mode sync", description: "Cache data using service workers",
    status: "In Progress", priority: "Critical", assigneeId: "u6", estimateHours: 32, actualHours: 10, startDate: "2026-04-05", dueDate: "2026-04-15",
  },
  {
    id: "t12", projectId: "p7", title: "Draft project timeline", description: "Gantt chart and milestone planning",
    status: "Completed", priority: "Medium", assigneeId: "u7", estimateHours: 4, actualHours: 4, startDate: "2026-04-01", dueDate: "2026-04-02",
  },
  {
    id: "t13", projectId: "p4", title: "Setup caching layer", description: "Implement Redis for frequent queries",
    status: "To Do", priority: "High", assigneeId: "u10", estimateHours: 16, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-10",
  },
  {
    id: "t14", projectId: "p7", title: "Build interactive charts", description: "Recharts implementation for valuation trends",
    status: "Pending", priority: "Medium", assigneeId: "u11", estimateHours: 20, actualHours: 0, startDate: "2026-05-15", dueDate: "2026-05-25",
  },
  {
    id: "t15", projectId: "p4", title: "Deploy initial staging env", description: "AWS ECS cluster setup",
    status: "In Progress", priority: "High", assigneeId: "u12", estimateHours: 16, actualHours: 12, startDate: "2026-03-20", dueDate: "2026-03-25",
  },
  {
    id: "t16", projectId: "p5", title: "Optimize DB queries", description: "Add missing indexes to SMSF tables",
    status: "To Do", priority: "Medium", assigneeId: "u13", estimateHours: 8, actualHours: 0, startDate: "2026-05-05", dueDate: "2026-05-08",
  },
  {
    id: "t17", projectId: "p8", title: "Implement grid inline editing", description: "React table with inline cell edits",
    status: "In Progress", priority: "High", assigneeId: "u15", estimateHours: 24, actualHours: 16, startDate: "2026-04-10", dueDate: "2026-04-18",
  },
  {
    id: "t18", projectId: "p6", title: "Prototype UX flows", description: "Figma interactive prototypes for mobile",
    status: "Completed", priority: "Medium", assigneeId: "u17", estimateHours: 16, actualHours: 16, startDate: "2026-03-15", dueDate: "2026-03-20",
  },
  {
    id: "t19", projectId: "p7", title: "Write E2E automated tests", description: "Playwright setup for valuation algorithms",
    status: "To Do", priority: "High", assigneeId: "u18", estimateHours: 32, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-15",
  },
  {
    id: "t20", projectId: "p8", title: "Build order import endpoints", description: "Bulk CSV import processing API",
    status: "Pending", priority: "Critical", assigneeId: "u19", estimateHours: 40, actualHours: 0, startDate: "2026-05-10", dueDate: "2026-05-30",
  },
  {
    id: "t21", projectId: "p4", title: "Map out user stories", description: "Draft Jira tickets for Phase 2",
    status: "Completed", priority: "Low", assigneeId: "u20", estimateHours: 8, actualHours: 6, startDate: "2026-03-20", dueDate: "2026-03-22",
  },
  {
    id: "t22", projectId: "p6", title: "Setup error tracking", description: "Sentry integration in React Native",
    status: "In Progress", priority: "Medium", assigneeId: "u21", estimateHours: 8, actualHours: 4, startDate: "2026-04-15", dueDate: "2026-04-16",
  },
  {
    id: "t23", projectId: "p7", title: "Setup CI/CD pipeline", description: "GitHub Actions for automated deployments",
    status: "Pending", priority: "High", assigneeId: "u22", estimateHours: 16, actualHours: 0, startDate: "2026-05-20", dueDate: "2026-05-25",
  },
  // MOCK DATA FOR GANTT CHART (Project p1)
  {
    id: "p1_phase1", projectId: "p1", title: "1. Design & Research Phase", description: "Initial design phase",
    status: "In Progress", priority: "High", assigneeId: "u1", estimateHours: 165, actualHours: 142, startDate: "2026-03-01", dueDate: "2026-03-25",
  },
  {
    id: "t24", projectId: "p1", title: "Discovery & User Research", description: "Interview stakeholders",
    status: "Completed", priority: "High", assigneeId: "u1", estimateHours: 40, actualHours: 42, startDate: "2026-03-01", dueDate: "2026-03-05", parentId: "p1_phase1"
  },
  {
    id: "t25", projectId: "p1", title: "Wireframing & UX", description: "Low fidelity wireframes",
    status: "Completed", priority: "Medium", assigneeId: "u2", estimateHours: 45, actualHours: 40, startDate: "2026-03-06", dueDate: "2026-03-12", parentId: "p1_phase1"
  },
  {
    id: "t26", projectId: "p1", title: "High-Fidelity UI Design", description: "Figma mockups",
    status: "In Progress", priority: "High", assigneeId: "u3", estimateHours: 80, actualHours: 60, startDate: "2026-03-13", dueDate: "2026-03-25", parentId: "p1_phase1"
  },
  {
    id: "p1_phase2", projectId: "p1", title: "2. Frontend Engineering", description: "Core frontend implementation",
    status: "To Do", priority: "Critical", assigneeId: "u4", estimateHours: 244, actualHours: 20, startDate: "2026-03-20", dueDate: "2026-04-30",
  },
  {
    id: "t27", projectId: "p1", title: "Frontend Architecture Setup", description: "Next.js and Tailwind config",
    status: "In Progress", priority: "Critical", assigneeId: "u4", estimateHours: 24, actualHours: 20, startDate: "2026-03-20", dueDate: "2026-03-30", parentId: "p1_phase2"
  },
  {
    id: "t28", projectId: "p1", title: "Component Library Implementation", description: "Build reusable UI components",
    status: "To Do", priority: "High", assigneeId: "u5", estimateHours: 120, actualHours: 0, startDate: "2026-03-30", dueDate: "2026-04-15", parentId: "p1_phase2"
  },
  {
    id: "t29", projectId: "p1", title: "Page Implementation", description: "Assemble pages using components",
    status: "To Do", priority: "Medium", assigneeId: "u6", estimateHours: 100, actualHours: 0, startDate: "2026-04-15", dueDate: "2026-04-30", parentId: "p1_phase2"
  },
  {
    id: "p1_phase3", projectId: "p1", title: "3. Integration & Launch", description: "Final connections and deployment",
    status: "Pending", priority: "High", assigneeId: "u7", estimateHours: 200, actualHours: 0, startDate: "2026-04-20", dueDate: "2026-05-25",
  },
  {
    id: "t30", projectId: "p1", title: "State Management & Reactivity", description: "Zustand stores and effects",
    status: "Pending", priority: "High", assigneeId: "u7", estimateHours: 60, actualHours: 0, startDate: "2026-04-20", dueDate: "2026-05-05", parentId: "p1_phase3"
  },
  {
    id: "t31", projectId: "p1", title: "API Integration", description: "Connect to backend endpoints",
    status: "Pending", priority: "Critical", assigneeId: "u8", estimateHours: 80, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-15", parentId: "p1_phase3"
  },
  {
    id: "t32", projectId: "p1", title: "Testing & QA", description: "E2E and unit tests",
    status: "On Hold", priority: "Medium", assigneeId: "u9", estimateHours: 40, actualHours: 0, startDate: "2026-05-10", dueDate: "2026-05-20", parentId: "p1_phase3"
  },
  {
    id: "t33", projectId: "p1", title: "Final Polish & Go Live", description: "Production deployment",
    status: "No Specs", priority: "High", assigneeId: "u1", estimateHours: 20, actualHours: 0, startDate: "2026-05-20", dueDate: "2026-05-25", parentId: "p1_phase3"
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: "al1", userId: "u1", action: "Assigned you to Initialize MortgageEzy DB", timestamp: "5 mins ago" },
  { id: "al2", userId: "u8", action: "Completed Property algorithm setup", timestamp: "18 mins ago" },
  { id: "al3", userId: "u23", action: "Commented on Integrate broker API", timestamp: "1 hour ago" },
  { id: "al4", userId: "u16", action: "Changed status of Configure workflows to In Progress", timestamp: "1.5 hours ago" },
  { id: "al5", userId: "u9", action: "Created task Design SMSF intake form", timestamp: "2 hours ago" },
  { id: "al6", userId: "sh1", action: "Approved the B2B Valuation design plan", timestamp: "3 hours ago" },
  { id: "al7", userId: "u14", action: "Uploaded wireframes to Review order entry UI", timestamp: "4 hours ago" },
  { id: "al8", userId: "u1", action: "Added user Le Nam Thai Son to DEB SMSF", timestamp: "5 hours ago" },
  { id: "al9", userId: "u19", action: "Attached API documentation for Source Integration", timestamp: "Yesterday" },
  { id: "al10", userId: "u11", action: "Commented on the DEB SMSF workflow", timestamp: "Yesterday" },
  { id: "al11", userId: "u2", action: "Reported a bug in TrackNTrace notification system", timestamp: "Yesterday" },
  { id: "al12", userId: "u20", action: "Completed QA testing for MortgageEzy Phase 1", timestamp: "2 days ago" },
  { id: "al13", userId: "u17", action: "Updated the UI design file in TrackNTrace", timestamp: "2 days ago" },
  { id: "al14", userId: "u15", action: "Added 15 frontend tasks to TrackNTrace backlog", timestamp: "3 days ago" },
  { id: "al15", userId: "u3", action: "Merged Pull Request for DEB SMSF mobile view", timestamp: "3 days ago" }
];

export const MOCK_COMMENTS: Comment[] = [
  { id: "c1", taskId: "t1", userId: "u20", content: "Please make sure the schema covers all the new workflow steps.", timestamp: "2 hours ago" }
];

export const MOCK_SYSTEM_STAKEHOLDERS: Stakeholder[] = [
  { id: "sys-sh-1", name: "Pat Ormond", email: "pat.ormond@ezypm.com", organization: "EzyPM" },
  { id: "sys-sh-2", name: "Jo Ormond", email: "jo.ormond@ezypm.com", organization: "EzyPM" },
  { id: "sys-sh-3", name: "Source Funding", email: "info@sourcefunding.com.au", organization: "Source Funding Pty" },
  { id: "sys-sh-4", name: "Alpha Tech Solutions", email: "contact@alphatech.com" },
  { id: "sys-sh-5", name: "Valuation DB Provider", email: "api@valuationdb.com", organization: "ValDb Inc." }
];

export const MOCK_STAKEHOLDER_ROLES: StakeholderRole[] = [
  { id: "r-1", name: "Client", description: "The customer buying the software or service" },
  { id: "r-2", name: "Sponsor", description: "Provides financial backing for the project" },
  { id: "r-3", name: "Business Owner", description: "Internal owner or product champion" },
  { id: "r-4", name: "Vendor", description: "External supplier of goods or services" },
  { id: "r-5", name: "IT Service", description: "Third party technical support or infrastructure" },
  { id: "r-6", name: "Partner", description: "Strategic partner co-delivering value" },
  { id: "r-7", name: "Other", description: "Uncategorized stakeholder" }
];

export const MOCK_TASK_STATUSES: TaskStatusConfig[] = [
  { id: "ts-1", name: "To Do", description: "Created, not yet started", color: "#64748b" },
  { id: "ts-2", name: "In Progress", description: "Currently being worked on", color: "#3b82f6" },
  { id: "ts-3", name: "Pending", description: "Waiting - for processing or for a response", color: "#f59e0b" },
  { id: "ts-4", name: "On Hold", description: "Temporarily paused", color: "#6b7280" },
  { id: "ts-5", name: "No Specs", description: "Waiting for clear documentation / requirements", color: "#ef4444" },
  { id: "ts-6", name: "Completed", description: "Task is completely done", color: "#10b981" },
  { id: "ts-7", name: "Closed", description: "Closed - no further tracking needed", color: "#9ca3af" }
];

export const MOCK_TASK_PRIORITIES: TaskPriorityConfig[] = [
  { id: "tp-1", name: "Critical", description: "Must be fixed immediately", color: "#ef4444" },
  { id: "tp-2", name: "High", description: "Important milestone functionality", color: "#f97316" },
  { id: "tp-3", name: "Medium", description: "Standard priority", color: "#3b82f6" },
  { id: "tp-4", name: "Low", description: "Nice to have, non-blocking", color: "#64748b" }
];

// Ensure every user is assigned to at least one project
RAW_USERS.forEach((u, idx) => {
  const pIdx = idx % MOCK_PROJECTS.length;
  if (!MOCK_PROJECTS[pIdx].userIds) MOCK_PROJECTS[pIdx].userIds = [];
  if (!MOCK_PROJECTS[pIdx].userIds!.includes(u.id)) {
    MOCK_PROJECTS[pIdx].userIds!.push(u.id);
  }
});

// Ensure every user has at least one task
RAW_USERS.forEach((u, idx) => {
  const hasTask = MOCK_TASKS.some(t => t.assigneeId === u.id);
  if (!hasTask) {
    const project = MOCK_PROJECTS[idx % MOCK_PROJECTS.length];
    MOCK_TASKS.push({
      id: `t-auto-${u.id}-${Date.now()}`,
      projectId: project.id,
      title: `Workspace Setup for ${u.name}`,
      description: "Auto-generated task to ensure every user has initial workload",
      status: "To Do",
      priority: "Medium",
      assigneeId: u.id,
      estimateHours: 8,
      actualHours: 0,
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
  }
});

// Auto-fill project metrics to make charts look realistic
const projectBumps: Record<string, {actual: number, progress: number}> = {
  "p4": { actual: 320, progress: 64 },
  "p5": { actual: 280, progress: 80 },
  "p6": { actual: 850, progress: 106 },
  "p7": { actual: 410, progress: 68 },
  "p8": { actual: 150, progress: 37 }
};

MOCK_PROJECTS.forEach(p => {
  if (projectBumps[p.id]) {
    p.actualHours = projectBumps[p.id].actual;
    p.remainingHours = Math.max(0, p.estimateHours - p.actualHours);
    p.progressPercentage = projectBumps[p.id].progress;
  }
});

// Auto-generate time logs for charts (especially for the first 6 users)
const todayStr = new Date().toISOString().split("T")[0];
const targetUsers = ["u1", "u2", "u3", "u4", "u5", "u6"];

MOCK_TASKS.forEach(t => {
  if (!t.timeLogs) t.timeLogs = [];
  
  // existing actual hours
  if (t.actualHours > 0) {
    t.timeLogs.push({ id: `log-${t.id}-1`, userId: t.assigneeId || "u1", date: todayStr, hours: t.actualHours, comment: "Logged time" });
  }

  // add extra hours if it's a target user to fill out the utilization chart
  if (targetUsers.includes(t.assigneeId!)) {
    const extra = Math.floor(Math.random() * 20) + 10; // 10-30 hours
    t.actualHours += extra;
    t.timeLogs.push({ id: `log-${t.id}-extra`, userId: t.assigneeId!, date: todayStr, hours: extra, comment: "Additional work for charting" });
  }
});
