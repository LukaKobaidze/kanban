import { useEffect } from 'react';
import { ThemeType } from 'types';
import { useLocalStorageState } from 'hooks';

export default function useTheme() {
  const [theme, setTheme] = useLocalStorageState<ThemeType>('boards-theme', () => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }
    return 'dark';
  });

  const onToggleTheme = () =>
    setTheme((state) => (state === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const themeBefore = theme === 'light' ? 'dark' : 'light';
    document.body.classList.remove(themeBefore);
    document.body.classList.add(theme);
  }, [theme]);

  return { theme, onToggleTheme };
}
