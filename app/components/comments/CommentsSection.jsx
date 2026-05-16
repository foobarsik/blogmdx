'use client'

import { useCallback, useEffect, useState } from 'react'
import CommentForm from './CommentForm'

function formatDate(dateValue) {
    if (!dateValue) {
        return ''
    }

    const date = new Date(dateValue)

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

export default function CommentsSection({ postSlug, enabled }) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(enabled)
    const [loadError, setLoadError] = useState('')

    const loadComments = useCallback(async () => {
        if (!enabled) {
            setComments([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setLoadError('')

        try {
            const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result?.error || 'Could not load comments.')
            }

            setComments(Array.isArray(result.comments) ? result.comments : [])
        } catch (error) {
            setLoadError(error.message || 'Could not load comments.')
        } finally {
            setIsLoading(false)
        }
    }, [enabled, postSlug])

    useEffect(() => {
        loadComments()
    }, [loadComments])

    return (
        <section className="comments-section not-prose" aria-labelledby="comments-title">
            <div className="comments-header">
                <p className="comments-kicker">Discussion</p>
                <h2 id="comments-title" className="comments-title">Comments</h2>
            </div>

            {!enabled ? (
                <p className="comments-state" role="status" aria-live="polite">
                    Comments are disabled. Add Supabase environment variables to enable them.
                </p>
            ) : null}

            {isLoading ? (
                <p className="comments-state" role="status" aria-live="polite">Loading comments...</p>
            ) : loadError ? (
                <p className="comment-status comment-status-error" role="alert">{loadError}</p>
            ) : comments.length > 0 ? (
                <ul className="comments-list">
                    {comments.map(comment => (
                        <li key={comment.id} className="comment-item">
                            <p className="comment-meta">
                                <strong>
                                    {comment.author_website ? (
                                        <a
                                            href={comment.author_website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="comment-author-link"
                                        >
                                            {comment.author_name}
                                        </a>
                                    ) : (
                                        comment.author_name
                                    )}
                                </strong>
                                <span>{formatDate(comment.created_at)}</span>
                            </p>
                            <p className="comment-content">{comment.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="comments-state" role="status" aria-live="polite">No published comments yet.</p>
            )}

            <h3 className="comments-subtitle">Leave a comment</h3>
            <p className="comments-note">Your comment will be visible on the site only after moderation.</p>
            <CommentForm postSlug={postSlug} enabled={enabled} onSubmitted={loadComments} />
        </section>
    )
}
