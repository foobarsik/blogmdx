'use client';

import {Link} from 'next-view-transitions';

// Tag the clicked card's title so the view transition can morph it into the
// article <h1>. Only one element per page may carry the name, hence the reset.
function markTitleForTransition(event) {
    document.querySelectorAll('.posts-card-title').forEach(el => {
        el.style.viewTransitionName = '';
    });
    const title = event.currentTarget.querySelector('.posts-card-title');
    if (title) {
        title.style.viewTransitionName = 'post-title';
    }
}

// Feed cursor position to the CSS spotlight gradient (see .posts-card::after).
function trackSpotlight(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mw-spot-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mw-spot-y', `${event.clientY - rect.top}px`);
}

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
            <Link href={route} className={`${cardClass} posts-card-link`} aria-label={cardLabel} onClick={markTitleForTransition} onMouseMove={trackSpotlight}>
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
        <Link href={route} className={`${cardClass} posts-card-link`} aria-label={cardLabel} onClick={markTitleForTransition} onMouseMove={trackSpotlight}>
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
