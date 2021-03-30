var EXTN_MODE = Object.freeze({
    SEARCH_ONLY: "searchOnly",
    FILTER: "filter",
    OFF: "off"
})

const youTubeAskMoreVideosUrls = [
    "https://www.youtube.com/",
    "https://www.youtube.com/youtubei/v1/browse?*",
    "https://www.youtube.com/feed/explore",
    "https://www.youtube.com/feed/subscriptions",
    "https://www.youtube.com/watch?v*",
    "https://www.youtube.com/s/player/*/endscreen.js"
]
// End of a video request (regular watch time update that I get get from its query that its the end.)
// https://www.youtube.com/api/stats/watchtime?*
// if cmt === et



// Delete Me

// "content_scripts": [
//     {
//       "matches": ["https://*.youtube.com/", "https://*.youtube.com/watch*"],
//       "js": ["searchOnly.js"]
//     }
// ],