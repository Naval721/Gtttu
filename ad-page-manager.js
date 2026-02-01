// ============================================================================
// AD PAGE & TAB MANAGER
// ============================================================================
// Tracks and manages all pages/tabs opened by the ad network
// Allows closing all opened pages when clearing data
// ============================================================================

// Global tracker for opened windows/tabs
window._openedAdWindows = window._openedAdWindows || [];
window._openedAdTabs = window._openedAdTabs || [];

/**
 * Intercept window.open to track all pages opened by ads
 */
(function () {
    const originalWindowOpen = window.open;

    window.open = function (...args) {
        console.log('🔗 Ad network opening new page:', args[0]);

        // Call original window.open
        const newWindow = originalWindowOpen.apply(this, args);

        // Track the opened window
        if (newWindow && !newWindow.closed) {
            window._openedAdWindows.push(newWindow);
            console.log(`📊 Total ad windows tracked: ${window._openedAdWindows.length}`);

            // Clean up closed windows from tracker
            window._openedAdWindows = window._openedAdWindows.filter(w => !w.closed);
        }

        return newWindow;
    };

    console.log('✅ Window.open interceptor installed');
})();

/**
 * Close all tracked ad windows/tabs
 */
function closeAllAdWindows() {
    let closedCount = 0;

    console.log(`🚪 Attempting to close ${window._openedAdWindows.length} ad windows...`);

    // Close all tracked windows
    window._openedAdWindows.forEach((win, index) => {
        try {
            if (win && !win.closed) {
                win.close();
                closedCount++;
                console.log(`✓ Closed ad window ${index + 1}`);
            }
        } catch (e) {
            console.warn(`Failed to close window ${index + 1}:`, e);
        }
    });

    // Clear the tracker
    window._openedAdWindows = [];

    console.log(`✅ Closed ${closedCount} ad windows`);
    return closedCount;
}

/**
 * Prevent multiple ad pages from accumulating
 * Closes old ad windows before opening new ones
 */
function preventAdAccumulation() {
    // If we have more than 3 ad windows open, close the oldest ones
    const maxAdWindows = 3;

    if (window._openedAdWindows.length > maxAdWindows) {
        const toClose = window._openedAdWindows.length - maxAdWindows;
        console.log(`⚠️ Too many ad windows (${window._openedAdWindows.length}), closing ${toClose} oldest...`);

        for (let i = 0; i < toClose; i++) {
            const win = window._openedAdWindows.shift();
            try {
                if (win && !win.closed) {
                    win.close();
                }
            } catch (e) {
                console.warn('Failed to close old ad window:', e);
            }
        }
    }
}

// Auto-cleanup every 30 seconds
setInterval(() => {
    // Remove closed windows from tracker
    const beforeCount = window._openedAdWindows.length;
    window._openedAdWindows = window._openedAdWindows.filter(w => !w.closed);
    const afterCount = window._openedAdWindows.length;

    if (beforeCount !== afterCount) {
        console.log(`🧹 Cleaned up ${beforeCount - afterCount} closed ad windows`);
    }

    // Prevent accumulation
    preventAdAccumulation();
}, 30000);

/**
 * Clear browser history using history API
 * This creates a clean slate by replacing history
 */
function clearBrowserHistory() {
    try {
        // Method 1: Clear forward/back history by replacing state
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);

        // Method 2: Push a clean state multiple times to bury old history
        for (let i = 0; i < 50; i++) {
            window.history.pushState(null, '', cleanUrl);
        }

        // Then go back to the clean state
        window.history.go(-49);

        console.log('✓ Browser history cleaned');
        return true;
    } catch (e) {
        console.warn('History clear failed:', e);
        return false;
    }
}

/**
 * Comprehensive page cleanup - closes everything
 */
async function closeAllPages() {
    console.log('🔥 CLOSING ALL PAGES...');

    let totalClosed = 0;

    // 1. Close tracked ad windows
    totalClosed += closeAllAdWindows();

    // 2. Try to close any iframes (ad networks often use these)
    try {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe, index) => {
            try {
                // Remove the iframe
                iframe.remove();
                console.log(`✓ Removed iframe ${index + 1}`);
                totalClosed++;
            } catch (e) {
                console.warn(`Failed to remove iframe ${index + 1}:`, e);
            }
        });
    } catch (e) {
        console.warn('Iframe cleanup failed:', e);
    }

    // 3. Clear history
    clearBrowserHistory();

    // 4. If in Telegram, try to close via Telegram API
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.close) {
        try {
            console.log('🔵 Closing via Telegram WebApp...');
            await new Promise(r => setTimeout(r, 1000));
            window.Telegram.WebApp.close();
        } catch (e) {
            console.warn('Telegram close failed:', e);
        }
    }

    console.log(`✅ Total pages closed: ${totalClosed}`);
    return totalClosed;
}

// Prevent pages from being added to history (popstate blocking)
window.addEventListener('popstate', function (e) {
    // Prevent back button from showing old ad pages
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);
});

// Export functions
window.closeAllAdWindows = closeAllAdWindows;
window.closeAllPages = closeAllPages;
window.clearBrowserHistory = clearBrowserHistory;

console.log('✅ Ad page manager loaded');
