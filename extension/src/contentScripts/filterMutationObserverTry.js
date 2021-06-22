console.log("--- filter.js --- ");
chrome.storage.sync.get(["CONST", "user", "devMode"], (res) => {
    // debugger;


    // Wait for container, when specific container created, stop it, attach new observer for his children.



    // Mutation Observer Good Reads
    // https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340
    // https://stackoverflow.com/questions/38881301/observe-mutations-on-a-target-node-that-doesnt-exist-yet/38882022#38882022

    // --- Home Page Filter ---
    waitForAddedNode('contents', document.getElementsByTagName('body')[0], false,
        (elementNode) => {
            let videoContainerTagHomePage = "ytd-rich-item-renderer";
            let queryChannelHomePage = '#channel-name';

            // If some elements already exist 
            filterElements(document.querySelectorAll(videoContainerTagHomePage), queryChannelHomePage);
            let observer = new MutationObserver((mutations, observer) => {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.tagName &&
                            addedNode.tagName.toLowerCase() === videoContainerTagHomePage) {
                            console.log(addedNode);
                            console.log([addedNode]);
                            // alert(addedNode);
                            // debugger;

                            filterElements([addedNode], queryChannelHomePage);
                        }
                    }
                }
            });
            observer.observe(elementNode, { subtree: true, childList: true });

            setTimeout(() => { observer.disconnect() }, 5000);
        }
    );


    // --- Extra Functions ---
    function waitForAddedNode(id, parent, recursive, callBack) {
        // If it's already exist
        var elementNode = document.getElementById(id);
        if (elementNode) {
            callBack(elementNode);
        } else {

            let observer = new MutationObserver((mutations) => {
                var elementNode = document.getElementById(id);
                if (elementNode) {
                    this.disconnect();

                }
            });

            observer.observe(parent || document, {
                subtree: !!recursive || !parent,
                childList: true,
            });
        }
    }


    function filterElements(videosContainers, queryChannelHomePage) {
        // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom
        for (let video of videosContainers) {
            let channelName = getChannelName(video);

            switch (res.user.list.TYPE) {
                case res.CONST.LIST_TYPE.BLACK_LIST:
                    if (channelName in res.user.list.LIST) {
                        console.log(channelName);
                        video.parentNode.removeChild(video); //https://stackoverflow.com/questions/14003606/remove-element-by-tag-name
                    }
                    break;
                case res.CONST.LIST_TYPE.WHITE_LIST:
                    if (channelName && !(channelName in res.user.list.LIST)) {
                        console.log(channelName);
                        video.parentNode.removeChild(video);
                    }
                    break;
            }
        }
        removeLoadingAnimation()
    }




    // // Maybe I should take a different approach:
    // // sample every 100ms
    // // If something new found from query, run the filter on the new elements, if no continuo, if no for 10 samples, its stable, stop interval.

    // // Home Screen, Smaller Subscription feed, Suggestion col, End video screen 
    // const query = 'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, .ytp-videowall-still';

    // // Run the filter only when the query return a stable amount of DOM elements (probably finished rendering)
    // runWhenQueryReturnSomethingStable(query, () => {
    //     let videos = document.querySelectorAll(query);  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom
    //     for (let video of videos) {
    //         let channelName = getChannelNameOfVideoContainer(video);

    //         switch (res.user.list.TYPE) {
    //             case res.CONST.LIST_TYPE.BLACK_LIST:
    //                 if (channelName in res.user.list.LIST) {
    //                     console.log(channelName);
    //                     video.remove();
    //                 }
    //                 break;
    //             case res.CONST.LIST_TYPE.WHITE_LIST:
    //                 if (channelName && !(channelName in res.user.list.LIST)) {
    //                     console.log(channelName);
    //                     video.remove();
    //                 }
    //                 break;
    //         }
    //     }
    //     removeLoadingAnimation()
    // });

    function getChannelName(videoContainer) {
        try {
            if (videoContainer.tagName.toLowerCase() === "ytd-rich-item-renderer" ||
                videoContainer.tagName.toLowerCase() === "ytd-compact-video-renderer" ||
                videoContainer.tagName.toLowerCase() === "ytd-compact-video-renderer")
                return videoContainer.querySelector('#channel-name').innerText;
            else if (videoContainer.classList.contains("ytp-videowall-still")) {
                return videoContainer.getElementsByClassName('ytp-videowall-still-info-author')[0].innerText.split('•')[0].trim();
            } else {
                if (res.devMode === res.CONST.DEV_MODE.DEV) {
                    console.log("getChannelNameOfVideoContainer: The container was not recognized")
                }
            }
        } catch (error) {
            if (res.devMode === res.CONST.DEV_MODE.DEV) {
                console.error("getChannelNameOfVideoContainer didn't found channel name. Original Error -> " + error);
                console.error(videoContainer);
            }
            return null;
        }
    }

    // function runWhenQueryReturnSomethingStable(query, myFunc) {
    //     let matchingElementsLength;
    //     const myInterval = setInterval(() => {
    //         matchingElementsLength = document.querySelectorAll(query).length;
    //         if (matchingElementsLength > 0 &&
    //             queryIsStableForTheLastIntervals(3, matchingElementsLength)) {
    //             clearInterval(myInterval);
    //             myFunc();
    //         }
    //     }, 300);
    // }

    // let matchingElementsLengthHistoryArray = [];
    // function queryIsStableForTheLastIntervals(stableIntervals, matchingElementsLength) {
    //     matchingElementsLengthHistoryArray.push(matchingElementsLength);
    //     if (stableIntervals <= matchingElementsLengthHistoryArray.length) {
    //         let relevantIntervalsArray = matchingElementsLengthHistoryArray.slice(-(stableIntervals));
    //         let areLastIntervalsEqual = relevantIntervalsArray.every(e => e === relevantIntervalsArray[0]);
    //         return areLastIntervalsEqual;
    //     }
    //     return false;
    // }

    function removeLoadingAnimation() {
        let element = document.querySelector('ytd-watch-next-secondary-results-renderer paper-spinner');
        if (element)
            element.remove();
    }
});