import Link from 'next/link';

export default function PostCard({post}) {
    const {route, frontMatter} = post;
    const {title, description, date, cover} = frontMatter || {};

    return (
        <Link href={route} className="post-card-link block overflow-hidden my-12 first:mt-0 last:mb-0 group no-underline">
            {cover && (
                <div className="relative rounded-[12px] overflow-hidden mb-4">
                    <img
                        src={cover}
                        alt={title}
                        className="post-card-image-muted w-full h-[150px] sm:h-[222px] object-cover block p-0 m-0 transition-transform group-hover:scale-[1.1]"
                    />
                </div>
            )}
            <div>
                <h3 className="post-card-title">{title}</h3>
                <p className="post-card-description mt-1 x:mb-2">{description}</p>
            </div>
        </Link>
    );
}
