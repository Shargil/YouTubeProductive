onEveryChildAdded(".ytp-endscreen-content", (element) => {
    let thumbnail = element.getElementsByClassName("ytp-videowall-still-image")[0];
    if (thumbnail) thumbnail.remove();
})