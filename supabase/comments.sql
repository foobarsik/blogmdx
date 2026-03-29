create extension if not exists pgcrypto;

create table if not exists public.comments (
    id uuid primary key default gen_random_uuid(),
    post_slug text not null,
    author_name varchar(80) not null,
    author_email varchar(160) not null,
    author_website varchar(300),
    content text not null,
    approved boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.comments
    add column if not exists author_website varchar(300);

create index if not exists comments_post_slug_created_idx
    on public.comments (post_slug, created_at desc);

create index if not exists comments_post_slug_approved_idx
    on public.comments (post_slug, approved);

alter table public.comments enable row level security;

-- Allow reading only approved comments
drop policy if exists "comments_select_approved" on public.comments;
create policy "comments_select_approved"
    on public.comments
    for select
    to anon
    using (approved = true);

-- Allow anyone to insert comments, always pending moderation
drop policy if exists "comments_insert_pending" on public.comments;
create policy "comments_insert_pending"
    on public.comments
    for insert
    to anon
    with check (approved = false);
