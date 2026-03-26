# DANH SÁCH MÀN HÌNH / TÍNH NĂNG HỆ THỐNG – EzyPM

> Tài liệu mô tả chi tiết các màn hình và logic nghiệp vụ của hệ thống quản lý dự án EzyPM
> 
> Cập nhật lần cuối: 2026-03-24
> 
> Người thực hiện: Nhung Trần Thị Hồng

---

## TỔNG QUAN HỆ THỐNG

- **Nền tảng:** Web app, hỗ trợ responsive trên mobile/tablet
- **Quy mô:** ~100 nhân sự, ~20 project hoạt động đồng thời
- **Đa ngôn ngữ:** Tiếng Việt / Tiếng Anh
- **Giao diện:** Light Mode / Dark Mode (user tự switch)
- **Thông báo (Notification):** Có — nhận thông báo khi được assign task, khi task sắp đến deadline, khi có comment mới, v.v.

---

## PHÂN QUYỀN HỆ THỐNG

Hệ thống có 3 vai trò cố định, dùng để phân quyền chức năng/màn hình:

| Vai trò | Mô tả |
|---------|-------|
| **Admin** | Quản trị toàn hệ thống, xem được mọi dữ liệu |
| **PM** (Project Manager) | Quản lý dự án được phân công |
| **Normal User** | Nhân sự thông thường, chỉ thấy dữ liệu liên quan đến mình |

> **Lưu ý:** Vai trò hệ thống khác với vai trò trong dự án. Một nhân sự có thể đóng vai Backend ở project A nhưng là QC ở project B — vai trò trong dự án được khai báo riêng khi phân bổ nguồn lực.

---

## 1. HEADER CHUNG

Header xuất hiện ở tất cả các màn hình sau khi đăng nhập.

### 1.1. Thành phần hiển thị
- Tên nhân viên đang đăng nhập
- Menu tài khoản cá nhân
- Nút **Create New Project** (chỉ hiển thị với Admin / PM)
- Icon Notification (xem thông báo)

### 1.2. Menu tài khoản cá nhân
- **My Profile:** Cập nhật thông tin cá nhân
- **Change Password:** Đổi mật khẩu
- **Switch Theme:** Chuyển đổi Light / Dark Mode
- **Log out:** Đăng xuất

### 1.3. Phân quyền nút Create New Project
- Chỉ **Admin** và **PM** mới có quyền tạo project mới
- Normal User không thấy hoặc không thể thao tác nút này

---

## 2. DASHBOARD (Tổng quan cá nhân)

Màn hình tổng quan cá nhân dành cho người dùng sau khi đăng nhập. Dữ liệu hiển thị theo phạm vi của người đang đăng nhập.

### 2.1. Mục đích
Giúp nhân sự theo dõi nhanh tình hình công việc hiện tại, trạng thái các task, lịch sử hoạt động và tổng thời gian làm việc.

### 2.2. Thành phần chính

#### Tabs điều hướng task
Ba tab nằm ngang trên cùng trang Dashboard:
- **Current Tasks** — task có status = `In Progress`
- **Pending Tasks** — task có status = `Pending`
- **Past Tasks** — task có status = `Completed`

Mỗi tab hiển thị dạng bảng scroll tự do, không giới hạn số dòng.

#### Progress Overview theo Project
Hiển thị **từng project riêng** dạng mini-card, không gộp chung. Mỗi mini-card gồm:
- Tên project
- Progress bar: `Progress (%) = Actual Hours / Estimate Hours × 100`
- Tổng Estimate / Actual / Remaining Hours
- Nếu Actual > Estimate (> 100%): hiển thị **đúng số thực** kèm **icon warning** ⚠️

#### Activities Log
- Ghi nhận tự động bởi hệ thống, gồm các sự kiện:
  - Được assign task mới
  - Có comment mới cho task của mình
  - Đã hoàn thành task
  - Đã thay đổi trạng thái task
  - Đã log actual hours
- **Hiển thị:** Top 10 thông báo mới nhất; nhấn "Xem tất cả" để xem đầy đủ lịch sử

---

## 3. MODULE PROJECTS

Nhóm chức năng quản lý dự án và task trong dự án.

### 3.1. Danh sách dự án

**Phạm vi hiển thị theo vai trò:**
- **Admin:** Thấy toàn bộ project trong hệ thống
- **PM:** Thấy các project mình quản lý
- **Normal User:** Thấy các project mình được phân bổ tham gia

**Giao diện:** Card grid, infinite scroll khi có nhiều hơn 20 project.

**Thông tin hiển thị trên mỗi card:**
- Tên dự án
- Mô tả ngắn
- Trạng thái
- Ngày bắt đầu / Ngày kết thúc
- EstimateSource (TASK hoặc RESOURCE)
- Số lượng nhân sự tham gia
- Tổng số task
- Tiến độ tổng thể (Progress %)

