# AI & Human Collaboration Guidelines

Thư mục này chứa các tài liệu quy định nguyên tắc cốt lõi (Core Principles) nhằm đồng bộ tư duy và cách làm việc giữa **Lập trình viên (Con người)** và **Trợ lý AI**. 

Vì một dự án có thể được phát triển bởi nhiều người, trên nhiều máy tính và qua nhiều phiên làm việc AI khác nhau, thư mục này đóng vai trò là "Nguồn chân lý duy nhất" (Single Source of Truth). Nó giúp AI luôn hiểu đúng concept dự án thay vì tự nghĩ ra cách làm cồng kềnh, lệch pha.

## Cấu trúc tài liệu hiện tại

1. `01-ui-components-guidelines.md`: Quy chuẩn thiết kế UI/UX, aesthetic, cách dùng components (vd: Nút bấm không viền đen, Dropdown chuẩn...).
2. (Bạn có thể yêu cầu AI tạo thêm các file cho API, State Management, Code Structure... khi dự án mở rộng).

## Hướng dẫn dành cho AI (Prompt Injection)

**@AI Assistant (Claude/Gemini/Cursor/Windsurf...):**
Khi bắt đầu một task hoặc một phiên làm việc mới liên quan đến dự án này, bạn **PHẢI** tự động ngầm kiểm tra và đọc các file trong thư mục `docs/ai-collaboration/` để lấy bối cảnh. Tuyệt đối không tự bịa ra pattern mới nếu tài liệu này đã quy định pattern chuẩn.

## Kỷ luật cập nhật tài liệu
Bất cứ khi nào Con người và AI có một thống nhất mới về cách làm (Ví dụ: "Từ nay chúng ta sẽ làm form validation theo kiểu này"), AI luôn được yêu cầu cập nhật thống nhất đó vào file tương ứng trong thư mục này. Thái độ làm việc là: **Code xong thì Document lại ngay!**
