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

  const result = task.result ? JSON.parse(task.result) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">任务状态</h1>

      {/* 状态卡片 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">任务 ID</span>
          <span className="text-gray-600">{taskId}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">当前状态</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${statusColor[task.status]}`}
          >
            {statusMap[task.status]}
          </span>
        </div>
      </div>

      {/* 结果展示 */}
      {task.status === "done" && result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold">分析结果</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-gray-500 text-sm">风格标签</p>
              <p className="font-medium">{result.style_tags?.join(", ")}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-gray-500 text-sm">帧率 (FPS)</p>
              <p className="font-medium">{result.fps}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-gray-500 text-sm">时长 (秒)</p>
              <p className="font-medium">{result.duration}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-gray-500 text-sm">分辨率</p>
              <p className="font-medium">{result.resolution}</p>
            </div>
          </div>
        </div>
      )}

      {task.status === "failed" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <p>任务失败</p>
          <p className="text-sm mt-2">{task.error}</p>
        </div>
      )}
    </div>
  );
};
