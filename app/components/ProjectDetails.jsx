'use client'

import {useEffect, useState} from 'react'

export default function ProjectDetails({
    children,
    className,
    summary,
    summaryClassName
}) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(window.matchMedia('(min-width: 741px)').matches)
    }, [])

    return (
        <details className={className} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
            <summary className={summaryClassName}>{summary}</summary>
            {children}
        </details>
    )
}
