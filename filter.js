chrome.storage.sync.get("extensionMode", (res) => {
    if (res.extensionMode === "filter") {

        console.log("filter.js running")
        debugger;

        // move MODE stuff to storage
        let MODE = Object.freeze({
            DEV: "dev",
            PROD: "prod"
        })
        let mode = MODE.DEV;

        let CHANNELS = Object.freeze({
            blackLists: {
                default: {
                    "MrBeast": true,
                    "Brandon Walsh": true,
                    "Jesse James West": true
                },
            },
            whiteLists: {
                default: {
                    "Veritasium": true,
                    "Mark Rober": true,
                    "colinfurze": true,
                    "Kurzgesagt – In a Nutshell": true,
                    "ColdFusion": true,
                    "Medlife Crisis": true,
                    "טופ גיק": true,
                    "FitnessFAQs": true,
                    "Mike Boyd": true,

                }
            },
        });

        let LIST_TYPE = Object.freeze({
            WHITE_LIST: "white_list",
            BLACK_LIST: "black_list"
        })

        let userChannelsList = {
            listType: LIST_TYPE.BLACK_LIST
        }


        // --- HomeScreen ---
        var videos = document.querySelectorAll('ytd-rich-item-renderer');  // https://stackoverflow.com/questions/23988982/removing-htmlcollection-elements-from-the-dom

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

    }
});

