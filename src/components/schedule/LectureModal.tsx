import React, { useState, useEffect } from 'react';
import { Lecture } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X } from 'lucide-react';

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lecture: Lecture) => void;
  lecture?: Lecture | null;
  mode: 'create' | 'edit';
}

const LectureModal: React.FC<LectureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lecture,
  mode
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState('');
  
  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
      setDescription(lecture.description || '');
      setInstructor(lecture.instructor || '');
      setColor(lecture.color || '');
    } else {
      // Reset form for new lecture
      setTitle('');
      setDescription('');
      setInstructor('');
      setColor('');
    }
  }, [lecture, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedLecture: Lecture = {
      id: lecture?.id || `lecture_${Date.now()}`,
      title,
      description: description || undefined,
      instructor: instructor || undefined,
      color: color || undefined
    };
    
    onSave(updatedLecture);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Add Lecture' : 'Edit Lecture'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="space-y-4">
                <Input
                  label="Title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lecture title"
                  required
                />
                
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the lecture"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <Input
                  label="Instructor"
                  id="instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Name of instructor"
                />
                
                <div className="space-y-2">
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="color"
                      value={color || '#e5edff'}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-8 w-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#e5edff"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Add Lecture' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LectureModal;