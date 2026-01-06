import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Nhận dữ liệu từ SePay bắn sang
    const payload = await req.json()
    const { content, amount } = payload // SePay gửi: content (nội dung ck), amount (số tiền)

    // Regex tìm mã đơn hàng trong nội dung (Ví dụ: "TASTENEST 123" -> Lấy 123)
    // Bạn có thể sửa regex tùy theo cú pháp bạn muốn
    const match = content?.match(/TASTENEST\s*(\d+)/i);
    
    if (match) {
        const orderId = match[1]; // Lấy được ID đơn hàng

        // Kết nối Supabase Admin để update
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Cập nhật trạng thái đơn hàng
        const { error } = await supabase
            .from('orders')
            .update({ status: 'paid' }) // Chuyển thành đã thanh toán
            .eq('id', orderId)
            // .eq('total_amount', amount) // (Nâng cao) Nên check cả số tiền

        if (!error) {
            console.log(`Đã cập nhật đơn hàng ${orderId} thành công!`)
            return new Response(JSON.stringify({ success: true }), { status: 200 })
        }
    }
    
    return new Response(JSON.stringify({ message: "Không tìm thấy đơn hàng phù hợp" }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})