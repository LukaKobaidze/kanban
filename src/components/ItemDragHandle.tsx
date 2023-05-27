import { IconDragHandle } from 'assets';
import styles from 'styles/ItemDragHandle.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function ItemDragHandle(props: Props) {
  const { className, ...restProps } = props;

  return (
    <div className={`${styles['drag-handle']} ${className}`} {...restProps}>
      <IconDragHandle />
    </div>
  );
}
