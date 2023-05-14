import styles from 'styles/Text.module.scss';

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  tag: 'span' | 'p';
  variant: 'L' | 'M';
}

export default function Text(props: Props) {
  const { tag, variant, children, className, ...restProps } = props;

  const DynamicComponent: keyof JSX.IntrinsicElements = tag;

  return (
    <DynamicComponent
      className={`${styles.text} ${styles[`text--${variant}`]} ${className}`}
      {...restProps}
    >
      {children}
    </DynamicComponent>
  );
}
