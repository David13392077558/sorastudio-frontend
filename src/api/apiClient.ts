const API_BASE = (import.meta as any).env.VITE_BACKEND_URL;

export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  return res.json();
}

// ⭐ 统一 API 客户端
export const apiClient = {
  // 创建任务
  createTask(data: any) {
    return apiPost("/api/task", data);
  },

  // 获取任务状态（后端真实接口）
  getTask(taskId: string) {
    return apiGet(`/api/task/${taskId}`);
  }
};
