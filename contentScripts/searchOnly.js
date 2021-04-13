console.log("--- searchOnly.js --- ");
// searchOnly();

// var count = 0
// var myInterval = setInterval(() => {
//     console.log("interval " + myInterval.toString())
//     searchOnly();

//     count++;
//     if (count >= 10) {
//         clearInterval(myInterval);
//     }
// }, 500);

window.addEventListener('load', function () {
    alert("--- searchOnly.js window load --- ");
    searchOnly();
});
document.addEventListener('load', function () {
    alert("--- searchOnly.js document load --- ");
    searchOnly();
});
document.addEventListener('reallyAllDone', function () {
    alert("--- searchOnly.js document reallyAllDone--- ");
    searchOnly();
});
window.addEventListener('reallyAllDone', function () {
    alert("--- searchOnly.js window reallyAllDone--- ");
    searchOnly();
});

document.addEventListener("DOMContentLoaded", function () {
    alert("--- searchOnly.js DOMContentLoaded--- ");
    searchOnly();
});
document.addEventListener('readystatechange', function () {
    alert("document ready state: " + document.readyState);
    searchOnly();
});
document.onreadystatechange(this, () => {
    alert("document ready state: " + document.readyState);
    searchOnly();
});


function searchOnly() {
    var endScreenContent = document.getElementsByClassName("ytp-endscreen-content");
    if (endScreenContent && endScreenContent[0])
        endScreenContent[0].remove();

    var contents = document.getElementById("contents");
    if (contents) {
        console.log(contents);
        contents.remove();
    }

    var suggestionsCol = document.getElementsByTagName('ytd-watch-next-secondary-results-renderer')[0]
    if (suggestionsCol)
        suggestionsCol.remove();

    var subscriptions = document.getElementsByTagName('ytd-guide-section-renderer')[1];
    if (subscriptions && subscriptions.querySelector('yt-formatted-string').innerText === "SUBSCRIPTIONS")
        subscriptions.remove();
}



