import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

/**
 * Generate the slug path for a blog post
 * Used for catch-all [...slug] route params and OG image generation
 * @param post - The blog post collection entry
 * @returns The normalized slug path (e.g., "category/my-post-title")
 */
export function getSlugPathForPost(post: CollectionEntry<"blog">): string {
  const pathSegments = post.filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "")
    .filter(path => !path.startsWith("_"))
    .slice(0, -1) // remove filename
    .map(segment => slugifyStr(segment)) || [];

  const slug = post.id.split("/").slice(-1)[0];
  const slugPath =
    pathSegments.length > 0 ? [...pathSegments, slug].join("/") : slug;

  return slugPath;
}
