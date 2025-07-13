import {getPosts} from "./get-posts";

export async function getTags() {
    const posts = await getPosts()

    return posts.flatMap(post => post.frontMatter.tags ?? [])
}
