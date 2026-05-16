'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function TopBackLink() {
    const pathname = usePathname()
    const isNestedPage = pathname.split('/').length > 2

    if (!isNestedPage) {
        return null
    }

    return (
        <Link href="/posts" className="top-back-link x:print:hidden">
            Back to posts
        </Link>
    )
}
