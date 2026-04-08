import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'
import PostsPage, { metadata as postsMetadata } from '../posts/page'
import { getPosts } from '../posts/utils/get-posts'
import CommentsSection from '../components/comments/CommentsSection'
import { isCommentsEnabled } from '../../lib/comments'
import ArticleAnalytics from '../components/ArticleAnalytics'
import Link from 'next/link'
import { SITE_DESCRIPTION, buildSeoMetadata } from '../../lib/seo'

const generateStaticParamsBase = generateStaticParamsFor('mdxPath')
const normalizeMdxPath = mdxPath =>
    Array.isArray(mdxPath) ? mdxPath.filter(Boolean) : []
const isInternalNextAssetPath = mdxPath => mdxPath[0] === '_next'
const isPostsIndexPath = mdxPath => mdxPath.length === 1 && mdxPath[0] === 'posts'
const isPostPath = mdxPath => mdxPath[0] === 'posts' && mdxPath.length > 1

export async function generateStaticParams() {
    const paramsList = await generateStaticParamsBase()

    return paramsList
        .map(({ mdxPath, ...rest }) => ({
            ...rest,
            mdxPath: normalizeMdxPath(mdxPath)
        }))
        .filter(({ mdxPath }) => !isPostsIndexPath(mdxPath))
}

export async function generateMetadata(props) {
    const params = await props.params
    const mdxPath = normalizeMdxPath(params?.mdxPath)

    if (isInternalNextAssetPath(mdxPath)) {
        return {}
    }

    if (isPostsIndexPath(mdxPath)) {
        return postsMetadata
    }

    try {
        const { metadata } = await importPage(mdxPath)
        const pathname = mdxPath.length > 0 ? `/${mdxPath.join('/')}` : '/'
        const title =
            typeof metadata?.title === 'string'
                ? metadata.title
                : Array.isArray(metadata?.title)
                    ? metadata.title.join(' ')
                    : undefined

        return {
            ...metadata,
            ...buildSeoMetadata({
                title,
                description: metadata?.description || SITE_DESCRIPTION,
                pathname,
                image: metadata?.cover,
                type: isPostPath(mdxPath) ? 'article' : 'website',
                publishedTime: metadata?.date,
                tags: metadata?.tags
            })
        }
    } catch {
        return {}
    }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
    const params = await props.params
    const mdxPath = normalizeMdxPath(params?.mdxPath)

    if (isInternalNextAssetPath(mdxPath)) {
        notFound()
    }

    if (isPostsIndexPath(mdxPath)) {
        return <PostsPage />
    }

    let result

    try {
        result = await importPage(mdxPath)
    } catch {
        notFound()
    }

    const { default: MDXContent, toc, metadata } = result
    const postSlug = mdxPath.join('/')
    const showComments = isPostPath(mdxPath)
    const commentsEnabled = isCommentsEnabled()
    const articleSlug = showComments ? mdxPath.slice(1).join('/') : postSlug
    const currentPostRoute = `/${mdxPath.join('/')}`
    const allPosts = showComments ? await getPosts() : []
    const articleTitle =
        typeof metadata?.title === 'string'
            ? metadata.title
            : Array.isArray(metadata?.title)
                ? metadata.title.join(' ')
                : articleSlug

    const postContent = (
        <>
            {showComments ? (
                <ArticleAnalytics
                    articleSlug={articleSlug}
                    articleTitle={articleTitle}
                />
            ) : null}
            <div data-article-content>
                <MDXContent {...props} params={{ ...(params ?? {}), mdxPath }} />
            </div>
            {showComments ? (
                <CommentsSection
                    postSlug={postSlug}
                    enabled={commentsEnabled}
                />
            ) : null}
        </>
    )

    if (!showComments) {
        return (
            <Wrapper toc={toc} metadata={metadata}>
                {postContent}
            </Wrapper>
        )
    }

    return (
        <div className="post-page-shell">
            <aside className="post-page-sidebar not-prose" aria-label="All posts">
                <p className="post-page-sidebar-title">All posts</p>
                <nav className="post-page-sidebar-nav">
                    {allPosts.map(post => {
                        const postTitle = post.frontMatter?.title || post.title || post.name
                        const isCurrentPost = post.route === currentPostRoute

                        return (
                            <Link
                                key={post.route}
                                href={post.route}
                                className={`post-page-sidebar-link${isCurrentPost ? ' post-page-sidebar-link-active' : ''}`}
                                aria-current={isCurrentPost ? 'page' : undefined}
                            >
                                {postTitle}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
            <div className="post-page-shell-main">
                <Wrapper toc={toc} metadata={metadata}>
                    {postContent}
                </Wrapper>
            </div>
        </div>
    )
}
