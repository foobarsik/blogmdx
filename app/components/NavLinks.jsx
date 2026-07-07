"use client";
import {usePathname} from "next/navigation";
import {Link} from "next-view-transitions";

const links = [
    {href: "/posts", label: "Posts"},
    {href: "/projects", label: "Projects"},
    {href: "/", label: "About"},
];

export default function NavLinks() {
    const pathname = usePathname();

    const isLinkActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <nav className="nav-container">
            {links.map(({href, label}) => (
                <Link
                    key={href}
                    href={href}
                    className={`nav-link${isLinkActive(href) ? " active-link" : ""}`}
                    aria-current={isLinkActive(href) ? "page" : undefined}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
