// --- init ---
// var CONST;
// var user;
// chrome.storage.sync.get(["CONST", "user"], (res) => {
//     CONST = Object.freeze(res.CONST);
//     user = Object.freeze(res.user);
// });

onNavigationProgressBarEnd(filterHome, filterHome);

function filterHome() {
    chrome.storage.sync.get("CONST", ({ CONST }) => {
        chrome.storage.local.get("myYoutube", ({ myYoutube }) => {
            onEveryChildAdded("#primary #contents", (element) => {
                const channelNameElement = element.getElementsByTagName("ytd-channel-name")[0]
                if (channelNameElement) {
                    const channelName = channelNameElement.innerText;
                    if (shouldRemoveVideo(channelName, myYoutube, CONST)) {
                        // console.log(element);
                        // element.remove();
                        // element.parentElement.removeChild(element);
                        // element.style.backgroundColor = "red";
                        // element.style.opacity = "0";

                        // element.textContent = "";


                        // while (element.firstChild) {
                        //     element.removeChild(element.lastChild);
                        // }
                        removeAllContentOfElement(element);

                    }
                }
            })
        });
    });
}


// console.log("")
// Call took 0.09999996423721313 milliseconds.

// console.log(el.getElementsByTagName("ytd-channel-name")[0].innerText)
// Call took 0.09999996423721313 milliseconds.

//  console.log(el.querySelector("#channel-name").innerText)
// Call took 0.19999998807907104 milliseconds.

// console.log(el.querySelectorAll("#channel-name")[0].innerText)
// Call took 0.2999999523162842 milliseconds.
// el.querySelectorAll("#channel-name")[0].innerText
// Call took 0.19999998807907104 milliseconds.