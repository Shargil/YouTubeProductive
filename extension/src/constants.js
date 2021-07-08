// --- Constants that are being used also in content scripts ---
const CONST = Object.freeze({
  EXTN_MODE: {
    SEARCH_ONLY: "searchOnly",
    FILTER: "filter",
    OFF: "off",
  },
  DEV_MODE: {
    DEV: "dev",
    PROD: "prod",
  },
  LIST_TYPE: {
    WHITE_LIST: "white_list",
    BLACK_LIST: "black_list",
  },
  LISTS: {
    DEFAULT_BLACK: {
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
      "David Dobrik": true,
      //   "UCX6OQ3DkcsbYNE6H8uQQuVA": true,    // MrBeast
      //   "UCagjd6FJVi3nxR3HxH7KGQw": true,    // Brandon Walsh
      //   "UCEjIjshJ8bvvCkGNk0pkYcA": true,    // Jesse James West
      //   "UCGLHa1jJ9rLcHYi4qKVsNpg": true,    // Fast And Furious 4K
      //   "user/easycompositestv": true,       // Easy Composites Ltd
      //   "user/jamesbond007": true,           // James Bond 007
      //   "user/movieclips": true,             // Movieclips
      //   "UCE9ZKI1b_PhVm3gejYuilhw": true,    // IMPAULSIVE Clips
      //   "user/ThatMumboJumbo": true,         // Mumbo Jumbo
      //   "user/LinusTechTips": true,          // Linus Tech Tips
      //   "UCyps-v4WNjWDnYRKmZ4BUGw": true,    // airrack
      //   "UC4-79UOlP48-QNGgCko5p2g": true,    // MrBeast Shorts
      //   "UCmh5gdwCx6lN7gEC20leNVA": true,    // David Dobrik

    },
    DEFAULT_WHITE: {
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
      "Real Engineering": true,

    },
  },
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
    29: "Nonprofits & Activism",
  },
});

// --- Constants that are being used only in "service_worker" files (background.js) or popup.js or options.js ---
// This way we can save up some space in Storage API.
// If we want to use something in a content script, move the const to CONST (above me)
const youTubeUrlsRegExp = [
  new RegExp("^(https://www.youtube.com/)$"),
  new RegExp("^(https://www.youtube.com/feed/explore)$"),
  new RegExp("^(https://www.youtube.com/feed/subscriptions)$"),
  new RegExp("^(https://www.youtube.com/feed/library)$"),
  new RegExp("^(https://www.youtube.com/playlist?)"),
  new RegExp("^(https://www.youtube.com/watch?)"), // Watching a video
];

const youTubeRequestMoreVideosURLs = [
  "https://www.youtube.com/youtubei/v1/browse?*", // Home screen - scrolling down
  "https://www.youtube.com/youtubei/v1/next?*", // When watching a video, the suggestionCol - scrolling down
];

const watchTimeStatsUrl = ["https://www.youtube.com/api/stats/watchtime?*"];
