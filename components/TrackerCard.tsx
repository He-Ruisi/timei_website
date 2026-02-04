import React from 'react';
import { Tracker, TrackerType } from '../types';
import { Button } from './Button';
import { Play, Square, Plus, Check, Clock, RotateCcw } from 'lucide-react';

interface TrackerCardProps {
  tracker: Tracker;
  onUpdate: (id: string, updates: Partial<Tracker>) => void;
  onPlan: (tracker: Tracker) => void;
  onDelete: (id: string) => void;
}

export const TrackerCard: React.FC<TrackerCardProps> = ({ tracker, onUpdate, onPlan, onDelete }) => {
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimerToggle = () => {
    if (tracker.isRunning) {
      // Stop
      onUpdate(tracker.id, { isRunning: false, startTime: null });
    } else {
      // Start
      onUpdate(tracker.id, { isRunning: true, startTime: Date.now() });
    }
  };

  const handleCounter = (delta: number) => {
    onUpdate(tracker.id, { value: Math.max(0, tracker.value + delta) });
  };

  const renderControls = () => {
    switch (tracker.type) {
      case TrackerType.TIMER:
        return (
          <div className="flex gap-2 items-center">
            <div className="text-3xl font-crayon w-24 text-center bg-white border border-crayon-black rounded p-1">
              {formatTime(tracker.elapsedTime)}
            </div>
            <Button 
              variant={tracker.isRunning ? "danger" : "primary"}
              onClick={handleTimerToggle}
              className="w-12 h-12 !p-0 rounded-full"
            >
              {tracker.isRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </Button>
            {!tracker.isRunning && (
               <Button variant="secondary" size="sm" onClick={() => onPlan(tracker)} title="Plan to Timeline">
                  <Clock size={16} />
               </Button>
            )}
          </div>
        );
      case TrackerType.COUNTER:
        return (
          <div className="flex gap-4 items-center">
            <div className="text-4xl font-crayon text-crayon-black">{tracker.value}</div>
            <Button variant="primary" onClick={() => handleCounter(1)} className="rounded-full w-10 h-10 !p-0">
              <Plus size={20} />
            </Button>
          </div>
        );
      case TrackerType.CHECKBOX:
        return (
          <Button 
            variant={tracker.value === 1 ? "primary" : "secondary"}
            onClick={() => onUpdate(tracker.id, { value: tracker.value === 1 ? 0 : 1 })}
            className="w-full justify-center"
          >
             {tracker.value === 1 ? <><Check /> 已完成</> : "标记完成"}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`
      relative p-4 rounded-xl border-2 border-crayon-black shadow-sketch
      ${tracker.color} transition-transform hover:-translate-y-1
    `}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-crayon text-lg leading-tight">{tracker.title}</h3>
        <button 
          onClick={() => onDelete(tracker.id)} 
          className="text-gray-400 hover:text-red-500"
        >
          &times;
        </button>
      </div>
      
      <div className="flex justify-between items-end">
        {renderControls()}
        <div className="text-xs font-bold opacity-50 uppercase tracking-widest">{tracker.type}</div>
      </div>
    </div>
  );
};
