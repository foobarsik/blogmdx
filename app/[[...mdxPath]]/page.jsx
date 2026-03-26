import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'

const generateStaticParamsBase = generateStaticParamsFor('mdxPath')

export async function generateStaticParams() {
    const paramsList = await generateStaticParamsBase()

    return paramsList.filter(({ mdxPath }) => {
        if (!Array.isArray(mdxPath) || mdxPath.length === 0) {
            return false
        }

        if (mdxPath.some(segment => !segment)) {
            return false
        }

        if (mdxPath.length === 1 && mdxPath[0] === 'posts') {
            return false
        }

        return true
    })
}

export async function generateMetadata(props) {
    const params = await props.params
    if (!params?.mdxPath) {
        return {}
    }

    try {
        const { metadata } = await importPage(params.mdxPath)
        return metadata
    } catch {
        return {}
    }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
    const params = await props.params
    if (!params?.mdxPath) {
        notFound()
    }

    let result

    try {
        result = await importPage(params.mdxPath)
    } catch {
        notFound()
    }

    const { default: MDXContent, toc, metadata } = result
    return (
        <Wrapper toc={toc} metadata={metadata}>
            <MDXContent {...props} params={params} />
        </Wrapper>
    )
}
