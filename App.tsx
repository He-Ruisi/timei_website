import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { breakDownGoal } from './services/geminiService';
import { Goal, Task, Tracker, TrackerType, TimeBlock, TimeBlockType, UserState } from './types';
import { TrackerCard } from './components/TrackerCard';
import { Timeline } from './components/Timeline';
import { Button } from './components/Button';
import { Plus, BrainCircuit, LayoutDashboard, ShoppingBag, Coins, ArrowRight, X, MessageCircle, MessageSquare } from 'lucide-react';

// --- Colors for Trackers ---
const PASTEL_COLORS = [
  'bg-crayon-blue/30',
  'bg-crayon-green/30',
  'bg-crayon-yellow/30',
  'bg-crayon-purple/30',
  'bg-crayon-red/20'
];

// --- QR Modal Component ---
const QrModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-paper border-4 border-crayon-black rounded-3xl p-8 max-w-md w-full shadow-sketch relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} />
        </button>
        <h2 className="font-crayon text-3xl text-center mb-8">加入 Timei 共创群</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-white border-2 border-crayon-black rounded-xl p-2 flex items-center justify-center shadow-sketch-sm">
               {/* Mock WeChat QR */}
               <div className="bg-crayon-green/20 w-full h-full flex items-center justify-center">
                  <MessageCircle size={40} className="text-crayon-green" />
               </div>
            </div>
            <span className="font-crayon font-bold text-crayon-black">微信群</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-white border-2 border-crayon-black rounded-xl p-2 flex items-center justify-center shadow-sketch-sm">
               {/* Mock Discord QR */}
               <div className="bg-crayon-blue/20 w-full h-full flex items-center justify-center">
                  <MessageSquare size={40} className="text-crayon-blue" />
               </div>
            </div>
            <span className="font-crayon font-bold text-crayon-black">Discord</span>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm font-crayon text-gray-500">
          扫描二维码，与开发者一起<br/>共同定义未来的时间管理工具。
        </p>
      </div>
    </div>
  );
};

