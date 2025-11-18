/*! sbarbeaux.github.io - Spotlight.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * Spotlight class - Tracks mouse position and updates child CSS variables
 */
export default class Spotlight {
    /**
     * @param {HTMLElement} element - Parent container of child elements
     */
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("[Spotlight] Provided element is not a valid HTMLElement.");
        }

        // Instance properties
        this._element = element;
        this._sections = Array.from(this._element.children);
        this._mouse = { x: 0, y: 0 };
        this._size = { w: 0, h: 0 };
        this._rect = null;
        this._needsUpdate = false;
        this._animationFrameId = null;

        // Bind methods
        this._initContainer = this._initContainer.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._update = this._update.bind(this);
        this._reset = this._reset.bind(this);

        this.init();
    }

    /**
     * Initialize listeners and start animation loop
     */
    init() {
        this._initContainer();

        // Resize listener
        window.addEventListener("resize", this._initContainer);
        this._element.addEventListener("mousemove", this._onMouseMove);
        this._element.addEventListener("mouseleave", this._reset);

        // Start loop
        this._animationFrameId = requestAnimationFrame(this._update);
    }

    /**
     * Remove listeners and cleanup
     */
    destroy() {
        window.removeEventListener("resize", this._initContainer);
        this._element.removeEventListener("mousemove", this._onMouseMove);
        this._element.removeEventListener("mouseleave", this._reset);

        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }

        // Reset CSS vars
        this._sections.forEach((section) => {
            section.style.removeProperty("--mouse-x");
            section.style.removeProperty("--mouse-y");
        });
    }

    /**
     * Cache container rect
     * @private
     */
    _initContainer() {
        const rect = this._element.getBoundingClientRect();
        this._size.w = rect.width;
        this._size.h = rect.height;
        this._rect = rect;
    }

    /**
     * Handle mousemove and update coords
     * @param {MouseEvent} event
     * @private
     */
    _onMouseMove(event) {
        const x = event.clientX - this._rect.left;
        const y = event.clientY - this._rect.top;

        // Checks if the mouse is within the container boundaries
        if (x >= 0 && x <= this._size.w && y >= 0 && y <= this._size.h) {
            this._mouse.x = x;
            this._mouse.y = y;
            this._needsUpdate = true;
        }
    }

    /**
     * Reset CSS vars on mouse leave
     * @private
     */
    _reset() {
        this._sections.forEach((section) => {
            section.style.removeProperty("--mouse-x");
            section.style.removeProperty("--mouse-y");
        });
    }

    /**
     * Animation loop - update child CSS vars
     * @private
     */
    _update() {
        if (this._needsUpdate) {
            this._sections.forEach((section) => {
                const rect = section.getBoundingClientRect();

                // Calculating the relative position of the mouse with respect to each section
                const sectionX = this._mouse.x - (rect.left - this._rect.left);
                const sectionY = this._mouse.y - (rect.top - this._rect.top);

                // Update of custom CSS variables
                section.style.setProperty("--mouse-x", `${sectionX}px`);
                section.style.setProperty("--mouse-y", `${sectionY}px`);
            });
            this._needsUpdate = false;
        }

        // Continue the animation loop
        this._animationFrameId = requestAnimationFrame(this._update);
    }
}
