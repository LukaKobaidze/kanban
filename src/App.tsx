import { useEffect, useRef, useState, useMemo } from 'react';
import { DragDropContext, DragStart, DropResult } from 'react-beautiful-dnd';
import { ThemeType } from 'types';
import { getSubtaskInitial, getThemeInitial } from 'helpers';
import { useBoards, useLocalStorageState, useWindowDimensions } from 'hooks';
import {
  Header,
  Sidebar,
  SidebarMobile,
  Columns,
  BoardEmpty,
  EditBoard,
  ViewTask,
  EditTask,
  DeleteModal,
} from 'components';
import styles from 'styles/App.module.scss';

export default function App() {
  const { state, dispatch } = useBoards();

  const [theme, setTheme] = useLocalStorageState<ThemeType>(
    'boards-theme',
    getThemeInitial
  );
  const [windowWidth] = useWindowDimensions();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [isDeletingBoard, setIsDeletingBoard] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [draggingSourceId, setDraggingSourceId] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorageState(
    'tmanager-sidebar',
    windowWidth > 650
  );
  const columnsRef = useRef<HTMLDivElement>(null);

  const boardNames = useMemo(
    () => state.boards.map((board) => board.name),
    [state.boards]
  );
  const boardData = state.boards[state.boardActive];
  const boardStatuses = boardData && boardData.columns.map((col) => col.name);

  const handleShowSidebar = () => setSidebarExpanded(true);
  const handleHideSidebar = () => setSidebarExpanded(false);

  const handleToggleTheme = () => {
    setTheme((state) => (state === 'light' ? 'dark' : 'light'));
  };

  const handleDragStart = (data: DragStart) => {
    setDraggingSourceId(data.source.droppableId);
  };

  const handleDragEnd = ({ source, destination }: DropResult) => {
    setDraggingSourceId('');

    if (!destination) return;

    if (destination.droppableId === 'delete') {
      dispatch.onDeleteTask({ col: Number(source.droppableId), task: source.index });
    } else {
      dispatch.onReorderTask(
        { col: Number(source.droppableId), task: source.index },
        { col: Number(destination.droppableId), task: destination.index }
      );
    }
  };

  useEffect(() => {
    columnsRef.current?.scrollTo(0, 0);
  }, [state.boardActive]);

  useEffect(() => {
    const themeBefore = theme === 'light' ? 'dark' : 'light';
    document.body.classList.remove(themeBefore);
    document.body.classList.add(theme);
  }, [theme]);

  const viewTaskData =
    state.viewTaskIndex &&
    boardData &&
    boardData.columns[state.viewTaskIndex.col].tasks[state.viewTaskIndex.task];

  return (
    <>
      <Header
        windowWidth={windowWidth}
        boardName={boardData?.name || ''}
        sidebarExpanded={sidebarExpanded}
        disableAddTask={!boardData || boardData.columns.length === 0}
        onAddTask={() => setIsAddingTask(true)}
        onEditBoard={() => setIsEditingBoard(true)}
        onDeleteBoard={() => setIsDeletingBoard(true)}
        onShowSidebar={handleShowSidebar}
      />

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {windowWidth > 650 && (
          <Sidebar
            expanded={sidebarExpanded}
            boardNames={boardNames}
            boardActive={state.boardActive}
            draggingSourceId={draggingSourceId}
            theme={theme}
            setBoardActive={dispatch.setBoardActive}
            onToggleTheme={handleToggleTheme}
            onCreateBoard={() => setIsCreatingBoard(true)}
            onShowSidebar={handleShowSidebar}
            onHideSidebar={handleHideSidebar}
          />
        )}

        <main className={styles.main}>
          {boardData && boardData.columns.length !== 0 ? (
            <Columns
              ref={columnsRef}
              data={boardData.columns}
              setViewTaskIndex={dispatch.setViewTaskIndex}
              onNewColumn={() => setIsEditingBoard(true)}
            />
          ) : (
            <BoardEmpty onNewColumn={() => setIsEditingBoard(true)} />
          )}
        </main>
      </DragDropContext>

      {isCreatingBoard ? (
        <EditBoard
          boards={state.boards}
          componentHeading="Add New Board"
          btnSubmitText="Create New Board"
          onCancel={() => setIsCreatingBoard(false)}
          onSubmit={(name, columns) => {
            dispatch.onCreateBoard(name, columns);
            setIsCreatingBoard(false);
          }}
        />
      ) : isEditingBoard ? (
        <EditBoard
          boards={state.boards}
          componentHeading="Edit Board"
          btnSubmitText="Save Changes"
          onCancel={() => setIsEditingBoard(false)}
          onSubmit={(name, columns) => {
            dispatch.onEditBoard(name, columns);
            setIsEditingBoard(false);
          }}
          {...boardData}
        />
      ) : isDeletingBoard ? (
        <DeleteModal
          heading="Delete this board?"
          description={`Are you sure you want to delete the '${boardData.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
          onCancel={() => setIsDeletingBoard(false)}
          onDelete={() => {
            dispatch.onDeleteBoard();
            setIsDeletingBoard(false);
          }}
        />
      ) : isAddingTask ? (
        <EditTask
          componentHeading="Add New Task"
          allStatuses={boardStatuses}
          status={boardStatuses[0]}
          title=""
          description=""
          subtasks={[getSubtaskInitial(), getSubtaskInitial()]}
          onCancel={() => setIsAddingTask(false)}
          onSubmit={(data, status) => {
            dispatch.onAddTask(data, status);
            setIsAddingTask(false);
          }}
          btnSubmitText="Create Task"
        />
      ) : viewTaskData ? (
        isDeletingTask ? (
          <DeleteModal
            heading="Delete this task?"
            description={`Are you sure you want to delete the '${viewTaskData.title}' task and its subtasks? This action cannot be reversed.`}
            onCancel={() => setIsDeletingTask(false)}
            onDelete={() => {
              dispatch.onDeleteTask();
              setIsDeletingTask(false);
            }}
          />
        ) : isEditingTask ? (
          <EditTask
            componentHeading="Edit Task"
            status={boardData.columns[state.viewTaskIndex!.col].name}
            allStatuses={boardStatuses}
            onCancel={() => setIsEditingTask(false)}
            onSubmit={(data, status) => {
              setIsEditingTask(false);
              dispatch.onEditTask(data);
              if (status !== boardData.columns[state.viewTaskIndex!.col].name) {
                dispatch.onChangeTaskStatus(status);
              }
            }}
            btnSubmitText="Save Changes"
            {...viewTaskData}
          />
        ) : (
          <ViewTask
            status={boardData.columns[state.viewTaskIndex!.col].name}
            allStatuses={boardStatuses}
            onDelete={() => setIsDeletingTask(true)}
            onEdit={() => setIsEditingTask(true)}
            onChangeStatus={dispatch.onChangeTaskStatus}
            onChangeSubtaskCompleted={dispatch.onChangeSubtaskCompleted}
            onCloseModal={() => dispatch.setViewTaskIndex(null)}
            {...viewTaskData}
          />
        )
      ) : (
        windowWidth <= 650 &&
        sidebarExpanded &&
        !isCreatingBoard && (
          <SidebarMobile
            theme={theme}
            boardNames={boardNames}
            boardActive={state.boardActive}
            setBoardActive={dispatch.setBoardActive}
            onHideSidebar={handleHideSidebar}
            onToggleTheme={handleToggleTheme}
            onCreateBoard={() => setIsCreatingBoard(true)}
          />
        )
      )}
    </>
  );
}
