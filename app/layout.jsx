import {Layout} from 'nextra-theme-blog'
import NavLinks from './components/NavLinks'
import ThemeToggleText from './components/ThemeToggleText'
import {Banner} from 'nextra/components'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'
import Link from "next/link";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from '@vercel/speed-insights/next';
import Script from 'next/script'
import {
    AUTHOR_NAME,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE,
    buildSeoMetadata,
    getMetadataBase
} from '../lib/seo'

export const metadata = {
    metadataBase: getMetadataBase(),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`
    },
    applicationName: SITE_NAME,
    description: SITE_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    category: 'Technology',
    robots: {
        index: true,
        follow: true
    },
    ...buildSeoMetadata({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        pathname: '/'
    })
}

export const viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: 'rgb(250,250,250)'},
        {media: '(prefers-color-scheme: dark)', color: 'rgb(17,17,17)'}
    ]
}

const themeInitScript = `
try {
  const storedTheme = localStorage.getItem('theme');
  const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  root.setAttribute('data-theme', theme);
} catch (error) {}
`

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
        <head suppressHydrationWarning>
            <Script id="theme-init" strategy="beforeInteractive">
                {themeInitScript}
            </Script>
        </head>
        <body>
        <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="3bb9303e-4df5-42ae-979d-bd66d330f5e1"
            strategy="afterInteractive"
        />
        <Layout banner={banner} nextThemes={{ defaultTheme: 'dark', enableSystem: false, disableTransitionOnChange: true }}>
            <header className="site-header site-shell">
                <Link href="/" className="site-logo-link" aria-label="MehWow home">
                    <img src="/images/logo.png" alt="mehwow logo" width={112} className="logo"/>
                </Link>
                <NavLinks/>
                <ThemeToggleText/>
            </header>

            {children}

            <footer className="site-footer site-shell" data-pagefind-ignore="all">
                <small className="site-footer-inner">
                    <abbr
                        title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                        className="footer-abbr"
                    >
                    </abbr>{' '}
                    {currentYear} © mehwow
                    <a href="https://www.linkedin.com/in/olga-panibratchenko" target="_blank" className="footer-link">
                        Linkedin
                    </a>
                </small>
            </footer>
        </Layout>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}
