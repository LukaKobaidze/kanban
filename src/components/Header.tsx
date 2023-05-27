import { useState } from 'react';
import {
  IconAddTaskMobile,
  IconChevronDown,
  IconVerticalEllipsis,
  Logo,
  LogoMobile,
} from 'assets';
import { Heading, Button, Dropdown, Popup, Text } from 'components';
import headingStyles from 'styles/Heading.module.scss';
import styles from 'styles/Header.module.scss';

const ACTIONS = {
  DELETE: 'Delete Board',
  EDIT: 'Edit Board',
};

interface Props {
  windowWidth: number;
  boardName: string;
  sidebarExpanded: boolean;
  disableAddNewTask: boolean;
  onAddTask: () => void;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
  onShowSidebar: () => void;
}

export default function Header(props: Props) {
  const {
    windowWidth,
    boardName,
    sidebarExpanded,
    disableAddNewTask,
    onAddTask,
    onEditBoard,
    onDeleteBoard,
    onShowSidebar,
  } = props;

  const [showHeadingPopup, setShowHeadingPopup] = useState(false);

  const handleEllipsisAction = (action: string) => {
    if (action === ACTIONS.EDIT) {
      onEditBoard();
    } else if (action === ACTIONS.DELETE) {
      onDeleteBoard();
    }
  };

  return (
    <header
      className={`${styles.header} ${
        sidebarExpanded ? styles['sidebar-expanded'] : ''
      }`}
    >
      <div className={styles['logo-wrapper']}>
        {windowWidth > 650 ? <Logo /> : <LogoMobile />}
      </div>
      <div className={styles.content}>
        {windowWidth > 650 ? (
          <Popup
            element={
              <Text variant="M" tag="span">
                {boardName}
              </Text>
            }
            position="bottom"
            show={showHeadingPopup}
            onOutsideClick={() => setShowHeadingPopup(false)}
            className={styles['heading-wrapper']}
            classNamePopup={styles['heading-popup']}
            offset={-10}
          >
            <Heading
              level="1"
              variant="XL"
              className={styles.heading}
              onClick={() => setShowHeadingPopup((state) => !state)}
            >
              {boardName}
            </Heading>
          </Popup>
        ) : (
          <button
            className={`${styles['btn-heading-mobile']} ${
              sidebarExpanded ? styles.active : ''
            }`}
            onClick={onShowSidebar}
          >
            <span
              className={`${headingStyles.heading} ${headingStyles['heading--XL']} ${styles['btn-heading-mobile__text']}`}
            >
              {boardName}
            </span>
            <IconChevronDown className={styles['btn-heading-mobile__icon']} />
          </button>
        )}

        <Button
          variant="primaryL"
          className={styles['btn-add-task']}
          onClick={onAddTask}
          disabled={disableAddNewTask}
        >
          {windowWidth > 650 ? '+ Add New Task' : <IconAddTaskMobile />}
        </Button>
        <Dropdown
          items={[
            { value: ACTIONS.EDIT },
            { value: ACTIONS.DELETE, className: styles['dropdown-deleteboard'] },
          ]}
          onSelect={handleEllipsisAction}
          className={styles['btn-ellipsis__dropdown']}
        >
          <button className={styles['btn-ellipsis']}>
            <IconVerticalEllipsis />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
