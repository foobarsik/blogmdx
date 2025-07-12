"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";

const links = [
    {href: "/posts", label: "Blog"},
    {href: "/projects", label: "Projects"},
    {href: "/", label: "About me"},
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="nav-container">
            {links.map(({href, label}) => (
                <Link
                    key={href}
                    href={href}
                    className={`uppercase nav-link${pathname === href ? " active-link" : ""}`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
