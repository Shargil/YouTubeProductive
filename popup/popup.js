// Setting the mode to the previews saved
chrome.storage.sync.get(["CONST", "user"], (res) => {
    selectLastModeRadioButton(res.user.extensionMode);

    document.getElementById('searchOnly').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.SEARCH_ONLY);
    document.getElementById('filter').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.FILTER);
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
            case res.CONST.EXTN_MODE.OFF:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.OFF } }, () => {
                    chrome.runtime.sendMessage({ contentScriptFuncs: "reloadAllYouTubeTabs" }, (res) => { });
                });
                break;
            default:
        }
    }

    function selectLastModeRadioButton(extensionMode) {
        let extensionModeElement = document.querySelector("#extensionModeContainer #" + extensionMode);
        extensionModeElement.checked = true;
    }
});