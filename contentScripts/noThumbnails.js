console.log("--- noThumbnails.js --- ");
debugger;
var thumbnails = document.querySelectorAll('ytd-thumbnail yt-img-shadow');
debugger;
if (thumbnails) {
    for (let thumbnail of thumbnails) {
        thumbnail.remove();
    }
}

var thumbnailsVideoPreview = document.querySelectorAll('ytd-thumbnail #mouseover-overlay');
if (thumbnailsVideoPreview) {
    for (let videoPreview of thumbnailsVideoPreview) {
        videoPreview.remove();
    }
}

var channelsIcon = document.querySelectorAll('#details #avatar img');
if (channelsIcon) {
    for (let icon of channelsIcon) {
        icon.remove();
    }
}