"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function readThemeFromDom() {
    if (typeof document === "undefined") return null;

    const root = document.documentElement;

    if (root.classList.contains("light")) return "light";
    if (root.classList.contains("dark")) return "dark";

    return null;
}

function applyThemeToDom(nextTheme) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    root.style.colorScheme = nextTheme;
}

export default function ThemeToggleText() {
    const { resolvedTheme, setTheme } = useTheme();
    const [themeName, setThemeName] = useState("dark");

    useEffect(() => {
        const currentTheme = resolvedTheme || readThemeFromDom();

        if (currentTheme === "light" || currentTheme === "dark") {
            setThemeName(currentTheme);
        }
    }, [resolvedTheme]);

    const toggleTheme = () => {
        const nextTheme = themeName === "dark" ? "light" : "dark";

        setThemeName(nextTheme);
        applyThemeToDom(nextTheme);
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
