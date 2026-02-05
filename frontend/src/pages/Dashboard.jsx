import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskService from '../services/task.service';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

// Dashboard function component
function Dashboard() {
    console.log("DEBUG: Dashboard component is rendering");

    // State for storing tasks
    const [tasks, setTasks] = useState([]);

    // State for managing the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for storing the task currently being edited
    const [editingTask, setEditingTask] = useState(null);

    const navigate = useNavigate();

    // Effect to check if user is logged in
    useEffect(() => {
        console.log("DEBUG: Checking if user is logged in");
        const user = AuthService.getCurrentUser();

        if (!user) {
            console.log("DEBUG: No user found, redirecting to login");
            navigate('/login');
            return;
        }

        // If user exists, get the tasks
        getTasksFromBackend();
    }, [navigate]);

    // Function to get tasks from the server
    const getTasksFromBackend = async () => {
        console.log("DEBUG: Fetching tasks from backend...");
        try {
            const response = await TaskService.getAllTasks();
            console.log("DEBUG: Tasks received:", response.data);

            // Check if data is array
            if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else {
                setTasks([]);
            }

        } catch (error) {
            console.error("ERROR: Failed to fetch tasks", error);

            // If unauthorized, logout
            if (error.response && error.response.status === 401) {
                console.log("DEBUG: Unauthorized access, logging out");
                AuthService.logout();
                navigate('/login');
            }
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            if (editingTask) {
                console.log("DEBUG: Updating existing task", editingTask.id);
                await TaskService.updateTask(editingTask.id, taskData.title, taskData.description, taskData.status);
            } else {
                console.log("DEBUG: Creating new task");
                await TaskService.createTask(taskData.title, taskData.description, taskData.status);
            }
            // Refresh list
            getTasksFromBackend();
            setEditingTask(null);
        } catch (error) {
            console.error("ERROR: Failed to save task", error);
        }
    };

    const handleEditClick = (task) => {
        console.log("DEBUG: Edit clicked for task", task.id);
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        console.log("DEBUG: Delete clicked for task", id);
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await TaskService.deleteTask(id);
                getTasksFromBackend();
            } catch (error) {
                console.error("ERROR: Failed to delete task", error);
            }
        }
    };

    // Change the status of a task
    const handleStatusChange = async (task, newStatus) => {
        console.log("DEBUG: Changing status of task", task.id, "to", newStatus);
        try {
            await TaskService.updateTask(task.id, task.title, task.description, newStatus);
            getTasksFromBackend();
        } catch (error) {
            console.error("ERROR: Failed to update status", error);
        }
    };

    const openNewTaskModal = () => {
        console.log("DEBUG: Opening new task modal");
        setEditingTask(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <button
                            onClick={openNewTaskModal}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add New Task
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['PENDING', 'IN_PROGRESS', 'DONE'].map((status) => (
                            <div key={status} className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{status.replace('_', ' ').toLowerCase()}</h2>
                                {(!tasks || tasks.filter(t => t.status === status).length === 0) ? (
                                    <div className="text-gray-400 text-sm text-center italic py-4">No tasks</div>
                                ) : (
                                    tasks
                                        .filter((task) => task.status === status)
                                        .map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onEdit={handleEditClick}
                                                onDelete={handleDeleteClick}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                )}
                            </div>
                        ))}
                    </div>
                </div>


            </div>

            <TaskForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                initialData={editingTask}
            />
        </div >
    );
};

export default Dashboard;
