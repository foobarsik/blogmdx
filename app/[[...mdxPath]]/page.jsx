import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'
import PostsPage, { metadata as postsMetadata } from '../posts/page'
import CommentsSection from '../components/comments/CommentsSection'
import { isCommentsEnabled } from '../../lib/comments'

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
        return metadata
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

    return (
        <Wrapper toc={toc} metadata={metadata}>
            <MDXContent {...props} params={{ ...(params ?? {}), mdxPath }} />
            {showComments ? (
                <CommentsSection
                    postSlug={postSlug}
                    enabled={commentsEnabled}
                />
            ) : null}
        </Wrapper>
    )
}
