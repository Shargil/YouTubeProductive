// On YouTube request new videos, ask foreground to rerun filter
const youTubeMoreVideosUrls = [
    "https://www.youtube.com/",
    "https://www.youtube.com/youtubei/v1/browse?*"
]

// onComplete?
chrome.webRequest.onResponseStarted.addListener(
    details => {
        console.log("On YouTube request new videos, rerun foreground");
        chrome.scripting.executeScript(
            {
                target: { tabId: details.tabId },
                files: ['fillter.js']
            },
            () => { });
    },
    { urls: youTubeMoreVideosUrls });