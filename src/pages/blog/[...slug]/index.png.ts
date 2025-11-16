import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => {
    // Get the path segments from filePath, excluding the collection folder and filename
    const pathSegments = post.filePath
      ?.replace("src/data/blog/", "")
      .split("/")
      .filter(path => path !== "")
      .slice(0, -1) // remove filename
      .map(segment => segment.toLowerCase().replace(/\s+/g, "-")) || [];
    
    // For dynamic routes, we just need the slug (post.id), not the full /blog/slug path
    const slug = post.id.split("/").slice(-1)[0];
    const routeSlug = pathSegments.length > 0 ? [...pathSegments, slug].join("/") : slug;
    
    return {
      params: { slug: routeSlug },
      props: post,
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const buffer = await generateOgImageForPost(props as CollectionEntry<"blog">);
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
};
