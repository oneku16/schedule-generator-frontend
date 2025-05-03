import React from 'react';
import { Cell } from '../../types';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Edit, Grip } from 'lucide-react';

interface ScheduleCellProps {
  cell: Cell;
  isActive?: boolean;
  onEditLecture: () => void;
}

const ScheduleCell: React.FC<ScheduleCellProps> = ({
  cell,
  isActive = false,
  onEditLecture
}) => {
  const { lecture } = cell;
  
  // Set up draggable for cells with lectures
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = 
    useDraggable({
      id: cell.id,
      data: {
        type: 'cell',
        cell
      },
      disabled: !lecture
    });
  
  // Set up droppable for all cells
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${cell.id}`,
    data: {
      type: 'cell',
      quarter: cell.quarter,
      day: cell.day
    }
  });
  
  // Combined ref function
  const setRefs = (element: HTMLDivElement) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };
  
  // Generate a background color based on the lecture title (if it exists)
  const getBgColor = () => {
    if (!lecture) return 'bg-gray-50';
    if (lecture.color) return lecture.color;
    
    // Simple hash function to generate a color
    const hash = lecture.title.split('').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 92%)`;
  };
  
  return (
    <div
      ref={setRefs}
      className={`
        h-24 p-2 rounded flex flex-col justify-between transition-all
        ${getBgColor()}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isActive ? 'ring-2 ring-blue-500' : ''}
        ${!lecture ? 'border border-dashed border-gray-300' : 'shadow-sm'}
      `}
      {...attributes}
      {...(lecture ? listeners : {})}
    >
      {lecture ? (
        <>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
              {lecture.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLecture();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit size={14} />
            </button>
          </div>
          
          {lecture.instructor && (
            <div className="text-xs text-gray-600 mt-1">
              {lecture.instructor}
            </div>
          )}
          
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
              <Grip className="text-blue-500" />
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
          Empty
        </div>
      )}
    </div>
  );
};

export default ScheduleCell;