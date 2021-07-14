function onNavigationProgressBarEnd(onProgressEndCallBack, onProgressBarNotExistCallBack) {
    // window.addEventListener("yt-navigate-finish", function (event) {
    //     alert("HEYyyyy windows!")
    // });
    // document.addEventListener("yt-navigate-finish", function (event) {
    //     alert("HEYyyyy document!")
    // });

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
    const output = func();
    const t1 = performance.now()
    console.log("Call took " + (t1 - t0) + " milliseconds.")
    return output;
}

function getElement(querySelector) {
    return new Promise((resolve, reject) => {
        let element = querySelectorVisibleElement(document, querySelector);

        if (isElement(element)) {
            resolve(element);
        } else {
            const targetNode = document;
            const config = { attributes: false, childList: true, subtree: true };
            const callback = function (mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (querySelectorVisibleElement(mutation.target, querySelector)) {
                            element = querySelectorVisibleElement(mutation.target, querySelector);
                            resolve(element);
                            observer.disconnect();
                            this.disconnect(); // Maybe this will work?
                        }
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);

            const maxSecondsToObserve = 10;
            setTimeout(() => {
                if (!isElement(element)) {
                    observer.disconnect();
                    // reject("onElementCreated Didn't find: " + querySelector + " for " + maxSecondsToObserve + " seconds!")
                    throw new Error("onElementCreated Didn't find: " + querySelector + " for " + maxSecondsToObserve + " seconds!")
                }
            }, maxSecondsToObserve * 1000);
        }
    });
}
function querySelectorVisibleElement(targetNode, querySelector) {
    const elements = targetNode.querySelectorAll(querySelector);
    for (el of elements) {
        if (isElementVisible(el))
            return el;
    }
}

function isElementVisible(el) {
    return el.offsetParent !== null && el.style.height !== "0px";
}

function isElement(el) {
    return el && el.nodeType
}

// onEveryChildAdded just look to see if there new direct children (e.g. in the video containers).
// It's not constantly looking for changes in big parts of the DOM tree.
async function onEveryChildAdded(parentQuerySelect, runOnElement) {

    const parentNode = await getElement(parentQuerySelect);

    const elements = parentNode.children;
    for (let e of elements) {
        runOnElement(e);
    }

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: false };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            for (const childeNode of mutation.addedNodes) {
                runOnElement(childeNode);
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node (parentNode) for configured mutations
    observer.observe(parentNode, config);
}
