"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";

const links = [
    {href: "/posts", label: "Posts"},
    {href: "/projects", label: "Projects"},
    {href: "/", label: "About me"},
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="nav-container justify-between">
            {links.map(({href, label}) => (
                <Link
                    key={href}
                    href={href}
                    className={`nav-link${pathname === href ? " active-link" : ""}`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
