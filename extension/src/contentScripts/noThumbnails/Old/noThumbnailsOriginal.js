console.log("--- noThumbnails.js --- ");
onNavigationProgressBarEnd(noThumbnails, noThumbnails);
setTimeout(noThumbnails, 250)
setTimeout(noThumbnails, 1000)

/**
 * querySelectorAll the exsiting ones right now!
 * Multiobserver on new node
 * if new node is of type/ has id/ what erver
 *      process as well
 * 
 * compare the two approces!
 */

function noThumbnails() {
    var thumbnails = document.querySelectorAll("ytd-thumbnail yt-img-shadow");
    debugger;
    if (thumbnails) {
        for (let thumbnail of thumbnails) {
            thumbnail.remove();
        }
    }

    var thumbnailsVideoPreview = document.querySelectorAll(
        "ytd-thumbnail #mouseover-overlay"
    );
    if (thumbnailsVideoPreview) {
        for (let videoPreview of thumbnailsVideoPreview) {
            videoPreview.remove();
        }
    }

    var channelsIcon = document.querySelectorAll("#details #avatar img");
    if (channelsIcon) {
        for (let icon of channelsIcon) {
            icon.remove();
        }
    }
}
