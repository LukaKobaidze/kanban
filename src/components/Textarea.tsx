import inputStyles from 'styles/Input.module.scss';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea(props: Props) {
  const { className, ...restProps } = props;

  return <textarea className={`${inputStyles.input} ${className}`} {...restProps} />;
}
