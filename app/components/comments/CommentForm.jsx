'use client'

import { useState } from 'react'

const initialValues = {
    authorEmail: '',
    authorName: '',
    authorWebsite: '',
    content: ''
}

export default function CommentForm({ postSlug, enabled, onSubmitted }) {
    const [values, setValues] = useState(initialValues)
    const [status, setStatus] = useState({ type: 'idle', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    function onChange(event) {
        const { name, value } = event.target
        setValues(prev => ({ ...prev, [name]: value }))

        if (status.type !== 'idle') {
            setStatus({ type: 'idle', message: '' })
        }
    }

    async function onSubmit(event) {
        event.preventDefault()

        if (!enabled) {
            setStatus({ type: 'error', message: 'Comments are temporarily unavailable.' })
            return
        }

        setIsSubmitting(true)
        setStatus({ type: 'idle', message: '' })

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postSlug,
                    authorEmail: values.authorEmail,
                    authorName: values.authorName,
                    authorWebsite: values.authorWebsite,
                    content: values.content
                })
            })

            const result = await response.json()

            if (!response.ok) {
                setStatus({
                    type: 'error',
                    message: result?.error || 'Could not submit your comment.'
                })
                return
            }

            setValues(initialValues)
            setStatus({
                type: 'success',
                message: 'Thanks. Your comment was submitted and is awaiting moderation.'
            })

            if (typeof onSubmitted === 'function') {
                onSubmitted()
            }
        } catch {
            setStatus({
                type: 'error',
                message: 'Network error. Please try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="comment-form" onSubmit={onSubmit}>
            <div className="comment-form-grid">
                <label className="comment-field">
                    <span>Email</span>
                    <input
                        type="email"
                        name="authorEmail"
                        autoComplete="email"
                        value={values.authorEmail}
                        onChange={onChange}
                        maxLength={160}
                        placeholder="Your email will never be published."
                        required
                    />
                </label>

                <label className="comment-field">
                    <span>Name</span>
                    <input
                        type="text"
                        name="authorName"
                        autoComplete="name"
                        value={values.authorName}
                        onChange={onChange}
                        maxLength={80}
                        required
                    />
                </label>
            </div>

            <label className="comment-field">
                <span>Website (optional)</span>
                <input
                    type="url"
                    name="authorWebsite"
                    autoComplete="url"
                    value={values.authorWebsite}
                    onChange={onChange}
                    maxLength={300}
                    placeholder="https://example.com"
                />
            </label>

            <label className="comment-field">
                <span>Comment</span>
                <textarea
                    name="content"
                    rows={5}
                    value={values.content}
                    onChange={onChange}
                    maxLength={2000}
                    required
                />
            </label>

            <button type="submit" className="comment-submit" disabled={isSubmitting || !enabled}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {status.type !== 'idle' ? (
                <p
                    className={`comment-status comment-status-${status.type}`}
                    role={status.type === 'error' ? 'alert' : 'status'}
                    aria-live={status.type === 'error' ? 'assertive' : 'polite'}
                >
                    {status.message}
                </p>
            ) : null}
        </form>
    )
}
