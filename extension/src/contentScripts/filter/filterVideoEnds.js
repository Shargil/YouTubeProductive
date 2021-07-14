filterVideoEnds();

function filterVideoEnds() {
    chrome.storage.sync.get(["user", "CONST"], ({ user, CONST }) => {
        onEveryChildAdded(".ytp-endscreen-content", (element) => {
            const channelNameElement = element.getElementsByClassName("ytp-videowall-still-info-author")[0]
            if (channelNameElement) {
                const channelName = channelNameElement.innerText.split(" • ")[0];
                if (shouldRemoveVideo(channelName, user, CONST)) {
                    removeAllContentOfElement(element);
                }
            }
        })
    });
}