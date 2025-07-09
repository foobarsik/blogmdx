import Link from 'next/link';

export default function PostCard({post}) {
    const {route, frontMatter} = post;
    const {title, description, date, cover} = frontMatter || {};

    return (
        <Link href={route} className="block overflow-hidden my-8 group no-underline ">
            {cover && (
                <div className="relative rounded-[10px] overflow-hidden">
                    <img
                        src={cover}
                        alt={title}
                        className="w-full h-[222px] object-cover block p-0 m-0 transition-transform group-hover:scale-[1.1]"
                    />
                    {date && (
                        <div className="absolute bottom-2 right-2 bg-white/80 text-xs text-black px-2 py-1 rounded">
                            {new Date(date).toDateString()}
                        </div>
                    )}
                </div>
            )}
            <div>
                <h3 className="mt-2 mb-0">{title}</h3>
                <p className="x:mb-2 x:dark:text-gray-400 x:text-gray-600">{description}</p>
            </div>
        </Link>
    );
}
