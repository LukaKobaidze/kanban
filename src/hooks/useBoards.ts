import { useState } from 'react';
import { boards as boardsInitial } from 'data';

export default function useBoards() {
  const [boards, setBoards] = useState(boardsInitial);
  const [boardActive, setBoardActive] = useState(0);
  const [viewTaskIndex, setViewTaskIndex] = useState<{
    col: number;
    task: number;
  } | null>(null);

  const onChangeSubtaskCompleted = (subtaskIndex: number, isCompleted: boolean) => {
    if (!viewTaskIndex) return;

    setBoards((state) => {
      const colIndex = viewTaskIndex.col;
      const taskIndex = viewTaskIndex.task;
      const cols = state[boardActive].columns;
      const tasks = cols[colIndex].tasks;
      const subtasks = tasks[taskIndex].subtasks;

      return [
        // BOARDS
        ...state.slice(0, boardActive),
        {
          ...state[boardActive],

          // COLUMNS
          columns: [
            ...cols.slice(0, colIndex),
            {
              ...cols[colIndex],

              // TASKS
              tasks: [
                ...tasks.slice(0, taskIndex),
                {
                  ...tasks[taskIndex],

                  // SUBTASKS
                  subtasks: [
                    ...subtasks.slice(0, subtaskIndex),
                    { ...subtasks[subtaskIndex], isCompleted },
                    ...subtasks.slice(subtaskIndex + 1),
                  ],
                },
                ...tasks.slice(taskIndex + 1),
              ],
            },
            ...cols.slice(colIndex + 1),
          ],
        },
        ...state.slice(boardActive + 1),
      ];
    });
  };

  const onChangeTaskStatus = (status: string) => {
    if (!viewTaskIndex) return;

    setBoards((state) => {
      const columns = state[boardActive].columns;
      const tasksChangingFrom = [
        ...(state[boardActive].columns.find((_, i) => i === viewTaskIndex.col)
          ?.tasks || []),
      ];
      if (tasksChangingFrom.length === 0) return state;
      const [taskData] = tasksChangingFrom.splice(viewTaskIndex.task, 1);

      return [
        ...state.slice(0, boardActive),
        {
          ...state[boardActive],
          columns: columns.map((col, i) => {
            if (i === viewTaskIndex.col) {
              return {
                ...col,
                tasks: tasksChangingFrom,
              };
            }
            if (col.name === status) {
              setViewTaskIndex({ col: i, task: col.tasks.length });
              return {
                ...col,
                tasks: [...col.tasks, taskData],
              };
            }

            return col;
          }),
        },
        ...state.slice(boardActive + 1),
      ];
    });
  };

  return {
    boards,
    boardActive,
    viewTaskIndex,
    setBoardActive,
    setViewTaskIndex,
    onChangeSubtaskCompleted,
    onChangeTaskStatus,
  };
}
