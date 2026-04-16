import { useTaskStore } from '../store/taskStore';

export function useTasks() {
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    addTask, 
    updateTaskStatus, 
    deleteTask 
  } = useTaskStore();

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
