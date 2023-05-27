import { forwardRef } from 'react';
import { ColumnType } from 'types';
import { Heading } from 'components';
import styles from 'styles/ColumnName.module.scss';

type Props = ColumnType & React.LiHTMLAttributes<HTMLLIElement>;
type Ref = HTMLLIElement;

export default forwardRef<Ref, Props>(function ColumnName(props, ref) {
  const { name, color, tasks, ...restProps } = props;

  return (
    <li ref={ref} {...restProps}>
      <div className={styles.name}>
        <div
          className={styles['name__color-circle']}
          style={{ backgroundColor: color }}
        />
        <Heading variant="S" level="3" className={styles['name__heading']}>
          {name} ({tasks.length})
        </Heading>
      </div>
    </li>
  );
});
