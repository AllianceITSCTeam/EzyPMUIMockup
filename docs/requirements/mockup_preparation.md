# TÀI LIỆU CHUẨN BỊ DỰNG MOCKUP – EzyPM

> Tài liệu này phục vụ việc dựng wireframe / mockup cho hệ thống EzyPM.
> Bao gồm: danh sách màn hình, sơ đồ điều hướng, design tokens và layout chi tiết từng màn hình.
> Cập nhật lần cuối: 2026-03-24
> Người thực hiện: Nhung Trần Thị Hồng

---

## MỤC LỤC

1. [Danh sách màn hình](#1-danh-sách-màn-hình)
2. [Sơ đồ điều hướng](#2-sơ-đồ-điều-hướng)
3. [Design Tokens](#3-design-tokens)
4. [Layout chung](#4-layout-chung)
5. [Chi tiết từng màn hình](#5-chi-tiết-từng-màn-hình)
6. [Ghi chú chung](#6-ghi-chú-chung-cho-người-dựng-mockup)

---

## 1. DANH SÁCH MÀN HÌNH

| ID | Tên màn hình | Module | Vai trò có thể truy cập |
|----|-------------|--------|------------------------|
| S01 | Login | Auth | Tất cả |
| S02 | My Profile | Auth | Tất cả |
| S03 | Change Password | Auth | Tất cả |
| S04 | Dashboard | Dashboard | Tất cả |
| S05 | Danh sách Project | Projects | Tất cả (phạm vi khác nhau) |
| S06 | Tạo / Sửa Project | Projects | Admin, PM |
| S07 | Chi tiết Project | Projects | Tất cả (thành viên project) |
| S08 | Thêm / Sửa Resource | Projects | Admin, PM |
| S09 | Quản lý Stakeholder (trong Project) | Projects | Admin, PM |
| S10 | Danh sách Task — Table view | Projects | Tất cả (thành viên project) |
| S11 | Danh sách Task — Kanban view | Projects | Tất cả (thành viên project) |
| S12 | Tạo / Sửa Task | Projects | Tất cả (thành viên project) |
| S13 | Chi tiết Task | Projects | Tất cả (thành viên project) |
| S13a | Modal Log Hours | Projects | Tất cả (thành viên project) |
| S14 | Danh sách nhân sự | Team | Admin |
| S15 | Tạo / Sửa nhân sự | Team | Admin |
| S16 | Chi tiết nhân sự | Team | Admin |
| S17 | Báo cáo theo Project | Reports | Admin, PM |
| S18 | Báo cáo theo Nhân sự | Reports | Admin, PM, Normal User (bản thân) |
| S19 | Báo cáo Estimate vs. Actual | Reports | Admin, PM, Normal User (bản thân) |
| S20 | Báo cáo Quá hạn / Vượt Estimate | Reports | Admin, PM |
| S21 | Notification Center | System | Tất cả |

---

## 2. SƠ ĐỒ ĐIỀU HƯỚNG

```
[S01 - Login]
    │
    ▼
[S04 - Dashboard] ◄──────────────────────────────────────┐
    │                                                      │
    ├── [Header: Account Menu]                             │
    │       ├── [S02 - My Profile]                         │
    │       ├── [S03 - Change Password]                    │
    │       └── [Switch Light/Dark Mode]                   │
    │                                                      │
    ├── [Header: Notification] ──► [S21]                   │
    │                                                      │
    ├── MODULE PROJECTS                                    │
    │     ├── [S05 - Danh sách Project]                    │
    │     │       ├── [+ Tạo] ──► [S06 - Modal Tạo/Sửa]   │
    │     │       └── [Chọn card] ──► [S07 - Chi tiết]    │
    │     │                 ├── Tab Resources              │
    │     │                 │     └── [+ Add] ──► [S08]   │
    │     │                 ├── Tab Tasks                  │
    │     │                 │     ├── [Table ⇌ Kanban]     │
    │     │                 │     │    ├── S10 (Table)     │
    │     │                 │     │    └── S11 (Kanban)    │
    │     │                 │     ├── [+ Tạo] ──► [S12]   │
    │     │                 │     └── [Chọn] ──► [S13]    │
    │     │                 │           ├── [Log Hours]──► [S13a]
    │     │                 │           └── [Sửa] ──► [S12]
    │     │                 └── Tab Stakeholders ──► [S09] │
    │                                                      │
    ├── MODULE TEAM (Admin only)                           │
    │     ├── [S14 - Danh sách nhân sự]                    │
    │     │       ├── [+ Tạo] ──► [S15 - Modal]            │
    │     │       └── [Chọn] ──► [S16 - Chi tiết]          │
    │     │                         └── [Sửa] ──► [S15]   │
    │                                                      │
    └── MODULE REPORTS                                     │
          ├── [S17 - Báo cáo theo Project]                 │
          ├── [S18 - Báo cáo theo Nhân sự]                 │
          ├── [S19 - Estimate vs. Actual]                  │
          └── [S20 - Quá hạn / Vượt Estimate]             │
```

---

## 3. DESIGN TOKENS

### 3.1. Màu sắc — Brand & Semantic

| Token | Tên | Light Mode | Dark Mode | Dùng cho |
|-------|-----|-----------|-----------|---------|
| `color-primary` | Brand Blue | `#2563EB` | `#3B82F6` | Nút chính, link active, header |
| `color-primary-light` | Light Blue | `#EFF6FF` | `#1E3A5F` | Background highlight, badge |
| `color-secondary` | Brand Green | `#16A34A` | `#22C55E` | Accent xanh lá, icon success |
| `color-secondary-light` | Light Green | `#F0FDF4` | `#14532D` | Background secondary highlight |
| `color-success` | Green | `#16A34A` | `#22C55E` | Status Completed, Progress bình thường |
| `color-warning` | Amber | `#D97706` | `#F59E0B` | Icon ⚠️, Progress > 100%, Overrun |
| `color-danger` | Red | `#DC2626` | `#EF4444` | Quá hạn, lỗi validation |
| `color-page-bg` | Page BG | `#F9FAFB` | `#0F172A` | Nền trang |
| `color-surface` | Surface | `#FFFFFF` | `#1E293B` | Card, modal, sidebar |
| `color-border` | Border | `#E5E7EB` | `#334155` | Đường viền, divider |
| `color-text-primary` | Text primary | `#111827` | `#F1F5F9` | Tiêu đề, nội dung chính |
| `color-text-secondary` | Text secondary | `#6B7280` | `#94A3B8` | Label, placeholder, caption |

### 3.2. Màu trạng thái Task (Status Badge)

| Status | BG (Light) | Text (Light) | BG (Dark) | Text (Dark) |
|--------|-----------|-------------|-----------|------------|
| `To Do` | `#F3F4F6` | `#374151` | `#1F2937` | `#9CA3AF` |
| `In Progress` | `#DBEAFE` | `#1D4ED8` | `#1E3A5F` | `#60A5FA` |
| `Pending` | `#FEF3C7` | `#92400E` | `#422006` | `#FCD34D` |
| `On Hold` | `#E5E7EB` | `#4B5563` | `#1F2937` | `#6B7280` |
| `No Specs` | `#FEE2E2` | `#991B1B` | `#450A0A` | `#FCA5A5` |
| `Completed` | `#DCFCE7` | `#166534` | `#052E16` | `#4ADE80` |
| `Closed` | `#F3F4F6` | `#9CA3AF` | `#1F2937` | `#6B7280` |

### 3.3. Màu Priority

| Priority | Icon | Màu |
|----------|------|-----|
| `Critical` | 🔴 | `#DC2626` |
| `High` | 🟠 | `#EA580C` |
| `Medium` | 🟡 | `#CA8A04` |
| `Low` | 🟢 | `#16A34A` |

### 3.4. Typography — Font: Inter

| Token | Size | Weight | Line Height | Dùng cho |
|-------|------|--------|------------|---------|
| `text-page-title` | 24px | 700 | 32px | Tiêu đề trang |
| `text-section-title` | 18px | 600 | 28px | Tiêu đề section |
| `text-card-title` | 16px | 600 | 24px | Tiêu đề card |
| `text-body` | 14px | 400 | 20px | Nội dung thông thường |
| `text-label` | 13px | 500 | 18px | Label form, header cột bảng |
| `text-caption` | 12px | 400 | 16px | Ghi chú, timestamp |

### 3.5. Spacing, Border Radius & Shadow

| Token | Giá trị |
|-------|---------|
| Spacing base | 4px (scale: 4, 8, 12, 16, 20, 24, 32, 48px) |
| Border radius — card | 8px |
| Border radius — button | 6px |
| Border radius — input | 6px |
| Border radius — badge | 9999px (pill) |
| Border radius — modal | 12px |
| Shadow — card | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` |
| Shadow — modal | `0 20px 60px rgba(0,0,0,0.15)` |

### 3.6. Quy tắc định dạng

| Nội dung | Format |
|----------|--------|
| Ngày tháng | `DD/MM/YYYY` |
| Giờ | `h:mm` (ví dụ: `8:30`, `1:15`) |
| Số giờ ngắn | `8h 30m` hoặc `8:30` |

---

## 4. LAYOUT CHUNG

### 4.1. Cấu trúc layout sau khi đăng nhập

```
┌────────────────────────────────────────────────────────┐
│  HEADER (56px)                                         │
│  [Logo EzyPM]    [Breadcrumb luôn hiển thị]    [🔔][👤]│
├────────────┬───────────────────────────────────────────┤
│            │                                           │
│  SIDEBAR   │          MAIN CONTENT AREA               │
│ (240px mở) │          (fluid width)                   │
│ (48px thu) │                                           │
│            │                                           │
│ [≡] Toggle │                                           │
│ 🏠 Dashboard│                                          │
│ 📁 Projects│                                           │
│ 👥 Team    │                                           │
│ 📊 Reports │                                           │
│            │                                           │
└────────────┴───────────────────────────────────────────┘
```

### 4.2. Sidebar Navigation

**Hành vi sidebar:**
- Mặc định: **mở rộng 240px** (hiển thị icon + label)
- Thu gọn: **48px** (icon only, tooltip khi hover)
- Nút toggle (☰) để đóng/mở
- Tablet: tự động thu gọn về icon-only
- Mobile: ẩn hoàn toàn, mở bằng hamburger menu

| Menu Item | Icon | Hiển thị với |
|-----------|------|-------------|
| Dashboard | 🏠 | Tất cả |
| Projects | 📁 | Tất cả |
| Team | 👥 | Admin only |
| Reports | 📊 | Tất cả (phạm vi khác nhau) |

**Active state:** Item đang active có nền màu `color-primary-light` và text màu `color-primary`.

### 4.3. Breadcrumb

Breadcrumb **luôn hiển thị** trên header hoặc dưới header ở mọi màn hình:
- Dashboard: `Dashboard`
- Danh sách Project: `Projects`
- Chi tiết Project: `Projects / Tên Project A`
- Chi tiết Task: `Projects / Tên Project A / Tên Task`

### 4.4. Breakpoints Responsive

| Breakpoint | Width | Sidebar | Layout |
|-----------|-------|---------|--------|
| Desktop | ≥ 1280px | Expanded (240px) | Sidebar + Content |
| Tablet | 768–1279px | Collapsed (48px icon) | Sidebar icon + Content |
| Mobile | < 768px | Ẩn (hamburger) | Full-width content |

### 4.5. Toast Notification (Feedback hệ thống)

- Vị trí: **góc trên bên phải** màn hình
- Tự động đóng sau **3 giây**
- Có nút [✕] đóng thủ công
- Types: `success` (xanh lá) / `error` (đỏ) / `warning` (cam) / `info` (xanh dương)

```
┌────────────────────────────────┐
│ ✅  Lưu thành công!       [✕] │
└────────────────────────────────┘
```

### 4.6. Loading & Empty State

| Tình huống | Xử lý |
|-----------|-------|
| Đang tải dữ liệu | **Spinner** vòng xoay trung tâm |
| Danh sách rỗng | Text đơn giản: _"Chưa có dữ liệu"_ |

---

## 5. CHI TIẾT TỪNG MÀN HÌNH

---

### S01 – Login

**Layout:**
```
┌──────────────────────────────────────┐
│                                      │
│           [Logo EzyPM]               │
│         Project Management           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Email                         │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Password                 [👁] │  │
│  └────────────────────────────────┘  │
│                                      │
│              [Quên mật khẩu?]        │
│                                      │
│  [          Đăng nhập           ]    │
│                                      │
└──────────────────────────────────────┘
```

**Ghi chú:**
- Không có màn hình đăng ký (Admin tạo tài khoản)
- Lỗi sai thông tin: hiển thị text đỏ inline dưới field

---

### S02 – My Profile

**Layout:**
```
┌──────────────────────────────────────────────┐
│  My Profile                                  │
├──────────────┬───────────────────────────────┤
│ [  Avatar  ] │  Họ tên *    [______________] │
│ (initials /  │  Email *     [______________] │
│  ảnh upload) │  Số điện thoại[_____________] │
│ [Đổi ảnh]   │  Vai trò     [  PM  ] (readonly)│
│              │  Kỹ năng     [BE][NodeJS][+]  │
│              │                               │
│              │       [ Lưu thay đổi ]        │
└──────────────┴───────────────────────────────┘
```

**Ghi chú:**
- Avatar: mặc định initials (2 chữ cái đầu, màu nền ngẫu nhiên cố định theo user)
- Trường "Vai trò" read-only
- Kỹ năng: tag input — gõ + Enter để thêm, click [✕] để xóa

---

### S04 – Dashboard

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Dashboard — Xin chào, Nguyen Van A 👋                   │
├──────────────────────────────────────────────────────────┤
│  PROGRESS THEO PROJECT                                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ │
│  │ 📁 Project A    │ │ 📁 Project B    │ │ 📁 Proj C  │ │
│  │ Est:  80:00     │ │ Est:  120:00    │ │ Est: 40:00 │ │
│  │ Act:  55:00     │ │ Act:  130:00 ⚠️ │ │ Act: 20:00 │ │
│  │ [████████] 69%  │ │ [██████████]108%│ │ [████] 50% │ │
│  └─────────────────┘ └─────────────────┘ └────────────┘ │
├──────────────────────────────────────────────────────────┤
│  [ Current Tasks ] [ Pending Tasks ] [ Past Tasks ]  ← Tabs
├──────────────────────────────────────────────────────────┤
│  (Tab: Current Tasks đang active)                        │
│  Task name       │ Project   │ Est   │ Act   │ Due       │
│  ─────────────── │ ───────── │ ───── │ ───── │ ─────     │
│  Task Alpha      │ Project A │ 8:00  │ 6:00  │ 05/04     │
│  Task Beta       │ Project B │ 16:00 │ 4:00  │ 10/04     │
│  ...             │ (scroll tự do)                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ACTIVITIES LOG                                          │
│  🔔 Bạn được assign task "Task Alpha"  •  2 phút trước  │
│  ✅ Task "Task Beta" đã Completed      •  1 giờ trước   │
│  💬 Comment mới tại task "Task Gamma"  •  3 giờ trước   │
│  ...  (top 10)                  [ Xem tất cả thông báo ]│
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Mini-card project: progress bar màu cam + ⚠️ nếu > 100%
- 3 tabs (Current / Pending / Past): bảng scroll tự do, không giới hạn dòng

---

### S05 – Danh sách Project

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Projects                           [+ Create Project]   │
│  [🔍 Tìm kiếm...]   [Status ▾]   [Sort: Mới nhất ▾]     │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐ ┌───────────────────────┐│
│  │ 📁 Project Alpha           │ │ 📁 Project Beta        ││
│  │ [Active]  [TASK]           │ │ [On Hold]  [RESOURCE]  ││
│  │ Mô tả ngắn...             │ │ Mô tả...               ││
│  │ 01/01 → 30/06/2026        │ │ 01/02 → 31/12/2026     ││
│  │ 👥 8  📋 24 tasks         │ │ 👥 5  📋 15 tasks      ││
│  │ [████████░] 72%           │ │ [██████████░] 108% ⚠️  ││
│  └────────────────────────────┘ └───────────────────────┘│
│  ┌────────────────────────────┐ ┌───────────────────────┐│
│  │ ...                        │ │ ...                    ││
│  └────────────────────────────┘ └───────────────────────┘│
│  (infinite scroll khi cuộn xuống)                        │
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Nút "+ Create Project" chỉ hiện với Admin / PM
- Card grid 2–3 cột tùy viewport
- Infinite scroll khi có > 20 project

---

### S06 – Tạo / Sửa Project (Modal)

**Layout:**
```
┌──────────────────────────────────────────┐
│  Tạo Project mới                    [✕] │
├──────────────────────────────────────────┤
│  Tên project *                           │
│  [________________________________________]│
│                                          │
│  Mô tả                                   │
│  [________________________________________]│
│  [________________________________________]│
│                                          │
│  Trạng thái *          Estimate Source * │
│  [ Active         ▾ ]  ○ TASK            │
│                         ○ RESOURCE       │
│                                          │
│  Ngày bắt đầu *        Ngày kết thúc *  │
│  [__//__/____]         [__//__/____]     │
│                                          │
│  Ghi chú                                 │
│  [________________________________________]│
├──────────────────────────────────────────┤
│  ⚠️ (khi Sửa, đổi EstimateSource):       │
│  Thay đổi này sẽ ảnh hưởng đến Progress  │
│  và Remaining Hours của project.          │
├──────────────────────────────────────────┤
│              [Huỷ]   [Lưu Project]       │
└──────────────────────────────────────────┘
```

---

### S07 – Chi tiết Project

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Projects / Project Alpha                    [✏️ Sửa]    │
├──────────────────────────────────────────────────────────┤
│  [Active]  [TASK]  │  01/01/2026 – 30/06/2026            │
│  Mô tả: Lorem ipsum...                                   │
│                                                          │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Estimate  │ │  Actual  │ │Remaining │ │ Progress  │  │
│  │ 200:00 h  │ │ 145:30 h │ │  54:30 h │ │  72.75%   │  │
│  └───────────┘ └──────────┘ └──────────┘ └───────────┘  │
│                                                          │
│  [ Resources ] [ Tasks ] [ Stakeholders ]  ← Tabs        │
├──────────────────────────────────────────────────────────┤
│  TAB RESOURCES (active)              [+ Add Resource]    │
│  Tên          │ Vai trò  │ Est (h)  │ Từ ngày  │ Đến    │
│  ─────────────│──────────│──────────│──────────│────────│
│  Nguyen Van A │ Backend  │ 60:00    │ 01/01    │ 30/06  │
│  Tran Thi B   │ QC       │ 40:00    │ 01/02    │ 30/06  │
│                                      [✏️]      [🗑]      │
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Tab Resources: nút Add/Edit/Delete chỉ hiện với Admin/PM
- Tab Tasks: điều hướng sang S10/S11
- Tab Stakeholders: điều hướng sang S09

---

### S08 – Thêm / Sửa Resource (Modal)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Thêm nhân sự vào Project          [✕] │
├─────────────────────────────────────────┤
│  Nhân sự *                              │
│  [ Chọn nhân sự...               ▾ ]  │
│                                         │
│  Vai trò trong project *                │
│  [ Backend                        ▾ ]  │
│  (combobox — gõ tự do hoặc chọn gợi ý) │
│                                         │
│  Từ ngày *              Đến ngày *      │
│  [__//__/____]          [__//__/____]   │
│                                         │
│  Estimate (h:mm)                        │
│  [______]  ← chỉ hiện khi source=RESOURCE│
├─────────────────────────────────────────┤
│               [Huỷ]   [Lưu]            │
└─────────────────────────────────────────┘
```

---

### S09 – Quản lý Stakeholder trong Project (Tab / Modal)

**Layout tab Stakeholders trong S07:**
```
┌──────────────────────────────────────────────────────────┐
│  TAB STAKEHOLDERS                   [+ Add Stakeholder]  │
│  Tên Stakeholder  │ Vai trò       │ Email │ Tổ chức      │
│  ─────────────────│───────────────│───────│──────────────│
│  Nguyen Thi C     │ Business Owner│ ...   │ Công ty ABC  │
│  Tran Van D       │ Client        │ ...   │ Khách hàng X │
│                                    [✏️]        [🗑]       │
└──────────────────────────────────────────────────────────┘
```

**Modal Thêm / Sửa Stakeholder:**
```
┌─────────────────────────────────────────┐
│  Thêm Stakeholder                  [✕] │
├─────────────────────────────────────────┤
│  Stakeholder *                          │
│  [ Chọn stakeholder...           ▾ ]   │
│                                         │
│  Vai trò *                              │
│  [ Client                        ▾ ]   │
│  (từ danh mục Stakeholder Role)         │
├─────────────────────────────────────────┤
│               [Huỷ]   [Lưu]            │
└─────────────────────────────────────────┘
```

---

### S10 – Danh sách Task — Table View

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Tasks — Project Alpha              [+ Create Task]      │
│  [🔍 Tìm...]  [Status ▾]  [Assignee ▾]  [Priority ▾]    │
│                              [≡ Table] [⬛ Kanban] ← Toggle│
├──────────────────────────────────────────────────────────┤
│  Task name      │Assignee │ Status    │Pri│ Est  │ Act  │Due     │
│  ───────────────│─────────│───────────│───│──────│──────│────────│
│  Task Alpha     │ Van A   │[In Prog]  │🔴 │ 8:00 │ 6:30 │05/04  │
│  Subtask Alpha-1│ Van A   │[To Do]    │🟡 │ 2:00 │ 0:00 │05/04  │
│  Task Beta      │ Thi B   │[Pending]  │🟡 │16:00 │ 0:00 │10/04  │
│  Task Gamma     │  —      │[To Do]    │🟢 │ 4:00 │ 0:00 │15/04  │
│  ...            │ (flat list, scroll tự do)                      │
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Subtask hiển thị như task bình thường (flat, không indent)
- Cột Assignee `—` = chưa có người nhận
- Click vào task → S13 Chi tiết Task

---

### S11 – Danh sách Task — Kanban View

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Tasks — Project Alpha              [+ Create Task]              │
│                              [≡ Table] [⬛ Kanban] ← Toggle      │
├────────────┬─────────────┬──────────┬──────────┬────────┬───────┤
│  TO DO (3) │IN PROGRESS(2)│PENDING(1)│ ON HOLD  │NO SPECS│DONE  │
│            │             │          │          │        │      │
│ ┌────────┐ │ ┌─────────┐ │┌───────┐ │          │        │      │
│ │Task C  │ │ │Task A   │ ││Task B │ │          │        │      │
│ │Van A 🔴│ │ │Thi B 🟡 │ ││ — 🟢 │ │          │        │      │
│ │Est:4:00│ │ │Est:8:00 │ ││Est:16h│ │          │        │      │
│ └────────┘ │ └─────────┘ │└───────┘ │          │        │      │
│ ┌────────┐ │ ┌─────────┐ │          │          │        │      │
│ │Task D  │ │ │Task E   │ │          │          │        │      │
│ │  —  🟢 │ │ │Van A 🔴 │ │          │          │        │      │
│ └────────┘ │ └─────────┘ │          │          │        │      │
│ + Add task │ + Add task  │ + Add    │ + Add    │ + Add  │+Add  │
└────────────┴─────────────┴──────────┴──────────┴────────┴──────┘
```

**Ghi chú:**
- Kéo thả card giữa các cột để đổi status
- Mỗi card hiển thị: tên task, assignee avatar, priority icon, estimate
- "+ Add task" trong cột tạo task mới với status tương ứng

---

### S12 – Tạo / Sửa Task (Modal)

**Layout:**
```
┌────────────────────────────────────────────────┐
│  Tạo Task mới                             [✕] │
├────────────────────────────────────────────────┤
│  Tên task *                                    │
│  [____________________________________________]│
│                                                │
│  Mô tả                                         │
│  [____________________________________________]│
│  [____________________________________________]│
│                                                │
│  Project *              Assignee               │
│  [Project Alpha    ▾]   [Chọn nhân sự...  ▾]  │
│                                                │
│  Status *               Priority *             │
│  [To Do            ▾]   [Medium           ▾]  │
│                                                │
│  Estimate (h:mm)        Actual (h:mm)          │
│  [____:__]              (tính từ log hours)    │
│                                                │
│  Ngày bắt đầu *         Ngày kết thúc *        │
│  [__//__/____]          [__//__/____]          │
│                                                │
│  Subtasks                                      │
│  [+ Add subtask]                               │
│                                                │
│  Task Links                                    │
│  [Loại link ▾]  [Chọn task...  ▾]  [+ Add]    │
│  Blocks → Task Beta                       [✕]  │
├────────────────────────────────────────────────┤
│                  [Huỷ]   [Lưu Task]            │
└────────────────────────────────────────────────┘
```

**Ghi chú:**
- Actual Hours: read-only, tính tự động từ Log Hours
- Trường Project: Normal User chỉ thấy project mình thuộc về
- Status mặc định: `To Do`

---

### S13 – Chi tiết Task

**Layout (2 cột):**
```
┌──────────────────────────────────────────────────────────┐
│  Projects / Project Alpha / Task Alpha      [✏️ Sửa]     │
├──────────────────────────┬───────────────────────────────┤
│  CỘT TRÁI                │  SIDEBAR (cột phải)           │
│  ─────────────────────── │  ─────────────────────────    │
│  [In Progress] 🔴 High   │  Assignee                     │
│                          │  [Avatar] Nguyen Van A        │
│  Mô tả:                  │  [ Tự nhận task ] ← nếu trống│
│  Lorem ipsum dolor...    │                               │
│                          │  Project: Project Alpha       │
│  ─────────────────────── │  Start:   01/03/2026          │
│  📎 FILE ATTACHMENTS     │  End:     10/03/2026          │
│  [Kéo thả file vào đây]  │                               │
│  [+ Đính kèm file]       │  Estimate:  8:00              │
│  • design_v2.fig  [🗑]   │  Actual:    6:30              │
│  • screenshot.png [🗑]   │  Remaining: 1:30              │
│                          │  [███████░] 81.25%            │
│  ─────────────────────── │                               │
│  📋 SUBTASKS             │  [ Đổi Status      ▾ ]       │
│  ☐ Subtask 1 — Van A     │  [ Log Hours ]                │
│  ☑ Subtask 2 — Van A     │                               │
│  [+ Add subtask]         │                               │
│                          │                               │
│  ─────────────────────── │                               │
│  🔗 TASK LINKS           │                               │
│  Blocks → Task Beta      │                               │
│  [+ Add link]            │                               │
│                          │                               │
├──────────────────────────┴───────────────────────────────┤
│  💬 COMMENT                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [B] [I] [•≡] [A▾] [🔗] [@]  📎         [Gửi]   │   │
│  │ Gõ comment... (hỗ trợ @mention, paste ảnh)      │   │
│  └──────────────────────────────────────────────────┘   │
│  [Avatar] Van A — 10 phút trước                         │
│  Đã hoàn thành phần API, cần review thêm.               │
│  [✏️ Sửa] [🗑 Xóa]                                      │
│  ──────────────────────────────────────────────────────  │
│  📋 STATUS HISTORY                                       │
│  Van A đổi To Do → In Progress  •  01/03/2026 09:15     │
│  Thi B đổi In Progress → Pending  •  03/03/2026 14:00   │
│  ──────────────────────────────────────────────────────  │
│  ⏱ LOG TIME HISTORY                                     │
│  Van A — 2:30 — "Hoàn thành login flow"  •  01/03 10:00 │
│  Van A — 4:00 — "Fix bug redirect"       •  02/03 17:00 │
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Comment: rich text (Bold/Italic/Bullet/Màu chữ/Link), đính kèm file (paste), @mention
- Comment có thể sửa / xóa (chỉ của chính mình)
- Status History & Log Time History: 2 vùng riêng biệt, tự động ghi bởi hệ thống

---

### S13a – Modal Log Hours

**Layout:**
```
┌───────────────────────────────────────┐
│  Log Hours — Task Alpha          [✕] │
├───────────────────────────────────────┤
│  Thời gian (h:mm) *                   │
│  [____:__]                            │
│                                       │
│  Ngày *                               │
│  [24/03/2026]  (mặc định hôm nay)    │
│                                       │
│  Ghi chú / Comment                    │
│  [___________________________________]│
│  [___________________________________]│
├───────────────────────────────────────┤
│  Actual Hours tích lũy: 6:30          │
│  Sau khi log thêm: 9:00               │
├───────────────────────────────────────┤
│             [Huỷ]   [Log Hours]       │
└───────────────────────────────────────┘
```

**Ghi chú:**
- Hiển thị Actual hiện tại và preview sau khi log
- Mỗi lần log lưu vào Log Time History của task

---

### S14 – Danh sách nhân sự (Admin only)

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Team                                     [+ Tạo nhân sự]   │
│  [🔍 Tìm...]  [Vai trò ▾]  [Kỹ năng ▾]  [Trạng thái ▾]     │
│                                                              │
│  Filter nhanh: [Tất cả] [🟢 Available] [🟡 Busy] [🔴 Overloaded]│
├──────────────────────────────────────────────────────────────┤
│  Tên              │Vai trò│ Kỹ năng    │Proj│Tasks│ Trạng thái│
│  ─────────────────│───────│────────────│────│─────│───────────│
│  [NV] Nguyen Van A│ PM    │ BE, NodeJS │  3 │  8  │🟡 Busy    │
│  [TB] Tran Thi B  │Normal │ QC,Selenium│  2 │  0  │🟢 Available│
│  [LC] Le Van C    │Normal │ Frontend   │  1 │  5  │🔴 Overloaded│
│  ...              │       │ (scroll)   │    │     │           │
└──────────────────────────────────────────────────────────────┘
```

**Logic badge Trạng thái (tự động):**

| Badge | Điều kiện |
|-------|-----------|
| 🟢 `Available` | Không có task `In Progress` hoặc `Pending` |
| 🟡 `Busy` | Có ≥ 1 task `In Progress` hoặc `Pending` |
| 🔴 `Overloaded` | Utilization tháng hiện tại > 100% |

**Ghi chú:**
- Filter nhanh "🟢 Available" → Admin thấy ngay ai đang rảnh task
- Avatar initials trong ô tròn, màu nền cố định theo user
- Click vào tên → S16 Chi tiết nhân sự
- Cột "Tasks" = số task đang active (In Progress + Pending)

---

### S15 – Tạo / Sửa nhân sự (Modal)

**Layout:**
```
┌──────────────────────────────────────────┐
│  Tạo nhân sự mới                    [✕] │
├──────────────────────────────────────────┤
│  Họ tên *                                │
│  [______________________________________]│
│  Email *                                 │
│  [______________________________________]│
│  Số điện thoại                           │
│  [______________________________________]│
│  Vai trò hệ thống *                      │
│  [ Normal User                     ▾ ]  │
│  Kỹ năng                                 │
│  [tag input — gõ Enter để thêm]          │
│  Mật khẩu tạm * (chỉ khi tạo mới)       │
│  [______________________________________]│
├──────────────────────────────────────────┤
│                [Huỷ]   [Lưu]            │
└──────────────────────────────────────────┘
```

---

### S16 – Chi tiết nhân sự

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Team / Nguyen Van A                        [✏️ Sửa]    │
├──────────────────┬───────────────────────────────────────┤
│ THÔNG TIN        │  THỐNG KÊ HIỆU SUẤT                  │
│ ──────────────── │  ────────────────────────────────     │
│ [NV]  (avatar)   │  ┌──────┐  ┌──────┐  ┌──────────┐   │
│ Vai trò: PM      │  │Total │  │ Done │  │ On-time  │   │
│ Email: ...       │  │Tasks │  │Tasks │  │   Rate   │   │
│ SĐT: ...         │  │  24  │  │  18  │  │   75%    │   │
│ Kỹ năng:         │  └──────┘  └──────┘  └──────────┘   │
│ [BE][NodeJS][SQL]│  ┌──────┐  ┌──────┐  ┌──────┐ ┌───┐ │
│                  │  │Est.  │  │ Act. │  │ A/E  │ │OD │ │
│                  │  │200:00│  │180:00│  │ 0.9x │ │ 2 │ │
│                  │  └──────┘  └──────┘  └──────┘ └───┘ │
├──────────────────┴───────────────────────────────────────┤
│  PROJECTS ĐANG THAM GIA                                  │
│  📁 Project A — Backend   │  📁 Project B — QC           │
├──────────────────────────────────────────────────────────┤
│  TASKS HIỆN TẠI                                          │
│  Task name │ Project   │ Status      │ Est   │ Act  │Due │
│  ──────────│───────────│─────────────│───────│──────│────│
│  Task Alpha│ Project A │ [In Prog]   │ 8:00  │ 6:30 │05/04│
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- OD = Overdue Tasks; số liệu chỉ hiển thị, không tổng hợp thành 1 chỉ số

---

### S17 – Báo cáo theo Project

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Báo cáo theo Project                                    │
│  [Tháng này ▾]  [01/03/2026 — 31/03/2026] (date picker) │
│  [Chọn Project ▾]                                        │
├──────────────────────────────────────────────────────────┤
│  BAR CHART: Estimate vs Actual theo từng Project         │
│  │                                                        │
│  │ █ Estimate   █ Actual                                  │
│  │    ████ ███                                            │
│  │    ████ █████  ████ ███                                │
│  └─── Proj A ─── Proj B ─── Proj C ──                    │
├──────────────────────────────────────────────────────────┤
│  Tên project  │Status│Est    │Actual │Remain │Progress   │
│  ─────────────│──────│───────│───────│───────│───────────│
│  Project A    │Active│200:00 │145:30 │ 54:30 │ 72.75%    │
│  Project B    │OnHold│ 80:00 │ 92:00 │  -    │108.0% ⚠️  │
└──────────────────────────────────────────────────────────┘
```

---

### S18 – Báo cáo theo Nhân sự

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Báo cáo theo Nhân sự                                    │
│  [Tháng này ▾]  [01/03/2026 — 31/03/2026]               │
│  [Chọn nhân sự ▾]                                        │
├──────────────────────────────────────────────────────────┤
│  BAR CHART: Utilization (%) theo từng nhân sự            │
│  │── 100% ────────────────────────────── (ngưỡng chuẩn) │
│  │  ████  ████  ███  █████  ████                         │
│  └── A ─── B ─── C ─── D ─── E ──                       │
├──────────────────────────────────────────────────────────┤
│  Tên         │Vai trò│Projects│Tasks│Est    │Act │Util   │
│  ────────────│───────│────────│─────│───────│────│───────│
│  Nguyen Van A│ PM    │   3    │  8  │ 80:00 │65:00│40.6% │
│  Tran Thi B  │Normal │   2    │  5  │100:00 │185:00│115%⚠️│
└──────────────────────────────────────────────────────────┘
```

---

### S19 – Báo cáo Estimate vs. Actual

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Estimate vs. Actual                                     │
│  Xem theo: [Project ▾]  [Tháng này ▾]  [01/03—31/03]    │
├──────────────────────────────────────────────────────────┤
│  LINE CHART: Xu hướng Actual vs Estimate theo thời gian  │
│  │     ──── Estimate                                      │
│  │   /  ╌╌╌ Actual                                        │
│  │ /                                                       │
│  └──── T1 ── T2 ── T3 ── T4 ──                           │
├──────────────────────────────────────────────────────────┤
│  Tên         │ Estimate │ Actual │ Chênh lệch │    %     │
│  ────────────│──────────│────────│────────────│──────────│
│  Project A   │  200:00  │ 145:30 │  -54:30    │ -27.25%  │
│  Project B   │   80:00  │  92:00 │  +12:00 ⚠️ │ +15.00%  │
└──────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Chênh lệch dương (Actual > Estimate): màu đỏ + ⚠️
- Chênh lệch âm (Actual < Estimate): màu xanh lá

---

### S20 – Báo cáo Quá hạn / Vượt Estimate

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Báo cáo rủi ro                                          │
│  [Task quá hạn] [Project quá hạn] [Overrun] [Workload]   │
├──────────────────────────────────────────────────────────┤
│  TAB: TASK QUÁ HẠN                                       │
│  Task name   │ Project   │ Assignee │ Due date │ Trễ     │
│  ────────────│───────────│──────────│──────────│─────────│
│  Task X      │ Project A │ Van A    │ 20/03/26 │ +4 ngày │ ← highlight đỏ
│  Task Y      │ Project B │  —       │ 18/03/26 │ +6 ngày │ ← highlight đỏ
├──────────────────────────────────────────────────────────┤
│  TAB: WORKLOAD QUÁ TẢI                                   │
│  Nhân sự    │ Actual (tháng) │ Chuẩn (160h) │ Utilization│
│  ───────────│────────────────│──────────────│────────────│
│  Tran Thi B │    185:00      │    160:00    │  115.6% ⚠️ │ ← highlight cam
└──────────────────────────────────────────────────────────┘
```

---

### S21 – Notification Center

**Layout (dropdown từ icon 🔔 trên header):**
```
┌─────────────────────────────────────────┐
│  Thông báo                  [Đọc tất cả]│
├─────────────────────────────────────────┤
│ 🔵 Bạn được assign "Task Alpha"         │
│    Project Alpha  •  2 phút trước       │
├─────────────────────────────────────────┤
│    💬 Comment mới tại "Task Beta"        │
│    Van A: "Cần check lại..."            │
│    Project Alpha  •  1 giờ trước        │
├─────────────────────────────────────────┤
│    ✅ Task "Task Gamma" đã Completed     │
│    Project Beta  •  3 giờ trước         │
├─────────────────────────────────────────┤
│        [ Xem tất cả thông báo ]         │
└─────────────────────────────────────────┘
```

**Ghi chú:**
- Hiển thị top 10 thông báo mới nhất
- Chưa đọc: dấu chấm 🔵, text đậm hơn
- Click vào thông báo → navigate thẳng đến task/project liên quan
- Badge số đỏ trên icon 🔔 hiện số thông báo chưa đọc

---

## 6. GHI CHÚ CHUNG CHO NGƯỜI DỰNG MOCKUP

| # | Ghi chú |
|---|---------|
| 1 | **Tool:** Figma (ưu tiên để handoff dev) |
| 2 | **Font:** Inter — tải từ Google Fonts |
| 3 | **Dựng Desktop (1440px) trước**, sau đó adapt Tablet (768px) và Mobile |
| 4 | **Dựng cả Light Mode và Dark Mode** — dùng Figma Variables để quản lý màu |
| 5 | Sidebar: dựng cả 2 state — **expanded (240px)** và **collapsed (48px)** |
| 6 | Mỗi form modal dựng cả **2 state**: trạng thái rỗng (tạo mới) + đã điền (sửa) |
| 7 | Empty state: chỉ text _"Chưa có dữ liệu"_, không cần illustration |
| 8 | Loading: **Spinner** trung tâm, không dùng skeleton |
| 9 | Toast: góc trên phải, 3 giây tự đóng — dựng đủ 4 type: success/error/warning/info |
| 10 | **Thứ tự ưu tiên dựng:** S01 → S04 → S05 → S07 → S13 → S12 → S14 |

---

*Cập nhật lần cuối: 2026-03-24*
