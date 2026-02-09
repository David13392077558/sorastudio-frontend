import { create } from "zustand";

interface FaceData {
  landmarks?: number[][];
  bbox?: number[];
  rotation?: { pitch: number; yaw: number; roll: number };
}

interface PoseData {
  keypoints?: number[][];
}

interface ExpressionData {
  emotions?: Record<string, number>;
  mouthOpen?: number;
  eyeBlink?: number;
}

interface AnalysisResult {
  face?: FaceData;
  pose?: PoseData;
  expression?: ExpressionData;
  raw?: any;
}

interface AnalysisStore {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;

  setResult: (r: AnalysisResult | null) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  result: null,
  loading: false,
  error: null,

  setResult: (r) => set({ result: r, loading: false, error: null }),
  setLoading: (v) => set({ loading: v }),
  setError: (msg) => set({ error: msg, loading: false }),

  reset: () => set({ result: null, loading: false, error: null }),
}));
