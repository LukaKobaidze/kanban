import { useEffect, useMemo, useRef, useState } from 'react';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Column from 'components/Column';
import ViewTask from 'components/ViewTask';
import styles from 'styles/App.module.scss';
import { useBoards } from 'hooks';

export default function App() {
  const {
    boards,
    boardActive,
    viewTaskIndex,
    setViewTaskIndex,
    setBoardActive,
    onChangeSubtaskCompleted,
    onChangeTaskStatus,
  } = useBoards();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const columnsWrapperRef = useRef<HTMLDivElement>(null);

  const handleShowSidebar = () => setSidebarExpanded(true);
  const handleHideSidebar = () => setSidebarExpanded(false);
  const handleCreateNewBoard = () => {};

  const boardNames = useMemo(() => boards.map((board) => board.name), [boards]);
  const boardData = boards[boardActive];
  const boardStatuses = boardData.columns.map((col) => col.name);

  useEffect(() => {
    columnsWrapperRef.current?.scrollTo(0, 0);
  }, [boardActive]);

  const viewTaskData =
    viewTaskIndex && boardData.columns[viewTaskIndex.col].tasks[viewTaskIndex.task];
  return (
    <>
      <Header
        boardName={boardNames[boardActive]}
        sidebarExpanded={sidebarExpanded}
      />
      <Sidebar
        expanded={sidebarExpanded}
        boards={boardNames}
        boardActive={boardActive}
        setBoardActive={setBoardActive}
        onShowSidebar={handleShowSidebar}
        onHideSidebar={handleHideSidebar}
        onCreateNewBoard={handleCreateNewBoard}
      />
      <main className={styles.main}>
        <div className={styles.columns} ref={columnsWrapperRef}>
          {boardData.columns.map((columnData, i) => (
            <Column
              key={columnData.name}
              index={i}
              setViewTaskIndex={setViewTaskIndex}
              {...columnData}
            />
          ))}
          <button className={styles['new-column']}>+ New Column</button>
        </div>
      </main>

      {viewTaskData && (
        <ViewTask
          allStatuses={boardStatuses}
          onCloseModal={() => setViewTaskIndex(null)}
          onChangeSubtaskCompleted={onChangeSubtaskCompleted}
          onChangeTaskStatus={onChangeTaskStatus}
          {...viewTaskData}
          status={boardData.columns[viewTaskIndex.col].name}
        />
      )}
    </>
  );
}
