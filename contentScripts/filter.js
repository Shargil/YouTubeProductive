
console.log("--- main filter.js run ---")


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
// When you navigate between pages in the website
onNavigationProgressBarEnd(() => {
    setTimeout(() => {
        filter();
    }, 500);
},
    () => {
        console.log("progress bar didn't exist!")
        setTimeout(() => {
            filter();
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
function filter() {
    console.log("--- filter() - filter.js ---")

    let videos = document.querySelectorAll(query);
    for (const [i, video] of videos.entries()) {
        let channelName = getChannelNameOfVideoContainer(video);


        let categoryClassStr = '<div style="height: 60px; width: 296px; display: flex; border: 1px solid lightgray; font-size: 12px">    <div style="height: 60px; width: 25%;">        <input type="radio" id="no" name="choice' + i + '" value="no" onclick="changeColor(event, \'no\')">        <label for="no">no</label><br/>        <input type="radio" id="maybe" name="choice' + i + '" value="maybe" onclick="changeColor(event, \'maybe\')">         <label for="maybe">maybe</label><br/>        <input type="radio" id="yes" name="choice' + i + '" value="yes" onclick="changeColor(event, \'yes\')">        <label for="yes">yes</label>    </div>    <script>        function changeColor(event, value) {            let color;            switch(value)            {                case \'no\':                    color = "#FF0000";                break;                case \'maybe\':                    color = "#FFA500";                break;                case \'yes\':                    color = "#00FF00";                break;            }            event.target.parentElement.style.backgroundColor = color;        }    </script>    <div style="width: 35%; margin-left: 20px;">        <div style="height: 33%; width: 100%;  padding-top:5px;">            <span>YT Video Cat</span>        </div>        <div style="height: 66%; width: 100%; padding-top: 6px; font-weight: 700">            <span class="videoYTCat">Waiting...</span>        </div>    </div>    <div style="width: 40%;">        <div style="height: 50%; width: 100%;  padding-top:4px;">            <span>Community cat by channel (my guess)</span>        </div>        <div style="height: 30%; width: 100%;">            <textarea style="width: 90%; font-weight: 700; height: 16px;"></textarea>        </div>    </div></div>'
        let childElement = video.children[0];
        let parent = video;
        parent.style.height = "80%";
        let helper = document.createElement('div');
        helper.innerHTML = categoryClassStr;
        while (helper.firstChild) {
            parent.insertBefore(helper.firstChild, childElement);
        }

        try {
            let currentVideoID = video.querySelector("#thumbnail").getAttribute("href").split('=')[1];
            setTimeout(() => {
                chrome.runtime.sendMessage({ contentScriptFuncs: "getVideoCategory", data: { videoID: currentVideoID } }, (res) => {
                    parent.querySelector(".videoYTCat").innerText = res.category + " - " + CONST.YT_CATEGORY_ID_NAMES[res.category];
                });
            }, i * 1000);
        }
        catch (e) { }
    }


    //     if (devCategoryMode() && shouldRemoveVideo(channelName)) {
    //         video.remove();
    //         videosFilteredIndexes.push(i);
    //     }
    //     lastPrecessedVideoIndex = i;
    // }
    // console.log("lastPrecessedVideoIndex: " + lastPrecessedVideoIndex);
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
    if (user.list.TYPE === CONST.LIST_TYPE.BLACK_LIST) {
        if (channelName in user.list.LIST) {
            console.log(channelName);
            // video.querySelector('#thumbnail').remove();
            return true;
        }
    } else { // it's a white list
        if (channelName && !(channelName in user.list.LIST)) {
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