import { writable } from 'svelte/store';
import themes from '../../themes.json';
import type { Theme } from '../interfaces/theme';

const defaultColorscheme: Theme = themes.find((t) => t.name === 'dark')!;

export const theme = writable<Theme>(
  JSON.parse(
    localStorage.getItem('colorscheme') || JSON.stringify(defaultColorscheme),
  ),
);

export const autoTheme = writable<boolean>(
  JSON.parse(localStorage.getItem('autoTheme') || 'true')
);

autoTheme.subscribe((value) => {
  localStorage.setItem('autoTheme', JSON.stringify(value));
});

if (JSON.parse(localStorage.getItem('autoTheme') || 'true')) {
  const setThemeFromSystem = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selected = themes.find((t) => t.name === (isDark ? 'dark' : 'light'));
    theme.set(selected ?? themes[0]);
  };
  setThemeFromSystem();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeFromSystem);
}

theme.subscribe((value) => {
  localStorage.setItem('colorscheme', JSON.stringify(value));
});
