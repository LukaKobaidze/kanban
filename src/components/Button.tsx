import styles from 'styles/Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: '1' | '2' | '3' | '4';
}

export default function Button(props: Props) {
  const { variant, className, children, ...restProps } = props;

  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${className}`}
      {...restProps}
    >
      {children}
    </button>
  );
}
