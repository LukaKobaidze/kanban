import { useState } from 'react';
import { IconChevronDown } from 'assets';
import { Dropdown, Text } from 'components';
import styles from 'styles/StatusSelection.module.scss';

interface Props {
  labelText?: string;
  status: string;
  allStatuses: string[];
  onChangeStatus: (status: string) => void;
}

export default function StatusSelection(props: Props) {
  const { labelText, status, allStatuses, onChangeStatus } = props;

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div>
      {labelText && (
        <label htmlFor="status">
          <Text tag="span" variant="M" className={styles.text}>
            {labelText}
          </Text>
        </label>
      )}
      <Dropdown
        className={styles['selection__dropdown']}
        items={allStatuses.map((status) => ({ value: status }))}
        onSelect={(val) => val !== status && onChangeStatus(val)}
        show={showDropdown}
        setShow={setShowDropdown}
      >
        <button
          className={`${styles.selection} ${showDropdown ? styles.active : ''}`}
          id="status"
        >
          <span>{status}</span>
          <IconChevronDown />
        </button>
      </Dropdown>
    </div>
  );
}
