import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertOutsideClick } from 'components';
import styles from 'styles/Dropdown.module.scss';

type Props = {
  items: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>[];
  onSelect: (value: string) => void;
  classNameWrapper?: string;
  className?: string;
  children?: React.ReactElement<HTMLButtonElement>;
} & (
  | { show?: undefined }
  | { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> }
);

let latestWindowHeight = 0;
let latestWindowWidth = 0;

export default function Dropdown(props: Props) {
  const { items, onSelect, show, className, classNameWrapper, children } = props;
  const [itemFocused, setItemFocused] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [dropdownOffsetX, setDropdownOffsetX] = useState(0);
  const childrenRef = useRef<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const updateDropdown = () => {
    const dropdownContainer = dropdownRef.current;
    if (!dropdownContainer) return;
    const dropdownContainerRect = dropdownContainer.getBoundingClientRect();

    // Dropdown Offset X
    const windowWidth = window.innerWidth;
    setDropdownOffsetX((state) => {
      // Check Overflow RIGHT side
      if (windowWidth !== latestWindowWidth) {
        latestWindowWidth = windowWidth;

        const overflowOffsetRight =
          dropdownContainerRect.right - state - windowWidth + 10;

        if (overflowOffsetRight > 0) {
          return overflowOffsetRight * -1;
        } else {
          // Check Overflow LEFT side
          const overflowOffsetLeft = (dropdownContainerRect.left + state) * -1;

          if (overflowOffsetLeft > 0) {
            return overflowOffsetLeft;
          }
        }
        return 0;
      }
      return state;
    });

    // Dropdown Direction
    const windowHeight = window.innerHeight;
    if (windowHeight !== latestWindowHeight) {
      latestWindowHeight = windowHeight;

      const dropdownButton: HTMLElement = childrenRef.current[0];

      const dropdownBottomPos =
        dropdownButton.getBoundingClientRect().bottom +
        (dropdownContainer.clientHeight || 0) +
        20;

      setDropdownDirection(dropdownBottomPos >= windowHeight ? 'up' : 'down');
    }
  };

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
        const element: HTMLElement = childrenRef.current[0];
        element.focus();
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

    updateDropdown();
    if (show || showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', updateDropdown);
    } else {
      setItemFocused(null);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateDropdown);
      latestWindowHeight = 0;
      latestWindowWidth = 0;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateDropdown);
    };
  }, [items.length, show, showDropdown, updateShowState]);

  const dropdownStyle = {
    '--offsetX': dropdownOffsetX + 'px',
  } as React.CSSProperties;

  return (
    <AlertOutsideClick
      event="click"
      className={`${styles.container} ${classNameWrapper}`}
      onOutsideClick={() => updateShowState(false)}
      handleWhen={show || showDropdown}
    >
      {React.Children.map(children, (child: any, index) =>
        React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        })
      )}

      <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${
          !show && !showDropdown ? styles.hide : ''
        } ${dropdownDirection === 'up' ? styles.up : ''} ${className}`}
        style={dropdownStyle}
      >
        {items.map(({ className, onClick, value, ...restProps }, i) => (
          <input
            ref={itemFocused === i ? (node) => node?.focus() : undefined}
            key={String(value)}
            type="button"
            className={`${styles.button} ${className}`}
            onClick={(e) => {
              onSelect(String(value));
              updateShowState(false);
              const element: HTMLElement = childrenRef.current[0];
              element.focus();
              onClick && onClick(e);
            }}
            onFocus={() => setItemFocused(i)}
            value={value}
            disabled={!show && !showDropdown}
            {...restProps}
          />
        ))}
      </div>
    </AlertOutsideClick>
  );
}
