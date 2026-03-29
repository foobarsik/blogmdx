import { NextResponse } from 'next/server'
import {
    createComment,
    getApprovedComments,
    isCommentsEnabled
} from '../../../lib/comments'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const postSlug = String(searchParams.get('postSlug') ?? '').trim()

    if (!postSlug) {
        return NextResponse.json({ error: 'postSlug is required.' }, { status: 400 })
    }

    if (!isCommentsEnabled()) {
        return NextResponse.json({ comments: [], enabled: false })
    }

    const comments = await getApprovedComments(postSlug)

    return NextResponse.json({ comments, enabled: true })
}

export async function POST(request) {
    let payload

    try {
        payload = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const result = await createComment(payload)

    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(
        {
            message: 'Comment submitted and awaiting moderation.',
            moderationStatus: result.data.moderationStatus
        },
        { status: result.status }
    )
}
