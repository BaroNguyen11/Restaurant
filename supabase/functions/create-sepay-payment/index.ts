import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Xử lý cho phép trình duyệt gọi (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Nhận dữ liệu từ Frontend gửi lên
    const { amount, orderId } = await req.json()

    // ---------------------------------------------------------
    // CẤU HÌNH THÔNG TIN TÀI KHOẢN NGÂN HÀNG CỦA BẠN TẠI ĐÂY
    // ---------------------------------------------------------
    const BANK_ID = "TCB";          // Ví dụ: MB, VCB, ACB... (Mã ngân hàng)
    const ACCOUNT_NO = "7902112005"; // Số tài khoản của bạn
    const TEMPLATE = "compact2";    // Giao diện (compact, print, qr_only...)
    
    // Tạo nội dung chuyển khoản: TASTENEST + Mã đơn hàng
    // (Nội dung này quan trọng để SePay nhận diện đơn hàng)
    const content = `TASTENEST ${orderId}`;

    // 3. TẠO ĐƯỜNG DẪN THANH TOÁN (Universal Link)
    // Thay vì dùng SDK phức tạp, ta tạo link trực tiếp theo chuẩn SePay
    // Cấu trúc: https://sepay.vn/u/{Ngân hàng}/{Số TK}/{Số tiền}/{Nội dung}
    const paymentUrl = `https://sepay.vn/u/${BANK_ID}/${ACCOUNT_NO}/${amount}/${content}`;

    // 4. Trả Link về cho Frontend (Dạng JSON)
    return new Response(
      JSON.stringify({ 
        url: paymentUrl,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})