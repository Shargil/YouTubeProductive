console.log("--- searchOnly.js --- ");

// window.addEventListener('load', function () {
//     searchOnly();
// });

// function searchOnly() {
//     alert("--- searchOnly.js --- ");
//     var endScreenContent = document.getElementsByClassName("ytp-endscreen-content");
//     if (endScreenContent && endScreenContent[0])
//         endScreenContent[0].remove();

//     var contents = document.getElementById("contents");
//     if (contents) {
//         console.log(contents);
//         contents.remove();
//     }

//     var suggestionsCol = document.getElementsByTagName('ytd-watch-next-secondary-results-renderer')[0]
//     if (suggestionsCol)
//         suggestionsCol.remove();

//     var subscriptions = document.getElementsByTagName('ytd-guide-section-renderer')[1];
//     if (subscriptions && subscriptions.querySelector('yt-formatted-string').innerText === "SUBSCRIPTIONS")
//         subscriptions.remove();
// }

// let contents = document.getElementById("contents");
// if (contents) {
//     console.log(contents);
//     contents.remove();
// }
// let count = 0
// const myInterval = setInterval(() => {
//     contents = document.getElementById("contents");
//     if (contents) {
//         console.log(contents);
//         contents.remove();
//     }
//     count++;
//     if (count >= 20) {
//         clearInterval(myInterval);
//     }

// }, 500);


onNodeExist('contents', document.getElementsByTagName('body')[0], false,
    (elementNode) => {
        if (elementNode) {
            console.log("delete element: ");
            console.log(elementNode);
            elementNode.remove();
        }
    }
);

function onNodeExist(id, parent, recursive, callBack) {
    // If it's already exist
    var elementNode = document.getElementById(id);
    if (elementNode) {
        console.log("onNodeExist call found element right away")
        callBack(elementNode);
    }
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                // do things to your newly added nodes here
                let node = mutation.addedNodes[i];
                if (node.id === id) {
                    console.log("on MutationObserver found element")
                    callBack(elementNode);
                }
            }
        })
    });


    // let observer = new MutationObserver((mutations) => {
    //     var elementNode = document.getElementById(id);
    //     if (elementNode) {
    //         callBack(elementNode);
    //         // this.disconnect();
    //     }
    // });

    observer.observe(parent || document, {
        subtree: !!recursive || !parent,
        childList: true,
    });
}
