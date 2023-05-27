import { useState, useRef } from 'react';
import { ColumnColorType } from 'types';
import { columnColors } from 'data';
import { Popup } from 'components';
import styles from 'styles/PickColor.module.scss';

interface Props {
  color: ColumnColorType;
  onPickColor: (color: ColumnColorType) => void;
  popupOffset?: number;
  className?: string;
}

export default function PickColor(props: Props) {
  const { color, onPickColor, popupOffset, className } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [colorHovering, setColorHovering] = useState<null | ColumnColorType>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Popup
      position="left"
      show={showPopup}
      className={className}
      classNamePopup={`${styles['popup']}`}
      onOutsideClick={() => setShowPopup(false)}
      offset={popupOffset}
      element={columnColors.map((color) => (
        <button
          key={color}
          className={styles['popup__color']}
          style={{ backgroundColor: color }}
          onClick={() => {
            onPickColor(color);
            setShowPopup(false);
            mainButtonRef.current?.focus();
          }}
          disabled={!showPopup}
          onMouseEnter={() => setColorHovering(color)}
          onMouseLeave={() => setColorHovering(null)}
        />
      ))}
    >
      <button
        ref={mainButtonRef}
        className={styles.button}
        style={{ backgroundColor: colorHovering || color }}
        onClick={() => setShowPopup((state) => !state)}
      />
    </Popup>
  );
}
