import React from 'react';
import { Cohort, Quarter, Day } from '../../types';
import ScheduleCell from './ScheduleCell';
import { useDndContext, DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'react-hot-toast';

interface CohortScheduleProps {
  cohort: Cohort;
  onLectureMove: (cellId: string, targetQuarter: Quarter, targetDay: Day) => void;
  onEditLecture: (cellId: string) => void;
}

const days: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const quarters: Quarter[] = [1, 2, 3, 4];

const CohortSchedule: React.FC<CohortScheduleProps> = ({
  cohort,
  onLectureMove,
  onEditLecture
}) => {
  const [activeCell, setActiveCell] = React.useState<string | null>(null);
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveCell(active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveCell(null);
      return;
    }
    
    if (active.id !== over.id) {
      const overData = over.data.current as { quarter: Quarter; day: Day };
      if (overData) {
        onLectureMove(
          active.id as string,
          overData.quarter,
          overData.day
        );
        toast.success('Lecture moved successfully');
      }
    }
    
    setActiveCell(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-blue-50">
        <h3 className="text-lg font-bold text-gray-800">{cohort.name}</h3>
      </div>
      
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border bg-gray-50"></th>
                {days.map(day => (
                  <th 
                    key={day} 
                    className="p-2 text-sm font-medium text-gray-700 border bg-gray-50"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quarters.map(quarter => (
                <tr key={quarter}>
                  <td className="p-2 border bg-gray-50 font-medium text-gray-700">
                    Q{quarter}
                  </td>
                  {days.map(day => {
                    const cell = cohort.cells.find(
                      c => c.quarter === quarter && c.day === day
                    );
                    
                    if (!cell) {
                      return (
                        <td key={`${quarter}-${day}`} className="border p-1">
                          <div className="h-24 bg-gray-50" />
                        </td>
                      );
                    }
                    
                    return (
                      <td key={`${quarter}-${day}`} className="border p-1">
                        <ScheduleCell
                          cell={cell}
                          isActive={activeCell === cell.id}
                          onEditLecture={() => onEditLecture(cell.id)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>
    </div>
  );
};

export default CohortSchedule;