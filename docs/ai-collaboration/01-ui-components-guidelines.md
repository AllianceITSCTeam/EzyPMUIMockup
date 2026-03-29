# 01. UI/UX & Components Guidelines

Tài liệu này định nghĩa các quy chuẩn thiết kế UI/UX bắt buộc phải tuân theo trong toàn bộ dự án EZY PM. Mọi đề xuất code của AI liên quan đến giao diện đều phải thỏa mãn các tiêu chí này trừ khi user có yêu cầu ngược lại một cách tường minh.

## 1. Nguyên lý Thiết kế (Design Aesthetic)
- **Phong cách:** Borderless (Không viền), Chuyên nghiệp (Premium), Tối giản, Rộng rãi.
- **Đường viền (Borders):**
  - **TUYỆT ĐỐI KHÔNG** sử dụng viền đen cứng nhắc (solid black borders) cho các control thông thường, và **đặc biệt không dùng viền đen** (thậm chí là nhạt) cho các vùng chứa thông tin File uploads/File đính kèm. Khách hàng không thích điều này.
  - Thay vì dùng border để chia cách các element, hãy ưu tiên dùng khoảng trắng (padding/margin), phân lớp nền (background color, ví dụ xám nhạt và trắng), hoặc shadow nhẹ (như `shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]`).
  - Nếu bắt buộc dùng border, chỉ sử dụng border cực kỳ nhạt (VD: `border-border`, `border-slate-200/60`) cho các line mỏng hoặc thay hẳn bằng `border-transparent`.

## 2. Tiêu chuẩn Buttons (Nút bấm)
Khi đã có một component Button chuẩn, tất cả các nơi khác phải dùng chung một style hoặc xài lại component đó.
- **Primary Buttons:** Nền đậm, chữ sáng và **không có border**.
- **Ghost/Secondary Buttons:** Trong suốt, khi hover chỉ hiện chữ hoặc thay đổi background mờ (VD: `hover:bg-slate-100`), **không có border**.
- Focus ring: Chỉ dùng focus-visible ring nhẹ nhàng chuẩn theo Tailwind, không chế viền đen cứng.

## 3. Tiêu chuẩn Inputs & Forms
- Input field nên sử dụng nền hơi xám nhẹ (Ví dụ: `bg-slate-50`) khi chưa active, ranh giới rõ ràng nhưng không dựa vào border sắc nét.
- **Dropdowns/Select:** **BẮT BUỘC** sử dụng component `CustomSelect` đã được dựng sẵn hoặc component tương đương của dự án. **Tuyệt đối không dùng thẻ `<select>` native của HTML** vì không áp dụng được style nhất quán. **Lưu ý quan trọng**: Vùng data sổ xuống (dropdown list) phải luôn hiển thị nổi lên trên cùng (ngay cả khi Select đặt trong một cấu trúc có `overflow: hidden` như Modal Card). Khuyến nghị dùng React Portal hoặc quản lý z-index tuyệt đối để tránh tình trạng component bị chìm hay cắt ngang.

## 4. Popup & Modals
- Backdrop phải làm mờ (VD: `bg-black/30 backdrop-blur-sm`).
- Modal Card: Cần có góc bo tròn lớn (`rounded-xl` hoặc `rounded-2xl`), shadow lớn (`shadow-2xl`) tạo cảm giác nổi đè lên app. Bỏ hẳn đường viền (`border-0`).

## 5. Quy tắc cho AI khi làm UI Task
1. Nếu yêu cầu tạo màn hình mới, hãy tìm một file giao diện tương đương đang có trong dự án để copy class/style pattern.
2. Không import thư viện CSS/UI thứ 3 mới nếu không hỏi ý kiến con người. Ưu tiên các component đang có.
3. Nếu con người nhắc nhở "Làm cái nút này giống chuẩn của dự án", lập tức dỡ bỏ các style dư thừa (như viền đen, border dày) và áp dụng aesthetic nêu trên.
