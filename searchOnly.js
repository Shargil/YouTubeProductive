chrome.storage.sync.get(["CONST", "user"], (res) => {
    debugger;
    if (res.user.extensionMode === res.CONST.EXTN_MODE.SEARCH_ONLY) {

        console.log("searchOnly is running!")
        debugger;

        var endScreenContent = document.getElementsByClassName("ytp-endscreen-content");
        if (endScreenContent && endScreenContent[0])
            endScreenContent[0].remove();

        var contents = document.getElementById("contents");
        if (contents)
            contents.remove();

        var suggestionsCol = document.getElementsByTagName('ytd-watch-next-secondary-results-renderer')[0]
        if (suggestionsCol)
            suggestionsCol.remove();

        var subscriptions = document.getElementsByTagName('ytd-guide-section-renderer')[1];
        if (subscriptions && subscriptions.querySelector('yt-formatted-string').innerText === "SUBSCRIPTIONS")
            subscriptions.remove();
    }
});
