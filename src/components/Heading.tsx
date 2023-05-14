import styles from 'styles/Heading.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  level: '1' | '2' | '3' | '4' | '5' | '6';
  variant: 'XL' | 'L' | 'M' | 'S';
}

export default function Heading(props: Props) {
  const { level, variant, className, children, ...restProps } = props;

  const DynamicComponent: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <DynamicComponent
      className={`${styles.heading} ${styles[`heading--${variant}`]} ${
        className || ''
      }`}
      {...restProps}
    >
      {children}
    </DynamicComponent>
  );
}
