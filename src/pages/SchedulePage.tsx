import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useScheduleStore from '../store/scheduleStore';
import Header from '../components/layout/Header';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import Button from '../components/ui/Button';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ScheduleItem } from '../types';

const SchedulePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    schedule,
    isLoading,
    error,
    fetchSchedule,
    updateSchedule,
    generateSchedule,
    deleteSchedule,
    activeScheduleId
  } = useScheduleStore();
  
  const navigate = useNavigate();

  console.log("ddd", schedule)
  Object.entries(schedule.data.data).map(([groupName, items]) => {
    console.log("dd", groupName);
    console.log("dd", items);
  })
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (activeScheduleId) {
      fetchSchedule(activeScheduleId);
    }
  }, [isAuthenticated, navigate, activeScheduleId, fetchSchedule]);

  const handleGenerateSchedule = async () => {
    try {
      await generateSchedule('New Schedule');
      toast.success('Schedule generated successfully');
    } catch (error) {
      toast.error('Failed to generate schedule');
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await updateSchedule();
      toast.success('Schedule saved successfully');
    } catch (error) {
      toast.error('Failed to save schedule');
    }
  };

  const handleDeleteSchedule = async () => {
    if (!activeScheduleId) return;
    
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(activeScheduleId);
        toast.success('Schedule deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete schedule');
      }
    }
  };

  const handleItemsChange = (groupName: string, items: ScheduleItem[]) => {
    if (!schedule) return;
    
    const updatedSchedule = {
      ...schedule,
      data: {
        ...schedule.data,
        [groupName]: items
      }
    };
    
    useScheduleStore.setState({ schedule: updatedSchedule });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading schedule...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <div className="flex space-x-2">
            {!schedule && (
              <Button
                onClick={handleGenerateSchedule}
                icon={<Plus size={18} />}
              >
                Generate Schedule
              </Button>
            )}
            {schedule && (
              <>
                <Button
                  onClick={handleSaveSchedule}
                  icon={<Save size={18} />}
                >
                  Save Changes
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteSchedule}
                  icon={<Trash2 size={18} />}
                >
                  Delete Schedule
                </Button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {schedule ? (
            <div className="space-y-6">
              {Object.entries(schedule.data.data).map(([groupName, items]) => {
                // if (!Array.isArray(items)) {
                //   console.warn(`Expected array for group "${groupName}", but got`, items);
                //   return null;
                // }



                return (
                    <ScheduleGrid
                        key={groupName}
                        groupName={groupName}
                        items={items.map((item, index) => ({
                          ...item,
                          id: `${groupName}-${index}`
                        }))}
                        onItemsChange={(updatedItems) => handleItemsChange(groupName, updatedItems)}
                    />
                );
              })}
            </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">No schedule found. Generate a new schedule to get started.</p>
            <Button
              onClick={handleGenerateSchedule}
              icon={<Plus size={18} />}
            >
              Generate Schedule
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SchedulePage;