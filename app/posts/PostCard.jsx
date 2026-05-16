import Link from 'next/link';

export default function PostCard({post, featured = false, tone = 'blue'}) {
    const {route, frontMatter} = post;
    const {title, description, cover, tags, date} = frontMatter || {};
    const tag = Array.isArray(tags) && tags.length > 0 ? tags[0] : 'Notes';
    const cardClass = `posts-card ${featured ? 'posts-card-featured' : ''} posts-card-${tone}`.trim();
    const formattedDate = date
        ? new Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(new Date(date))
        : '';
    const cardLabel = title ? `Read ${title}` : undefined;

    if (featured) {
        return (
            <Link href={route} className={`${cardClass} posts-card-link`} aria-label={cardLabel}>
                <div className={`posts-card-featured-layout${cover ? '' : ' posts-card-featured-layout-no-media'}`}>
                    <div className="posts-card-featured-copy">
                        <p className="posts-card-meta">
                            <span>{tag}</span>
                            {formattedDate ? <span>{formattedDate}</span> : null}
                        </p>
                        <h2 className="posts-card-title">
                            {title}
                        </h2>
                        {description ? <p className="posts-card-description">{description}</p> : null}
                    </div>

                    {cover ? (
                        <div className="posts-card-featured-media" aria-hidden="true">
                            <img
                                src={cover}
                                alt=""
                                className="posts-card-featured-image"
                                loading="lazy"
                            />
                        </div>
                    ) : null}
                </div>
            </Link>
        );
    }

    return (
        <Link href={route} className={`${cardClass} posts-card-link`} aria-label={cardLabel}>
            <p className="posts-card-meta">
                <span>{tag}</span>
                {formattedDate ? <span>{formattedDate}</span> : null}
            </p>
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

            {description ? <p className="posts-card-description">{description}</p> : null}
        </Link>
    );
}
