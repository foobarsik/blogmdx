import { buildSeoMetadata } from '../../lib/seo'
import { getPosts } from './utils/get-posts'
import PostCard from './PostCard'

export const metadata = buildSeoMetadata({
    title: 'Posts',
    description: 'Notes on product thinking, engineering, UX, and travel field notes.',
    pathname: '/posts'
})

export default async function PostsPage() {
    // const tags = await getTags()
    const posts = await getPosts()
    // const allTags = Object.create(null)

    // for (const tag of tags) {
    //     allTags[tag] ??= 0
    //     allTags[tag] += 1
    // }

    return (
        <div data-pagefind-ignore="all" className="posts-page site-shell not-prose">
            <section className="posts-grid">
            {/*
            <div className="not-prose flex flex-wrap gap-2 mb-14">
                {Object.entries(allTags).map(([tag, count]) => (
                    <Link key={tag} href={`/tags/${tag}`} className="nextra-tag">
                        {tag}
                    </Link>
                ))}
            </div>
            */}
            {posts.map((post, index) => (
                <PostCard
                    key={post.route}
                    post={post}
                    featured={index === 0}
                    tone={index % 2 === 0 ? 'blue' : 'gold'}
                />
            ))}
            </section>
        </div>
    )
}
