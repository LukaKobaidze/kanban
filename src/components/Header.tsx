import { IconVerticalEllipsis, LogoLight } from 'assets';
import Heading from './Heading';
import styles from 'styles/Header.module.scss';
import Button from './Button';

interface Props {
  boardName: string;
  sidebarExpanded: boolean;
}

export default function Header(props: Props) {
  const { boardName, sidebarExpanded } = props;

  return (
    <header
      className={`${styles.header} ${
        sidebarExpanded ? styles['sidebar-expanded'] : ''
      }`}
    >
      <div className={styles['logo-wrapper']}>
        <LogoLight />
      </div>
      <div className={styles.content}>
        <Heading level="1" variant="XL">
          {boardName}
        </Heading>
        <Button variant="1" className={styles['btn-add-task']}>
          + Add New Task
        </Button>
        <button className={styles['btn-ellipsis']}>
          <IconVerticalEllipsis />
        </button>
      </div>
    </header>
  );
}
