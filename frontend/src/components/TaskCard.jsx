import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        DONE: 'bg-green-100 text-green-800',
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 mb-4">
            <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status] || 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {task.status}
                </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{task.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                    <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task, e.target.value)}
                        className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
