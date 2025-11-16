import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(__dirname, "../dist");
const distBlog = path.join(distRoot, "blog");

// Files and directories to move from dist root to dist/blog
const itemsToMove = [
  "_astro",
  "pagefind",
  "404.html",
  "og.png",
  "robots.txt",
  "rss.xml",
  "sitemap-0.xml",
  "sitemap-index.xml",
  "astropaper-og.jpg",
];

console.log("Post-build: Moving all root assets to /blog/ subdirectory...");

itemsToMove.forEach((item) => {
  const srcPath = path.join(distRoot, item);
  const destPath = path.join(distBlog, item);

  // Only proceed if source exists
  if (!fs.existsSync(srcPath)) {
    console.log(`⊘ ${item} not found, skipping`);
    return;
  }

  try {
    // If destination exists, remove it first
    if (fs.existsSync(destPath)) {
      if (fs.statSync(destPath).isDirectory()) {
        fs.rmSync(destPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(destPath);
      }
    }

    // Move the file/directory
    fs.renameSync(srcPath, destPath);
    console.log(`✓ Moved ${item} to /blog/`);
  } catch (error) {
    console.error(`✗ Failed to move ${item}:`, error.message);
  }
});

console.log("Post-build: Fixing asset paths in HTML files...");

// Fix asset paths in all HTML files
function fixPathsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    // Fix _astro paths: /_astro/ → /blog/_astro/
    content = content.replace(/\/_astro\//g, "/blog/_astro/");

    // Fix pagefind paths: /pagefind → /blog/pagefind
    content = content.replace(/\/pagefind\//g, "/blog/pagefind/");

    // Fix og.png: /og.png → /blog/og.png (but not /blog/og.png already)
    content = content.replace(/href="\/og\.png"/g, 'href="/blog/og.png"');
    content = content.replace(/content="\/og\.png"/g, 'content="/blog/og.png"');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Fixed paths in ${path.relative(distBlog, filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Failed to fix paths in ${filePath}:`, error.message);
  }
}

// Walk through all HTML and XML files
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith(".html") || file.endsWith(".xml")) {
      fixPathsInFile(filePath);
    }
  });
}

walkDir(distBlog);

console.log("Post-build complete!");

