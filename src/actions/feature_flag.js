import {FETCH_FEATURE_FLAG} from "../utils/types";
import firebase from 'firebase/compat/app';
import {VALUE_KEY} from "../utils/common";


export const fetchFeatureFlagList = () => async dispatch => {

    const featureFlagRef = firebase.database().ref(`/feature_flag`);

    featureFlagRef.on(VALUE_KEY, data => {
        dispatch({
            type: FETCH_FEATURE_FLAG,
            feature_flag: data.val()
        });
    });
};