import {Footer, Layout, Navbar, ThemeSwitch} from 'nextra-theme-blog'
import {Banner, Head, Search} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'

export const metadata = {
    title: 'Blog'
}

export default async function RootLayout({children}) {
    const banner = (
        <Banner storageKey="linkedin-connect">
            Let’s connect on{' '}
            <a
                href="https://www.linkedin.com/in/olga-panibratchenko"
                target="_blank"
                className="underline-link"
            >
                Linkedin
            </a> 🤝
        </Banner>
    )

    return (
        <html lang="en" suppressHydrationWarning>
        <Head backgroundColor={{dark: '#0f172a', light: '#fff'}}/>
        <body>
        <Layout banner={banner}>
            <Navbar pageMap={await getPageMap()}>
                <nav className="nav-container">
                    <a href="/posts" className="nav-link">Blog</a>
                    <a href="/projects" className="nav-link">Projects</a>
                    <a href="/" className="nav-link">About me</a>
                </nav>
            </Navbar>

            <div className="search-theme-bar">
                <Search placeholder="Search..."/>
                <ThemeSwitch/>
            </div>

            {children}

            <Footer>
                <abbr
                    title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                    className="footer-abbr"
                >
                </abbr>{' '}
                {new Date().getFullYear()} © oddapp
                <a
                    href="https://www.linkedin.com/in/olga-panibratchenko"
                    target="_blank"
                    className="footer-link"
                >
                    Linkedin
                </a>
            </Footer>
        </Layout>
        </body>
        </html>
    )
}
