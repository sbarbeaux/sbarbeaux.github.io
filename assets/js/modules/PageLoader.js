/*! sbarbeaux.github.io - PageLoader.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * PageLoader: Manages the display and behavior of a loading indicator within a page.
 */
export default class PageLoader {
    /**
     * @param {HTMLElement} element - Loader container element.
     * @param {string} [spinnerSelector='div'] - Selector for internal spinner.
     */
    constructor(element, spinnerSelector = "div") {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("[PageLoader] Invalid HTMLElement provided.");
        }

        this._element = element;
        this._spinner = element.querySelector(spinnerSelector);
        this._isLoading = false;

        // Extract transition duration from class (fallback: 300ms)
        const durationClass = [...element.classList].find((cls) => cls.startsWith("duration-"));
        const match = durationClass?.match(/\d+/);
        this._transitionDuration = match ? parseInt(match[0], 10) : 300;
    }

    start() {
        if (this._isLoading) return;
        this._isLoading = true;

        // Enable interaction
        this._element.classList.remove("pointer-events-none");

        // Show loader
        this._element.classList.replace("opacity-0", "opacity-100");

        // Activate spinner
        if (this._spinner) this._spinner.classList.add("animate-spin");

        this._element.removeAttribute("aria-hidden");
    }

    stop() {
        if (!this._isLoading) return;
        this._isLoading = false;

        // Hide loader
        this._element.classList.replace("opacity-100", "opacity-0");

        const cleanup = () => {
            // Disable interaction
            this._element.classList.add("pointer-events-none");
            // Stop spinner
            if (this._spinner) this._spinner.classList.remove("animate-spin");
            this._element.setAttribute("aria-hidden", "true");
        };

        // Listen for transition end (with timeout fallback)
        this._element.addEventListener("transitionend", cleanup, { once: true });
        setTimeout(cleanup, this._transitionDuration + 50);
    }
}
