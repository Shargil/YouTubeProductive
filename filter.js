console.log("filter.js run");
chrome.storage.sync.get(["CONST", "user", "devMode"], (res) => {
    if (res.user.extensionMode === res.CONST.EXTN_MODE.FILTER) {

        const query = 'ytd-rich-item-renderer, ytd-compact-video-renderer';

        // Run the filter only when the query return a stable amount of DOM elements (probably finished rendering)
        runWhenQueryReturnSomething(query, () => {
            var videos = document.querySelectorAll(query);  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom
            var deleteMe = " "
            for (let video of videos) {
                let channelName = getChannelNameOfVideoContainer(video);

                switch (res.user.list.TYPE) {
                    case res.CONST.LIST_TYPE.BLACK_LIST:
                        if (channelName in res.user.list.LIST) {
                            deleteMe = deleteMe + channelName + ', '
                            video.remove();
                        }
                        break;
                    case res.CONST.LIST_TYPE.WHITE_LIST:
                        if (channelName && !(channelName in res.user.list.LIST)) {
                            deleteMe = deleteMe + channelName + ', '
                            video.remove();
                        }
                        break;
                }
            }
            alert("filter!" + deleteMe);
            removeLoadingAnimation()
        });


        function getChannelNameOfVideoContainer(videoContainer) {
            try {
                return videoContainer.querySelector('#channel-name').innerText;
            } catch (error) {
                if (res.devMode === res.CONST.DEV_MODE.DEV) {
                    console.error("getChannelNameOfVideoContainer didn't found channel name. Original Error -> " + error);
                    console.error(videoContainer);
                }
                return null;
            }
        }

        function runWhenQueryReturnSomething(query, myFunc) {
            let matchingElementsLength;;
            const myInterval = setInterval(() => {
                matchingElementsLength = document.querySelectorAll(query).length;
                if (matchingElementsLength > 0 &&
                    queryIsStableForTheLastIntervals(3, matchingElementsLength)) {
                    clearInterval(myInterval);
                    alert("The number of elements founded: " + matchingElementsLength);
                    myFunc();
                }
            }, 400);
        }

        let matchingElementsLengthArray = [];
        function queryIsStableForTheLastIntervals(stableIntervals, matchingElementsLength) {
            matchingElementsLengthArray.push(matchingElementsLength);
            console.log(matchingElementsLength);
            if (stableIntervals <= matchingElementsLengthArray.length) {
                let relevantIntervalsArray = matchingElementsLengthArray.slice(-(stableIntervals));
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

    }
});