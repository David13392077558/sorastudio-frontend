import { create } from "zustand";

interface TaskData {
  status?: string;
  progress?: number;
  result?: any;
  error?: string | null;
}

interface TaskStore {
  currentTaskId: string;
  tasks: Record<string, TaskData>;

  setCurrentTaskId: (id: string) => void;
  updateTask: (id: string, data: TaskData) => void;
  getTask: (id: string) => TaskData | null;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  currentTaskId: "",
  tasks: {},

  setCurrentTaskId: (id) => set({ currentTaskId: id }),

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
