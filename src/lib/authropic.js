// anthropic.js (frontend / VSCode)
export async function askClaude(prompt) {
  try {
    // ⚙️ Đặt URL Worker của bạn tại đây
    const WORKER_URL = "https://claude-proxy.bao927471.workers.dev/";

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // Nếu server không trả 200
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Worker Error:", errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // Nếu Worker trả về message hợp lệ
    if (data.message) {
      return data.message.trim();
    }

    // Nếu không có message
    return "⚠️ Không có phản hồi từ Gemini.";
  } catch (error) {
    console.error("❌ Claude (proxy) Error:", error);
    return `Lỗi: ${error.message}`;
  }
}
