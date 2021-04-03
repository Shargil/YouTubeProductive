// --- Constants just for here (for self use) --- 
const LIST_TYPE = {
    WHITE_LIST: "white_list",
    BLACK_LIST: "black_list"
}

// --- Constants that are being used also in content scripts --- 
const CONST = Object.freeze({
    EXTN_MODE: {
        SEARCH_ONLY: "searchOnly",
        FILTER: "filter",
        NO_THUMBNAILS: "noThumbnails",
        OFF: "off"
    },
    DEV_MODE: {
        DEV: "dev",
        PROD: "prod"
    },
    LISTS: {
        DEFAULT_BLACK: {
            TYPE: LIST_TYPE.BLACK_LIST,
            LIST: {
                "MrBeast": true,
                "Brandon Walsh": true,
                "Jesse James West": true,
                "Fast And Furious 4K": true,
                "Easy Composites Ltd": true,
                "James Bond 007": true,
                "Movieclips": true,
                "IMPAULSIVE Clips": true,
                "Mumbo Jumbo": true,

            }
        },
        DEFAULT_WHITE: {
            TYPE: LIST_TYPE.WHITE_LIST,
            LIST: {
                "Veritasium": true,
                "Mark Rober": true,
                "colinfurze": true,
                "Kurzgesagt – In a Nutshell": true,
                "ColdFusion": true,
                "Medlife Crisis": true,
                "טופ גיק": true,
                "FitnessFAQs": true,
                "Mike Boyd": true,
                "Simone Giertz": true,
                "Calisthenicmovement": true,
                "Great Big Story": true,
                "SmarterEveryDay": true,
            }
        },
    },
    LIST_TYPE: LIST_TYPE,
});

// --- Constants that are being used only in "service_worker"  files and/or popup.js --- 
// This way we can save up some space in Storage API.
// If we want to use something in a content script, move the const to CONST (above me)
const youTubeNavigateToNewPageUrls = [
    "https://www.youtube.com/",
    "https://www.youtube.com/feed/explore",
    "https://www.youtube.com/feed/subscriptions",
    "https://www.youtube.com/watch?v*", // Watching a video    
]

const youTubeRequestMoreVideosURLs = [
    "https://www.youtube.com/youtubei/v1/browse?*", // Home screen - scrolling down
    "https://www.youtube.com/youtubei/v1/next?*" // When watching a video, the suggestionCol - scrolling down
]

const watchTimeStatsUrl = [
    "https://www.youtube.com/api/stats/watchtime?*"
]