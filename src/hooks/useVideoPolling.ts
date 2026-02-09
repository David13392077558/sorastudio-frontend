import { useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import { useTaskStore } from '../store/useTaskStore';

export const useVideoPolling = (taskId: string | null, interval = 2000) => {
  const intervalRef = useRef<number>();
  const { updateTask, getTask } = useTaskStore();

  useEffect(() => {
    if (!taskId) return;

    const poll = async () => {
      try {
        const response = await apiClient.getTaskStatus(taskId);

        // ⭐ 后端返回结构：{ success, task: {...} }
        const task = response.data.task;
        if (!task) return;

        const { status, progress, result, error } = task;

        // ⭐ 更新 TaskStore
        updateTask(taskId, { status, progress, result, error });

        // ⭐ 任务结束后停止轮询
        if (status === 'completed' || status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (error) {
        console.error('Polling error:', error);
        updateTask(taskId, { status: 'failed', error: '网络错误' });
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    // 立即执行一次
    poll();

    // 设置轮询
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [taskId, interval, updateTask]);

  return getTask(taskId || '');
};
