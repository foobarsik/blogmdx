import Link from 'next/link'
import { getPosts } from './utils/get-posts'
import {getTags} from "./utils/get-tags";
import PostCard from './PostCard'

export const metadata = {
    title: 'Blog MehWow - Olga Panibratchenko'
}

export default async function PostsPage() {
    const tags = await getTags()
    const posts = await getPosts()
    const allTags = Object.create(null)

    for (const tag of tags) {
        allTags[tag] ??= 0
        allTags[tag] += 1
    }
    return (
        <div data-pagefind-ignore="all">
            <div className="not-prose flex flex-wrap gap-2 mb-14">
                {Object.entries(allTags).map(([tag, count]) => (
                    <Link key={tag} href={`/tags/${tag}`} className="nextra-tag">
                        {tag}
                    </Link>
                ))}
            </div>
            {posts.map(post => (
                <PostCard key={post.route} post={post} />
            ))}
        </div>
    )
}
