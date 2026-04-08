---
title: Markdown Examples
date: 2025/06/25
description: View examples of all possible Markdown options.
tags: [web development]
---

# Markdown Examples

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Emphasis

**This is bold text**

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Develop. Preview. Ship. – Vercel

## Lists

Unordered

- Lorem ipsum dolor sit amet
- Consectetur adipiscing elit
- Integer molestie lorem at massa

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

## Code

Inline `code`

```
export default function Nextra({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/feed.xml"
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

## Tables

| **Option** | **Description**                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| First      | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. |
| Second     | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. |
| Third      | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. |

## Links

- [Next.js](https://nextjs.org)
- [Nextra](https://nextra.vercel.app/)
- [Vercel](http://vercel.com)

### Footnotes

- Footnote [^1].
- Footnote [^2].

[^1]: Footnote **can have markup**

and multiple paragraphs.

[^2]: Footnote text.




# 📚 Оглавление

- [Введение](#введение)
- [Глава 1: Начало пути](#глава-1-начало-пути)
- [Глава 2: Углубляемся](#глава-2-углубляемся)
- [Глава 3: Практика](#глава-3-практика)
- [Заключение](#заключение)

---

We spent time mostly in a center, so it was more like a fast-food trip

<details>
    <summary>Нажми, чтобы раскрыть</summary>
    А вот и спрятанный текст! Можно писать **форматированный** Markdown внутри.
    - Списки
    - **Жирный текст**
    - `Код`
    <div style={{display: 'flex', gap: '1rem'}}>
        <ImageZoom src="/images/logo.png" alt="app screen" width={200} height={300}/>
        <ImageZoom src="/images/logo.png" alt="app screen" width={200} height={300}/>
        <ImageZoom src="/images/logo.png" alt="app screen" width={200} height={300}/>
        <ImageZoom src="/images/logo.png" alt="app screen" width={200} height={300}/>
    </div>
</details>

## Введение

Тут вступительное слово, пояснение, зачем всё это и куда мы едем.

---

## Глава 1: Начало пути

Первые шаги, знакомство с окружением, первые фейлы - всё как положено.

---

## Глава 2: Углубляемся

Тут уже будет больнее. Придётся думать.

---

## Глава 3: Практика

Без этого никуда. Всё, что выучили, теперь надо применить - желательно не сломав ничего.

---

## Заключение

Итоги, выводы, возможно, немного пафоса. Спасибо, что дочитал(а).
