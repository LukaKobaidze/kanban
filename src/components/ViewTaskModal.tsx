import { useDispatch } from 'react-redux';
import { changeTaskStatus, updateSubtaskCompleted } from 'redux/boards.slice';
import { TaskType } from 'types';
import { IconVerticalEllipsis } from 'assets';
import { Modal, Heading, Text, Input, Dropdown, StatusSelection } from 'components';
import styles from 'styles/ViewTask.module.scss';

const ACTIONS = {
  EDIT: 'Edit Task',
  DELETE: 'Delete Task',
} as const;

interface Props extends TaskType {
  status: string;
  allStatuses: string[];
  onEdit: () => void;
  onDelete: () => void;
  onCloseModal: () => void;
}

export default function ViewTaskModal(props: Props) {
  const {
    status,
    allStatuses,
    title,
    description,
    subtasks,
    onCloseModal,
    onEdit,
    onDelete,
  } = props;

  const dispatch = useDispatch();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSubtaskCompleted({
        subtask: Number(e.currentTarget.value),
        isCompleted: e.currentTarget.checked,
      })
    );
  };

  const handleEllipsisAction = (value: string) => {
    if (value === ACTIONS.EDIT) {
      onEdit();
    } else if (value === ACTIONS.DELETE) {
      onDelete();
    }
  };

  return (
    <Modal
      className={styles.container}
      onCloseModal={onCloseModal}
      initialFocus={false}
    >
      <div className={styles['title-wrapper']}>
        <Heading level="4" variant="L" className={styles.title}>
          {title}
        </Heading>
        <Dropdown
          items={[
            { value: ACTIONS.EDIT },
            { value: ACTIONS.DELETE, className: styles['dropdown-deletetask'] },
          ]}
          onSelect={handleEllipsisAction}
          className={styles['btn-ellipsis__dropdown']}
        >
          <button className={styles['btn-ellipsis']}>
            <IconVerticalEllipsis />
          </button>
        </Dropdown>
      </div>
      <div className={styles['scrollbar-wrapper']}>
        {description && (
          <Text tag="p" variant="L" className={styles.description}>
            {description}
          </Text>
        )}
        {subtasks.length !== 0 && (
          <>
            <Text tag="span" variant="M" className={styles['text-subtasks']}>
              Subtasks (
              {subtasks.reduce(
                (acc, subtask) => (subtask.isCompleted ? acc + 1 : acc),
                0
              )}{' '}
              of {subtasks.length})
            </Text>
            <ul className={styles['subtasks-list']}>
              {subtasks.map((subtask, i) => (
                <li key={i} className={styles['subtask-item']}>
                  <label
                    className={`${styles.subtask} ${
                      subtask.isCompleted ? styles['subtask--checked'] : ''
                    }`}
                    htmlFor={String(i)}
                  >
                    <Input
                      type="checkbox"
                      id={String(i)}
                      value={String(i)}
                      checked={subtask.isCompleted}
                      onChange={handleCheckboxChange}
                    />
                    <Text
                      tag="span"
                      variant="M"
                      className={styles['subtask__title']}
                    >
                      {subtask.title}
                    </Text>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className={styles['selection-wrapper']}>
        <StatusSelection
          labelText="Current Status"
          status={status}
          allStatuses={allStatuses}
          onChangeStatus={(status) => dispatch(changeTaskStatus(status))}
        />
      </div>
    </Modal>
  );
}
