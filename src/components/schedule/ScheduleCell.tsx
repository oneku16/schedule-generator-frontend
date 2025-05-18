import React from 'react';
import { Cell } from '../../types';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Edit, Grip } from 'lucide-react';

interface ScheduleCellProps {
    item?: Cell;
  isActive?: boolean;
  onEditLecture: () => void;
}
export const gridPosition = {
    labels: 1,
    allDay: 1,
    columnStart: 1,
    rowStart: 1,
};

function splitTime(time) {
    const timeArray = time.split(":");
    const hour = parseInt(timeArray[0], 10);
    const minute = parseInt(timeArray[1], 10) || 0;

    return { hour, minute };
}

const ScheduleCell: React.FC<ScheduleCellProps> = ({
  item,
  isActive = false,
  onEditLecture
}) => {
    console.log("cc", item)
  const {
        lecture,
      day,
      end_time,
      id,
      start_time,
      room,
    } = item;


  
  // Set up draggable for cells with lectures
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = 
    useDraggable({
      id: item.id,
      data: {
        type: 'cell',
          item
      },
      disabled: !lecture
    });
  
  // Set up droppable for all cells
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${item.id}`,
    data: {
      type: 'cell',
      quarter: item.quarter,
      day: item.day
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
    if (lecture?.color) return lecture.color;
    
    // Simple hash function to generate a color
    const hash = lecture.split('').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 92%)`;
  };


  const { hour, minute } = splitTime(start_time);
  const row = hour + gridPosition.rowStart;






    return (
    <div
      ref={setRefs}
      className={`
        h-24 p-2 rounded flex flex-col justify-between transition-all
        ${getBgColor()}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isActive ? 'ring-2 ring-blue-500' : ''}
        ${!lecture ? 'border border-dashed border-gray-300' : 'shadow-sm'}
         ${day == "Monday" && 'col-start-1 col-end-1'}
         ${day == "Tuesday" && 'col-start-2 col-end-2'}
      ${day == "Wednesday" && 'col-start-3 col-end-3'}
      ${day == "Thursday" && 'col-start-4 col-end-4'}
      ${day == "Friday" && 'col-start-5 col-end-5'}
      `}
      {...attributes}
      {...(lecture ? listeners : {})}
        style={{
            gridRow: row - 7,
        }}
    >
      {lecture ? (
        <>
          <div className="flex flex-col justify-between items-start">
            <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
              {lecture}
            </h4>

              <h2>
                  {start_time} - {end_time} {day}
              </h2>


            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLecture();
              }}
              className="flex text-gray-500 hover:text-gray-700"
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