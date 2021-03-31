// Setting the mode to the previews saved
chrome.storage.sync.get(["CONST", "user"], (res) => {
    let extensionModeElement = document.querySelector("#extensionModeContainer #" + res.user.extensionMode);
    extensionModeElement.checked = true;
    console.log(extensionModeElement)

    debugger;
    console.log(res.CONST)
    console.log(res.CONST.EXTN_MODE.SEARCH_ONLY)
    document.getElementById('searchOnly').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.SEARCH_ONLY);
    document.getElementById('filter').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.FILTER);
    document.getElementById('off').onclick = onModeClick.bind(this, res.CONST.EXTN_MODE.OFF);

    function onModeClick(mode) {
        switch (mode) {
            case res.CONST.EXTN_MODE.SEARCH_ONLY:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.SEARCH_ONLY } }, () => { });
                break;
            case res.CONST.EXTN_MODE.FILTER:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.FILTER } }, () => { });
                break;
            case res.CONST.EXTN_MODE.OFF:
                chrome.storage.sync.set({ user: { extensionMode: res.CONST.EXTN_MODE.OFF } }, () => { });
                break;
            default:
        }
    }
});