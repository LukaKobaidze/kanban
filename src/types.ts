export type TaskType = {
  title: string;
  description: string;
  subtasks: {
    title: string;
    isCompleted: boolean;
  }[];
};

export type ColumnType = {
  name: string;
  color: string;
  tasks: TaskType[];
};
