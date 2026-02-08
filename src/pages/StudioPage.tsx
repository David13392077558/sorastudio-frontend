import React, { useState } from 'react';
import { ImageUploader } from '../components/shared/ImageUploader';
import { ResultCard } from '../components/shared/ResultCard';
import CameraCapture from '../components/shared/CameraCapture';
import AnalysisResultPanel from '../components/shared/AnalysisResultPanel';
import { analyzeFrame } from '../api/aiWorker';
import { useAnalysisStore } from '../store/useAnalysisStore';

export const StudioPage: React.FC = () => {
  const [script, setScript] = useState('');
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const setResult = useAnalysisStore((s) => s.setResult);
  const setLoading = useAnalysisStore((s) => s.setLoading);
  const setError = useAnalysisStore((s) => s.setError);

  // 实时视频帧处理
  const handleFrame = async (frame: string) => {
    try {
      setLoading(true);
      const res = await analyzeFrame(frame);
      setResult(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 数字人生成按钮逻辑（保留）
  const handleGenerate = async () => {
    if (!script.trim()) {
      alert('请输入脚本内容');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('数字人视频生成功能开发中...');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">数字人工作台</h1>
        <p className="text-gray-600">创建专业的数字人视频内容 · 实时视频分析</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* 左侧：脚本输入 + 数字人形象 */}
        <div className="space-y-6 xl:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              脚本内容 *
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="输入数字人要说的台词内容..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              数字人形象（可选）
            </label>
            <ImageUploader
              onImageSelect={setAvatarImage}
              preview={avatarImage ? URL.createObjectURL(avatarImage) : undefined}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!script.trim() || isGenerating}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? '生成中...' : '生成数字人视频'}
          </button>

          {script && (
            <ResultCard
              title="脚本预览"
              content={script}
              type="script"
              onCopy={() => navigator.clipboard.writeText(script)}
            />
          )}
        </div>

        {/* 中间：实时摄像头 */}
        <div className="xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">实时视频输入</h2>
          <CameraCapture onFrame={handleFrame} />
        </div>

        {/* 右侧：分析结果展示 */}
        <div className="xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">分析结果</h2>
          <AnalysisResultPanel />
        </div>
      </div>
    </div>
  );
};

