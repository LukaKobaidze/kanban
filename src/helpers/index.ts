import { columnColors } from 'data';
import { ColumnType, SubtaskType } from 'types';

export function getColumnInitial(): ColumnType {
  return {
    name: '',
    color: columnColors[Math.floor(Math.random() * columnColors.length)],
    tasks: [],
  };
}

export function getSubtaskInitial(): SubtaskType {
  return { title: '', isCompleted: false };
}