### 3.2. Tạo / Sửa dự án

Chỉ **Admin / PM** có quyền tạo và sửa dự án. Mở dạng **modal**.

**Thông tin có thể nhập/cập nhật:**
- Tên dự án _(bắt buộc)_
- Mô tả
- Trạng thái _(bắt buộc)_
- Ngày bắt đầu / Ngày kết thúc _(bắt buộc)_
- **EstimateSource:** Chọn phương pháp estimate chính thức — `TASK` hoặc `RESOURCE` _(bắt buộc)_
- Ghi chú

> Khi sửa EstimateSource: hệ thống hiển thị cảnh báo vì sẽ ảnh hưởng đến Progress và Remaining.

### 3.3. Logic Estimate Hours cấp Project

Mỗi project xác định một **EstimateSource** duy nhất tại một thời điểm:

| EstimateSource | Cách tính Estimate của Project |
|---|---|
| **TASK** | Tổng Estimate Hours của tất cả task thuộc project |
| **RESOURCE** | Tổng Estimate Hours của các resource allocation (VD: BE 30h + FE 20h + QC 10h + BA 4h) |

- **Actual Hours** luôn được tính từ tổng các lần log hours của nhân sự
- **Remaining Hours** = Estimate (chính thức) − Actual
- **Progress %** = Actual / Estimate (chính thức) × 100

### 3.4. Chi tiết dự án

Màn hình chi tiết cho từng project. Điều hướng nội bộ dùng **tabs nằm ngang**.

**Thông tin tổng quan (luôn hiển thị phía trên tabs):**
- Tên, mô tả, trạng thái, ngày, EstimateSource
- 4 thẻ số liệu: Estimate Hours / Actual Hours / Remaining Hours / Progress %

**Các tabs:**
1. **Resources** — danh sách nhân sự trong project
2. **Tasks** — danh sách task
3. **Stakeholders** — danh sách stakeholder của project

### 3.5. Phân bổ nguồn lực (Resource Allocation)

Quản lý việc gán nhân sự vào dự án. Chỉ **Admin / PM** có quyền thêm / xóa nhân sự khỏi project.

**Thông tin khai báo:**
- Chọn nhân sự
- Chọn vai trò trong dự án _(linh hoạt theo từng project — combobox gõ tự do, có gợi ý sẵn: Backend, Frontend, QC, BA...)_
- Khai báo thời gian tham gia (ngày bắt đầu / kết thúc)
- Khai báo **Estimate Hours theo resource** _(chỉ hiển thị khi EstimateSource = RESOURCE)_

**Khi xóa nhân sự khỏi project:**
- Task đã assign cho nhân sự đó **vẫn giữ nguyên** (không tự động unassign)
- Nhân sự bị xóa **không thể nhìn thấy** task đó nữa
- Các thành viên còn lại trong project có thể chủ động đổi assignee nếu cần

### 3.6. Quản lý Stakeholder

Mỗi project có danh sách stakeholder riêng. Mỗi stakeholder được gán một vai trò trong project đó.

**Danh mục hệ thống:**
- **Stakeholder:** Danh sách người/tổ chức (tên, thông tin liên hệ...)
- **Stakeholder Role:** Danh mục vai trò stakeholder (ví dụ: Client, Vendor, Business Owner, Sponsor...)

**Trong mỗi project:**
- Chọn stakeholder từ danh mục hệ thống
- Gán vai trò tương ứng cho stakeholder trong project đó
- Một stakeholder có thể có vai trò khác nhau ở từng project

**Phân quyền:** Chỉ **Admin / PM** có quyền thêm / sửa / xóa stakeholder trong project.

### 3.7. Danh sách Task

Hiển thị toàn bộ task thuộc project. Có **hai chế độ xem**, user tự toggle:

#### Chế độ Table / List
- Hiển thị dạng bảng phẳng (flat list), không group theo status
- Có bộ lọc: Status, Assignee, Priority, Date range
- Subtask hiển thị như task bình thường trong bảng (không indent)

#### Chế độ Kanban Board
- Các cột tương ứng với 7 status: To Do / In Progress / Pending / On Hold / No Specs / Completed / Closed
- Mỗi cột hiển thị card task, có thể kéo-thả để đổi status
- Không cần group thêm, mỗi cột đã là một nhóm status

**Thông tin hiển thị mỗi task (Table):**
- Tên task, Assignee, Status, Priority, Estimate, Actual, Remaining, Start/End Date

### 3.8. Tạo / Sửa Task

Mở dạng **modal**. Tất cả thành viên trong project đều có thể tạo task cho project mình thuộc về.

