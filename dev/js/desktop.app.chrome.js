laisiangtho.prototype.win = {
    full: {
        name: function(e) {
            this.screen = e.arg[0];
        },
        is: function(e) {
            e ? this.screen.addClass("icon-screen-small") : this.screen.removeClass("icon-screen-small");
        }
    },
    max: {
        name: function(e) {
            this.screen = e.arg[0];
        },
        is: function(e) {
            e ? this.screen.addClass(config.css.winActive) : this.screen.removeClass(config.css.winActive);
        }
    },
    Status: function() {
        window.screenStatus && (screenStatus.isFullscreen() && this.full.is(!0), screenStatus.isMaximized() && this.max.is(!0));
    },
    minimize: function() {
        screenStatus.minimize();
    },
    maximize: function(e) {
        screenStatus.isFullscreen() || screenStatus.isMaximized() ? screenStatus.restore() : screenStatus.maximize();
    },
    fullscreen: function(e, s) {
        screenStatus.isFullscreen() ? screenStatus.restore() : screenStatus.fullscreen();
    },
    close: function(e) {
        screenStatus.close();
    }
}, screenStatus.onBoundsChanged.addListener(function() {}), screenStatus.onClosed.addListener(function() {}), 
screenStatus.onRestored.addListener(function() {
    screenStatus.isFullscreen() || new laisiangtho().win.full.is(), screenStatus.isMaximized() || new laisiangtho().win.max.is();
}), screenStatus.onFullscreened.addListener(function() {
    new laisiangtho().win.full.is(!0);
}), screenStatus.onMaximized.addListener(function() {
    new laisiangtho().win.max.is(!0);
}), screenStatus.onMinimized.addListener(function() {}), screenStatus.focus();