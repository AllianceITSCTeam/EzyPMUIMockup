# Ezy PM - UI Guidelines & Conventions

Tài liệu này ghi chú lại các quy tắc và tiêu chuẩn về UI/UX được thống nhất trong quá trình phát triển dự án Ezy PM, nhằm đảm bảo tính nhất quán và trải nghiệm người dùng tốt nhất.

## 1. Modals & Popups (Cửa sổ bật lên)
- **Hiển thị Dropdown (Select):** Đối với các modal chứa custom dropdown (như `CustomSelect`), tuyệt đối **không** dùng `overflow-y-auto` đi kèm với giới hạn chiều cao (như `max-h-[80vh]`) nếu điều đó làm menu dropdown bị cắt lẹm (clipped) mất nội dung khi xổ ra.
- **Kích thước & Tràn viền (Overflow):** Nếu modal có ít trường nhập liệu nhưng cần xổ dropdown dài, hãy sử dụng thuộc tính `contentClassName="overflow-visible"` cho component `Modal`. **Không** nên hardcode thiết lập chiều cao tối thiểu (`min-h`) chỉ để lùi chỗ cho dropdown, vì nó sẽ tạo ra những khoảng trắng thừa thãi, thiếu tự nhiên. Mở rộng chiều ngang modal khi cần bằng `className="max-w-xl"`.
- **Giao diện tối giản:** Khu vực các nút hành động (Action buttons: Save, Cancel...) ở dưới cùng của modal không nên có đường kẻ viền ngang (`border-t border-border-color`) ngăn cách với phần nhập liệu phía trên. Các nút nên liền mạch để tạo cảm giác UI hiện đại, thanh thoát.
- **Nền Popup (Backdrop Overlay):** Khi mở thẻ popup, lớp mờ nền (backdrop) chỉ nên dùng màu tối trong suốt (`bg-black/50` hoặc `bg-secondary/20`) để làm nổi bật popup, **tuyệt đối không** sử dụng hiệu ứng làm mờ (`backdrop-blur-sm`) để người dùng vẫn có thể đọc được các thông tin từ trang web chính chìm ở phía sau.

## 2. Văn bản & Ngữ pháp (Text & Pluralization)
- **Số nhiều (Pluralization):** Luôn xử lý linh hoạt các từ vựng tiếng Anh phân biệt số ít/số nhiều dựa trên dữ liệu thực tế. 
  - *Ví dụ:* Sử dụng `{count === 1 ? 'project' : 'projects'}` thay vì hardcode cứng chữ "projects". 
  - Đảm bảo khi đếm bằng 0 hoặc lớn hơn 1 thì dùng số nhiều, khi bằng 1 thì dùng số ít.

## 3. Hydration (Next.js)
- Không gọi trực tiếp `new Date()` bên trong JSX của các Server/Client Component trong Next.js vì sẽ dẫn đến lỗi "Hydration Mismatch" (do chênh lệch mili-giây hoặc Timezone giữa Server và Client).
- Luôn bọc các giá trị biến đổi thời gian (`Date.now()`, `toISOString()`) hoặc UI động trong một state `mounted` (kích hoạt qua `useEffect`) để đảm bảo chúng chỉ render sau khi Client đã tải xong.

## 4. Thiết kế Điều khiển (Controls & Styling)
- **Loại bỏ đường viền (Borderless):** Tuyệt đối hạn chế sử dụng outline/border cứng (`border border-border-color`) cho các control nhập liệu (input, select, textarea) hoặc các thẻ danh sách nội bộ.
- **Sử dụng nền màu (Background over Border):** Thay vì dùng viền mỏng dễ gây cảm giác giao diện cũ, hãy dùng nền nhẹ (`bg-surface/50` kết hợp `hover:bg-page-bg`) và đổ bóng mờ chìm bên trong (`shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]`) để định hình vùng nhập hoặc chọn. 
- **Tag và Label:** Khi làm tag thông tin (vai trò, trạng thái không chính), dùng background nhẹ theo màu chủ đạo (ví dụ: `bg-primary/10 text-primary`) thay vì dùng hộp có viền màu đen/sẫm xỉn màu. Tránh dùng `bg-page-bg` nếu nó tạo ra mảng đen làm tối form tổng thể.

---

## 5. Quy chuẩn Control (Control Design System)

### 5.1 Text Input / Textarea
Dùng **thống nhất** class sau cho mọi `<input type="text|email|tel|url|number">` và `<textarea>`:

