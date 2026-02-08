import { apiPost, apiGet } from "./apiClient";

// 提交视频分析任务
export function analyzeVideo(formData: FormData) {
  return fetch(`${(import.meta as any).env.VITE_BACKEND_URL}/ai/analyze-video`, {
    method: "POST",
    body: formData,
  }).then(res => res.json());
}

// 获取任务状态
export function getTaskStatus(taskId: string) {
  return apiGet(`/ai/task/${taskId}`);
}

// 分析视频帧（实时分析）
export function analyzeFrame(frameData: string) {
  return apiPost("/ai/analyze-frame", { frame: frameData });
}