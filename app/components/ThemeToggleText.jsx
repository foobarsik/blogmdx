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
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [themeName, setThemeName] = useState("dark");

    useEffect(() => {
        setMounted(true);
        const current = readThemeFromDom();
        if (current) {
            setThemeName(current);
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = themeName === "dark" ? "light" : "dark";
        setThemeName(nextTheme);
        applyThemeToDom(nextTheme);
        setTheme(nextTheme);

        try {
            localStorage.setItem("theme", nextTheme);
        } catch {
            // Ignore localStorage restrictions and keep DOM/class toggle working.
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-text"
            aria-label="Toggle theme"
            aria-pressed={themeName === "dark"}
        >
            {mounted ? (themeName === "dark" ? "Dark -> Light" : "Light -> Dark") : "Dark / Light"}
        </button>
    );
}
