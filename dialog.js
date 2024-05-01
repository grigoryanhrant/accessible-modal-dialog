function Dialog(dialogEl, overlayEl) {
    this.dialogEl = dialogEl;
    this.overlayEl = overlayEl;
    this.focusedElBeforeOpen;

    this.focusableEls = Array.from(dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'));
    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];

    this.close();
}

Dialog.prototype.open = function () {
    this.dialogEl.removeAttribute('aria-hidden');
    this.overlayEl.removeAttribute('aria-hidden');

    this.focusedElBeforeOpen = document.activeElement;

    const handleKeyDown = (e) => {
        this._handleKeyDown(e);
    };

    this.dialogEl.addEventListener('keydown', handleKeyDown);

    this.overlayEl.addEventListener('click', () => {
        this.close();
    });

    this.firstFocusableEl.focus();
};

Dialog.prototype.close = function () {
    this.dialogEl.setAttribute('aria-hidden', true);
    this.overlayEl.setAttribute('aria-hidden', true);

    if (this.focusedElBeforeOpen) {
        this.focusedElBeforeOpen.focus();
    }
};

Dialog.prototype._handleKeyDown = function (e) {
    const KEY_TAB = 9;
    const KEY_ESC = 27;

    const handleBackwardTab = () => {
        if (document.activeElement === this.firstFocusableEl) {
            e.preventDefault();
            this.lastFocusableEl.focus();
        }
    };

    const handleForwardTab = () => {
        if (document.activeElement === this.lastFocusableEl) {
            e.preventDefault();
            this.firstFocusableEl.focus();
        }
    };

    switch (e.keyCode) {
        case KEY_TAB:
            if (this.focusableEls.length === 1) {
                e.preventDefault();
                break;
            }
            if (e.shiftKey) {
                handleBackwardTab();
            } else {
                handleForwardTab();
            }
            break;
        case KEY_ESC:
            this.close();
            break;
        default:
            break;
    }
};

Dialog.prototype.addEventListeners = function (openDialogSel, closeDialogSel) {
    const addClickListener = (elements, callback) => {
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', callback);
        }
    };

    addClickListener(document.querySelectorAll(openDialogSel), () => {
        this.open();
    });

    addClickListener(document.querySelectorAll(closeDialogSel), () => {
        this.close();
    });
};
