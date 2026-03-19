import React, { useCallback, useEffect, useState } from 'react'
import { baseControlClasses, DEFAULT_TASK } from '../assets/dummy'
import { AlignLeft, Calendar, CheckCircle, Flag, PlusCircle, Save, X } from 'lucide-react'
import { PRIMARY_BUTTON } from '../assets/dummy'

const API_BASE = 'http://localhost:4000/api/tasks'

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
    const [taskData, setTaskData] = useState(DEFAULT_TASK)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!isOpen) return;
        if (taskToEdit) {
            const normalized = taskToEdit.completed === 'Yes' || taskToEdit.completed === true ? 'Yes' : 'No';
            setTaskData({
                ...DEFAULT_TASK,
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                priority: taskToEdit.priority || 'Low',
                dueDate: taskToEdit.dueDate?.split('T')[0] || '',
                completed: normalized,
                id: taskToEdit._id,
            });
        } else {
            setTaskData(DEFAULT_TASK);
        }
        setError(null);
    }, [isOpen, taskToEdit]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (taskData.dueDate < today) {
            setError("Due Date cannot be in the past");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const isEdit = Boolean(taskData.id);
            const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`;
            const resp = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: getHeaders(),
                body: JSON.stringify(taskData)
            });

            if (!resp.ok) {
                if (resp.status === 401) return onLogout?.();
                const err = await resp.json();
                throw new Error(err.message || 'Failed to save task');
            }

            const saved = await resp.json();
            onSave?.(saved);
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred while saving the task');
        } finally {
            setLoading(false);
        }
    }, [taskData, today, getHeaders, onSave, onClose, onLogout]);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/60 z-50 flex items-center justify-center p-4'>
            <div className='bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full shadow-2xl relative p-6 text-white animate-fadeIn'>

                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                        {taskData.id ? <Save className='text-[#1FA2FF] w-5 h-5' /> :
                            <PlusCircle className='text-[#1FA2FF] w-5 h-5' />}
                        {taskData.id ? 'Edit Task' : 'Add New Task'}
                    </h2>

                    <button onClick={onClose} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-200">
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>

                    {/* Error */}
                    {error && (
                        <div className='bg-red-900/30 border border-red-500 text-red-300 text-sm rounded-lg p-2'>
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-1'>Task Title</label>
                        <div className='flex items-center border border-gray-700 bg-gray-800 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500'>
                            <input
                                type="text"
                                name="title"
                                required
                                value={taskData.title}
                                onChange={handleChange}
                                className='w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm'
                                placeholder='Enter Task Title'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className='flex items-center gap-1 text-sm font-medium text-gray-300 mb-1'>
                            <AlignLeft className='w-4 h-4 text-[#1FA2FF]' />
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            onChange={handleChange}
                            value={taskData.description}
                            className={`${baseControlClasses} bg-gray-800 text-white border-gray-700 placeholder-gray-400`}
                            placeholder='Add Details About Your Tasks'
                        />
                    </div>

                    {/* Priority + Date */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='flex items-center gap-1 text-sm font-medium text-gray-300 mb-1'>
                                <Flag className='w-4 h-4 text-[#1FA2FF]' />
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={taskData.priority}
                                onChange={handleChange}
                                className='bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2'
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div>
                            <label className='flex items-center gap-1 text-sm font-medium text-gray-300 mb-1'>
                                <Calendar className='w-4 h-4 text-[#1FA2FF]' />
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                min={today}
                                value={taskData.dueDate}
                                onChange={handleChange}
                                className={`${baseControlClasses} bg-gray-800 text-white border-gray-700`}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className='flex items-center gap-1 text-sm font-medium text-gray-300 mb-2'>
                            <CheckCircle className='w-4 h-4 text-[#1FA2FF]' />
                            Status
                        </label>
                        <div className='flex gap-4'>
                            {[{ val: 'Yes', label: 'Completed' },
                            { val: 'No', label: 'In Progress' }
                            ].map(({ val, label }) => (
                                <label key={val} className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='completed'
                                        value={val}
                                        checked={taskData.completed === val}
                                        onChange={handleChange}
                                        className='h-4 w-4 text-[#1FA2FF] focus:ring-[#1FA2FF] border-gray-600 bg-gray-800'
                                    />
                                    <span className='ml-2 text-sm text-gray-300'>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full ${PRIMARY_BUTTON}`}
                    >
                        {loading ? 'Saving ...' : (
                            taskData.id ? <>
                                <Save className='w-4 h-4' /> Update task
                            </> : <>
                                <PlusCircle className='w-4 h-4' /> Create task
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TaskModal