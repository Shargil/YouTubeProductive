// Setting the mode to the previews saved
chrome.storage.sync.get("extensionMode", (res) => {
    let extensionModeElement = document.querySelector("#extensionModeContainer #" + res.extensionMode);
    extensionModeElement.checked = true;
});

document.getElementById('searchOnly').onclick = onModeClick.bind(this, EXTN_MODE.SEARCH_ONLY);
document.getElementById('filter').onclick = onModeClick.bind(this, EXTN_MODE.FILTER);
document.getElementById('off').onclick = onModeClick.bind(this, EXTN_MODE.OFF);

function onModeClick(mode) {
    switch (mode) {
        case EXTN_MODE.SEARCH_ONLY:
            chrome.storage.sync.set({ extensionMode: EXTN_MODE.SEARCH_ONLY }, () => { });
            break;
        case EXTN_MODE.FILTER:
            chrome.storage.sync.set({ extensionMode: EXTN_MODE.FILTER }, () => { });
            break;
        case EXTN_MODE.OFF:
            chrome.storage.sync.set({ extensionMode: EXTN_MODE.OFF }, () => { });
            break;
        default:
    }
}

// document.getElementById("extensionOnOff").addEventListener('click', event => {
//     debugger;
//     console.log(event);
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         console.log(tabs[0].id);
//     });
// })