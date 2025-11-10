# My Blog

A modern blog built with Astro.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The site will be available at `http://localhost:4321`.

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── data/
│   │   └── blog/    # Blog posts (add .md files here)
│   ├── layouts/     # Page layouts
│   ├── pages/       # Page routes
│   ├── styles/      # Global styles
│   ├── utils/       # Utility functions
│   └── config.ts    # Site configuration
└── astro.config.ts  # Astro configuration
```

## Adding Blog Posts

Create new `.md` files in `src/data/blog/` directory. Each post should have frontmatter:

```yaml
---
author: Your Name
pubDatetime: 2025-01-01T00:00:00Z
title: "Post Title"
slug: post-slug
description: "Post description"
draft: false
tags:
  - tag1
  - tag2
---

Your content here...
```

## Available Commands

| Command              | Action                                   |
| :------------------- | :--------------------------------------- |
| `pnpm run dev`       | Start local dev server                   |
| `pnpm run build`     | Build for production                     |
| `pnpm run preview`   | Preview production build locally         |
| `pnpm run format`    | Format code with Prettier                |
| `pnpm run lint`      | Lint with ESLint                         |

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Linting**: [ESLint](https://eslint.org)

## Configuration

Edit `src/config.ts` to customize your site settings:

```typescript
export const SITE = {
  website: "https://example.com/",
  author: "Your Name",
  title: "My Blog",
  desc: "A blog built with Astro",
  // ... more settings
};
```

## License

MIT
