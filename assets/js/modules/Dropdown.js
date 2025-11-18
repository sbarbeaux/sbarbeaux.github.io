/*! sbarbeaux.github.io - Dropdown.js v1.0.0 | MIT License | github.com/sbarbeaux */

/**
 * Dropdown: Manages a toggleable menu linked to a trigger button.
 */
export default class Dropdown {
    /**
     * @param {HTMLElement} targetElement - Menu element to show/hide.
     * @param {HTMLElement} triggerElement - Button element that toggles the menu.
     */
    constructor(targetElement, triggerElement) {
        if (!targetElement) {
            throw new Error("[Dropdown] targetElement is required.");
        }
        if (!targetElement.id) {
            throw new Error("[Dropdown] targetElement must have an ID for accessibility.");
        }
        if (!triggerElement) {
            throw new Error("[Dropdown] triggerElement is required.");
        }

        this._targetEl = targetElement;
        this._triggerEl = triggerElement;
        this._visible = false;

        // Bind methods once for reuse
        this._onClick = this.toggle.bind(this);
        this._onClickOutside = this._handleClickOutside.bind(this);
        this._onKeyDown = this._handleKeyDown.bind(this);

        this.init();
    }

    init() {
        this._setupEventListeners();

        // Accessibility: link trigger to target
        this._triggerEl.setAttribute("aria-controls", this._targetEl.id);
        this._triggerEl.setAttribute("aria-expanded", "false");

        // Ensure menu is hidden initially
        this._targetEl.classList.add("hidden");
        this._targetEl.setAttribute("aria-hidden", "true");
    }

    /**
     * Clean up event listeners.
     */
    destroy() {
        this._triggerEl.removeEventListener("click", this._onClick);
        document.removeEventListener("keydown", this._onKeyDown);
        this._removeClickOutsideListener();
    }

    toggle() {
        this._setVisibility(!this._visible);
    }

    show() {
        this._setVisibility(true);
    }

    hide() {
        this._setVisibility(false);
    }

    _setVisibility(isVisible) {
        this._targetEl.classList.toggle("hidden", !isVisible);
        this._targetEl.setAttribute("aria-hidden", String(!isVisible));
        this._triggerEl.setAttribute("aria-expanded", String(isVisible));
        this._visible = isVisible;

        // Manage outside click listener dynamically
        isVisible ? this._setupClickOutsideListener() : this._removeClickOutsideListener();
    }

    _setupEventListeners() {
        this._triggerEl.addEventListener("click", this._onClick);
        document.addEventListener("keydown", this._onKeyDown);
    }

    _setupClickOutsideListener() {
        document.addEventListener("click", this._onClickOutside, { capture: true });
    }

    _removeClickOutsideListener() {
        document.removeEventListener("click", this._onClickOutside, { capture: true });
    }

    /**
     * Handle Escape key to close menu.
     * @param {KeyboardEvent} e
     */
    _handleKeyDown(e) {
        if (e.key === "Escape" && this._visible) this.hide();
    }

    /**
     * Handle clicks outside of menu/trigger.
     * @param {MouseEvent} event
     */
    _handleClickOutside(event) {
        const clickedEl = event.target;

        // Close only if click is outside both target and trigger
        // 1. Is the menu visible?
        // 2. Is the clicked element not the target AND not contained within the target?
        // 3. Is the clicked element not the trigger AND not contained within the trigger?
        if (
            this._visible &&
            !this._targetEl.contains(clickedEl) &&
            !this._triggerEl.contains(clickedEl)
        ) {
            this.hide();
        }
    }
}
