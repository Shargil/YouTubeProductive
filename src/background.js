try {
    importScripts("constants.js");
    // --- On Install ---
    chrome.runtime.onInstalled.addListener(function () {
        console.log("--- On Install ---");
        chrome.storage.sync.set({ CONST: CONST }, () => { });
        chrome.storage.sync.set({
            user: {
                extensionMode: CONST.EXTN_MODE.FILTER,
                listType: CONST.LIST_TYPE.BLACK_LIST,
                list: CONST.LISTS.DEFAULT_BLACK,
                fullLists: [],
                firstOptionsConfig: true,
                focus: {
                    focusLevel: "regular",
                    sessionStartTime: null,
                    blockStartTime: null,
                }
            }
        }, () => { });
        chrome.storage.sync.set({
            dev: {
                devMode: CONST.DEV_MODE.DEV
            }
        }, () => { });

        // // ----- Storage Local! -----
        // chrome.storage.local.set({
        //     smartTimeLimit: {
        //         sessionTimeInM: null,
        //         secondsUsed: {},
        //         blockUntil: null,
        //     }
        // }, () => { })

        chrome.runtime.openOptionsPage(() => { });
    });

    // --- On Entering YouTube (or reloading) --- 
    chrome.webNavigation.onCommitted.addListener((details) => {
        if (["reload", "link", "typed", "generated"].includes(details.transitionType) &&
            isOneOfListedYouTubeUrls(details.url)) {
            chrome.webNavigation.onCompleted.addListener(
                function onComplete() {
                    console.log("--- On Entering YouTube (or reloading) --- | transitionType: " + details.transitionType);
                    runScript("./contentScripts/sharedFunctions.js", details.tabId);

                    chrome.storage.sync.get("user", (res) => {
                        if (res.user.focus.focusLevel === "deepFocus")
                            runScript("./deepFocus.js", details.tabId);
                    })

                    runExtensionModeScript(details.tabId);
                    chrome.webNavigation.onCompleted.removeListener(onComplete);
                });
        }
    });

    // --- On YouTube Navigate to new Page (URL) With Videos Suggestions --- 
    chrome.tabs.onUpdated.addListener(
        function (tabId, changeInfo, tab) {
            if (changeInfo.url &&
                isOneOfListedYouTubeUrls(changeInfo.url)) {
                if (makeSureNotSameVideoWatchBug(changeInfo.url)) {
                    console.log("--- On YouTube Navigate To new Page With Videos Suggestions --- " + changeInfo.url);
                    runScript("./contentScripts/sharedFunctions.js", tabId);
                    runExtensionModeScript(tabId);
                }
            }
        }
    );

    // --- On YouTube Request More Videos ---
    chrome.webRequest.onCompleted.addListener( // onCompleted? onResponseStarted? just try in real time, with no debugging, black list and white list, what works better.
        details => {
            console.log("--- On YouTube Request More Videos ---" + details.url);

            chrome.storage.sync.get("user", (res) => {
                if (res.user.extensionMode === CONST.EXTN_MODE.FILTER)
                    runScript("./contentScripts/runFilterOnNewVideos.js", details.tabId)
            });
        },
        { urls: youTubeRequestMoreVideosURLs });


    // --- On YouTube Video Ends ---
    chrome.webRequest.onCompleted.addListener(
        details => {
            var url = new URL(details.url);
            // If the current time and length of the video are the same, it's the end.  
            if (url.searchParams.get("cmt") === url.searchParams.get("len")) {
                console.log("--- On YouTube Video Ends ---" + details.url);
                runScript("./contentScripts/runFilterOnVideoEnds.js", details.tabId);
            }
        },
        { urls: watchTimeStatsUrl });

    // --- On Messages ---
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.contentScriptFuncs) {
                switch (request.contentScriptFuncs) {
                    case "getMyURL":
                        sendResponse({ url: sender.tab.url });
                        break;
                    // case "reloadAllOtherYouTubeTabs":
                    //     chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
                    //         for (let tab of tabs) {
                    //             if (tab.id != sender.tab.id)
                    //                 chrome.tabs.reload(tab.id, () => { });
                    //         }
                    //     });
                    //     break;
                    case "reloadCurrYouTubeTab":
                        // TODO: This line below me can replace all other logic in reloadCurrYouTubeTab, go through it and check it
                        // chrome.tabs.reload(sender.tab.id, () => { });
                        chrome.tabs.query({ active: true, currentWindow: true, url: "*://www.youtube.com/*" }, (tabs) => {
                            if (tabs.length === 1)
                                chrome.tabs.reload(tabs[0].id, () => { });
                            else {
                                if (tabs.length >= 2)
                                    console.error("Up to 1 tab should be selected in reloadCurrYouTubeTab! If inspect elements was open when error was thrown its fine.");
                                // if it's 0 just don't refresh.
                            }
                        });
                        break;
                    // case "secondsUsed":
                    //     console.log("Tab ID: " + sender.tab.id + ", Current Second: " + request.data.currentSecondUsed)
                    //     break;
                    case "blockAllOtherYouTubeTabs":
                        chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
                            for (let tab of tabs) {
                                if (tab.id != sender.tab.id) {
                                    console.log("True ", tab.id);
                                    chrome.tabs.sendMessage(tab.id, { backgroundFuncs: "blockUI" }, (res) => {
                                    });
                                } else {
                                    console.log("False ", tab.id);
                                }
                            }
                        });
                        break;
                }
            }
            return true; // https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon second answer
        }
    );

    // --- Extra Functions ---
    function runExtensionModeScript(tabId) {
        chrome.storage.sync.get("user", (res) => {
            switch (res.user.extensionMode) {
                case CONST.EXTN_MODE.FILTER:
                    runScript('./contentScripts/filter.js', tabId);
                    break;
                case CONST.EXTN_MODE.SEARCH_ONLY:
                    runScript('./contentScripts/searchOnly.js', tabId);
                    break;
            }
        });
    }

    function runScript(scriptPath, tabId) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                files: [scriptPath]
            },
            () => { });
    }

    function isOneOfListedYouTubeUrls(url) {
        return youTubeUrlsRegExp.some(urlExpression => urlExpression.test(url));
    }


    var lastYouTubeUrl;
    function makeSureNotSameVideoWatchBug(currYTUrl) {
        if (ifVideoWatchingUrl(currYTUrl)) {

            // If same video
            if (removeChannelParam(lastYouTubeUrl) === removeChannelParam(currYTUrl)) {
                lastYouTubeUrl = currYTUrl;
                return false; // Everything horrible - Url Changed because the channel name was added or removed, ignore that change!
            }
            lastYouTubeUrl = currYTUrl;
        }
        return true; // Everything ok
    }

    function ifVideoWatchingUrl(url) {
        if (url)
            return url.indexOf("https://www.youtube.com/watch?v=") > -1
        return false;
    }

    function removeChannelParam(url) {
        if (url && url.split('&')[1] && url.split('&')[1].indexOf('ab_channel') > -1) {
            return url.split('&')[0];
        }
        return url;
    }
} catch (e) { console.error(e); }
