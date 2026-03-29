'use client'

import { useArticleAnalytics } from './useArticleAnalytics'

type ArticleAnalyticsProps = {
    articleSlug: string
    articleTitle: string
    containerSelector?: string
}

export default function ArticleAnalytics({
    articleSlug,
    articleTitle,
    containerSelector = '[data-article-content]'
}: ArticleAnalyticsProps) {
    useArticleAnalytics({
        articleSlug,
        articleTitle,
        containerSelector
    })

    return null
}
