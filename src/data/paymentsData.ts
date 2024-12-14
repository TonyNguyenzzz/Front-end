export interface Payment {
  id: number;
  resident: string;
  amount: number;
  date: string;
  status: string;
  apartment: string;     // Căn hộ của cư dân
  method: string;        // Phương thức thanh toán (chuyển khoản, tiền mặt, v.v.)
  receiptNumber: string; // Số biên lai hoặc mã giao dịch
  notes?: string;        // Ghi chú thêm nếu có
}

const paymentsData: Payment[] = [
  { 
    id: 1, 
    resident: 'Nguyễn Văn A', 
    amount: 500000, 
    date: '2024-12-01', 
    status: 'Đã Thanh Toán', 
    apartment: 'A1', 
    method: 'Chuyển khoản', 
    receiptNumber: 'TXN001', 
    notes: 'Thanh toán trước hạn 3 ngày' 
  },
  { 
    id: 2, 
    resident: 'Trần Thị B', 
    amount: 300000, 
    date: '2024-12-02', 
    status: 'Chưa Thanh Toán', 
    apartment: 'B2', 
    method: 'Tiền mặt', 
    receiptNumber: 'TXN002' 
  },
  { 
    id: 3, 
    resident: 'Lê Thị C', 
    amount: 450000, 
    date: '2024-12-03', 
    status: 'Đã Thanh Toán', 
    apartment: 'C3', 
    method: 'Chuyển khoản', 
    receiptNumber: 'TXN003', 
    notes: 'Đã gởi bằng ứng dụng ngân hàng' 
  },
  { 
    id: 4, 
    resident: 'Phạm Quang D', 
    amount: 550000, 
    date: '2024-12-04', 
    status: 'Chưa Thanh Toán', 
    apartment: 'D4', 
    method: 'Tiền mặt', 
    receiptNumber: 'TXN004',
    notes: 'Chưa đến hạn, cư dân nói sẽ thanh toán vào 10/12' 
  },
  { 
    id: 5, 
    resident: 'Nguyễn Hoàng E', 
    amount: 650000, 
    date: '2024-12-05', 
    status: 'Đã Thanh Toán', 
    apartment: 'E5', 
    method: 'Chuyển khoản', 
    receiptNumber: 'TXN005' 
  },
  { 
    id: 6, 
    resident: 'Vũ Thi F', 
    amount: 700000, 
    date: '2024-12-06', 
    status: 'Chưa Thanh Toán', 
    apartment: 'F6', 
    method: 'Tiền mặt', 
    receiptNumber: 'TXN006' 
  },
  { 
    id: 7, 
    resident: 'Đỗ Minh G', 
    amount: 800000, 
    date: '2024-12-07', 
    status: 'Đã Thanh Toán', 
    apartment: 'G7', 
    method: 'Chuyển khoản', 
    receiptNumber: 'TXN007', 
    notes: 'Thanh toán kèm phí dịch vụ' 
  },
  { 
    id: 8, 
    resident: 'Nguyễn Thi H', 
    amount: 850000, 
    date: '2024-12-08', 
    status: 'Chưa Thanh Toán', 
    apartment: 'H8', 
    method: 'Tiền mặt', 
    receiptNumber: 'TXN008' 
  },
  { 
    id: 9, 
    resident: 'Lê Thi I', 
    amount: 600000, 
    date: '2024-12-09', 
    status: 'Đã Thanh Toán', 
    apartment: 'I9', 
    method: 'Chuyển khoản', 
    receiptNumber: 'TXN009', 
    notes: 'Thanh toán từ tài khoản BIDV' 
  },
  { 
    id: 10, 
    resident: 'Phan Thi K', 
    amount: 750000, 
    date: '2024-12-10', 
    status: 'Chưa Thanh Toán', 
    apartment: 'K10', 
    method: 'Tiền mặt', 
    receiptNumber: 'TXN010',
    notes: 'Cư dân đang đi công tác, hẹn cuối tháng' 
  },
];

export default paymentsData;
