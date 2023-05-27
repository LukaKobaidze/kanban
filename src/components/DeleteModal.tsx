import { Button, Heading, Modal, Text } from 'components';
import styles from 'styles/DeleteModal.module.scss';

interface Props {
  heading: string;
  description: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteModal(props: Props) {
  const { heading, description, onCancel, onDelete } = props;

  return (
    <Modal onCloseModal={onCancel}>
      <Heading level="4" variant="L" className={styles.heading}>
        {heading}
      </Heading>
      <Text tag="p" variant="L" className={styles.description}>
        {description}
      </Text>
      <div className={styles['buttons-wrapper']}>
        <Button
          variant="destructive"
          className={styles['btn-delete']}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          variant="secondary"
          className={styles['btn-cancel']}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
