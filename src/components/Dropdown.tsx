import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from 'styles/Dropdown.module.scss';
import AlertOutsideClick from './AlertOutsideClick';

type Props = {
  items: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>[];
  onSelect: (value: string) => void;
  classNameWrapper?: string;
  className?: string;
  children?: React.ReactNode;
} & (
  | { show?: undefined }
  | { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> }
);

export default function Dropdown(props: Props) {
  const { items, onSelect, show, className, classNameWrapper, children } = props;
  const [itemFocused, setItemFocused] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const childrenRef = useRef<any[]>([]);

  const updateShowState = useCallback(
    (val: React.SetStateAction<boolean>) => {
      if (show !== undefined) {
        props.setShow(val);
      } else {
        setShowDropdown(val);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show]
  );

  console.log({ showDropdown, show });

  useEffect(() => {
    const element: HTMLElement = childrenRef.current[0];

    const handleClick = () => {
      updateShowState((state) => !state);
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [updateShowState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        updateShowState(false);
      }

      if (e.key === 'ArrowDown') {
        setItemFocused((state) => {
          if (state === null || state === items.length - 1) {
            return 0;
          }
          return state + 1;
        });
      }

      if (e.key === 'ArrowUp') {
        setItemFocused((state) => {
          if (state === null || state === 0) {
            return items.length - 1;
          }
          return state - 1;
        });
      }
    };

    if (show || showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      const element: HTMLElement = childrenRef.current[0];
      element.focus();
      setItemFocused(null);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items.length, show, showDropdown, updateShowState]);

  return (
    <AlertOutsideClick
      className={`${styles.container} ${classNameWrapper}`}
      onOutsideClick={() => updateShowState(false)}
      shouldHandle={show || showDropdown}
    >
      {React.Children.map(children, (child: any, index) =>
        React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        })
      )}

      {(show || showDropdown) && (
        <div className={`${styles.dropdown} ${className}`}>
          {items.map(({ className, onClick, value, ...restProps }, i) => (
            <input
              ref={itemFocused === i ? (node) => node?.focus() : undefined}
              key={String(value)}
              type="button"
              className={`${styles.button} ${className}`}
              onClick={(e) => {
                onSelect(String(value));
                updateShowState(false);
                onClick && onClick(e);
              }}
              onFocus={() => setItemFocused(i)}
              value={value}
              {...restProps}
            />
          ))}
        </div>
      )}
    </AlertOutsideClick>
  );
}
