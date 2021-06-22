import { ISmartTimeLimit } from "../contentScripts/smartTimeLimit/smartTimeLimit";
import { User } from "./User";

interface StorageSync {
    user: User;
}

interface StorageLocal {
    smartTimeLimit: ISmartTimeLimit;
}