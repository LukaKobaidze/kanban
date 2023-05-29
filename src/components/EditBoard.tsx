import { useRef, useState, useLayoutEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { BoardType, ColumnColorType, ColumnType } from 'types';
import { getColumnInitial } from 'helpers';
import {
  Heading,
  Modal,
  Text,
  Button,
  Input,
  InputRemove,
  ItemDragHandle,
  PickColor,
} from 'components';
import styles from 'styles/EditBoard.module.scss';

interface Props {
  boards: BoardType;
  componentHeading: string;
  onCancel: () => void;
  onSubmit: (name: string, columns: ColumnType[]) => void;
  name?: string;
  columns?: ColumnType[];
  btnSubmitText?: string;
}

export default function EditBoard(props: Props) {
  const {
    boards,
    componentHeading,
    btnSubmitText,
    onCancel,
    onSubmit,
    name,
    columns,
  } = props;

  const [editedName, setEditedName] = useState(name || '');
  const [editedNameError, setEditedNameError] = useState('');
  const [editedColumns, setEditedColumns] = useState<ColumnType[]>(
    columns && columns.length !== 0
      ? columns
      : [getColumnInitial(), getColumnInitial()]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [focusLastInput, setFocusLastInput] = useState(false);
  const lastColumnInput = useRef<HTMLInputElement>(null);

  const handleIsNameValid = () => {
    if (editedName.trim().length === 0) {
      setEditedNameError("Can't be empty");
      return false;
    }
    if (
      boards.some((board) => {
        return (
          board.name !== name &&
          board.name.toLowerCase() === editedName.trim().toLowerCase()
        );
      })
    ) {
      setEditedNameError('Board Name already exists');
      return false;
    }
    return true;
  };

  const handleAddColumn = () => {
    setEditedColumns((state) => [...state, getColumnInitial()]);
    setFocusLastInput(true);
  };

  const handleRemoveColumn = (index: number) => {
    setEditedColumns((state) => [
      ...state.slice(0, index),
      ...state.slice(index + 1),
    ]);
  };

  const handleColumnNameChange = (index: number, value: string) => {
    setEditedColumns((state) => [
      ...state.slice(0, index),
      { ...state[index], name: value },
      ...state.slice(index + 1),
    ]);
  };

  const handleChangeColumnColor = (index: number, color: ColumnColorType) => {
    setEditedColumns((state) => {
      return [
        ...state.slice(0, index),
        { ...state[index], color },
        ...state.slice(index + 1),
      ];
    });
  };

  const handleSubmit = () => {
    const isValid = handleIsNameValid();

    if (!isValid) return;

    onSubmit(
      editedName,
      editedColumns.filter((col) => col.name.trim().length !== 0)
    );
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = ({ source, destination }: DropResult) => {
    setIsDragging(false);
    if (!destination) return;

    setEditedColumns((state) => {
      const output = [...state];

      const [reorderedColumn] = output.splice(source.index, 1);
      output.splice(destination.index, 0, reorderedColumn);

      return output;
    });
  };

  useLayoutEffect(() => {
    if (focusLastInput) {
      lastColumnInput.current?.focus();
      setFocusLastInput(false);
    }
  }, [focusLastInput]);

  return (
    <Modal
      ignoreKeyboardEscape={isDragging}
      onCloseModal={onCancel}
      className={styles.container}
      initialFocus={false}
    >
      <div className={styles['scrollbar-wrapper']}>
        <div className={styles['heading-wrapper']}>
          <Heading level="4" variant="L">
            {componentHeading}
          </Heading>
        </div>
        <label htmlFor="name" className={`${styles.label} ${styles['label-name']}`}>
          <Text tag="span" variant="M">
            Board Name
          </Text>
        </label>
        <Input
          id="name"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          error={editedNameError}
          onBlur={handleIsNameValid}
          onFocus={() => setEditedNameError('')}
          placeholder="e.g. Web Design"
        />

        <label htmlFor="column" className={styles.label}>
          <Text tag="span" variant="M">
            Board Columns
          </Text>
        </label>

        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <ul
                className={styles['columns-list']}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {editedColumns.map((column, i) => (
                  <Draggable key={i} draggableId={String(i)} index={i}>
                    {(provided) => (
                      <li
                        className={styles.column}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <ItemDragHandle {...provided.dragHandleProps} />
                        <InputRemove
                          ref={
                            i === editedColumns.length - 1
                              ? lastColumnInput
                              : undefined
                          }
                          value={column.name}
                          className={styles['column__input']}
                          onChange={(e) => handleColumnNameChange(i, e.target.value)}
                          onRemove={() => handleRemoveColumn(i)}
                        />
                        <PickColor
                          color={column.color}
                          onPickColor={(color: ColumnColorType) =>
                            handleChangeColumnColor(i, color)
                          }
                          popupOffset={0}
                          className={styles['pickcolor']}
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
          className={styles['btn-add-column']}
          onClick={handleAddColumn}
        >
          + Add New Column
        </Button>
      </div>
      <div className={styles['btn-submit-wrapper']}>
        <Button
          variant="primaryS"
          className={styles['btn-submit']}
          onClick={handleSubmit}
        >
          {btnSubmitText || 'Submit'}
        </Button>
      </div>
    </Modal>
  );
}
