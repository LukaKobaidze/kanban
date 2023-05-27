import { forwardRef } from 'react';
import styles from 'styles/Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primaryL' | 'primaryS' | 'secondary' | 'destructive';
}
type Ref = HTMLButtonElement;

export default forwardRef<Ref, Props>(function Button(props, ref) {
  const { variant, className, children, disabled, ...restProps } = props;

  return (
    <button
      ref={ref}
      className={`${styles.button} ${styles[`button--${variant}`]} ${
        disabled ? styles['button--disabled'] : ''
      } ${className}`}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
});
