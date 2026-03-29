import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'
import TopBackLink from './app/components/TopBackLink'

const blogComponents = getBlogMDXComponents({
    DateFormatter: ({ date }) =>
        `Last updated at ${date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}`
})

function WrapperWithoutTags({ children, metadata }) {
    const Wrapper = blogComponents.wrapper
    return (
        <>
            <TopBackLink />
            {Wrapper({
                children,
                metadata: {
                    ...metadata,
                    // Temporarily hide post hashtags in article meta.
                    tags: undefined
                }
            })}
        </>
    )
}

export function useMDXComponents(components) {
    return {
        ...blogComponents,
        wrapper: WrapperWithoutTags,
        ...components
    }
}
