import React from 'react';
import { TimeBlock, TimeBlockType } from '../types';

interface TimelineProps {
  blocks: TimeBlock[];
}

export const Timeline: React.FC<TimelineProps> = ({ blocks }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentTime = new Date();
  const currentHourPercent = (currentTime.getHours() * 60 + currentTime.getMinutes()) / (24 * 60) * 100;

  // Helper to position blocks
  const getBlockStyle = (block: TimeBlock) => {
    const start = new Date(block.startTime);
    const end = new Date(block.endTime);
    
    // Normalize to current day 00:00 - 23:59 for simple visualization
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    
    // Safety check if spans across midnight, clip to 24h
    const duration = Math.max(15, endMinutes - startMinutes); // Min height 15m
    
    const top = (startMinutes / (24 * 60)) * 100;
    const height = (duration / (24 * 60)) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };

  return (
    <div className="bg-white border-2 border-crayon-black rounded-xl shadow-sketch p-4 h-full flex flex-col overflow-hidden">
      <h2 className="font-crayon text-xl mb-4 text-center">今日时间轴</h2>
      
      <div className="relative flex-1 overflow-y-auto custom-scrollbar border-t-2 border-dashed border-gray-200">
        <div className="relative h-[1440px]"> {/* 1px per minute approx scaling */}
           {/* Hour Markers */}
           {hours.map(h => (
             <div key={h} className="absolute w-full border-t border-gray-100 text-xs text-gray-400 pl-1" style={{ top: `${(h / 24) * 100}%` }}>
               {h}:00
             </div>
           ))}

           {/* Current Time Indicator */}
           <div 
             className="absolute w-full border-t-2 border-red-400 z-20 pointer-events-none flex items-center"
             style={{ top: `${currentHourPercent}%` }}
           >
             <div className="w-2 h-2 bg-red-400 rounded-full -ml-1"></div>
           </div>

           {/* Blocks */}
           {blocks.map(block => (
             <div
               key={block.id}
               className={`absolute left-8 right-2 rounded-lg border-2 border-crayon-black p-1 text-xs overflow-hidden flex flex-col justify-center
                 ${block.type === TimeBlockType.PLAN ? 'border-dashed opacity-80 z-10' : 'z-10 shadow-sm'}
                 ${block.color}
               `}
               style={getBlockStyle(block)}
             >
               <span className="font-bold truncate">{block.trackerTitle}</span>
               <span className="opacity-75 text-[10px]">{block.type === TimeBlockType.PLAN ? '(计划)' : '(记录)'}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
