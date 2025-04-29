import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme, autoTheme } from '../stores/theme';
import { bold, hyperlink } from '../utils/ascii';

import education from '../../data/education.json';
import experience from '../../data/experience.json';
import skills from '../../data/skills.json';

const hostname = window.location.hostname;

const commandDescriptions: Record<string, string> = {
  // System commands
  help: 'Displays the list of available commands.',
  hostname: 'Shows the hostname of the current machine.',
  whoami: 'Displays the current user.',
  date: 'Shows the current date and time.',
  echo: 'Echoes the input arguments.',
  sudo: 'Attempts to run a command as root (for fun).',
  light: 'Switches the theme to light mode.',
  dark: 'Switches the theme to dark mode.',
  'auto-theme': 'Automatically sets the theme based on the system preference.',
  clear: 'Clears the command history.',
  email: 'Opens the default mail client to send an email.',
  exit: 'Displays a message to close the tab.',
  banner: 'Displays the application banner.',
  ls: 'Lists the files in the current directory.',
  cat: 'Displays the content of a file.',

  // Personal commands
  experience: 'Displays the work experience of the user.',
  education: 'Displays the educational background of the user.',
  contact: 'Displays the contact information of the user.',
  about: 'Displays information about the user.',
  cv: 'Downloads the user\'s CV.',
  skills: 'Displays the skills of the user.',
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
  contact: () => {
    return (
      `You can reach me at:\n` +
      `Email: ${packageJson.author.email}\n` +
      `GitHub: ${hyperlink(packageJson.author.github)}\n` +
      `LinkedIn: ${hyperlink(packageJson.author.linkedin)}\n`
    );
  },
  cv: () => {
    window.open('cv.pdf');
    return `Downloading CV...`;
  },
  education: () => {
    return education
      .map((edu) => {
        const header = `${bold(edu.degree)} in ${edu.field}\n  Institution: ${
          edu.institution
        } (${edu.location}) | ${edu.startDate} to ${edu.endDate}`;
        return `- ${header}`;
      })
      .join(`\n`);
  },
  skills: () => {
    return skills
      .map((skill) => {
        const header = `${bold(skill.category)}`
        const skillsList = skill.items.map((item) => `  • ${item}`).join('\n');
        return `${header}\n\n${skillsList}`;
      })
      .join(`\n\n`);
  },
  ls: () => {
    return (
      `cv.pdf\n` +
      `README.md\n` +
      `skills.json\n` +
      `education.json\n` +
      `experience.json\n`
    );
  },
  cat: (args: string[]) => {
    const fileName = args[0];
    switch (fileName) {
      case 'README.md':
        return (
          `# Welcome to my terminal!\n` +
          `This is a simple terminal interface to showcase my portfolio.\n` +
          `You can use the 'help' command to see the list of available commands.\n`
        );
      case 'skills.json':
        return JSON.stringify(skills, null, 2);
      case 'education.json':
        return JSON.stringify(education, null, 2);
      case 'experience.json':
        return JSON.stringify(experience, null, 2);
      case 'cv.pdf':
        return commands.cv(args);
      default:
        return `cat: ${fileName}: No such file or directory`;
    }
  },
  about: () => {
    return (
      `Software engineer with a strong background in backend development, problem-solving, and system optimization. Passionate about open-source technologies, Linux, and competitive programming. Experienced in building efficient and scalable backend solutions, working with databases, and designing APIs. Always eager to learn and apply new technologies, especially in AI and software architecture. Enjoys collaborating in team environments and exploring game and graphics development as a hobby.`
    );
  },
  help: () => {
    return (
      'Available commands:\n' +
      Object.keys(commands)
        .sort()
        .map((cmd) => `\t${cmd}: ${commandDescriptions[cmd] ?? ''}`)
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
    autoTheme.set(false);
    const t = themes.find((t) => t.name === 'light');
    theme.set(t ?? themes[0]);
    return 'Theme set to light';
  },
  dark: () => {
    autoTheme.set(false);
    const t = themes.find((t) => t.name === 'dark');
    theme.set(t ?? themes[0]);
    return 'Theme set to dark';
  },
  'auto-theme': () => {
    autoTheme.set(true);
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selected = themes.find((t) => t.name === (isDark ? 'dark' : 'light'));
    theme.set(selected ?? themes[0]);
    return `Theme set to ${isDark ? 'dark' : 'light'} based on system preference (auto mode enabled)`;
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
