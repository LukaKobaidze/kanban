import { useEffect } from 'react';
import AlertOutsideClick from './AlertOutsideClick';
import styles from 'styles/Modal.module.scss';
import FocusTrap from 'focus-trap-react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onCloseModal: () => void;
}

export default function Modal(props: Props) {
  const { onCloseModal, className, children, ...restProps } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  return (
    <FocusTrap>
      <div className={styles['wrapper-backdrop']}>
        <AlertOutsideClick
          onOutsideClick={onCloseModal}
          className={`${styles.modal} ${className || ''}`}
          {...restProps}
        >
          {children}
        </AlertOutsideClick>
      </div>
    </FocusTrap>
  );
}
