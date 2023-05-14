import {
  IconBoard,
  IconDarkTheme,
  IconHideSidebar,
  IconLightTheme,
  IconShowSidebar,
  LogoLight,
} from 'assets';
import styles from 'styles/Sidebar.module.scss';
import Text from './Text';
import Switch from './Switch';
import { useEffect, useRef } from 'react';

interface Props {
  expanded: boolean;
  boards: string[];
  boardActive: number;
  setBoardActive: React.Dispatch<React.SetStateAction<number>>;
  onShowSidebar: () => void;
  onHideSidebar: () => void;
  onCreateNewBoard: () => void;
}

export default function Sidebar(props: Props) {
  const {
    expanded,
    boards,
    boardActive,
    setBoardActive,
    onHideSidebar,
    onShowSidebar,
    onCreateNewBoard,
  } = props;

  const hiddenDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      hiddenDiv.current?.focus();
    }
  }, [expanded]);

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.open : ''}`}>
      <div className={styles.content}>
        {/* Focus on invisible div to make keyboard navigation easier */}
        <div tabIndex={-1} ref={hiddenDiv} />

        <div className={styles['logo-wrapper']}>
          <LogoLight />
        </div>

        <div>
          <Text tag="p" variant="M" className={styles['text-allboards']}>
            ALL BOARDS ({boards.length})
          </Text>
          <ul>
            {boards.map((name, i) => (
              <li key={name} className={styles['board-item']}>
                <button
                  className={`${styles.button} ${
                    i === boardActive ? styles.active : ''
                  }`}
                  onClick={() => setBoardActive(i)}
                  disabled={!expanded}
                >
                  <IconBoard className={styles['button__icon']} />
                  <span>{name}</span>
                </button>
              </li>
            ))}
            <li className={styles['board-item']}>
              <button
                className={`${styles.button} ${styles['button--create']}`}
                disabled={!expanded}
              >
                <IconBoard className={styles['button__icon']} />{' '}
                <span>+ Create New Board</span>
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.theme}>
          <IconLightTheme />
          <Switch on={true} disabled={!expanded} />
          <IconDarkTheme />
        </div>
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
