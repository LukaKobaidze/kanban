import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from 'redux/store';
import { ModalType } from 'types';
import { useLocalStorageState, useTheme, useWindowDimensions } from 'hooks';
import { Header, Sidebar, Columns, AppModals, SidebarMobile } from 'components';
import styles from 'styles/App.module.scss';

export default function App() {
  const { boards, boardActive, taskActive } = useSelector(
    (state: StoreState) => state.boards
  );
  const { theme, onToggleTheme } = useTheme();
  const [windowWidth] = useWindowDimensions();
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorageState(
    'taskmanagement-sidebar',
    windowWidth > 650
  );

  useEffect(() => {
    document.title = `${boards[boardActive].name} | Kanban Task Management`;
  }, [boards, boardActive]);

  return (
    <>
      <Header
        windowWidth={windowWidth}
        sidebarExpanded={sidebarExpanded}
        onAddTask={() => setShowModal('addTask')}
        onEditBoard={() => setShowModal('editBoard')}
        onDeleteBoard={() => setShowModal('deleteBoard')}
        onShowSidebar={() => setSidebarExpanded(true)}
      />

      {windowWidth > 650 && (
        <Sidebar
          expanded={sidebarExpanded}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onCreateBoard={() => setShowModal('createBoard')}
          onShowSidebar={() => setSidebarExpanded(true)}
          onHideSidebar={() => setSidebarExpanded(false)}
        />
      )}

      <main className={styles.main}>
        <Columns onNewColumn={() => setShowModal('editBoard')} />
      </main>

      {sidebarExpanded && windowWidth <= 650 && !showModal && !taskActive ? (
        <SidebarMobile
          theme={theme}
          onCreateBoard={() => setShowModal('createBoard')}
          onHideSidebar={() => setSidebarExpanded(false)}
          onToggleTheme={onToggleTheme}
        />
      ) : (
        <AppModals showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
}
