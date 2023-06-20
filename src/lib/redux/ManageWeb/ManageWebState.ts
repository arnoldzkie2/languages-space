import { newsValue, totalNewsValue } from "./DefaultValue";
import { ManageWebState } from "./Types";

export const ManageWebInitialState: ManageWebState = {

    totalNews: totalNewsValue,
    news: [],
    selectedNews: [],
    newsSelectedID: '',
    operation: false,
    deleteWarning: false,
    targetNews: newsValue
}