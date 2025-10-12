export function toTitleCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength - 1)}...`;
  }

  return str;
}

export function generateID(): string {
  return Math.random().toString(36).slice(8) + Date.now().toString(36);
}
