import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { breakDownGoal } from './services/geminiService';
import { Goal, Task, Tracker, TrackerType, TimeBlock, TimeBlockType, UserState } from './types';
import { TrackerCard } from './components/TrackerCard';
import { Timeline } from './components/Timeline';
import { Button } from './components/Button';
import { Plus, BrainCircuit, LayoutDashboard, ShoppingBag, Coins, ArrowRight } from 'lucide-react';

// --- Colors for Trackers ---
const PASTEL_COLORS = [
  'bg-crayon-blue/30',
  'bg-crayon-green/30',
  'bg-crayon-yellow/30',
  'bg-crayon-purple/30',
  'bg-crayon-red/20'
];

// --- Landing Page Component ---
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="text-3xl font-crayon font-bold text-crayon-black">时宜 ShiYi</div>
        <Link to="/app">
          <Button variant="primary" size="lg">进入应用</Button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-8">
        <div className="bg-white p-2 border-2 border-crayon-black -rotate-1 shadow-sketch inline-block text-xs font-bold mb-4">
           内测阶段 Beta v0.1 | 已开启 AI 辅助
        </div>
        <h1 className="text-6xl md:text-8xl font-crayon text-crayon-black mb-4">
          画出你的<br/><span className="text-crayon-blue">时光</span>轨迹
        </h1>
        <p className="text-xl md:text-2xl font-crayon text-gray-600 max-w-2xl leading-relaxed">
          不只是代办清单。时宜帮你将大目标拆解为小行动，
          用最直观的“蜡笔”记录每一个专注的时刻。
        </p>
        
        <div className="flex gap-4 mt-8">
           <Link to="/app">
             <Button variant="primary" size="lg" className="text-xl px-12 py-4">
               开始规划 <ArrowRight className="ml-2" />
             </Button>
           </Link>
           <Button variant="secondary" size="lg" onClick={() => alert("共创群号：8888-6666")}>加入共创群</Button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
           <div className="p-6 border-2 border-crayon-black rounded-xl bg-crayon-yellow/20 shadow-sketch-sm">
              <h3 className="font-bold text-xl mb-2">AI 拆解</h3>
              <p>输入一个模糊的目标，AI 帮你变成可执行的 Tracker。</p>
           </div>
           <div className="p-6 border-2 border-crayon-black rounded-xl bg-crayon-blue/20 shadow-sketch-sm">
              <h3 className="font-bold text-xl mb-2">多维记录</h3>
              <p>计时、计数、打卡... 针对不同任务类型的最佳记录方式。</p>
           </div>
           <div className="p-6 border-2 border-crayon-black rounded-xl bg-crayon-green/20 shadow-sketch-sm">
              <h3 className="font-bold text-xl mb-2">积分商城</h3>
              <p>专注即财富。用你的努力兑换（未来的）奖励。</p>
           </div>
        </div>
      </main>
      
      <footer className="p-8 text-center text-gray-400 font-crayon">
        &copy; 2024 ShiYi Lab. All rights reserved.
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
  
  // Timer interval ref
  const timerIntervalRef = useRef<number | null>(null);

  // --- Logic: Goal Breakdown ---
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

  // --- Logic: Instantiate Tracker ---
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

  // --- Logic: Timer Updates ---
  useEffect(() => {
    timerIntervalRef.current = window.setInterval(() => {
      setTrackers(prevTrackers => {
        let hasChanges = false;
        const nextTrackers = prevTrackers.map(t => {
          if (t.type === TrackerType.TIMER && t.isRunning && t.startTime) {
            hasChanges = true;
            const now = Date.now();
            const elapsed = Math.floor((now - t.startTime) / 1000) + t.elapsedTime; 
            // NOTE: In a real app, we'd store accumulated time separately from current session time
            // Simplified here: t.elapsedTime is total time. 
            // Correct approach for continuous display: display = total_accumulated + (now - start_current_session)
            // But for this simple implementation, we'll just increment current session relative to start.
            
            // To make "Record" blocks, we need to actively update or create a block ending 'now'
            updateRecordBlock(t.id, t.title, t.startTime, now, t.color);
            
            return {
               ...t,
               // Visual update only, logic relies on blocks for history
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency to run once

  const updateRecordBlock = (trackerId: string, title: string, start: number, end: number, color: string) => {
    setTimeBlocks(prev => {
      // Find active record block for this tracker that is close to "now" (simulating a growing block)
      const activeBlockIndex = prev.findIndex(b => 
        b.trackerId === trackerId && 
        b.type === TimeBlockType.RECORD && 
        Math.abs(b.endTime - end) < 2000 // Within 2 seconds
      );

      if (activeBlockIndex >= 0) {
        const newBlocks = [...prev];
        newBlocks[activeBlockIndex].endTime = end;
        return newBlocks;
      } else {
        // Create new
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

  // --- Logic: Tracker Updates & Gamification ---
  const updateTracker = (id: string, updates: Partial<Tracker>) => {
    setTrackers(prev => prev.map(t => {
      if (t.id !== id) return t;
      
      const updated = { ...t, ...updates };

      // Point Logic: If stopping a timer
      if (t.type === TrackerType.TIMER && t.isRunning && updates.isRunning === false) {
          // Add points based on duration
          const sessionSeconds = Math.floor((Date.now() - (t.startTime || 0)) / 1000);
          if (sessionSeconds > 60) { // Only if > 1 min
              addPoints(Math.floor(sessionSeconds / 60) * 2); // 2 points per min
          }
      }
      // Point Logic: If increasing counter
      if (t.type === TrackerType.COUNTER && typeof updates.value === 'number' && updates.value > t.value) {
          addPoints(5);
      }
      // Point Logic: Completing checkbox
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

  // --- Logic: Planning ---
  const handlePlanTracker = (tracker: Tracker) => {
      // For MVP, just add a plan block 1 hour from now for 30 mins
      const start = Date.now() + 3600000; // +1 hour
      const end = start + 1800000; // +30 mins
      
      const newBlock: TimeBlock = {
          id: crypto.randomUUID(),
          trackerId: tracker.id,
          trackerTitle: tracker.title,
          type: TimeBlockType.PLAN,
          startTime: start,
          endTime: end,
          color: tracker.color.replace('/30', '/50') // Slightly darker for plan
      };
      
      setTimeBlocks(prev => [...prev, newBlock]);
      alert(`已将 "${tracker.title}" 计划在 1 小时后。`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-crayon-black">
      {/* Header */}
      <header className="bg-white border-b-2 border-crayon-black p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <LayoutDashboard className="text-crayon-blue" />
            <h1 className="font-crayon text-2xl">时宜 Planner</h1>
        </div>
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
          
          {/* Column 1: Goals & Tasks (3 cols) */}
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
                <Button 
                   onClick={handleBreakdown} 
                   disabled={isBreakingDown} 
                   className="w-full"
                >
                   {isBreakingDown ? "AI 思考中..." : <><BrainCircuit size={16} /> AI 拆解目标</>}
                </Button>
            </div>

            <div className="flex-1">
                <h3 className="font-crayon text-gray-500 mb-3">待实例化任务</h3>
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
                        <div className="text-center text-gray-400 text-sm py-10">
                            暂无待办任务
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Column 2: Active Trackers (5 cols) */}
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
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <LayoutDashboard size={48} className="opacity-20" />
                        <p>左侧生成任务后，点击实例化</p>
                    </div>
                )}
            </div>
          </div>

          {/* Column 3: Timeline (4 cols) */}
          <div className="md:col-span-4 h-full">
            <Timeline blocks={timeBlocks} />
          </div>

        </div>
      </main>
    </div>
  );
};

// --- App Root ---
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
