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
  },
  {
    id: "p9",
    name: "LLM Integration",
    description: "LLM Integration into DEB SMSF Platform. Intelligent Document Analysis & Auto-Population Engine",
    status: "Active",
    estimateSource: "TASK",
    startDate: "2026-05-01",
    endDate: "",
    estimateHours: 0,
    actualHours: 0,
    remainingHours: 0,
    progressPercentage: 0,
    resourceCount: 4,
    taskCount: 0,
    themeColor: THEME_COLORS[8],
    avatarUrl: "",
    resources: [{ userId: "u9", role: "BA" }, { userId: "u19", role: "Backend" }, { userId: "u15", role: "Frontend" }, { userId: "u14", role: "QC" }],
    companyIds: ["comp-3", "comp-1"],
    specFiles: [],
    stakeholders: [
      { id: "sh-client-3", name: "Internal HR Team", role: "Client", isCustom: true },
      { id: "sh-partner-3", name: "Source Recruitment", role: "Partner", isCustom: true }
    ]
  },
  {
    id: "p10",
    name: "MEzy AI DEB_Artefact",
    description: "DEB Auto-Population from MEzy AI. Wiring Existing MEzy AI JSON Output into DEB Journey Fields",
    status: "Active",
    estimateSource: "TASK",
    startDate: "2026-05-01",
    endDate: "",
    estimateHours: 0,
    actualHours: 0,
    remainingHours: 0,
    progressPercentage: 0,
    resourceCount: 4,
    taskCount: 0,
    themeColor: THEME_COLORS[8],
    avatarUrl: "",
    resources: [{ userId: "u9", role: "BA" }, { userId: "u19", role: "Backend" }, { userId: "u15", role: "Frontend" }, { userId: "u14", role: "QC" }],
    companyIds: ["comp-3", "comp-1"],
    specFiles: [ ],
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
  },
  // ── LLM Integration Project (p9) ───────────────────────────────────────────
  // Phase 0: Initiation (2026-05-01 → 2026-05-14)
  { id: "t1001", projectId: "p9", title: "Stakeholder alignment workshops", description: "Align on scope, priorities, and success criteria with Mick, Mel, Pat, and credit team", status: "To Do", priority: "Medium", assigneeId: "u5", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t1002", projectId: "p9", title: "Infrastructure & environment setup", description: "Provision cloud environments, CI/CD pipelines, dev/staging/prod", status: "To Do", priority: "High", assigneeId: "u12", estimateHours: 40, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: "" },
  // Phase 1: Discovery & PoC (2026-05-15 → 2026-06-11)
  { id: "t1003", projectId: "p9", title: "Document corpus collection", description: "Gather 50+ sample documents per type from production (anonymised)", status: "To Do", priority: "Medium", assigneeId: "u3", estimateHours: 80, actualHours: 0, startDate: "2026-05-15", dueDate: "2026-05-28", oneDeskId: "" },
  { id: "t1004", projectId: "p9", title: "LLM model benchmarking", description: "Evaluate 2–3 LLM candidates against gold-standard extraction targets", status: "To Do", priority: "High", assigneeId: "u18", estimateHours: 80, actualHours: 0, startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: "" },
  { id: "t1005", projectId: "p9", title: "PoC demo to stakeholders", description: "Demonstrate extraction accuracy on 5 core document types", status: "To Do", priority: "Medium", assigneeId: "u7", estimateHours: 40, actualHours: 0, startDate: "2026-06-05", dueDate: "2026-06-11", oneDeskId: "" },
  // Phase 2: Core Engine Development (2026-06-12 → 2026-08-06)
  { id: "t1006", projectId: "p9", title: "Document Ingestion Service", description: "Build upload normalisation, format handling, routing pipeline", status: "To Do", priority: "High", assigneeId: "u2", estimateHours: 80, actualHours: 0, startDate: "2026-06-12", dueDate: "2026-06-25", oneDeskId: "" },
  { id: "t1007", projectId: "p9", title: "Document Classification Engine", description: "Train/configure LLM-based document type classifier for 24 types", status: "To Do", priority: "High", assigneeId: "u14", estimateHours: 80, actualHours: 0, startDate: "2026-06-26", dueDate: "2026-07-09", oneDeskId: "" },
  { id: "t1008", projectId: "p9", title: "LLM Extraction Engine (Tier 1)", description: "Build extraction for core docs: Contract of Sale, Trust Deeds, Payslips, Tax Returns, ID Documents", status: "To Do", priority: "High", assigneeId: "u9", estimateHours: 160, actualHours: 0, startDate: "2026-06-26", dueDate: "2026-07-23", oneDeskId: "" },
  { id: "t1009", projectId: "p9", title: "LLM Extraction Engine (Tier 2)", description: "Extend extraction to remaining docs: Bank Statements, Valuations, Credit Reports, CMA, Rental, BAS", status: "To Do", priority: "High", assigneeId: "u21", estimateHours: 160, actualHours: 0, startDate: "2026-07-10", dueDate: "2026-08-06", oneDeskId: "" },
  { id: "t1010", projectId: "p9", title: "Word Search / Risk Flagging", description: "Implement keyword detection for Valuations (28 risk terms), Bank Statements (12 terms), Home Loan Statements (21 terms)", status: "To Do", priority: "High", assigneeId: "u6", estimateHours: 80, actualHours: 0, startDate: "2026-07-10", dueDate: "2026-07-23", oneDeskId: "" },
  { id: "t1011", projectId: "p9", title: "Field Mapping Service", description: "Build JSON-to-UI field mapping with multi-applicant logic", status: "To Do", priority: "High", assigneeId: "u16", estimateHours: 120, actualHours: 0, startDate: "2026-07-17", dueDate: "2026-08-06", oneDeskId: "" },
  // Phase 3: UI Integration (2026-08-07 → 2026-09-03)
  { id: "t1012", projectId: "p9", title: "Enhanced Doc Upload UI", description: "Drag-and-drop, batch upload, progress indicators, auto-classification preview", status: "To Do", priority: "High", assigneeId: "u11", estimateHours: 80, actualHours: 0, startDate: "2026-08-07", dueDate: "2026-08-20", oneDeskId: "" },
  { id: "t1013", projectId: "p9", title: "Confidence & Review overlay", description: "Per-field confidence indicators, inline correction, accept/reject controls", status: "To Do", priority: "High", assigneeId: "sh2", estimateHours: 80, actualHours: 0, startDate: "2026-08-07", dueDate: "2026-08-20", oneDeskId: "" },
  { id: "t1014", projectId: "p9", title: "Field pre-population integration", description: "Wire Field Mapping Service outputs to all 12 DEB SMSF UI sections", status: "To Do", priority: "High", assigneeId: "u19", estimateHours: 80, actualHours: 0, startDate: "2026-08-21", dueDate: "2026-09-03", oneDeskId: "" },
  { id: "t1015", projectId: "p9", title: "Audit trail UI", description: "Admin-facing audit log view showing AI extraction history per application", status: "To Do", priority: "Medium", assigneeId: "sh3", estimateHours: 40, actualHours: 0, startDate: "2026-08-28", dueDate: "2026-09-03", oneDeskId: "" },
  // Phase 4: Testing & Validation (2026-09-04 → 2026-10-01)
  { id: "t1016", projectId: "p9", title: "Unit & integration testing", description: "Automated test suites for each extraction pipeline", status: "To Do", priority: "High", assigneeId: "u4", estimateHours: 80, actualHours: 0, startDate: "2026-09-04", dueDate: "2026-09-17", oneDeskId: "" },
  { id: "t1017", projectId: "p9", title: "UAT with credit team", description: "Guided testing with Mel's credit team using real-world scenarios", status: "To Do", priority: "High", assigneeId: "u23", estimateHours: 80, actualHours: 0, startDate: "2026-09-18", dueDate: "2026-10-01", oneDeskId: "" },
  { id: "t1018", projectId: "p9", title: "Performance & load testing", description: "Validate <30s processing SLA under peak concurrent users", status: "To Do", priority: "High", assigneeId: "u8", estimateHours: 40, actualHours: 0, startDate: "2026-09-04", dueDate: "2026-09-10", oneDeskId: "" },
  { id: "t1019", projectId: "p9", title: "Security & compliance audit", description: "Penetration testing, data sovereignty verification, privacy impact assessment", status: "To Do", priority: "High", assigneeId: "sh1", estimateHours: 40, actualHours: 0, startDate: "2026-09-11", dueDate: "2026-09-17", oneDeskId: "" },
  // Phase 5: Deployment & Hypercare (2026-10-02 → 2026-10-29)
  { id: "t1020", projectId: "p9", title: "Staged rollout", description: "Pilot with 10% of brokers, then 50%, then 100% over 3 weeks", status: "To Do", priority: "High", assigneeId: "u13", estimateHours: 120, actualHours: 0, startDate: "2026-10-02", dueDate: "2026-10-22", oneDeskId: "" },
  { id: "t1021", projectId: "p9", title: "Training delivery", description: "Broker training sessions, credit team power-user training, admin training", status: "To Do", priority: "Medium", assigneeId: "u20", estimateHours: 80, actualHours: 0, startDate: "2026-10-02", dueDate: "2026-10-15", oneDeskId: "" },
  { id: "t1022", projectId: "p9", title: "Hypercare support", description: "Dedicated support team for first 4 weeks post-launch, daily accuracy monitoring", status: "To Do", priority: "Medium", assigneeId: "u1", estimateHours: 160, actualHours: 0, startDate: "2026-10-02", dueDate: "2026-10-29", oneDeskId: "" },
  { id: "t1023", projectId: "p9", title: "Post-implementation review", description: "Lessons learned, accuracy metrics, user satisfaction survey, roadmap refinement", status: "To Do", priority: "Low", assigneeId: "u15", estimateHours: 40, actualHours: 0, startDate: "2026-10-23", dueDate: "2026-10-29", oneDeskId: "" },
  // ── MEzy AI DEB Artefact Project (p10) ────────────────────────────────────
  // 3.1 Governance
  { id: "t2001", projectId: "p10", title: "Project Charter", description: "One-page scope confirmation: DEB auto-population from existing MEzy AI JSON output for Josh's priority document types. Signed off by Josh and Ben.", status: "To Do", priority: "High", assigneeId: "u5", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t2002", projectId: "p10", title: "RACI Matrix", description: "Roles and responsibilities across Rupert (PM), Pat/Khanh (dev), Ben (governance), Josh (business sign-off), credit team (UAT).", status: "To Do", priority: "Medium", assigneeId: "u10", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t2003", projectId: "p10", title: "Project Schedule", description: "8-week delivery plan with weekly milestones. Earlier delivery encouraged per Peter and Josh.", status: "To Do", priority: "High", assigneeId: "sh2", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t2004", projectId: "p10", title: "Weekly Status Report", description: "Weekly progress update to Josh and Ben: completed, in progress, blockers, risks.", status: "To Do", priority: "Medium", assigneeId: "u17", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-06-25", oneDeskId: "" },
  // 3.2 Baseline Documentation (Critical Path)
  { id: "t2005", projectId: "p10", title: "MEzy AI JSON Schema Spec", description: "Word document containing the current production JSON output schemas for each priority document type. Sourced from the approved MEzy AI Document Spec XLS on the T: drive.", status: "To Do", priority: "High", assigneeId: "u2", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t2006", projectId: "p10", title: "DEB Journey Field Inventory", description: "Register of all fields on the existing DEB journey webpages, organised by UI section. Field name, field type, and UI location for each.", status: "To Do", priority: "High", assigneeId: "sh1", estimateHours: 40, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-07", oneDeskId: "" },
  { id: "t2007", projectId: "p10", title: "JSON-to-DEB Field Mapping", description: "The core mapping document: each MEzy AI JSON output field mapped to its corresponding DEB journey webpage field. Developers to use Claude to assist.", status: "To Do", priority: "High", assigneeId: "u14", estimateHours: 80, actualHours: 0, startDate: "2026-05-01", dueDate: "2026-05-14", oneDeskId: "" },
  { id: "t2008", projectId: "p10", title: "Gap Analysis", description: "Any DEB fields not covered by existing MEzy AI JSON output, and any JSON fields with no corresponding DEB field. Identifies what works out of the box and what needs additional handling.", status: "To Do", priority: "High", assigneeId: "u9", estimateHours: 40, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: "" },
  // 3.3 Solution Design
  { id: "t2009", projectId: "p10", title: "Integration Design", description: "Technical design for how DEB will consume MEzy AI JSON output and auto-populate webpage fields. Covers trigger point, data flow, multi-applicant handling, and field-type conversions.", status: "To Do", priority: "High", assigneeId: "sh3", estimateHours: 40, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-14", oneDeskId: "" },
  { id: "t2010", projectId: "p10", title: "Confidence and Review UX", description: "Design for how auto-populated fields are presented to users: confidence indicators (green/amber/red), inline correction, accept/reject workflow.", status: "To Do", priority: "High", assigneeId: "u6", estimateHours: 80, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-21", oneDeskId: "" },
  { id: "t2011", projectId: "p10", title: "Audit Trail Design", description: "How AI-populated fields are logged: source document, field values, confidence scores, and any manual overrides. Required for lending compliance.", status: "To Do", priority: "High", assigneeId: "u20", estimateHours: 80, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-21", oneDeskId: "" },
  // 3.4 Development Deliverables
  { id: "t2012", projectId: "p10", title: "Auto-Population Engine", description: "The integration code that reads MEzy AI JSON output and populates the corresponding DEB journey fields for each priority document type.", status: "To Do", priority: "High", assigneeId: "u3", estimateHours: 120, actualHours: 0, startDate: "2026-05-15", dueDate: "2026-06-04", oneDeskId: "" },
  { id: "t2013", projectId: "p10", title: "Confidence Scoring UI", description: "Front-end implementation of per-field confidence indicators and the review/correction interface for credit officers.", status: "To Do", priority: "High", assigneeId: "u22", estimateHours: 80, actualHours: 0, startDate: "2026-05-22", dueDate: "2026-06-04", oneDeskId: "" },
  { id: "t2014", projectId: "p10", title: "Audit Trail Module", description: "Back-end logging of all AI-populated fields, source documents, confidence scores, and user corrections.", status: "To Do", priority: "High", assigneeId: "sh4", estimateHours: 80, actualHours: 0, startDate: "2026-05-22", dueDate: "2026-06-04", oneDeskId: "" },
  { id: "t2015", projectId: "p10", title: "Word Search / Risk Flagging", description: "Keyword detection in valuations, bank statements, and home loan statements (existing MEzy AI risk terms) surfaced in the DEB UI.", status: "To Do", priority: "High", assigneeId: "u8", estimateHours: 80, actualHours: 0, startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: "" },
  // 3.5 Testing and UAT
  { id: "t2016", projectId: "p10", title: "Test Plan", description: "Test approach for the integration: unit tests for field mapping, integration tests for end-to-end population, and UAT scenarios.", status: "To Do", priority: "Medium", assigneeId: "u11", estimateHours: 40, actualHours: 0, startDate: "2026-05-22", dueDate: "2026-05-28", oneDeskId: "" },
  { id: "t2017", projectId: "p10", title: "Test Document Set", description: "Anonymised sample documents per priority type for testing extraction-to-population accuracy end to end.", status: "To Do", priority: "Medium", assigneeId: "u15", estimateHours: 120, actualHours: 0, startDate: "2026-05-08", dueDate: "2026-05-28", oneDeskId: "" },
  { id: "t2018", projectId: "p10", title: "UAT Scripts", description: "Step-by-step test scenarios for the credit team: upload document, verify auto-populated fields, test correction workflow, confirm audit trail.", status: "To Do", priority: "High", assigneeId: "u4", estimateHours: 80, actualHours: 0, startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: "" },
  { id: "t2019", projectId: "p10", title: "UAT Sign-off", description: "Formal sign-off from credit team confirming auto-population meets accuracy and usability requirements for each priority document type.", status: "To Do", priority: "High", assigneeId: "u1", estimateHours: 40, actualHours: 0, startDate: "2026-06-12", dueDate: "2026-06-18", oneDeskId: "" },
  // 3.6 Deployment & Post-Launch
  { id: "t2020", projectId: "p10", title: "Deployment Runbook", description: "Step-by-step deployment instructions for releasing the integration to production, including rollback procedures and go/no-go criteria.", status: "To Do", priority: "High", assigneeId: "u16", estimateHours: 80, actualHours: 0, startDate: "2026-06-05", dueDate: "2026-06-18", oneDeskId: "" },
  { id: "t2021", projectId: "p10", title: "Broker User Guide", description: "End-user documentation covering document upload, auto-population review, confidence indicator interpretation, and correction workflow.", status: "To Do", priority: "Medium", assigneeId: "u23", estimateHours: 80, actualHours: 0, startDate: "2026-05-29", dueDate: "2026-06-11", oneDeskId: "" },
  { id: "t2022", projectId: "p10", title: "Go-Live Checklist", description: "Pre-launch verification checklist confirming all systems, integrations, and support processes are ready for production rollout.", status: "To Do", priority: "High", assigneeId: "sh2", estimateHours: 40, actualHours: 0, startDate: "2026-06-12", dueDate: "2026-06-18", oneDeskId: "" },
  { id: "t2023", projectId: "p10", title: "Post-Go-Live Review Report", description: "Summary of hypercare period: accuracy metrics, incident log, user feedback, outstanding issues, and recommended roadmap refinements.", status: "To Do", priority: "Medium", assigneeId: "u7", estimateHours: 40, actualHours: 0, startDate: "2026-06-19", dueDate: "2026-06-25", oneDeskId: "" },
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
