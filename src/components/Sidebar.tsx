import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'redux/store';
import { updateBoardActive } from 'redux/boards.slice';
import { IconBoard, IconHideSidebar, IconShowSidebar, Logo } from 'assets';
import { ThemeType } from 'types';
import { Text, Button, ThemeSwitch } from 'components';
import styles from 'styles/Sidebar.module.scss';

interface Props {
  expanded: boolean;
  theme: ThemeType;
  onToggleTheme: () => void;
  onShowSidebar: () => void;
  onHideSidebar: () => void;
  onCreateBoard: () => void;
}

export default function Sidebar(props: Props) {
  const {
    expanded,
    theme,
    onToggleTheme,
    onHideSidebar,
    onShowSidebar,
    onCreateBoard,
  } = props;

  const { boards, boardActive } = useSelector((state: StoreState) => state.boards);
  const dispatch = useDispatch();

  const hiddenDiv = useRef<HTMLDivElement>(null);
  const activeBoardButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (expanded) {
      hiddenDiv.current?.focus();
    }
  }, [expanded]);

  useLayoutEffect(() => {
    activeBoardButton.current?.scrollIntoView();
  }, [boards.length]);

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
            ALL BOARDS ({boards.length})
          </Text>
          <ul className={styles['boards-list']}>
            <div className={styles['boards-scrollable']}>
              {boards.map(({ name }, i) => (
                <li key={name} className={styles['board-item']}>
                  <Button
                    ref={i === boardActive ? activeBoardButton : undefined}
                    variant="primaryL"
                    className={`${styles.button} ${
                      i === boardActive ? styles.active : ''
                    }`}
                    onClick={() => dispatch(updateBoardActive(i))}
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