**Thông tin có thể nhập:**
- Tên task _(bắt buộc)_
- Mô tả task
- Project liên quan _(Normal User chỉ chọn được project mình thuộc về)_
- Assignee _(chỉ 1 người; nhân sự có thể tự nhận hoặc PM assign)_
- Status _(mặc định: `To Do`)_
- Priority _(bắt buộc)_
- Estimate Hours
- Start Date / End Date
- Subtask & Task Links (Blocks / Blocked by / Duplicates / Duplicated by)

> Actual Hours **không nhập trong form này** — được tích lũy qua cơ chế Log Hours.
> Remaining Hours tự động tính = Estimate − Actual.

**Trạng thái Task — vòng đời:**

| Status | Ý nghĩa |
|--------|---------|
| `To Do` | Task đã tạo, chưa bắt đầu |
| `In Progress` | Đang thực hiện |
| `Pending` | Đang chờ — chờ xử lý hoặc chờ phản hồi |
| `On Hold` | Tạm dừng |
| `No Specs` | Chờ tài liệu / yêu cầu rõ ràng |
| `Completed` | Đã hoàn thành |
| `Closed` | Đóng task (không tiếp tục theo dõi) |

> Bất kỳ thành viên trong project đều có thể đổi status task sang bất kỳ trạng thái nào — không có flow bị khóa cứng.

### 3.9. Chi tiết Task

Bố cục **2 cột**: cột trái chứa nội dung chính, cột phải là sidebar thông tin.

**Cột trái — Nội dung chính:**
- Tên task, trạng thái badge, priority badge
- Mô tả task
- **Subtasks:** Danh sách task con, mỗi subtask có checkbox hoàn thành, có thể thêm subtask mới
- **Task Links:** Blocks / Blocked by / Duplicates / Duplicated by
- **File Attachments:** Vùng đính kèm file (upload hoặc kéo thả)
- **Comment Section:** Khung soạn thảo + danh sách comment theo thời gian
- **Status History:** Lịch sử thay đổi trạng thái (tự động ghi bởi hệ thống)
- **Log Time History:** Lịch sử các lần log hours

**Cột phải — Sidebar:**
- Assignee (có nút "Tự nhận task" nếu chưa có assignee)
- Project
- Start Date / End Date
- Estimate Hours / Actual Hours / Remaining Hours
- Progress bar (cảnh báo ⚠️ nếu > 100%)
- Nút **"Đổi Status"** (dropdown 7 trạng thái)
- Nút **"Log Hours"**

### 3.10. Cơ chế Log Hours

Nhấn nút **"Log Hours"** trên Chi tiết Task → mở modal:
- **Thời gian (h:mm)** _(bắt buộc)_
- **Ngày log** _(mặc định: hôm nay)_
- **Comment / Ghi chú** cho lần log này

**Logic:**
- Actual Hours của task = **tổng tất cả các lần log hours**
- Bất kỳ thành viên trong project đều có thể log hours cho task
- Mỗi lần log được lưu vào Log Time History của task (kèm người log, thời gian, comment)

### 3.11. Comment trong Task

Khung soạn thảo hỗ trợ:
- **Rich text:** Bold, Italic, Bullet list, tô màu chữ, gắn link
- **Mention:** `@username` để tag thành viên trong project
- **Đính kèm file / ảnh** (upload hoặc paste trực tiếp)
- **Sửa / Xóa** comment của chính mình

### 3.12. Subtask & Task Links

Task hỗ trợ:
- **Subtask:** Task con thuộc task cha. Subtask hiển thị như task bình thường trong danh sách; chỉ thấy mối quan hệ cha-con khi vào Chi tiết Task
- **Task Links:** Liên kết giữa các task
  - `Blocks` / `Blocked by`
  - `Duplicates` / `Duplicated by`

---

## 4. MODULE TEAM (Quản lý nhân sự)

> **Phân quyền:** Chỉ **Admin** mới có quyền truy cập Module Team.

### 4.1. Danh sách nhân sự

Hiển thị toàn bộ nhân sự trong hệ thống.

**Thông tin hiển thị:**
- Họ tên + Avatar (initials mặc định hoặc ảnh upload)
- Chức danh / Vai trò hệ thống (Admin / PM / Normal User)
- Kỹ năng
- Số project đang tham gia
- Số task hiện tại (đang active: In Progress + Pending)
- Tổng giờ đang phụ trách (tổng Remaining Hours của các task active)
- **Trạng thái làm việc** _(tự động, xem logic bên dưới)_

**Logic tính Trạng thái làm việc (tự động):**

| Trạng thái | Điều kiện | Badge màu |
|-----------|-----------|-----------|
| `Available` | Không có task nào ở trạng thái `In Progress` hoặc `Pending` | 🟢 Xanh lá |
| `Busy` | Có ít nhất 1 task đang `In Progress` hoặc `Pending` | 🟡 Vàng |
| `Overloaded` | Utilization tháng hiện tại > 100% | 🔴 Đỏ |

