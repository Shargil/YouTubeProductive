
console.log("--- main filter.js run ---")

// Compering mainly: document.querySelectorAll vs observer mutation only direct children.
// filter (document.querySelectorAll) devtool loading home page profiling: 37.57 ms, 14.14 ms, 21.75 ms, 27.5
// onEveryChildAdded     devtool loading home page profiling: 0.4ms/0.7ms  , 0.4ms/0.7ms, 0.4ms/0.8ms  , 0.5ms/0.8ms, 0.3ms/0.6ms, 0.4ms/0.7ms  , 0.3ms/0.6ms = 2.7/ 7 = 0.38ms  
// (8.42ms / 0.38 = 22 times faster!)


// --- init ---
var CONST;
var user;
chrome.storage.sync.get(["CONST", "user"], (res) => {
    CONST = Object.freeze(res.CONST);
    user = Object.freeze(res.user);
});

var query = 'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer';
var videosFilteredIndexes = []; // Indexes are static- before removing of some elements.
var lastPrecessedVideoIndex = 0;
var scrollPosition = 0;


// --- Run ---
// When you navigate between pages inside YouTube
onNavigationProgressBarEnd(() => {
    setTimeout(() => {
        filterHome();
    }, 500);
},
    () => {
        console.log("progress bar didn't exist!")
        setTimeout(() => {
            filterHome();
        }, 500);
    });

window.onscroll = function () {
    scrollPosition = parseInt(document.documentElement.scrollTop);
};


// --- filter ---
/**
 * Get Videos
 * Go through all of them
 *      See witch one to remove
 *      Save the removed ones
 */
function filterHome() {
    console.log("--- filter() - filter.js ---")

    let videos = document.querySelectorAll(query);
    for (const [i, video] of videos.entries()) {
        let channelName = getChannelNameOfVideoContainer(video);

        if (shouldRemoveVideo(channelName)) {
            video.remove();
            videosFilteredIndexes.push(i);
        }
        lastPrecessedVideoIndex = i;
    }
    console.log("lastPrecessedVideoIndex: " + lastPrecessedVideoIndex);
}

// Calling this function from different file, that we inject to the
// same tab (same isolated world), thus it recognize this function
function newVideos() {
    if (lastPrecessedVideoIndex > 0) {
        filterNewVideos();
    }
}


/**
 * Don't run when filter just run    
 * Get Videos
 * Remove known ones
 * Go through the new ones
 *      See witch one to remove
 *      Save the removed ones
 */
function filterNewVideos() {
    console.log("--- filterNewVideos() - filter.js ---")
    let videos = document.querySelectorAll(query);

    testIfFirstFilteredIndexIsMistake(videos);

    // Remove videos that we all ready known we should filter
    for (videoIndex of videosFilteredIndexes) {
        videos[videoIndex].remove();
    }

    // Go through only the new videos
    for (let i = lastPrecessedVideoIndex + 1; i < videos.length; i++) {
        let channelName = getChannelNameOfVideoContainer(videos[i]);
        if (shouldRemoveVideo(channelName)) {
            videos[i].remove();
            videosFilteredIndexes.push(i);
        }
        lastPrecessedVideoIndex = i;
    }

    console.log("lastPrecessedVideoIndex: " + lastPrecessedVideoIndex);

    // If we don't save the value, it start scrolling, update scrollPosition, and get stuck after little change
    var currScrollPosition = scrollPosition
    document.documentElement.scrollTop = currScrollPosition;
}

function filterEndOfVideoVideos() {
    console.log("--- filterEndOfVideoVideos() - filter.js ---");

    let videos = document.querySelectorAll('.ytp-videowall-still');
    for (const [i, video] of videos.entries()) {
        let channelName = getChannelNameOfVideoContainer(video);
        if (shouldRemoveVideo(channelName)) {
            video.remove();
        }
    }
}


// --- Filter Extra Functions ---
function notFirstFilterForThisScript() {
    return lastPrecessedVideoIndex > 0;
}

function testIfFirstFilteredIndexIsMistake(videos) {
    if (videosFilteredIndexes[0]) {
        let channelName = getChannelNameOfVideoContainer(videos[videosFilteredIndexes[0]]);
        if (!shouldRemoveVideo(channelName)) {
            throw new Error("First index to be removed is not spoused to be removed!");
        }
    }
}

function shouldRemoveVideo(channelName) {
    if (user.myYoutube.listType === CONST.LIST_TYPE.BLACK_LIST) {
        if (channelName in user.myYoutube.list) {
            console.log(channelName);
            // video.querySelector('#thumbnail').remove();
            return true;
        }
    } else { // it's a white list
        if (channelName && !(channelName in user.myYoutube.list)) {
            console.log(channelName);
            // video.querySelector('#thumbnail').remove();
            return true;
        }
    }
    return false;
}

function getChannelNameOfVideoContainer(videoContainer) {
    try {
        if (videoContainer.querySelector('#channel-name'))
            return videoContainer.querySelector('#channel-name').innerText;
        else if (videoContainer.querySelectorAll('.ytp-videowall-still-info-author'))
            return videoContainer.querySelectorAll('.ytp-videowall-still-info-author')[0].innerText.split('•')[0].trim();
        else
            console.log("Couldn't find channel name: in getChannelNameOfVideoContainer")
    } catch (error) {
        console.log(error);
    }
}