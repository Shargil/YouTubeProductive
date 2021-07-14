onNavigationProgressBarEnd(filterVideoEnds, filterVideoEnds);

function filterVideoEnds() {
    chrome.storage.sync.get(["user", "CONST"], ({ user, CONST }) => {
        onEveryChildAdded("#primary #grid-container", (element) => {
            const channelNameElement = element.getElementsByTagName("ytd-channel-name")[0]
            if (channelNameElement) {
                const channelName = channelNameElement.innerText;
                if (shouldRemoveVideo(channelName, user, CONST)) {
                    removeAllContentOfElement(element);
                }
            }
        })
    });
}