import { Button, Heading } from 'components';
import styles from 'styles/BoardEmpty.module.scss';

interface Props {
  onNewColumn: () => void;
}

export default function BoardEmpty(props: Props) {
  const { onNewColumn } = props;

  return (
    <div className={styles.container}>
      <Heading level="3" variant="L" className={styles.heading}>
        This board is empty. Create a new column to get started.
      </Heading>
      <Button variant="primaryL" onClick={onNewColumn} className={styles.button}>
        + Add New Column
      </Button>
    </div>
  );
}
