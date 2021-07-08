import { channelsList } from "./ChannelsList";
import { FOCUS_LEVEL } from "../constantsDemo"

export interface User {
    extensionMode: String;
    firstOptionsConfig: Boolean;
    myYoutube: {
        listType: String;
        list: ListItems;
        fullListsBlack: Array<channelsList>;
        fullListsWhite: Array<channelsList>;
    }
    focus: {
        focusLevel: FOCUS_LEVEL;
        sessionStartTime: string;
        blockStartTime: string;
    }
    options: {
        thumbnailsRemoved: boolean;
    }
}

export interface ListItems {
    [channelName: string]: Boolean;
}