import { create } from 'zustand';

interface AnalysisState {
  result: any | null;
  loading: boolean;
  error: string | null;
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  loading: false,
  error: null,

  setResult: (result) => set({ result, error: null }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  reset: () => set({ result: null, loading: false, error: null }),
}));
