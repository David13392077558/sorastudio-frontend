import { create } from "zustand";

interface TaskData {
  id?: string;
  type?: string;
  status?: string;
  progress?: number;
  result?: any;
  error?: string | null;
}

interface TaskStore {
  currentTaskId: string;
  tasks: Record<string, TaskData>;

  setCurrentTaskId: (id: string) => void;
  addTask: (task: TaskData) => void;
  updateTask: (id: string, data: TaskData) => void;
  getTask: (id: string) => TaskData | null;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  currentTaskId: "",
  tasks: {},

  setCurrentTaskId: (id) => set({ currentTaskId: id }),

  // ⭐ 补上 addTask（EcommercePage 需要）
  addTask: (task) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [task.id!]: task,
      },
    })),

  updateTask: (id, data) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...state.tasks[id],
          ...data,
        },
      },
    })),

  getTask: (id) => {
    return get().tasks[id] || null;
  },
}));
