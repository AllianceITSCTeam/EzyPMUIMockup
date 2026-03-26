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