> Trạng thái được tính lại theo thời gian thực mỗi khi có thay đổi task.

**Bộ lọc nhanh trên danh sách nhân sự:**
- Lọc theo Trạng thái làm việc: `Available` / `Busy` / `Overloaded`
- Admin dùng filter `Available` để nhanh chóng xác định ai đang rảnh task

**Chức năng:**
- Tạo mới nhân sự
- Cập nhật thông tin nhân sự
- Xem các project mà nhân sự đang thuộc về

### 4.2. Chi tiết nhân sự

Hiển thị hồ sơ chi tiết của từng nhân sự.

**Thông tin cá nhân:**
- Họ tên, email, số điện thoại
- Avatar: mặc định là chữ viết tắt (initials) với màu nền ngẫu nhiên; Admin / nhân sự có thể upload ảnh
- Vai trò hệ thống
- Kỹ năng (dạng tag)

**Thống kê hiệu suất _(hiển thị số liệu, chưa kết luận thành chỉ số duy nhất)_:**
- Total Assigned Tasks
- Completed Tasks
- On-time Completion Rate (%)
- Total Estimate Hours
- Total Actual Hours
- Actual / Estimate Ratio
- Overdue Tasks
- Overrun Tasks

**Danh sách project đang tham gia** (kèm vai trò trong từng project)

**Danh sách task hiện tại** (trạng thái In Progress / Pending)

### 4.3. Danh sách project / task theo nhân sự

Màn hình tổng hợp để Admin xem:
- Nhân sự đang tham gia những project nào
- Đang phụ trách task nào (phân loại In Progress / Pending / Completed)
- Khối lượng công việc hiện tại (workload)
- Hỗ trợ cân đối nguồn lực trước khi assign thêm task

---

## 5. MODULE REPORTS

Nhóm chức năng báo cáo và thống kê. **Chỉ xem trên màn hình, không hỗ trợ xuất file.**

**Bộ lọc thời gian chung (kết hợp cả hai):**
- Dropdown chọn nhanh: Tuần này / Tháng này / Quý này / Năm nay
- Date range picker: chọn ngày bắt đầu – kết thúc tùy ý

**Phân quyền xem báo cáo:**
| Vai trò | Phạm vi xem |
|---------|-------------|
| **Admin** | Tất cả nhân sự, tất cả project |
| **PM** | Nhân sự và project mình quản lý |
| **Normal User** | Chỉ báo cáo của bản thân |

### 5.1. Báo cáo theo Project

**Chart:** Bar chart so sánh Estimate vs Actual theo từng project

**Bảng số liệu:**
- Tên project, trạng thái, EstimateSource
- Tổng Estimate Hours / Actual Hours / Remaining Hours
- Progress (%)
- Danh sách nhân sự tham gia
- Số task: Hoàn thành / Chưa hoàn thành / Quá hạn

### 5.2. Báo cáo theo Nhân sự

**Chart:** Bar chart Utilization theo từng nhân sự

**Bảng số liệu:**
- Tên nhân sự, vai trò hệ thống
- Số project tham gia
- Số task đang thực hiện
- Tổng Estimate Hours / Actual Hours / Remaining Hours
- **Mức độ Utilization (%)** = Actual Hours / Working Hours chuẩn × 100
  - Working Hours chuẩn: **8h/ngày · 5 ngày/tuần · 20 ngày/tháng**

### 5.3. Báo cáo Estimate vs. Actual

**Chart:** Line chart theo thời gian thể hiện xu hướng Estimate vs Actual

**Bảng số liệu** (lọc theo: Project / Task / Nhân sự):
- Estimate Hours
- Actual Hours
- Chênh lệch (Actual − Estimate): màu đỏ ⚠️ nếu dương, màu xanh nếu âm
- Tỷ lệ chênh lệch (%)

### 5.4. Báo cáo Quá hạn / Vượt Estimate

**Giao diện:** Bảng highlight màu (không cần chart).

**Nội dung (4 tabs):**
- Task quá hạn (End Date < hôm nay, chưa Completed) — highlight đỏ
- Project quá hạn — highlight đỏ
- Task / Project vượt estimate (Actual > Estimate) — highlight cam
- Nhân sự workload quá tải (Utilization > 100%) — highlight cam

---

## 6. DANH MỤC HỆ THỐNG (System Configuration)

Các danh mục được quản lý bởi Admin, dùng làm nguồn dữ liệu cho các module khác.

### 6.1. Danh mục Stakeholder
- Quản lý danh sách stakeholder toàn hệ thống
- Thông tin: Tên, email, số điện thoại, tổ chức

### 6.2. Danh mục Stakeholder Role
- Quản lý các vai trò stakeholder (Client, Vendor, Business Owner, Sponsor...)
- Admin có thể thêm / sửa / xóa vai trò

---

*Cập nhật lần cuối: 2026-03-24*
