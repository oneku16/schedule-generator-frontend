// src/pages/SchedulePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useScheduleStore from '../store/scheduleStore';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Calendar, Plus } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { schedule, isLoading, error, fetchSchedule, activeScheduleId } = useScheduleStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeScheduleId) {
      fetchSchedule(activeScheduleId);
    }
    else {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, activeScheduleId, fetchSchedule]);

  if (!schedule) {
    return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-center items-center h-64">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                      <p className="mt-3 text-lg text-gray-600">Loading schedule...</p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={() => navigate('/dashboard')}>
                        Return to Dashboard
                      </Button>
                    </div>
                ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <Calendar className="h-12 w-12 text-blue-600 mx-auto" />
                        <h2 className="mt-2 text-xl font-semibold text-gray-900">No Schedule Found</h2>
                        <p className="mt-1 text-gray-500">Generate a new schedule to get started</p>
                      </div>
                      <Button
                          onClick={() => navigate('/dashboard')}
                          icon={<Plus size={18} />}
                      >
                        Generate Schedule
                      </Button>
                    </div>
                )}
              </div>
            </div>
          </main>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{schedule.data.schedule_name}</h1>
            </div>

            <div className="space-y-6">
              {Object.entries(schedule.data).map(([groupName, lectures]) => (
                  <div key={groupName} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 border-b bg-blue-50">
                      <h3 className="text-lg font-bold text-gray-800">{groupName}</h3>
                    </div>
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Day</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Room</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lectures.map((lecture, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{lecture.subject}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{lecture.day}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {lecture.start_time} - {lecture.end_time}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{lecture.room}</td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </main>
      </div>
  );
};

export default SchedulePage;
