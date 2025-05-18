import React from 'react';
import { ScheduleItem } from '../../types';
import ScheduleCell from './ScheduleCell';

interface ScheduleGridProps {
  groupName: string;
  items: ScheduleItem[];
  onItemsChange: (items: ScheduleItem[]) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ groupName, items, onItemsChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{groupName}</h2>
      <div className="grid grid-cols-5 gap-4">
        {items
            .sort((a, b) => {  return a.start_time.localeCompare(b.start_time)})
            .map((item) => (
          <ScheduleCell
            key={item.id}
            item={item}
            onChange={(updatedItem) => {
              const updatedItems = items.map((i) =>
                i.id === updatedItem.id ? updatedItem : i
              );
              onItemsChange(updatedItems);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;