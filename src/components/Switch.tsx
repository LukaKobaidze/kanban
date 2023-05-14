import styles from 'styles/Switch.module.scss';

interface Props {
  on: boolean;
  disabled?: boolean;
}

export default function Switch(props: Props) {
  const { on, disabled } = props;

  return (
    <button
      className={`${styles.switch} ${on ? styles.on : ''}`}
      disabled={disabled}
    >
      Switch
    </button>
  );
}
