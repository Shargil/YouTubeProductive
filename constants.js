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
        ANOTHER_OPTION: "anotherOption",
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
                "Linus Tech Tips": true,
                "airrack": true,
                "MrBeast Shorts": true,
                "David Dobrik": true
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
                "Real Engineering": true
            }
        },
    },
    LIST_TYPE: LIST_TYPE,
    YT_CATEGORY_ID_NAMES: {
        1: "Film & Animation",
        2: "Autos & Vehicles",
        10: "Music",
        15: "Pets & Animals",
        17: "Sports",
        19: "Travel & Events",
        20: "Gaming",
        22: "People & Blogs",
        23: "Comedy",
        24: "Entertainment",
        25: "News & Politics",
        26: "Howto & Style",
        27: "Education",
        28: "Science & Technology",
        29: "Nonprofits & Activism"
    }
});

// --- Constants that are being used only in "service_worker"  files and/or popup.js --- 
// This way we can save up some space in Storage API.
// If we want to use something in a content script, move the const to CONST (above me)
const youTubeUrlsRegExp = [
    new RegExp("^(https:\/\/www\.youtube\.com\/)$"),
    new RegExp("^(https:\/\/www\.youtube\.com\/feed\/explore)$"),
    new RegExp("^(https:\/\/www\.youtube\.com\/feed\/subscriptions)$"),
    new RegExp("^(https:\/\/www\.youtube\.com\/feed\/library)$"),
    new RegExp("^(https:\/\/www\.youtube\.com\/playlist\?)"),
    new RegExp("^(https:\/\/www\.youtube\.com\/watch\?)")// Watching a video    
]

const youTubeRequestMoreVideosURLs = [
    "https://www.youtube.com/youtubei/v1/browse?*", // Home screen - scrolling down
    "https://www.youtube.com/youtubei/v1/next?*" // When watching a video, the suggestionCol - scrolling down
]

const watchTimeStatsUrl = [
    "https://www.youtube.com/api/stats/watchtime?*"
]