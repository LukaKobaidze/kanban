import { columnColors } from 'data';

export type BoardType = { name: string; columns: ColumnType[] };

export type ColumnColorType = (typeof columnColors)[number];

export type SubtaskType = {
  title: string;
  isCompleted: boolean;
};

export type TaskType = {
  title: string;
  description: string;
  subtasks: SubtaskType[];
};

export type ColumnType = {
  name: string;
  color: ColumnColorType;
  tasks: TaskType[];
};

export type TaskLocation = {
  col: number;
  task: number;
};

export type ThemeType = 'light' | 'dark';

export type ModalType =
  | 'createBoard'
  | 'editBoard'
  | 'deleteBoard'
  | 'addTask'
  | 'editTask'
  | 'deleteTask'
  | null;
