console.log("--- searchOnly.js --- ");

setTimeout(() => {
    searchOnly();
}, 0);

function searchOnly() {

    var browse = document.getElementsByTagName("ytd-browse")[0];
    if (browse) {
        console.log(browse);
        browse.remove();
    }

    var suggestionsCol = document.getElementsByTagName('ytd-watch-next-secondary-results-renderer')[0]
    if (suggestionsCol)
        suggestionsCol.remove();

    var endScreenContent = document.getElementsByClassName("ytp-endscreen-content");
    if (endScreenContent && endScreenContent[0])
        endScreenContent[0].remove();

    var subscriptions = document.getElementsByTagName('ytd-guide-section-renderer')[1];
    if (subscriptions && subscriptions.querySelector('yt-formatted-string').innerText === "SUBSCRIPTIONS")
        subscriptions.remove();
}