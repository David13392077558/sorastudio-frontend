import React, { useState } from "react";
import { VideoUploader } from "../components/shared/VideoUploader";
import { useNavigate } from "react-router-dom";

export const AnalyzePage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!selectedVideo) {
      alert("请上传视频文件");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedVideo); // ⭐ 必须是 file（后端 multer.single("file")）

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert("上传失败");
        return;
      }

      const taskId = data.taskId;

      // ⭐ 跳转到任务状态页面
      navigate(`/task/${taskId}`);

    } catch (err) {
      console.error(err);
      alert("上传失败，请重试");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">视频风格分析</h1>

      <VideoUploader
        onVideoSelect={setSelectedVideo}
        preview={selectedVideo ? URL.createObjectURL(selectedVideo) : undefined}
      />

      <button
        onClick={handleAnalyze}
        disabled={!selectedVideo}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
      >
        开始分析
      </button>
    </div>
  );
};
