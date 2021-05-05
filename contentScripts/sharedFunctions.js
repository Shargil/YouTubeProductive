// So background.js can ask if file is injected
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.background === "is sharedFunctions.js injected?")
            return true;
        return true;
    }
);

function onNavigationProgressBarEnd(onProgressEndCallBack, onProgressBarNotExistCallBack) {

    const progressElement = document.getElementsByTagName("yt-page-navigation-progress")[0];

    if (progressElement) {
        // Check if the progress is already on 100% and it might not be caught in the MutationObserver
        if (progressElementFinished(progressElement)) {
            onProgressEndCallBack();
        } else {

            // Callback function to execute when mutations are observed
            const callback = function (mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if (mutation.attributeName === "aria-valuenow") {
                        if (progressElementFinished(progressElement)) {
                            setTimeout(() => {
                                observer.disconnect();
                                onProgressEndCallBack();
                            }, 0);
                        }
                    }
                }
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: false, subtree: false };

            // Start observing the target node for configured mutations
            observer.observe(progressElement, config);
        }
    } else {
        onProgressBarNotExistCallBack();
    }
}

function progressElementFinished(ytPageNavigationElement) {
    return (ytPageNavigationElement &&
        ytPageNavigationElement.getAttribute("aria-valuenow") === "100" &&
        ytPageNavigationElement.getAttribute("hidden") === null);
}

function timeToRunFunc(func) {
    const t0 = performance.now()
    func();
    const t1 = performance.now()
    console.log("Call took " + (t1 - t0) + " milliseconds.")
}