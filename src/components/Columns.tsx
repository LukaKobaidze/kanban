import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'redux/store';
import { reorderTask, updateTaskActive } from 'redux/boards.slice';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { Text, Heading, Button } from 'components';
import ScrollContainer from 'react-indiana-drag-scroll';
import headingStyles from 'styles/Heading.module.scss';
import styles from 'styles/Columns.module.scss';

interface Props {
  onNewColumn: () => void;
}

export default function Columns(props: Props) {
  const { onNewColumn } = props;

  const { boards, boardActive } = useSelector((state: StoreState) => state.boards);
  const dispatch = useDispatch();

  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [boardActive]);

  const data = boards[boardActive]?.columns || [];

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    dispatch(
      reorderTask({
        from: { col: Number(source.droppableId), task: source.index },
        to: { col: Number(destination.droppableId), task: destination.index },
      })
    );
  };

  return (
    <>
      {data.length !== 0 ? (
        <ScrollContainer
          hideScrollbars={false}
          ignoreElements="*[prevent-drag-scroll]"
          className={styles.container}
          innerRef={scrollContainerRef}
        >
          <div className={styles['names-sticky']}>
            <ul className={styles['names-wrapper']}>
              {data.map((item) => (
                <li key={item.name}>
                  <div className={styles.name}>
                    <div
                      className={styles['name__color-circle']}
                      style={{ backgroundColor: item.color }}
                    />
                    <Heading
                      variant="S"
                      level="3"
                      className={styles['name__heading']}
                    >
                      {item.name} ({item.tasks.length})
                    </Heading>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles['all-tasks-wrapper']}>
              {data.map(({ name, tasks }, colIndex) => (
                <Droppable key={name} droppableId={String(colIndex)}>
                  {(provided) => (
                    <ul
                      id={name}
                      className={styles.tasks}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {tasks.map((task, taskIndex) => (
                        <Draggable
                          key={task.title}
                          draggableId={task.title}
                          index={taskIndex}
                        >
                          {(provided, snapshot) => {
                            return (
                              <li
                                className={`${styles['task-item']} ${
                                  snapshot.draggingOver === 'delete'
                                    ? styles['drag-deleting']
                                    : ''
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className={`${styles['task-draggable']} ${
                                    snapshot.isDragging ? styles.active : ''
                                  }`}
                                  prevent-drag-scroll="true"
                                />
                                <button
                                  className={styles['task-btn']}
                                  onClick={() =>
                                    dispatch(
                                      updateTaskActive({
                                        col: colIndex,
                                        task: taskIndex,
                                      })
                                    )
                                  }
                                >
                                  <span
                                    className={`${headingStyles.heading} ${headingStyles['heading--M']} ${styles['task-btn__title']}`}
                                  >
                                    {task.title}
                                  </span>
                                  {task.subtasks.length !== 0 && (
                                    <Text
                                      variant="M"
                                      tag="span"
                                      className={styles['task-btn__subtasks']}
                                    >
                                      {task.subtasks.reduce(
                                        (acc, subtask) =>
                                          subtask.isCompleted ? acc + 1 : acc,
                                        0
                                      )}{' '}
                                      of {task.subtasks.length} subtasks
                                    </Text>
                                  )}
                                </button>
                              </li>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              ))}
              <button className={styles['new-column']} onClick={onNewColumn}>
                + New Column
              </button>
              <div className={styles['padding-div']} />
            </div>
          </DragDropContext>
        </ScrollContainer>
      ) : (
        <div className={styles.empty}>
          <Heading level="3" variant="L" className={styles['empty__heading']}>
            This board is empty. Create a new column to get started.
          </Heading>
          <Button
            variant="primaryL"
            className={styles['empty__button']}
            onClick={onNewColumn}
          >
            + Add New Column
          </Button>
        </div>
      )}
    </>
  );
}
