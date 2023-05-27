import { useEffect, useLayoutEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import {
  IconBoard,
  IconDelete,
  IconHideSidebar,
  IconShowSidebar,
  Logo,
} from 'assets';
import { ThemeType } from 'types';
import { Text, Button, ThemeSwitch } from 'components';
import styles from 'styles/Sidebar.module.scss';

interface Props {
  expanded: boolean;
  boardNames: string[];
  boardActive: number;
  draggingSourceId: string;
  theme: ThemeType;
  setBoardActive: React.Dispatch<React.SetStateAction<number>>;
  onToggleTheme: () => void;
  onShowSidebar: () => void;
  onHideSidebar: () => void;
  onCreateBoard: () => void;
}

export default function Sidebar(props: Props) {
  const {
    expanded,
    boardNames,
    boardActive,
    draggingSourceId,
    theme,
    setBoardActive,
    onToggleTheme,
    onHideSidebar,
    onShowSidebar,
    onCreateBoard,
  } = props;

  const hiddenDiv = useRef<HTMLDivElement>(null);
  const activeBoardButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (expanded) {
      hiddenDiv.current?.focus();
    }
  }, [expanded]);

  useLayoutEffect(() => {
    activeBoardButton.current?.scrollIntoView();
  }, [boardNames]);

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.open : ''}`}>
      <div className={styles.content}>
        {/* Focus on invisible div (when sidebar expanded) for keyboard navigation */}
        <div tabIndex={-1} ref={hiddenDiv} />

        <div className={styles['logo-wrapper']}>
          <Logo />
        </div>

        <div className={styles['boards-wrapper']}>
          <Text tag="p" variant="M" className={styles['text-allboards']}>
            ALL BOARDS ({boardNames.length})
          </Text>
          <ul className={styles['boards-list']}>
            <div className={styles['boards-scrollable']}>
              {boardNames.map((name, i) => (
                <li key={name} className={styles['board-item']}>
                  <Button
                    ref={i === boardActive ? activeBoardButton : undefined}
                    variant="primaryL"
                    className={`${styles.button} ${
                      i === boardActive ? styles.active : ''
                    }`}
                    onClick={() => setBoardActive(i)}
                    disabled={!expanded}
                  >
                    <IconBoard className={styles['button__icon']} />
                    <span className={styles['button__text']}>{name}</span>
                  </Button>
                </li>
              ))}
            </div>
            <li className={styles['board-item']}>
              <button
                className={`${styles.button} ${styles['button--create']}`}
                onClick={onCreateBoard}
                disabled={!expanded}
              >
                <IconBoard className={styles['button__icon']} />
                <span>+ Create New Board</span>
              </button>
            </li>
          </ul>
        </div>
        <Droppable droppableId="delete">
          {(provided, snapshot) => (
            <div
              className={`${styles['droppable-delete']} ${
                draggingSourceId ? styles.show : ''
              } ${snapshot.isDraggingOver ? styles.dragover : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <IconDelete className={styles['droppable-delete__icon']} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <ThemeSwitch
          on={theme === 'dark'}
          onToggle={onToggleTheme}
          disabled={!expanded}
          className={styles['theme-switch']}
        />

        <button
          onClick={onHideSidebar}
          className={`${styles.button} ${styles['btn-hide-sidebar']}`}
          disabled={!expanded}
        >
          <IconHideSidebar className={styles['button__icon']} />
          <span>Hide Sidebar</span>
        </button>
      </div>

      <button
        className={styles['btn-show']}
        onClick={onShowSidebar}
        tabIndex={expanded ? -1 : undefined}
      >
        <Text tag="span" variant="L">
          Show Sidebar
        </Text>
        <IconShowSidebar className={styles['btn-show__icon']} />
      </button>
    </aside>
  );
}
