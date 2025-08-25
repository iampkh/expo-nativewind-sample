import { lightTheme } from './light';
import { darkTheme } from './dark';
import { abcTheme } from './abc';
import { Theme, ThemeName } from '../types/theme';

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  abc: abcTheme,
};

export { lightTheme, darkTheme, abcTheme };
export * from '../types/theme';