#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, "..", "src", "data", "blog");

// Ensure blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const formatDate = (date) => {
  return date.toISOString();
};

async function createNewPost() {
  console.log("\n📝 Create a new blog post\n");

  // Get required inputs
  const title = await question("Title: ");
  if (!title.trim()) {
    console.error("❌ Title is required");
    rl.close();
    process.exit(1);
  }

  const description = await question("Description: ");
  if (!description.trim()) {
    console.error("❌ Description is required");
    rl.close();
    process.exit(1);
  }

  const author = await question("Author (default: Farhan): ");
  const tagsInput = await question("Tags (comma-separated, default: others): ");
  const draftInput = await question("Draft? (y/n, default: n): ");
  const customSlugInput = await question("Custom slug (leave empty to auto-generate): ");

  // Process inputs
  const slug = customSlugInput.trim() ? customSlugInput.trim() : slugify(title);
  const author_final = author.trim() || "Farhan";
  const tags = tagsInput.trim()
    ? tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : ["others"];
  const isDraft = draftInput.toLowerCase() === "y";
  const now = new Date();

  // Check if file already exists
  const fileName = `${slug}.md`;
  const filePath = path.join(BLOG_DIR, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`❌ File already exists: ${fileName}`);
    rl.close();
    process.exit(1);
  }

  // Create frontmatter
  const frontmatter = `---
author: "${author_final}"
pubDatetime: ${formatDate(now)}
title: "${title}"
slug: "${slug}"
description: "${description}"
draft: ${isDraft}
tags:
${tags.map((t) => `  - ${t}`).join("\n")}
---

<!-- Write your post content here -->
`;

  try {
    fs.writeFileSync(filePath, frontmatter);
    console.log(`\n✅ Post created successfully: ${fileName}`);
    console.log(`📂 Location: ${filePath}\n`);
  } catch (error) {
    console.error(`❌ Error creating post: ${error.message}`);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

createNewPost().catch((error) => {
  console.error("❌ Error:", error);
  rl.close();
  process.exit(1);
});
