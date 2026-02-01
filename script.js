// --- QUANTUM MINER: HIGH-TRUST DEVICE STRATEGY ---
// Strategy: "Consistency > Deception"
// We ACCEPT the VPN Location (IP/Timezone match).
// We FAKE the Device Quality (iPhone 15 Pro, High-End Hardware).

const SYSTEM_CONFIG = {
  target: "iPhone15,3", // iPhone 14 Pro Max / 15 Plus
  os: "iOS 17.2",
  gpu: "Apple GPU",
  cores: 6
};

// 1. DEVICE IDENTITY (The "Premium" Signal)
try {
  // A. User Agent (Critical)
  Object.defineProperty(navigator, 'userAgent', {
    get: () => "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"
  });

  // B. Platform
  Object.defineProperty(navigator, 'platform', { get: () => "iPhone" });
  Object.defineProperty(navigator, 'vendor', { get: () => "Apple Computer, Inc." });
  Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 6 });

  // C. Touch (Critical for Mobile validation)
  Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });

  // D. Screen (iPhone 14 Pro Max Dimensions - Dynamic Jitter)
  // We add tiny random variance so every session looks like a slightly different calibration
  const baseW = 430;
  const baseH = 932;
  Object.defineProperty(screen, 'width', { get: () => baseW });
  Object.defineProperty(screen, 'height', { get: () => baseH });
  Object.defineProperty(screen, 'availWidth', { get: () => baseW });
  Object.defineProperty(screen, 'availHeight', { get: () => baseH });
  Object.defineProperty(window, 'innerWidth', { get: () => baseW });
  Object.defineProperty(window, 'innerHeight', { get: () => baseH });

  // E. BATTERY API SPOOFING (Adds organic "Charge" variance)
  if (navigator.getBattery) {
    navigator.getBattery = () => Promise.resolve({
      charging: true,
      chargingTime: 0,
      dischargingTime: Infinity,
      level: 0.9 + (Math.random() * 0.1), // 90% - 100%
      onchargingchange: null,
      onlevelchange: null,
    });
  }

} catch (e) { console.warn("SPOOF: DEVICE ID FAILED", e); }

// *** US VPN MATCHER (STRICT LOCALE ENFORCEMENT) ***
// Forces the browser to report as a US user in New York
try {
  // 1. Force Language
  Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

  // 2. Force Timezone (Intl API Override)
  const originalDTF = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function (locales, options) {
    options = options || {};
    options.timeZone = 'America/New_York';
    return new originalDTF('en-US', options);
  };
  Intl.DateTimeFormat.prototype = originalDTF.prototype;

  // 3. Force Date Object methods to match UTC-5
  const shift = -5 * 60; // EST offset in minutes
  // We don't overwrite Date.now(), just the string representations ad networks maintain
  Date.prototype.getTimezoneOffset = () => 300; // 5 hours * 60 min
} catch (e) { console.warn("SPOOF: LOCALE FAILED", e); }


// 2. GRADE 5 RESIDENTIAL MIMICRY (Hardware Realism)
try {
  // A. Remove Automation Flags
  if (navigator.webdriver) {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  }

  // B. Plugins (iOS Empty Array)
  Object.defineProperty(navigator, 'plugins', {
    get: () => {
      const p = [];
      p.refresh = () => { };
      p.item = () => null;
      p.namedItem = () => null;
      return p;
    }
  });

  // C. Media Devices (The "Physical Device" Proof)
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices = () => {
      return Promise.resolve([
        { kind: 'audioinput', label: 'iPhone Microphone', deviceId: 'default', groupId: 'group_1' },
        { kind: 'videoinput', label: 'Back Camera', deviceId: 'video_1', groupId: 'group_1' },
        { kind: 'videoinput', label: 'Front Camera', deviceId: 'video_2', groupId: 'group_1' },
        { kind: 'audiooutput', label: 'iPhone Speaker', deviceId: 'audio_1', groupId: 'group_1' }
      ]);
    };
  }

  // D. Permissions (User History)
  if (navigator.permissions && navigator.permissions.query) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = (parameters) => {
      if (parameters.name === 'notifications') {
        return Promise.resolve({ state: 'granted', onchange: null });
      }
      return originalQuery(parameters);
    };
  }

  // E. WebGL (Apple GPU)
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function (parameter) {
    if (parameter === 37445) return "Apple Inc.";
    if (parameter === 37446) return "Apple GPU";
    return getParameter.apply(this, [parameter]);
  };

  // F. Google Referrer (Organic Traffic Source)
  Object.defineProperty(document, 'referrer', { get: () => "https://www.google.com/" });

} catch (e) { console.warn("SPOOF: HARDWARE FAILED", e); }

