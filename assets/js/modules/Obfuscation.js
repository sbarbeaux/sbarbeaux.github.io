/*! sbarbeaux.github.io - Obfuscation.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * Obfuscation: Decodes reversed data-item attributes on click, restores hidden links, updates sidebar text, and redirects.
 */
export default class Obfuscation {
    /**
     * @param {HTMLElement} element - Element with obfuscated attributes (data-item0, data-item1, ...).
     */
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("[Obfuscation] Invalid HTMLElement provided.");
        }

        this._element = element;
        this._onClick = this._handleClick.bind(this);

        // Bind click listener
        this._element.addEventListener("click", this._onClick);
    }

    /**
     * Remove listener and clear references.
     */
    destroy() {
        if (this._element && this._onClick) {
            this._element.removeEventListener("click", this._onClick);
            this._onClick = null;
            this._element = null;
        }
    }

    _handleClick(event) {
        event.preventDefault();

        // Decode obfuscated attributes
        const parts = this._decodeParts(this._element);

        // Build final link
        const href = this._element.getAttribute("data-href") || "";
        const isMailto = href.startsWith("mailto:");
        const link = isMailto ? parts.join("@") : parts.join("");

        if (!link) return;

        // Update sidebar text if required
        if (this._element.getAttribute("data-display") === "true") {
            this._updateSidebarContent(link);
        }

        // Redirect to reconstructed link
        window.open(`${href}${link}`, "_blank", "noopener,noreferrer");

        // Alternative
        //const a = event.currentTarget;
        //a.href = `${href}${link}`;
        //event.preventDefault(); // → propagate event
    }

    _decodeParts(element) {
        const data = [];
        let i = 0;

        // Collect reversed attributes
        while (element.hasAttribute(`data-item${i}`)) {
            const item = element.getAttribute(`data-item${i}`);
            if (item) data.push([...item].reverse().join(""));
            i++;
        }
        return data;
    }

    _updateSidebarContent(link) {
        const spans = this._element.querySelectorAll("span");
        if (spans.length > 0) {
            // Replace last span text
            spans[spans.length - 1].textContent = link;
        }
    }
}
