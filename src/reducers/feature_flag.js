import {FETCH_FEATURE_FLAG} from "../utils/types";

export const fetchFeatureFlag = (state = null, action) => {
    if (action.type === FETCH_FEATURE_FLAG) {
        return action.feature_flag;
    } else {
        return state;
    }
};