export function colorize(
  text: string,
  color: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan"
): string {
  const colors: Record<typeof color, string> = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
  };
  const reset = "\x1b[0m";
  return `${colors[color]}${text}${reset}`;
}

export function bold(text: string): string {
  return `\x1b[1m${text}\x1b[22m`;
}

export function italic(text: string): string {
  return `\x1b[3m${text}\x1b[23m`;
}

export function underline(text: string): string {
  return `\x1b[4m${text}\x1b[24m`;
}

export function strikethrough(text: string): string {
  return `\x1b[9m${text}\x1b[29m`;
}

export function inverse(text: string): string {
  return `\x1b[7m${text}\x1b[27m`;
}

export function hyperlink(
  url: string,
  text: string = url,
): string {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}