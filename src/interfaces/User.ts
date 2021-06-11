import { channelsList } from "./ChannelsList";
import { FOCUS_LEVEL } from "../constantsDemo"

export interface User {
    extensionMode: String;
    listType: String;
    list: ListItems;
    fullLists: Array<channelsList>;
    firstOptionsConfig: Boolean;
    focusLevel: FOCUS_LEVEL;
}

export interface ListItems {   
    [channelName: string]: Boolean;
}