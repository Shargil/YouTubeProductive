
chrome.storage.sync.get(["CONST", "user"], (res) => {
    setModeButtonToPreviewsSaved(res.user.extensionMode);

    document.getElementById('searchOnly').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.SEARCH_ONLY);
    document.getElementById('filter').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.FILTER);
    document.getElementById('noThumbnails').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.NO_THUMBNAILS);
    document.getElementById('off').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.OFF);

    function onModeClick(mode) {
        switch (mode) {
            case res.CONST.EXTN_MODE.SEARCH_ONLY:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.SEARCH_ONLY } }, () => {
                    chrome.runtime.sendMessage({ contentScriptFuncs: "reloadAllYouTubeTabs" }, (res) => { });
                });
                break;
            case res.CONST.EXTN_MODE.FILTER:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.FILTER } }, () => {
                    chrome.runtime.sendMessage({ contentScriptFuncs: "reloadAllYouTubeTabs" }, (res) => { });
                });
                break;
            case res.CONST.EXTN_MODE.NO_THUMBNAILS:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.NO_THUMBNAILS } }, () => {
                    chrome.runtime.sendMessage({ contentScriptFuncs: "reloadAllYouTubeTabs" }, (res) => { });
                });
                break;
            case res.CONST.EXTN_MODE.OFF:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.OFF } }, () => {
                    chrome.runtime.sendMessage({ contentScriptFuncs: "reloadAllYouTubeTabs" }, (res) => { });
                });
                break;
            default:
        }
    }

    function setModeButtonToPreviewsSaved(extensionMode) {
        let extensionModeElement = document.querySelector("#extensionModeContainer #" + extensionMode);
        extensionModeElement.checked = true;
    }
});