import { AlertOutsideClick } from 'components';
import styles from 'styles/Popup.module.scss';

interface Props {
  element: React.ReactNode;
  position: 'top' | 'right' | 'bottom' | 'left';
  show?: boolean;
  onOutsideClick?: () => void;
  showOnHover?: boolean;
  offset?: number;
  className?: string;
  classNamePopup?: string;
  children?: React.ReactNode;
}

export default function Popup(props: Props) {
  const {
    element,
    position,
    show,
    onOutsideClick,
    showOnHover,
    offset = 6,
    className,
    classNamePopup,
    children,
  } = props;

  const elementStyle = {
    '--offset': `${offset}px`,
  } as React.CSSProperties;

  const content = (
    <>
      {children}
      <div
        className={`${styles.element} ${styles[`element--${position}`]} ${
          !show ? styles.disabled : ''
        } ${classNamePopup}`}
        style={elementStyle}
      >
        {element}
      </div>
    </>
  );

  const classNameContainer = `${styles.wrapper} ${
    showOnHover ? styles['wrapper--hover'] : ''
  } ${show ? styles['wrapper--show'] : ''} ${className}`;

  return show !== undefined && onOutsideClick ? (
    <AlertOutsideClick
      onOutsideClick={onOutsideClick}
      handleWhen={show}
      event="click"
      className={classNameContainer}
    >
      {content}
    </AlertOutsideClick>
  ) : (
    <div className={classNameContainer}>{content}</div>
  );
}
