import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useScheduleStore from '../store/scheduleStore';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { 
    schedule, 
    isLoading, 
    error, 
    generateSchedule, 
    deleteSchedule,
    activeScheduleId
  } = useScheduleStore();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleGenerateSchedule = async () => {
    try {
      await generateSchedule();
      toast.success('New schedule generated!');
      navigate('/schedule');
    } catch (error) {
      // Error handled in store
    }
  };
  
  const handleDeleteSchedule = async () => {
    if (!activeScheduleId) return;
    
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(activeScheduleId);
        toast.success('Schedule deleted');
      } catch (error) {
        // Error handled in store
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-2">
              <Button
                onClick={handleGenerateSchedule}
                isLoading={isLoading}
                icon={<Plus size={18} />}
              >
                Generate Schedule
              </Button>
              
              {activeScheduleId && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/schedule')}
                  icon={<Calendar size={18} />}
                >
                  View Schedule
                </Button>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Schedule Management
              </h3>
              
              <div className="mt-5">
                <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex sm:items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {activeScheduleId 
                          ? 'Current Schedule'
                          : 'No Active Schedule'}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {activeScheduleId
                          ? `Schedule ID: ${activeScheduleId}`
                          : 'Generate a new schedule to get started'}
                      </p>
                    </div>
                  </div>
                  
                  {activeScheduleId && (
                    <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteSchedule}
                        icon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900 mb-3">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-blue-800">
                          Generate a new schedule
                        </h5>
                        <p className="mt-1 text-sm text-blue-700">
                          Create a new schedule structure for your cohorts
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-teal-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-teal-800">
                          Edit and arrange lectures
                        </h5>
                        <p className="mt-1 text-sm text-teal-700">
                          Drag and drop lectures to rearrange your schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;