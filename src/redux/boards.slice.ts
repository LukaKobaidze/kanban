import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardType, TaskLocation, TaskType } from 'types';
import { boards as boardsInitial } from 'data';

const initialState: {
  boards: BoardType[];
  boardActive: number;
  taskActive: TaskLocation | null;
} = JSON.parse(localStorage.getItem('reduxBoards') || '0') || {
  boards: boardsInitial,
  boardActive: 0,
  taskActive: null,
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,

  reducers: {
    updateBoardActive: (state, action: PayloadAction<number>) => {
      state.boardActive = action.payload;
    },

    updateTaskActive: (state, action: PayloadAction<TaskLocation | null>) => {
      state.taskActive = action.payload;
    },

    createBoard: (state, action: PayloadAction<BoardType>) => {
      state.boardActive = state.boards.length;
      state.boards.push(action.payload);
    },

    editBoard: (state, action: PayloadAction<BoardType>) => {
      state.boards[state.boardActive] = action.payload;
    },

    deleteBoard: (state) => {
      state.boards.splice(state.boardActive, 1);
      state.boardActive = Math.min(state.boardActive, state.boards.length - 1);
    },

    createTask: (
      state,
      action: PayloadAction<{ data: TaskType; status: string }>
    ) => {
      const columns = state.boards[state.boardActive].columns;

      const columnIndex = columns.findIndex((col) => {
        return col.name === action.payload.status;
      });

      columns[columnIndex].tasks.push(action.payload.data);
    },

    editTask: (
      state,
      action: PayloadAction<{ edited: TaskType; status: string }>
    ) => {
      if (!state.taskActive) return;

      const columns = state.boards[state.boardActive].columns;
      const columnCurrent = columns[state.taskActive.col];

      columnCurrent.tasks[state.taskActive.task] = action.payload.edited;

      if (columnCurrent.name !== action.payload.status) {
        boardsSlice.caseReducers.changeTaskStatus(state, {
          type: 'boards/changeTaskStatus',
          payload: action.payload.status,
        });
      }
    },

    changeTaskStatus: (state, action: PayloadAction<string>) => {
      if (!state.taskActive) return;

      const columns = state.boards[state.boardActive].columns;

      const [task] = columns[state.taskActive.col].tasks.splice(
        state.taskActive.task,
        1
      );

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.name === action.payload) {
          state.taskActive = { col: i, task: col.tasks.length };
          col.tasks.push(task);
        }
      }
    },

    deleteTask: (state, action: PayloadAction<TaskLocation | undefined>) => {
      const remove = action?.payload || state.taskActive;

      if (!remove) return;

      state.boards[state.boardActive].columns[remove.col].tasks.splice(
        remove.task,
        1
      );
      state.taskActive = null;
    },

    updateSubtaskCompleted: (
      state,
      action: PayloadAction<{ subtask: number; isCompleted: boolean }>
    ) => {
      if (!state.taskActive) return;

      state.boards[state.boardActive].columns[state.taskActive.col].tasks[
        state.taskActive.task
      ].subtasks[action.payload.subtask].isCompleted = action.payload.isCompleted;
    },

    reorderTask: (
      state,
      action: PayloadAction<{ from: TaskLocation; to: TaskLocation }>
    ) => {
      const { from, to } = action.payload;
      const columns = state.boards[state.boardActive].columns;

      const [taskReordered] = columns[from.col].tasks.splice(from.task, 1);

      columns[to.col].tasks.splice(to.task, 0, taskReordered);
    },
  },
});

export const {
  updateBoardActive,
  updateTaskActive,
  createBoard,
  editBoard,
  deleteBoard,
  createTask,
  editTask,
  changeTaskStatus,
  deleteTask,
  updateSubtaskCompleted,
  reorderTask,
} = boardsSlice.actions;

export default boardsSlice.reducer;
