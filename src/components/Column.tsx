import { ColumnType } from 'types';
import Text from './Text';
import Heading from './Heading';
import styles from 'styles/Column.module.scss';
import headingStyles from 'styles/Heading.module.scss';

interface Props extends ColumnType {
  index: number;
  setViewTaskIndex: React.Dispatch<
    React.SetStateAction<{
      col: number;
      task: number;
    } | null>
  >;
}

export default function Column(props: Props) {
  const { index, setViewTaskIndex, name, color, tasks } = props;

  return (
    <div className={styles.container}>
      <div className={styles['name-wrapper']}>
        <div className={styles['color-circle']} style={{ backgroundColor: color }} />
        <Heading variant="S" level="3" className={styles['name-heading']}>
          {name} ({tasks.length})
        </Heading>
      </div>
      <ul className={styles.tasks}>
        {tasks.map((task, taskIndex) => (
          <li key={task.title} className={styles['task-item']}>
            <button
              className={styles['task-btn']}
              onClick={() => setViewTaskIndex({ col: index, task: taskIndex })}
            >
              <span
                className={`${headingStyles.heading} ${headingStyles['heading--M']} ${styles['task-btn__title']}`}
              >
                {task.title}
              </span>
              <Text variant="M" tag="span" className={styles['task-btn__subtasks']}>
                {task.subtasks.reduce(
                  (acc, subtask) => (subtask.isCompleted ? acc + 1 : acc),
                  0
                )}{' '}
                of {task.subtasks.length} subtasks
              </Text>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles['empty-div']} />
    </div>
  );
}
