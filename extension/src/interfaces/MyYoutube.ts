import { channelsList } from "./ChannelsList";

export interface myYoutube {
    listType: String;
    list: ListItems;
    fullListsBlack: Array<channelsList>;
    fullListsWhite: Array<channelsList>;
}

export interface ListItems {
    [channelName: string]: Boolean;
}
