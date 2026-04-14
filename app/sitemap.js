import fs from 'node:fs/promises'
import path from 'node:path'
import { getSiteUrl } from '../lib/seo'
import { getPosts } from './posts/utils/get-posts'
import { getTags } from './posts/utils/get-tags'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const CONTENT_EXT_PATTERN = /\.(md|mdx)$/i

async function collectContentFiles(dirPath, acc = []) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
        const absolutePath = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
            await collectContentFiles(absolutePath, acc)
            continue
        }

        if (entry.isFile() && CONTENT_EXT_PATTERN.test(entry.name)) {
            acc.push(absolutePath)
        }
    }

    return acc
}

function contentFileToRoute(filePath) {
    const relativePath = path.relative(CONTENT_DIR, filePath)
    const withoutExtension = relativePath.replace(CONTENT_EXT_PATTERN, '')
    const segments = withoutExtension
        .split(path.sep)
        .filter(Boolean)

    // /posts URLs come from getPosts to include frontmatter dates.
    if (segments[0] === 'posts') {
        return null
    }

    if (segments.at(-1) === 'index') {
        segments.pop()
    }

    return segments.length > 0 ? `/${segments.join('/')}` : '/'
}

function toAbsoluteUrl(pathname, siteUrl) {
    return new URL(pathname, `${siteUrl}/`).toString()
}

function toDate(value) {
    if (!value) {
        return undefined
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap() {
    const siteUrl = getSiteUrl()
    const [contentFiles, posts, tags] = await Promise.all([
        collectContentFiles(CONTENT_DIR),
        getPosts(),
        getTags()
    ])

    const staticRoutes = new Set(['/posts'])

    for (const filePath of contentFiles) {
        const route = contentFileToRoute(filePath)

        if (route) {
            staticRoutes.add(route)
        }
    }

    const staticEntries = [...staticRoutes].map(route => ({
        url: toAbsoluteUrl(route, siteUrl),
        changeFrequency: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 1 : 0.7
    }))

    const postEntries = posts.map(post => ({
        url: toAbsoluteUrl(post.route, siteUrl),
        lastModified: toDate(post.frontMatter?.date),
        changeFrequency: 'monthly',
        priority: 0.8
    }))

    const tagEntries = [...new Set(tags)].map(tag => ({
        url: toAbsoluteUrl(`/tags/${encodeURIComponent(tag)}`, siteUrl),
        changeFrequency: 'weekly',
        priority: 0.6
    }))

    return [...staticEntries, ...postEntries, ...tagEntries]
}
