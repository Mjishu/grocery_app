export function readStringList(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function toggleStringListItem(key: string, item: string) {
  const current = readStringList(key);
  const next = current.includes(item) ? current.filter((value) => value !== item) : [...current, item];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}