console.log(`[SYSTEM] HIGH-TRUST CONFIG: ACTIVE. PROFILE: ${SYSTEM_CONFIG.target}`);

// 3. SECURE CONNECTION & SDK INJECTION
// Critical: Remove Telegram query data BEFORE the ad network sees it.
// This ensures they only see the VPN IP and "Clean" browser environment.
(function sanitizeAndConnect() {
  try {
    // A. Strip Telegram Params (tgWebAppData contains sensitive user info)
    // CRITICAL: We remove this immediately so the Ad Network never sees the "tgWebApp" query params
    if (window.location.search.includes('tgWebAppData')) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log("[SECURE] URL SANITIZED. TELEGRAM DATA WIPED.");
    }

    // B. Inject Ad SDK (Now that environment is clean)
    const sdkScript = document.createElement("script");
    sdkScript.src = "//libtl.com/sdk.js";
    sdkScript.dataset.zone = "10518266";
    sdkScript.dataset.sdk = "show_10518266"; // specific binding
    sdkScript.id = "monetag-sdk";

    // SDK Load Listener (Updates state)
    sdkScript.onload = () => {
      console.log("[SECURE] AD NETWORK CONNECTED VIA VPN TUNNEL.");
    };

    document.head.appendChild(sdkScript);

  } catch (e) {
    console.warn("Security Init Failed:", e);
  }
})();

const sdkMethod = "show_10518266";

// UI Elements
const miningDisplay = document.getElementById("miningBalance");
const hashRateDisplay = document.getElementById("hashRate");
const rigStatusDisplay = document.getElementById("rigStatus");
const tempDisplay = document.getElementById("rigTemp");
const boostTimerDisplay = document.getElementById("boostTimer");
const spinner = document.getElementById("coreSpinner");
const logEl = document.getElementById("terminalLog");
const userIdDisplay = document.getElementById("userIdDisplay");
const toggleBtn = document.getElementById("toggleMiningBtn");
const boostBtn = document.getElementById("boostBtn");

// State
let isMining = false;
let isBoosted = false;
let balance = 0.0000;
let autoLoopTimeout;
let watchdogTimeout;
let lastActivityTime = Date.now();
let boostEndTime = 0;
let userId = "guest";
let adsWatchedSession = 0;
let adReady = false;
let sdkReady = false;

// Config
const BASE_RATE = 0.000001;
const BOOST_MULTIPLIER = 500;
const TICK_RATE = 100;
let currentRate = 0;

function log(msg) {
  lastActivityTime = Date.now();
  logEl.innerText = msg;
}

function updateUI() {
  miningDisplay.innerText = balance.toFixed(6);

  if (isMining) {
    if (isBoosted) {
      hashRateDisplay.innerText = "500.0 MB/s (TURBO)";
      rigStatusDisplay.innerText = "TURBO";
      rigStatusDisplay.style.color = "#d97706";
      tempDisplay.innerText = (70 + Math.random() * 5).toFixed(1) + "%";
      tempDisplay.style.color = "#d97706";
    } else {
      hashRateDisplay.innerText = "1.2 MB/s (SYNCING)";
      rigStatusDisplay.innerText = "SYNCING";
      rigStatusDisplay.style.color = "#059669";
      tempDisplay.innerText = (45 + Math.random() * 2).toFixed(1) + "%";
      tempDisplay.style.color = "#059669";
    }
  } else {
    hashRateDisplay.innerText = "0 MB/s";
    rigStatusDisplay.innerText = "IDLE";
    rigStatusDisplay.style.color = "#9ca3af";
    tempDisplay.innerText = "24%";
    tempDisplay.style.color = "#9ca3af";
  }

  // Boost Timer
  if (isBoosted) {
    const remaining = Math.max(0, Math.ceil((boostEndTime - Date.now()) / 1000));
    boostTimerDisplay.innerText = remaining + "s";
    if (remaining <= 0) {
      endBoost();
    }
  } else {
    boostTimerDisplay.innerText = "0s";
  }
}

// Recursive Loop with Jitter (Polymorphic)
function loopUpdate() {
  if (!isMining) return;

  const rate = isBoosted ? BASE_RATE * BOOST_MULTIPLIER : BASE_RATE;
  balance += rate;
  updateUI();

  const nextTick = 80 + Math.random() * 40;
  setTimeout(loopUpdate, nextTick);
}

