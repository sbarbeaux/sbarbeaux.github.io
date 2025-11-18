/*! sbarbeaux.github.io - MenuObserver.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * MenuObserver: Highlights menu links based on the visible section in the viewport.
 */
export default class MenuObserver {
    /**
     * @param {HTMLElement} element - Menu container (<nav> or <ul>).
     * @param {number} [threshold=0.6] - Intersection threshold for observer.
     */
    constructor(element, threshold = 0.6) {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("[MenuObserver] Invalid HTMLElement provided.");
        }

        this._element = element;
        this._threshold = threshold;
        this._motionQuery = window.matchMedia("(prefers-reduced-motion)");

        this._links = [];
        this._headings = [];
        this._previousSection = null;
        this._observer = null;

        // Bind methods to instance
        this._handleObserver = this._handleObserver.bind(this);
        this._handleLinkClick = this._handleLinkClick.bind(this);

        this.init();
    }

    init() {
        // Create observer
        this._observer = new IntersectionObserver(this._handleObserver, {
            rootMargin: "0px",
            threshold: this._threshold,
        });

        // Collect links and target sections
        this._links = [...this._element.querySelectorAll("a[href^='#']")];
        this._headings = this._links
            .map((link) => {
                const id = link.getAttribute("href");
                return id?.startsWith("#") ? document.querySelector(id) : null;
            })
            .filter(Boolean);

        // Observe sections and attach click listeners
        this._headings.forEach((heading) => this._observer.observe(heading));
        this._links.forEach((link) => link.addEventListener("click", this._handleLinkClick));

        // Initial update (handles anchor on page load)
        this._updateActiveLink();
    }

    /**
     * Clean up observers and listeners.
     */
    destroy() {
        if (this._observer) this._observer.disconnect();
        this._links.forEach((link) => link.removeEventListener("click", this._handleLinkClick));
        this._links = [];
        this._headings = [];
        this._previousSection = null;
    }

    /**
     * IntersectionObserver callback.
     * @param {IntersectionObserverEntry[]} entries
     */
    _handleObserver(entries) {
        entries.forEach((entry) => {
            const id = entry.target.id;
            const href = `#${id}`;
            const link = this._links.find((l) => l.getAttribute("href") === href);

            if (!link) return;

            // Toggle visibility class
            if (entry.isIntersecting) {
                link.classList.add("is-visible");
                this._previousSection = id;
            } else {
                link.classList.remove("is-visible");
            }

            this._updateActiveLink();
        });
    }

    /**
     * Update aria-current attribute for accessibility.
     */
    _updateActiveLink() {
        this._links.forEach((link) => link.removeAttribute("aria-current"));
        const firstVisibleLink = this._element.querySelector(".is-visible");

        if (firstVisibleLink) {
            firstVisibleLink.setAttribute("aria-current", "page");
        } else if (this._previousSection) {
            const preElement = this._element.querySelector(`a[href="#${this._previousSection}"]`);
            if (preElement) preElement.setAttribute("aria-current", "page");
        }
    }

    /**
     * Handle link click: focus section and smooth scroll.
     */
    _handleLinkClick(event) {
        event.preventDefault();

        const id = event.currentTarget.getAttribute("href").slice(1);
        const section = this._headings.find((h) => h.id === id);

        if (!section) return;

        // Focus management
        section.setAttribute("tabindex", "-1");
        section.focus();
        section.removeAttribute("tabindex");

        // Smooth scroll with motion preference
        window.scrollTo({
            top: section.getBoundingClientRect().top + window.scrollY - 30,
            behavior: this._motionQuery.matches ? "auto" : "smooth",
        });
    }
}
