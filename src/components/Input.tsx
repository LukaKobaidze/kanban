import { useRef, forwardRef } from 'react';
import { Text } from 'components';
import styles from 'styles/Input.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  classNameWrapper?: string;
}
type Ref = HTMLInputElement;

export default forwardRef<Ref, Props>(function Input(props, ref) {
  const { error, className, classNameWrapper, type, ...restProps } = props;

  const errorTextRef = useRef<HTMLDivElement>(null);

  const inputJSX = (
    <input
      ref={ref}
      className={`${
        type === 'checkbox'
          ? styles.checkbox
          : `${styles.input} ${error ? styles.error : ''}`
      } ${className}`}
      type={type}
      {...restProps}
    />
  );
  return type === 'checkbox' ? (
    inputJSX
  ) : (
    <div className={`${styles['input-wrapper']} ${classNameWrapper}`}>
      {inputJSX}
      {error && (
        <div ref={errorTextRef} className={styles['input--error-text']}>
          <Text tag="span" variant="L">
            {error}
          </Text>
        </div>
      )}
    </div>
  );
});
