import {Footer, Layout, ThemeSwitch} from 'nextra-theme-blog'
import NavLinks from './components/NavLinks'
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
            <div
                className="header flex flex-col gap-3 min-w-[220px] mt-2 mb-12">
                <div className="flex items-center justify-between w-full">
                    <Link href="/">
                        <img src="/images/logo.png" alt="mehwow logo" width={160} className="logo my-2 mx-0 sm:mx-0"/>
                    </Link>
                    <div className="shrink-0 mt-px">
                        <ThemeSwitch/>
                    </div>
                </div>
                <div className="flex gap-6 justify-start w-full">
                    <NavLinks/>
                </div>
            </div>

            {children}

            <Footer>
                <abbr
                    title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                    className="footer-abbr"
                >
                </abbr>{' '}
                {currentYear} © mehwow
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
