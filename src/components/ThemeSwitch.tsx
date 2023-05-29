import { IconDarkTheme, IconLightTheme } from 'assets';
import styles from 'styles/ThemeSwitch.module.scss';

interface Props {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ThemeSwitch(props: Props) {
  const { on, disabled, onToggle, className } = props;

  return (
    <div className={`${styles.container} ${className}`}>
      <IconLightTheme />
      <button
        className={`${styles.switch} ${on ? styles.on : ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-label="Switch Theme"
      />
      <IconDarkTheme />
    </div>
  );
}
