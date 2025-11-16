/**
 * Prepend the base URL to a path
 * @param path - the path to prepend the base URL to
 * @returns the path with the base URL prepended
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  
  // If path already starts with the base, return it as is
  if (path.startsWith(base) && base !== "/") {
    return path;
  }
  
  // Remove leading slash from path if it exists
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Combine base with path
  const combined = base.endsWith("/")
    ? `${base}${normalizedPath}`
    : `${base}/${normalizedPath}`;
  
  return combined;
}