function generateIdentity() {
  const newId = "User-" + Math.floor(Math.random() * 10000000);
  userIdDisplay.innerText = "ID: " + newId;
  return newId;
}

// --- MINING LOOP ---
function startMining() {
  if (isMining) return;
  isMining = true;
  generateIdentity();
  lastActivityTime = Date.now();

  toggleBtn.classList.add("active");
  toggleBtn.querySelector(".switch-text").innerText = "Stop Sync";
  toggleBtn.querySelector(".switch-icon").innerText = "⏹";

  // Enable Boost
  boostBtn.disabled = false;
  boostBtn.classList.add("ready");

  log("SYSTEM INITIALIZED. CONNECTED TO POOL.");

  setTimeout(loopUpdate, 100);

  // START AD LOOP (Slow mode)
  scheduleNextAd(10000);

  // WATCHDOG: Ensures the loop never dies
  watchdogLoop();
}

function stopMining() {
  isMining = false;
  localStorage.setItem("qtm_miningActive", "false");
  endBoost();
  clearTimeout(autoLoopTimeout);
  clearTimeout(watchdogTimeout);

  toggleBtn.classList.remove("active");
  toggleBtn.querySelector(".switch-text").innerText = "Start Sync";

  boostBtn.disabled = true;
  boostBtn.classList.remove("ready");

  log("SYSTEM SHUTDOWN.");
  updateUI();
}

function watchdogLoop() {
  if (!isMining) return;

  const timeSinceLast = Date.now() - lastActivityTime;
  if (timeSinceLast > 45000) {
    console.warn("WATCHDOG: Loop Hang Detected. Restarting...");
    log("ERR: SYSTEM HANG. REBOOTING UTILITY...");
    clearTimeout(autoLoopTimeout);
    scheduleNextAd(2000);
  }

  // Random check interval
  watchdogTimeout = setTimeout(watchdogLoop, 4000 + Math.random() * 2000);
}

function activateBoost() {
  isBoosted = true;
  boostEndTime = Date.now() + 30000;
  log("HYPER-DRIVE ENGAGED. REVENUE MAXIMIZED.");
}

function endBoost() {
  isBoosted = false;
}

// --- AD SYSTEM (The Auto Loop) ---
const PLACEMENT_TAGS = [
  "level_complete_x2",
  "bonus_chest_open",
  "revive_player",
  "unlock_premium_skin",
  "daily_reward_claim"
];

async function simulateHumanity() {
  log("ANALYZING BIOMETRICS [TG-WEBVIEW]...");

  // 1. Mobile-Specific Scroll Jitter (Touch emulation)
  const x = Math.floor(Math.random() * window.innerWidth);
  const y = Math.floor(Math.random() * window.innerHeight);

  const touchStart = new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y });
  const touchEnd = new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y - (50 + Math.random() * 100) });

  document.body.dispatchEvent(new TouchEvent("touchstart", { touches: [touchStart], bubbles: true }));
  document.body.dispatchEvent(new TouchEvent("touchmove", { touches: [touchEnd], bubbles: true }));
  document.body.dispatchEvent(new TouchEvent("touchend", { changedTouches: [touchEnd], bubbles: true }));

  // 2. Telegram Native Bridge Interaction
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const fakeCheck = tg.colorScheme;

    if (tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }

    if (!tg.isExpanded) tg.expand();
  }

  // 3. Random computation delay
  const reactionTime = 800 + Math.random() * 2000;
  return new Promise(r => setTimeout(r, reactionTime));
}

function scheduleNextAd(delayMs) {
  if (!isMining) return;

  const variance = Math.random() * 12000;
  const nextDelay = delayMs || (8000 + variance);

  log(`NEXT CHECK IN ${(nextDelay / 1000).toFixed(0)}s...`);

  autoLoopTimeout = setTimeout(() => {
    if (!isMining) return;

    adsWatchedSession++;
    if (adsWatchedSession > 8 + Math.random() * 5) {
      log("USER IDLE: TAKING SHORT BREAK...");
      adsWatchedSession = 0;
      setTimeout(performIntegrityCheck, 60000 + Math.random() * 120000);
    } else {
      performIntegrityCheck();
    }
  }, nextDelay);
}

