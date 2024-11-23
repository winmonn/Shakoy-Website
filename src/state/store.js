import create from 'zustand';

const useStore = create((set) => ({
  users: [],
  tasks: [],
  categories: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  // Add more actions as needed
}));

export default useStore;
