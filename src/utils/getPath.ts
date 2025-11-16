import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import { withBase } from "./withBase";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value (doesn't affect /blog/ prefix)
 * @returns blog post path with /blog/ prefix
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  const basePath = includeBase ? "/posts" : "";

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slugArray = blogId.length > 0 ? blogId.slice(-1) : blogId;
  const slug = Array.isArray(slugArray) ? slugArray[0] : slugArray;

  // If not inside the sub-dir, simply return the file path
  let path: string;
  if (!pathSegments || pathSegments.length < 1) {
    // Always include leading slash
    path = basePath ? `${basePath}/${slug}` : `/${slug}`;
  } else {
    path = [basePath, ...pathSegments, slug].filter(Boolean).join("/");
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
  }

  // Always apply withBase() to ensure /blog/ prefix
  return withBase(path);
}
