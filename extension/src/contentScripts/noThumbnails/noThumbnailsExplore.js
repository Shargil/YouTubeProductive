onNavigationProgressBarEnd(noThumbnailsExplore, noThumbnailsExplore);

function noThumbnailsExplore() {
    onEveryChildAdded("#primary #grid-container", (element) => {
        let thumbnail = element.getElementsByTagName("yt-img-shadow")[0];
        if (thumbnail) thumbnail.remove();

        let thumbnailsVideoPreview = element.querySelector("#mouseover-overlay");
        if (thumbnailsVideoPreview) thumbnailsVideoPreview.remove();
    })
}