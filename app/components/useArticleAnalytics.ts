'use client'

import { useEffect } from 'react'

type ArticleAnalyticsOptions = {
    articleSlug: string
    articleTitle: string
    containerSelector?: string
}

type TrackPayload = Record<string, string | number>

declare global {
    interface Window {
        umami?: {
            track: (eventName: string, payload?: Record<string, unknown>) => void
        }
    }
}

const READ_TARGET_MS = 30_000

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

export function useArticleAnalytics({
    articleSlug,
    articleTitle,
    containerSelector = '[data-article-content]'
}: ArticleAnalyticsOptions) {
    useEffect(() => {
        if (!articleSlug || !articleTitle) {
            return
        }

        let openedTracked = false
        let scroll50Tracked = false
        let scroll90Tracked = false
        let read30Tracked = false
        let exitTracked = false
        let maxScroll = 0
        let rafId = 0
        let readTimerId: number | null = null
        let visibleElapsedMs = 0
        let visibleSinceMs: number | null =
            document.visibilityState === 'visible' ? Date.now() : null

        const startedAtMs = Date.now()

        const basePayload: TrackPayload = {
            article_slug: articleSlug,
            article_title: articleTitle
        }

        const track = (eventName: string, payload: TrackPayload = {}) => {
            if (typeof window === 'undefined') {
                return
            }

            if (typeof window.umami?.track !== 'function') {
                return
            }

            window.umami.track(eventName, {
                ...basePayload,
                ...payload
            })
        }

        const getScrollPercent = () => {
            const documentElement = document.documentElement
            const viewportHeight = window.innerHeight || documentElement.clientHeight || 0
            const container =
                document.querySelector<HTMLElement>(containerSelector) ||
                document.querySelector<HTMLElement>('article.x\\:container.x\\:prose')

            if (container) {
                const rect = container.getBoundingClientRect()
                const containerTop = window.scrollY + rect.top
                const containerHeight = container.scrollHeight || rect.height
                const viewportBottom = window.scrollY + viewportHeight

                if (containerHeight <= 0) {
                    return 0
                }

                return clamp(((viewportBottom - containerTop) / containerHeight) * 100, 0, 100)
            }

            const scrollTop = window.scrollY || documentElement.scrollTop || 0
            const docHeight = documentElement.scrollHeight || document.body.scrollHeight || 0
            const maxScrollable = docHeight - viewportHeight

            if (maxScrollable <= 0) {
                return 100
            }

            return clamp((scrollTop / maxScrollable) * 100, 0, 100)
        }

        const measureScroll = () => {
            const scrollPercent = getScrollPercent()

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent
            }

            if (!scroll50Tracked && scrollPercent >= 50) {
                scroll50Tracked = true
                track('article_scroll_50')
            }

            if (!scroll90Tracked && scrollPercent >= 90) {
                scroll90Tracked = true
                track('article_scroll_90')
            }
        }

        const onScroll = () => {
            if (rafId) {
                return
            }

            rafId = window.requestAnimationFrame(() => {
                rafId = 0
                measureScroll()
            })
        }

        const clearReadTimer = () => {
            if (readTimerId !== null) {
                window.clearTimeout(readTimerId)
                readTimerId = null
            }
        }

        const scheduleReadTimer = () => {
            if (read30Tracked || document.visibilityState !== 'visible') {
                return
            }

            const remaining = READ_TARGET_MS - visibleElapsedMs

            if (remaining <= 0) {
                read30Tracked = true
                track('article_read_30s')
                return
            }

            clearReadTimer()

            readTimerId = window.setTimeout(() => {
                readTimerId = null

                if (document.visibilityState !== 'visible' || read30Tracked) {
                    return
                }

                read30Tracked = true
                track('article_read_30s')
            }, remaining)
        }

        const onVisibilityChange = () => {
            if (read30Tracked) {
                return
            }

            if (document.visibilityState === 'hidden') {
                if (visibleSinceMs !== null) {
                    visibleElapsedMs += Date.now() - visibleSinceMs
                    visibleSinceMs = null
                }

                clearReadTimer()
                return
            }

            visibleSinceMs = Date.now()
            scheduleReadTimer()
        }

        const trackExit = () => {
            if (exitTracked) {
                return
            }

            exitTracked = true

            if (rafId) {
                window.cancelAnimationFrame(rafId)
                rafId = 0
            }

            clearReadTimer()
            measureScroll()

            if (visibleSinceMs !== null) {
                visibleElapsedMs += Date.now() - visibleSinceMs
                visibleSinceMs = null
            }

            track('article_exit', {
                max_scroll: Math.round(maxScroll),
                time_spent_ms: Date.now() - startedAtMs
            })
        }

        if (!openedTracked) {
            openedTracked = true
            track('article_opened')
        }

        measureScroll()
        scheduleReadTimer()

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        window.addEventListener('beforeunload', trackExit)
        window.addEventListener('pagehide', trackExit)
        document.addEventListener('visibilitychange', onVisibilityChange)

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId)
            }

            clearReadTimer()
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            window.removeEventListener('beforeunload', trackExit)
            window.removeEventListener('pagehide', trackExit)
            document.removeEventListener('visibilitychange', onVisibilityChange)
            trackExit()
        }
    }, [articleSlug, articleTitle, containerSelector])
}
