import Link from 'next/link';

export default function PostCard({post, featured = false, tone = 'blue'}) {
    const {route, frontMatter} = post;
    const {title, description, cover, tags} = frontMatter || {};
    const tag = Array.isArray(tags) && tags.length > 0 ? tags[0] : 'Notes';
    const cardClass = `posts-card ${featured ? 'posts-card-featured' : ''} posts-card-${tone}`.trim();

    return (
        <Link href={route} className={`${cardClass} posts-card-link`}>
            <div className="posts-card-tag">{tag}</div>
            <h2 className="posts-card-title">
                {title}
            </h2>

            {!featured && cover ? (
                <div className="posts-card-strip" aria-hidden="true">
                    <img
                        src={cover}
                        alt=""
                        className="posts-card-strip-image"
                        loading="lazy"
                    />
                </div>
            ) : null}

            <p className="posts-card-description">{description}</p>
        </Link>
    );
}
