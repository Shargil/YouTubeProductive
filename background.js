try { importScripts("constants.js"); } catch (e) { console.error(e); }

// --- On Install ---
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ extensionMode: EXTN_MODE.FILTER }, () => { });
});

// --- On YouTube Request More Videos --- 
chrome.webRequest.onCompleted.addListener(
    // onComplete? onResponseStart? just try in real time, with no debugging, black list and white list, what works better.
    details => {
        // runScript('filter.js', details.tabId);
        runScript('searchOnly.js', details.tabId);
    },
    { urls: youTubeAskMoreVideosUrls });



function runScript(scriptPath, tabId) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            files: [scriptPath]
        },
        () => { });
}

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