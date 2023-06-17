import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'redux/store';
import {
  createBoard,
  createTask,
  deleteBoard,
  deleteTask,
  editBoard,
  editTask,
  updateTaskActive,
} from 'redux/boards.slice';
import { ModalType } from 'types';
import { getSubtaskInitial } from 'helpers';
import {
  DeleteModal,
  EditBoardModal,
  EditTaskModal,
  ViewTaskModal,
} from 'components';

interface Props {
  showModal: ModalType;
  setShowModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

export default function AppModals(props: Props) {
  const { showModal, setShowModal } = props;

  const { boards, boardActive, taskActive } = useSelector(
    (state: StoreState) => state.boards
  );
  const dispatch = useDispatch();

  const activeBoardData = boards[boardActive];

  const activeTaskData =
    activeBoardData &&
    taskActive &&
    activeBoardData.columns[taskActive.col].tasks[taskActive.task];

  const boardStatuses =
    activeBoardData && activeBoardData.columns.map((col) => col.name);

  return (
    <>
      {showModal === 'createBoard' ? (
        <EditBoardModal
          componentHeading="Add New Board"
          btnSubmitText="Create New Board"
          onCancel={() => setShowModal(null)}
          onSubmit={(board) => {
            dispatch(createBoard(board));
            setShowModal(null);
          }}
        />
      ) : showModal === 'editBoard' ? (
        <EditBoardModal
          componentHeading="Edit Board"
          btnSubmitText="Save Changes"
          onCancel={() => setShowModal(null)}
          onSubmit={(board) => {
            dispatch(editBoard(board));
            setShowModal(null);
          }}
          {...activeBoardData}
        />
      ) : showModal === 'deleteBoard' ? (
        <DeleteModal
          heading="Delete this board?"
          description={`Are you sure you want to delete the '${activeBoardData.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
          onCancel={() => setShowModal(null)}
          onDelete={() => {
            dispatch(deleteBoard());
            setShowModal(null);
          }}
        />
      ) : showModal === 'addTask' ? (
        <EditTaskModal
          componentHeading="Add New Task"
          allStatuses={boardStatuses}
          status={boardStatuses[0]}
          title=""
          description=""
          subtasks={[getSubtaskInitial(), getSubtaskInitial()]}
          onCancel={() => setShowModal(null)}
          onSubmit={(data, status) => {
            dispatch(createTask({ data, status }));
            setShowModal(null);
          }}
          btnSubmitText="Create Task"
        />
      ) : (
        activeTaskData &&
        (showModal === 'deleteTask' ? (
          <DeleteModal
            heading="Delete this task?"
            description={`Are you sure you want to delete the '${activeTaskData.title}' task and its subtasks? This action cannot be reversed.`}
            onCancel={() => setShowModal(null)}
            onDelete={() => {
              dispatch(deleteTask());
              setShowModal(null);
            }}
          />
        ) : showModal === 'editTask' ? (
          <EditTaskModal
            componentHeading="Edit Task"
            status={activeBoardData.columns[taskActive!.col].name}
            allStatuses={boardStatuses}
            onCancel={() => setShowModal(null)}
            onSubmit={(data, status) => {
              dispatch(editTask({ edited: data, status: status }));
              setShowModal(null);
            }}
            btnSubmitText="Save Changes"
            {...activeTaskData}
          />
        ) : (
          <ViewTaskModal
            status={activeBoardData.columns[taskActive!.col].name}
            allStatuses={boardStatuses}
            onDelete={() => setShowModal('deleteTask')}
            onEdit={() => setShowModal('editTask')}
            onCloseModal={() => dispatch(updateTaskActive(null))}
            {...activeTaskData}
          />
        ))
      )}
    </>
  );
}
