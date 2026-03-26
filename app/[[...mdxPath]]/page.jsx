import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'

const generateStaticParamsBase = generateStaticParamsFor('mdxPath')
const normalizeMdxPath = mdxPath =>
    Array.isArray(mdxPath) ? mdxPath.filter(Boolean) : []

export async function generateStaticParams() {
    const paramsList = await generateStaticParamsBase()

    return paramsList
        .map(({ mdxPath, ...rest }) => ({
            ...rest,
            mdxPath: normalizeMdxPath(mdxPath)
        }))
        .filter(({ mdxPath }) => {
            if (mdxPath.length === 1 && mdxPath[0] === 'posts') {
                return false
            }

            return true
        })
}

export async function generateMetadata(props) {
    const params = await props.params
    const mdxPath = normalizeMdxPath(params?.mdxPath)

    try {
        const { metadata } = await importPage(mdxPath)
        return metadata
    } catch {
        return {}
    }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
    const params = await props.params
    const mdxPath = normalizeMdxPath(params?.mdxPath)

    let result

    try {
        result = await importPage(mdxPath)
    } catch {
        notFound()
    }

    const { default: MDXContent, toc, metadata } = result
    return (
        <Wrapper toc={toc} metadata={metadata}>
            <MDXContent {...props} params={{ ...(params ?? {}), mdxPath }} />
        </Wrapper>
    )
}
