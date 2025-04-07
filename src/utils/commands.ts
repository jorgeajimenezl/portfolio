import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';
import { bold, underline } from '../utils/ascii';

import experience from '../../data/experience.json';

const hostname = window.location.hostname;

const commandDescriptions: Record<string, string> = {
  help: 'Displays the list of available commands.',
  hostname: 'Shows the hostname of the current machine.',
  whoami: 'Displays the current user.',
  date: 'Shows the current date and time.',
  echo: 'Echoes the input arguments.',
  sudo: 'Attempts to run a command as root (for fun).',
  light: 'Switches the theme to light mode.',
  dark: 'Switches the theme to dark mode.',
  clear: 'Clears the command history.',
  email: 'Opens the default mail client to send an email.',
  exit: 'Displays a message to close the tab.',
  banner: 'Displays the application banner.',
};

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  experience: () => {
    return experience
      .map((exp) => {
        const header = `${bold(exp.title)} at ${exp.company}\nLocation: ${
          exp.location
        } | ${exp.startDate} to ${exp.endDate}`;
        const description = exp.description
          .map((line) => `  • ${line}`)
          .join("\n");
        return `${header}\n\nDescription:\n${description}`;
      })
      .join(`\n\n`);
  },
  help: () => {
    return (
      'Available commands:\n' +
      Object.keys(commands)
        .map((cmd) => `\t${cmd}: ${commandDescriptions[cmd]}`)
        .join('\n')
    );
  },
  hostname: () => hostname,
  whoami: () => 'guest',
  date: () => new Date().toLocaleString(),
  echo: (args: string[]) => args.join(' '),
  sudo: (args: string[]) => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  light: () => {
    const t = themes.find((t) => t.name === 'light');
    theme.set(t ?? themes[0]);
    return 'Theme set to light';
  },
  dark: () => {
    const t = themes.find((t) => t.name === 'dark');
    theme.set(t ?? themes[0]);
    return 'Theme set to dark';
  },
  clear: () => {
    history.set([]);
    return '';
  },
  email: () => {
    window.open(`mailto:${packageJson.author.email}`);
    return `Opening mailto:${packageJson.author.email}...`;
  },
  exit: () => {
    return 'Please close the tab to exit.';
  },
  banner: () => `
██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ v${packageJson.version}

Type 'help' to see list of available commands.
`,
};
