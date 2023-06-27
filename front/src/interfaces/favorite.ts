import { PrestationItemList } from "./prestation";

export interface Favorite {
    _id: string;
    userId: string;
    prestation: PrestationItemList;
}
