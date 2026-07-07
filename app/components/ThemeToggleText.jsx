"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function readTheme() {
    if (typeof document === "undefined") return "dark";

    try {
        const storedTheme = window.localStorage.getItem("theme");

        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }
    } catch {}

    const root = document.documentElement;

    if (root.classList.contains("light")) return "light";
    if (root.classList.contains("dark")) return "dark";

    return "dark";
}

function applyTheme(nextTheme) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    root.style.colorScheme = nextTheme;
    root.setAttribute("data-theme", nextTheme);

    try {
        window.localStorage.setItem("theme", nextTheme);
    } catch {}
}

export default function ThemeToggleText() {
    const { resolvedTheme, setTheme } = useTheme();
    const [themeName, setThemeName] = useState("dark");

    useEffect(() => {
        const currentTheme =
            resolvedTheme === "light" || resolvedTheme === "dark"
                ? resolvedTheme
                : readTheme();

        setThemeName(currentTheme);
        applyTheme(currentTheme);
    }, [resolvedTheme]);

    const toggleTheme = (event) => {
        const nextTheme = themeName === "dark" ? "light" : "dark";

        const apply = () => {
            setThemeName(nextTheme);
            applyTheme(nextTheme);
            setTheme(nextTheme);
        };

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!document.startViewTransition || reduceMotion) {
            apply();
            return;
        }

        // Circular wipe: the new theme expands from the click point.
        // data-theme-wipe suppresses the page-navigation fade so the
        // clip-path animation below is the only thing running.
        const { clientX: x, clientY: y } = event;
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const root = document.documentElement;
        root.setAttribute("data-theme-wipe", "");

        const transition = document.startViewTransition(apply);

        transition.ready
            .then(() => {
                root.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration: 450,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)"
                    }
                );
            })
            // The browser skips the transition in hidden tabs; the theme
            // has still been applied, so just swallow the rejection.
            .catch(() => {});

        transition.finished
            .finally(() => {
                root.removeAttribute("data-theme-wipe");
            })
            .catch(() => {});
    };

    const isDark = themeName === "dark";
    const nextThemeLabel = isDark ? "light" : "dark";
    const themeLabel = isDark ? "Dark/Light" : "Light/Dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-text"
            aria-label={`Switch to ${nextThemeLabel} theme`}
            aria-pressed={isDark}
        >
            {themeLabel}
        </button>
    );
}