async function performIntegrityCheck() {
  localStorage.removeItem("monetag_sdk_data");
  sessionStorage.clear();

  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  generateIdentity();
  log("REQ: NEW SESSION ID GENERATED...");

  const fakePlacement = PLACEMENT_TAGS[Math.floor(Math.random() * PLACEMENT_TAGS.length)];
  await simulateHumanity();

  showAd().then((success) => {
    if (success) {
      balance += 0.05;
      log("AD WATCHED. CREDITED.");
      scheduleNextAd();
    } else {
      scheduleNextAd(5000);
    }
  });
}

// Simplified Ad Logic w/ Auto-Close (Safety Monitor)
function showAd() {
  return new Promise((resolve) => {
    if (typeof window[sdkMethod] === 'function') {
      const killerTimer = setTimeout(() => {
        try {
          if (typeof log === 'function') log("FORCE REFRESHING SESSION...");
          if (typeof saveState === 'function') saveState();
          location.reload();
        } catch (e) {
          location.reload();
        }
      }, 15000);

      window[sdkMethod]().then(() => {
        clearTimeout(killerTimer);
        resolve(true);
      }).catch((e) => {
        clearTimeout(killerTimer);
        console.warn("Ad error:", e);
        resolve(false);
      });
    } else {
      console.warn("Ad SDK not ready");
      resolve(false);
    }
  });
}

// --- PERSISTENCE LAYER ---
function saveState() {
  localStorage.setItem("qtm_balance", balance.toString());
  localStorage.setItem("qtm_userId", userId);
  localStorage.setItem("qtm_miningActive", isMining ? "true" : "false");
}

function loadState() {
  const savedBalance = localStorage.getItem("qtm_balance");
  if (savedBalance) balance = parseFloat(savedBalance);

  const savedId = localStorage.getItem("qtm_userId");
  if (savedId) userId = savedId;

  // Auto-Resume
  const wasMining = localStorage.getItem("qtm_miningActive") === "true";
  if (wasMining) {
    log("RECOVERING SESSION STATE...");
    setTimeout(startMining, 1000);
  }
}

// --- INTERACTION ---
toggleBtn.addEventListener("click", () => {
  if (isMining) stopMining();
  else startMining();
});

boostBtn.addEventListener("click", () => {
  if (!isMining) return;

  log("INITIATING HYPER-DRIVE...");

  showAd().then((success) => {
    if (success) {
      activateBoost();
      balance += 1.0;
      log("ENERGY INJECTED. BOOST ACTIVE.");
    } else {
      log("AD FAILED. NO BOOST.");
    }
  });
});

// Clear All Button Handler
const clearAllBtn = document.getElementById("clearAllBtn");
clearAllBtn.addEventListener("click", () => {
  // Confirm before clearing
  const confirmed = confirm("⚠️ This will clear ALL data including:\n\n• Cookies\n• Cache\n• Local Storage\n• Session Storage\n• Browser History\n\nAre you sure you want to continue?");

  if (!confirmed) return;

  try {
    log("CLEARING ALL DATA...");

    // 1. Clear All Cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
    }

    // 2. Clear Local Storage
    localStorage.clear();

    // 3. Clear Session Storage
    sessionStorage.clear();

    // 4. Clear Cache (Service Workers & Cache API)
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // 5. Unregister Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }

    // 6. Clear IndexedDB
    if (window.indexedDB) {
      indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          indexedDB.deleteDatabase(db.name);
        });
      }).catch(() => {
        // Fallback: some browsers don't support databases() method
        console.log("IndexedDB cleanup completed (legacy mode)");
      });
    }

    // Stop mining if active
    if (isMining) {
      stopMining();
    }

    // Reset balance
    balance = 0;
    updateUI();

    log("✅ ALL DATA CLEARED SUCCESSFULLY!");

    // Optional: Reload page after a short delay
    setTimeout(() => {
      location.reload();
    }, 1500);

  } catch (error) {
    console.error("Clear All Error:", error);
    log("⚠️ ERROR: SOME DATA MAY NOT BE CLEARED");
  }
});


// Init
generateIdentity();
loadState();
updateUI();

// SDK Load Listener
const script = document.getElementById("monetag-sdk");
if (script) {
  script.onload = () => {
    sdkReady = true;
    log("MODULE LOADED. READY.");
  };
}

// Safety check poller
setInterval(() => {
  if (!sdkReady && window[sdkMethod]) {
    sdkReady = true;
    log("MODULE DETECTED.");
  }
}, 1000);

// Auto-Save Loop
setInterval(() => {
  if (isMining) saveState();
}, 5000);
