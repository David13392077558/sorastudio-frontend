import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface CameraCaptureProps {
  onFrame?: (frameData: string) => void;
  interval?: number; // 捕获帧的间隔（毫秒）
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onFrame, 
  interval = 1000 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 启动摄像头
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        setError(null);

        // 开始定期捕获帧
        if (onFrame) {
          intervalRef.current = setInterval(() => {
            captureFrame();
          }, interval);
        }
      }
    } catch (err: any) {
      setError('无法访问摄像头: ' + err.message);
      console.error('Camera error:', err);
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsActive(false);
  };

  // 捕获当前帧
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !onFrame) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // 设置canvas尺寸与视频一致
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制当前帧
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转换为base64
    const frameData = canvas.toDataURL('image/jpeg', 0.8);
    onFrame(frameData);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* 视频预览 */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
          style={{ maxHeight: '500px' }}
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
            <div className="text-center text-white">
              <CameraOff size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">摄像头未启动</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/90">
            <div className="text-center text-white px-4">
              <p className="text-lg font-semibold mb-2">错误</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的canvas用于截图 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 控制按钮 */}
      <div className="flex gap-4">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            启动摄像头
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <CameraOff size={20} />
            停止摄像头
          </button>
        )}
      </div>

      {/* 提示信息 */}
      {isActive && onFrame && (
        <div className="text-sm text-gray-600 text-center">
          正在实时分析视频帧（每 {interval / 1000} 秒）
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
