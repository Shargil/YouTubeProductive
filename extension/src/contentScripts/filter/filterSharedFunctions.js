function shouldRemoveVideo(channelName, user, CONST) {
    if (user.myYoutube.listType === CONST.LIST_TYPE.BLACK_LIST) {
        if (channelName in user.myYoutube.list) {
            return true;
        }
    } else { // it's a white list
        if (channelName && !(channelName in user.myYoutube.list)) {
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