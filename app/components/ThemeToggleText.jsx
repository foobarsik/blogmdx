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

    const toggleTheme = () => {
        const nextTheme = themeName === "dark" ? "light" : "dark";

        setThemeName(nextTheme);
        applyTheme(nextTheme);
        setTheme(nextTheme);
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
