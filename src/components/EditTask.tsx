import { useState, useRef, useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { TaskType } from 'types';
import { getSubtaskInitial } from 'helpers';
import {
  Modal,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  StatusSelection,
  InputRemove,
  ItemDragHandle,
} from 'components';
import styles from 'styles/EditTask.module.scss';

interface Props extends TaskType {
  componentHeading: string;
  status: string;
  allStatuses: string[];
  onCancel: () => void;
  onSubmit: (data: TaskType, status: string) => void;
  btnSubmitText?: string;
}

export default function EditTask(props: Props) {
  const {
    title,
    description,
    subtasks,
    status,
    allStatuses,
    onCancel,
    onSubmit,
    componentHeading,
    btnSubmitText = 'Submit',
  } = props;

  const isFirstRender = useRef(true);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedSubtasks, setEditedSubtasks] = useState(subtasks);
  const [editedStatus, setEditedStatus] = useState(status);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const lastSubtaskInput = useRef<HTMLInputElement>(null);

  const handleAddNewSubtask = () => {
    setEditedSubtasks((state) => [...state, getSubtaskInitial()]);
    setIsAddingSubtask(true);
  };

  const handleRemoveSubtask = (index: number) => {
    setEditedSubtasks((state) => [
      ...state.slice(0, index),
      ...state.slice(index + 1),
    ]);
  };

  const handleSubtaskTitleChange = (index: number, title: string) => {
    setEditedSubtasks((state) => [
      ...state.slice(0, index),
      { ...state[index], title },
      ...state.slice(index + 1),
    ]);
  };

  const handleSubmit = () => {
    if (editedTitle.trim().length === 0) return;

    onSubmit(
      {
        title: editedTitle,
        description: editedDescription,
        subtasks: editedSubtasks.filter(
          (subtask) => subtask.title.trim().length !== 0
        ),
      },
      editedStatus
    );
  };

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    setEditedSubtasks((state) => {
      const output = [...state];

      const [reorderedSubtask] = output.splice(source.index, 1);
      output.splice(destination.index, 0, reorderedSubtask);

      return output;
    });
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      if (isAddingSubtask) {
        lastSubtaskInput.current?.focus();
        lastSubtaskInput.current?.scrollIntoView();
        setIsAddingSubtask(false);
      }
    } else {
      isFirstRender.current = false;
    }
  }, [isAddingSubtask]);

  return (
    <Modal onCloseModal={onCancel} className={styles.container}>
      <div className={styles['scrollbar-wrapper']}>
        <div className={styles['heading-wrapper']}>
          <Heading level="4" variant="L">
            {componentHeading}
          </Heading>
        </div>

        <label
          htmlFor="title"
          className={`${styles.label} ${styles['label-title']}`}
        >
          <Text tag="span" variant="M">
            Title
          </Text>
        </label>
        <Input
          id="title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="e.g. Take coffee break"
        />

        <label htmlFor="description" className={styles.label}>
          <Text tag="span" variant="M">
            Description
          </Text>
        </label>
        <Textarea
          id="description"
          value={editedDescription}
          className={styles['description-textarea']}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
        />

        <Text tag="span" variant="M" className={styles.label}>
          Subtasks
        </Text>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="subtasks">
            {(provided) => (
              <ul
                className={styles['subtasks-list']}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {editedSubtasks.map((subtask, i) => (
                  <Draggable key={i} draggableId={String(i)} index={i}>
                    {(provided) => (
                      <li
                        className={styles.subtask}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <ItemDragHandle {...provided.dragHandleProps} />
                        <InputRemove
                          ref={
                            i === editedSubtasks.length - 1
                              ? lastSubtaskInput
                              : undefined
                          }
                          value={subtask.title}
                          onChange={(e) =>
                            handleSubtaskTitleChange(i, e.target.value)
                          }
                          onRemove={() => handleRemoveSubtask(i)}
                          placeholder={
                            i % 2 === 0
                              ? 'e.g. Make coffee'
                              : 'e.g. Drink coffee & smile'
                          }
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          variant="secondary"
          className={styles['btn-add-subtask']}
          onClick={handleAddNewSubtask}
        >
          + Add New Subtask
        </Button>
      </div>
      <div className={styles['footer-wrapper']}>
        <StatusSelection
          labelText="Status"
          status={editedStatus}
          allStatuses={allStatuses}
          onChangeStatus={(status) => setEditedStatus(status)}
        />
        <Button
          variant="primaryS"
          className={styles['btn-submit']}
          onClick={handleSubmit}
        >
          {btnSubmitText}
        </Button>
      </div>
    </Modal>
  );
}
