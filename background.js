try { importScripts("constants.js"); } catch (e) { console.error(e); }

// --- On Install ---
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ CONST: CONSTANTS }, () => { });
    chrome.storage.sync.set({
        user: {
            extensionMode: CONSTANTS.EXTN_MODE.FILTER,
            list: CONSTANTS.LISTS.DEFAULT_BLACK
        }
    }, () => { });
    chrome.storage.sync.set({ devMode: CONSTANTS.DEV_MODE.PROD }, () => { });
});

// --- On YouTube Request More Videos --- 
chrome.webRequest.onCompleted.addListener( // onCompleted? onResponseStarted? just try in real time, with no debugging, black list and white list, what works better.
    details => {
        console.log("relevant web request completed");
        runScript('filter.js', details.tabId);
        runScript('searchOnly.js', details.tabId);
    },
    { urls: youTubeAskMoreVideosURLs });


// --- On YouTube Video Ends --- 
chrome.webRequest.onCompleted.addListener(
    details => {
        var url = new URL(details.url);
        // If the current time and length of the video are the same, it's the end.  
        if (url.searchParams.get("cmt") === url.searchParams.get("len")) {
            runScript('filter.js', details.tabId);
            runScript('searchOnly.js', details.tabId);
        }
    },
    { urls: watchTimeStatsUrl });

// --- On Messages ---
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptFuncs) {
            switch (request.contentScriptFuncs) {
                case "getMyURL":
                    sendResponse({ url: sender.tab.url });
                    break;
                default:
            }
        }
    }
);

// --- Extra Functions ---

function runScript(scriptPath, tabId) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            files: [scriptPath]
        },
        () => { });
}