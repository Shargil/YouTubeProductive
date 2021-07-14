console.log("--- noThumbnails.js --- ");

// Compering mainly: observing the all subtree vs only direct children.
// onEveryElementCreated devtool loading home page profiling: 12.3ms/12.7ms, 8.6ms/8.9ms, 10.9ms/11.2ms, 1.8ms/2ms  , 5.8ms/6ms  , 11.6ms/11.8ms, 8ms/8.2ms   = 59 / 7 = 8.42ms
// onEveryChildAdded     devtool loading home page profiling: 0.4ms/0.7ms  , 0.4ms/0.7ms, 0.4ms/0.8ms  , 0.5ms/0.8ms, 0.3ms/0.6ms, 0.4ms/0.7ms  , 0.3ms/0.6ms = 2.7/ 7 = 0.38ms  (8.42ms / 0.38 = 22 times faster!)
async function onEveryElementCreated(elementsTagNames, parentQuerySelect, runOnElement) {
    // ----- Get existing elements -----
    const elements = document.querySelectorAll(elementsTagNames.join(", "));
    for (let ele of elements) {
        runOnElement(ele);
    }

    // ----- Listen for new elements -----
    // Set let us check in O(1) if element-tag-name is one of the elementsTagNames
    const elementsTagNamesSet = new Set(elementsTagNames);

    // Select the node that will be observed for mutations
    const parentNode = await getElement(parentQuerySelect);

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (elementsTagNamesSet.has(mutation.target.tagName)) {
                    // if (mutation.target.id === "mouseover-overlay") {
                    runOnElement(mutation.target);
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node (parentNode) for configured mutations
    observer.observe(parentNode, config);

    // const maxSecondsToObserve = 10;
    // setTimeout(() => {
    //     observer.disconnect();
    //     alert("disconnected!")
    // }, maxSecondsToObserve * 1000);
}

// function removeMe(element) {
//     element.remove()
// }

// onEveryElementCreated(["YT-IMG-SHADOW", "YTD-MOVING-THUMBNAIL-RENDERER"], "#contents", removeMe), 0)