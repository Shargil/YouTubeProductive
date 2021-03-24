debugger;
const MODE = Object.freeze({
    DEV: "dev",
    PROD: "prod"
})
var mode = MODE.DEV;

const CHANNELS = Object.freeze({
    blackLists: {
        default: {
            "MrBeast": true,
            "Brandon Walsh": true
        },
    },
    whiteLists: {
        default: {
            "Veritasium": true,
            "Mark Rober": true,
            "colinfurze": true,
            "Kurzgesagt – In a Nutshell": true
        }
    },
});

const LIST_TYPE = Object.freeze({
    WHITE_LIST: "white_list",
    BLACK_LIST: "black_list"
})

let userChannelsList = {
    listType: LIST_TYPE.WHITE_LIST
}


// --- HomeScreen ---
const videos = document.querySelectorAll('ytd-rich-item-renderer');  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom

for (let video of videos) {
    let channelName = getChannelNameOfVideoContainer(video);

    switch (userChannelsList.listType) {
        case LIST_TYPE.BLACK_LIST:
            if (channelName in CHANNELS.blackLists.default)
                video.remove();
            break;
        case LIST_TYPE.WHITE_LIST:
            if (channelName && !(channelName in CHANNELS.whiteLists.default))
                video.remove();
            break;
    }
}

function getChannelNameOfVideoContainer(videoContainer) {
    try {
        return videoContainer.querySelector('#channel-name #container #text-container #text a').innerText;
    } catch (error) {
        if (mode === MODE.DEV) {
            console.error("getChannelNameOfVideoContainer didn't found channel name. Original Error -> " + error);
            console.error(videoContainer);
        }
        return null;
    }
}
