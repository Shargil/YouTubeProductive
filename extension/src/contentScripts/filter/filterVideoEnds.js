filterVideoEnds();

function filterVideoEnds() {
    chrome.storage.sync.get("CONST", ({ CONST }) => {
        chrome.storage.local.get("myYoutube", ({ myYoutube }) => {
            onEveryChildAdded(".ytp-endscreen-content", (element) => {
                const channelNameElement = element.getElementsByClassName("ytp-videowall-still-info-author")[0]
                if (channelNameElement) {
                    const channelName = channelNameElement.innerText.split(" • ")[0];
                    if (shouldRemoveVideo(channelName, myYoutube, CONST)) {
                        removeAllContentOfElement(element);
                    }
                }
            })
        });
    });
}