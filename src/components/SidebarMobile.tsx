import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'redux/store';
import { updateBoardActive } from 'redux/boards.slice';
import { ThemeType } from 'types';
import { IconBoard } from 'assets';
import { Modal, ThemeSwitch, Text, Button } from 'components';
import sidebarStyles from 'styles/Sidebar.module.scss';
import styles from 'styles/SidebarMobile.module.scss';

interface Props {
  theme: ThemeType;
  onToggleTheme: () => void;
  onHideSidebar: () => void;
  onCreateBoard: () => void;
}

export default function SidebarMobile(props: Props) {
  const { theme, onToggleTheme, onHideSidebar, onCreateBoard } = props;

  const { boards, boardActive } = useSelector((state: StoreState) => state.boards);
  const dispatch = useDispatch();

  return (
    <Modal
      initialFocus={false}
      onCloseModal={onHideSidebar}
      className={styles.container}
    >
      <Text tag="p" variant="M" className={sidebarStyles['text-allboards']}>
        ALL BOARDS ({boards.length})
      </Text>
      <ul className={styles['boards-list']}>
        <div className={styles['boards-scrollable']}>
          {boards.map(({ name }, i) => (
            <li key={name} className={sidebarStyles['board-item']}>
              <Button
                variant="primaryL"
                className={`${sidebarStyles.button} ${
                  i === boardActive ? sidebarStyles.active : ''
                }`}
                onClick={() => {
                  dispatch(updateBoardActive(i));
                  onHideSidebar();
                }}
              >
                <IconBoard className={sidebarStyles['button__icon']} />
                <span className={sidebarStyles['button__text']}>{name}</span>
              </Button>
            </li>
          ))}
        </div>
        <li className={sidebarStyles['board-item']}>
          <button
            className={`${sidebarStyles.button} ${sidebarStyles['button--create']}`}
            onClick={onCreateBoard}
          >
            <IconBoard className={sidebarStyles['button__icon']} />
            <span>+ Create New Board</span>
          </button>
        </li>
      </ul>
      <ThemeSwitch
        on={theme === 'dark'}
        onToggle={onToggleTheme}
        className={styles['theme-switch']}
      />
    </Modal>
  );
}
