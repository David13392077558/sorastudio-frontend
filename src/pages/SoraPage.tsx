import { useState } from "react";
import { Loader, Sparkles, Copy, Download } from "lucide-react";
import { generatePrompt } from "../api/gemini";

export default function SoraPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generatePrompt(
        `请为 Sora 生成一个视频提示词，要求：${input}`
      );
      setOutput(result);
    } catch (error) {
      setOutput("生成失败，请检查网络连接后重试");
    }
    setLoading(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ml-64 min-h-screen gradient-bg p-8">
      <div className="max-w-5xl mx-auto">
        {/* 标题区域 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4 flex items-center gap-3">
            <Sparkles size={40} /> Sora 视频提示词生成器
          </h1>
          <p className="text-white/70 text-lg">利用 AI 力量，生成高质量的视频提示词</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <div className="glass-dark p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">描述你的创意</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例如：生成一个未来城市、赛博朋克风格的视频，展现霓虹灯光和飞行汽车..."
              className="w-full h-56 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:bg-white/10 resize-none transition-all"
            />
            
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                loading || !input.trim()
                  ? "bg-gray-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  生成提示词
                </>
              )}
            </button>
          </div>

          {/* 输出区域 */}
          <div className="glass-dark p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">生成的提示词</h2>
            
            {output ? (
              <div>
                <div className="bg-white/5 rounded-xl p-4 mb-4 max-h-56 overflow-y-auto border border-purple-500/30">
                  <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">
                    {output}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Copy size={18} />
                    {copied ? "已复制" : "复制文本"}
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output));
                      element.setAttribute("download", "sora-prompt.txt");
                      element.style.display = "none";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="flex-1 py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Download size={18} />
                    下载
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-white/40">
                <p className="text-center">
                  {loading ? "✨ AI 正在创意中..." : "输入描述后点击生成"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 提示区域 */}
        <div className="mt-12 glass-dark p-6 rounded-2xl border-l-4 border-purple-500">
          <h3 className="text-lg font-bold text-white mb-3">💡 生成技巧</h3>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>✓ 详细描述场景、光影、色调等细节</li>
            <li>✓ 提及具体的艺术风格和参考点</li>
            <li>✓ 指定视频的节奏、运动和构图</li>
            <li>✓ 描述角色或对象的动作和表情</li>
          </ul>
        </div>
      </div>
    </div>
  );
}