import {Footer, Layout, Navbar, ThemeSwitch} from 'nextra-theme-blog'
import NavLinks from './components/NavLinks'
import {Banner, Head, Search} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'
import Link from "next/link";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from '@vercel/speed-insights/next';

export const metadata = {
    title: 'MehWow Blog'
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
            <div
                className="header flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 min-w-[220px] mt-2 mb-12">
                <Link href="/">
                    <img src="/images/logo.png" alt="mehwow logo" width={160} className="logo my-2 mx-auto sm:mx-0"/>
                </Link>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex gap-6 mr-4 justify-center sm:justify-start w-full sm:w-auto">
                        <NavLinks/>
                    </div>
                    <div className="self-center sm:ml-auto">
                        <ThemeSwitch/>
                    </div>
                </div>
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
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}
