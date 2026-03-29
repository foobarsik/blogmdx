'use client'

import { usePathname } from 'next/navigation'
import { useTransitionRouter } from 'next-view-transitions'

export default function TopBackLink() {
    const router = useTransitionRouter()
    const pathname = usePathname()
    const isNestedPage = pathname.split('/').length > 2

    if (!isNestedPage) {
        return null
    }

    return (
        <button type="button" onClick={() => router.back()} className="top-back-link x:print:hidden">
            ← Back
        </button>
    )
}
