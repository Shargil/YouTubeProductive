try { importScripts("constants.js"); } catch (e) { console.error(e); }

// --- On Install ---
chrome.runtime.onInstalled.addListener(function () {
    console.log("--- On Install ---");
    chrome.storage.sync.set({ CONST: CONST }, () => { });
    chrome.storage.sync.set({
        user: {
            extensionMode: CONST.EXTN_MODE.FILTER,
            list: CONST.LISTS.DEFAULT_BLACK
        }
    }, () => { });
    chrome.storage.sync.set({ devMode: CONST.DEV_MODE.DEV }, () => { });
});

// --- On YouTube Navigate To new Page With Videos Suggestions --- 
chrome.webRequest.onCompleted.addListener( // onCompleted? onResponseStarted? just try in real time, with no debugging, black list and white list, what works better.
    details => {
        console.log("--- On YouTube Navigate To new Page With Videos Suggestions --- " + details.url);
        chrome.storage.sync.get("user", (res) => {
            runExtensionModeScript(res.user.extensionMode, details.tabId);
        });
    },
    { urls: youTubeNavigateToNewPageUrls });


// --- On YouTube Request More Videos --- 
chrome.webRequest.onCompleted.addListener( // onCompleted? onResponseStarted? just try in real time, with no debugging, black list and white list, what works better.
    details => {
        console.log("--- On YouTube Request More Videos ---" + details.url);
        chrome.storage.sync.get("user", (res) => {
            runExtensionModeScript(res.user.extensionMode, details.tabId); // I need search only to run here as well because sometimes when moving between home/ explore/ subscriptions feeds, the youTubeNavigateToNewPageUrls doesn't call but just "...browse?...", which is in youTubeRequestMoreVideosURLs.
        });
    },
    { urls: youTubeRequestMoreVideosURLs });


// --- On YouTube Video Ends --- 
chrome.webRequest.onCompleted.addListener(
    details => {
        var url = new URL(details.url);
        // If the current time and length of the video are the same, it's the end.  
        if (url.searchParams.get("cmt") === url.searchParams.get("len")) {
            console.log("--- On YouTube Video Ends ---" + details.url);
            chrome.storage.sync.get("user", (res) => {
                runExtensionModeScript(res.user.extensionMode, details.tabId);
            });
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
                case "reloadAllYouTubeTabs":
                    // Should I reload all youtube tabs or just the one open?
                    chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
                        for (let tab of tabs) {
                            chrome.tabs.reload(tab.id, () => { });
                        }
                    });
                    break;
                case "reloadCurrYouTubeTab":
                    chrome.tabs.query({ active: true, currentWindow: true, url: "*://www.youtube.com/*" }, (tabs) => {
                        if (tabs.length === 1)
                            chrome.tabs.reload(tabs[0].id, () => { });
                        else {
                            if (tabs.length >= 2)
                                console.error("Up to 1 tab should be selected in reloadCurrYouTubeTab! If inspect elements was open when error was thrown its fine.");
                            // if it's 0 just don't refresh.
                        }

                    });
            }
        }
        return true; // https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon second answer
    }
);


// --- Extra Functions ---
function runExtensionModeScript(extensionMode, tabId) {
    switch (extensionMode) {
        case CONST.EXTN_MODE.FILTER:
            runScript('./contentScripts/filter.js', tabId);
            break;
        case CONST.EXTN_MODE.SEARCH_ONLY:
            runScript('./contentScripts/searchOnly.js', tabId);
            break;
        case CONST.EXTN_MODE.NO_THUMBNAILS:
            runScript('./contentScripts/noThumbnails.js', tabId);
            break;
    }
}

function runScript(scriptPath, tabId) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            files: [scriptPath]
        },
        () => { });
}