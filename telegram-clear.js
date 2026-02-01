// ============================================================================
// TELEGRAM WEBVIEW SPECIFIC DATA CLEARING
// ============================================================================
// This module handles clearing data specifically in Telegram's in-app browser
// which has isolated storage and requires special handling
// ============================================================================

/**
 * Clears ALL Telegram WebApp data including CloudStorage
 * This is specifically for Telegram's in-app browser
 */
async function clearTelegramWebAppData() {
    const results = {
        cloudStorage: false,
        webAppData: false,
        forced: false
    };

    try {
        // Check if we're in Telegram WebApp
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.log('Not in Telegram WebApp environment');
            return results;
        }

        const tg = window.Telegram.WebApp;

        console.log('🔵 TELEGRAM WEBAPP DETECTED');
        console.log('Platform:', tg.platform);
        console.log('Version:', tg.version);

        // ========================================================================
        // 1. CLEAR TELEGRAM CLOUD STORAGE
        // ========================================================================
        // Telegram has its own CloudStorage API that persists data
        if (tg.CloudStorage) {
            console.log('💾 Clearing Telegram CloudStorage...');

            try {
                // Get all keys from CloudStorage
                const keys = await new Promise((resolve, reject) => {
                    tg.CloudStorage.getKeys((error, keys) => {
                        if (error) reject(error);
                        else resolve(keys || []);
                    });
                });

                console.log(`Found ${keys.length} CloudStorage keys:`, keys);

                // Remove each key
                for (const key of keys) {
                    await new Promise((resolve, reject) => {
                        tg.CloudStorage.removeItem(key, (error, success) => {
                            if (error) {
                                console.warn(`Failed to remove ${key}:`, error);
                                reject(error);
                            } else {
                                console.log(`✓ Removed CloudStorage key: ${key}`);
                                resolve(success);
                            }
                        });
                    });
                }

                // Also clear any known app-specific keys explicitly
                const knownKeys = [
                    'qtm_balance',
                    'qtm_userId',
                    'qtm_miningActive',
                    'user_data',
                    'app_state',
                    'session_data'
                ];

                for (const key of knownKeys) {
                    try {
                        await new Promise((resolve) => {
                            tg.CloudStorage.removeItem(key, () => resolve());
                        });
                    } catch (e) {
                        // Key might not exist, ignore
                    }
                }

                results.cloudStorage = true;
                console.log('✅ Telegram CloudStorage cleared');
            } catch (e) {
                console.error('CloudStorage clear error:', e);
            }
        } else {
            console.log('⚠️ CloudStorage API not available');
        }

        // ========================================================================
        // 2. CLEAR TELEGRAM WEBAPP INIT DATA
        // ========================================================================
        console.log('🔄 Clearing WebApp init data...');

        // The initData and initDataUnsafe contain user info from Telegram
        // We can't clear these directly, but we can mark them as processed
        try {
            // Store a flag that data was cleared
            if (tg.CloudStorage) {
                await new Promise((resolve) => {
                    tg.CloudStorage.setItem('_data_cleared', Date.now().toString(), () => {
                        resolve();
                    });
                });
            }
            results.webAppData = true;
        } catch (e) {
            console.warn('Failed to set clear flag:', e);
        }

        // ========================================================================
        // 3. TRIGGER HAPTIC FEEDBACK (confirms action to Telegram)
        // ========================================================================
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }

        // ========================================================================
        // 4. CLOSE AND REOPEN (forces Telegram to reload WebView)
        // ========================================================================
        console.log('🚪 Requesting Telegram WebView close...');

        // Method A: Try to close the WebApp
        if (tg.close) {
            try {
                // Set a flag in CloudStorage before closing
                if (tg.CloudStorage) {
                    await new Promise((resolve) => {
                        tg.CloudStorage.setItem('_should_reset', 'true', () => resolve());
                    });
                }

                // Close the WebApp (Telegram will handle the close)
                setTimeout(() => {
                    tg.close();
                }, 1000);

                results.forced = true;
            } catch (e) {
                console.warn('Close failed:', e);
            }
        }

        // Method B: Use BackButton to trigger close
        if (tg.BackButton && !results.forced) {
            try {
                tg.BackButton.show();
                tg.BackButton.onClick(() => {
                    tg.close();
                });

                setTimeout(() => {
                    if (tg.BackButton.isVisible) {
                        tg.BackButton.hide();
                    }
                }, 2000);
            } catch (e) {
                console.warn('BackButton method failed:', e);
            }
        }

        // ========================================================================
        // 5. SEND EVENT TO TELEGRAM (notify that we cleared data)
        // ========================================================================
        if (tg.sendData) {
            try {
                tg.sendData(JSON.stringify({
                    action: 'data_cleared',
                    timestamp: Date.now()
                }));
            } catch (e) {
                // sendData might not be available in all contexts
                console.log('sendData not available');
            }
        }

        return results;

    } catch (error) {
        console.error('Telegram clear error:', error);
        return results;
    }
}

/**
 * Force Telegram WebView to completely reload
 */
function forceTelegramReload() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        return false;
    }

    const tg = window.Telegram.WebApp;

    try {
        // Try multiple methods to force a complete reload

        // Method 1: Expand then collapse (forces layout recalculation)
        if (tg.expand) {
            tg.expand();
            setTimeout(() => {
                if (tg.close) tg.close();
            }, 500);
        }

        // Method 2: Show confirmation before reload
        if (tg.showConfirm) {
            tg.showConfirm(
                'Data cleared! Telegram WebApp will now close and reopen for a fresh session.',
                (confirmed) => {
                    if (confirmed || !confirmed) { // Close regardless
                        if (tg.close) tg.close();
                        else window.location.reload(true);
                    }
                }
            );
            return true;
        }

        // Method 3: Just close
        if (tg.close) {
            setTimeout(() => tg.close(), 500);
            return true;
        }

        return false;
    } catch (e) {
        console.error('Force reload error:', e);
        return false;
    }
}

/**
 * Check if we should auto-reset after Telegram WebView reopens
 */
async function checkTelegramAutoReset() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        return;
    }

    const tg = window.Telegram.WebApp;

    if (tg.CloudStorage) {
        try {
            const shouldReset = await new Promise((resolve) => {
                tg.CloudStorage.getItem('_should_reset', (error, value) => {
                    resolve(value === 'true');
                });
            });

            if (shouldReset) {
                console.log('🔄 Auto-reset detected, clearing local data...');

                // Clear the flag
                await new Promise((resolve) => {
                    tg.CloudStorage.removeItem('_should_reset', () => resolve());
                });

                // Clear all local data
                try {
                    localStorage.clear();
                    sessionStorage.clear();
                } catch (e) {
                    console.warn('Local clear failed:', e);
                }

                // Show success message
                if (tg.showAlert) {
                    tg.showAlert('✅ Data cleared successfully! Starting fresh session.');
                }
            }
        } catch (e) {
            console.warn('Auto-reset check failed:', e);
        }
    }
}

// Auto-check for reset on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkTelegramAutoReset);
} else {
    checkTelegramAutoReset();
}

// Export functions
window.clearTelegramWebAppData = clearTelegramWebAppData;
window.forceTelegramReload = forceTelegramReload;
window.checkTelegramAutoReset = checkTelegramAutoReset;

console.log('✅ Telegram WebApp clearing module loaded');
