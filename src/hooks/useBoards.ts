import { useState } from 'react';
import { ColumnType, TaskIndexType, TaskType } from 'types';
import { boards as boardsInitial } from 'data';
import { useLocalStorageState } from 'hooks';

export default function useBoards() {
  const [boards, setBoards] = useState(boardsInitial);
  const [boardActive, setBoardActive] = useLocalStorageState('board-active', 0);
  const [viewTaskIndex, setViewTaskIndex] = useState<TaskIndexType | null>(null);

  const onCreateBoard = (name: string, columns: ColumnType[]) => {
    setBoards((state) => {
      setBoardActive(state.length);
      return [...state, { name, columns }];
    });
  };

  const onEditBoard = (name: string, columns: ColumnType[]) => {
    setBoards((state) => [
      ...state.slice(0, boardActive),
      { name, columns },
      ...state.slice(boardActive + 1),
    ]);
  };

  const onDeleteBoard = () => {
    setBoards((state) => {
      setBoardActive(Math.max(0, boardActive - 1));
      return [...state.slice(0, boardActive), ...state.slice(boardActive + 1)];
    });
  };

  const onAddTask = (data: TaskType, status: string) => {
    setBoards((state) => {
      const columns = state[boardActive].columns;

      return [
        ...state.slice(0, boardActive),
        {
          ...state[boardActive],
          columns: columns.map((col) => {
            if (col.name !== status) return col;

            return {
              ...col,
              tasks: [...col.tasks, data],
            };
          }),
        },
        ...state.slice(boardActive + 1),
      ];
    });
  };

  const onEditTask = (data: TaskType) => {
    if (!viewTaskIndex) return;

    setBoards((state) => {
      const columns = state[boardActive].columns;
      const tasks = state[boardActive].columns[viewTaskIndex.col].tasks;

      return [
        ...state.slice(0, boardActive),
        {
          ...state[boardActive],
          columns: [
            ...columns.slice(0, viewTaskIndex.col),
            {
              ...columns[viewTaskIndex.col],
              tasks: [
                ...tasks.slice(0, viewTaskIndex.task),
                data,
                ...tasks.slice(viewTaskIndex.task + 1),
              ],
            },
            ...columns.slice(viewTaskIndex.col + 1),
          ],
        },
        ...state.slice(boardActive + 1),
      ];
    });
  };

  const onDeleteTask = (argIndexes?: TaskIndexType) => {
    const indexes = argIndexes || viewTaskIndex;

    if (!indexes) return;

    setBoards((state) => {
      const columns = state[boardActive].columns;
      const tasks = state[boardActive].columns[indexes.col].tasks;

      return [
        ...state.slice(0, boardActive),
        {
          ...state[boardActive],
          columns: [
            ...columns.slice(0, indexes.col),
            {
              ...columns[indexes.col],
              tasks: [
                ...tasks.slice(0, indexes.task),
                ...tasks.slice(indexes.task + 1),
              ],
            },
            ...columns.slice(indexes.col + 1),
          ],
        },

        ...state.slice(boardActive + 1),
      ];
    });
    setViewTaskIndex(null);
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

  const onReorderTask = (from: TaskIndexType, to: TaskIndexType) => {
    if (from.col === to.col && from.task === to.task) return;

    setBoards((state) => {
      const columns = [...state[boardActive].columns];
      const fromTasks = [...columns[from.col].tasks];
      const [reorderedItem] = fromTasks.splice(from.task, 1);

      if (from.col === to.col) {
        fromTasks.splice(to.task, 0, reorderedItem);
      } else {
        const toTasks = [...columns[to.col].tasks];
        toTasks.splice(to.task, 0, reorderedItem);
        columns[to.col].tasks = toTasks;
      }
      columns[from.col].tasks = fromTasks;

      return [
        ...state.slice(0, boardActive),
        { ...state[boardActive], columns },
        ...state.slice(boardActive + 1),
      ];
    });
  };

  return {
    state: {
      boards,
      boardActive,
      viewTaskIndex,
    },
    dispatch: {
      setBoardActive,
      setViewTaskIndex,
      onCreateBoard,
      onEditBoard,
      onDeleteBoard,
      onAddTask,
      onEditTask,
      onDeleteTask,
      onChangeTaskStatus,
      onChangeSubtaskCompleted,
      onReorderTask,
    },
  };
}
