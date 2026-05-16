import { buildSeoMetadata } from '../../../lib/seo'
import { getPosts } from '../../posts/utils/get-posts'
import { getTags } from '../../posts/utils/get-tags'
import PostCard from '../../posts/PostCard'

export async function generateMetadata(props) {
    const params = await props.params
    const decodedTag = decodeURIComponent(params.tag)

    return buildSeoMetadata({
        title: `Tag: ${decodedTag}`,
        description: `Posts tagged with ${decodedTag}.`,
        pathname: `/tags/${encodeURIComponent(decodedTag)}`
    })
}

export async function generateStaticParams() {
    const allTags = await getTags()
    return [...new Set(allTags)].map(tag => ({tag}))
}

export default async function TagPage(props) {
    const params = await props.params
    const decodedTag = decodeURIComponent(params.tag)
    const posts = await getPosts()
    const taggedPosts = posts.filter(post => (post.frontMatter.tags ?? []).includes(decodedTag))

    return (
        <div data-pagefind-ignore="all" className="tag-page site-shell not-prose">
            <header className="tag-page-header">
                <p className="tag-page-kicker">Topic</p>
                <h1 className="tag-page-title"># {decodedTag}</h1>
                <p className="tag-page-count">
                    {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'}
                </p>
            </header>
            <section className="posts-grid">
                {taggedPosts.map((post, index) => (
                    <PostCard
                        key={post.route}
                        post={post}
                        tone={index % 2 === 0 ? 'blue' : 'gold'}
                    />
                ))}
            </section>
        </div>
    )
}
