console.log("--- filter.js --- ");
// Home Screen, Smaller Subscription feed, Suggestion col, End video screen 
var query = 'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, .ytp-videowall-still';

chrome.storage.sync.get(["CONST", "user", "dev"], (res) => {

    console.log(chrome.runtime.getURL());
    debugger;

    let videos = document.querySelectorAll(query);

    // Guessing its a new video feed page
    if (videos.length <= 24) {
        let updatedDev = res.dev;
        updatedDev.filter.videosOldLength = 0;
        updatedDev.filter.videosFilteredIndexes = [];
        chrome.storage.sync.set({ dev: updatedDev }, () => { });
    } else { //  Guessing its a known video feed page
        // Delete the old videos we already went through
        for (let videoIndex of res.dev.filter.videosFilteredIndexes) {
            if (videos[videoIndex])
                videos[videoIndex].remove();
        }
    }

    var localVideosFilteredIndexes = []
    var intervalCount = 0;

    var newVideosInterval = setTimeout(() => {
        chrome.storage.sync.get("dev", (res) => {



            debugger;

            // let videos = document.querySelectorAll(query);

            // if (videosOldLength !== 0 && videos.length > videosOldLength) {
            //     alert("More " + (videos.length - videosOldLength) + " new videos going to be processed")
            // }

            // Go through only new videos
            for (let i = res.dev.filter.videosOldLength; i < videos.length; i++) {
                filterVideo = shouldFilterVideo(videos[i]);
                if (filterVideo) {
                    localVideosFilteredIndexes.push(i);
                    videos[i].remove();
                }
            }

            // If the for loop processed any new videos
            if (res.dev.filter.videosOldLength < videos.length) {
                chrome.storage.sync.get("dev", (res) => {
                    let updatedDev = res.dev;
                    updatedDev.filter.videosFilteredIndexes = updatedDev.filter.videosFilteredIndexes.concat(localVideosFilteredIndexes)
                    updatedDev.filter.videosOldLength = videos.length;
                    // updatedDev.filter.videosOldLength = videos.length + res.dev.filter.videosFilteredIndexes.length;
                    chrome.storage.sync.set({ dev: updatedDev }, () => { });
                });
            }


            // if (intervalCount++ >= 2) {
            //     clearInterval(newVideosInterval);
            // }
        });
    }, 250);

    // setTimeout(() => {
    //     filter();

    // }, 250);


    // setTimeout(() => {
    //     filter();
    // }, 250);


    // setTimeout(() => {
    //     filter();
    // }, 1000);

    function shouldFilterVideo(videoElement) {
        let channelName = getChannelNameOfVideoContainer(videoElement);

        if (res.user.list.TYPE === res.CONST.LIST_TYPE.BLACK_LIST) {
            if (channelName in res.user.list.LIST) {
                console.log(channelName);
                // videoElement.querySelector('#thumbnail').remove();
                return true;
            }
        } else { // it's a white list
            if (channelName && !(channelName in res.user.list.LIST)) {
                console.log(channelName);
                // videoElement.querySelector('#thumbnail').remove();
                return true;
            }
        }
    }


    // function filter() {

    //     // var t0 = performance.now()

    //     let videos = document.querySelectorAll(query);  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom

    //     // var t1 = performance.now()
    //     // console.log("Call to querySelectorAll took " + (t1 - t0) + " milliseconds.")

    //     // Save the index of delete videos, run the checker on only the new one.


    //     // var t2 = performance.now()
    //     for (let video of videos) {
    //         let channelName = getChannelNameOfVideoContainer(video);

    //         if (res.user.list.TYPE === res.CONST.LIST_TYPE.BLACK_LIST) {
    //             if (channelName in res.user.list.LIST) {
    //                 console.log(channelName);
    //                 // video.querySelector('#thumbnail').remove();
    //                 video.remove();
    //             }
    //         } else { // it's a white list
    //             if (channelName && !(channelName in res.user.list.LIST)) {
    //                 console.log(channelName);
    //                 // video.querySelector('#thumbnail').remove();
    //                 video.remove();
    //             }
    //         }
    //     }

    //     // var t3 = performance.now()
    //     // console.log("Call to 'for (let video of videos)' took " + (t3 - t2) + " milliseconds.")

    //     removeLoadingAnimation()
    // }


    function getChannelNameOfVideoContainer(videoContainer) {
        try {
            if (videoContainer.tagName.toLowerCase() === "ytd-rich-item-renderer" ||
                videoContainer.tagName.toLowerCase() === "ytd-compact-video-renderer" ||
                videoContainer.tagName.toLowerCase() === "ytd-grid-video-renderer")
                return videoContainer.querySelector('#channel-name').innerText;
            else if (videoContainer.classList.contains("ytp-videowall-still")) {
                return videoContainer.querySelectorAll('.ytp-videowall-still-info-author')[0].innerText.split('•')[0].trim();
            } else {
                if (res.dev.devMode === res.CONST.DEV_MODE.DEV) {
                    console.log("getChannelNameOfVideoContainer: The container was not recognized")
                }
            }
        } catch (error) {
            if (res.dev.devMode === res.CONST.DEV_MODE.DEV) {
                console.error("getChannelNameOfVideoContainer didn't found channel name. Original Error -> " + error);
                console.error(videoContainer);
            }
            return null;
        }
    }
});

function removeLoadingAnimation() {
    let element = document.querySelectorAll('ytd-watch-next-secondary-results-renderer paper-spinner')[0];
    if (element)
        element.remove();
}