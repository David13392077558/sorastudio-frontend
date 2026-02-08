import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const TaskStatusPage: React.FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 轮询任务状态
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/task/${taskId}`
        );
        const data = await res.json();

        if (data.success) {
          setTask(data.task);
        }
      } catch (err) {
        console.error("任务查询失败:", err);
      } finally {
        setLoading(false);
      }
    };

    // 立即执行一次
    fetchTask();

    // 每 2 秒轮询
    const timer = setInterval(fetchTask, 2000);

    return () => clearInterval(timer);
  }, [taskId]);

  if (loading) {
    return <div className="text-center py-20">加载中...</div>;
  }

  if (!task) {
    return <div className="text-center py-20 text-red-500">任务不存在</div>;
  }

  const statusMap: Record<string, string> = {
    queued: "排队中",
    processing: "处理中",
    done: "完成",
    failed: "失败",
  };

  const statusColor: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  // ⭐ 防崩溃的智能解析逻辑
  const parsedResult = React.useMemo(() => {
    if (!task.result) return null;
    
    // 如果已经是对象，直接返回
    if (typeof task.result === "object") return task.result;
    
    // 如果是字符串，尝试解析
    if (typeof task.result === "string") {
      try {
        return JSON.parse(task.result);
      } catch (err) {
        console.error("❌ 解析 result 失败:", err);
        return null;
      }
    }
    
    return null;
  }, [task.result]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">任务状态</h1>

      {/* 状态卡片 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">任务 ID</span>
          <span className="text-gray-600 font-mono text-xs break-all">{taskId}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">当前状态</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${statusColor[task.status]}`}
          >
            {statusMap[task.status]}
          </span>
        </div>

        {/* 时间戳 */}
        {task.updatedAt && (
          <div className="mt-4 pt-4 border-t text-sm text-gray-500">
            更新时间: {new Date(parseInt(task.updatedAt)).toLocaleString("zh-CN")}
          </div>
        )}
      </div>

      {/* 处理中状态 */}
      {task.status === "processing" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="font-medium">AI 正在分析视频，请稍候...</p>
          </div>
        </div>
      )}

      {/* 排队中状态 */}
      {task.status === "queued" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
          <p className="font-medium">⏳ 任务已加入队列，等待处理中...</p>
        </div>
      )}

      {/* 结果展示 - 100%防崩溃 */}
      {task.status === "done" && parsedResult && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold text-green-600">✅ 分析完成</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-white">
              <p className="text-gray-500 text-sm mb-1">🎨 风格标签</p>
              <p className="font-medium text-lg">
                {parsedResult.style_tags?.length > 0 
                  ? parsedResult.style_tags.join(", ") 
                  : "未检测到"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
              <p className="text-gray-500 text-sm mb-1">🎬 帧率 (FPS)</p>
              <p className="font-medium text-lg">
                {parsedResult.fps || "N/A"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-white">
              <p className="text-gray-500 text-sm mb-1">⏱️ 时长</p>
              <p className="font-medium text-lg">
                {parsedResult.duration 
                  ? `${parsedResult.duration.toFixed(2)}秒` 
                  : "N/A"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-pink-50 to-white">
              <p className="text-gray-500 text-sm mb-1">📐 分辨率</p>
              <p className="font-medium text-lg">
                {parsedResult.resolution || "N/A"}
              </p>
            </div>

            {parsedResult.frame_count && (
              <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-white col-span-2">
                <p className="text-gray-500 text-sm mb-1">🖼️ 分析帧数</p>
                <p className="font-medium text-lg">
                  共分析 {parsedResult.frame_count} 帧
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 失败状态 */}
      {task.status === "failed" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <p className="font-bold text-lg mb-2">❌ 任务失败</p>
          <p className="text-sm">{task.error || "未知错误"}</p>
        </div>
      )}
    </div>
  );
};