```
px-3 py-2
bg-surface/50
border border-transparent
shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]
hover:bg-page-bg
focus:bg-surface focus:ring-2 focus:ring-primary/20 focus:outline-none focus:border-primary/30
transition-all rounded-md text-sm
text-text-primary
placeholder:text-text-secondary
```

### 5.2 Date Input
Dùng component `<DateInput>` (`src/components/ui/DateInput.tsx`) thay cho `<input type="date">`.
- Format hiển thị: `DD/MM/YYYY`
- Value lưu trữ: `YYYY-MM-DD` (ISO)
- Gõ từ trái qua phải, tự auto-format; Backspace xóa từng chữ số.
- Props: `value` (ISO string), `onChange` (nhận ISO string), `required?`, `className?`

```tsx
<DateInput
  value={startDate}
  onChange={setStartDate}
  required
  className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
/>
```

### 5.3 Select Đơn (Single Select)
Dùng component `<CustomSelect>` (`src/components/ui/CustomSelect.tsx`).
- Dùng cho tất cả dropdown chọn 1 giá trị (status, priority, assignee, role, v.v.)
- Prop `closeOnSelect` mặc định `true`; đặt `false` nếu muốn giữ dropdown sau khi chọn.

```tsx
<CustomSelect
  value={status}
  onChange={(val) => setStatus(val)}
  options={[{ value: "Active", label: "Active" }, ...]}
/>
```

### 5.4 Multi-Select có Search + Chips
Dùng component `<MultiSelectWithSearch>` (`src/components/ui/MultiSelectWithSearch.tsx`).
- Dùng khi cần chọn nhiều item + hiển thị chip inline + filter/search.
- Ví dụ: Associated Companies.

```tsx
<MultiSelectWithSearch
  selectedIds={companyIds}
  onSelect={(id) => setCompanyIds([...companyIds, id])}
  onRemove={(id) => setCompanyIds(companyIds.filter(c => c !== id))}
  options={companies.map(c => ({ id: c.id, label: c.name }))}
  value={companySearchQuery}
  onSearch={setCompanySearchQuery}
  placeholder="Search companies..."
  getSelectedLabel={(id) => companies.find(c => c.id === id)?.name || id}
/>
```

### 5.5 Multi-Select dạng Tag (Free + Catalog)
Dùng component `<ApplicationInput>` (`src/components/ui/ApplicationInput.tsx`).
- Dropdown chọn từ catalog; stay-open sau khi chọn.
- Hiển thị tags với nút X; có search filter.
- Ví dụ: Affected Applications.

```tsx
<ApplicationInput
  applications={applications}
  onChange={setApplications}
/>
```

### 5.6 Label cho Control
Mỗi control phải có `<label>` ngay phía trên, với class cố định:

```
text-sm font-medium text-text-primary
```

Optional marker: thêm `*` bên trong label cho bắt buộc (không dùng HTML `required` attribute visible):
```tsx
<label className="text-sm font-medium text-text-primary">Start Date *</label>
```

### 5.7 Group Control (Grid Layout)
- 2 controls cùng hàng: `<div className="grid grid-cols-2 gap-4">`
- 1 control full width: `<div className="flex flex-col gap-1.5">`
- Khoảng cách giữa các nhóm: `mt-2` hoặc `gap-4` trong flex column.

### 5.8 Chiều cao Control
Tất cả single-line control phải có chiều cao thực tế bằng nhau (`~38px`):
- Input/Select/DateInput: tự nhiên với `px-3 py-2 text-sm`
- Nếu cần force cùng chiều cao: thêm `h-[38px]` vào control thấp hơn.

### 5.9 Button Hành động trong Form/Modal
| Loại | Class |
|------|-------|
| Primary (Submit) | `px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors` |
| Secondary (Cancel) | `px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors` |
| Danger (Delete) | `px-4 py-2 rounded-md text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors` |
| Icon-only | `p-1.5 text-text-secondary hover:text-primary bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color transition-colors` |

### 5.10 Không được dùng
- ❌ `<input type="date">` — luôn dùng `<DateInput>` thay thế
- ❌ `border border-gray-300` hoặc border màu cứng trên input — dùng `border border-transparent` + shadow
- ❌ `<select>` HTML native — luôn dùng `<CustomSelect>`
- ❌ `Math.random()` hoặc `new Date()` trong `useState()` initial value — gây hydration mismatch

