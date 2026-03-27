import {Footer, Layout} from 'nextra-theme-blog'
import NavLinks from './components/NavLinks'
import ThemeToggleText from './components/ThemeToggleText'
import {Banner} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'
import Link from "next/link";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from '@vercel/speed-insights/next';

export const metadata = {
    title: 'MehWow Blog'
}

export const viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: 'rgb(250,250,250)'},
        {media: '(prefers-color-scheme: dark)', color: 'rgb(17,17,17)'}
    ]
}

export default function RootLayout({children}) {
    const currentYear = new Date().getFullYear()
    const showLinkedinBanner = false

    const banner = showLinkedinBanner ? (
        <Banner storageKey="linkedin-connect">
            <span className="banner-content">
                Let’s connect on{' '}
                <a href="https://www.linkedin.com/in/olga-panibratchenko" target="_blank" className="underline-link">
                    Linkedin
                </a> 🤝
            </span>
        </Banner>
    ) : null

    return (
        <html lang="en" suppressHydrationWarning>
        <head suppressHydrationWarning/>
        <body>
        <Layout banner={banner} nextThemes={{ defaultTheme: 'dark' }}>
            <header className="site-header">
                <Link href="/" className="site-logo-link" aria-label="MehWow home">
                    <img src="/images/logo.png" alt="mehwow logo" width={112} className="logo"/>
                </Link>

                <div className="site-nav-wrap">
                    <NavLinks/>
                    <ThemeToggleText/>
                </div>
            </header>

            {children}

            <Footer>
                <div className="site-footer-inner">
                    <abbr
                        title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                        className="footer-abbr"
                    >
                    </abbr>{' '}
                    {currentYear} © mehwow
                    <a href="https://www.linkedin.com/in/olga-panibratchenko" target="_blank" className="footer-link">
                        Linkedin
                    </a>
                </div>
            </Footer>
        </Layout>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}
