import styles from 'styles/ViewTask.module.scss';
import Modal from './Modal';
import { TaskType } from 'types';
import Heading from './Heading';
import Text from './Text';
import Input from './Input';
import { IconVerticalEllipsis } from 'assets';

interface Props extends TaskType {
  status: string;
  allStatuses: string[];
  onCloseModal: () => void;
  onChangeSubtaskCompleted: (subtask: number, isCompleted: boolean) => void;
  onChangeTaskStatus: (status: string) => void;
}

export default function ViewTask(props: Props) {
  const {
    status,
    allStatuses,
    title,
    description,
    subtasks,
    onCloseModal,
    onChangeSubtaskCompleted,
    onChangeTaskStatus,
  } = props;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSubtaskCompleted(Number(e.currentTarget.value), e.currentTarget.checked);
  };

  console.log(subtasks);

  return (
    <Modal onCloseModal={onCloseModal} className={styles.container}>
      <div className={styles['title-wrapper']}>
        <Heading level="2" variant="L" className={styles.title}>
          {title}
        </Heading>
        <button className={styles['btn-ellipsis']}>
          <IconVerticalEllipsis />
        </button>
      </div>
      <Text tag="p" variant="L" className={styles.description}>
        {description}
      </Text>
      <Text tag="span" variant="M" className={styles['text-subtasks']}>
        Subtasks (
        {subtasks.reduce((acc, subtask) => (subtask.isCompleted ? acc + 1 : acc), 0)}{' '}
        of {subtasks.length})
      </Text>
      <ul className={styles['subtasks-list']}>
        {subtasks.map((subtask, i) => (
          <li key={subtask.title} className={styles['subtask-item']}>
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
              <Text tag="span" variant="M" className={styles['subtask__title']}>
                {subtask.title}
              </Text>
            </label>
          </li>
        ))}
      </ul>

      <Text tag="span" variant="M">
        Current Status
      </Text>
      <select
        defaultValue={status}
        onChange={(e) => onChangeTaskStatus(e.target.value)}
      >
        {allStatuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </Modal>
  );
}
