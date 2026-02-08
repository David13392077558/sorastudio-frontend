import { useAnalysisStore } from "../../store/useAnalysisStore";

export default function AnalysisResultPanel() {
  const result = useAnalysisStore((s) => s.result);
  const loading = useAnalysisStore((s) => s.loading);
  const error = useAnalysisStore((s) => s.error);

  if (loading) {
    return <div className="p-4 text-blue-400">分析中…</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">错误: {error}</div>;
  }

  if (!result) {
    return <div className="p-4 text-gray-400">等待分析结果…</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono overflow-auto max-h-[400px]">
      <h3 className="text-lg mb-2">分析结果</h3>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
