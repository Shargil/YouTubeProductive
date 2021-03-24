// On installing the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('On installing!');
});

// On chancing to the tab
chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, (current_tab_info) => {
        if (current_tab_info.url == "https://www.youtube.com/") {
            insertFilesToForeground();
        }
    });
});

// On refreshing the tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.tabs.get(tabId, (current_tab_info) => {
        if (current_tab_info.url == "https://www.youtube.com/") {
            insertFilesToForeground();
        }
    });
});

// On YouTube request new videos, ask foreground to rerun filter
const youTubeMoreVideosUrls = [
    "https://www.youtube.com/",
    "https://www.youtube.com/youtubei/v1/browse?*"
]

// onComplete?
chrome.webRequest.onResponseStarted.addListener(details => {
    console.log("On YouTube request new videos, rerun foreground")
    rerunForegroundFilter();
},
    { urls: youTubeMoreVideosUrls });


function insertFilesToForeground() {
    chrome.tabs.insertCSS(null, { file: './mystyle.css' });
    chrome.tabs.executeScript(null, { file: "./foreground.js" }, () =>
        console.log("i injected from bg to foreground.js")
    );
}