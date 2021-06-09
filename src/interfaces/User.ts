import { channelsList } from "./ChannelsList";

export interface User {
    extensionMode: String;
    listType: String;
    list: ListItems;
    fullLists: Array<channelsList>;
}

export interface ListItems {   
    [channelName: string]: Boolean;
}