onNavigationProgressBarEnd(noThumbnailsHome, noThumbnailsHome);

function noThumbnailsHome() {
    onEveryChildAdded("#primary #contents", (element) => {
        let thumbnail = element.getElementsByTagName("yt-img-shadow")[0];
        if (thumbnail) thumbnail.remove();

        let thumbnailsVideoPreview = element.querySelector("#mouseover-overlay");
        if (thumbnailsVideoPreview) thumbnailsVideoPreview.remove();

        let channelPic = element.getElementsByTagName("img")[0];
        if (channelPic) channelPic.remove();
    })
}