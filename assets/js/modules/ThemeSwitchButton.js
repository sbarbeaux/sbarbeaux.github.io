/*! sbarbeaux.github.io - ThemeSwitchButton.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * ThemeSwitchButton: Handles switching CSS theme classes on <html> via button clicks or programmatic calls.
 */
export default class ThemeSwitchButton {
    /**
     * @param {HTMLElement} element - Target button element.
     * @param {Object} [options] - Config options.
     * @param {string[]} [options.themes] - Allowed theme classes.
     */
    constructor(element, options = {}) {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("[ThemeSwitchButton] Element must be a valid HTMLElement.");
        }
        if (options.themes && !Array.isArray(options.themes)) {
            throw new TypeError("[ThemeSwitchButton] 'themes' must be an array of strings.");
        }

        // Store element and themes (unique set)
        this._element = element;
        this._themes = [
            ...new Set(
                options.themes || [
                    "theme-cyan",
                    "theme-pink",
                    "theme-orange",
                    "theme-slate",
                    "theme-green",
                    "theme-emerald",
                ]
            ),
        ];

        // Bind and attach click listener
        this._onClick = this._handleClick.bind(this);
        this._element.addEventListener("click", this._onClick);
    }

    /**
     * Public method to set theme programmatically.
     * @param {string} theme
     */
    setTheme(theme) {
        this._applyTheme(theme);
    }

    /**
     * Remove listeners and cleanup
     */
    destroy() {
        this._element?.removeEventListener("click", this._onClick);
    }

    /**
     * Handle button click
     * @param {MouseEvent} event
     */
    _handleClick(event) {
        event.preventDefault();

        const accent = event.currentTarget.dataset.accent;
        if (!accent) {
            console.warn("[ThemeSwitchButton] Missing 'data-accent' attribute.");
            return;
        }
        this._applyTheme(accent);
    }

    /**
     * Get current applied theme
     */
    _getCurrentTheme() {
        return this._themes.find((t) => document.documentElement.classList.contains(t)) || null;
    }

    /**
     * Apply theme to <html>
     * @param {string} theme - Theme class to apply.
     */
    _applyTheme(theme) {
        if (!this._themes.includes(theme)) {
            console.warn(`[ThemeSwitchButton] Invalid theme: ${theme}`);
            return;
        }

        const current = this._getCurrentTheme();
        if (theme === current) {
            console.log("[ThemeSwitchButton] Theme unchanged:", theme);
            return;
        }

        document.documentElement.classList.remove(...this._themes);
        document.documentElement.classList.add(theme);
    }
}
