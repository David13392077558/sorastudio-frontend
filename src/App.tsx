import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Video, ShoppingBag, UserCircle, BarChart3, FolderOpen, User, LogOut, History } from 'lucide-react';
import SoraPage from './pages/SoraPage';
import { EcommercePage } from './pages/EcommercePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { StudioPage } from './pages/StudioPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { TaskStatusPage } from './pages/TaskStatusPage';
import { authService } from './services/authService';

const Sidebar = () => {
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      authService.logout();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="w-64 glass-dark fixed h-screen text-white p-6 flex flex-col border-r border-white/10">
      {/* Logo 区域 - 渐变文本 */}
      <div className="text-3xl font-bold mb-12 gradient-text">
        ✨ SoraStudio
      </div>
      
      {/* 菜单项 */}
      <div className="flex-1 space-y-2">
        <Link to="/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <FolderOpen size={20} className="group-hover:text-blue-400 transition-colors"/> 
          <span className="group-hover:translate-x-1 transition-transform">项目管理</span>
        </Link>
        <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <History size={20} className="group-hover:text-purple-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">历史记录</span>
        </Link>
        <Link to="/sora" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <Video size={20} className="group-hover:text-pink-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">Sora 提示词</span>
        </Link>
        <Link to="/analyze" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <BarChart3 size={20} className="group-hover:text-cyan-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">视频分析</span>
        </Link>
        <Link to="/studio" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <UserCircle size={20} className="group-hover:text-green-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">数字人工作台</span>
        </Link>
        <Link to="/ecommerce" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 group">
          <ShoppingBag size={20} className="group-hover:text-yellow-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">电商带货</span>
        </Link>
      </div>

      {/* 用户菜单 */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg group">
          <User size={20} className="group-hover:text-blue-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">个人资料</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-300 hover:bg-red-500/20 hover:shadow-lg group"
        >
          <LogOut size={20} className="group-hover:text-red-400 transition-colors"/>
          <span className="group-hover:translate-x-1 transition-transform">退出登录</span>
        </button>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<div className="text-2xl text-center py-20">欢迎来到 SoraStudio Pro<br/><span className="text-lg text-gray-600">请选择左侧功能开始使用</span></div>} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sora" element={<SoraPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/ecommerce" element={<EcommercePage />} />
            <Route path="/task/:taskId" element={<TaskStatusPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}