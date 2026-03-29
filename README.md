# Portfolio Starter Kit

This portfolio is built with **Next.js** and a library called [Nextra](https://nextra.vercel.app/). It allows you to write Markdown and focus on the _content_ of your portfolio. This starter includes:

- Automatically configured to handle Markdown/MDX
- Generates an RSS feed based on your posts
- A beautiful theme included out of the box
- Easily categorize posts with tags
- Fast, optimized web font loading

https://demo.vercel.blog

## Configuration

1. Update your name in `theme.config.js` or change the footer.
1. Update your name and site URL for the RSS feed in `scripts/gen-rss.js`.
1. Update the meta tags in `pages/_document.tsx`.
1. Update the posts inside `pages/posts/*.md` with your own content.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/blog&project-name=portfolio&repository-name=portfolio)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example blog my-blog
```

```bash
yarn create next-app --example blog my-blog
```

```bash
pnpm create next-app --example blog my-blog
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Comments (Supabase + moderation)

This project includes comments for post pages (`/posts/*`) with manual moderation.

- The form has 4 fields: `email`, `name`, `website (optional)`, `comment`.
- New comments are saved with `approved = false`.
- Only comments with `approved = true` are shown on the site.

### 1) Create table and policies in Supabase

Run SQL from:

`supabase/comments.sql`

### 2) Configure environment variables

Add these variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is also supported as an alternative key name.

### 3) Manual moderation

Approve a comment manually in Supabase SQL editor:

```sql
update public.comments
set approved = true
where id = 'COMMENT_ID';
```
