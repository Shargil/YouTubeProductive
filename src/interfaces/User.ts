import { channelsList } from "../options/MyYouTube/CollectionOfChannelsLists/ChannelsList/ChannelsList";
import { ISmartTimeLimit } from "../smartTimeLimit"

export interface User {
    extensionMode: String;
    listType: String;
    list: ListItems;
    fullLists: Array<channelsList>;
    smartTimeLimit: ISmartTimeLimit;
}

export interface ListItems {   
    [channelName: string]: Boolean;
}