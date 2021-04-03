console.log("--- filter.js --- ");
chrome.storage.sync.get(["CONST", "user", "devMode"], (res) => {

    // Maybe I should take a different approach:
    // sample every 100ms
    // If something new found from query, run the filter on the new elements, if no continuo, if no for 10 samples, its stable, stop interval.

    // Home Screen , Suggestion col, End video screen 
    const query = 'ytd-rich-item-renderer, ytd-compact-video-renderer, .ytp-videowall-still';

    // Run the filter only when the query return a stable amount of DOM elements (probably finished rendering)
    runWhenQueryReturnSomethingStable(query, () => {
        let videos = document.querySelectorAll(query);  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom
        for (let video of videos) {
            let channelName = getChannelNameOfVideoContainer(video);

            switch (res.user.list.TYPE) {
                case res.CONST.LIST_TYPE.BLACK_LIST:
                    if (channelName in res.user.list.LIST) {
                        video.remove();
                    }
                    break;
                case res.CONST.LIST_TYPE.WHITE_LIST:
                    if (channelName && !(channelName in res.user.list.LIST)) {
                        video.remove();
                    }
                    break;
            }
        }
        removeLoadingAnimation()
    });


    function getChannelNameOfVideoContainer(videoContainer) {
        try {
            if (videoContainer.tagName.toLowerCase() === "ytd-rich-item-renderer" ||
                videoContainer.tagName.toLowerCase() === "ytd-compact-video-renderer")
                return videoContainer.querySelector('#channel-name').innerText;
            else if (videoContainer.classList.contains("ytp-videowall-still")) {
                return videoContainer.querySelectorAll('.ytp-videowall-still-info-author')[0].innerText.split('•')[0].trim();
            }
        } catch (error) {
            if (res.devMode === res.CONST.DEV_MODE.DEV) {
                console.error("getChannelNameOfVideoContainer didn't found channel name. Original Error -> " + error);
                console.error(videoContainer);
            }
            return null;
        }
    }

    function runWhenQueryReturnSomethingStable(query, myFunc) {
        let matchingElementsLength;
        const myInterval = setInterval(() => {
            matchingElementsLength = document.querySelectorAll(query).length;
            if (matchingElementsLength > 0 &&
                queryIsStableForTheLastIntervals(3, matchingElementsLength)) {
                clearInterval(myInterval);
                myFunc();
            }
        }, 300);
    }

    let matchingElementsLengthHistoryArray = [];
    function queryIsStableForTheLastIntervals(stableIntervals, matchingElementsLength) {
        matchingElementsLengthHistoryArray.push(matchingElementsLength);
        if (stableIntervals <= matchingElementsLengthHistoryArray.length) {
            let relevantIntervalsArray = matchingElementsLengthHistoryArray.slice(-(stableIntervals));
            let areLastIntervalsEqual = relevantIntervalsArray.every(e => e === relevantIntervalsArray[0]);
            return areLastIntervalsEqual;
        }
        return false;
    }

    function removeLoadingAnimation() {
        let element = document.querySelectorAll('ytd-watch-next-secondary-results-renderer paper-spinner')[0];
        if (element)
            element.remove();
    }
});