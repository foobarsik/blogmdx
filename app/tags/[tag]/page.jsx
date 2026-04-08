import { buildSeoMetadata } from '../../../lib/seo'
import {getPosts} from '../../posts/utils/get-posts'
import {getTags} from "../../posts/utils/get-tags";
import PostCard from "../../posts/PostCard";

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

    return (
        <>
            <h1># {decodedTag}</h1>
            {posts
                .filter(post => (post.frontMatter.tags ?? []).includes(decodedTag))
                .map(post => (<PostCard key={post.route} post={post}/>))}
        </>
    )
}
