const SITE_NAME = 'MehWow'
const SITE_TITLE = 'MehWow Blog'
const SITE_URL = 'https://mehwow.com'
const SITE_DESCRIPTION =
    'Essays on product thinking, frontend engineering, UX, and field notes by Olga Panibratchenko.'
const DEFAULT_OG_IMAGE = '/images/me.jpeg'
const AUTHOR_NAME = 'Olga Panibratchenko'

function trimTrailingSlash(value) {
    return value.endsWith('/') ? value.slice(0, -1) : value
}

function withProtocol(value) {
    if (!value) {
        return value
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value
    }

    return `https://${value}`
}

function normalizeSiteUrl(value) {
    if (!value) {
        return null
    }

    try {
        return trimTrailingSlash(new URL(withProtocol(value)).toString())
    } catch {
        return null
    }
}

export function getSiteUrl() {
    const candidates = [
        process.env.NEXT_PUBLIC_SITE_URL,
        process.env.SITE_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
        process.env.VERCEL_URL
    ]

    for (const candidate of candidates) {
        const normalized = normalizeSiteUrl(candidate)

        if (normalized) {
            return normalized
        }
    }

    return SITE_URL
}

export function getMetadataBase() {
    return new URL(getSiteUrl())
}

export function getAbsoluteUrl(pathname = '/') {
    return new URL(pathname, getMetadataBase()).toString()
}

export function getSocialImageUrl(imagePath = DEFAULT_OG_IMAGE) {
    if (!imagePath) {
        return getAbsoluteUrl(DEFAULT_OG_IMAGE)
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
    }

    return getAbsoluteUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`)
}

function normalizeTitle(title) {
    if (typeof title === 'string') {
        return title
    }

    if (Array.isArray(title)) {
        return title.join(' ')
    }

    return SITE_TITLE
}

export function buildSeoMetadata({
    title,
    description = SITE_DESCRIPTION,
    pathname = '/',
    image,
    type = 'website',
    publishedTime,
    tags
} = {}) {
    const normalizedTitle = normalizeTitle(title)
    const socialImageUrl = getSocialImageUrl(image)

    const metadata = {
        title: normalizedTitle,
        description,
        alternates: {
            canonical: pathname
        },
        openGraph: {
            title: normalizedTitle,
            description,
            url: getAbsoluteUrl(pathname),
            siteName: SITE_NAME,
            locale: 'en_US',
            type,
            images: [
                {
                    url: socialImageUrl
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: normalizedTitle,
            description,
            images: [socialImageUrl]
        }
    }

    if (type === 'article') {
        metadata.openGraph.publishedTime = publishedTime
        metadata.openGraph.authors = [AUTHOR_NAME]
        metadata.openGraph.tags = Array.isArray(tags) ? tags : []
    }

    return metadata
}

export {
    AUTHOR_NAME,
    DEFAULT_OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE
}
