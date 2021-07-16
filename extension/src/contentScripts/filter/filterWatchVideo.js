onNavigationProgressBarEnd(filterVideoEnds, filterVideoEnds);

function filterVideoEnds() {
    chrome.storage.sync.get("CONST", ({ CONST }) => {
        chrome.storage.local.get("myYoutube", ({ myYoutube }) => {
            onEveryChildAdded("#secondary #contents", (element) => {
                const channelNameElement = element.getElementsByTagName("ytd-channel-name")[0]
                if (channelNameElement) {
                    const channelName = channelNameElement.innerText;
                    if (shouldRemoveVideo(channelName, myYoutube, CONST)) {
                        removeAllContentOfElement(element);
                    }
                }
            })
        });
    });
}