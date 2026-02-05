import api from './api';

// Get all tasks
const getAllTasks = () => {
    console.log("DEBUG: Calling API to get all tasks");
    return api.get('/tasks');
};

// Create a task
const createTask = (title, description, status) => {
    console.log("DEBUG: Calling API to create task", title);
    return api.post('/tasks', {
        title,
        description,
        status,
    });
};

// Update a task
const updateTask = (id, title, description, status) => {
    console.log("DEBUG: Calling API to update task", id);
    return api.put(`/tasks/${id}`, {
        title,
        description,
        status,
    });
};

// Delete a task
const deleteTask = (id) => {
    console.log("DEBUG: Calling API to delete task", id);
    return api.delete(`/tasks/${id}`);
};

const TaskService = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};

export default TaskService;
