import {Footer, Layout, Navbar, ThemeSwitch} from 'nextra-theme-blog'
import NavLinks from './components/NavLinks'
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
            <a href="https://www.linkedin.com/in/olga-panibratchenko" target="_blank" className="underline-link">
                Linkedin
            </a> 🤝
        </Banner>
    )

    return (
        <html lang="en" suppressHydrationWarning>
        <Head/>
        <body>
        <Layout banner={banner}>
            <img src="/images/logo-mehwow.png" alt="mehwow logo" width={330}/>

            <Navbar pageMap={await getPageMap()}>
                <NavLinks/>
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
                {new Date().getFullYear()} © mehwow
                <a href="https://www.linkedin.com/in/olga-panibratchenko" target="_blank" className="footer-link">
                    Linkedin
                </a>
            </Footer>
        </Layout>
        </body>
        </html>
    )
}