// --- Landing Page Component ---
const LandingPage = () => {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    // Placeholder for APK download
    const link = document.createElement('a');
    link.href = 'timei-v0.1-alpha.apk'; 
    link.download = 'Timei_Beta.apk';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    
    // For presentation/web testing, we also navigate to the app
    alert("正在为您准备安装包... (已模拟下载)\n即将进入 Web 预览版");
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper overflow-x-hidden">
      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="text-4xl font-crayon font-bold text-crayon-black tracking-tighter">Timei</div>
        <div className="flex gap-4">
           {/* Enter App button removed per request */}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-8 relative">
        {/* Artistic Blobs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-crayon-yellow/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-crayon-blue/20 rounded-full blur-3xl -z-10"></div>

        <div className="bg-white px-3 py-1 border-2 border-crayon-black -rotate-1 shadow-sketch inline-block text-sm font-bold mb-4 font-crayon">
           Timei Beta v0.1 | 已深度集成 Gemini AI
        </div>
        
        <h1 className="text-6xl md:text-9xl font-crayon text-crayon-black mb-4 leading-tight">
          画出你的<br/><span className="text-crayon-blue decoration-wavy underline decoration-2">时光</span>轨迹
        </h1>
        
        <p className="text-xl md:text-2xl font-crayon text-gray-600 max-w-2xl leading-relaxed">
          不只是代办清单。Timei 帮你将复杂目标拆解为具体行动，
          用最直觉的“蜡笔”记录你专注的每一分钟。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
           <Button variant="primary" size="lg" className="text-2xl px-12 py-5" onClick={handleStartPlanning}>
             开始规划 <ArrowRight className="ml-2" />
           </Button>
           <Button variant="secondary" size="lg" className="text-2xl" onClick={() => setIsQrOpen(true)}>
             加入共创群
           </Button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
           <div className="p-8 border-2 border-crayon-black rounded-2xl bg-white shadow-sketch transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-crayon-yellow rounded-full mb-4 flex items-center justify-center border-2 border-crayon-black">
                <BrainCircuit size={24} />
              </div>
              <h3 className="font-crayon font-bold text-2xl mb-3 text-left">AI 辅助拆解</h3>
              <p className="text-left font-crayon text-gray-500">只需输入一个模糊的想法，AI 就能帮你细化为可执行的 Tracker 序列。</p>
           </div>
           <div className="p-8 border-2 border-crayon-black rounded-2xl bg-white shadow-sketch transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-crayon-blue rounded-full mb-4 flex items-center justify-center border-2 border-crayon-black">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="font-crayon font-bold text-2xl mb-3 text-left">多维 Tracker</h3>
              <p className="text-left font-crayon text-gray-500">针对运动、学习、生活习惯提供计时、计数、打卡等多种记录维度。</p>
           </div>
           <div className="p-8 border-2 border-crayon-black rounded-2xl bg-white shadow-sketch transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-crayon-green rounded-full mb-4 flex items-center justify-center border-2 border-crayon-black">
                <Coins size={24} />
              </div>
              <h3 className="font-crayon font-bold text-2xl mb-3 text-left">激励化成长</h3>
              <p className="text-left font-crayon text-gray-500">专注时间即是积分。用你的汗水兑换专属装扮与功能奖励。</p>
           </div>
        </div>
      </main>
      
      <footer className="p-12 text-center text-gray-400 font-crayon border-t border-dashed border-gray-200 mt-20">
        &copy; 2024 Timei Lab. 让时间不仅是被管理，更是被珍藏。
      </footer>
    </div>
  );
}

// --- Dashboard Component ---
const Dashboard = () => {
  // State
  const [goalInput, setGoalInput] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [userState, setUserState] = useState<UserState>({ points: 150, level: 1 });
  
  const timerIntervalRef = useRef<number | null>(null);

  const handleBreakdown = async () => {
    if (!goalInput.trim()) return;
    setIsBreakingDown(true);
    const result = await breakDownGoal(goalInput);
    
    const newTasks: Task[] = result.map(t => ({
      id: crypto.randomUUID(),
      goalId: 'g1',
      title: t.title,
      recommendedTracker: t.recommendedTracker,
      isInstantiated: false
    }));
    
    setTasks(prev => [...prev, ...newTasks]);
    setGoalInput('');
    setIsBreakingDown(false);
  };

  const instantiateTracker = (task: Task) => {
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const newTracker: Tracker = {
      id: crypto.randomUUID(),
      taskId: task.id,
      title: task.title,
      type: task.recommendedTracker,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      value: 0,
      color: color
    };
    setTrackers(prev => [...prev, newTracker]);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isInstantiated: true } : t));
  };

  useEffect(() => {
    timerIntervalRef.current = window.setInterval(() => {
      setTrackers(prevTrackers => {
        let hasChanges = false;
        const nextTrackers = prevTrackers.map(t => {
          if (t.type === TrackerType.TIMER && t.isRunning && t.startTime) {
            hasChanges = true;
            const now = Date.now();
            updateRecordBlock(t.id, t.title, t.startTime, now, t.color);
            return {
               ...t,
               elapsedTime: t.elapsedTime + 1 
            };
          }
          return t;
        });
        return hasChanges ? [...nextTrackers] : prevTrackers;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const updateRecordBlock = (trackerId: string, title: string, start: number, end: number, color: string) => {
    setTimeBlocks(prev => {
      const activeBlockIndex = prev.findIndex(b => 
        b.trackerId === trackerId && 
        b.type === TimeBlockType.RECORD && 
        Math.abs(b.endTime - end) < 3000
      );

      if (activeBlockIndex >= 0) {
        const newBlocks = [...prev];
        newBlocks[activeBlockIndex] = { ...newBlocks[activeBlockIndex], endTime: end };
        return newBlocks;
      } else {
        return [...prev, {
          id: crypto.randomUUID(),
          trackerId,
          trackerTitle: title,
          type: TimeBlockType.RECORD,
          startTime: start,
          endTime: end,
          color
        }];
      }
    });
  };

  const updateTracker = (id: string, updates: Partial<Tracker>) => {
    setTrackers(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates };
      if (t.type === TrackerType.TIMER && t.isRunning && updates.isRunning === false) {
          const sessionSeconds = Math.floor((Date.now() - (t.startTime || 0)) / 1000);
          if (sessionSeconds > 30) {
              addPoints(Math.floor(sessionSeconds / 60) * 2 + 5);
          }
      }
      if (t.type === TrackerType.COUNTER && typeof updates.value === 'number' && updates.value > t.value) {
          addPoints(5);
      }
      if (t.type === TrackerType.CHECKBOX && updates.value === 1) {
          addPoints(50);
      }
      return updated;
    }));
  };

  const deleteTracker = (id: string) => {
    setTrackers(prev => prev.filter(t => t.id !== id));
  };

  const addPoints = (amount: number) => {
    setUserState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const handlePlanTracker = (tracker: Tracker) => {
      const start = Date.now() + 3600000;
      const end = start + 1800000;
      const newBlock: TimeBlock = {
          id: crypto.randomUUID(),
          trackerId: tracker.id,
          trackerTitle: tracker.title,
          type: TimeBlockType.PLAN,
          startTime: start,
          endTime: end,
          color: tracker.color.replace('/30', '/50')
      };
      setTimeBlocks(prev => [...prev, newBlock]);
      alert(`已将 "${tracker.title}" 计划在 1 小时后。`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-crayon-black">
      <header className="bg-white border-b-2 border-crayon-black p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LayoutDashboard className="text-crayon-blue" />
            <h1 className="font-crayon text-2xl tracking-tighter">Timei</h1>
        </Link>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-crayon-yellow/30 px-3 py-1 rounded-full border border-crayon-black">
                <Coins size={18} className="text-orange-500"/>
                <span className="font-bold font-crayon">{userState.points} 积分</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => alert("积分商城建设中... 敬请期待！")}>
                <ShoppingBag size={18} />
            </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          <div className="md:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white p-4 rounded-xl border-2 border-crayon-black shadow-sketch">
                <h2 className="font-crayon text-lg mb-2">新的目标</h2>
                <textarea 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-crayon-blue transition-colors font-crayon mb-3 text-sm"
                  rows={3}
                  placeholder="我想..."
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleBreakdown()}
                />
                <Button onClick={handleBreakdown} disabled={isBreakingDown} className="w-full">
                   {isBreakingDown ? "AI 思考中..." : <><BrainCircuit size={16} /> AI 拆解目标</>}
                </Button>
            </div>
            <div className="flex-1">
                <h3 className="font-crayon text-gray-400 mb-3 px-1 uppercase text-[10px] tracking-widest font-bold">待实例化任务</h3>
                <div className="space-y-3">
                    {tasks.filter(t => !t.isInstantiated).map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-lg border border-gray-300 border-dashed hover:border-crayon-blue transition-colors group">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-sm">{task.title}</span>
                                 <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">{task.recommendedTracker}</span>
                             </div>
                             <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => instantiateTracker(task)}>
                                一键生成 Tracker
                             </Button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center text-gray-300 text-sm py-10 font-crayon">
                            暂无任务<br/>在上方输入目标让 AI 帮您拆解
                        </div>
                    )}
                </div>
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="font-crayon text-xl pl-1">我的 Trackers</h2>
            <div className="grid grid-cols-1 gap-4">
                {trackers.map(tracker => (
                    <TrackerCard 
                        key={tracker.id} 
                        tracker={tracker} 
                        onUpdate={updateTracker} 
                        onPlan={handlePlanTracker}
                        onDelete={deleteTracker}
                    />
                ))}
                {trackers.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-gray-300 gap-4">
                        <LayoutDashboard size={48} className="opacity-10" />
                        <p className="font-crayon">左侧生成任务后，点击实例化</p>
                    </div>
                )}
            </div>
          </div>
          <div className="md:col-span-4 h-full">
            <Timeline blocks={timeBlocks} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}