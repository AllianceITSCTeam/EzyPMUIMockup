# 02. UI Components Catalog (Danh mục Control & UI)

Tài liệu này tổng hợp toàn bộ các control / component UI hiện có trong dự án EZY PM (`src/components/ui`). Mục đích là để con người và AI biết dự án đang có sẵn những "đồ chơi" nào, tránh việc tạo duplicate hoặc code lại từ đầu phá vỡ chuẩn chung.

## 1. Data Input & Forms (Nhập liệu)
- **`CustomSelect`**: Dropdown chuẩn của dự án. Không sử dụng thẻ `<select>` mặc định.
- **`CommentInput`**: Khung nhập bình luận (dùng trong chi tiết Task/Project).
- **`SkillInput`**: Component nhập/chọn kỹ năng (skills).
- **`FileUploader`**: Component hỗ trợ upload file/tài liệu.

## 2. Modals & Popups (Cửa sổ nổi)
- **`Modal`**: Component nền tảng để tạo thẻ popup nổi lên (hỗ trợ backdrop, tắt viền đen theo chuẩn dự án).
- **`CreateTaskModal`**: Modal cụ thể dùng để tạo/sửa Task. Thường kết hợp với `Modal` và `CustomSelect`.
- **`Toast`**: Component thông báo nhỏ góc màn hình (Success/Error/Info). Mọi thông báo hành động phải dùng cái này thay vì `alert()`.

## 3. Data Display & Indicators (Hiển thị dữ liệu)
- **`Card`**: Khung chứa nội dung cơ bản, thường xài chung với shadow nhẹ, bo góc, không dùng border đen.
- **`Badge`**: Nhãn dán nhỏ hiển thị trạng thái (VD: To Do, In Progress, Done).
- **`SkillTag`**: Thẻ nhỏ hiển thị tên kỹ năng (cụ thể hơn Badge).
- **`UserAvatar`**: Hiển thị ảnh đại diện hoặc chữ cái đầu của tên người dùng/thành viên.
- **`ProgressBar`**: Thanh tiến độ tiêu chuẩn (thể hiện % hoàn thành).
- **`DateProgressBar`**: Thanh tiến độ dải thời gian (từ Start Date đến End Date).

## 4. Layout & Cấu trúc (Layouts)
- *(Được tổ chức trong `src/components/layout/` - như Header, Sidebar, Wrapper...)*

---
**Quy tắc phối hợp:** Thay vì tự dùng `div` và css Tailwind để vẽ lại cái "Thanh tiến độ", AI / Dev PHẢI import `ProgressBar` hoặc `DateProgressBar`. Nếu component hiện tại thiếu tính năng (ví dụ: cần thêm màu cảnh báo), hãy **sửa component gốc** hoặc bổ sung props thay vì tạo component mới.
