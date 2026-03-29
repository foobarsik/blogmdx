import { getSupabaseServerClient, isSupabaseConfigured } from './supabase-server'

const MAX_NAME_LENGTH = 80
const MAX_EMAIL_LENGTH = 160
const MAX_WEBSITE_LENGTH = 300
const MAX_MESSAGE_LENGTH = 2000

function normalizeInput(value) {
    return String(value ?? '').trim()
}

function isMissingColumnError(error, columnName) {
    if (!error) {
        return false
    }

    const message = `${error.message ?? ''} ${error.details ?? ''} ${error.hint ?? ''}`.toLowerCase()
    return error.code === '42703' || message.includes(columnName.toLowerCase())
}

function formatWriteError(error) {
    if (!error) {
        return 'Could not save the comment. Please try again later.'
    }

    if (error.code === '42501') {
        return 'Database policy error. Please run supabase/comments.sql and try again.'
    }

    return 'Could not save the comment. Please try again later.'
}

function validatePayload(payload) {
    const postSlug = normalizeInput(payload.postSlug)
    const authorName = normalizeInput(payload.authorName)
    const authorEmail = normalizeInput(payload.authorEmail).toLowerCase()
    const authorWebsite = normalizeInput(payload.authorWebsite)
    const content = normalizeInput(payload.content)

    if (!postSlug || !authorName || !authorEmail || !content) {
        return { error: 'Please fill in all required fields.' }
    }

    if (authorName.length > MAX_NAME_LENGTH) {
        return { error: `Name must be at most ${MAX_NAME_LENGTH} characters.` }
    }

    if (authorEmail.length > MAX_EMAIL_LENGTH) {
        return { error: `Email must be at most ${MAX_EMAIL_LENGTH} characters.` }
    }

    if (!authorEmail.includes('@')) {
        return { error: 'Invalid email address.' }
    }

    if (authorWebsite.length > MAX_WEBSITE_LENGTH) {
        return { error: `Website URL must be at most ${MAX_WEBSITE_LENGTH} characters.` }
    }

    let normalizedWebsite = ''

    if (authorWebsite) {
        const candidate = /^https?:\/\//i.test(authorWebsite)
            ? authorWebsite
            : `https://${authorWebsite}`

        try {
            normalizedWebsite = new URL(candidate).toString()
        } catch {
            return { error: 'Invalid website URL.' }
        }
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
        return { error: `Comment must be at most ${MAX_MESSAGE_LENGTH} characters.` }
    }

    return {
        data: {
            postSlug,
            authorName,
            authorEmail,
            authorWebsite: normalizedWebsite,
            content
        }
    }
}

export function isCommentsEnabled() {
    return isSupabaseConfigured()
}

export async function getApprovedComments(postSlug) {
    if (!isCommentsEnabled() || !postSlug) {
        return []
    }

    const supabase = getSupabaseServerClient()

    if (!supabase) {
        return []
    }

    let { data, error } = await supabase
        .from('comments')
        .select('id, author_name, author_website, content, created_at')
        .eq('post_slug', postSlug)
        .eq('approved', true)
        .order('created_at', { ascending: false })

    if (isMissingColumnError(error, 'author_website')) {
        const fallback = await supabase
            .from('comments')
            .select('id, author_name, content, created_at')
            .eq('post_slug', postSlug)
            .eq('approved', true)
            .order('created_at', { ascending: false })

        data = (fallback.data ?? []).map(comment => ({
            ...comment,
            author_website: null
        }))
        error = fallback.error
    }

    if (error) {
        console.error('[comments:getApprovedComments]', error)
        return []
    }

    return data ?? []
}

export async function createComment(payload) {
    if (!isCommentsEnabled()) {
        return { ok: false, status: 500, error: 'Comments are temporarily unavailable.' }
    }

    const validated = validatePayload(payload)

    if (validated.error) {
        return { ok: false, status: 400, error: validated.error }
    }

    const supabase = getSupabaseServerClient()

    if (!supabase) {
        return { ok: false, status: 500, error: 'Comments are temporarily unavailable.' }
    }

    let { error } = await supabase
        .from('comments')
        .insert({
            post_slug: validated.data.postSlug,
            author_name: validated.data.authorName,
            author_email: validated.data.authorEmail,
            author_website: validated.data.authorWebsite || null,
            content: validated.data.content,
            approved: false
        })

    if (isMissingColumnError(error, 'author_website')) {
        const fallback = await supabase
            .from('comments')
            .insert({
                post_slug: validated.data.postSlug,
                author_name: validated.data.authorName,
                author_email: validated.data.authorEmail,
                content: validated.data.content,
                approved: false
            })

        error = fallback.error
    }

    if (error) {
        console.error('[comments:createComment]', error)
        return { ok: false, status: 500, error: formatWriteError(error) }
    }

    return {
        ok: true,
        status: 201,
        data: {
            moderationStatus: 'pending'
        }
    }
}
