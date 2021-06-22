import { channelsList } from "./ChannelsList";
import { FOCUS_LEVEL } from "../constantsDemo"

export interface User {
    extensionMode: String;
    listType: String;
    list: ListItems;
    fullLists: Array<channelsList>;
    firstOptionsConfig: Boolean;
    focus: {
        focusLevel: FOCUS_LEVEL;
        sessionStartTime: string;
        blockStartTime: string;
    }
}

export interface ListItems {   
    [channelName: string]: Boolean;
}