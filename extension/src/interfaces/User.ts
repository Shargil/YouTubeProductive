import { channelsList } from "./ChannelsList";
import { FOCUS_LEVEL } from "../constantsDemo"

export interface User {
    extensionMode: String;
    firstOptionsConfig: Boolean;
    focus: {
        focusLevel: FOCUS_LEVEL;
        sessionStartTime: string;
        blockStartTime: string;
    }
    options: {
        thumbnailsRemoved: boolean;
    }
}