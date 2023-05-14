import styles from 'styles/Input.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: Props) {
  const { className, type, ...restProps } = props;

  const inputJSX = (
    <input
      className={`${
        type === 'checkbox' ? styles.checkbox : styles.input
      } ${className}`}
      type={type}
      {...restProps}
    />
  );
  return type === 'checkbox' ? (
    <div className={styles['checkbox-wrapper']}>{inputJSX}</div>
  ) : (
    inputJSX
  );
}
