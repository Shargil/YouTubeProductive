import { ISmartTimeLimit } from "../contentScripts/smartTimeLimit/smartTimeLimit";
import { myYoutube } from "./MyYoutube";
import { User } from "./User";

interface StorageSync {
    user: User;
}

interface StorageLocal {
    myYouTube: myYoutube;
}