/**
 * Prepend the /blog/ path to a path
 * @param path - the path to prepend /blog/ to
 * @returns the path with /blog/ prepended
 */
export function withBase(path: string): string {
  const base = "/blog";
  
  // If path already starts with /blog/, return it as is
  if (path.startsWith(base)) {
    return path;
  }
  
  // Remove leading slash from path if it exists
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Combine /blog with path
  return `${base}/${normalizedPath}`;
}
