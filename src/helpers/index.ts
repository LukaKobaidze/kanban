import { columnColors } from 'data';
import { ColumnType, SubtaskType, ThemeType } from 'types';

export function getThemeInitial(): ThemeType {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    return 'light';
  }
  return 'dark';
}

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
