import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
import '../styles/main.css';

export const metadata = {
    title: 'Blog'
}

export default async function RootLayout({ children }) {
    const banner = (
        <Banner storageKey="linkedin-connect">
            Let’s connect on {' '}
            <a
                href="https://www.linkedin.com/in/olga-panibratchenko-381470174/"
                target='_blank'
                style={{
                    textDecoration: 'underline',
                    textUnderlinePosition: 'from-font'
                }}
            >
                Linkedin
            </a> 🤝
        </Banner>
    )

    return (
        <html lang="en" suppressHydrationWarning>
        <Head backgroundColor={{ dark: '#0f172a', light: '#fff' }} />
        <body>
        <Layout banner={banner}>
            <Navbar pageMap={await getPageMap()}>
                <Search placeholder='Search'/>
                <ThemeSwitch />
            </Navbar>

            {children}

            <Footer>
                <abbr
                    title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                    style={{ cursor: 'help' }}
                >
                </abbr>{' '}
                {new Date().getFullYear()} © oddapp
                <a href="/feed.xml" style={{ float: 'right' }}>
                    RSS
                </a>
            </Footer>
        </Layout>
        </body>
        </html>
    )
}
