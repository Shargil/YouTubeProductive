function shouldRemoveVideo(channelName, myYoutube, CONST) {
    if (myYoutube.listType === CONST.LIST_TYPE.BLACK_LIST) {
        if (channelName in myYoutube.list) {
            return true;
        }
    } else { // it's a white list
        if (channelName && !(channelName in myYoutube.list)) {
            return true;
        }
    }
    return false;
}

function removeAllContentOfElement(element) {
    element.innerHTML = "";
    element.style.width = "0px";
    element.style.height = "0px";
    element.style.margin = "0px";
    element.style.padding = "0px";
}