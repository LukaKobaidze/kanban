import styles from 'styles/Dropdown.module.scss';

interface Props {
  items: any[];
  onSelect: (item: any) => void;
  children?: React.ReactNode;
  classNameWrapper?: string;
  classNameDropdown?: string;
}

export default function Dropdown(props: Props) {
  const { items, onSelect } = props;

  return <div></div>;
}
